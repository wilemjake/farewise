/**
 * LTA DataMall Bus Arrival v2 Serverless Endpoint
 * Route: GET /api/busarrival?BusStopCode=17890&ServiceNo=190
 * 
 * Upstream: http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2
 * Required Header: AccountKey: <LTA_ACCOUNT_KEY>
 */

export default async function handler(req: any, res?: any) {
  // Extract query parameters from URL or req.query
  const url = new URL(req.url || '/', 'http://localhost');
  const busStopCode = req.query?.BusStopCode || url.searchParams.get('BusStopCode') || '01012';
  const serviceNo = req.query?.ServiceNo || url.searchParams.get('ServiceNo') || '';

  const accountKey = process.env.LTA_ACCOUNT_KEY;

  // Handle case where AccountKey is not yet configured
  if (!accountKey || accountKey === 'YOUR_LTA_DATAMALL_ACCOUNT_KEY') {
    const fallbackResponse = {
      odataMetadata: 'http://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv2',
      BusStopCode: busStopCode,
      warning: 'LTA_ACCOUNT_KEY environment variable is not configured. Returning simulated Singapore bus arrival data.',
      Services: [
        {
          ServiceNo: serviceNo || '190',
          Operator: 'SMRT',
          NextBus: {
            OriginCode: '44009',
            DestinationCode: '03211',
            EstimatedArrival: new Date(Date.now() + 3 * 60000).toISOString(),
            Latitude: '1.2982',
            Longitude: '103.8510',
            VisitNumber: '1',
            Load: 'SEA', // Seats Available
            Feature: 'WAB', // Wheelchair Accessible Bus
            Type: 'DD', // Double Deck
          },
          NextBus2: {
            OriginCode: '44009',
            DestinationCode: '03211',
            EstimatedArrival: new Date(Date.now() + 9 * 60000).toISOString(),
            Latitude: '1.3050',
            Longitude: '103.8420',
            VisitNumber: '1',
            Load: 'SDA', // Standing Available
            Feature: 'WAB',
            Type: 'SD', // Single Deck
          },
          NextBus3: {
            OriginCode: '44009',
            DestinationCode: '03211',
            EstimatedArrival: new Date(Date.now() + 18 * 60000).toISOString(),
            Latitude: '1.3120',
            Longitude: '103.8320',
            VisitNumber: '1',
            Load: 'LSD', // Limited Standing
            Feature: 'WAB',
            Type: 'DD',
          },
        },
      ],
    };

    if (res && typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(fallbackResponse);
    }
    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const upstreamUrl = new URL('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2');
    upstreamUrl.searchParams.set('BusStopCode', busStopCode);
    if (serviceNo) {
      upstreamUrl.searchParams.set('ServiceNo', serviceNo);
    }

    const response = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorResult = {
        error: `LTA DataMall responded with status ${response.status}`,
        details: errorText,
      };

      if (res && typeof res.status === 'function') {
        res.setHeader('Content-Type', 'application/json');
        return res.status(response.status).json(errorResult);
      }
      return new Response(JSON.stringify(errorResult), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    if (res && typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(data);
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const errPayload = {
      error: 'Failed to fetch bus arrivals from LTA DataMall',
      message: error.message || String(error),
    };

    if (res && typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json(errPayload);
    }
    return new Response(JSON.stringify(errPayload), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
