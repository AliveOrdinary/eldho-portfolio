'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import OptimizedImage from './OptimizedImage';

interface HighResImageViewerProps {
  src: string;
  alt: string;
  priority?: boolean;
  aspectRatio?: 'video' | 'square' | 'portrait';
  quality?: number;
  sizes?: string;
  allProjectImages?: string[];
  currentIndex?: number;
  highResQuality?: number;
  enableDownload?: boolean;
}

interface ImageDimensions {
  width: number;
  height: number;
}

const HighResImageViewer: React.FC<HighResImageViewerProps> = ({
  src,
  alt,
  priority = false,
  aspectRatio = 'video',
  quality = 95,
  sizes = '100vw',
  allProjectImages = [],
  currentIndex = 0,
  highResQuality = 100,
  enableDownload = true
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(currentIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [isLoadingHighRes, setIsLoadingHighRes] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const highResImageRef = useRef<HTMLImageElement>(null);

  const currentImageSrc = allProjectImages.length > 0 ? allProjectImages[activeImageIndex] : src;
  
  // Generate high-res URL (assumes same path with quality parameter)
  const getHighResUrl = useCallback((imageSrc: string) => {
    if (imageSrc.includes('?')) {
      return `${imageSrc}&quality=${highResQuality}`;
    }
    return `${imageSrc}?quality=${highResQuality}`;
  }, [highResQuality]);
  
  // Preload high-res image
  const preloadHighRes = useCallback((imageSrc: string) => {
    const img = new Image();
    img.onload = () => {
      setHighResLoaded(true);
      setIsLoadingHighRes(false);
    };
    img.onerror = () => {
      setIsLoadingHighRes(false);
    };
    img.src = getHighResUrl(imageSrc);
  }, [getHighResUrl]);
  
  // Preload adjacent images for smooth navigation
  const preloadAdjacentImages = useCallback(() => {
    if (allProjectImages.length > 1) {
      const nextIndex = (activeImageIndex + 1) % allProjectImages.length;
      const prevIndex = (activeImageIndex - 1 + allProjectImages.length) % allProjectImages.length;
      
      // Preload next and previous images
      [allProjectImages[nextIndex], allProjectImages[prevIndex]].forEach(imageSrc => {
        const img = new Image();
        img.src = getHighResUrl(imageSrc);
      });
    }
  }, [allProjectImages, activeImageIndex, getHighResUrl]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setActiveImageIndex(currentIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setHighResLoaded(false);
    setIsLoadingHighRes(true);
    
    // Start loading high-res version immediately
    const targetSrc = allProjectImages.length > 0 ? allProjectImages[currentIndex] : src;
    preloadHighRes(targetSrc);
  }, [currentIndex, allProjectImages, src, preloadHighRes]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const nextImage = useCallback(() => {
    if (allProjectImages.length > 1) {
      const newIndex = (activeImageIndex + 1) % allProjectImages.length;
      setActiveImageIndex(newIndex);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setHighResLoaded(false);
      setIsLoadingHighRes(true);
      preloadHighRes(allProjectImages[newIndex]);
    }
  }, [allProjectImages, activeImageIndex, preloadHighRes]);

  const prevImage = useCallback(() => {
    if (allProjectImages.length > 1) {
      const newIndex = (activeImageIndex - 1 + allProjectImages.length) % allProjectImages.length;
      setActiveImageIndex(newIndex);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setHighResLoaded(false);
      setIsLoadingHighRes(true);
      preloadHighRes(allProjectImages[newIndex]);
    }
  }, [allProjectImages, activeImageIndex, preloadHighRes]);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 5));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, zoom, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, [zoomIn, zoomOut]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  }, []);
  
  // Download high-res image
  const downloadHighRes = useCallback(() => {
    const link = document.createElement('a');
    link.href = getHighResUrl(currentImageSrc);
    link.download = `${alt.replace(/\s+/g, '-').toLowerCase()}-highres`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [currentImageSrc, alt, getHighResUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, nextImage, prevImage, zoomIn, zoomOut, resetZoom]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);
  
  // Preload adjacent images when modal opens or image changes
  useEffect(() => {
    if (isModalOpen) {
      // Small delay to prioritize current image loading
      const timer = setTimeout(preloadAdjacentImages, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isModalOpen, activeImageIndex, preloadAdjacentImages]);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case 'portrait':
        return 'aspect-[3/4]';
      default:
        return 'aspect-video';
    }
  };

  return (
    <>
      <div 
        className={`w-full ${getAspectRatioClass()} cursor-pointer`}
        onClick={openModal}
      >
        <OptimizedImage
          src={src}
          alt={alt}
          priority={priority}
          quality={quality}
          sizes={sizes}
          className="w-full h-full object-cover"
        />
      </div>

      {isModalOpen && (
        <div 
          ref={modalRef}
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={(e) => {
            if (e.target === modalRef.current) {
              closeModal();
            }
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <div 
              className="relative max-w-[90vw] max-h-[90vh] cursor-grab active:cursor-grabbing"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transformOrigin: 'center'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {/* Standard quality image (loads immediately) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={currentImageSrc}
                alt={alt}
                className={`max-w-full max-h-full object-contain select-none transition-opacity duration-300 ${
                  highResLoaded ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                draggable={false}
              />
              
              {/* High-res overlay (loads on top when ready) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={highResImageRef}
                src={getHighResUrl(currentImageSrc)}
                alt={`${alt} (High Resolution)`}
                className={`absolute inset-0 max-w-full max-h-full object-contain select-none transition-opacity duration-300 ${
                  highResLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={(e) => {
                  handleImageLoad(e);
                  setHighResLoaded(true);
                  setIsLoadingHighRes(false);
                }}
                onError={() => setIsLoadingHighRes(false)}
                draggable={false}
              />
              
              {/* Loading indicator */}
              {isLoadingHighRes && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  Loading high quality...
                </div>
              )}
            </div>

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              aria-label="Close image viewer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {allProjectImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              </>
            )}


            <div className="absolute bottom-4 right-4 flex gap-2">
              {enableDownload && (
                <button
                  onClick={downloadHighRes}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Download high resolution image"
                  title="Download high-res version"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7,10 12,15 17,10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              )}
              <button
                onClick={zoomOut}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Zoom out"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
              <button
                onClick={resetZoom}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Reset zoom"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1,4 1,10 7,10" />
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
              </button>
              <button
                onClick={zoomIn}
                className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Zoom in"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HighResImageViewer;