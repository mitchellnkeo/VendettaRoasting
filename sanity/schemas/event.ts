import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event Date & Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      description: 'Full address for the event location',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Event price in USD (leave empty if free)',
    }),
    defineField({
      name: 'maxAttendees',
      title: 'Max Attendees',
      type: 'number',
      description: 'Maximum number of attendees (leave empty if unlimited)',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Only active events will be displayed on the website',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'eventDate',
      location: 'location',
      active: 'isActive',
    },
    prepare({ title, date, location, active }) {
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date';
      return {
        title: title || 'Untitled',
        subtitle: `${formattedDate} • ${location || 'No location'}${active ? '' : ' • Inactive'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Event Date, Newest',
      name: 'eventDateDesc',
      by: [{ field: 'eventDate', direction: 'desc' }],
    },
    {
      title: 'Event Date, Oldest',
      name: 'eventDateAsc',
      by: [{ field: 'eventDate', direction: 'asc' }],
    },
  ],
});

