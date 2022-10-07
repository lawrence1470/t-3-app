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
  .mutation('addToUnit', {
    input: z.object({
      id: z.string(),
      unitId: z.string(),
    }),
    async resolve({ctx, input}) {
      const user = await clerk.users.getUser(input.id);

      const unit = await ctx.prisma.unit.findUnique({where: {id: input.unitId}});

      // TODO check if there are any other users with this unitID

      if (!unit) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find unit`,
        });
      }

      if (user.publicMetadata.unitId) {
        const currentUnit = await ctx.prisma.unit.findUnique({where: {id: input.unitId}});

        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `This user already is part of another unit, part of unit ${currentUnit!.unitName}`,
        });
      }
      await clerk.users.updateUser(input.id, {
        publicMetadata: {
          unitId: input.unitId,
          propertyId: unit.propertyId,
        },
      });

      await clerk.emails.createEmail({
        fromEmailName: 'lawrence.nicastro1@gmail.com',
        subject: "You've been added to a unit!",
        body: "Hello user you have been added to one of lawrence's units for testing purposes",
        emailAddressId: user.primaryEmailAddressId!, // TODO assume there is always a email id,
      });
    },
  })
  .mutation('removeFromUnit', {
    input: z.object({
      id: z.string(),
      unitId: z.string(),
    }),
    async resolve({ctx, input}) {
      const user = await clerk.users.getUser(input.id);

      const unit = await ctx.prisma.unit.findUnique({where: {id: input.unitId}});

      if (!unit) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find unit`,
        });
      }

      if (user.publicMetadata.unitId !== input.unitId) {
        const currentUnit = await ctx.prisma.unit.findUnique({where: {id: user.publicMetadata.unitId as string}});

        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `This user already is part of another unit, part of unit ${currentUnit!.unitName}`,
        });
      }

      await clerk.users.updateUser(input.id, {
        publicMetadata: {
          unitId: input.unitId,
          propertyId: unit.propertyId,
        },
      });

      await clerk.emails.createEmail({
        fromEmailName: 'lawrence.nicastro1@gmail.com',
        subject: "You've been added to a unit!",
        body: "Hello user you have been added to one of lawrence's units for testing purposes",
        emailAddressId: user.primaryEmailAddressId!, // TODO assume there is always a email id,
      });
    },
  });
