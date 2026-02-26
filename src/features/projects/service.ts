import { getCollection, type CollectionEntry } from 'astro:content';
import { ui, defaultLanguage, type LanguageCode } from '@/i18n/ui';
import type {
  ProjectContent,
  SkillData,
  TranslatedProject,
  TranslatedSkill,
} from './type';

type ProjectEntry = CollectionEntry<'projects'>;

function mapProjectEntry(entry: ProjectEntry): ProjectContent {
  const data = entry.data;
  return {
    lang: data.lang,
    slug: data.slug,
    sortDate: data.sortDate.toISOString(),
    title: data.title,
    description: data.description,
    image: data.image,
    imageAltText: data.imageAltText,
    isDraft: data.isDraft,
    featured: data.featured ?? false,
    tags: data.tags ?? [],
    categoryText: data.categoryText,
    dateText: data.dateText,
    detailedDescription: data.detailedDescription,
    keyFeatures: data.keyFeatures ?? [],
    galleryImages: data.galleryImages ?? [],
    challenges: data.challenges,
    learnings: data.learnings,
    projectUrl: data.projectUrl,
    codeUrl: data.codeUrl,
  };
}

function sortByDateDesc(a: ProjectContent, b: ProjectContent) {
  return (
    new Date(b.sortDate).valueOf() -
    new Date(a.sortDate).valueOf()
  );
}

async function getAllPublishedProjects() {
  const entries = await getCollection('projects', ({ data }) => data.isDraft !== true);
  return entries.map(mapProjectEntry);
}

export async function getProjectsByLang(
  lang: LanguageCode | undefined
): Promise<Array<TranslatedProject>> {
  const currentLang = lang ?? defaultLanguage;
  const projects = await getAllPublishedProjects();

  const esProjects = projects.filter((project) => project.lang === 'es');
  const enProjects = projects.filter((project) => project.lang === 'en');

  if (currentLang === 'en') {
    const enBySlug = new Map(enProjects.map((project) => [project.slug, project]));
    const esBySlug = new Map(esProjects.map((project) => [project.slug, project]));

    const merged = new Map<string, ProjectContent>();

    for (const [slug, project] of esBySlug.entries()) {
      merged.set(slug, enBySlug.get(slug) ?? project);
    }

    for (const [slug, project] of enBySlug.entries()) {
      if (!merged.has(slug)) {
        merged.set(slug, project);
      }
    }

    return Array.from(merged.values()).sort(sortByDateDesc);
  }

  return esProjects.sort(sortByDateDesc);
}

export async function getProjectBySlugWithFallback(
  slug: string,
  lang: LanguageCode | undefined
): Promise<TranslatedProject | undefined> {
  const currentLang = lang ?? defaultLanguage;
  const projects = await getAllPublishedProjects();

  const exact = projects.find(
    (project) => project.slug === slug && project.lang === currentLang
  );
  if (exact) {
    return exact;
  }

  if (currentLang === 'en') {
    const fallbackEs = projects.find(
      (project) => project.slug === slug && project.lang === 'es'
    );
    if (fallbackEs) {
      return fallbackEs;
    }
  }

  return projects.find((project) => project.slug === slug);
}

export async function getTranslatedProjects(
  lang: LanguageCode | undefined
): Promise<Array<TranslatedProject>> {
  return getProjectsByLang(lang);
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectContent | undefined> {
  return getProjectBySlugWithFallback(slug, defaultLanguage);
}

export async function getTranslatedProjectBySlug(
  slug: string,
  lang: LanguageCode | undefined
): Promise<TranslatedProject | undefined> {
  return getProjectBySlugWithFallback(slug, lang);
}

// Skills
export const skillsList: Array<SkillData> = [
  {
    id: 'frontendDevelopment',
    iconName: 'MonitorSmartphone',
    technologies: [
      { id: 'astro', name: 'Astro' },
      { id: 'nextjs', name: 'NextJS' },
      { id: 'javascript', name: 'JavaScript' },
      { id: 'typescript', name: 'TypeScript' },
      { id: 'react', name: 'React' },
      { id: 'tailwindcss', name: 'TailwindCSS' },
    ],
  },
  {
    id: 'backendDevelopment',
    iconName: 'ServerCog',
    technologies: [
      { id: 'nodejs', name: 'Node.js' },
      { id: 'django', name: 'Django' },
      { id: 'python', name: 'Python' },
      { id: 'postgresql', name: 'PostgreSQL' },
      { id: 'mongodb', name: 'MongoDB' },
      { id: 'git', name: 'Github' },
    ],
  },
  {
    id: 'uiUxDesign',
    iconName: 'Rocket',
    technologies: [
      { id: 'vercel', name: 'Vercel' },
      { id: 'amazonservices', name: 'SiAmazon' },
    ],
  },
  {
    id: 'devOps',
    iconName: 'Network',
    technologies: [
      { id: 'githubactions', name: 'GithubActions' },
      { id: 'docker', name: 'Docker' },
    ],
  },
];

export function getTranslatedSkills(
  lang: LanguageCode | undefined
): Array<TranslatedSkill> {
  const currentLang = lang ?? defaultLanguage;

  return skillsList.map((skill) => {
    type SkillIdKey =
      keyof (typeof ui)[typeof defaultLanguage]['skillsContent'];
    const currentSkillId = skill.id as SkillIdKey;

    const skillContentSource = ui[currentLang]?.skillsContent?.[currentSkillId]
      ? ui[currentLang].skillsContent
      : ui[defaultLanguage].skillsContent;

    const skillTranslations = skillContentSource[currentSkillId];

    if (!skillTranslations) {
      console.warn(
        `Translation missing for skill ID: ${skill.id} in language: ${lang}. Using default values.`
      );
      return {
        ...skill,
        title: skill.id,
        description: 'Description missing for this skill.',
      };
    }

    return {
      ...skill,
      title: skillTranslations.title,
      description: skillTranslations.description,
    };
  });
}
