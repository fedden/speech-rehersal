'use client';
import { marked } from 'marked';

export default function MarkdownRenderer({ content }) {
  return (
    <div 
      className="prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ 
        __html: marked(content, { breaks: true }) 
      }} 
    />
  );
} 