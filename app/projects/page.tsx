import Layout from '../../components/Layout';
import ProjectCard from '../../components/ProjectCard';
import { getAllProjects } from '../../lib/markdown';

export default function Projects() {
  const projects = getAllProjects();
  
  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-10 text-center">
            Projects
          </h1>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No projects found.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
} 