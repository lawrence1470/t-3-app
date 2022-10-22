import {createRouter} from './context';
import {z} from 'zod';
import axios, {AxiosError} from 'axios';
import * as trpc from '@trpc/server';
import {head, keys} from 'lodash-es';
import {OrganizationInvitationJSON} from '@clerk/backend-core/src/api/resources/JSON';
import 'dotenv/config'; // To read CLERK_API_KEY
import clerk from '@clerk/clerk-sdk-node';
import {getAuth} from '@clerk/nextjs/server';

export const tenantRouter = createRouter()
  .mutation('invite', {
    input: z.object({
      emailAddress: z.string(),
    }),
    async resolve({ctx, input}) {
      const landlordId = ctx.req?.auth?.userId;
      try {
        const invitation = await clerk.invitations.createInvitation({
          emailAddress: input.emailAddress,
          publicMetadata: {
            landlordId: landlordId,
          },
          redirectUrl: 'http://localhost:3000/tenant/dashboard',
        });
        return invitation;
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

      const pendingInvitations = await clerk.organizations.getPendingOrganizationInvitationList({
        organizationId: currentOrganizationId!,
      });

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
      const orgId = ctx.req?.auth?.claims.org_id;
      const userId = ctx.req?.auth?.userId;
      //
      // const users = await clerk.organizations.getOrganizationMembershipList({
      //   organizationId: orgId!,
      // });
      //
      // const tenants = users.filter(user => user.role !== 'admin');
      //
      // // TODO use query to filter tenants
      const users = await clerk.users.getUserList({
        query: input.query,
      });

      return users;
    },
  })
  .mutation('revokeInvite', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ctx, input}) {
      try {
        const userId = ctx.req?.auth?.userId;
        const organizationIds = keys(ctx.req?.auth?.claims.orgs);
        const currentOrganizationId = head(organizationIds);
        await clerk.organizations.revokeOrganizationInvitation({
          invitationId: input.id,
          organizationId: currentOrganizationId!,
          requestingUserId: userId!,
        });
      } catch (error) {
        console.error(error);
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong`,
        });
      }
    },
  })
  .query('findAssociatedUnit', {
    async resolve({ctx, input}) {
      const userId = ctx.req?.auth?.userId;

      const unit = await ctx.prisma.unit.findUnique({where: {tenantId: userId!}});

      if (!unit) {
        return {unit: null};
      }

      return {unit};
    },
  });
