import { createRouter } from "./context";
import { z } from "zod";

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  })
  .query("seeAll", {
    async resolve() {
      return { text: "This is all" }
    },
  })
  .mutation('user', {
    // using zod schema to validate and infer input values
    input: z
      .object({
        username: z.string(),
        password: z.string(),
        email: z.string(),
      }),
    async resolve({ input, ctx }) {

      

      return true;
    },
  })
