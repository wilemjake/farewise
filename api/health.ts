/**
 * Health check endpoint for FareWise Serverless API Gateway
 * Route: GET /api/health
 */

export default async function handler(req: any, res?: any) {
  const healthData = {
    status: 'ok',
    service: 'FareWise Serverless API Gateway',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: {
      ltaConfigured: Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY !== 'YOUR_LTA_DATAMALL_ACCOUNT_KEY'),
      oneMapConfigured: Boolean(process.env.ONEMAP_API_KEY && process.env.ONEMAP_API_KEY !== 'YOUR_ONEMAP_API_KEY'),
    },
    supportedEndpoints: [
      '/api/health',
      '/api/busarrival?BusStopCode=17890&ServiceNo=190',
      '/api/taxiavailability',
      '/api/onemap?searchVal=178903&returnGeom=Y&getAddrDetails=Y',
    ],
  };

  if (res && typeof res.status === 'function') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(healthData);
  }

  return new Response(JSON.stringify(healthData), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
