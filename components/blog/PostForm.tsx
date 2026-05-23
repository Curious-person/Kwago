'use client';

/**
 * PostForm — Shared block-level editor for creating and editing posts.
 *
 * Usage:
 *   // Create mode (no initialData needed)
 *   <PostForm mode="create" />
 *
 *   // Edit mode (pass the full Post object)
 *   <PostForm mode="edit" postId="1" initialData={post} />
 *
 * See CONVENTIONS.md for the shared-component pattern used across Kwago.
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  Globe,
  Clock,
  User,
  Image as ImageIcon,
  GripVertical,
  Trash2,
  PlusCircle,
  Sparkles,
  Package,
  X,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

import { createClient } from '@/lib/supabase/client';
import { createPost, updatePost } from '@/lib/services/postService';
import { fetchProducts } from '@/lib/services/productService';
import type { BlockType, ContentBlock, Post } from '@/types/post';
import type { Product } from '@/types/product';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PostFormProps {
  mode: 'create' | 'edit';
  /** Required in edit mode — the full post to pre-populate. */
  initialData?: Post;
  /** Required in edit mode — the route param id. */
  postId?: string;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_FORM = {
  title: '',
  category: 'Design',
  readTime: '8 min read',
  author: 'Elena Vance',
  authorImage:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
  image:
    'https://images.unsplash.com/photo-1544391682-177d4c9d3ddb?q=80&w=1200&auto=format&fit=crop',
};

const DEFAULT_BLOCKS: ContentBlock[] = [{ id: '1', type: 'body', content: '' }];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PostForm({ mode, initialData, postId }: PostFormProps) {
  const router = useRouter();

  // Metadata fields
  const [formData, setFormData] = useState({
    title: initialData?.title ?? DEFAULT_FORM.title,
    category: initialData?.category ?? DEFAULT_FORM.category,
    readTime: initialData?.readTime ?? DEFAULT_FORM.readTime,
    author: initialData?.author ?? DEFAULT_FORM.author,
    authorImage: initialData?.authorImage ?? DEFAULT_FORM.authorImage,
    image: initialData?.image ?? DEFAULT_FORM.image,
  });

  // Block-level content
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialData?.blocks?.length ? initialData.blocks : DEFAULT_BLOCKS
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Product linking
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // -------------------------------------------------------------------------
  // Fetch products on mount
  // -------------------------------------------------------------------------

  useEffect(() => {
    const loadProducts = async () => {
      setProductsLoading(true);
      const response = await fetchProducts();
      if (response.success) {
        setProducts(response.data.filter((p) => p.status === 'for-posting'));
      }
      setProductsLoading(false);
    };
    loadProducts();
  }, []);

  // -------------------------------------------------------------------------
  // Product selection
  // -------------------------------------------------------------------------

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const removeSelectedProduct = (productId: string) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== productId));
  };

  // -------------------------------------------------------------------------
  // Block actions
  // -------------------------------------------------------------------------

  const addBlock = (type: BlockType = 'body') => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substring(2, 11),
      type,
      content: '',
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const removeBlock = (id: string) => {
    if (blocks.length === 1) return; // always keep at least one block
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const updateBlockType = (id: string, type: BlockType) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, type } : b)));
  };

  // -------------------------------------------------------------------------
  // Drag-and-drop
  // -------------------------------------------------------------------------

  const handleDragStart = (index: number) => setDraggedBlockIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedBlockIndex === null || draggedBlockIndex === index) return;
    const next = [...blocks];
    const [dragged] = next.splice(draggedBlockIndex, 1);
    next.splice(index, 0, dragged);
    setBlocks(next);
    setDraggedBlockIndex(index);
  };

  const handleDragEnd = () => setDraggedBlockIndex(null);

  // -------------------------------------------------------------------------
  // Save / submit
  // -------------------------------------------------------------------------


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();



      if (!user) {
        alert('You must be logged in to save posts.');
        setIsSaving(false);
        return;
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        image: formData.image,
        readTime: formData.readTime,
        status: mode === 'create' ? 'Draft' : initialData?.status ?? 'Draft',
        blocks,
      };

      let response;
      let savedPostId = postId;

      if (mode === 'edit' && postId) {
        response = await updatePost(postId, payload);
      } else {
        response = await createPost(payload, user.id);
        if (response.success) {
          savedPostId = response.data.id;
        }
      }

      console.log('[PostForm] Linked products:', selectedProductIds);
      console.log('[PostForm] Response:', response);

      if (!response.success) {
        alert(response.error?.message || 'Failed to save post.');
        setIsSaving(false);
        return;
      }

      // Link selected products to the post
      if (savedPostId && selectedProductIds.length > 0) {
        try {
          // First, delete any existing links for this post
          await supabase
            .from('blog_post_products')
            .delete()
            .eq('blog_post_id', savedPostId);

          // Then insert the new links
          const linksToInsert = selectedProductIds.map((productId, index) => ({
            blog_post_id: savedPostId,
            product_id: productId,
            position: index,
            is_featured: true,
          }));

          const { error: linkError } = await supabase
            .from('blog_post_products')
            .insert(linksToInsert);

          if (linkError) {
            console.error('Error linking products:', linkError);
            alert('Post saved but there was an error linking products.');
          }
        } catch (err) {
          console.error('Error during product linking:', err);
          alert('Post saved but there was an error linking products.');
        }
      }

      setIsModalOpen(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      alert(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------------------------------------------------------
  // Mode-aware copy
  // -------------------------------------------------------------------------

  const copy = {
    pageTitle: mode === 'edit' ? 'Edit Post' : 'Create New Post',
    pageSubtitle:
      mode === 'edit'
        ? "Update your collector's guide."
        : "Draft your next collector's guide.",
    saveLabel: mode === 'edit' ? 'Update Post' : 'Publish Post',
    modalTitle: mode === 'edit' ? 'Update in Progress' : 'Submission in Progress',
    modalBody:
      mode === 'edit'
        ? "Your changes are being saved. We'll run a quick quality check before updating the guide."
        : "Your collector's guide is being prepared for publication. Our system ensures quality through a multi-stage review process.",
    modalCancelLabel: mode === 'edit' ? 'Keep Editing' : 'Cancel Submission',
    modalConfirmLabel: mode === 'edit' ? 'Done' : 'Confirm & Close',
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="max-w-4xl mx-auto py-12 px-8">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
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
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{copy.pageTitle}</h1>
            <p className="text-zinc-500 text-sm">{copy.pageSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => router.push('/dashboard/author/posts')} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : copy.saveLabel}</span>
          </Button>
        </div>
      </div>

      {/* ── Two-column layout ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="md:col-span-2 space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
              Post Title
            </label>
            <Input
              placeholder="The art of..."
              className="text-xl font-bold py-6 px-6"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Content blocks */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">
                Content Blocks
              </label>
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

            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'group relative flex gap-4 p-4 rounded-[24px] border border-zinc-100 bg-white transition-all hover:border-zinc-200',
                    draggedBlockIndex === index && 'opacity-50 border-[#0066FF] border-dashed'
                  )}
                >
                  {/* Drag handle */}
                  <div className="flex flex-col items-center pt-3 cursor-grab active:cursor-grabbing text-zinc-300 group-hover:text-zinc-400">
                    <GripVertical size={18} />
                  </div>

                  {/* Controls + textarea */}
                  <div className="flex-1 space-y-3">
                    {/* Block-type switcher */}
                    <div className="flex items-center gap-4">
                      <div className="flex bg-zinc-50 p-1 rounded-full border border-zinc-100">
                        {(['headline', 'subtitle', 'quote', 'body'] as BlockType[]).map((type) => (
                          <button
                            key={type}
                            onClick={() => updateBlockType(block.id, type)}
                            className={cn(
                              'px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all',
                              block.type === type
                                ? 'bg-white text-[#0066FF] border border-zinc-100'
                                : 'text-zinc-400 hover:text-zinc-600'
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

                    {/* Content textarea — styled by block type */}
                    <textarea
                      className={cn(
                        'w-full bg-transparent focus:outline-none transition-all resize-none',
                        block.type === 'headline' &&
                        'text-2xl font-bold text-zinc-900 placeholder:text-zinc-200',
                        block.type === 'subtitle' &&
                        'text-xl font-medium text-zinc-900 placeholder:text-zinc-200',
                        block.type === 'quote' &&
                        'border-l-4 border-[#0066FF] pl-6 italic text-xl text-zinc-900 placeholder:text-zinc-200',
                        block.type === 'body' &&
                        'text-zinc-600 leading-relaxed placeholder:text-zinc-300'
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

            {/* Append block CTA */}
            <Button
              variant="ghost"
              className="w-full py-8 border-2 border-dashed border-zinc-100 rounded-[24px] text-zinc-400 hover:border-[#0066FF]/20 hover:text-[#0066FF] hover:bg-[#0066FF]/5 gap-2 group transition-all"
              onClick={() => addBlock('body')}
            >
              <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold uppercase tracking-widest text-xs">
                Append New Content Block
              </span>
            </Button>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div className="space-y-10">
          {/* Metadata */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-4">
              Metadata
            </h3>
            <div className="space-y-4">
              {/* Category */}
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

              {/* Read time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <Clock size={14} />
                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Read Time
                  </label>
                </div>
                <Input
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                  className="h-10 text-xs font-bold"
                />
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-4">
              Media
            </h3>
            <div className="space-y-4">
              {/* Featured image */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <ImageIcon size={14} />
                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Featured Image
                  </label>
                </div>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="h-10 text-[10px] font-medium"
                />
              </div>

              {/* Author image */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400 mb-1">
                  <User size={14} />
                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Author Image
                  </label>
                </div>
                <Input
                  value={formData.authorImage}
                  onChange={(e) => setFormData({ ...formData, authorImage: e.target.value })}
                  className="h-10 text-[10px] font-medium"
                />
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-4 flex-1">
                Featured Products
              </h3>
              <Badge variant="secondary" className="text-[10px] font-bold rounded-full px-2">
                {selectedProductIds.length}
              </Badge>
            </div>

            {/* Selected products */}
            {selectedProductIds.length > 0 && (
              <div className="space-y-2 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-900 mb-2">
                  Linked Products
                </p>
                <div className="space-y-2">
                  {selectedProductIds.map((productId) => {
                    const product = products.find((p) => p.id === productId);
                    return product ? (
                      <div
                        key={productId}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white border border-zinc-100 group hover:border-blue-200 transition-all"
                      >
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-zinc-400">${product.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => removeSelectedProduct(productId)}
                          className="p-1 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Product selector */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={20} className="text-zinc-400 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center">
                <p className="text-xs text-zinc-500 font-medium">
                  No products created yet. Create products to feature them in blog posts.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {products
                  .filter((p) => !selectedProductIds.includes(p.id))
                  .map((product) => (
                    <button
                      key={product.id}
                      onClick={() => toggleProductSelection(product.id)}
                      className="w-full flex items-center gap-2 p-3 rounded-xl border border-zinc-100 bg-white hover:bg-blue-50/50 hover:border-blue-200 transition-all text-left group"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate">{product.name}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-zinc-400">${product.price.toFixed(2)}</span>
                          <span className="text-[10px] text-zinc-300">•</span>
                          <Badge
                            variant="secondary"
                            className="text-[9px] rounded-full px-1.5 h-4 flex items-center"
                          >
                            {product.condition}
                          </Badge>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                          'border-zinc-300 group-hover:border-blue-400 group-hover:bg-blue-50'
                        )}
                      >
                        <div className="w-3 h-3 rounded-full bg-transparent group-hover:bg-blue-400 transition-all" />
                      </div>
                    </button>
                  ))}
              </div>
            )}
          </section>

          {/* Quick preview */}
          <section className="bg-zinc-50 p-6 rounded-[24px] border border-zinc-100">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">
              Quick Preview
            </h3>
            <div className="space-y-3">
              <Badge variant="secondary">{formData.category}</Badge>
              <h4 className="font-bold text-zinc-900 leading-tight line-clamp-2">
                {formData.title || 'Untitled Post'}
              </h4>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                {formData.readTime}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ── Confirmation modal ──────────────────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none bg-white rounded-[32px]">
          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0066FF]/5 flex items-center justify-center mb-6 ring-1 ring-[#0066FF]/10">
                <Sparkles className="text-[#0066FF]" size={28} />
              </div>
              <DialogTitle className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
                {copy.modalTitle}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 text-sm leading-relaxed">
                {copy.modalBody}
              </DialogDescription>
            </div>

            {/* Progress steps */}
            <div className="space-y-8 pt-2">
              <div className="relative">
                <div className="absolute left-[15px] top-[16px] bottom-[-16px] w-[2px] bg-zinc-100" />
                <div className="space-y-10 relative">
                  {/* Step 1 */}
                  <div className="flex gap-5 group">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-[#0066FF] border-4 border-white flex items-center justify-center transition-transform group-hover:scale-110">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-zinc-900">AI Quality Analysis</h4>
                        <Badge
                          variant="secondary"
                          className="bg-[#0066FF]/5 text-[#0066FF] border-none text-[10px] px-2"
                        >
                          Processing
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Scanning for authenticity and formatting. This usually takes about 60
                        seconds.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-5 group">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-zinc-100 border-4 border-white flex items-center justify-center transition-transform group-hover:scale-110">
                      <div className="w-2 h-2 rounded-full bg-zinc-300" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h4 className="text-sm font-bold text-zinc-400">Editorial Admin Review</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Final verification by our human curators before the guide goes live on the
                        journal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-zinc-50/50 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              {copy.modalCancelLabel}
            </Button>
            <Button
              onClick={() => router.push('/dashboard/author/posts')}
              className="flex-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-all font-bold uppercase tracking-widest text-[10px]"
            >
              {copy.modalConfirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
