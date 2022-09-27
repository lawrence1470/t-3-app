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
  .query('getAllByUser', {
    input: z.object({
      landlordId: z.string(),
    }),

    resolve({ctx, input}) {
      return ctx.prisma.property.findMany({where: {landlordId: input.landlordId}});
    },
  });
