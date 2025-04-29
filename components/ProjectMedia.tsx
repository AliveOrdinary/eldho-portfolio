'use client'
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';

// Add custom types for browser-specific audio properties
declare global {
  interface HTMLVideoElement {
    mozHasAudio?: boolean;
    webkitAudioDecodedByteCount?: number;
    audioTracks?: {
      length: number;
      [index: number]: {
        enabled: boolean;
      };
    };
  }
}

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
  alt, 
}: ProjectMediaProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [hasAudio, setHasAudio] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if video has audio when it's loaded
  useEffect(() => {
    if (type !== 'video' || !videoRef.current) {
      return;
    }

    const video = videoRef.current;
    let audioCheckPerformed = false;

    const checkForAudio = () => {
      if (audioCheckPerformed) return; // Prevent multiple checks
      audioCheckPerformed = true;
      
      // Log values for debugging
      // console.log('Checking audio for:', src);
      // console.log('  readyState:', video.readyState);
      // console.log('  audioTracks:', video.audioTracks);
      // console.log('  mozHasAudio:', video.mozHasAudio);
      // console.log('  webkitAudioDecodedByteCount:', video.webkitAudioDecodedByteCount);
      
      let detectedAudio = false;
      
      // Standard check first (most reliable if supported)
      if (typeof video.audioTracks !== 'undefined' && video.audioTracks.length > 0) {
        // Further check if any track is enabled (though length > 0 is usually sufficient)
        for (let i = 0; i < video.audioTracks.length; i++) {
          if (video.audioTracks[i].enabled) {
            detectedAudio = true;
            break;
          }
        }
        // If no track explicitly enabled, still consider length > 0 as having audio
        if (!detectedAudio) detectedAudio = video.audioTracks.length > 0;
      }
      // Firefox specific check
      else if (video.mozHasAudio === true) {
         detectedAudio = true;
      }
      // Webkit specific check (less reliable for *audible* track)
      // else if (typeof video.webkitAudioDecodedByteCount !== 'undefined' && video.webkitAudioDecodedByteCount > 0) {
      //  detectedAudio = true;
      // }
      // Note: The AudioContext fallback is removed for simplicity as it can be unreliable and complex.

      // console.log('  Detected Audio:', detectedAudio);
      setHasAudio(detectedAudio);
    };

    // Check when metadata is loaded or later
    if (video.readyState >= 1) { // HAVE_METADATA
      checkForAudio();
    } else {
      video.addEventListener('loadedmetadata', checkForAudio, { once: true });
    }

    // Sometimes readyState changes without a specific event, double check on canplay
    const handleCanPlay = () => {
        if (!audioCheckPerformed) {
           checkForAudio();
        }
    };
    video.addEventListener('canplay', handleCanPlay, { once: true });

    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', checkForAudio);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [type, src]); // Re-run effect if type or src changes

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full">
      {type === 'image' ? (
        <div className="relative w-full aspect-video">
          <Image
            src={src}
            alt={alt || 'Project media'}
            fill
            sizes="w-full h-full"
            className="object-fill"
            priority
          />
        </div>
      ) : (
        <div className="relative group">
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted={isMuted} // Controlled by state
            loop
            playsInline
            className="w-full object-fill"
            // Ensure video preloads metadata for audio check
            preload="metadata" 
          />
          
          {/* Custom mute/unmute button - only shown if video has audio */}
          {hasAudio && (
            <button 
              onClick={toggleMute}
              className="absolute bottom-4 right-4 bg-black/70 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                // Muted Icon SVG
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              ) : (
                // Unmuted Icon SVG
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 