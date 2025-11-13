import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'pyoyob4y',
    dataset: 'production'
  },
  // Removed deployment.appId to allow creating a new deployment
})
