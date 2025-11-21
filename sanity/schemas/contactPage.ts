import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  // Note: Only create one contact page document. Additional documents won't be used.
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'Main title shown in the hero section',
      initialValue: 'Contact Us',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      description: 'Subtitle text shown below the title in the hero section',
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'getInTouchTitle',
      title: 'Get in Touch Section Title',
      type: 'string',
      description: 'Title for the contact information section',
      initialValue: 'Get in Touch',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locationTitle',
      title: 'Location Label',
      type: 'string',
      description: 'Label for the location field',
      initialValue: 'Location',
    }),
    defineField({
      name: 'locationAddress',
      title: 'Location Address',
      type: 'text',
      description: 'Physical address (will use site settings if left empty)',
      rows: 2,
    }),
    defineField({
      name: 'hoursTitle',
      title: 'Hours Label',
      type: 'string',
      description: 'Label for the hours field',
      initialValue: 'Hours',
    }),
    defineField({
      name: 'hours',
      title: 'Business Hours',
      type: 'text',
      description: 'Business hours (e.g., "Monday - Friday: 7:00 AM - 6:00 PM")',
      rows: 3,
    }),
    defineField({
      name: 'contactTitle',
      title: 'Contact Label',
      type: 'string',
      description: 'Label for the contact field',
      initialValue: 'Contact',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'text',
      description: 'Contact details (will use site settings if left empty)',
      rows: 2,
    }),
    defineField({
      name: 'mapImage',
      title: 'Map Image',
      type: 'image',
      description: 'Optional map image or placeholder',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map Embed URL',
      type: 'url',
      description: 'Optional Google Maps embed URL or similar',
    }),
    defineField({
      name: 'formTitle',
      title: 'Contact Form Title',
      type: 'string',
      description: 'Title for the contact form section',
      initialValue: 'Send us a Message',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'formSuccessMessage',
      title: 'Form Success Message',
      type: 'text',
      description: 'Message shown after successful form submission',
      initialValue: "Thank you for your message! We'll get back to you soon.",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle',
    },
    prepare({ title }) {
      return {
        title: title || 'Contact Page',
        subtitle: 'Contact page content',
      };
    },
  },
});

