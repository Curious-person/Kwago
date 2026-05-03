'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Globe, Clock, User, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    title: 'The Art of Intentional Digital Consumption',
    category: 'Design',
    readTime: '8 min read',
    author: 'Elena Vance',
    authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1544391682-177d4c9d3ddb?q=80&w=1200&auto=format&fit=crop',
    content: 'In an era of infinite scrolls, learning how to curate your digital environment is the ultimate form of self-care. Discover why less really is more for your focus.'
  });

  const handleSave = () => {
    // Static for now
    console.log('Updating post:', params.id, formData);
    router.push('/dashboard/author/posts');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/dashboard/author/posts')}
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Edit Post</h1>
            <p className="text-zinc-500 text-sm">Post ID: {params.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => router.push('/dashboard/author/posts')}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            <span>Update Post</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Post Title</label>
            <Input 
              placeholder="The art of..." 
              className="text-xl font-bold py-6 px-6"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Content</label>
            <textarea 
              className="w-full min-h-[400px] rounded-[32px] border border-zinc-200 bg-white p-8 text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#0066FF] transition-all resize-none"
              placeholder="Start writing your guide..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-10">
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-4">Metadata</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <Globe size={14} />
                  <label className="text-[10px] font-bold uppercase tracking-widest">Category</label>
                </div>
                <select 
                  className="w-full h-10 rounded-full border border-zinc-200 px-4 text-xs font-bold appearance-none bg-white focus:ring-2 focus:ring-[#0066FF] outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Design</option>
                  <option>Technology</option>
                  <option>Architecture</option>
                  <option>Philosophy</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <Clock size={14} />
                  <label className="text-[10px] font-bold uppercase tracking-widest">Read Time</label>
                </div>
                <Input 
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="h-10 text-xs font-bold"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-4">Media</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <ImageIcon size={14} />
                  <label className="text-[10px] font-bold uppercase tracking-widest">Featured Image</label>
                </div>
                <Input 
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="h-10 text-[10px] font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <User size={14} />
                  <label className="text-[10px] font-bold uppercase tracking-widest">Author Image</label>
                </div>
                <Input 
                  value={formData.authorImage}
                  onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
                  className="h-10 text-[10px] font-medium"
                />
              </div>
            </div>
          </section>

          <section className="bg-zinc-50 p-6 rounded-[24px] border border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">Quick Preview</h3>
            <div className="space-y-3">
              <Badge variant="secondary">{formData.category}</Badge>
              <h4 className="font-bold text-zinc-900 leading-tight line-clamp-2">{formData.title || 'Untitled Post'}</h4>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{formData.readTime}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
