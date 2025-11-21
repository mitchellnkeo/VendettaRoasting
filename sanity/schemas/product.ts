import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'Brief description for product cards (max 500 characters)',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            accept: '.jpg,.jpeg,.png,.webp,.gif',
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'isPrimary',
              type: 'boolean',
              title: 'Primary Image',
              description: 'Set as the main product image',
              initialValue: false,
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one image is required'),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
      description: 'Regular customer price',
    }),
    defineField({
      name: 'wholesalePrice',
      title: 'Wholesale Price (USD)',
      type: 'number',
      description: 'Price for wholesale customers',
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit - unique product identifier',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Product category',
    }),
    defineField({
      name: 'weightGrams',
      title: 'Weight (grams)',
      type: 'number',
      description: 'Product weight in grams',
    }),
    defineField({
      name: 'origin',
      title: 'Origin',
      type: 'string',
      description: 'Coffee origin (e.g., Colombia, Ethiopia)',
    }),
    defineField({
      name: 'roastLevel',
      title: 'Roast Level',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'Light' },
          { title: 'Medium', value: 'Medium' },
          { title: 'Medium-Dark', value: 'Medium-Dark' },
          { title: 'Dark', value: 'Dark' },
        ],
      },
    }),
    defineField({
      name: 'flavorNotes',
      title: 'Flavor Notes',
      type: 'string',
      description: 'e.g., Chocolate, Caramel, Citrus',
    }),
    defineField({
      name: 'inventoryQuantity',
      title: 'Inventory Quantity',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
      description: 'Current stock quantity',
    }),
    defineField({
      name: 'lowStockThreshold',
      title: 'Low Stock Threshold',
      type: 'number',
      initialValue: 10,
      validation: (Rule) => Rule.min(0),
      description: 'Alert when inventory falls below this number',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Only active products will be displayed on the website',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Featured products appear prominently on the homepage',
    }),
    defineField({
      name: 'metaTitle',
      title: 'SEO Meta Title',
      type: 'string',
      description: 'Title for search engines (leave empty to use product name)',
    }),
    defineField({
      name: 'metaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 2,
      description: 'Description for search engines',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'images.0',
      active: 'isActive',
    },
    prepare({ title, subtitle, media, active }) {
      return {
        title: `${title}${!active ? ' (Inactive)' : ''}`,
        subtitle: `$${subtitle || '0.00'}`,
        media: media,
      };
    },
  },
  orderings: [
    {
      title: 'Name (A-Z)',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
    {
      title: 'Name (Z-A)',
      name: 'nameDesc',
      by: [{ field: 'name', direction: 'desc' }],
    },
    {
      title: 'Price (Low to High)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Price (High to Low)',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
});

