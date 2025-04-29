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
      </div>
    </Link>
  );
} 