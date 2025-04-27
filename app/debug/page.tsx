export default function DebugPage() {
  const imagePaths = [
    '/images/uploads/crums-hero.png',
    '/images/uploads/crums-packaging.png',
    '/images/uploads/crums-colors.png',
    '/images/uploads/crums-typography.png',
    '/images/uploads/crums-app.png',
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Image Debug Page</h1>
      <div className="grid gap-4">
        {imagePaths.map((path, i) => (
          <div key={i} className="border p-4">
            <p className="mb-2">{path}</p>
            <div className="relative w-full h-64 bg-gray-100">
              <img 
                src={path} 
                alt={`Test image ${i}`}
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 