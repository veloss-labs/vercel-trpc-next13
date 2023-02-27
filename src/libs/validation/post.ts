import * as z from 'zod';

export const schema = {
  byId: z.object({
    id: z.string(),
  }),
  edit: z.object({
    title: z.string().min(3).max(128),
    content: z.any(),
    published: z.boolean().optional(),
  }),
  update: z.object({
    postId: z.string(),
    title: z.string().min(3).max(128),
    content: z.any(),
    published: z.boolean().optional(),
  }),
};

export type EditData = z.infer<typeof schema.edit>;
