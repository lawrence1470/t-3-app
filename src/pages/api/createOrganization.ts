import type {NextApiRequest, NextApiResponse} from 'next';
import {prisma} from '../../server/db/client';
import {withAuth, WithAuthProp} from '@clerk/nextjs/api';
import {keys, head} from 'lodash-es';
import axios, {AxiosError} from 'axios';

const createOrganization = withAuth(async (req: WithAuthProp<NextApiRequest>, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const organizationIds = keys(req.auth.claims?.orgs);
    const currentOrganizationId = head(organizationIds);
    // try {
    const organizationResponse = axios.post(
      `${process.env.NEXT_PUBLIC_CLERK_BASE_URL}/organizations/${currentOrganizationId}`,
      {
        headers: {Authorization: `Bearer ${process.env.CLERK_API_KEY} `},
      }
    );
  }
});

export default createOrganization;
