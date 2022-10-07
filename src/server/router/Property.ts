import {createRouter} from './context';
import {z} from 'zod';
import * as trpc from '@trpc/server';

export const propertyRouter = createRouter()
  .mutation('create', {
    input: z.object({
      nickname: z.string(),
      landlordId: z.string(),
      streetAddress: z.string(),
      zip: z.string(),
      city: z.string(),
      state: z.string(),
    }),
    async resolve({ctx, input}) {
      const nicknames = await ctx.prisma.property.findMany({where: {nickname: input.nickname}});
      if (nicknames.length >= 1) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `There is already another property named ${input.nickname}`,
        });
      }

      return await ctx.prisma.property.create({data: {...input}});
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
  .query('getPropertyById', {
    input: z.object({
      propertyId: z.string(),
    }),

    async resolve({ctx, input}) {
      const property = ctx.prisma.property.findUnique({where: {id: input.propertyId}, include: {units: true}});

      if (!property) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: `Could not find property`,
        });
      }

      return property;
    },
  });
