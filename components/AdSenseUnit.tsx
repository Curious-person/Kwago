'use client';

import React, { useEffect } from 'react';

interface AdSenseUnitProps {
  slotId: string;
}

/**
 * Reusable AdSense Component
 * - Development: Shows a placeholder for layout testing.
 * - Production: Loads and initializes the AdSense script.
 */
const AdSenseUnit: React.FC<AdSenseUnitProps> = ({ slotId }) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        // @ts-expect-error: AdSense window push is not typed
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400 font-medium min-h-[250px] transition-all hover:bg-slate-100 hover:border-slate-300 group">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ads</span>
        </div>
        <p className="text-sm font-mono opacity-80">Placeholder: {slotId}</p>
        <p className="text-[10px] mt-2 text-slate-300 italic uppercase tracking-tighter">Visible in production only</p>
      </div>
    );
  }

  return (
    <div className="adsense-container my-10 overflow-hidden rounded-xl shadow-sm bg-white">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseUnit;
