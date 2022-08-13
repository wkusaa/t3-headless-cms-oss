import { createRouter } from "./context";
import { z } from "zod";
import bcrypt from "bcrypt";

const hash = (password : string) => {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
}

export const registerRouter = createRouter()
    .mutation('user', {
        // using zod schema to validate and infer input values
        input: z
            .object({
                username: z.string(),
                password: z.string(),
                email: z.string(),
            }),
        async resolve({ input, ctx}) {
            
            const hashedPassword = hash(input.password);
            if(hashedPassword) {
                const user = await ctx.prisma.user.create({
                    data: {
                        username: input.username,
                        password: hashedPassword,
                        email: input.email
                    },
                });
                return user;
            }

            return false;
        },
    })
