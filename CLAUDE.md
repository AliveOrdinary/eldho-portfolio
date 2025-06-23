# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build the Next.js application for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run export` - Build and export static files (used for Netlify deployment)
- `npm run analyze-images` - Analyze image file sizes and optimization opportunities
- `node scripts/convert-to-webp.js` - Convert large images to WebP format for optimization

## Architecture Overview

This is a portfolio website for a graphic designer built with Next.js 15 using the App Router. The site is statically exported and deployed to Netlify with integrated CMS functionality.

### Content Management System
- **Netlify CMS** integration with admin interface at `/admin`
- Content stored as Markdown files in the `content/` directory
- Three content types: projects, pages (about/contact/home), and global settings
- Media files uploaded to `public/images/uploads/` with slug-based organization

### Key Architecture Patterns
- **Static Export**: Configured with `output: 'export'` in next.config.ts for static hosting
- **Markdown Processing**: Uses gray-matter for frontmatter parsing and remark for HTML conversion
- **Type-Safe Content**: TypeScript interfaces in `lib/types.ts` define content structure
- **Centralized Content Logic**: `lib/markdown.ts` handles all content fetching and processing

### Styling System
- **Tailwind CSS v4** with typography plugin
- **Custom Fonts**: PP Neue Montreal (sans) and Right Serif (serif) loaded from `/public/fonts/`
- **Custom Colors**: `custom-bg: #f7f7f7` for consistent background
- **Responsive Design**: Mobile-first approach throughout components

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components (Header, Footer, ProjectCard, etc.)
- `content/` - Markdown files managed by Netlify CMS
- `lib/` - Utility functions for markdown processing and TypeScript types
- `public/admin/` - Netlify CMS configuration and admin interface

### Content Types
- **Projects**: Featured projects with images/videos, services, and detailed summaries
- **Pages**: Static pages (about, contact, home) with structured data
- **Global**: Site-wide settings including navigation and footer content

### Code Quality Standards
- **TypeScript**: Strict configuration with enhanced type checking
- **ESLint**: Next.js rules + custom quality rules for unused vars, self-closing components
- **Error Handling**: ErrorBoundary components and try/catch blocks in data fetching
- **Performance**: OptimizedImage component with lazy loading, blur placeholders, priority loading
- **Constants**: Centralized configuration in `lib/constants.ts`
- **Utilities**: Common functions in `lib/utils.ts` including class name merging and type safety helpers

### Development Notes
- Images optimized with responsive sizes, WebP/AVIF support, and progressive loading
- Framer Motion used for animations
- Netlify Identity widget integrated for CMS authentication
- Error boundaries provide graceful degradation for component failures

## Recent Critical Improvements (June 2025)

### Security Enhancements ✅
- **Fixed XSS vulnerability** in ExpandableSummary component with HTML sanitization
- **Added comprehensive security headers** in netlify.toml including CSP, X-Frame-Options, X-XSS-Protection
- **Separate CSP policies** for main site vs. Netlify CMS admin interface

### Performance Optimizations ✅
- **Fixed Header scroll performance** with requestAnimationFrame throttling and passive listeners
- **Optimized Footer data fetching** - moved from per-render to build-time data loading
- **Image optimization**: Converted large images to WebP format (up to 85% size reduction)
- **Build performance**: All 9 pages generate successfully with zero TypeScript/ESLint errors

### High-Quality Image Viewing ✅
- **Enhanced HighResImageViewer** with progressive loading system for digital artist requirements
- **Multi-tier quality system**: Standard quality loads immediately, high-res loads in background
- **Intelligent preloading** of adjacent gallery images for smooth navigation
- **Download functionality** for high-resolution versions
- **Artist-quality settings**: Supports up to 100% quality with zoom up to 500%

### SEO Foundation ✅
- **Added robots.txt** with proper crawling permissions and sitemap reference
- **Created comprehensive sitemap.xml** including all pages and project routes
- **Search engine optimization** ready for indexing

### Code Quality ✅
- **Zero build errors**: All TypeScript types resolved, ESLint warnings fixed
- **Framer Motion compatibility** resolved with Next.js 15
- **Component reliability**: Fixed template literal bugs and improved error handling

### Testing & Validation ✅
- **Build verification**: `npm run build` completes successfully (9/9 pages)
- **Development server**: Working properly with hot reload
- **Linting**: Zero ESLint warnings or errors
- **Type checking**: All TypeScript errors resolved

## Important Implementation Notes

### For Digital Artist Portfolio
- **High-quality images are prioritized** - optimization maintains visual excellence while improving performance
- **Progressive loading strategy** ensures fast initial load with seamless transition to full quality
- **Client download features** allow high-res image access for professional viewing

### Security Best Practices
- **HTML content is sanitized** before rendering to prevent XSS attacks
- **Comprehensive CSP** prevents unauthorized script execution while maintaining CMS functionality
- **Security headers** provide defense against common web vulnerabilities

### Performance Monitoring
- Run `npm run analyze-images` before adding new images to identify optimization opportunities
- Use `node scripts/convert-to-webp.js` to convert large images while maintaining quality
- Monitor Core Web Vitals with build-time optimizations in place

## Latest Enhancements (June 2025)

### Mobile Experience & Page Transitions ✅
- **Smooth page transitions** implemented with Framer Motion for professional navigation flow
- **Enhanced touch gestures** in HighResImageViewer for mobile-first interaction
- **Haptic feedback** on all image interactions (zoom, swipe, navigate) for tactile user experience
- **Advanced mobile features**:
  - Double-tap to zoom with smart centering
  - Pinch-to-zoom with multi-touch support
  - Swipe navigation between gallery images
  - Mobile-specific UI hints ("Swipe to navigate • Double tap to zoom")
  - Touch-optimized drag and pan for zoomed images

### Professional UX Features ✅
- **Progressive page transitions** between projects with smooth animation
- **Mobile haptic patterns**: Light (10ms), Medium (20ms), Heavy (30ms) vibration feedback
- **Intelligent gesture detection**: Distinguishes between swipes, drags, and taps
- **Responsive touch targets**: Optimized for finger interaction on mobile devices
- **Visual feedback**: Loading states and transition indicators for smooth experience

### Technical Implementation ✅
- **Touch event optimization**: Passive listeners and `touch-none` CSS for performance
- **Multi-gesture support**: Simultaneous handling of pinch, pan, and swipe gestures
- **Memory efficiency**: Proper cleanup of event listeners and state management
- **Cross-platform compatibility**: Works on iOS, Android, and desktop browsers
- **Accessibility**: Maintains keyboard navigation and screen reader support

### Build & Quality Status ✅
- **Zero build errors**: All TypeScript types resolved for touch interfaces
- **Zero ESLint warnings**: Clean code with proper touch event typing
- **Performance optimized**: 151kB total bundle size maintained
- **Mobile-ready**: Full touch support with haptic feedback integration

### Mobile UX Optimization (Latest Update) ✅
- **Fixed click-outside functionality**: Works consistently on mobile and desktop
- **Smart zoom behavior**: Click background when zoomed resets zoom first, second click closes modal
- **Mobile-first control layout**: Bottom control bar with grouped buttons for thumb accessibility
- **Responsive button grouping**: 
  - Navigation group: [←] [→] with visual divider
  - Control group: [Zoom-] [Reset] [Zoom+] [Download] [Close]
- **Semi-transparent backdrop bar**: Professional mobile app-style control interface
- **Eliminated reach issues**: No more stretching to top corners on mobile devices
- **Desktop layout preserved**: Traditional side/corner positioning maintained for desktop users

### Technical Implementation Notes ✅
- **Grouped control architecture**: Logical button organization for intuitive mobile use
- **Background click handler**: Proper event delegation for reliable outside-click behavior
- **Mobile-desktop hybrid**: Separate optimized layouts without code duplication
- **Touch-friendly sizing**: Larger buttons and spacing for mobile interaction
- **Visual hierarchy**: Semi-transparent background with white button accents for clarity

## Final Mobile UX Implementation (Complete Solution)

### Problem Solved ✅
**Original Issue**: Navigation buttons overlapped image content on mobile devices, poor user experience

**Solution Implemented**: Complete mobile UX overhaul with bottom control bar and smart interaction patterns

### Mobile Control Layout Implementation ✅

**Bottom Control Bar Structure**:
```
┌─────────────────────────────────────┐
│                                     │
│         IMAGE VIEWING AREA          │
│        (completely clear)           │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ [←] [→] | [⊖] [⌂] [⊕] [⬇] [✕]    │ ← Mobile bottom bar
└─────────────────────────────────────┘
```

**Desktop Layout** (unchanged for optimal desktop experience):
- Side navigation buttons (left/right of image)
- Top-right close button
- Bottom-right zoom controls

### Key Features Implemented ✅

1. **Click Outside to Close Modal**
   - Universal behavior on mobile and desktop
   - Smart zoom interaction: first click resets zoom, second closes modal
   - Proper event delegation for reliable detection

2. **Mobile Bottom Control Bar**
   - Semi-transparent backdrop with blur effect
   - Grouped button layout with logical organization
   - Thumb-accessible positioning (no reaching to top corners)

3. **Button Grouping Strategy**
   - **Navigation Group**: [Previous] [Next] with visual divider
   - **Control Group**: [Zoom Out] [Reset] [Zoom In] [Download] [Close]
   - **Visual Separation**: Thin divider line between groups

4. **Responsive Design**
   - `md:hidden` - Mobile-only controls
   - `hidden md:block` - Desktop-only controls
   - Consistent haptic feedback across all interactions

### Code Architecture ✅

**Key Components Enhanced**:
- `HighResImageViewer.tsx`: Complete mobile UX overhaul
- `PageTransition.tsx`: Smooth transitions between projects
- Background click handler with smart zoom behavior

**Mobile Control Bar CSS**:
```css
.mobile-control-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
}
```

### User Experience Benefits ✅

**Before**: 
- Navigation buttons overlapped image
- Close button required reaching to top-right
- Inconsistent click-outside behavior

**After**:
- Complete image viewing area unobstructed
- All controls accessible with thumb
- Consistent interaction patterns
- Professional mobile app feel

### Performance & Quality ✅
- **Bundle Size**: 154kB (minimal impact)
- **Build Status**: Zero errors, zero warnings
- **Cross-Platform**: iOS, Android, desktop compatibility
- **Accessibility**: Maintains keyboard navigation and ARIA labels

### Future Maintenance Notes ✅
- Mobile control bar automatically shows/hides based on screen size
- Button grouping can be easily modified by adjusting flex layouts
- Haptic feedback patterns easily customizable
- Click-outside behavior works reliably across all browsers