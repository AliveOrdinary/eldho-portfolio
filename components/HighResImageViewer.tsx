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
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const [, setIsSwipeGesture] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [pinchDistance, setPinchDistance] = useState(0);
  const [initialPinchZoom, setInitialPinchZoom] = useState(1);
  const [, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [isLoadingHighRes, setIsLoadingHighRes] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const highResImageRef = useRef<HTMLImageElement>(null);

  const currentImageSrc = allProjectImages.length > 0 ? allProjectImages[activeImageIndex] : src;
  
  // Haptic feedback utility
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);
  
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
    triggerHapticFeedback('medium');
    
    // Start loading high-res version immediately
    const targetSrc = allProjectImages.length > 0 ? allProjectImages[currentIndex] : src;
    preloadHighRes(targetSrc);
  }, [currentIndex, allProjectImages, src, preloadHighRes, triggerHapticFeedback]);

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
      triggerHapticFeedback('light');
    }
  }, [allProjectImages, activeImageIndex, preloadHighRes, triggerHapticFeedback]);

  const prevImage = useCallback(() => {
    if (allProjectImages.length > 1) {
      const newIndex = (activeImageIndex - 1 + allProjectImages.length) % allProjectImages.length;
      setActiveImageIndex(newIndex);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setHighResLoaded(false);
      setIsLoadingHighRes(true);
      preloadHighRes(allProjectImages[newIndex]);
      triggerHapticFeedback('light');
    }
  }, [allProjectImages, activeImageIndex, preloadHighRes, triggerHapticFeedback]);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.5, 5));
    triggerHapticFeedback('light');
  }, [triggerHapticFeedback]);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
    triggerHapticFeedback('light');
  }, [triggerHapticFeedback]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    triggerHapticFeedback('medium');
  }, [triggerHapticFeedback]);
  
  // Smart background click handler
  const handleBackgroundClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent event from bubbling up to parent elements
    e.stopPropagation();
    
    // Only handle clicks on the background div itself
    const target = e.target as HTMLElement;
    const isBackgroundClick = target.classList.contains('modal-backdrop') || 
                             target.classList.contains('modal-container');
    
    if (isBackgroundClick) {
      if (zoom > 1) {
        // If zoomed in, reset zoom first
        resetZoom();
      } else {
        // If not zoomed, close modal
        closeModal();
      }
    }
  }, [zoom, resetZoom, closeModal]);
  
  // Double-tap to zoom
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    const now = Date.now();
    const timeDiff = now - lastTap;
    
    if (timeDiff < 300 && timeDiff > 0) {
      e.preventDefault();
      triggerHapticFeedback('medium');
      
      if (zoom === 1) {
        // Zoom in to 2x
        setZoom(2);
        
        // Center zoom on touch point
        const touch = e.changedTouches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
        
        setPosition({
          x: (centerX - touchX) * 0.5,
          y: (centerY - touchY) * 0.5
        });
      } else {
        // Reset zoom
        resetZoom();
      }
    }
    
    setLastTap(now);
  }, [lastTap, zoom, resetZoom, triggerHapticFeedback]);
  
  // Pinch-to-zoom helpers
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const handlePinchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setPinchDistance(distance);
      setInitialPinchZoom(zoom);
    }
  }, [zoom]);
  
  const handlePinchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchDistance > 0) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / pinchDistance;
      const newZoom = Math.min(Math.max(initialPinchZoom * scale, 0.5), 5);
      setZoom(newZoom);
    }
  }, [pinchDistance, initialPinchZoom]);
  
  const handlePinchEnd = useCallback(() => {
    setPinchDistance(0);
    setInitialPinchZoom(1);
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
  
  
  // Touch gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsSwipeGesture(false);
    
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  }, [zoom, position]);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    
    if (isDragging && zoom > 1) {
      e.preventDefault();
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  }, [isDragging, zoom, dragStart]);
  
  const handleTouchEnd = useCallback(() => {
    if (!isDragging && allProjectImages.length > 1) {
      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = Math.abs(touchEnd.y - touchStart.y);
      const minSwipeDistance = 50;
      
      // Check if it's a horizontal swipe (not vertical scroll)
      if (Math.abs(deltaX) > minSwipeDistance && deltaY < 100) {
        setIsSwipeGesture(true);
        triggerHapticFeedback('medium');
        
        if (deltaX > 0) {
          // Swipe right - go to previous image
          prevImage();
        } else {
          // Swipe left - go to next image
          nextImage();
        }
      }
    }
    
    setIsDragging(false);
    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  }, [isDragging, allProjectImages.length, touchEnd, touchStart, triggerHapticFeedback, prevImage, nextImage]);

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
          className="modal-backdrop fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={handleBackgroundClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleBackgroundClick(e);
          }}
        >
          <div 
            className="modal-container relative w-full h-full flex items-center justify-center" 
            onClick={handleBackgroundClick}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleBackgroundClick(e);
            }}
          >
            <div 
              className="relative max-w-[90vw] max-h-[90vh] cursor-grab active:cursor-grabbing touch-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transformOrigin: 'center'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={(e) => {
                handleTouchStart(e);
                handlePinchStart(e);
              }}
              onTouchMove={(e) => {
                handleTouchMove(e);
                handlePinchMove(e);
              }}
              onTouchEnd={(e) => {
                handleDoubleTap(e);
                handleTouchEnd();
                handlePinchEnd();
              }}
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
              className="hidden md:block absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              aria-label="Close image viewer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {allProjectImages.length > 1 && (
              <>
                {/* Desktop navigation buttons */}
                <button
                  onClick={prevImage}
                  className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
                
              </>
            )}


            {/* Desktop zoom controls */}
            <div className="absolute bottom-4 right-4 md:flex gap-2 hidden">
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

            {/* Mobile bottom control bar */}
            <div className="md:hidden absolute bottom-12 left-0 right-0 z-50 pointer-events-auto">
              <div 
                className="flex items-center justify-center px-1 py-4 gap-2 overflow-x-auto"
                onClick={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                {/* Navigation group */}
                {allProjectImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      onTouchEnd={(e) => { e.stopPropagation(); }}
                      className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all flex-shrink-0"
                      aria-label="Previous image"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15,18 9,12 15,6" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      onTouchEnd={(e) => { e.stopPropagation(); }}
                      className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all flex-shrink-0"
                      aria-label="Next image"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                    </button>
                    <div className="w-px h-6 bg-white bg-opacity-30 mx-0.5" />
                  </>
                )}
                
                {/* Control group */}
                <button
                  onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                  onTouchEnd={(e) => { e.stopPropagation(); }}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all flex-shrink-0"
                  aria-label="Zoom out"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                  onTouchEnd={(e) => { e.stopPropagation(); }}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all flex-shrink-0"
                  aria-label="Reset zoom"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1,4 1,10 7,10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                  onTouchEnd={(e) => { e.stopPropagation(); }}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all flex-shrink-0"
                  aria-label="Zoom in"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </button>
                {enableDownload && (
                  <button
                    onClick={(e) => { e.stopPropagation(); downloadHighRes(); }}
                    onTouchEnd={(e) => { e.stopPropagation(); }}
                    className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all flex-shrink-0"
                    aria-label="Download high resolution image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); closeModal(); }}
                  onTouchEnd={(e) => { e.stopPropagation(); }}
                  className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all flex-shrink-0"
                  aria-label="Close image viewer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HighResImageViewer;
