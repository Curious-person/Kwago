'use server';

/**
 * Translates an array of text strings into the target language.
 * Uses a free public translation API (MyMemory) and falls back to a simulated translation if rate-limited.
 */
export async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'en' || texts.length === 0) return texts;

  const translatedTexts: string[] = [];

  for (const text of texts) {
    // Skip empty or very short strings
    if (!text || text.trim().length < 2) {
      translatedTexts.push(text);
      continue;
    }

    try {
      // MyMemory API limits 500 words/day without a key
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
      
      if (!response.ok) {
        throw new Error('Translation API failed');
      }

      const data = await response.json();

      if (data.responseData && data.responseData.translatedText) {
        // Sometimes MyMemory returns a quota exceeded error inside responseData
        if (data.responseData.translatedText.includes('MYMEMORY WARNING')) {
          throw new Error('Rate limit exceeded');
        }
        translatedTexts.push(data.responseData.translatedText);
      } else {
        throw new Error('Invalid translation format');
      }
    } catch (error) {
      // Fallback: Mock translation for demo purposes
      console.warn(`Translation fallback for text: ${text.substring(0, 20)}...`);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      translatedTexts.push(`${text} [${targetLang.toUpperCase()}]`);
    }
  }

  return translatedTexts;
}
