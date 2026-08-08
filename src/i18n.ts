export type Locale = 'en' | 'es';

export const defaultLocale: Locale = 'es';

const es: Record<string, string> = {
  'site.title': 'David Talavera — Desarrollador full-stack',
  'site.description':
    'Desarrollador full-stack enfocado en software empresarial, datos y exploración de IA aplicada.',
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
  'home.marquee1': 'Python, React y sistemas empresariales',
  'home.marquee2': 'Paneles de datos y módulos ERP',
  'home.marquee3': 'Exploración de IA aplicada y arquitectura de software',
  'home.circleTitle': 'Construir software que funcione',
  'home.circleSubtitle':
    'Sistemas full-stack prácticos, automatización confiable y exploración reflexiva de IA aplicada.',
  'home.circleCta': 'Explorar',
  'profile.title': 'Sobre David',
  'profile.eyebrow': 'Perfil',
  'profile.description':
    'Ingeniero en Sistemas y desarrollador full-stack en Ciudad de México, enfocado en software práctico y exploración de IA aplicada.',
  'profile.intro':
    'David Talavera es Ingeniero en Sistemas y construye software empresarial con Python, React, TypeScript, SQL y herramientas listas para la nube. Su trabajo combina entendimiento operativo con entregas full-stack mantenibles.',
  'profile.focusTitle': 'Áreas de enfoque',
  'profile.focusBody':
    'Automatización empresarial, paneles de datos, módulos ERP, rendimiento de bases de datos y arquitectura de software. También explora cómo la IA aplicada puede mejorar flujos prácticos de desarrollo y negocio.',
  'profile.backgroundTitle': 'Formación',
  'profile.person1':
    '<strong>Universidad Tecnológica de México</strong> — Ingeniería en Sistemas Computacionales, 2020–2023; reconocimiento al mejor promedio.',
  'profile.person2': '<strong>Idiomas</strong> — Español nativo e inglés B2.',
  'profile.person3':
    '<strong>Certificaciones</strong> — OCI Foundations, terminal y línea de comandos, y redes CCNAv7.',
  'profile.contactTitle': 'Ubicación',
  'profile.contactBody':
    'Con base en Ciudad de México. Conectá desde la <a href="/contact">página de contacto</a>.',
  'experience.title': 'Experiencia',
  'experience.eyebrow': 'Trayectoria profesional',
  'experience.description':
    'Trabajo full-stack en automatización empresarial, analítica y plataformas web.',
  'experience.empty': 'Las entradas de experiencia están en preparación.',
  'experience.detailEyebrow': 'Experiencia',
  'experience.adjacent': 'Experiencia relacionada',
  'experience.previous': '← Anterior',
  'experience.next': 'Siguiente →',
  'skills.title': 'Habilidades y enfoque',
  'skills.eyebrow': 'Práctica técnica',
  'skills.description':
    'Tecnologías y áreas de enfoque que respaldan el trabajo full-stack de David.',
  'contact.title': 'Contacto',
  'contact.eyebrow': 'Conectemos',
  'contact.description':
    'Disponible para desarrollo full-stack, colaboración técnica y conversaciones sobre IA aplicada.',
  'contact.linkedin': 'Perfil de LinkedIn',
  'contact.email': 'Enviar un correo a David Talavera',
  'notFound.title': 'Página no encontrada — David Talavera',
  'notFound.description': 'La página solicitada no está disponible.',
  'notFound.message': 'Esta página no está disponible.',
  'notFound.back': '← Volver al portafolio',
  'work.hir-seguros.title': 'HIR Seguros',
  'work.hir-seguros.summary':
    'Desarrollo full-stack para soluciones empresariales, automatización contable de facturas XML y optimización de motores de cálculo.',
  'work.central-invirzo.title': 'Central Invirzo',
  'work.central-invirzo.summary':
    'Paneles analíticos interactivos y módulos ERP web para la gestión de proyectos tecnológicos.',
  'skill.python-javascript.title': 'Python y JavaScript',
  'skill.python-javascript.subtitle':
    'Lenguajes centrales para soluciones empresariales full-stack y automatización.',
  'skill.react-typescript.title': 'React y TypeScript',
  'skill.react-typescript.subtitle':
    'Interfaces modernas para paneles analíticos y módulos ERP web.',
  'skill.data-databases.title': 'Datos y bases de datos',
  'skill.data-databases.subtitle':
    'Oracle SQL, MongoDB, SQL Server y MySQL para sistemas operativos.',
  'skill.cloud-delivery.title': 'Entrega lista para la nube',
  'skill.cloud-delivery.subtitle': 'Docker, AWS, Node.js y prácticas de despliegue mantenibles.',
  'skill.applied-ai.title': 'Enfoque en IA aplicada',
  'skill.applied-ai.subtitle': 'Exploración de IA práctica para flujos de software y negocio.',
  'skill.engineering-foundations.title': 'Fundamentos de ingeniería',
  'skill.engineering-foundations.subtitle':
    'Formación en sistemas, nube, línea de comandos y redes.',
  'experience.hir-seguros.bigTitle': 'HIR Seguros',
  'experience.hir-seguros.headline':
    'Desarrollo <span>full-stack</span> para operaciones empresariales',
  'experience.hir-seguros.excerpt':
    'Lideré soluciones empresariales personalizadas con Python, JavaScript, Oracle SQL, MongoDB y JSON.',
  'experience.hir-seguros.body':
    '<p>En HIR Seguros, David lidera el desarrollo de soluciones personalizadas que apoyan las operaciones empresariales. El trabajo conecta lógica de aplicación, bases de datos y procesos financieros en sistemas full-stack mantenibles.</p><h2>Automatización contable</h2><p>Automatizó flujos de contabilidad de facturas XML y optimiza motores de cálculo con Python, JavaScript, Oracle SQL, MongoDB y JSON.</p>',
  'experience.central-invirzo.bigTitle': 'Central Invirzo',
  'experience.central-invirzo.headline': '<span>Dashboards</span>, módulos ERP y plataformas web',
  'experience.central-invirzo.excerpt':
    'Desarrollé dashboards analíticos interactivos y módulos ERP web para la gestión de proyectos tecnológicos.',
  'experience.central-invirzo.body':
    '<p>En Central Invirzo, David trabajó como Desarrollador Full-Stack y Analista de Datos, entregando herramientas web para proyectos y operaciones.</p><h2>Analítica y ERP</h2><p>Desarrolló paneles interactivos y módulos ERP web con Laravel, TypeScript, React, SQL Server, Docker, AWS y Node.js.</p>',
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
};

export const translations: Record<Locale, Record<string, string>> = { en: {}, es };

export function t(locale: Locale, key: string, fallback: string): string {
  return translations[locale][key] ?? fallback;
}
