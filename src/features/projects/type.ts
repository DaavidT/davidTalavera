export type ProjectKeyFeature = {
  title: string;
  description: string;
};

export type ProjectGalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

export type ProjectContent = {
  lang: 'es' | 'en';
  slug: string;
  sortDate: string;
  title: string;
  description: string;
  image: string;
  imageAltText: string;
  isDraft: boolean;
  featured: boolean;
  tags: Array<string>;
  categoryText?: string;
  dateText?: string;
  detailedDescription?: string;
  keyFeatures: Array<ProjectKeyFeature>;
  galleryImages: Array<ProjectGalleryImage>;
  challenges?: string;
  learnings?: string;
  projectUrl?: string;
  codeUrl?: string;
};

// Compatibility alias for existing pages/components.
export type TranslatedProject = ProjectContent;

// Skills (remain i18n-driven from ui.ts)
export type Technology = {
  id: string;
  name: string;
};

export type SkillData = {
  id: string;
  iconName: string;
  technologies: Array<Technology>;
};

export type TranslatedSkill = SkillData & {
  title: string;
  description: string;
};
