# Sanity CMS Environment Variables

Add these environment variables to your `.env.local` file for Sanity CMS integration:

## Required Variables

```bash
# Sanity Project Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

## How to Get These Values

### 1. Create a Sanity Project
1. Go to [sanity.io](https://sanity.io)
2. Sign up or log in
3. Create a new project
4. Choose a project name and dataset name

### 2. Get Project ID and Dataset
- **Project ID**: Found in your Sanity project dashboard URL or project settings
- **Dataset**: Usually "production" for live sites, "development" for testing

### 3. Generate API Token
1. Go to your Sanity project dashboard
2. Navigate to "API" section
3. Create a new token with "Editor" permissions
4. Copy the token (it starts with `sk`)

## Example Configuration

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=vendetta-roasting-2024
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=sk1234567890abcdef...
```

## Content Types Available

The CMS includes these content types:
- **Announcements** - Site-wide announcements and notifications
- **Events** - Coffee tastings, workshops, and community events
- **FAQs** - Frequently asked questions organized by category
- **Blog Posts** - Coffee knowledge, brewing guides, and company updates
- **About Content** - Company story, mission, values, and team
- **Homepage Content** - Hero sections and featured content

## Next Steps

1. Set up Sanity Studio for content management
2. Create initial content
3. Integrate dynamic content into the website
4. Test content updates and publishing workflow
