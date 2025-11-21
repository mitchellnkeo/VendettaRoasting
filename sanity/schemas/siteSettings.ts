import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Note: Only create one site settings document. This is for global site configuration.
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'Main site title (used in SEO and browser tabs)',
      initialValue: 'Vendetta Roasting',
      validation: (Rule) => Rule.required(),
    }),
    
    // Footer Address Section
    defineField({
      name: 'footerAddress',
      title: 'Footer Address',
      type: 'object',
      description: 'Contact information displayed in the footer',
      fields: [
        defineField({
          name: 'street',
          title: 'Street Address',
          type: 'string',
          description: 'Street address (e.g., "123 Coffee Street")',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          description: 'City name',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'state',
          title: 'State',
          type: 'string',
          description: 'State abbreviation (e.g., "WA")',
          validation: (Rule) => Rule.required().max(2),
        }),
        defineField({
          name: 'zipCode',
          title: 'ZIP Code',
          type: 'string',
          description: 'ZIP or postal code',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
          description: 'Contact email address',
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          description: 'Contact phone number (e.g., "(206) 555-1234")',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // Social Media Links
    defineField({
      name: 'socialMedia',
      title: 'Social Media Links',
      type: 'object',
      description: 'Social media profile URLs displayed in the footer',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
          description: 'Full Instagram profile URL (e.g., https://instagram.com/vendettaroasting)',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
          description: 'Full Facebook page URL',
        }),
        defineField({
          name: 'twitter',
          title: 'Twitter/X URL',
          type: 'url',
          description: 'Full Twitter/X profile URL',
        }),
        defineField({
          name: 'youtube',
          title: 'YouTube URL',
          type: 'url',
          description: 'Full YouTube channel URL',
        }),
        defineField({
          name: 'tiktok',
          title: 'TikTok URL',
          type: 'url',
          description: 'Full TikTok profile URL',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Site Settings',
        subtitle: 'Global site configuration',
      };
    },
  },
});

