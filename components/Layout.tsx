import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
import PageTransition from './PageTransition';
import { getGlobalData, getContactPageData } from '../lib/markdown';
import { DEFAULT_NAVIGATION } from '../lib/constants';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  let globalData;
  let contactData;
  
  try {
    globalData = getGlobalData();
    contactData = getContactPageData();
  } catch (error) {
    console.error('Failed to load global data:', error);
    globalData = {
      siteTitle: 'Portfolio',
      siteDescription: 'Portfolio Website',
      navigation: DEFAULT_NAVIGATION,
      footerText: 'Portfolio'
    };
    contactData = {
      title: 'Contact',
      email: 'contact@example.com',
      phone: '+1 (555) 123-4567',
      socialMedia: [
        { platform: 'Instagram', url: '#' },
        { platform: 'LinkedIn', url: '#' },
        { platform: 'Behance', url: '#' }
      ]
    };
  }
  
  return (
    <div className="w-full min-h-screen flex flex-col">
      <ErrorBoundary>
        <Header navigation={globalData.navigation} />
      </ErrorBoundary>
      
      <main className="flex-grow">
        <ErrorBoundary>
          <PageTransition>
            {children}
          </PageTransition>
        </ErrorBoundary>
      </main>
      
      <ErrorBoundary>
        <Footer contactData={contactData} />
      </ErrorBoundary>
    </div>
  );
}