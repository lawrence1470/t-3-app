import {createRouter} from './context';
import {z} from 'zod';
import axios from 'axios';
import * as trpc from '@trpc/server';
import {OrganizationMembershipRole} from '@clerk/backend-core/src/api/resources/Enums';
import {withAuth} from '@clerk/nextjs/api';

export const tenantRouter = createRouter()
  .mutation('create', {
    input: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    async resolve({ctx, input}) {
      return await ctx.prisma.tenant.create({data: {...input}});
    },
  })
  .mutation('invite', {
    input: z.object({
      emailAddress: z.string(),
      inviterUserId: z.string(),
      role: z.string(),
      organizationId: z.string(),
    }),
    async resolve({ctx, input}) {
      try {
        withAuth(
          await axios.post(
            `${process.env.NEXT_PUBLIC_CLERK_BASE_URL}/organizations/${input.organizationId}/invitations`,
            {
              headers: {Authorization: `Bearer ${process.env.CLERK_API_KEY} `},
              body: {
                email_address: input.emailAddress,
                inviter_user_id: input.inviterUserId,
                role: input.role,
              },
            }
          )
        );
      } catch (error) {
        console.error(error);
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Something went wrong with the invitation API`,
        });
      }
    },
  })
  .query('getAllByUser', {
    input: z.object({
      landlordId: z.string(),
    }),

    resolve({ctx, input}) {
      return ctx.prisma.property.findMany({where: {landlordId: input.landlordId}});
    },
  });
