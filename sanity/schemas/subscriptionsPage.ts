import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'subscriptionsPage',
  title: 'Subscriptions Page',
  type: 'document',
  // Note: Only create one subscriptions page document. Additional documents won't be used.
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main title shown in the hero section',
      initialValue: 'Coffee Subscription Service',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Subtitle text shown below the title in the hero section',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'howItWorksTitle',
      title: 'How It Works Section Title',
      type: 'string',
      description: 'Title for the "How It Works" section',
      initialValue: 'How It Works',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'steps',
      title: 'How It Works Steps',
      type: 'array',
      description: 'Steps in the subscription process',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'stepNumber',
              title: 'Step Number',
              type: 'number',
              description: 'Step number (1, 2, 3, etc.)',
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: 'title',
              title: 'Step Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Step Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              title: 'title',
              stepNumber: 'stepNumber',
            },
            prepare({ title, stepNumber }) {
              return {
                title: `Step ${stepNumber}: ${title}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'additionalContent',
      title: 'Additional Content Sections',
      type: 'array',
      description: 'Optional additional content sections',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'content',
              title: 'Section Content',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'paragraph',
                      title: 'Paragraph',
                      type: 'text',
                      rows: 4,
                    },
                  ],
                },
              ],
            },
            {
              name: 'image',
              title: 'Section Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image',
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
    prepare({ title }) {
      return {
        title: title || 'Subscriptions Page',
        subtitle: 'Subscriptions page content',
      };
    },
  },
});

