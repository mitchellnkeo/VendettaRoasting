import { defineConfig } from 'sanity'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'vendetta-roasting',
  title: 'Vendetta Roasting CMS',
  
  projectId: 'pyoyob4y',
  dataset: 'production',
  
  basePath: '/studio',
  
  schema: {
    types: schemaTypes,
  },
})
