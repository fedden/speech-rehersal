'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/images/wedding-0.webp',
  '/images/wedding-1.webp',
  '/images/wedding-2.webp',
  '/images/wedding-3.webp',
];

export default function ImageRotatorPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="relative min-h-screen pt-16">
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Image ${index + 1}`}
          fill
          sizes="100vw"
          style={{ objectFit: 'contain' }}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          priority={index === 0}
        />
      ))}
    </div>
  );
} 