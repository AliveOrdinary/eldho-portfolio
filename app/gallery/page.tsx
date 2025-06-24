import UnsplashGallery from '@/components/UnsplashGallery';

export const metadata = {
  title: 'Photography by Eldhose Kuriyan',
  description: 'Explore the stunning photography work of Eldhose Kuriyan',
};

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Photography</h1>
          <p className="text-gray-600 text-lg">
            Stunning photography by Eldhose Kuriyan
          </p>
        </div>
        
        <UnsplashGallery username="eldhosekuriyan" />
      </div>
    </div>
  );
}