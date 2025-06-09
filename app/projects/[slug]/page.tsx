import Layout from '../../../components/Layout';
import ProjectMedia from '../../../components/ProjectMedia';
import OptimizedImage from '../../../components/OptimizedImage';
import ExpandableSummary from '../../../components/ExpandableSummary';
import { getAllProjects, getProjectData, getMarkdownContent } from '../../../lib/markdown';
import { ProjectMediaItem, ProjectImageItem, ProjectVideoItem, ProjectData } from '../../../lib/types';

/**
 * Combines and sorts project images and videos into a unified media array
 * @param projectData - The project data containing images and videos
 * @returns Sorted array of media items
 */
function combineAndSortMedia(projectData: ProjectData): ProjectMediaItem[] { 
  const combinedMedia: ProjectMediaItem[] = [];
  
  // Add images if they exist
  if (projectData.projectImages?.length) {
    projectData.projectImages.forEach((item: ProjectImageItem, index: number) => {
      combinedMedia.push({
        type: 'image',
        src: item.image,
        caption: item.caption,
        order: item.order ?? index + 1 
      });
    });
  }
  
  // Add videos if they exist
  if (projectData.projectVideos?.length) {
    projectData.projectVideos.forEach((item: ProjectVideoItem, index: number) => {
      combinedMedia.push({
        type: 'video',
        src: item.video,
        caption: item.caption,
        hasAudio: item.hasAudio ?? false, 
        order: item.order ?? (projectData.projectImages?.length ?? 0) + index + 1 
      });
    });
  }
  
  // Sort by order field
  return combinedMedia.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Generate static params for all projects at build time
 */
export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

/**
 * Project detail page component
 */
export default async function Project(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const { slug } = params;
  
  const projectData = getProjectData(slug);
  const mainSummaryHtml = await getMarkdownContent(projectData.mainSummary);
  
  // Determine which media to show as hero (video takes precedence)
  const hasHeroVideo = !!projectData.featuredVideo;
  const heroMediaSrc = hasHeroVideo ? projectData.featuredVideo : projectData.featuredImage;
  const heroHasAudio = projectData.featuredVideoHasAudio || false; 
  
  // Combine and sort all media items
  const sortedMedia = combineAndSortMedia(projectData);

  return (
    <Layout>
      <article className="">
        <div className="mx-auto">
          {/* Hero Media (Image or Video) - Full Width */}
          {heroMediaSrc && (
            <div className="w-full">
              {hasHeroVideo ? (
                <ProjectMedia
                  type="video"
                  src={heroMediaSrc}
                  alt={projectData.title}
                  hasAudio={heroHasAudio}
                />
              ) : (
                <OptimizedImage
                  src={heroMediaSrc}
                  alt={projectData.title}
                  priority={true}
                  aspectRatio="video"
                  quality={95}
                  sizes="100vw"
                />
              )}
            </div>
          )}
          
          {/* Content container for 60/40 split */}
          <div className="px-2 md:px-4 flex flex-col md:flex-row">
            
              {/* Project Info */}
              <div className="flex flex-col mb-12 md:w-3/5">
                {/* Project Title */}
              <h1 className="text-3xl font-normal my-6 md:my-8">{projectData.title}</h1>
                <div className="grid grid-cols-2 pb-4">
                  <h3 className="text-lg font-normal text-gray-500 mb-2">Services</h3>
                  <div className="text-lg text-gray-500">
                    {projectData.services.map((service, index) => (
                      <div key={index}>{service}</div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <h3 className="text-lg font-normal text-gray-500 mb-2">Year</h3>
                  <div className="text-lg text-gray-500">{projectData.year}</div>
                </div>
              </div>
              <div className="md:w-2/5  md:mt-24">
              {/* Project Summary - Use ExpandableSummary component */}
              <ExpandableSummary 
                shortSummary={projectData.shortSummary} 
                mainSummaryHtml={mainSummaryHtml} 
              />
            </div>
          </div>
          
          {/* Project Gallery - Combined Images and Videos - Full Width */}
          {sortedMedia.length > 0 && (
            <div className="w-full">
              {sortedMedia.map((item, index) => (
                <div key={index} className="">
                  {item.type === 'video' ? (
                    <ProjectMedia
                      type="video"
                      src={item.src}
                      caption={item.caption}
                      alt={`${projectData.title} video ${index + 1}`}
                      hasAudio={item.hasAudio}
                    />
                  ) : (
                    <OptimizedImage
                      src={item.src}
                      alt={`${projectData.title} image ${index + 1}`}
                      priority={index < 2}
                      aspectRatio="video"
                      quality={85}
                      sizes="100vw"
                    />
                  )}
                  {item.caption && (
                    <p className="text-sm text-gray-600 mt-2 px-2 md:px-4">{item.caption}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
} 