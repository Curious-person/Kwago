import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface PostCardProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

export const PostCard: React.FC<PostCardProps> = ({ title, excerpt, category, date, image }) => {
  return (
    <article className="group cursor-pointer">
      <Link href={`/blog/${title.toLowerCase().replace(/ /g, '-')}`} className="block">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-zinc-100 transition-all duration-300">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="flex flex-col items-start gap-3">
        <Badge>{category}</Badge>
        <Link href={`/blog/${title.toLowerCase().replace(/ /g, '-')}`}>
          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-[#0066FF] transition-colors leading-snug">
            {title}
          </h3>
        </Link>
        <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
          {excerpt}
        </p>
        
        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">
          <Calendar size={12} className="opacity-70" />
          {date}
        </div>
      </div>
    </article>
  );
};
