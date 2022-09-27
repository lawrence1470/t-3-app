import type {NextApiRequest, NextApiResponse} from 'next';
import {withAuth, WithAuthProp} from '@clerk/nextjs/api';
import {keys, head} from 'lodash-es';
import axios from 'axios';

const inviteUser = withAuth(async (req: WithAuthProp<NextApiRequest>, res: NextApiResponse) => {
  console.log(req.body, 'cats are cool');
  if (req.method === 'POST') {
    const organizationIds = keys(req.auth.claims?.orgs);
    const currentOrganizationId = head(organizationIds);
    // try {
    console.log(currentOrganizationId, '<- current org id');
    const organizationResponse = axios.post(
      `${process.env.NEXT_PUBLIC_CLERK_BASE_URL}/organizations/${currentOrganizationId}`,
      {
        headers: {Authorization: `Bearer ${process.env.CLERK_API_KEY} `},
      }
    );
  }
});

export default inviteUser;
