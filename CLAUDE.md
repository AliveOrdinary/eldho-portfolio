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