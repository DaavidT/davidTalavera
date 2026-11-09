export type Locale = 'en' | 'es';

export const defaultLocale: Locale = 'es';

const es: Record<string, string> = {
  'site.title': 'David Talavera — Ingeniero en Sistemas | Automatización e IA',
  'site.description':
    'Ingeniero en Sistemas especializado en automatización de procesos e IA aplicada para operaciones empresariales.',
  'nav.primary': 'Navegación principal',
  'nav.footer': 'Pie de página',
  'nav.home': 'Inicio',
  'nav.profile': 'Perfil',
  'nav.experience': 'Experiencia',
  'nav.skills': 'Habilidades',
  'nav.contact': 'Contacto',
  'nav.openMenu': 'Abrir menú',
  'nav.closeMenu': 'Cerrar menú',
  'language.switchToEs': 'Cambiar a español',
  'language.switchToEn': 'Cambiar a inglés',
  'footer.portfolio': 'Portafolio.',
  'menu.contactCta': 'Contacto',
  'home.software': 'Dev',
  'home.profileLabel': 'David Talavera',
  'home.featuredArticles': 'Áreas de enfoque',
  'home.readMore': 'Ver perfil',
  'home.by': 'Por',
  'home.profileType': 'Perfil profesional',
  'home.marquee1': 'Automatización, integraciones y sistemas empresariales',
  'home.marquee2': 'Datos, APIs y flujos operativos',
  'home.marquee3': 'IA aplicada y arquitectura de sistemas',
  'home.circleTitle': 'Automatizar sistemas que funcionen',
  'home.circleSubtitle':
    'Automatización práctica, integraciones confiables y exploración de IA aplicada.',
  'home.circleCta': 'Explorar',
  'profile.title': 'Sobre David',
  'profile.eyebrow': 'Perfil',
  'profile.description':
    'Ingeniero en Sistemas en Ciudad de México, especializado en automatización de procesos e IA aplicada.',
  'profile.intro':
    'David Talavera es Ingeniero en Sistemas y diseña automatizaciones, integraciones y soluciones de IA aplicada para operaciones empresariales. Su trabajo conecta procesos, datos y software en sistemas mantenibles.',
  'profile.focusTitle': 'Áreas de enfoque',
  'profile.focusBody':
    'Automatización de procesos, integración de sistemas, paneles de datos, módulos ERP y flujos de IA aplicada. También optimiza rendimiento de bases de datos y arquitectura de software.',
  'profile.backgroundTitle': 'Formación',
  'profile.person1':
    '<strong>Universidad Tecnológica de México</strong> — Ingeniería en Sistemas Computacionales, 2020–2023; reconocimiento al mejor promedio.',
  'profile.person2': '<strong>Idiomas</strong> — Español nativo e inglés B2.',
  'profile.person3':
    '<strong>Certificaciones</strong> — OCI Foundations, terminal y línea de comandos, y redes CCNAv7.',
  'profile.contactTitle': 'Ubicación',
  'profile.contactBody':
    'Con base en Ciudad de México. Conectá desde la <a href="#about">sección de contacto</a>.',
  'experience.title': 'Experiencia',
  'experience.eyebrow': 'Trayectoria profesional',
  'experience.description':
    'Automatización, integración de sistemas, datos e IA aplicada en operaciones empresariales.',
  'experience.empty': 'Las entradas de experiencia están en preparación.',
  'experience.detailEyebrow': 'Experiencia',
  'experience.adjacent': 'Experiencia relacionada',
  'experience.previous': '← Anterior',
  'experience.next': 'Siguiente →',
  'skills.title': 'Capacidades y enfoque',
  'skills.eyebrow': 'Práctica técnica',
  'skills.description':
    'Automatización, integración, datos e IA aplicada que respaldan el trabajo de David.',
  'contact.title': 'Contacto',
  'contact.eyebrow': 'Conectemos',
  'contact.description':
    'Disponible para automatización de procesos, integración de sistemas y conversaciones sobre IA aplicada.',
  'contact.linkedin': 'Perfil de LinkedIn',
  'contact.email': 'Enviar un correo a David Talavera',
  'notFound.title': 'Página no encontrada — David Talavera',
  'notFound.description': 'La página solicitada no está disponible.',
  'notFound.message': 'Esta página no está disponible.',
  'notFound.back': '← Volver al portafolio',
  'work.hir-seguros.title': 'HIR Seguros',
  'work.hir-seguros.summary':
    'Automatización de procesos para operaciones empresariales, flujos contables de facturas XML y optimización de motores de cálculo.',
  'work.central-invirzo.title': 'Central Invirzo',
  'work.central-invirzo.summary':
    'Automatización de datos, paneles analíticos e integraciones ERP para la gestión de proyectos tecnológicos.',
  'skill.python-javascript.title': 'Automatización de procesos',
  'skill.python-javascript.subtitle':
    'Automatización de flujos operativos con Python, JavaScript y APIs.',
  'skill.react-typescript.title': 'Integración de sistemas',
  'skill.react-typescript.subtitle': 'APIs, ERP y datos conectados en procesos de negocio.',
  'skill.data-databases.title': 'Datos y bases de datos',
  'skill.data-databases.subtitle':
    'Oracle SQL, MongoDB, SQL Server y MySQL para sistemas operativos.',
  'skill.cloud-delivery.title': 'Entrega en la nube',
  'skill.cloud-delivery.subtitle':
    'Docker, AWS y despliegues mantenibles para sistemas operativos.',
  'skill.applied-ai.title': 'IA aplicada',
  'skill.applied-ai.subtitle': 'Flujos de IA práctica para automatizar tareas y apoyar decisiones.',
  'skill.engineering-foundations.title': 'Fundamentos de ingeniería',
  'skill.engineering-foundations.subtitle':
    'Formación en sistemas, nube, línea de comandos y redes.',
  'experience.hir-seguros.bigTitle': 'HIR Seguros',
  'experience.hir-seguros.headline':
    'Automatización y <span>sistemas</span> para operaciones empresariales',
  'experience.hir-seguros.excerpt':
    'Automatizo flujos de negocio con Python, JavaScript, Oracle SQL, MongoDB y JSON.',
  'experience.hir-seguros.body':
    '<p>En HIR Seguros, David diseña automatizaciones y soluciones personalizadas que apoyan las operaciones empresariales. El trabajo conecta lógica de aplicación, bases de datos y procesos financieros en sistemas mantenibles.</p><h2>Automatización contable</h2><p>Automatizó flujos de contabilidad de facturas XML y optimiza motores de cálculo con Python, JavaScript, Oracle SQL, MongoDB y JSON.</p>',
  'experience.central-invirzo.bigTitle': 'Central Invirzo',
  'experience.central-invirzo.headline':
    '<span>Automatización de datos</span>, paneles e integraciones ERP',
  'experience.central-invirzo.excerpt':
    'Paneles analíticos e integraciones ERP para la gestión de proyectos tecnológicos.',
  'experience.central-invirzo.body':
    '<p>En Central Invirzo, David trabajó como Ingeniero en Sistemas y Analista de Datos, entregando herramientas para proyectos y operaciones.</p><h2>Analítica y automatización</h2><p>Desarrolló paneles interactivos e integraciones ERP para la gestión de proyectos tecnológicos con Laravel, TypeScript, React, SQL Server, Docker, AWS y Node.js.</p>',
  'experience.technical-foundation.bigTitle': 'Fundamentos',
  'experience.technical-foundation.headline':
    'Ingeniería de <span>sistemas</span> y aprendizaje continuo',
  'experience.technical-foundation.excerpt':
    'Egresado de Ingeniería en Sistemas Computacionales con certificaciones en nube, línea de comandos y redes.',
  'experience.technical-foundation.body':
    '<p>David egresó de Ingeniería en Sistemas Computacionales de la Universidad Tecnológica de México entre 2020 y 2023, con reconocimiento al mejor promedio.</p><h2>Certificaciones</h2><p>Su desarrollo técnico incluye OCI Foundations, terminal y línea de comandos, y redes CCNAv7.</p>',
  'experience.technical-product-owner.bigTitle': 'Especialista en Innovación',
  'experience.technical-product-owner.headline':
    '<span>Product Owner Técnico</span> | Analista de Sistemas de Negocio | Transformación Digital y Gestión de Plataformas',
  'experience.technical-product-owner.excerpt':
    'Product Owner Técnico que administra plataformas de banca digital, analiza requisitos, lidera desarrollo y coordina liberaciones.',
  'experience.technical-product-owner.body':
    '<h1>Descripción del puesto: Product Owner Técnico - Plataforma de banca digital</h1><h2>Resumen ejecutivo</h2><p>En el sector financiero moderno, impulsar la transformación digital requiere conectar la visión de negocio de alto nivel con la ejecución técnica directa. En la intersección entre Innovación y Banca Digital, el <strong>Product Owner Técnico (TPO)</strong> de la plataforma de banca digital desempeña un papel fundamental para modernizar las experiencias de las personas usuarias, coordinar las capacidades de la plataforma de front-end y asegurar la entrega fluida de nuevas funcionalidades de software en un entorno bancario altamente regulado.</p><hr /><h2>Responsabilidades y flujo de trabajo</h2><h3>1. Análisis de requisitos y traducción funcional</h3><p>El núcleo de este puesto consiste en recibir, evaluar y descomponer requisitos empresariales complejos, en especial los documentos de requerimientos de negocio. El Product Owner Técnico analiza meticulosamente estas reglas de negocio entrantes para determinar su viabilidad funcional e impacto en la plataforma digital. Al traducir las necesidades comerciales y operativas en configuraciones precisas del sistema, el TPO garantiza que la plataforma de front-end refleje correctamente la estrategia corporativa y mantenga el cumplimiento de los estándares de la industria financiera.</p><h3>2. Administración y configuración de plataformas</h3><p>Como la interfaz bancaria principal se basa predominantemente en el front-end, el TPO actúa como administrador principal del ecosistema de la plataforma. Esta responsabilidad incluye gestionar parámetros, definir flujos de interfaz, ajustar componentes del recorrido de las personas usuarias y mantener el comportamiento del sistema mediante herramientas avanzadas de configuración. Esta gestión directa garantiza alta disponibilidad, una experiencia de uso intuitiva y una adaptación rápida a productos bancarios en evolución.</p><h3>3. Gestión del backlog y supervisión del desarrollo de software</h3><p>Cuando las demandas del negocio superan las capacidades de configuración existentes y requieren código personalizado, el Product Owner Técnico lidera el esfuerzo de desarrollo. Sus responsabilidades incluyen definir el plan técnico de trabajo, crear especificaciones funcionales precisas y gestionar el backlog de los equipos de desarrollo. El TPO colabora estrechamente con ingenieros y arquitectos de software, prioriza tareas, aclara casos límite técnicos y garantiza que los módulos de código personalizado se integren sin problemas con la infraestructura de front-end.</p><h3>4. Ingeniería de liberaciones y despliegue en producción</h3><p>Mantener la estabilidad del sistema durante las liberaciones de funcionalidades es crítico en la banca digital. El TPO gobierna el ciclo completo de gestión de liberaciones: establece ventanas de despliegue estructuradas, coordina la validación de pruebas y supervisa las liberaciones en producción. Al aplicar protocolos estrictos de liberación, el TPO minimiza el riesgo operativo, evita tiempos de inactividad y garantiza un flujo de entrega continuo y confiable.</p><h3>5. Documentación y gobierno técnico</h3><p>La documentación integral sostiene todo sistema bancario exitoso. El TPO mantiene activamente guías técnicas actualizadas, diagramas de arquitectura, registros de liberaciones y flujos funcionales. Este gobierno riguroso garantiza trazabilidad completa para el cumplimiento interno, facilita el intercambio de conocimiento entre equipos y simplifica futuras auditorías de la plataforma.</p><hr /><h2>Impacto profesional y valor estratégico</h2><p>Al unificar el análisis funcional, la configuración de plataformas, la gestión de proyectos de software y la ingeniería de liberaciones en un único rol cohesionado, el Product Owner Técnico acelera la salida al mercado de innovaciones de banca digital. Esta posición es un motor esencial de transformación, que asegura que las soluciones tecnológicas se mantengan sólidas, escalables y alineadas con los objetivos de la organización.</p>',
  'experience.invirtual-web.bigTitle': 'Invirtual Web',
  'experience.invirtual-web.headline':
    '<span>Automatización</span>, Linux y soporte operativo de TI',
  'experience.invirtual-web.excerpt':
    'Desarrollé automatizaciónes con Python y Linux, dí asesoría operativa de TI, mantenimiento WordPress y optimización MySQL.',
  'experience.invirtual-web.body':
    '<p>En Invirtual Web, David colaboró como Consultor de TI durante su servicio social, apoyando operaciones tecnológicas y plataformas web.</p><h2>Automatización y operaciones</h2><p>Desarrolló automatización con Python y Linux, mantenimiento WordPress y optimización MySQL.</p>',
  'language.label': 'Idioma',
  'language.es': 'Español',
  'language.en': 'Inglés',
  'hero.name': 'Ingeniero en Sistemas<br />Automatización e IA aplicada',
  'hero.role': 'Ingeniero en Sistemas',
  'hero.scroll': 'Desliza para explorar',
  'about.headline':
    'Construyamos<br />algo<br /><span class="about-highlight">extraordinario</span>.',
  'about.tagline':
    'Automatizo procesos y conecto sistemas con IA aplicada — del problema operativo a la solución en producción.',
  'about.linkedin': 'Conectar en LinkedIn',
  'about.linkedinAria': 'Conectar con David en LinkedIn',
  'about.email': 'Enviar un correo',
  'about.emailAria': 'Enviar un correo a David',
  'about.footer': 'Disponible para contratos remotos — Hablemos de tu próximo proyecto.',
  'footer.rights': 'Todos los derechos reservados.',
  'skills.automation': 'Automatización',
  'skills.appliedAi': 'IA aplicada',
  'skills.systemsData': 'Sistemas y datos',
  'skills.cloudDelivery': 'Cloud y entrega',
  'skills.focusAria': 'Áreas de enfoque',
  'work.banorte.title': 'Banorte',
  'work.banorte.summary':
    'Automatizo procesos de negocio, configuro plataformas de banca digital y lidero liberaciones a producción para operaciones bancarias.',
};

const en: Record<string, string> = {
  'site.title': 'David Talavera — Systems Engineer | Automation & AI',
  'site.description':
    'Systems Engineer specializing in process automation and applied AI for business operations.',
  'nav.primary': 'Primary navigation',
  'nav.footer': 'Footer',
  'nav.home': 'Home',
  'nav.profile': 'Profile',
  'nav.experience': 'Experience',
  'nav.skills': 'Skills',
  'nav.contact': 'Contact',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'language.label': 'Language',
  'language.es': 'Spanish',
  'language.en': 'English',
  'language.switchToEs': 'Switch to Spanish',
  'language.switchToEn': 'Switch to English',
  'hero.name': 'Systems Engineer<br />Automation & Applied AI',
  'hero.role': 'Systems Engineer',
  'hero.scroll': 'Scroll to explore',
  'about.headline':
    'Let\'s build<br />something<br /><span class="about-highlight">remarkable</span>.',
  'about.tagline':
    'I automate processes and connect systems with applied AI — from the operational problem to a production solution.',
  'about.linkedin': 'Connect on LinkedIn',
  'about.linkedinAria': 'Connect with David on LinkedIn',
  'about.email': 'Send an email',
  'about.emailAria': 'Send an email to David',
  'about.footer': "Available for remote contracts — Let's discuss your next project.",
  'footer.portfolio': 'Portfolio.',
  'footer.rights': 'All rights reserved.',
  'menu.contactCta': 'Get in touch',
  'home.software': 'Dev',
  'home.profileLabel': 'David Talavera',
  'home.featuredArticles': 'Focus areas',
  'home.readMore': 'View profile',
  'home.by': 'By',
  'home.profileType': 'Professional profile',
  'home.marquee1': 'Automation, integrations, and business systems',
  'home.marquee2': 'Data, APIs, and operational workflows',
  'home.marquee3': 'Applied AI and systems architecture',
  'home.circleTitle': 'Automate systems that work',
  'home.circleSubtitle':
    'Practical automation, dependable integrations, and applied AI exploration.',
  'home.circleCta': 'Explore',
  'profile.title': 'About David',
  'profile.eyebrow': 'Profile',
  'profile.description':
    'Systems Engineer in Mexico City, specializing in process automation and applied AI.',
  'profile.intro':
    'David Talavera is a Systems Engineer who designs automations, integrations, and applied AI solutions for business operations. His work connects processes, data, and software into maintainable systems.',
  'profile.focusTitle': 'Focus areas',
  'profile.focusBody':
    'Process automation, systems integration, data dashboards, ERP modules, and applied AI workflows. He also improves database performance and software architecture.',
  'profile.backgroundTitle': 'Background',
  'profile.person1':
    '<strong>Universidad Tecnológica de México</strong> — Systems Computer Engineering, 2020–2023; best GPA recognition.',
  'profile.person2': '<strong>Languages</strong> — Native Spanish and B2 English.',
  'profile.person3':
    '<strong>Certifications</strong> — OCI Foundations, terminal and command line, and CCNAv7 networking.',
  'profile.contactTitle': 'Location',
  'profile.contactBody':
    'Based in Mexico City. Connect through the <a href="#about">contact section</a>.',
  'experience.title': 'Experience',
  'experience.eyebrow': 'Professional background',
  'experience.description':
    'Automation, systems integration, data, and applied AI across business operations.',
  'experience.empty': 'Experience entries coming soon.',
  'experience.detailEyebrow': 'Experience',
  'experience.adjacent': 'Adjacent experience',
  'experience.previous': '← Previous',
  'experience.next': 'Next →',
  'skills.title': 'Capabilities and focus',
  'skills.eyebrow': 'Technical practice',
  'skills.description': "Automation, integration, data, and applied AI behind David's work.",
  'skills.automation': 'Automation',
  'skills.appliedAi': 'Applied AI',
  'skills.systemsData': 'Systems and data',
  'skills.cloudDelivery': 'Cloud and delivery',
  'skills.focusAria': 'Focus areas',
  'contact.title': 'Contact',
  'contact.eyebrow': "Let's connect",
  'contact.description':
    'Available for process automation, systems integration, and applied AI conversations.',
  'contact.linkedin': 'LinkedIn profile',
  'contact.email': 'Email David Talavera',
  'notFound.title': 'Page not found — David Talavera',
  'notFound.description': 'The page you requested is unavailable.',
  'notFound.message': 'This page is unavailable.',
  'notFound.back': '← Back to the portfolio',
  'work.hir-seguros.title': 'HIR Seguros',
  'work.hir-seguros.summary':
    'Process automation for business operations, XML invoice accounting workflows, and calculation-engine optimization.',
  'work.central-invirzo.title': 'Central Invirzo',
  'work.central-invirzo.summary':
    'Data automation, analytics dashboards, and ERP integrations for technology-project management.',
  'work.banorte.title': 'Banorte',
  'work.banorte.summary':
    'Automate business processes, configure digital banking platforms, and lead production releases for banking operations.',
  'skill.python-javascript.title': 'Process Automation',
  'skill.python-javascript.subtitle':
    'Automating operational workflows with Python, JavaScript, and APIs.',
  'skill.react-typescript.title': 'Systems Integration',
  'skill.react-typescript.subtitle': 'APIs, ERP, and data connected across business processes.',
  'skill.data-databases.title': 'Data and Databases',
  'skill.data-databases.subtitle':
    'Oracle SQL, MongoDB, SQL Server, and MySQL for operational systems.',
  'skill.cloud-delivery.title': 'Cloud Delivery',
  'skill.cloud-delivery.subtitle':
    'Docker, AWS, and maintainable deployments for operational systems.',
  'skill.applied-ai.title': 'Applied AI',
  'skill.applied-ai.subtitle': 'Practical AI workflows to automate tasks and support decisions.',
  'skill.engineering-foundations.title': 'Engineering Foundations',
  'skill.engineering-foundations.subtitle':
    'Systems, cloud, command line, and networking training.',
  'experience.hir-seguros.bigTitle': 'HIR Seguros',
  'experience.hir-seguros.headline': 'Automation and systems for business operations',
  'experience.hir-seguros.excerpt':
    'Automating business workflows with Python, JavaScript, Oracle SQL, MongoDB, and JSON.',
  'experience.central-invirzo.bigTitle': 'Central Invirzo',
  'experience.central-invirzo.headline': 'Data automation, dashboards, and ERP integrations',
  'experience.central-invirzo.excerpt':
    'Built analytics dashboards and ERP integrations for technology-project management.',
  'experience.technical-foundation.bigTitle': 'Foundation',
  'experience.technical-foundation.headline': 'Systems engineering and continuous learning',
  'experience.technical-foundation.excerpt':
    'Systems Computer Engineering graduate with certifications in cloud, command line, and networking.',
  'experience.technical-product-owner.bigTitle': 'Innovation Specialist',
  'experience.technical-product-owner.headline':
    'Technical Product Owner | Business Systems Analyst | Digital Transformation & Platform Management',
  'experience.technical-product-owner.excerpt':
    'Technical Product Owner managing digital banking platform configurations, analyzing business requirements, leading software development, coordinating releases, and driving digital transformation.',
  'experience.invirtual-web.bigTitle': 'Invirtual Web',
  'experience.invirtual-web.headline': 'Automation, Linux, and operational IT support',
  'experience.invirtual-web.excerpt':
    'Delivered Python and Linux automation, operational IT advisory, WordPress maintenance, and MySQL optimization.',
};

export const translations: Record<Locale, Record<string, string>> = { en, es };

export const locales: Locale[] = ['es', 'en'];

export function t(locale: Locale, key: string, fallback = ''): string {
  return translations[locale][key] ?? fallback;
}
