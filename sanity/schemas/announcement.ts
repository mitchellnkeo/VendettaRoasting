import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Only active announcements will be displayed on the website',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Featured announcements will be more prominently displayed',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'Optional: Announcement will automatically stop showing after this date',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      active: 'isActive',
      featured: 'isFeatured',
    },
    prepare({ title, active, featured }) {
      return {
        title: title || 'Untitled',
        subtitle: `${active ? 'Active' : 'Inactive'}${featured ? ' • Featured' : ''}`,
      };
    },
  },
});

