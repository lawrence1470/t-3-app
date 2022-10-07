import {createRouter} from './context';
import {z} from 'zod';
import axios, {AxiosError} from 'axios';
import * as trpc from '@trpc/server';
import {head, keys} from 'lodash-es';
import {OrganizationInvitationJSON} from '@clerk/backend-core/src/api/resources/JSON';
import 'dotenv/config'; // To read CLERK_API_KEY
import clerk from '@clerk/clerk-sdk-node';

export const tenantRouter = createRouter()
  .mutation('invite', {
    input: z.object({
      emailAddress: z.string(),
    }),
    async resolve({ctx, input}) {
      try {
        const userId = ctx.req?.auth?.userId;
        const organizationIds = keys(ctx.req?.auth?.claims.orgs);
        const currentOrganizationId = head(organizationIds);
        await axios.post(
          `${process.env.NEXT_PUBLIC_CLERK_BASE_URL}/organizations/${currentOrganizationId}/invitations`,
          {
            email_address: input.emailAddress,
            inviter_user_id: userId,
            role: 'basic_member',
          },
          {
            headers: {Authorization: `Bearer ${process.env.CLERK_API_KEY}`},
          }
        );
      } catch (error) {
        const axiosError = error as AxiosError;
        const statusCode = axiosError.response?.status;
        if (statusCode === 400) {
          throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: `An invitation has already been sent to that email`,
          });
        }
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `${axiosError.message}`,
        });
      }
    },
  })
  .query('getAllInvitations', {
    async resolve({ctx, input}) {
      const organizationIds = keys(ctx.req?.auth?.claims.orgs);
      const currentOrganizationId = head(organizationIds);

      const pendingInvitationsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_CLERK_BASE_URL}/organizations/${currentOrganizationId}/invitations/pending`,
        {
          headers: {Authorization: `Bearer ${process.env.CLERK_API_KEY}`},
        }
      );

      const pendingInvitations: OrganizationInvitationJSON[] = pendingInvitationsResponse.data.data;

      const members = await axios.get(`${process.env.NEXT_PUBLIC_CLERK_BASE_URL}/users`, {
        headers: {Authorization: `Bearer ${process.env.CLERK_API_KEY}`},
      });

      return {pendingInvitations, tenants: []};
    },
  })
  .mutation('findByQuery', {
    input: z.object({
      query: z.string(),
    }),
    async resolve({ctx, input}) {
      const userList = await clerk.users.getUserList({
        query: input.query,
      });

      return userList;
    },
  })
  .mutation('revokeInvite', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ctx, input}) {
      try {
        await clerk.invitations.revokeInvitation(input.id);
      } catch (error) {
        console.error(error);
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong`,
        });
      }
    },
  });
