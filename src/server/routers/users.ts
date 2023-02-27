import { schema } from '~/libs/validation/auth';
import { router, publicProcedure } from '~/server/trpc';
import { HttpException } from '~/server/errors/exceptions';
import { RESULT_CODE } from '~/server/errors/code';
import { generateHash, generateSalt } from '~/utils/password';

export const usersRouter = router({
  create: publicProcedure
    .input(schema.signup)
    .mutation(async ({ ctx, input }) => {
      try {
        const exists = await ctx.prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });

        if (exists) {
          throw new HttpException(400, 'User already exists', {
            resultCode: RESULT_CODE.ALREADY_EXISTS,
            resultMessage: 'User already exists',
          });
        }

        const salt = generateSalt();
        const hash = generateHash(input.password, salt);

        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            password: hash,
            salt,
          },
        });

        await ctx.prisma.userProfile.create({
          data: {
            userId: user.id,
            name: input.name,
          },
        });

        return {
          userId: user.id,
        };
      } catch (error) {
        throw error;
      }
    }),
});
