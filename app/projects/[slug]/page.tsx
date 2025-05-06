import Layout from '../../../components/Layout';
import ProjectMedia from '../../../components/ProjectMedia';
import { getAllProjects, getProjectData, getMarkdownContent } from '../../../lib/markdown';
import { ProjectMediaItem, ProjectImageItem, ProjectVideoItem, ProjectData } from '../../../lib/types';

// Helper function to combine and sort media items
// Use ProjectData type directly
function combineAndSortMedia(projectData: ProjectData): ProjectMediaItem[] { 
  const combinedMedia: ProjectMediaItem[] = [];
  
  // Add images if they exist
  if (projectData.projectImages && projectData.projectImages.length > 0) {
    projectData.projectImages.forEach((item: ProjectImageItem, index: number) => {
      combinedMedia.push({
        type: 'image',
        src: item.image,
        caption: item.caption,
        order: item.order || index + 1 
      });
    });
  }
  
  // Add videos if they exist, passing hasAudio
  if (projectData.projectVideos && projectData.projectVideos.length > 0) {
    projectData.projectVideos.forEach((item: ProjectVideoItem, index: number) => {
      combinedMedia.push({
        type: 'video',
        src: item.video,
        caption: item.caption,
        hasAudio: item.hasAudio || false, 
        order: item.order || (projectData.projectImages?.length || 0) + index + 1 
      });
    });
  }
  
  // Adjust this if you have a unified projectMedia field
  // This part seems redundant if projectImages/projectVideos cover all media
  /*
  if (projectData.projectMedia && projectData.projectMedia.length > 0) {
     projectData.projectMedia.forEach(item => {
         if(item.type === 'video' && !item.hasOwnProperty('hasAudio')) {
             item.hasAudio = false; // Default if missing
         }
     });
    combinedMedia.push(...projectData.projectMedia);
  }
  */
  
  // Sort by order field
  return combinedMedia.sort((a, b) => (a.order || 0) - (b.order || 0)); // Add default for order
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
  // Use ProjectData type directly
  const projectData = getProjectData(slug) as ProjectData; 
  const mainSummaryHtml = await getMarkdownContent(projectData.mainSummary);
  
  // Determine which media to show as hero (video takes precedence)
  const hasHeroVideo = !!projectData.featuredVideo;
  const heroMediaType = hasHeroVideo ? 'video' : 'image';
  const heroMediaSrc = hasHeroVideo ? projectData.featuredVideo : projectData.featuredImage;
  const heroHasAudio = projectData.featuredVideoHasAudio || false; 
  
  // Combine and sort all media items
  const sortedMedia = combineAndSortMedia(projectData);

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
                  hasAudio={heroMediaType === 'video' ? heroHasAudio : undefined}
                />
              </div>
            )}
            
            <div className="flex flex-col px-4">
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
                    hasAudio={item.hasAudio}
                  />
                ))}
              </div>
            )}
            
          </div>
      </article>
    </Layout>
  );
} 