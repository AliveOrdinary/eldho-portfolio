import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import { getHomePageData, getFeaturedProjects } from '../lib/markdown';

export default function Home() {
  const homeData = getHomePageData();
  const featuredProjects = getFeaturedProjects();
  
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-20">
            <div className="max-w-3xl">
              <p className="text-xl leading-relaxed mb-12">
                {homeData.introText}
              </p>
              
              {homeData.whatIDo && (
                <div className="mb-12">
                  <h2 className="text-xl font-medium mb-4">What I Do</h2>
                  <p className="text-xl leading-relaxed">
                    {homeData.whatIDo}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {featuredProjects.length > 0 && (
            <div>
              <h2 className="text-2xl font-medium mb-8">
                {homeData.featuredProjectsHeading}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {featuredProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    title={project.title}
                    slug={project.slug}
                    featuredImage={project.featuredImage}
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
