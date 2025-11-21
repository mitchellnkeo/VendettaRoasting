import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  // Note: Only create one about page document. Additional documents won't be used.
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main title shown in the hero section',
      initialValue: 'Our Story',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Subtitle text shown below the title in the hero section',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      description: 'Optional image for the hero section',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'howWeStartedTitle',
      title: 'How We Started Section Title',
      type: 'string',
      description: 'Title for the "How We Started" section',
      initialValue: 'How We Started',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'howWeStartedContent',
      title: 'How We Started Content',
      type: 'array',
      description: 'Paragraphs for the "How We Started" section',
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
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: 'howWeStartedImage',
      title: 'How We Started Image',
      type: 'image',
      description: 'Optional image for the "How We Started" section',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'missionTitle',
      title: 'Our Mission Section Title',
      type: 'string',
      description: 'Title for the "Our Mission" section',
      initialValue: 'Our Mission',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'missionContent',
      title: 'Our Mission Content',
      type: 'array',
      description: 'Paragraphs for the "Our Mission" section',
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
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: 'values',
      title: 'Values Section',
      type: 'array',
      description: 'Company values displayed as cards',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Value Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Value Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'icon',
              title: 'Icon Image',
              type: 'image',
              description: 'Optional icon/image for this value',
              options: {
                hotspot: true,
              },
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'icon',
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).max(6),
    }),
    defineField({
      name: 'visitUsTitle',
      title: 'Visit Us Section Title',
      type: 'string',
      description: 'Title for the "Visit Us" section',
      initialValue: 'Visit Us',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visitUsAddress',
      title: 'Visit Us Address',
      type: 'text',
      description: 'Full address (will use site settings if left empty)',
      rows: 3,
    }),
    defineField({
      name: 'visitUsHours',
      title: 'Visit Us Hours',
      type: 'text',
      description: 'Business hours (e.g., "Monday - Friday: 7:00 AM - 6:00 PM")',
      rows: 3,
    }),
    defineField({
      name: 'visitUsContact',
      title: 'Visit Us Contact Info',
      type: 'text',
      description: 'Contact information (will use site settings if left empty)',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
    prepare({ title }) {
      return {
        title: title || 'About Page',
        subtitle: 'About page content',
      };
    },
  },
});

