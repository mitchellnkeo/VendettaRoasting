import { defineConfig } from 'sanity'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Vendetta Roasting',
  
  projectId: 'pyoyob4y',
  dataset: 'production',
  
  schema: {
    types: schemaTypes,
  },
})
