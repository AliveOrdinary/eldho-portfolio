'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    opacity: 0, 
    y: -5, 
    x: 5, 
    transition: { duration: 0.2 } 
  },
};

// Variants for letters that will stay (letters of "Eldho")
const stayingLetterVariants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 }, // No exit animation for these letters
};

const fullName = "Eldhose Kuriyan";
const targetLength = 5; // "Eldho" is 5 letters

export default function Header({ navigation }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);

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

  return (
    <header className={`py-4 px-4 sticky top-0 bg-white z-10 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-medium relative h-8 w-56 flex items-center overflow-hidden">
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
                    // Use different variants based on whether the letter stays or goes
                    variants={shouldStay ? stayingLetterVariants : disappearingLetterVariants}
                    // If hasScrolledOnce is true and letter should not stay, add "exit" animation class
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

        <nav>
          <ul className="flex space-x-8">
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
              <Link
                href="/contact"
                className="text-gray-700 hover:text-black transition-colors"
              >
                Let&apos;s connect <span className="text-yellow-400">👋</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 