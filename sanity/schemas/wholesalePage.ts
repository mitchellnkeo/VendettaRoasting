import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'wholesalePage',
  title: 'Wholesale Page',
  type: 'document',
  // Note: Only create one wholesale page document. Additional documents won't be used.
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main title shown in the hero section',
      initialValue: 'Wholesale Coffee Solutions',
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
      name: 'whyPartnerTitle',
      title: 'Why Partner Section Title',
      type: 'string',
      description: 'Title for the "Why Partner With Us?" section',
      initialValue: 'Why Partner With Us?',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits',
      type: 'array',
      description: 'List of benefits/features for wholesale partners',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Benefit Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Benefit Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name (checkmark, clock, users, etc.)',
            },
          ],
          preview: {
            select: {
              title: 'title',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(10),
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
        title: title || 'Wholesale Page',
        subtitle: 'Wholesale page content',
      };
    },
  },
});

