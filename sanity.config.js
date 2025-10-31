import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'

export default defineConfig({
  name: 'vendetta-roasting-studio',
  title: 'Vendetta Roasting CMS',
  
  projectId: 'pyoyob4y',
  dataset: 'production',
  
  plugins: [deskTool()],
  
  schema: {
    types: [
      // Basic document type for announcements
      {
        name: 'announcement',
        title: 'Announcement',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'content',
            title: 'Content',
            type: 'text',
            rows: 4,
            validation: Rule => Rule.required()
          },
          {
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            initialValue: true
          },
          {
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString()
          }
        ]
      },
      // Basic document type for events
      {
        name: 'event',
        title: 'Event',
        type: 'document',
        fields: [
          {
            name: 'title',
            title: 'Event Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
            validation: Rule => Rule.required()
          },
          {
            name: 'date',
            title: 'Event Date',
            type: 'datetime',
            validation: Rule => Rule.required()
          },
          {
            name: 'location',
            title: 'Location',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            initialValue: true
          }
        ]
      },
      // Basic document type for FAQs
      {
        name: 'faq',
        title: 'FAQ',
        type: 'document',
        fields: [
          {
            name: 'question',
            title: 'Question',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'answer',
            title: 'Answer',
            type: 'text',
            rows: 4,
            validation: Rule => Rule.required()
          },
          {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
              list: [
                { title: 'General', value: 'general' },
                { title: 'Shipping', value: 'shipping' },
                { title: 'Subscriptions', value: 'subscriptions' },
                { title: 'Products', value: 'products' }
              ]
            },
            initialValue: 'general'
          },
          {
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            initialValue: true
          }
        ]
      }
    ]
  }
})
