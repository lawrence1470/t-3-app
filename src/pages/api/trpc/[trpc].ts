// src/pages/api/trpc/[trpc].ts
import {createNextApiHandler} from '@trpc/server/adapters/next';
import {appRouter} from '../../../server/router';
import {createContext} from '../../../server/router/context';
import {withAuth} from '@clerk/nextjs/api';
import {WithAuthProp} from '@clerk/clerk-sdk-node';
import {NextApiRequest, NextApiResponse} from 'next';

// export API handler
// TODO can i use withClerkMiddleware for this?

declare type NextApiHandlerWithAuth<T = any> = (
  req: WithAuthProp<NextApiRequest>,
  res: NextApiResponse<T>
) => void | Promise<void>;

const handler = createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  batching: {
    enabled: true,
  },
}) as NextApiHandlerWithAuth;
// TODO get rid of the " as nextAPI..."

export default withAuth(handler as any);
