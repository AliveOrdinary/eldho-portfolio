import Image from 'next/image';
import Layout from '../../components/Layout';
import { getAboutPageData } from '../../lib/markdown';

export default function About() {
  const aboutData = getAboutPageData();
  
  return (
    <Layout>
      <section className="py-2">
        <div className="mx-auto px-4">
          <div className="mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-16">
              <div className="md:w-2/3">
                <p className="text-xl leading-relaxed mb-12">
                  {aboutData.bio}
                </p>
                
                {aboutData.whatIDo && (
                  <div className="mb-12">
                    <h2 className="text-xl font-medium mb-4">What I Do</h2>
                    <p className="text-xl leading-relaxed">
                      {aboutData.whatIDo}
                    </p>
                  </div>
                )}
                
                {aboutData.experience && aboutData.experience.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-xl font-medium mb-4">Where I&apos;ve Been</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      {aboutData.experience.map((item, index) => (
                        <li key={index} className="text-lg">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {aboutData.achievements && aboutData.achievements.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-xl font-medium mb-4">Achievements</h2>
                    <div className="space-y-6">
                      {aboutData.achievements.map((achievement, index) => (
                        <div key={index} className="flex gap-8">
                          <div className="text-gray-500">
                            ({achievement.year})
                          </div>
                          <div className="text-lg font-medium">
                            {achievement.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:w-1/3">
                <div className="sticky top-8">
                  {aboutData.profileImage && (
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
                      <Image
                        width={1000}
                        height={1000}
                        src={aboutData.profileImage}
                        alt="Eldhose Kuriyan"
                        style={{ 
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 