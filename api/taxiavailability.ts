/**
 * LTA DataMall Taxi Availability Serverless Endpoint
 * Route: GET /api/taxiavailability
 * 
 * Upstream: http://datamall2.mytransport.sg/ltaodataservice/TaxiAvailability
 * Metadata: http://datamall2.mytransport.sg/ltaodataservice/$metadata#TaxiAvailability
 * 
 * Required Upstream Headers:
 * - AccountKey: <LTA_ACCOUNT_KEY>
 * - accept: application/json
 */

export default async function handler(req: any, res?: any) {
  const url = new URL(req.url || '/', 'http://localhost');
  const wantsMetadata = url.searchParams.get('$metadata') === 'true' || url.searchParams.get('metadata') === 'true';

  const accountKey = process.env.LTA_ACCOUNT_KEY;

  // Handle case when LTA AccountKey is not yet set in environment variables
  if (!accountKey || accountKey === 'YOUR_LTA_DATAMALL_ACCOUNT_KEY') {
    const fallbackResponse = {
      odataMetadata: 'http://datamall2.mytransport.sg/ltaodataservice/$metadata#TaxiAvailability',
      warning: 'LTA_ACCOUNT_KEY is not yet configured in environment variables. Returning simulated Singapore taxi availability data.',
      timestamp: new Date().toISOString(),
      value: [
        { Latitude: 1.2834, Longitude: 103.8607 }, // Marina Bay Sands
        { Latitude: 1.2818, Longitude: 103.8522 }, // Raffles Place / CBD
        { Latitude: 1.3040, Longitude: 103.8318 }, // Orchard Road
        { Latitude: 1.3005, Longitude: 103.8552 }, // Bugis Junction
        { Latitude: 1.3553, Longitude: 103.9868 }, // Changi Airport T3
        { Latitude: 1.3340, Longitude: 103.7425 }, // Jurong East
        { Latitude: 1.3533, Longitude: 103.9405 }, // Our Tampines Hub
        { Latitude: 1.2644, Longitude: 103.8222 }, // VivoCity / HarbourFront
        { Latitude: 1.3695, Longitude: 103.8496 }, // Ang Mo Kio Central
        { Latitude: 1.4448, Longitude: 103.7690 }, // Woodlands Checkpoint
      ],
      totalAvailable: 10,
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
    const targetUrl = wantsMetadata
      ? 'http://datamall2.mytransport.sg/ltaodataservice/$metadata'
      : 'http://datamall2.mytransport.sg/ltaodataservice/TaxiAvailability';

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorResult = {
        error: `LTA DataMall TaxiAvailability responded with status ${response.status}`,
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

    const contentType = response.headers.get('content-type') || '';
    let resultPayload: any;

    if (contentType.includes('application/json')) {
      resultPayload = await response.json();
    } else {
      const textData = await response.text();
      resultPayload = {
        odataMetadata: 'http://datamall2.mytransport.sg/ltaodataservice/$metadata#TaxiAvailability',
        raw: textData,
      };
    }

    if (res && typeof res.status === 'function') {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(resultPayload);
    }
    return new Response(JSON.stringify(resultPayload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    const errPayload = {
      error: 'Failed to fetch taxi availability from LTA DataMall',
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
