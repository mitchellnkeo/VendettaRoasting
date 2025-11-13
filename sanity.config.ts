import { defineConfig } from 'sanity'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'vendetta-roasting-test',
  title: 'Vendetta Roasting Test',
  
  projectId: 'pyoyob4y',
  dataset: 'production',
  
  schema: {
    types: schemaTypes,
  },
})
