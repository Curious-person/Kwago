'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Globe, Clock, User, Image as ImageIcon, GripVertical, Trash2, PlusCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type BlockType = 'headline' | 'subtitle' | 'quote' | 'body';

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Design',
    readTime: '8 min read',
    author: 'Elena Vance',
    authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    image: 'https://images.unsplash.com/photo-1544391682-177d4c9d3ddb?q=80&w=1200&auto=format&fit=crop',
    content: ''
  });

  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: '1', type: 'body', content: '' }
  ]);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);

  const addBlock = (type: BlockType = 'body') => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: ''
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return;
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const updateBlockType = (id: string, type: BlockType) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, type } : b));
  };

  const handleDragStart = (index: number) => {
    setDraggedBlockIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedBlockIndex === null || draggedBlockIndex === index) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedBlockIndex];
    newBlocks.splice(draggedBlockIndex, 1);
    newBlocks.splice(index, 0, draggedBlock);
    
    setBlocks(newBlocks);
    setDraggedBlockIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedBlockIndex(null);
  };

  const handleSave = () => {
    // Serialize blocks to MDX
    const mdxContent = blocks.map(b => {
      if (b.type === 'headline') return `## ${b.content}`;
      if (b.type === 'quote') return `> ${b.content}`;
      if (b.type === 'subtitle') return `<p className="text-xl text-zinc-900 font-medium mb-8 leading-relaxed">${b.content}</p>`;
      return b.content;
    }).join('\n\n');

    console.log('Publishing post:', { ...formData, content: mdxContent });
    setIsPublishModalOpen(true);
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
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Create New Post</h1>
            <p className="text-zinc-500 text-sm">Draft your next collector&apos;s guide.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => router.push('/dashboard/author/posts')}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save size={16} />
            <span>Publish Post</span>
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

          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">Content Blocks</label>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => addBlock('body')}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#0066FF] hover:text-[#0066FF] hover:bg-[#0066FF]/5 gap-1.5"
                >
                  <PlusCircle size={14} />
                  Add Block
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div 
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "group relative flex gap-4 p-4 rounded-[24px] border border-zinc-100 bg-white transition-all hover:border-zinc-200 hover:shadow-sm",
                    draggedBlockIndex === index && "opacity-50 border-[#0066FF] border-dashed"
                  )}
                >
                  {/* Drag Handle */}
                  <div className="flex flex-col items-center pt-3 cursor-grab active:cursor-grabbing text-zinc-300 group-hover:text-zinc-400">
                    <GripVertical size={18} />
                  </div>

                  {/* Block Controls & Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex bg-zinc-50 p-1 rounded-full border border-zinc-100">
                        {(['headline', 'subtitle', 'quote', 'body'] as BlockType[]).map((type) => (
                          <button
                            key={type}
                            onClick={() => updateBlockType(block.id, type)}
                            className={cn(
                              "px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all",
                              block.type === type 
                                ? "bg-white text-[#0066FF] shadow-sm border border-zinc-100" 
                                : "text-zinc-400 hover:text-zinc-600"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => removeBlock(block.id)}
                        className="ml-auto p-2 text-zinc-300 hover:text-red-500 transition-colors"
                        title="Remove block"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <textarea 
                      className={cn(
                        "w-full bg-transparent focus:outline-none transition-all resize-none",
                        block.type === 'headline' && "text-2xl font-bold text-zinc-900 placeholder:text-zinc-200",
                        block.type === 'subtitle' && "text-xl font-medium text-zinc-900 placeholder:text-zinc-200",
                        block.type === 'quote' && "border-l-4 border-[#0066FF] pl-6 italic text-xl text-zinc-900 placeholder:text-zinc-200",
                        block.type === 'body' && "text-zinc-600 leading-relaxed placeholder:text-zinc-300"
                      )}
                      placeholder={`Enter ${block.type} content...`}
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      rows={block.type === 'body' ? 4 : 1}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${target.scrollHeight}px`;
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="ghost" 
              className="w-full py-8 border-2 border-dashed border-zinc-100 rounded-[24px] text-zinc-400 hover:border-[#0066FF]/20 hover:text-[#0066FF] hover:bg-[#0066FF]/5 gap-2 group transition-all"
              onClick={() => addBlock('body')}
            >
              <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold uppercase tracking-widest text-xs">Append New Content Block</span>
            </Button>
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

      <Dialog open={isPublishModalOpen} onOpenChange={setIsPublishModalOpen}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-white rounded-[32px] shadow-2xl">
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0066FF]/5 flex items-center justify-center mb-6 ring-1 ring-[#0066FF]/10">
                <Sparkles className="text-[#0066FF]" size={28} />
              </div>
              <DialogTitle className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">Submission in Progress</DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm leading-relaxed">
                Your collector&apos;s guide is being prepared for publication. Our system ensures quality through a multi-stage review process.
              </DialogDescription>
            </div>

            {/* Progress Steps */}
            <div className="space-y-8 pt-2">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-[15px] top-[16px] bottom-[-16px] w-[2px] bg-zinc-100" />
                
                <div className="space-y-10 relative">
                  {/* Step 1: AI Review */}
                  <div className="flex gap-5 group">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-[#0066FF] border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-zinc-900">AI Quality Analysis</h4>
                        <Badge variant="secondary" className="bg-[#0066FF]/5 text-[#0066FF] border-none text-[10px] px-2">Processing</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">Scanning for authenticity and formatting. This usually takes about 60 seconds.</p>
                    </div>
                  </div>

                  {/* Step 2: Admin Review */}
                  <div className="flex gap-5 group">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-zinc-100 border-4 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                      <div className="w-2 h-2 rounded-full bg-zinc-300" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h4 className="text-sm font-bold text-zinc-400">Editorial Admin Review</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">Final verification by our human curators before the guide goes live on the journal.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-zinc-50/50 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
             <Button 
               variant="ghost" 
               onClick={() => setIsPublishModalOpen(false)} 
               className="flex-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all font-bold uppercase tracking-widest text-[10px]"
             >
               Cancel Submission
             </Button>
             <Button 
               onClick={() => router.push('/dashboard/author/posts')} 
               className="flex-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-200 transition-all font-bold uppercase tracking-widest text-[10px]"
             >
               Confirm & Close
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
