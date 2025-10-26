import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'pyoyob4y',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03', // Use current date (YYYY-MM-DD) to target the latest API version
  useCdn: process.env.NODE_ENV === 'production', // Use CDN for production
  token: process.env.SANITY_API_TOKEN, // Optional, for private datasets
}

// Create Sanity client
export const sanityClient = createClient(sanityConfig)

// Image URL builder
const builder = imageUrlBuilder(sanityClient)
export const urlFor = (source: any) => builder.image(source)

// Content types/queries
export const QUERIES = {
  // Announcements
  ANNOUNCEMENTS: `*[_type == "announcement" && isActive == true] | order(publishedAt desc)`,
  ANNOUNCEMENT_BY_SLUG: `*[_type == "announcement" && slug.current == $slug][0]`,
  
  // Events
  EVENTS: `*[_type == "event" && date >= now()] | order(date asc)`,
  EVENT_BY_SLUG: `*[_type == "event" && slug.current == $slug][0]`,
  UPCOMING_EVENTS: `*[_type == "event" && date >= now()] | order(date asc) [0...3]`,
  
  // FAQs
  FAQS: `*[_type == "faq"] | order(order asc)`,
  
  // Blog Posts
  BLOG_POSTS: `*[_type == "blogPost"] | order(publishedAt desc)`,
  BLOG_POST_BY_SLUG: `*[_type == "blogPost" && slug.current == $slug][0]`,
  FEATURED_BLOG_POSTS: `*[_type == "blogPost" && isFeatured == true] | order(publishedAt desc) [0...3]`,
  
  // About content
  ABOUT_CONTENT: `*[_type == "aboutContent"][0]`,
  
  // Homepage content
  HOMEPAGE_CONTENT: `*[_type == "homepageContent"][0]`,
}

// Helper functions
export const getAnnouncements = async () => {
  try {
    const announcements = await sanityClient.fetch(QUERIES.ANNOUNCEMENTS)
    return announcements
  } catch (error) {
    console.error('Error fetching announcements:', error)
    return []
  }
}

export const getEvents = async () => {
  try {
    const events = await sanityClient.fetch(QUERIES.EVENTS)
    return events
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export const getUpcomingEvents = async () => {
  try {
    const events = await sanityClient.fetch(QUERIES.UPCOMING_EVENTS)
    return events
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    return []
  }
}

export const getFAQs = async () => {
  try {
    const faqs = await sanityClient.fetch(QUERIES.FAQS)
    return faqs
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
}

export const getBlogPosts = async () => {
  try {
    const posts = await sanityClient.fetch(QUERIES.BLOG_POSTS)
    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export const getAboutContent = async () => {
  try {
    const content = await sanityClient.fetch(QUERIES.ABOUT_CONTENT)
    return content
  } catch (error) {
    console.error('Error fetching about content:', error)
    return null
  }
}

export const getHomepageContent = async () => {
  try {
    const content = await sanityClient.fetch(QUERIES.HOMEPAGE_CONTENT)
    return content
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return null
  }
}
