'use client';

import Link from 'next/link';
import ProjectMedia from './ProjectMedia';
import OptimizedImage from './OptimizedImage';
import React from 'react';

interface ProjectCardProps {
  title: string;
  slug: string;
  featuredImage?: string | undefined;
  featuredVideo?: string | undefined;
  priority?: boolean;
  index?: number;
}

export default function ProjectCard({
  title,
  slug,
  featuredImage,
  featuredVideo,
  priority = false,
  index = 0,
}: ProjectCardProps) {
  const hasVideo = !!featuredVideo;
  const featuredContentSrc = hasVideo ? featuredVideo : featuredImage;

  if (!featuredContentSrc) {
    return null;
  }

  const handleMediaClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (hasVideo) {
      event.stopPropagation();
    }
  };

  return (
    <Link href={`/projects/${slug}`} className="block group" aria-label={`View project: ${title}`}>
      <div className="mb-4">
        {hasVideo ? (
          <ProjectMedia 
            type="video" 
            src={featuredContentSrc} 
            alt={title}
            onClick={handleMediaClick}
          />
        ) : (
          <OptimizedImage
            src={featuredContentSrc}
            alt={title}
            priority={priority || index < 2}
            className="transition-transform duration-300 group-hover:scale-[1.02]"
            aspectRatio="video"
            quality={90}
          />
        )}
      </div>
    </Link>
  );
} 