'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useSpeech } from 'react-text-to-speech';
import { Volume2, Play, Pause, Square, Languages, Calendar, Clock, Loader2 } from 'lucide-react';
import { Post, ContentBlock } from '@/types/post';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n';
import { translateTexts } from '@/app/actions/translate';

interface InteractiveArticleProps {
  post: Post;
}

export default function InteractiveArticle({ post }: InteractiveArticleProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const isTtsDisabled = !isEnglish;

  const [translatedTitle, setTranslatedTitle] = useState(post.title);
  const [translatedBlocks, setTranslatedBlocks] = useState<ContentBlock[]>(post.blocks);
  const [isTranslating, setIsTranslating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function doTranslation() {
      if (isEnglish) {
        setTranslatedTitle(post.title);
        setTranslatedBlocks(post.blocks);
        return;
      }

      setIsTranslating(true);
      try {
        const textsToTranslate = [post.title, ...post.blocks.map(b => b.content)];
        const translated = await translateTexts(textsToTranslate, i18n.language);
        
        if (translated && translated.length > 0) {
          setTranslatedTitle(translated[0]);
          const newBlocks = post.blocks.map((block, i) => ({
            ...block,
            content: translated[i + 1] || block.content
          }));
          setTranslatedBlocks(newBlocks);
        }
      } catch (error) {
        console.error("Translation failed:", error);
      } finally {
        setIsTranslating(false);
      }
    }

    doTranslation();
  }, [i18n.language, isEnglish, post]);

  // 1. Build the structured ReactNode content of the article to be passed to useSpeech
  const articleContentNode = useMemo(() => {
    if (!translatedBlocks || translatedBlocks.length === 0) return null;

    return (
      <div className={`prose prose-zinc prose-lg max-w-none text-zinc-600 leading-relaxed transition-opacity duration-300 ${isTranslating ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        {translatedBlocks.map((block) => {
          switch (block.type) {
            case 'headline':
              return (
                <h2 key={block.id} className="text-2xl font-bold text-zinc-900 mt-12 mb-6">
                  {t(block.content, { defaultValue: block.content })}
                </h2>
              );
            case 'subtitle':
              return (
                <p key={block.id} className="text-xl text-zinc-900 font-medium mb-8 leading-relaxed">
                  {t(block.content, { defaultValue: block.content })}
                </p>
              );
            case 'quote':
              return (
                <blockquote key={block.id} className="border-l-4 border-[#0066FF] pl-6 my-10 italic text-xl text-zinc-900 font-medium bg-zinc-50/50 py-1 pr-4">
                  {t(block.content, { defaultValue: block.content })}
                </blockquote>
              );
            case 'body':
            default:
              return (
                <p key={block.id} className="mb-6">
                  {t(block.content, { defaultValue: block.content })}
                </p>
              );
          }
        })}
      </div>
    );
  }, [translatedBlocks, isTranslating, t]);

  // 2. Initialize useSpeech hook with the user's requested props and custom high-fidelity styles
  const { Text, speechStatus, start, pause, stop } = useSpeech({
    text: articleContentNode,
    pitch: 1,
    rate: 1,
    volume: 0.9,
    lang: "en-US",
    voiceURI: "Microsoft Ava Online (Natural) - English (United States)",
    autoPlay: false,
    highlightText: true,
    showOnlyHighlightedText: false,
    highlightMode: "sentence",
    enableDirectives: false, // pass boolean value to satisfy TypeScript
    highlightProps: {
      style: {
        backgroundColor: 'rgba(0, 102, 255, 0.08)', // premium brand blue tint
        color: '#18181b', // zinc-900
        padding: '0.125rem 0.25rem',
        borderRadius: '0.375rem',
        borderBottom: '2px solid #0066FF',
      }
    }
  });

  const isSpeakingOrPaused = speechStatus === 'started' || speechStatus === 'paused' || speechStatus === 'queued';

  return (
    <div className="w-full">
      {/* Header Controls Section */}
      <div className="flex flex-col items-center text-center mb-16">
        {/* Accessibility & Audio Controls Header Section */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {/* Language selector (styled static controls matching design) */}
          <div className="flex items-center gap-3 px-5 py-2 rounded-full border border-zinc-100 bg-zinc-50 text-zinc-500 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <Languages size={14} className="text-zinc-400" />
              <button onClick={() => { i18n.changeLanguage('en'); if (speechStatus === 'started') stop(); }} className={isEnglish ? "text-zinc-900 select-none font-bold" : "text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors select-none"}>EN</button>
              <div className="w-[1px] h-3 bg-zinc-200" />
              <button onClick={() => { i18n.changeLanguage('es'); if (speechStatus === 'started') stop(); }} className={i18n.language === 'es' ? "text-zinc-900 select-none font-bold" : "text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors select-none"}>ES</button>
              <div className="w-[1px] h-3 bg-zinc-200" />
              <button onClick={() => { i18n.changeLanguage('fr'); if (speechStatus === 'started') stop(); }} className={i18n.language === 'fr' ? "text-zinc-900 select-none font-bold" : "text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors select-none"}>FR</button>
            </div>
          </div>

          {/* Unified Audio Controller: Pill buttons following 'Zero Shadows' standard */}
          {!isSpeakingOrPaused ? (
            <button
              onClick={start}
              disabled={isTtsDisabled}
              title={isTtsDisabled ? t('tts_disabled') : undefined}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-100 bg-zinc-50 text-zinc-500 text-xs font-semibold hover:bg-zinc-100 hover:border-zinc-200 transition-all hover:text-zinc-900 group active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              aria-label={t('listen_to_article')}
            >
              <Volume2 size={14} className="text-zinc-400 group-hover:text-[#0066FF] transition-colors" />
              <span>{t('listen_to_article')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 transition-all duration-300">
              <button
                onClick={start}
                disabled={speechStatus === 'started' || isTtsDisabled}
                title={isTtsDisabled ? t('tts_disabled') : undefined}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-100 bg-zinc-50 text-zinc-500 text-xs font-semibold hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition-all hover:text-zinc-900 active:scale-95 cursor-pointer"
                aria-label={speechStatus === 'paused' ? t('resume') : 'Start'}
              >
                {speechStatus === 'started' ? (
                  <div className="w-1.5 h-1.5 bg-[#0066FF] rounded-full animate-ping" />
                ) : (
                  <Play size={14} className="text-zinc-400" />
                )}
                <span>{speechStatus === 'paused' ? t('resume') : 'Start'}</span>
              </button>

              <button
                onClick={pause}
                disabled={speechStatus === 'paused' || isTtsDisabled}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-zinc-100 bg-zinc-50 text-zinc-500 text-xs font-semibold hover:bg-zinc-100 disabled:opacity-50 disabled:pointer-events-none transition-all hover:text-zinc-900 active:scale-95 cursor-pointer"
                aria-label={t('pause')}
              >
                <Pause size={14} className="text-zinc-400" />
                <span>{t('pause')}</span>
              </button>

              <button
                onClick={stop}
                disabled={!isSpeakingOrPaused}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-red-100 bg-red-50/30 text-red-600 text-xs font-semibold hover:bg-red-50 hover:border-red-200 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
                aria-label={t('stop')}
              >
                <Square size={12} className="text-red-500 fill-red-500/20" />
                <span>{t('stop')}</span>
              </button>

              {/* Premium Dynamic Pulse Speaking Indicator */}
              {speechStatus === 'started' && (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-zinc-100" role="status">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0066FF]"></span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#0066FF] animate-pulse select-none">
                    {t('speaking')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Article Title */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 mb-8 leading-[1.1] max-w-3xl flex items-center justify-center gap-4">
          {translatedTitle}
          {isTranslating && <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />}
        </h1>

        {/* Article Metadata */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-sm font-medium text-zinc-400">
          <div className="flex items-center gap-3 text-zinc-900">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200">
              <Image 
                src={post.authorImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                alt={post.author || "Author"} 
                width={32} 
                height={32} 
              />
            </div>
            <span>{post.author}</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200" />
          <div className="flex items-center gap-2 font-semibold">
            <Calendar size={14} />
            {post.date}
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-200" />
          <div className="flex items-center gap-2 font-semibold">
            <Clock size={14} />
            {post.readTime}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 bg-zinc-100">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Spoken highlighted content body */}
      <div className="max-w-2xl mx-auto" suppressHydrationWarning>
        {mounted ? <Text /> : articleContentNode}
      </div>
    </div>
  );
}
