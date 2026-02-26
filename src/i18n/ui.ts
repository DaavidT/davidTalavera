export const languages: Record<'es' | 'en', { name: string; flag: string }> = {
  en: { name: 'English', flag: 'us' },
  es: { name: 'Español', flag: 'es' },
} as const;

export const defaultLanguage = 'es';

export type LanguageCode = keyof typeof languages;

export const ui = {
  es: {
  projectsContent: {
    sampleProject: {
      title: "ROC - Robotic Operating Center",
      description:
        "Pagina de información para una empresa que desarrolla automatizaciones.",
      imageAltText: "Imagen de marcador para el proyecto de ejemplo",
      categoryText: "Página Web",
      dateText: "Enero de 2025",
      detailedDescription:
        "Se desarrollo una página web informativa para una empresa de grupo salinas llamada ROC - Robotic Operating Center, que se dedica a crear soluciones de automatización robótica para la industria. El sitio presenta los servicios de la empresa, una calculadora de cotización y un formulario de contacto.",
      keyFeatures: {
        responsiveDesign: {
          title: "Información accesible en cualquier dispositivo",
          description: "El proyecto se adapta a todos los tamanos de pantalla.",
        },
        contentManagement: {
          title: "Calculadora de cotización",
          description:
            "Se transformo una hoja de calculo de cotización en una calculadora interactiva en la página, permitiendo a los usuarios obtener cotizaciones rápidas para los servicios de automatización robótica.",
        },
      },
      galleryImages: {
        // sampleGalleryImage1: { // Si activas la galeria para el ejemplo
        //   alt: 'Texto alternativo para la imagen de galeria 1',
        //   caption: 'Leyenda para la imagen de galeria 1',
        // },
      },
      challenges:
        "Descripcion de los desafios encontrados durante la creacion de este proyecto de ejemplo.",
      learnings:
        "Descripcion de los aprendizajes obtenidos en este proyecto de ejemplo.",
    },
  },

  skillsContent: {
    frontendDevelopment: {
      title: "Desarrollo Frontend",
      description:
        "Páginas de contacto o informativas en Astro, ultrapersonalizables, interactivas y rápidas.\nAplicacion en Next.js para una empresa de seguros.",
    },
    backendDevelopment: {
      title: "Desarrollo Backend",
      description:
        "Core de una emprea se seguros en Django.\nCalculadora de cotizaciones en Node.js.\nAplicación web para llevar una agenda de citas.",
    },
    uiUxDesign: {
      title: "Despliegue de aplicaciones en la nube",
      description: "AWS\nVercel\nGithub Actions",
    },
    devOps: {
      title: "DevOps",
      description: "Despliegue con Github Actions a un servidor VPS en AWS.",
    },
  },

  site: {
    title: "David Talavera - Portafolio",
    description:
      "Un portafolio moderno y de alto rendimiento para mostrar mis proyectos y habilidades como desarrollador de software.",
  },

  nav: {
    home: "Inicio",
    blog: "Blog",
    contact: "Contacto",
    projects: "Proyectos",
  },

  footer: {
    rights: "Todos los derechos reservados.",
  },

  homePage: {
    pageTitle: "Inicio | Desarrollador de Software",
    pageDescription:
      "Bienvenido al portafolio de David Talavera, desarrollador de Software apasionado por crear experiencias web innovadoras.",
    heroGreeting: "Hola, soy David Talavera",
    heroSubtitlePart1: "Desarrollador de Software",
    heroSubtitlePart2:
      "Apasionado por la Inteligencia Artificial y el Desarrollo Web",
    heroIntroduction:
      "Soy un ingeniero en sistemas computacionales, tengo 23 años y me especializo en el desarrollo de software. Actualmente estoy trabajando en la banca. Me apasiona crear soluciones modernas y estoy estudiando infraestructura en la nube para ampliar mis habilidades.",
    heroViewWorkButton: "Conoce mi trabajo",
    heroContactButton: "Déjame un mensaje",
    heroImageAlt:
      "Ilustracion que representa a David Talavera o un concepto de desarrollo",
    featuredProjectsTitle: "Mis proyectos mas recientes",
    featuredProjectsDescription:
      "Estos son algunos de los proyectos en los que he trabajado recientemente en mis tiempos libres.",
    projectCardViewProject: "Ver proyecto",
    projectCardViewCode: "Ver codigo",
    imageNotAvailable: "Imagen no disponible por ahora",
    mySkillsTitle: "Mis Habilidades",
    mySkillsDescription:
      "Estoy mejorando constantemente mis habilidades para ofrecer lo mejor en cada proyecto. Estas son algunas de las areas en las que me destaco.",
  },

  blogPage: {
    pageTitle: "Mi Blog",
    pageDescription:
      "Articulos y reflexiones sobre desarrollo web, arquitectura de software y nuevas tecnologias.",
    title: "Mi Blog",
    description:
      "Articulos y reflexiones sobre desarrollo web, arquitectura de software y nuevas tecnologias.",
    comingSoon:
      "Los articulos del blog apareceran aqui pronto. Vuelve mas tarde.",
    heroImageAlt: "Imagen de portada del articulo: ",
    publishedOn: "Publicado el: ",
    readMore: "Leer mas",
    readingTimeSuffix: "min de lectura",
    searchPlaceholder: "Buscar articulos...",
    filterByTagButtonLabel: "Filtrar por etiqueta",
    noTagFound: "No se encontro ninguna etiqueta.",
    selectTagCommandPlaceholder: "Buscar etiqueta...",
    allTagsLabel: "Todas las etiquetas",
    noPostsFound: "No se encontraron articulos.",
  },

  blogPost: {
    publishedOn: "Publicado el: ",
    updatedOn: "Actualizado el: ",
    heroImageAlt: "Imagen de portada del articulo: ",
    backToList: "Volver a la lista de articulos",
    readingTimeSuffix: "min de lectura",
    relatedPostsTitle: "Tambien te recomiendo:",
    readMore: "Leer mas",
    editOnGithub: "Proponer un cambio en GitHub",
  },

  toc: {
    title: "Indice del articulo",
  },

  contactPage: {
    pageTitle: "Contacto",
    pageDescription:
      "Hablame de tu idea, proyecto, me gustan los retos. Tambien si quieres platicar sobre tecnologia, inteligencia artificial o cualquier tema relacionado, no dudes en contactarme.",
    title: "Contacto",
    description:
      "Hablame de tu idea, proyecto, me gustan los retos. Tambien si quieres platicar sobre tecnologia, inteligencia artificial o cualquier tema relacionado, no dudes en contactarme.",

    formTitle: "Enviar un mensaje",
    firstNameLabel: "Nombre",
    lastNameLabel: "Apellido",
    emailLabel: "Email",
    messageLabel: "Mensaje",
    sendButtonLabel: "Enviar",
    firstNamePlaceholder: "Tu nombre",

    lastNamePlaceholder: "Tu apellido",
    emailPlaceholder: "Tu correo electronico",
    messagePlaceholder: "Tu mensaje aqui...",
    toastSuccessMessageSent: "Mensaje enviado con exito.",
    toastErrorFailedToSend: "No se pudo enviar el mensaje.",
    toastErrorUnexpected: "Ocurrio un error inesperado.",
    toastErrorDetails: "Detalles del error:",
    toastErrorValidationFailed: "La validacion del formulario fallo.",
    toastErrorTooManyRequests:
      "Demasiados intentos. Espera un momento antes de volver a enviar.",
  },

  projectDetailPage: {
    backToProjects: "Volver a Proyectos",
    categoryLabel: "Categoria:",
    dateLabel: "Fecha:",
    aboutTitle: "Sobre este proyecto",
    keyFeaturesTitle: "Caracteristicas Clave",
    galleryTitle: "Galeria",
    challengesTitle: "Desafios Encontrados",
    learningsTitle: "Aprendizajes",
    visitProjectButton: "Visitar el Proyecto",
    viewCodeButton: "Ver el Codigo",
  },

  projectsPage: {
    title: "Mis Proyectos",
    metaTitle: "Mis Proyectos | Portafolio",
    metaDescription: "Descubre todos los proyectos.",
    noProjects: "No hay proyectos para mostrar por el momento.",
    noProjectsDescription: "Parece que aun no tienes proyectos para mostrar.",
  },

  notFoundPage: {
    pageTitle: "Pagina No Encontrada",
    title: "Ups, Pagina No Encontrada",
    message:
      "Lo sentimos, la pagina que buscas no parece existir. Verifica la URL o vuelve al inicio.",
    homeLink: "Volver al Inicio",
  },

  tipsPage: {
    metaTitle: "Consejos de Desarrollo",
    metaDescription:
      "Descubre consejos y recomendaciones rapidas sobre desarrollo web y cloud computing.",
    description:
      "Descubre consejos y recomendaciones rapidas sobre desarrollo web y cloud computing.",
    title: "Nuestros Ultimos Consejos",
    noTips: "No hay consejos para mostrar por el momento.",
    readTip: "Leer consejo",
    backToList: "Volver a la lista de consejos",
    featuredTips: "Consejos recomendados",
    allTips: "Todos los consejos",
    tipsAvailable: "consejos disponibles",
    tipAvailable: "consejo disponible",
    editOnGithub: "Editar en GitHub",
  },

  zodErrors: {
    // Errores comunes
    invalid_type: "Tipo invalido.",
    invalid_type_received_undefined: "Este campo es obligatorio.", // Para campos requeridos (fallback)
    required_field_custom: "El campo {fieldName} es obligatorio.",
    // Errores de string
    too_small_string_minimum: "Debe tener al menos {minimum} caracteres.",
    too_big_string_maximum: "No debe superar los {maximum} caracteres.",
    invalid_string_email: "Correo electronico invalido.",
    invalid_string_url: "URL invalida.",
    invalid_string_uuid: "UUID invalido.",
    // Puedes agregar mas mensajes especificos si es necesario
  },
},
  en: {
    projectsContent: {
      sampleProject: {
        title: 'ROC - Robotic Operating Center',
        description: 'Info website for a company that builds automation.',
        imageAltText: 'Placeholder image for the sample project',
        categoryText: 'Website',
        dateText: 'January 2025',
        detailedDescription:
          'I built an info website for ROC - Robotic Operating Center, a Grupo Salinas company. They build robotic automation for industry. The site shows services, a quote tool, and a contact form.',
        keyFeatures: {
          responsiveDesign: {
            title: 'Works on all devices',
            description: 'The website adapts to phone, tablet, and desktop screens.',
          },
          contentManagement: {
            title: 'Quote calculator',
            description:
              'I turned a quote spreadsheet into an interactive web calculator so users can get fast estimates.',
          },
        },
        galleryImages: {
          // sampleGalleryImage1: { // Enable this if you use gallery images
          //   alt: 'Alt text for gallery image 1',
          //   caption: 'Caption for gallery image 1',
          // },
        },
        challenges:
          'One challenge was turning a complex spreadsheet flow into a clear and simple UI.',
        learnings:
          'I learned how to design better business tools for real users and real data.',
      },
    },
    skillsContent: {
      frontendDevelopment: {
        title: 'Frontend Development',
        description:
          'Modern web interfaces with HTML, CSS, JavaScript, and TypeScript./bFocus on speed, access, and good user experience.',
      },
      backendDevelopment: {
        title: 'Backend Development',
        description:
          'Server logic and APIs with Node.js./bREST services that are easy to scale and maintain.',
      },
      uiUxDesign: {
        title: 'UI/UX Design',
        description:
          'User-focused interface design in Figma./bPrototypes and responsive design for many devices.',
      },
      devOps: {
        title: 'DevOps',
        description:
          'Version control and team workflows with Git./bContainer setup and service deploys with Docker.',
      },
    },
    site: {
      title: 'David Talavera - Portfolio',
      description:
        'A modern and fast portfolio to show my projects and software skills.',
    },
    nav: {
      home: 'Home',
      blog: 'Blog',
      contact: 'Contact',
      projects: 'Projects',
      tips: 'Tips',
    },
    footer: {
      rights: 'All rights reserved.',
    },
    homePage: {
      pageTitle: 'Home | Software Developer',
      pageDescription:
        'Welcome to David Talavera portfolio. I am a software developer who likes building modern web experiences.',
      heroGreeting: "Hi, I'm David Talavera",
      heroSubtitlePart1: 'Software Developer',
      heroSubtitlePart2: 'AI and Web Development Enthusiast',
      heroIntroduction:
        'I am a systems engineer, 23 years old, focused on software development. I currently work in banking. I like building modern solutions and learning cloud infrastructure.',
      heroViewWorkButton: 'See my work',
      heroContactButton: 'Send me a message',
      heroImageAlt:
        'Illustration of David Talavera or a software concept',
      featuredProjectsTitle: 'My latest projects',
      featuredProjectsDescription:
        'Here are some projects I built recently in my free time.',
      projectCardViewProject: 'View project',
      projectCardViewCode: 'View code',
      imageNotAvailable: 'Image not available yet',
      mySkillsTitle: 'My Skills',
      mySkillsDescription:
        'I keep improving my skills to do better work in every project. These are some areas where I stand out.',
    },
    blogPage: {
      pageTitle: 'My Blog',
      pageDescription:
        'Posts and notes about web development, software design, and new tech.',
      title: 'My Blog',
      description:
        'Posts and notes about web development, software design, and new tech.',
      comingSoon:
        'Blog posts will be here soon. Come back later.',
      heroImageAlt: 'Cover image for post: ',
      publishedOn: 'Published on: ',
      readMore: 'Read more',
      readingTimeSuffix: 'min read',
      searchPlaceholder: 'Search posts...',
      filterByTagButtonLabel: 'Filter by tag',
      noTagFound: 'No tag found.',
      selectTagCommandPlaceholder: 'Search tag...',
      allTagsLabel: 'All tags',
      noPostsFound: 'No posts found.',
    },
    blogPost: {
      publishedOn: 'Published on: ',
      updatedOn: 'Updated on: ',
      heroImageAlt: 'Cover image for post: ',
      backToList: 'Back to post list',
      readingTimeSuffix: 'min read',
      relatedPostsTitle: 'You may also like:',
      readMore: 'Read more',
      editOnGithub: 'Suggest a change on GitHub',
    },
    toc: {
      title: 'Table of contents',
    },
    contactPage: {
      pageTitle: 'Contact Me',
      pageDescription:
        'Tell me about your idea or project. I like hard challenges. If you want to talk about tech or AI, send me a message.',
      title: 'Contact Me',
      description:
        'Tell me about your idea or project. I like hard challenges. If you want to talk about tech or AI, send me a message.',

      formTitle: 'Send a message',
      firstNameLabel: 'First name',
      lastNameLabel: 'Last name',
      emailLabel: 'Email',
      messageLabel: 'Message',
      sendButtonLabel: 'Send',
      firstNamePlaceholder: 'Your first name',
      lastNamePlaceholder: 'Your last name',
      emailPlaceholder: 'Your email',
      messagePlaceholder: 'Write your message...',
      calendarTitle: 'Book a Meeting',
      calendarDescription:
        'Do you want to talk live? Book a time in my calendar.',
      calendarButtonLabel: 'See my time slots',
      calendarLinkLabel: 'Open my calendar',
      calendarPlaceHolder: 'Google Calendar link will be here soon.',
      orSeparatorText: 'OR',
      toastSuccessMessageSent: 'Message sent successfully.',
      toastErrorFailedToSend: 'Could not send message.',
      toastErrorUnexpected: 'An unexpected error happened.',
      toastErrorDetails: 'Error details:',
      toastErrorValidationFailed: 'Form validation failed.',
      toastErrorTooManyRequests:
        'Too many attempts. Please wait a moment before trying again.',
    },
    projectDetailPage: {
      backToProjects: 'Back to Projects',
      categoryLabel: 'Category:',
      dateLabel: 'Date:',
      aboutTitle: 'About this project',
      keyFeaturesTitle: 'Key features',
      galleryTitle: 'Gallery',
      challengesTitle: 'Challenges',
      learningsTitle: 'Learnings',
      visitProjectButton: 'Visit Project',
      viewCodeButton: 'View Code',
    },
    projectsPage: {
      title: 'My Projects',
      metaTitle: 'My Projects | Portfolio',
      metaDescription: 'See all projects.',
      noProjects: 'No projects to show right now.',
      noProjectsDescription:
        "It looks like you don't have projects to show yet.",
    },
    notFoundPage: {
      pageTitle: 'Page Not Found',
      title: 'Oops! Page Not Found',
      message:
        'Sorry, the page you want does not exist. Check the URL or go back home.',
      homeLink: 'Back to Home',
    },

    tipsPage: {
      metaTitle: 'Development Tips',
      metaDescription:
        'Quick tips and short advice about web development and cloud computing.',
      description:
        'Quick tips and short advice about web development and cloud computing.',
      title: 'Latest Tips',
      noTips: 'No tips to show right now.',
      readTip: 'Read tip',
      backToList: 'Back to tips list',
      featuredTips: 'Featured tips',
      allTips: 'All tips',
      tipsAvailable: 'tips available',
      tipAvailable: 'tip available',
      editOnGithub: 'Edit on GitHub',
    },
    zodErrors: {
      // Common errors
      invalid_type: 'Invalid type.',
      invalid_type_received_undefined: 'This field is required.', // For required fields (fallback)
      required_field_custom: 'The {fieldName} field is required.',
      // String errors
      too_small_string_minimum: 'Must be at least {minimum} characters long.',
      too_big_string_maximum: 'Must be no more than {maximum} characters long.',
      invalid_string_email: 'Invalid email address.',
      invalid_string_url: 'Invalid URL.',
      invalid_string_uuid: 'Invalid UUID.',
      // You can add more specific messages as needed
    },
  },
} as const;

export const getLanguageName = (lang: LanguageCode) => languages[lang];

export type UISchema = typeof ui;
export type FeatureType = keyof UISchema[typeof defaultLanguage];

export function useTranslations<F extends FeatureType>(
  lang: LanguageCode | undefined,
  feature: F
) {
  const currentLanguage = lang || defaultLanguage;

  // Get the available keys for this feature from the default language
  type AvailableKeys = keyof UISchema[typeof defaultLanguage][F];

  return function t(key: AvailableKeys): string {
    // Safely access the translation, falling back to default language if necessary
    const featureTranslations = ui[currentLanguage]?.[feature];
    if (featureTranslations && key in featureTranslations) {
      return featureTranslations[
        key as keyof typeof featureTranslations
      ] as string;
    }

    // Fallback to default language
    return ui[defaultLanguage][feature][
      key as keyof (typeof ui)[typeof defaultLanguage][F]
    ] as string;
  };
}
