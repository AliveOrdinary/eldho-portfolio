import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import { getHomePageData, getFeaturedProjects } from '../lib/markdown';

export default function Home() {
  const homeData = getHomePageData();
  const featuredProjects = getFeaturedProjects();
  
  return (
    <Layout>
      <section className="py-8 md:py-10">
        <div className="mx-auto">
          <div className="mb-12 px-4">
            <div className="max-w-3xl">
              <p className="text-xl leading-relaxed mb-12">
                {homeData.introText}
              </p>
            </div>
          </div>
          
          {featuredProjects.length > 0 && (
            <div>
              <div className="w-full">
                {featuredProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    title={project.title}
                    slug={project.slug}
                    featuredImage={project.featuredImage}
                    featuredVideo={project.featuredVideo}
                    shortSummary={project.shortSummary}
                    year={project.year}
                    services={project.services}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
