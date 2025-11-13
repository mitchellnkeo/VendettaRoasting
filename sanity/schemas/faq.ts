import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Shipping', value: 'shipping' },
          { title: 'Subscriptions', value: 'subscriptions' },
          { title: 'Products', value: 'products' },
          { title: 'Returns', value: 'returns' },
          { title: 'Account', value: 'account' },
        ],
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first. Leave empty to use default ordering.',
      initialValue: 0,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Only active FAQs will be displayed on the website',
    }),
  ],
  preview: {
    select: {
      question: 'question',
      category: 'category',
      active: 'isActive',
    },
    prepare({ question, category, active }) {
      return {
        title: question || 'Untitled Question',
        subtitle: `${category || 'general'}${active ? '' : ' • Inactive'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
});

