import { defineConfig } from 'sanity'
import { schemas } from './src/lib/sanitySchemas'

export default defineConfig({
  name: 'vendetta-roasting-studio',
  title: 'Vendetta Roasting CMS',
  
  projectId: 'pyoyob4y',
  dataset: 'production',
  
  plugins: [],
  
  schema: {
    types: schemas
  }
})

