// src/metricsServer.ts
import http from 'http';
import { register } from './metrics';

export function startMetricsServer(port = 9100) {
  http
    .createServer(async (req, res) => {
      if (req.url === '/metrics') {
        res.setHeader('Content-Type', register.contentType);
        res.end(await register.metrics());
      } else {
        res.statusCode = 404;
        res.end('Not found');
      }
    })
    .listen(port, () => {
      console.log(`Prometheus metrics available at http://localhost:${port}/metrics`);
    });
}
