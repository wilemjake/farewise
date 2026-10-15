import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiServerlessPlugin(): Plugin {
  return {
    name: 'serverless-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const [pathname] = req.url.split('?');
        const endpoint = pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');

        const endpoints: Record<string, string> = {
          health: './api/health.ts',
          busarrival: './api/busarrival.ts',
          taxiavailability: './api/taxiavailability.ts',
          onemap: './api/onemap.ts',
        };

        const modulePath = endpoints[endpoint];
        if (!modulePath) {
          return next();
        }

        try {
          const apiModule = await server.ssrLoadModule(modulePath);
          const handler = apiModule.default || apiModule;

          const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
          (req as any).query = Object.fromEntries(parsedUrl.searchParams.entries());

          const responseAny = res as any;
          if (!responseAny.status) {
            responseAny.status = function (code: number) {
              res.statusCode = code;
              return res;
            };
          }
          if (!responseAny.json) {
            responseAny.json = function (data: any) {
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(data));
            };
          }

          return await handler(req, res);
        } catch (err: any) {
          console.error(`Error in /api/${endpoint}:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerlessPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
