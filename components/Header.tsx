'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  text: string;
  url: string;
}

interface HeaderProps {
  navigation: NavigationItem[];
}



// Mobile menu animation variants
const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    }
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.07,
      delayChildren: 0.1
    }
  }
};

const menuItemVariants = {
  closed: {
    opacity: 0,
    y: 20
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Variants for the menu button icons (hamburger/close)
const menuIconVariants = {
  initial: { opacity: 0, scale: 0.8, rotate: -30 },
  animate: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.8, rotate: 30, transition: { duration: 0.2, ease: "easeIn" } },
};

const fullName = "Eldhose Kuriyan";

export default function Header({ navigation }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [eldhoWidth, setEldhoWidth] = useState<number | null>(null);
  const eldhoRef = useRef<HTMLSpanElement>(null);

  // Measure width of "Eldho" on mount
  useEffect(() => {
    if (eldhoRef.current) {
      const width = eldhoRef.current.getBoundingClientRect().width;
      setEldhoWidth(width);
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50;
          setIsScrolled(scrolled);
          if (scrolled && !hasScrolledOnce) {
            setHasScrolledOnce(true);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolledOnce]);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className={`md:py-4 py-2 md:px-4 px-2 sticky top-0 bg-[#f7f7f7] z-10 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="mx-auto flex items-center justify-between md:grid md:grid-cols-[3fr_2fr] md:gap-4">
        {/* Hidden element to measure "Eldho" width */}
        <span 
          ref={eldhoRef}
          className="text-xl md:text-2xl font-rightserif font-book absolute opacity-0 pointer-events-none whitespace-nowrap"
          aria-hidden="true"
        >
          Eldho
        </span>

        {/* Logo/brand name - updated font */}
        <Link href="/" className="text-xl md:text-2xl font-rightserif font-book relative h-8 flex items-center z-30">
          <motion.div
            animate={{ 
              width: hasScrolledOnce && eldhoWidth ? `${eldhoWidth}px` : 'auto',
              transition: { 
                duration: 0.6, 
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }}
            className="overflow-hidden"
          >
            <div className="flex whitespace-nowrap">
              {fullName.split('').map((char, index) => {
                return (
                  <span
                    key={`${char}-${index}`}
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}
            </div>
          </motion.div>
        </Link>

        {/* Desktop navigation - hidden on mobile */}
        <nav className="hidden md:block w-full">
          <ul className="flex justify-between font-montreal font-medium w-full">
            {navigation.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.url}
                  className="text-gray-700 hover:text-black transition-colors"
                >
                  {item.text}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="mailto:eldhosekuriyan@gmail.com"
                className="text-gray-700 hover:text-black transition-colors"
              >
                Let&apos;s connect <span className="text-yellow-400">👋</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Unified Menu Button (Hamburger/Close) */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center justify-center w-12 h-12 z-30 relative" // Added relative for icon positioning
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence initial={false} mode="wait">
            {!isMenuOpen ? (
              <motion.svg
                key="hamburger"
                variants={menuIconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="absolute" // Position icon within button
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </motion.svg>
            ) : (
              <motion.svg
                key="close"
                variants={menuIconVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="absolute" // Position icon within button
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </motion.svg>
            )}
          </AnimatePresence>
        </button>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed inset-0 bg-[#f7f7f7] z-20 pt-24 px-8 flex flex-col"
            >
              <nav>
                <motion.ul className="flex flex-col space-y-6 text-3xl font-montreal font-book">
                  {navigation.map((item, index) => (
                    <motion.li key={index} variants={menuItemVariants}>
                      <Link
                        href={item.url}
                        className="text-gray-800 hover:text-black inline-block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.text}
                      </Link>
                    </motion.li>
                  ))}
                  <motion.li variants={menuItemVariants}>
                    <a
                      href="mailto:eldhosekuriyan@gmail.com"
                      className="text-gray-800 hover:text-black inline-block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Let&apos;s connect <span className="text-yellow-400">👋</span>
                    </a>
                  </motion.li>
                </motion.ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
} 