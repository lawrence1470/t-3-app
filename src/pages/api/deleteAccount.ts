import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { withAuth, WithAuthProp } from "@clerk/nextjs/api";
import { keys, head } from "lodash-es";
import axios, { AxiosError } from "axios";
import { CLERK_BASE_URL } from "../../constants";

const deleteAccount = withAuth(async (req: WithAuthProp<NextApiRequest>, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    const organizationIds = keys(req.auth.claims?.orgs);
    const currentOrganizationId = head(organizationIds);
    const sessionToken = req.auth.sessionId;
    try {
      const deleteResponse = axios.delete(`${CLERK_BASE_URL}/organizations/${currentOrganizationId}`, {
        headers: { "Authorization": sessionToken! }
      });
      // return res.status(200).json({ test: "test" });
    } catch (error) {
// TODO not sure if i go inside this catch block
      console.error(error, "cats")

      if (axios.isAxiosError(error)) {
        const errorMessage = error.message;
      }
      return res.status(500).json({ error: error });
    }
  }
  return res.status(405).json({ error: "Method not allowed" });
});

export default deleteAccount;
