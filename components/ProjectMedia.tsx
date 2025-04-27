import React from 'react';

interface ProjectMediaProps {
  type: 'image' | 'video';
  src: string;
  caption?: string;
  alt?: string;
  aspectRatio?: string;
}

export default function ProjectMedia({ 
  type, 
  src, 
  caption, 
  alt, 
  aspectRatio = 'aspect-video' 
}: ProjectMediaProps) {
  return (
    <div>
      <div className={`relative w-full ${aspectRatio} mb-2`}>
        {type === 'image' ? (
          <img
            src={src}
            alt={alt || 'Project media'}
            style={{ 
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        ) : (
          <video
            src={src}
            controls
            style={{ 
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        )}
      </div>
      {caption && (
        <p className="text-sm text-gray-600">{caption}</p>
      )}
    </div>
  );
} 