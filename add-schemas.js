// Script to add schemas to Sanity project
// Run this with: node add-schemas.js

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'pyoyob4y',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN // You'll need to set this
})

// Announcement schema
const announcementSchema = {
  _type: 'sanity.documentType',
  name: 'announcement',
  title: 'Announcement',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: [{ type: 'required' }]
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
      validation: [{ type: 'required' }]
    },
    {
      name: 'content',
      type: 'text',
      title: 'Content',
      rows: 4,
      validation: [{ type: 'required' }]
    },
    {
      name: 'isActive',
      type: 'boolean',
      title: 'Active',
      initialValue: true
    },
    {
      name: 'priority',
      type: 'string',
      title: 'Priority',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
          { title: 'Urgent', value: 'urgent' }
        ]
      },
      initialValue: 'medium'
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'expiresAt',
      type: 'datetime',
      title: 'Expires At',
      description: 'Optional expiration date for the announcement'
    }
  ]
}

async function addSchemas() {
  try {
    console.log('Adding announcement schema...')
    const result = await client.create(announcementSchema)
    console.log('Schema added successfully:', result._id)
  } catch (error) {
    console.error('Error adding schema:', error)
  }
}

// Uncomment to run
// addSchemas()
