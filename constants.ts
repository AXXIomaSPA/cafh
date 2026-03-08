
import { Tenant, Contact, AutomationWorkflow, ContentItem, HeroConfig, BlogConfig, WizardStep, UserActivity, BlogPost, CalendarEvent, MediaAsset, EmailLog, EmailMetrics } from './types';
import {
    LayoutDashboard, Users, FileText, Settings, BookOpen, MessageCircle, BarChart3,
    Heart, Sun, Cloud, Anchor, Feather, Compass, Map, Coffee, Book, Video, Calendar, Sparkles,
    Image as ImageIcon, File, Music, Film, Mail, Send, AlertTriangle, CheckCircle, BarChart, Zap, CalendarDays
} from 'lucide-react';

export const CURRENT_TENANT: Tenant = {
    id: 't_santiago_01',
    name: 'Cafh Chile - Sede Central',
    domain: 'cafh.cl',
    theme: {
        primaryColor: '#1A428A',
        logoUrl: '',
    }
};

// DYNAMIC HERO CONFIG (Manageable by Admin)
export const HERO_CONFIG: HeroConfig = {
    title: "Un camino de",
    highlightWord: "desenvolvimiento",
    subtitle: "Explora el conocimiento de ti mismo, la paz interior y la unión con la vida. Únete a una comunidad global dedicada al bien común.",
    backgrounds: [
        {
            id: 'bg1',
            type: 'video',
            // Deep Universe / Nebula loop
            url: "https://cdn.pixabay.com/video/2020/12/03/58142-490367352_large.mp4"
        },
        {
            id: 'bg2',
            type: 'image',
            url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop" // Spiritual/Light
        },
        {
            id: 'bg3',
            type: 'image',
            url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop" // Community/Hands
        }
    ],
    modalVideoId: "dQw4w9WgXcQ", // Placeholder ID
    ctaText: "Comenzar el Viaje",
    ctaLink: "/metodo",
    sliderSpeed: 5000,
    showControls: true,
    textAlignment: 'center'
};

// BLOG CONFIGURATION (Defaults)
export const BLOG_CONFIG_DEFAULT: BlogConfig = {
    sectionTitle: "Blog & Reflexiones",
    sectionSubtitle: "Inspiración",
    postsToShow: 6,
    autoPlay: true,
    autoPlaySpeed: 5000, // 5 seconds
    cardStyle: 'Standard'
};

export const DEFAULT_HOME_CONFIG: import('./types').HomeConfig = {
    hero: HERO_CONFIG,
    searchSubtitle: "¿Qué buscas hoy?",
    searchItems: [
        { label: 'Eventos', icon: 'Calendar', path: '/activities' },
        { label: 'Podcast', icon: 'Mic', path: '/resources/podcast' },
        { label: 'Contenido', icon: 'FileText', path: '/resources' },
        { label: 'Somos', icon: 'Users', path: '/about' },
        { label: 'Actividades', icon: 'Activity', path: '/activities' },
        { label: 'Biblioteca', icon: 'BookOpen', path: '/resources/library' },
        { label: 'Audioteca', icon: 'Headphones', path: '/resources/audio' },
        { label: 'Tu Cuenta', icon: 'User', path: '/login' }
    ],
    threeColumns: [
        { icon: 'Heart', title: 'Qué es Cafh', description: 'Un camino de desenvolvimiento espiritual.', order: 0, alignment: 'center' },
        { icon: 'Sparkles', title: 'Qué Buscamos', description: 'La unión con la vida.', order: 1, alignment: 'center' },
        { icon: 'Anchor', title: 'Nuestra Misión', description: 'El bien común.', order: 2, alignment: 'center' }
    ],
    blogSection: {
        sectionTitle: "Blog & Reflexiones",
        sectionSubtitle: "Explora nuestras últimas publicaciones.",
        postsToShow: 3,
        autoPlay: true,
        autoPlaySpeed: 3000,
        cardStyle: 'Standard'
    },
    activitiesSection: {
        title: "Próximas Actividades",
        subtitle: "Encuentros, retiros y meditaciones.",
        maxEvents: 4,
        order: 4
    },
    sectionOrder: ['hero', 'search', 'threeColumns', 'blog', 'activities'],
    footer: {
        columns: [
            { title: 'Cafh', links: [{ label: 'Sobre nosotros', path: '/about' }, { label: 'Contacto', path: '/contact' }] },
            { title: 'Recursos', links: [{ label: 'Biblioteca', path: '/resources/library' }, { label: 'Blog', path: '/resources/blog' }] },
            { title: 'Comunidad', links: [{ label: 'Actividades', path: '/activities' }, { label: 'Miembros', path: '/login' }] },
            { title: 'Legal', links: [{ label: 'Privacidad', path: '/privacy' }, { label: 'Términos', path: '/terms' }] }
        ],
        socialLinks: [
            { platform: 'Instagram', url: '#', icon: 'Instagram' },
            { platform: 'YouTube', url: '#', icon: 'Youtube' }
        ],
        subscriptionTitle: "Mantente Conectado",
        subscriptionSubtitle: "Recibe reflexiones y novedades en tu correo.",
        leadSourceTag: "Footer Subscription",
        copyright: "© 2023 Cafh. Todos los derechos reservados."
    }
};

// MOCK BLOG POSTS (Manageable via CMS)
export const MOCK_BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'El arte de la pausa consciente',
        excerpt: 'Descubre cómo pequeños momentos de silencio pueden transformar tu día y tu relación con los demás.',
        category: 'Vida Interior',
        date: '2 Oct, 2023',
        author: 'Ana María S.',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'Construyendo comunidad desde el corazón',
        excerpt: 'La importancia de los vínculos espirituales en tiempos de aislamiento digital.',
        category: 'Comunidad',
        date: '28 Sep, 2023',
        author: 'Carlos R.',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'Lecturas para el alma: Recomendaciones',
        excerpt: 'Una selección curada de textos que nos invitan a reflexionar sobre nuestro propósito.',
        category: 'Cultura',
        date: '15 Sep, 2023',
        author: 'Editorial Cafh',
        imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '4',
        title: 'La renuncia como acto de libertad',
        excerpt: 'Entendiendo el desapego no como pérdida, sino como la ganancia de una libertad interior.',
        category: 'Filosofía',
        date: '10 Sep, 2023',
        author: 'Santiago B.',
        imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '5',
        title: 'El valor de la amistad espiritual',
        excerpt: 'Caminar juntos hacia un mismo objetivo nos fortalece y nos da esperanza.',
        category: 'Comunidad',
        date: '05 Sep, 2023',
        author: 'Maria Elena',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop'
    }
];

// MOCK CALENDAR EVENTS (Manageable via Admin)
export const MOCK_EVENTS: CalendarEvent[] = [
    {
        id: 'e1',
        title: 'Taller de Introducción a la Meditación',
        date: '2023-11-15',
        day: '15',
        month: 'NOV',
        time: '19:00 hrs',
        location: 'Sede Central, Ñuñoa',
        type: 'Presencial',
        color: 'bg-cafh-turquoise'
    },
    {
        id: 'e2',
        title: 'Diálogos con Sentido: "El Tiempo"',
        date: '2023-11-22',
        day: '22',
        month: 'NOV',
        time: '20:00 hrs',
        location: 'Zoom',
        type: 'Online',
        color: 'bg-cafh-peach',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        platform: 'Zoom',
        // MEET LOBBY CONFIGURATION
        agenda: [
            "19:50 - Apertura de Sala de Espera",
            "20:00 - Bienvenida y Sintonía",
            "20:15 - Lectura: 'La percepción del tiempo'",
            "20:45 - Diálogo en grupos pequeños",
            "21:15 - Cierre y Meditación Conjunta"
        ],
        resources: [
            { type: 'PDF', title: 'Texto de apoyo - El Tiempo.pdf', size: '1.2 MB' },
            { type: 'Video', title: 'Intro a Diálogos con Sentido', size: '3 min' }
        ]
    },
    {
        id: 'e3',
        title: 'Retiro de Silencio de Fin de Semana',
        date: '2023-12-01',
        day: '01',
        month: 'DIC',
        time: 'Todo el día',
        location: 'Casa de Retiros, Cajón del Maipo',
        type: 'Presencial',
        color: 'bg-cafh-lavender'
    },
    {
        id: 'e4',
        title: 'Grupo de Estudio: Enseñanzas',
        date: '2023-12-05',
        day: '05',
        month: 'DIC',
        time: '18:30 hrs',
        location: 'Sede Providencia / Meet',
        type: 'Híbrido',
        color: 'bg-cafh-clay',
        meetingUrl: 'https://meet.google.com/xyz-uvwx-yz1',
        platform: 'Zoom',
        agenda: [
            "18:30 - Lectura del Reglamento",
            "18:45 - Estudio del Capítulo 4",
            "19:30 - Comentarios"
        ]
    }
];

// WIZARD CONFIG (Manageable by Admin)
export const MOCK_WIZARD_STEPS: WizardStep[] = [
    {
        id: 1,
        question: "¿Qué estás buscando en este momento de tu vida?",
        options: [
            { label: "Paz mental y reducción de estrés", value: "peace", relatedTags: ['Meditación', 'Bienestar'] },
            { label: "Sentido y propósito", value: "purpose", relatedTags: ['Mística', 'Filosofía'] },
            { label: "Comunidad y conexión", value: "community", relatedTags: ['Grupos', 'Voluntariado'] },
        ]
    },
    {
        id: 2,
        question: "¿Cuánto tiempo puedes dedicar a tu desarrollo personal?",
        options: [
            { label: "Unos minutos al día", value: "short", relatedTags: ['Lecturas Breves', 'Podcast'] },
            { label: "Una hora a la semana", value: "medium", relatedTags: ['Reuniones', 'Cursos'] },
            { label: "Quiero profundizar en retiros", value: "long", relatedTags: ['Retiros'] },
        ]
    },
    {
        id: 3,
        question: "¿Qué formato resuena más contigo?",
        options: [
            { label: "Leer y reflexionar en soledad", value: "read", relatedTags: ['Biblioteca', 'Blog'] },
            { label: "Escuchar y cerrar los ojos", value: "listen", relatedTags: ['Meditación Guiada', 'Podcast'] },
            { label: "Conversar con otros", value: "talk", relatedTags: ['Grupos', 'Diálogos'] },
        ]
    }
];

export const MOCK_USER_HISTORY: UserActivity[] = [
    { id: '101', userId: 'dummy_user', type: 'Event', title: 'Taller de Introducción a la Meditación', date: '2023-10-15', status: 'Completed' },
    { id: '102', userId: 'dummy_user', type: 'Reading', title: 'Artículo: El valor del silencio', date: '2023-10-20', status: 'Completed' },
    { id: '103', userId: 'dummy_user', type: 'Meditation', title: 'Sesión Guiada: Paz Interior', date: '2023-11-01', status: 'Completed' },
];

// Rich Navigation Structure for Mega Menu
export const PUBLIC_NAV_STRUCTURE = [
    {
        label: 'Quiénes Somos',
        path: '/about',
        description: 'Nuestra identidad y propósito.',
        columns: [
            {
                title: 'Identidad',
                items: [
                    { label: 'Nuestra Historia', path: '/about/history', icon: 'Compass', desc: 'Orígenes y trayectoria.' },
                    { label: 'Misión y Visión', path: '/about/mission', icon: 'Anchor', desc: 'El propósito que nos guía.' },
                ]
            },
            {
                title: 'Organización',
                items: [
                    { label: 'Sedes en el Mundo', path: '/about/locations', icon: 'Map', desc: 'Nuestra presencia global.' },
                    { label: 'Comunidad', path: '/about/community', icon: 'Users', desc: 'Quienes formamos Cafh.' },
                ]
            }
        ]
    },
    {
        label: 'El Método',
        path: '/method',
        description: 'Un camino de desenvolvimiento espiritual.',
        columns: [
            {
                title: 'Pilares',
                items: [
                    { label: 'Vida Interior', path: '/method/inner-life', icon: 'Heart', desc: 'El cultivo del ser.' },
                    { label: 'Mística del Corazón', path: '/method/mystic', icon: 'Sparkles', desc: 'Conexión profunda.' },
                ]
            },
            {
                title: 'Prácticas',
                items: [
                    { label: 'Meditación', path: '/method/meditation', icon: 'Cloud', desc: 'Silencio y encuentro.' },
                    { label: 'Estudio', path: '/method/study', icon: 'Book', desc: 'Expansión de la conciencia.' },
                ]
            }
        ]
    },
    {
        label: 'Recursos',
        path: '/resources',
        description: 'Material para tu camino.',
        columns: [
            {
                title: 'Formatos',
                items: [
                    { label: 'Biblioteca Digital', path: '/resources/library', icon: 'BookOpen', desc: 'Textos y documentos.' },
                    { label: 'Videos y Charlas', path: '/resources/videos', icon: 'Video', desc: 'Contenido audiovisual.' },
                ]
            },
            {
                title: 'Inspiración',
                items: [
                    { label: 'Blog', path: '/resources/blog', icon: 'Feather', desc: 'Reflexiones semanales.' },
                    { label: 'Podcast', path: '/resources/podcast', icon: 'MessageCircle', desc: 'Escucha en el camino.' },
                ]
            }
        ]
    },
    {
        label: 'Actividades',
        path: '/activities',
        description: 'Participa con nosotros.',
        columns: [
            {
                title: 'Eventos',
                items: [
                    { label: 'Calendario', path: '/activities/calendar', icon: 'Calendar', desc: 'Próximos encuentros.' },
                    { label: 'Retiros', path: '/activities/retreats', icon: 'Sun', desc: 'Espacios de silencio.' },
                ]
            },
            {
                title: 'Grupos',
                items: [
                    { label: 'Reuniones', path: '/activities/meetings', icon: 'Coffee', desc: 'Diálogos con sentido.' },
                ]
            }
        ]
    },
    {
        label: 'Páginas',
        path: '#',
        description: 'Explora más contenidos.',
        columns: [
            {
                title: 'Páginas Internas',
                items: []
            }
        ]
    },
];

export const MOCK_CONTACTS: Contact[] = [
    {
        id: '1',
        name: 'Ana Flor',
        email: 'ana.flor@email.com',
        status: 'Subscribed',
        tags: ['Miembro', 'Donante'],
        engagementScore: 95,
        lastContact: '2023-10-25',
        phone: '+56 9 1234 5678',
        role: 'Member',
        createdAt: '2023-01-15'
    },
    {
        id: '2',
        name: 'Carlos Rojas',
        email: 'carlos.r@email.com',
        status: 'Subscribed',
        tags: ['Interesado', 'Newsletter'],
        engagementScore: 45,
        lastContact: '2023-10-20',
        phone: '+56 9 8765 4321',
        role: 'Lead',
        createdAt: '2023-03-20'
    },
    {
        id: '3',
        name: 'Maria Gonzalez',
        email: 'maria.g@email.com',
        status: 'Bounced',
        tags: ['Inactivo'],
        engagementScore: 10,
        lastContact: '2023-05-12',
        phone: '',
        role: 'Lead',
        createdAt: '2022-11-05'
    },
    {
        id: '4',
        name: 'Jorge Silva',
        email: 'jorge.s@email.com',
        status: 'Subscribed',
        tags: ['Taller Meditación'],
        engagementScore: 78,
        lastContact: '2023-10-24',
        phone: '',
        role: 'Lead',
        createdAt: '2023-06-10'
    },
    {
        id: '5',
        name: 'Elena Nuñez',
        email: 'elena.n@email.com',
        status: 'Subscribed',
        tags: ['Miembro', 'Voluntario'],
        engagementScore: 88,
        lastContact: '2023-10-26',
        phone: '+56 9 5555 4444',
        role: 'Member',
        createdAt: '2023-02-28'
    },
];

export const MOCK_EMAIL_LOGS: EmailLog[] = [
    { id: 'e1', contactId: '1', subject: 'Bienvenida a Cafh', sentAt: '2023-10-25 10:00', status: 'Opened', openedAt: '2023-10-25 10:30', campaignName: 'Onboarding' },
    { id: 'e2', contactId: '1', subject: 'Boletín Mensual Octubre', sentAt: '2023-10-01 09:00', status: 'Clicked', openedAt: '2023-10-01 09:15', clickedAt: '2023-10-01 09:20', campaignName: 'Newsletter' },
    { id: 'e3', contactId: '2', subject: 'Invitación Taller Meditación', sentAt: '2023-10-20 15:00', status: 'Delivered', campaignName: 'Eventos' },
    { id: 'e4', contactId: '3', subject: 'Actualización de Datos', sentAt: '2023-05-12 11:00', status: 'Bounced', errorMessage: 'Address not found', campaignName: 'Mantenimiento' },
];

export const MOCK_EMAIL_METRICS: EmailMetrics = {
    totalSent: 1250,
    openRate: 42.5,
    clickRate: 12.8,
    bounceRate: 2.1,
    history: [
        { date: '2023-10-20', sent: 100, opened: 45, clicked: 12 },
        { date: '2023-10-21', sent: 150, opened: 60, clicked: 18 },
        { date: '2023-10-22', sent: 80, opened: 35, clicked: 8 },
        { date: '2023-10-23', sent: 200, opened: 90, clicked: 25 },
        { date: '2023-10-24', sent: 120, opened: 55, clicked: 15 },
        { date: '2023-10-25', sent: 300, opened: 130, clicked: 40 },
        { date: '2023-10-26', sent: 250, opened: 110, clicked: 32 },
    ]
};

export const MOCK_AUTOMATIONS: AutomationWorkflow[] = [
    { id: '1', name: 'Bienvenida Nuevos Suscriptores', trigger: 'Form Submission', status: 'Active', stats: { sent: 1250, opened: 980, clicked: 450 } },
    { id: '2', name: 'Recordatorio Retiro Espiritual', trigger: 'Tag Added: Retiro', status: 'Active', stats: { sent: 300, opened: 280, clicked: 200 } },
    { id: '3', name: 'Recuperación Donantes', trigger: 'Donation Expired', status: 'Paused', stats: { sent: 50, opened: 10, clicked: 2 } },
];

export const MOCK_CONTENT: ContentItem[] = [
    { id: '1', title: 'La Búsqueda Interior', type: 'Article', status: 'Published', author: 'Santiago Bovisio', publishDate: '2023-10-01', views: 1240, tags: ['Mística', 'Lecturas Breves'] },
    { id: '2', title: 'Método de Vida: Equilibrio', type: 'Page', status: 'Published', author: 'Admin', publishDate: '2023-09-15', views: 5600, tags: ['Bienestar', 'Filosofía'] },
    { id: '3', title: 'Taller de Meditación Noviembre', type: 'Event', status: 'Draft', author: 'Coord. Actividades', publishDate: '-', views: 0, tags: ['Meditación', 'Cursos'] },
    { id: '4', title: 'Guía de Autoconocimiento.pdf', type: 'Resource', status: 'Published', author: 'Comité Editorial', publishDate: '2023-08-20', views: 890, tags: ['Bienestar', 'Biblioteca'] },
    { id: '5', title: 'Podcast: El Silencio', type: 'Resource', status: 'Published', author: 'Cafh', publishDate: '2023-11-01', views: 300, tags: ['Podcast', 'Meditación'] },
];

export const MOCK_MEDIA: MediaAsset[] = [
    {
        id: 'm1',
        name: 'Logo_Cafh_Vector.svg',
        type: 'image',
        url: 'https://picsum.photos/seed/cafh1/400/400',
        size: '45 KB',
        dimensions: '512x512',
        uploadedAt: '2023-10-01',
        tags: ['Branding', 'Logo']
    },
    {
        id: 'm2',
        name: 'Retiro_Cajon_2023.jpg',
        type: 'image',
        url: 'https://picsum.photos/seed/retiro/1200/800',
        size: '2.4 MB',
        dimensions: '1920x1080',
        uploadedAt: '2023-11-05',
        tags: ['Eventos', 'Retiro']
    },
    {
        id: 'm3',
        name: 'Guia_Meditacion_Principiantes.pdf',
        type: 'document',
        url: '#',
        size: '1.8 MB',
        uploadedAt: '2023-09-20',
        tags: ['Recursos', 'PDF']
    },
    {
        id: 'm4',
        name: 'Intro_Cafh_Video.mp4',
        type: 'video',
        url: 'https://cdn.pixabay.com/video/2020/12/03/58142-490367352_large.mp4',
        size: '15.2 MB',
        uploadedAt: '2023-08-15',
        tags: ['Video', 'Institucional']
    },
    {
        id: 'm5',
        name: 'Meditacion_Guiada_Paz.mp3',
        type: 'audio',
        url: '#',
        size: '8.4 MB',
        uploadedAt: '2023-11-10',
        tags: ['Audio', 'Meditación']
    },
    {
        id: 'm6',
        name: 'Banner_Home_V2.png',
        type: 'image',
        url: 'https://picsum.photos/seed/banner/1600/600',
        size: '1.2 MB',
        dimensions: '1600x600',
        uploadedAt: '2023-11-12',
        tags: ['Web', 'Banner']
    }
];

export const ADMIN_NAV_ITEMS = [
    { icon: 'LayoutDashboard', label: 'Dashboard', path: '/admin' },
    { icon: 'Users', label: 'CRM & Contactos', path: '/admin/crm' },
    { icon: 'MessageSquare', label: 'Mensajería', path: '/admin/messaging' },
    { icon: 'MessageCircle', label: 'Automatizaciones', path: '/admin/automations' },
    { icon: 'FileText', label: 'CMS & Contenidos', path: '/admin/cms' },
    { icon: 'Image', label: 'Biblioteca Medios', path: '/admin/media' },
    { icon: 'BarChart3', label: 'Analítica', path: '/admin/analytics' },
    { icon: 'Video', label: 'Sala Virtual', path: '/admin/meetings' },
    { icon: 'CalendarDays', label: 'Calendario', path: '/admin/activities' },
    { icon: 'Compass', label: 'Viaje Cafh', path: '/admin/journey' },
    { icon: 'Settings', label: 'Configuración', path: '/admin/settings' },
];
