import Link from 'next/link';
import Layout from '../../../components/Layout';
import ProjectMedia from '../../../components/ProjectMedia';
import { getAllProjects, getProjectData, getMarkdownContent } from '../../../lib/markdown';
import { ProjectMediaItem } from '../../../lib/types';

interface ProjectImageItem {
  image: string;
  caption?: string;
  order?: number;
}

interface ProjectVideoItem {
  video: string;
  caption?: string;
  order?: number;
}

interface ProjectDataWithMedia {
  title: string;
  slug: string;
  featuredImage?: string;
  featuredVideo?: string;
  shortSummary: string;
  mainSummary: string;
  year: number;
  services: string[];
  projectImages?: ProjectImageItem[];
  projectVideos?: ProjectVideoItem[];
  projectMedia?: ProjectMediaItem[];
  [key: string]: unknown;
}

// Helper function to combine and sort media items
function combineAndSortMedia(projectData: ProjectDataWithMedia): ProjectMediaItem[] {
  const combinedMedia: ProjectMediaItem[] = [];
  
  // Add images if they exist
  if (projectData.projectImages && projectData.projectImages.length > 0) {
    projectData.projectImages.forEach((item: ProjectImageItem, index: number) => {
      combinedMedia.push({
        type: 'image',
        src: item.image,
        caption: item.caption,
        order: item.order || index + 1 // Use order if available, otherwise use index
      });
    });
  }
  
  // Add videos if they exist
  if (projectData.projectVideos && projectData.projectVideos.length > 0) {
    projectData.projectVideos.forEach((item: ProjectVideoItem, index: number) => {
      combinedMedia.push({
        type: 'video',
        src: item.video,
        caption: item.caption,
        order: item.order || (projectData.projectImages?.length || 0) + index + 1 // Place after images by default
      });
    });
  }
  
  // Add project media if it exists (this is for the new unified approach)
  if (projectData.projectMedia && projectData.projectMedia.length > 0) {
    combinedMedia.push(...projectData.projectMedia);
  }
  
  // Sort by order field
  return combinedMedia.sort((a, b) => a.order - b.order);
}

// Correct way to type this in Next.js 15
export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Use proper typing with correct params structure
export default async function Project(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const slug = params.slug;
  const projectData = getProjectData(slug);
  const mainSummaryHtml = await getMarkdownContent(projectData.mainSummary);
  
  // Determine which media to show as hero (video takes precedence)
  const hasHeroVideo = !!projectData.featuredVideo;
  const heroMediaType = hasHeroVideo ? 'video' : 'image';
  const heroMediaSrc = hasHeroVideo ? projectData.featuredVideo : projectData.featuredImage;
  
  // Combine and sort all media items
  const sortedMedia = combineAndSortMedia(projectData as unknown as ProjectDataWithMedia);

  return (
    <Layout>
      <article className="">
        
          <div className="mx-auto">
            {/* Hero Media (Image or Video) */}
            {heroMediaSrc && (
              <div className="">
                <ProjectMedia
                  type={heroMediaType}
                  src={heroMediaSrc}
                  alt={projectData.title}
                />
              </div>
            )}
            
            {/* Project Title */}
            <h1 className="text-3xl font-normal mb-6">{projectData.title}</h1>
            
            {/* Project Info */}
            <div className="grid grid-cols-2 mb-12">
              <div>
                <h3 className="text-sm font-normal text-gray-500 mb-2">Services</h3>
                <div className="text-lg">
                  {projectData.services.map((service, index) => (
                    <div key={index}>{service}</div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-normal text-gray-500 mb-2">Year</h3>
                <div className="text-lg">{projectData.year}</div>
              </div>
            </div>
            
            {/* Project Summary */}
            <div className="mb-12">
              <p className="text-xl leading-relaxed mb-6">
                {projectData.shortSummary}
              </p>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: mainSummaryHtml }} 
              />
            </div>
            
            {/* Project Gallery - Combined Images and Videos */}
            {sortedMedia.length > 0 && (
              <div className="">
                {sortedMedia.map((item, index) => (
                  <ProjectMedia
                    key={index}
                    type={item.type}
                    src={item.src}
                    caption={item.caption}
                    alt={`${projectData.title} ${item.type} ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Back Link */}
            <div className="mt-16 pt-6 border-t border-gray-100">
              <Link 
                href="/projects" 
                className="text-gray-700 hover:text-black transition-colors"
              >
                ← Back to Works
              </Link>
            </div>
          </div>
      </article>
    </Layout>
  );
} 