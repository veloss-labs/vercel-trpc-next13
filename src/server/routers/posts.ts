import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { schema } from '~/libs/validation/post';
import { schema as commonSchema } from '~/libs/validation/list';
import { UserSchema } from '~/server-rsc/getSession';
import { router, privateProcedure, publicProcedure } from '~/server/trpc';

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  title: true,
  content: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          name: true,
          bio: true,
          image: true,
        },
      },
    },
  },
});

export const postsRouter = router({
  list: publicProcedure
    .input(commonSchema.list)
    .query(async ({ input, ctx }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */
      const limit = input.limit ?? 20;
      const cursor = input.cursor ?? input.initialCursor;

      const items = await ctx.prisma.post.findMany({
        select: defaultPostSelect,
        take: limit + 1,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lastItem = items.pop()!;
        nextCursor = lastItem.id;
      }

      return {
        items: items,
        nextCursor,
      };
    }),
  byId: publicProcedure.input(schema.byId).query(async ({ ctx, input }) => {
    const { id } = input;
    const post = await ctx.prisma.post.findUnique({
      where: { id },
      select: defaultPostSelect,
    });
    if (!post) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Post with ID ${id} not found`,
      });
    }

    return post;
  }),
  create: privateProcedure
    .input(schema.edit)
    .mutation(async ({ ctx, input }) => {
      try {
        const session = ctx.session as UserSchema;
        const post = await ctx.prisma.post.create({
          data: {
            title: input.title,
            content: input.content,
            published: input.published,
            userId: session.id,
          },
        });

        return {
          postId: post.id,
        };
      } catch (error) {
        throw error;
      }
    }),
  update: privateProcedure
    .input(schema.update)
    .mutation(async ({ ctx, input }) => {
      try {
        const post = await ctx.prisma.post.update({
          where: { id: input.postId },
          data: {
            title: input.title,
            content: input.content,
            published: input.published,
          },
        });

        return {
          postId: post.id,
        };
      } catch (error) {
        throw error;
      }
    }),
  delete: privateProcedure
    .input(schema.byId)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input;
        const post = await ctx.prisma.post.delete({
          where: { id },
        });

        return {
          postId: post.id,
        };
      } catch (error) {
        throw error;
      }
    }),
  personalList: privateProcedure
    .input(commonSchema.list)
    .query(async ({ input, ctx }) => {
      /**
       * For pagination docs you can have a look here
       * @see https://trpc.io/docs/useInfiniteQuery
       * @see https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */
      const limit = input.limit ?? 20;
      const cursor = input.cursor ?? input.initialCursor;
      const session = ctx.session as UserSchema;

      const items = await ctx.prisma.post.findMany({
        select: defaultPostSelect,
        take: limit + 1,
        where: {
          userId: session.id,
        },
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      let nextCursor: string | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lastItem = items.pop()!;
        nextCursor = lastItem.id;
      }

      return {
        items: items,
        nextCursor,
      };
    }),
});
