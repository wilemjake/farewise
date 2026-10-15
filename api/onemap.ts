/**
 * OneMap Singapore Address & Geocoding Serverless Endpoint
 * Route: GET /api/onemap?searchVal=178903&returnGeom=Y&getAddrDetails=Y&pageNum=1
 * 
 * Upstream: https://www.onemap.gov.sg/api/common/elastic/search
 */

export default async function handler(req: any, res?: any) {
  const url = new URL(req.url || '/', 'http://localhost');
  const searchVal = req.query?.searchVal || url.searchParams.get('searchVal') || '178903';
  const returnGeom = req.query?.returnGeom || url.searchParams.get('returnGeom') || 'Y';
  const getAddrDetails = req.query?.getAddrDetails || url.searchParams.get('getAddrDetails') || 'Y';
  const pageNum = req.query?.pageNum || url.searchParams.get('pageNum') || '1';

  try {
    const upstreamUrl = new URL('https://www.onemap.gov.sg/api/common/elastic/search');
    upstreamUrl.searchParams.set('searchVal', searchVal);
    upstreamUrl.searchParams.set('returnGeom', returnGeom);
    upstreamUrl.searchParams.set('getAddrDetails', getAddrDetails);
    upstreamUrl.searchParams.set('pageNum', pageNum);

    const headers: Record<string, string> = {
      accept: 'application/json',
      'User-Agent': 'FareWise-Singapore-Aggregator/1.0',
    };

    // If an optional OneMap token/key is provided in environment variables, attach it
    const onemapKey = process.env.ONEMAP_API_KEY || process.env.ONEMAP_TOKEN;
    if (onemapKey && onemapKey !== 'YOUR_ONEMAP_API_KEY') {
      headers['Authorization'] = onemapKey.startsWith('Bearer ') ? onemapKey : `Bearer ${onemapKey}`;
    }

    const response = await fetch(upstreamUrl.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorResult = {
        error: `OneMap API responded with status ${response.status}`,
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
      error: 'Failed to query OneMap Singapore API',
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
