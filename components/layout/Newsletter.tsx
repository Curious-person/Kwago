import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const Newsletter = () => {
  return (
    <section className="py-24 px-8 bg-[#F9FAFB] flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
        Weekly clarity, delivered.
      </h2>
      <p className="text-zinc-500 max-w-lg mb-10 leading-relaxed">
        Join 15,000+ readers who receive our curated thoughts on design, philosophy, and focus every Sunday morning.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
        <Input 
          placeholder="email@example.com" 
          className="bg-white border border-zinc-200"
        />
        <Button className="w-full sm:w-auto">Subscribe</Button>
      </div>
      
      <p className="text-[10px] mt-6 text-zinc-400 font-medium">
        No spam. Ever. Just pure signal.
      </p>
    </section>
  );
};
