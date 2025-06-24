'use client';

import { useState, useEffect } from 'react';
import { fetchUserPhotos, UnsplashPhoto } from '@/lib/unsplash';
import { ProjectData } from '@/lib/types';
import OptimizedImage from './OptimizedImage';
import LoadingSpinner from './LoadingSpinner';
import ProjectCard from './ProjectCard';

interface MixedPhotographyGalleryProps {
  cmsPhotos: ProjectData[];
  username: string;
  photosPerPage?: number;
}

export default function MixedPhotographyGallery({ 
  cmsPhotos,
  username,
  photosPerPage = 12 
}: MixedPhotographyGalleryProps) {
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadUnsplashPhotos = async (currentPage: number, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const newPhotos = await fetchUserPhotos(username, currentPage, photosPerPage);
      setHasMore(newPhotos.length === photosPerPage);

      if (reset) {
        setUnsplashPhotos(newPhotos);
      } else {
        setUnsplashPhotos(prev => [...prev, ...newPhotos]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load Unsplash photos');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadUnsplashPhotos(nextPage);
  };

  useEffect(() => {
    if (username) {
      setPage(1);
      setUnsplashPhotos([]);
      setError(null);
      loadUnsplashPhotos(1, true);
    }
  }, [username]);

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* CMS Photography Projects */}
      {cmsPhotos.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Photography Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-8">
            {cmsPhotos.map((project, index) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                slug={project.slug}
                featuredImage={project.featuredImage}
                featuredVideo={project.featuredVideo}
                priority={index < 4}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Unsplash Photos */}
      {unsplashPhotos.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Photography Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {unsplashPhotos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
                  <OptimizedImage
                    src={photo.urls.regular}
                    alt={photo.alt_description || photo.description || 'Photo by ' + photo.user.name}
                    fill
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white">
                    <p className="text-xs opacity-75">
                      {photo.likes} likes • {new Date(photo.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && hasMore && unsplashPhotos.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Load More Photos
          </button>
        </div>
      )}

      {!loading && cmsPhotos.length === 0 && unsplashPhotos.length === 0 && !error && (
        <div className="text-center py-12 text-gray-500">
          No photography content found.
        </div>
      )}
    </div>
  );
}