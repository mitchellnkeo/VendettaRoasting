import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';

import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'vendetta-roasting',
  title: 'Vendetta Roasting CMS',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pyoyob4y',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  
  plugins: [deskTool()],
  
  schema: {
    types: schemaTypes,
  },
});

