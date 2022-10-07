import {createRouter} from './context';
import {z} from 'zod';
import * as trpc from '@trpc/server';
import {head, keys} from 'lodash-es';
import axios, {AxiosError} from 'axios';
import 'dotenv/config'; // To read CLERK_API_KEY
import clerk from '@clerk/clerk-sdk-node';

export const unitRouter = createRouter()
  .mutation('create', {
    input: z.object({
      units: z.array(
        z.object({
          unitName: z.string(),
        })
      ),
      propertyId: z.string(),
    }),
    async resolve({ctx, input}) {
      const {units} = input;

      if (units.length === 0) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Please provide some units to be created, unit list is empty`,
        });
      }

      const propertyId = input.propertyId;

      for (const unit of units) {
        try {
          const {unitName} = unit;
          await ctx.prisma.unit.create({data: {unitName, propertyId}});
        } catch (error) {
          console.error(error);
          throw new trpc.TRPCError({
            code: 'BAD_REQUEST',
            message: `Something went wrong with unit ${unit.unitName}`,
          });
        }
      }
    },
  })
  .query('getById', {
    input: z.object({
      unitId: z.string(),
    }),

    async resolve({ctx, input}) {
      const unit = await ctx.prisma.unit.findUnique({where: {id: input.unitId}});

      if (!unit) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find unit`,
        });
      }

      const tenantId = unit.tenantId;

      const tenantUser = tenantId ? await clerk.users.getUser(tenantId) : null;

      return {
        unit,
        tenant: tenantUser
          ? {
              id: tenantUser.id,
              emailAddress: tenantUser.emailAddresses[0]!.emailAddress,
            }
          : null,
      };
    },
  })
  .mutation('addUser', {
    input: z.object({
      tenantId: z.string(),
      unitId: z.string(),
    }),
    async resolve({ctx, input}) {
      const unit = await ctx.prisma.unit.findUnique({where: {id: input.unitId}});

      if (!unit) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find unit`,
        });
      }

      const unitsWithUser = await ctx.prisma.unit.findMany({where: {tenantId: input.tenantId}});

      if (unitsWithUser.length > 0) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `user already belongs to ${unitsWithUser[0]!.unitName}`,
        });
      }

      return ctx.prisma.unit.update({where: {id: input.unitId}, data: {tenantId: input.tenantId}});
    },
  })
  .query('getAllByLandlord', {
    input: z.object({
      landlordId: z.string(),
    }),

    resolve({ctx, input}) {
      return ctx.prisma.property.findMany({where: {landlordId: input.landlordId}});
    },
  })
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
  .mutation('removeTenant', {
    input: z.object({
      unitId: z.string(),
    }),
    async resolve({ctx, input}) {
      const unit = await ctx.prisma.unit.findUnique({where: {id: input.unitId}});

      if (!unit) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find unit`,
        });
      }

      return ctx.prisma.unit.update({where: {id: input.unitId}, data: {tenantId: null}});
    },
  });
