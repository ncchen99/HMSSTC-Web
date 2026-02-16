import { defineCollection, z } from 'astro:content';

const newsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        date: z.string(),
        excerpt: z.string().optional(),
        image: z.union([image(), z.string()]).optional(),
        category: z.enum(['news', 'announcement']).default('news'),
    }),
});

const missionsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        date: z.string(),
        status: z.enum(['active', 'retired']).default('active'),
        image: z.union([image(), z.string()]).optional(),
        excerpt: z.string().optional(),
        order: z.number().optional(),
    }),
});

const activitiesCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        date: z.string(),
        image: z.union([image(), z.string()]).optional(),
        excerpt: z.string().optional(),
    }),
});

const membersCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        name: z.string(),
        title: z.string(),
        affiliation: z.string(),
        image: z.union([image(), z.string()]).optional(),
        email: z.string().optional(),
        order: z.number().default(99),
    }),
});

export const collections = {
    news: newsCollection,
    missions: missionsCollection,
    activities: activitiesCollection,
    members: membersCollection,
};
