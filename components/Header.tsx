import Link from 'next/link';

interface NavigationItem {
  text: string;
  url: string;
}

interface HeaderProps {
  navigation: NavigationItem[];
}

export default function Header({ navigation }: HeaderProps) {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-medium">
            Eldho.
          </Link>
        </div>
        
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