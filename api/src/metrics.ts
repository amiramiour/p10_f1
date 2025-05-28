// src/metrics.ts
import { Registry, collectDefaultMetrics, Counter } from 'prom-client';

export const register = new Registry();

collectDefaultMetrics({ register });

export const graphqlRequestCounter = new Counter({
  name: 'graphql_requests_total',
  help: 'Nombre de requêtes GraphQL',
  labelNames: ['operation'],
});

register.registerMetric(graphqlRequestCounter);
