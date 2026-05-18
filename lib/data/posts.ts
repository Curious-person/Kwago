// lib/data/posts.ts
// Centralised mock post data.
// Replace the contents of each array item with a real Supabase fetch
// when the database layer is ready — the shape must stay identical to Post.

import { Post } from '@/types/post';

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'The Art of Intentional Digital Consumption',
    category: 'Design',
    date: 'Oct 24, 2024',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop',
    author: 'Elena Vance',
    authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    readTime: '8 min read',
    status: 'Published',
    blocks: [
      {
        id: 'b1',
        type: 'subtitle',
        content:
          'In an era of infinite scrolls, learning how to curate your digital environment is the ultimate form of self-care. Discover why less really is more for your focus.',
      },
      { id: 'b2', type: 'headline', content: 'The Infinite Scroll Problem' },
      {
        id: 'b3',
        type: 'body',
        content:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      {
        id: 'b4',
        type: 'quote',
        content: 'The ability to stay focused will be the superpower of the 21st century.',
      },
      {
        id: 'b5',
        type: 'body',
        content:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      },
    ],
  },
  {
    id: '2',
    title: 'Finding Silence in Architecture',
    category: 'Architecture',
    date: 'Oct 21, 2024',
    image: 'https://images.unsplash.com/photo-1518005020250-685949320299?q=80&w=800&auto=format&fit=crop',
    author: 'Elena Vance',
    authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    readTime: '6 min read',
    status: 'Published',
    blocks: [
      {
        id: 'b1',
        type: 'subtitle',
        content: 'Exploring how physical environments shape our mental clarity and foster deep reflection.',
      },
      { id: 'b2', type: 'headline', content: 'Designing for Silence' },
      {
        id: 'b3',
        type: 'body',
        content:
          'Architecture is not just about spaces, but how we experience stillness within them. Minimalist designs utilize natural light and raw materials to evoke quietude.',
      },
      { id: 'b4', type: 'quote', content: 'Silence is a source of great strength.' },
      {
        id: 'b5',
        type: 'body',
        content:
          'When we strip away the decorative noise, we allow the spatial boundaries to speak directly to our sense of focus and calm.',
      },
    ],
  },
  {
    id: '3',
    title: 'The Future of Calm UI',
    category: 'Technology',
    date: 'Oct 19, 2024',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
    author: 'Elena Vance',
    authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    readTime: '5 min read',
    status: 'Draft',
    blocks: [
      {
        id: 'b1',
        type: 'subtitle',
        content: 'How design systems are pivoting from engagement hacking to respecting user attention.',
      },
      { id: 'b2', type: 'headline', content: 'Designing Respectful Interfaces' },
      {
        id: 'b3',
        type: 'body',
        content:
          "The next generation of user interfaces won't fight for your attention. Calm technology integrates seamlessly into the background, providing information only when needed.",
      },
      {
        id: 'b4',
        type: 'quote',
        content: 'Technology should be like a gentle breeze: felt, but not seen.',
      },
      {
        id: 'b5',
        type: 'body',
        content:
          'By reducing cognitive load and limiting non-essential notifications, we create digital spaces where users can focus on what truly matters.',
      },
    ],
  },
];
