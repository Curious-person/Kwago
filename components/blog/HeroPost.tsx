import React from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import Link from "next/link";

interface HeroPostProps {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorImage: string;
}

export const HeroPost: React.FC<HeroPostProps> = ({
  title,
  excerpt,
  slug,
  date,
  readTime,
  image,
  author,
  authorImage,
}) => {
  return (
    <section className="grid lg:grid-cols-2 gap-12 px-8 py-16 items-center">
      <Link
        href={`/blog/${slug}`}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden block group"
      >
        <Image src={image} alt={title} fill className="object-cover" />
      </Link>

      <div className="flex flex-col items-start gap-6">
        <Badge variant="featured">Featured</Badge>
        <Link href={`/blog/${slug}`}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.1] hover:text-[#0066FF] transition-colors cursor-pointer">
            {title}
          </h1>
        </Link>
        <p className="text-zinc-500 text-lg leading-relaxed max-w-lg">
          {excerpt}
        </p>

        <div className="flex items-center gap-4 mt-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 relative">
            <Image
              src={authorImage}
              alt={author}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-bold text-zinc-900">{author}</p>
            <p className="text-zinc-400 font-medium">
              {date} • {readTime}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
