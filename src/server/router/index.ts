// src/server/router/index.tsx
import {createRouter} from './context';
import superjson from 'superjson';

import {exampleRouter} from './example';
import {propertyRouter} from './Property';
import {tenantRouter} from './Tenant';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('tenant.', tenantRouter)
  .merge('property.', propertyRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
