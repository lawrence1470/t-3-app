import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { withAuth, WithAuthProp } from "@clerk/nextjs/api";
import { keys, head } from "lodash-es";
import axios, { AxiosError } from "axios";
import { CLERK_BASE_URL } from "../../constants";


const createOrganization = withAuth(async (req: WithAuthProp<NextApiRequest>, res: NextApiResponse) => {

  console.log(req.body, "cats are cool");
  if (req.method === "POST") {
    const organizationIds = keys(req.auth.claims?.orgs);
    const currentOrganizationId = head(organizationIds);
    // try {
    console.log(currentOrganizationId, "<- current org id");
    const organizationResponse = axios.post(`${CLERK_BASE_URL}/organizations/${currentOrganizationId}`, {
      headers: { "Authorization": `Bearer ${process.env.CLERK_API_KEY} ` }
    });
  }
});

export default createOrganization;
