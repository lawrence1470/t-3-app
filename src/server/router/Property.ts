import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";


export const propertyRouter = createRouter()
  .mutation("create", {
    input: z
      .object({
        nickname: z.string()
      }),
    async resolve({ input }) {
      return await prisma.property.create({ data: { ...input } });
    }
  })
  .query("testAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany({ take: 10 });
    }
  });
