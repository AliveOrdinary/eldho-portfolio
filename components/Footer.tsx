import Link from 'next/link';
import { ContactPageData } from '../lib/types';

interface FooterProps {
  contactData: ContactPageData;
}

export default function Footer({ contactData }: FooterProps): React.ReactNode {
  return (
    <footer className="py-2 md:py-4 border-t border-gray-100">
      <div className="mx-auto px-2 md:px-4">
        {/* Contact Section - Top */}
        <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[3fr_2fr] gap-4 items-start mb-6">
          <div className="text-sm font-normal text-gray-500">Contact</div>
          <ul className="space-y-1">
            <li>
              <Link href={`mailto:${contactData.email}`} className="text-gray-700 hover:text-black transition-colors">
                {contactData.email}
              </Link>
            </li>
            {contactData.phone && (
              <li>
                <Link href={`tel:${contactData.phone}`} className="text-gray-700 hover:text-black transition-colors">
                  {contactData.phone}
                </Link>
              </li>
            )}
          </ul>
        </div>
        
        {/* Social Section - Bottom */}
        <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[3fr_2fr] gap-4 items-start mb-6">
          <div className="text-sm font-normal text-gray-500">Social</div>
          <ul className="space-y-1">
            {contactData.socialMedia.map((social, index) => (
              <li key={index}>
                <Link href={social.url} className="text-gray-700 hover:text-black transition-colors">
                  {social.platform}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="py-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">©2025 AliveOrdinary</p>
        </div>
      </div>
    </footer>
  );
} 