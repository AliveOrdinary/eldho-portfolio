import Link from 'next/link';
import ProjectMedia from './ProjectMedia';

interface ProjectCardProps {
  title: string;
  slug: string;
  featuredImage?: string;
  featuredVideo?: string;
  shortSummary: string;
  year: number;
  services: string[];
}

export default function ProjectCard({
  title,
  slug,
  featuredImage,
  featuredVideo,
  shortSummary,
  year,
  services
}: ProjectCardProps) {
  const hasVideo = !!featuredVideo;
  const featuredContent = hasVideo ? featuredVideo : featuredImage;
  const mediaType = hasVideo ? 'video' : 'image';

  if (!featuredContent) {
    return null;
  }

  return (
    <Link href={`/projects/${slug}`} className="block">
      <div>
        <ProjectMedia 
          type={mediaType} 
          src={featuredContent} 
          alt={title}
        />
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