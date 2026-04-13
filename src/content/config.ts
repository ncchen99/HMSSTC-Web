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
        category: z.enum(['regular', 'advisory']).default('regular'),
    }),
});

const pagesCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        addressDetail: z.string().optional(),
        contacts: z.array(
            z.object({
                name: z.string(),
                email: z.string(),
            }),
        ).optional(),
    }),
});

const imagesCollection = defineCollection({
    type: 'data',
    schema: z.object({}).passthrough(),
});

const photoSchema = z.object({
    url: z.string(),
    caption: z.string().optional(),
    captionEn: z.string().optional(),
});

const galleryCollection = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        titleEn: z.string().optional(),
        date: z.string(),
        cover: z.string().optional(),
        description: z.string().optional(),
        descriptionEn: z.string().optional(),
        order: z.number().optional(),
        photos: z.array(photoSchema).default([]),
        folders: z.array(
            z.object({
                name: z.string(),
                nameEn: z.string().optional(),
                cover: z.string().optional(),
                photos: z.array(photoSchema).default([]),
            })
        ).optional(),
    }),
});

export const collections = {
    news: newsCollection,
    missions: missionsCollection,
    activities: activitiesCollection,
    members: membersCollection,
    pages: pagesCollection,
    images: imagesCollection,
    gallery: galleryCollection,
};
