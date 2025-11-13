import { defineType } from 'sanity'

export const testType = defineType({
  name: 'test',
  title: 'Test',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
    },
  ],
})
