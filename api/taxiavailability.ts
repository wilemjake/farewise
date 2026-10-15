/**
 * LTA DataMall Taxi Availability Serverless Endpoint
 * Route: GET /api/taxiavailability
 * 
 * Upstream: http://datamall2.mytransport.sg/ltaodataservice/TaxiAvailability
 * Required Header: AccountKey: <LTA_ACCOUNT_KEY>
 * Required Header: accept: application/json
 */

export default async function handler(req: any, res?: any) {
  const accountKey = process.env.LTA_ACCOUNT_KEY;

  // Handle case where AccountKey is not yet configured
  if (!accountKey || accountKey === 'YOUR_LTA_DATAMALL_ACCOUNT_KEY') {
    // Generate realistic simulated Singapore taxi coordinates around Central, Orchard, Changi, Jurong
    const fallbackResponse = {
      odataMetadata: 'http://datamall2.mytransport.sg/ltaodataservice/$metadata#TaxiAvailability',
      warning: 'LTA_ACCOUNT_KEY environment variable is not configured. Returning simulated Singapore taxi fleet coordinates.',
      value: [
        { Latitude: 1.2834, Longitude: 103.8607 }, // MBS
        { Latitude: 1.2818, Longitude: 103.8522 }, // Raffles Place
        { Latitude: 1.3040, Longitude: 103.8318 }, // Orchard
        { Latitude: 1.3005, Longitude: 103.8552 }, // Bugis
        { Latitude: 1.3553, Longitude: 103.9868 }, // Changi Airport
        { Latitude: 1.3340, Longitude: 103.7425 }, // Jurong East
        { Latitude: 1.3533, Longitude: 103.9405 }, // Tampines
        { Latitude: 1.2644, Longitude: 103.8222 }, // VivoCity
        { Latitude: 1.3695, Longitude: 103.8496 }, // Ang Mo Kio
        { Latitude: 1.4448, Longitude: 103.7690 }, // Woodlands
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
    const upstreamUrl = 'http://datamall2.mytransport.sg/ltaodataservice/TaxiAvailability';

    const response = await fetch(upstreamUrl, {
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
