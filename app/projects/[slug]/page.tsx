import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import { getAllProjects, getProjectData, getMarkdownContent } from '../../../lib/markdown';

interface ProjectParams {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function Project({ params }: ProjectParams) {
  const { slug } = params;
  const projectData = getProjectData(slug);
  const mainSummaryHtml = await getMarkdownContent(projectData.mainSummary);
  
  return (
    <Layout>
      <article className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Image */}
            {projectData.featuredImage && (
              <div className="mb-8">
                <div className="relative w-full aspect-video">
                  <Image
                    src={projectData.featuredImage}
                    alt={projectData.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority
                  />
                </div>
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
            
            {/* Project Gallery */}
            {projectData.projectImages && projectData.projectImages.length > 0 && (
              <div className="space-y-8">
                {projectData.projectImages.map((item, index) => (
                  <div key={index}>
                    <div className="relative w-full aspect-video mb-2">
                      <Image
                        src={item.image}
                        alt={item.caption || `${projectData.title} image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 1200px"
                      />
                    </div>
                    {item.caption && (
                      <p className="text-sm text-gray-600">{item.caption}</p>
                    )}
                  </div>
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
        </div>
      </article>
    </Layout>
  );
} 