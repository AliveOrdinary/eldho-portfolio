import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ErrorBoundary from './ErrorBoundary';
import { getGlobalData } from '../lib/markdown';
import { DEFAULT_NAVIGATION } from '../lib/constants';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  let globalData;
  
  try {
    globalData = getGlobalData();
  } catch (error) {
    console.error('Failed to load global data:', error);
    globalData = {
      siteTitle: 'Portfolio',
      siteDescription: 'Portfolio Website',
      navigation: DEFAULT_NAVIGATION,
      footerText: 'Portfolio'
    };
  }
  
  return (
    <div className="w-full min-h-screen flex flex-col">
      <ErrorBoundary>
        <Header navigation={globalData.navigation} />
      </ErrorBoundary>
      
      <main className="flex-grow">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
} 