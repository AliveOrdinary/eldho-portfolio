import Link from 'next/link';

interface ProjectCardProps {
  title: string;
  slug: string;
  featuredImage: string;
  shortSummary: string;
  year: number;
  services: string[];
}

export default function ProjectCard({
  title,
  slug,
  featuredImage,
  shortSummary,
  year,
  services
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="block">
      <div>
        <div className="relative aspect-video w-full mb-4">
          <img
            src={featuredImage}
            alt={title}
            style={{ 
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
        <h3 className="text-2xl font-normal mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{shortSummary}</p>
        <div className="flex flex-wrap gap-2">
          <div className="text-sm text-gray-500">
            Services: {services.join(', ')}
          </div>
          <div className="text-sm text-gray-500">
            Year: {year}
          </div>
        </div>
      </div>
    </Link>
  );
} 