import Link from 'next/link';

export default function Footer(): React.ReactNode {
  return (
    <footer className="py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-normal text-gray-500 mb-2">Contact</h3>
            <p className="text-gray-700">eldhosekuriyan@gmail.com</p>
            <p className="text-gray-700">(+1) 437 559 2611</p>
          </div>
          
          <div>
            <h3 className="text-sm font-normal text-gray-500 mb-2">Social</h3>
            <ul className="space-y-1">
              <li>
                <Link href="https://linkedin.com" className="text-gray-700 hover:text-black transition-colors">
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="text-gray-700 hover:text-black transition-colors">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://behance.net" className="text-gray-700 hover:text-black transition-colors">
                  Behance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-500">©2025 AliveOrdinary</p>
        </div>
      </div>
    </footer>
  );
} 