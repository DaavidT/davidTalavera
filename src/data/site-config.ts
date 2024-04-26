export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    subscribe?: Subscribe;
    postsPerPage?: number;
    projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'David Talavera',
    subtitle: 'Ingeniero en Sistemas Computacionales',
    description: 'Sitio web personal de David Talavera, Ingeniero en Sistemas Computacionales, apasionado por la tecnología y el desarrollo de software. Aquí encontrarás artículos, proyectos y tutoriales sobre programación, desarrollo web y tecnología en general.',
    image: {
        src: '/david-preview.jpg',
        alt: 'David Talavera, página de inicio personal'
    },
    headerNavLinks: [
        {
            text: 'Inicio',
            href: '/'
        },
        {
            text: 'Proyectos',
            href: '/projects'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'Acerca de mí',
            href: '/about'
        },
        {
            text: 'Contacto',
            href: '/contact'
        },
        {
            text: 'Términos y condiciones',
            href: '/terms'
        },
    ],
    socialLinks: [
        {
            text: 'GitHub',
            href: 'https://github.com/DaavidT'
        },
        {
            text: 'Instagram',
            href: 'https://www.instagram.com/daavid_tal/'
        },
        {
            text: 'X/Twitter',
            href: 'https://twitter.com/'
        }
    ],
    hero: {
        title: 'No hemos de preocuparnos por vivir largos años, sino por vivirlos satisfactoriamente.',
        text: "Soy David Talavera, un ingeniero en sistemas computacionales dedicado a solucionar problemas, me gusta desarrollar y automatizar procesos, estoy estudiando las habilidades necesarias para ser un gran DevOps. Estoy en búsqueda de encontrar la especialización de IT que me apasione, he trabajado en desarrollo web, desarrollo móvil del lado del front y también del back, me gusta trabajar en equipo y encontrar la manera más rápida y eficiente de solucionar problemas.  Encuentra algunos de mis proyectos personales en <a href='https://github.com/DaavidT'>GitHub</a> también puedes seguirme en  <a href='https://www.instagram.com/daavid_tal/'>Instagram</a>.",
        image: {
            src: '/hero.jpg',
            alt: 'Una persona mirando el horizonte, sentado en una banqueta'
        },
        actions: [
            {
                text: 'Contáctame',
                href: '/contact'
            }
        ]
    },
    subscribe: {
        title: 'Subscribe to Dante Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
