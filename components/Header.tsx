'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  text: string;
  url: string;
}

interface HeaderProps {
  navigation: NavigationItem[];
}

const nameContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1, // Right-to-left (from end to start)
      delayChildren: 0.2, // Small delay before starting to remove letters
    },
  },
};

// Variants for letters that will disappear (letters after "Eldho")
const disappearingLetterVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { 
    scaleX: 0,
    opacity: 0,
    transition: { 
      type: "spring", 
      damping: 12,
      duration: 0.4
    } 
  },
};

// Variants for letters that will stay (letters of "Eldho")
const stayingLetterVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 }, // No exit animation for these letters
};

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
const targetLength = 5; // "Eldho" is 5 letters

export default function Header({ navigation }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
      if (scrolled && !hasScrolledOnce) {
        setHasScrolledOnce(true);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
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
      <div className="mx-auto flex items-center justify-between">
        {/* Logo/brand name - updated font */}
        <Link href="/" className="text-2xl font-rightserif font-book relative h-8 w-56 flex items-center overflow-hidden z-30">
          <div className="absolute inset-0 flex items-center justify-start">
            {/* Split the full name into individual letters */}
            <motion.div
              variants={nameContainerVariants}
              initial="animate"
              animate="animate"
              exit="exit"
              className="flex"
            >
              {fullName.split('').map((char, index) => {
                // Determine if this letter should stay or go
                const shouldStay = index < targetLength;
                return (
                  <motion.span
                    key={`${char}-${index}`}
                    variants={shouldStay ? stayingLetterVariants : disappearingLetterVariants}
                    animate={hasScrolledOnce && !shouldStay ? "exit" : "animate"}
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                );
              })}
            </motion.div>
          </div>
        </Link>

        {/* Desktop navigation - hidden on mobile */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8 font-montreal font-regular">
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
          className={`md:hidden flex items-center justify-center w-12 h-12 z-30 relative`} // Added relative for icon positioning
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
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
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
              className="fixed inset-0 bg-custom-bg z-20 pt-24 px-8 flex flex-col"
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