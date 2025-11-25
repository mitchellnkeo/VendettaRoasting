import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homepage',
  title: 'Homepage Content',
  type: 'document',
  // Note: Only create one homepage document. Additional documents won't be used.
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'Main title shown in the hero section',
      initialValue: 'Vendetta Roasting',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Subtitle text shown below the main title in the hero section',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      description: 'Optional background image for the hero section. If not provided, a solid color background will be used.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'heroCtaPrimary',
      title: 'Hero Primary Button Text',
      type: 'string',
      description: 'Text for the primary call-to-action button',
      initialValue: 'Shop Coffee',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroCtaSecondary',
      title: 'Hero Secondary Button Text',
      type: 'string',
      description: 'Text for the secondary call-to-action button',
      initialValue: 'Subscribe',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aboutTitle',
      title: 'About Section Title',
      type: 'string',
      description: 'Title for the "Our Story" section',
      initialValue: 'Our Story',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aboutContent',
      title: 'About Section Content',
      type: 'array',
      description: 'Paragraphs for the "Our Story" section',
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
      name: 'aboutCtaText',
      title: 'About Section Button Text',
      type: 'string',
      description: 'Text for the "Learn More" button in the about section',
      initialValue: 'Learn More',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subscriptionTitle',
      title: 'Subscription Section Title',
      type: 'string',
      description: 'Title for the subscription highlight section',
      initialValue: 'Never Run Out of Great Coffee',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subscriptionDescription',
      title: 'Subscription Section Description',
      type: 'text',
      description: 'Description text for the subscription section',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subscriptionCtaText',
      title: 'Subscription Section Button Text',
      type: 'string',
      description: 'Text for the subscription call-to-action button',
      initialValue: 'Start a Subscription',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredProductsTitle',
      title: 'Featured Products Section Title',
      type: 'string',
      description: 'Title for the featured products section',
      initialValue: 'Featured Coffees',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredProductsDescription',
      title: 'Featured Products Section Description',
      type: 'text',
      description: 'Description text shown below the featured products title',
      rows: 2,
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'array',
      description: 'Select up to 6 products to feature on the homepage',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
      validation: (Rule) => Rule.max(6).error('You can feature up to 6 products'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare() {
      return {
        title: 'Homepage Content',
        subtitle: 'Edit homepage hero, about, and subscription sections',
      };
    },
  },
});

