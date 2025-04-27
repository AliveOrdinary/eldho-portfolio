export interface ProjectMediaItem {
  type: 'image' | 'video';
  src: string;
  caption?: string;
  order: number;
}

export interface ProjectData {
  title: string;
  slug: string;
  featuredImage?: string;
  featuredVideo?: string;
  shortSummary: string;
  mainSummary: string;
  year: number;
  services: string[];
  projectMedia: ProjectMediaItem[];
  featured: boolean;
  order: number;
  content?: string;
} 