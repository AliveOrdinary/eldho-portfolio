import Link from 'next/link';
import { getContactPageData } from '../lib/markdown';

export default function Footer(): React.ReactNode {
  const contactData = getContactPageData();
  return (
    <footer className="py-2 md:py-4 border-t border-gray-100">
      <div className=" mx-auto px-2 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-normal text-gray-500 mb-2">Contact</h3>
            <p className="text-gray-700">{contactData.email}</p>
            <p className="text-gray-700">{contactData.phone}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-normal text-gray-500 mb-2">Social</h3>
            <ul className="space-y-1">
              <li>
                <Link href={contactData.socialMedia[1].url} className="text-gray-700 hover:text-black transition-colors">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href={contactData.socialMedia[0].url} className="text-gray-700 hover:text-black transition-colors">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href={contactData.socialMedia[2].url} className="text-gray-700 hover:text-black transition-colors">
                  Behance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="py-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">©2025 AliveOrdinary</p>
        </div>
      </div>
    </footer>
  );
} 