import Layout from '../../components/Layout';
import ProjectCard from '../../components/ProjectCard';
import TabsInterface from '../../components/TabsInterface';
import MixedPhotographyGallery from '../../components/MixedPhotographyGallery';
import { getProjectsByCategory } from '../../lib/markdown';

export default function Projects() {
  const brandingProjects = getProjectsByCategory('Branding');
  const photographyProjects = getProjectsByCategory('Photography');
  const illustrationProjects = getProjectsByCategory('Illustration');
  
  const tabs = [
    {
      id: 'branding',
      label: 'Branding',
      content: (
        brandingProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {brandingProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                slug={project.slug}
                featuredImage={project.featuredImage}
                featuredVideo={project.featuredVideo}
                priority={index < 4}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No branding projects found.</p>
          </div>
        )
      )
    },
    {
      id: 'photography',
      label: 'Photography',
      content: (
        <MixedPhotographyGallery 
          cmsPhotos={photographyProjects}
          username="eldhosekuriyan"
        />
      )
    },
    {
      id: 'illustration',
      label: 'Illustration',
      content: (
        illustrationProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {illustrationProjects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                title={project.title}
                slug={project.slug}
                featuredImage={project.featuredImage}
                featuredVideo={project.featuredVideo}
                priority={index < 4}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No illustration projects found.</p>
          </div>
        )
      )
    }
  ];

  // Filter out tabs with no content for cleaner UI
  const visibleTabs = tabs.filter(tab => {
    if (tab.id === 'branding') return brandingProjects.length > 0;
    if (tab.id === 'photography') return true; // Always show photography (has Unsplash fallback)
    if (tab.id === 'illustration') return illustrationProjects.length > 0;
    return false;
  });

  // Determine the default tab - use the first available tab
  const defaultTab = visibleTabs.length > 0 ? visibleTabs[0].id : 'photography';
  
  return (
    <Layout>
      <section className="py-2 md:py-4">
        <div className="mx-auto px-2 md:px-4">
          <TabsInterface tabs={visibleTabs} defaultTab={defaultTab} />
        </div>
      </section>
    </Layout>
  );
} 