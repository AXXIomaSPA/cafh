import { MOCK_BLOG_POSTS, MOCK_EVENTS, MOCK_CONTENT, MOCK_CONTACTS, MOCK_USER_HISTORY, HERO_CONFIG, BLOG_CONFIG_DEFAULT, MOCK_MEDIA, MOCK_EMAIL_LOGS, MOCK_EMAIL_METRICS, DEFAULT_HOME_CONFIG, PUBLIC_NAV_STRUCTURE } from './constants';
import { BlogPost, CalendarEvent, ContentItem, Contact, ContactList, UserActivity, ContentInteraction, HeroConfig, BlogConfig, User, UserRole, MediaAsset, EmailLog, EmailMetrics, ChangeLog, HomeConfig, CustomPage, MegaMenuItem, FooterConfig, SMTPConfig, Campaign, AutomationRule, AutomationExecution, AutomationNode, SendEmailNode, WaitNode, ConditionNode, UpdateTagNode, MoveToListNode, MeetingAgendaItem, MeetingMediaRef, ZoomWidgetConfig, FeedbackQuestion, FeedbackResponse, MemberBadge, BadgeType, ParticipationRecord, ActivityEvent, ActivityCategory, ChatMessage, ChatThread, UserWizardProfile } from './types';

// STORAGE KEYS
export const KEYS = {
    BLOG: 'cafh_blog_v1',
    BLOG_CONFIG: 'cafh_blog_config_v1',
    EVENTS: 'cafh_events_v1',
    CONTENT: 'cafh_content_v1',
    CONTACTS: 'cafh_contacts_v1',
    HISTORY: 'cafh_user_history_v1',
    HERO: 'cafh_hero_config_v1',
    USER_PREFS: 'cafh_user_prefs_v1',
    SESSION: 'cafh_user_session_v1',
    MEDIA: 'cafh_media_v1',
    EMAIL_LOGS: 'cafh_email_logs_v1',
    EMAIL_METRICS: 'cafh_email_metrics_v1',
    CONTENT_INTERACTIONS: 'cafh_content_interactions_v1',
    HOME_CONFIG: 'cafh_home_config_v1',
    CUSTOM_PAGES: 'cafh_pages_v1',
    MEGA_MENU: 'cafh_menu_v1',
    CHANGE_LOG: 'cafh_changelog_v1',
    SMTP_CONFIG: 'cafh_smtp_config_v1',
    CRM_LISTS: 'cafh_crm_lists_v1',
    CAMPAIGNS: 'cafh_campaigns_v1',
    AUTOMATIONS: 'cafh_automations_v1',
    AUTOMATION_EXECUTIONS: 'cafh_automation_executions_v1',
    // --- MÓDULO 1: Sala Virtual Zoom ---
    FEEDBACK_QUESTIONS: 'cafh_feedback_q_v1',
    FEEDBACK_RESPONSES: 'cafh_feedback_r_v1',
    MEMBER_BADGES: 'cafh_badges_v1',
    PARTICIPATION: 'cafh_participation_v1',
    ZOOM_WIDGET: 'cafh_zoom_widget_v1',
    // --- MÓDULO 2: Calendario de Actividades ---
    ACTIVITY_EVENTS: 'cafh_activity_events_v1',
    ACTIVITY_CATS: 'cafh_activity_cats_v1',
    USERS: 'cafh_users_v1',
    // --- MÓDULO 3: Mensajería Interna ---
    CHAT_THREADS: 'cafh_chat_threads_v1',
    CHAT_MESSAGES: 'cafh_chat_messages_v1',
    WIZARD_PROFILES: 'cafh_user_wizard_profiles_v1',
    JOURNEY_QUESTIONS: 'cafh_journey_questions_v1',
    JOURNEY_PROFILES: 'cafh_journey_profiles_v1',
    WIZARD_CONFIG: 'cafh_wizard_config_v1',
    SEED_VERSION: 'cafh_seed_version',
    REMOTE_SYNC_URL: 'cafh_remote_url', // URL for external JSON
    LAST_SYNC: 'cafh_last_sync'
};

// MOCK USERS FOR AUTHENTICATION
const MOCK_USERS: User[] = [
    {
        id: 'u_admin',
        name: 'Administrador Principal',
        email: 'admin@cafh.cl',
        role: UserRole.SUPER_ADMIN,
        avatarUrl: '',
        tenantId: 't_santiago_01',
        interests: [],
        joinedDate: '2023-01-01'
    },
    {
        id: 'u_member',
        name: 'Miembro Cafh',
        email: 'miembro@cafh.cl',
        role: UserRole.MEMBER,
        avatarUrl: '',
        tenantId: 't_santiago_01',
        interests: ['Meditación', 'Bienestar'],
        joinedDate: '2023-10-15'
    }
];

// SAFE STORAGE WRAPPER - Protects essential content
export const safeSetItem = (key: string, value: any): boolean => {
    const essentialKeys = [
        KEYS.BLOG, KEYS.BLOG_CONFIG, KEYS.EVENTS, KEYS.CONTENT, KEYS.CONTACTS,
        KEYS.HERO, KEYS.MEDIA, KEYS.HOME_CONFIG, KEYS.CUSTOM_PAGES, KEYS.MEGA_MENU,
        KEYS.ACTIVITY_EVENTS, KEYS.ACTIVITY_CATS, KEYS.USERS, KEYS.CRM_LISTS,
        KEYS.CAMPAIGNS, KEYS.AUTOMATIONS, KEYS.CHAT_THREADS, KEYS.CHAT_MESSAGES,
        KEYS.WIZARD_PROFILES, KEYS.JOURNEY_QUESTIONS, KEYS.JOURNEY_PROFILES, KEYS.WIZARD_CONFIG
    ];

    const purgeableKeys = [
        KEYS.HISTORY, KEYS.EMAIL_LOGS, KEYS.EMAIL_METRICS, KEYS.CONTENT_INTERACTIONS,
        KEYS.CHANGE_LOG, KEYS.AUTOMATION_EXECUTIONS, KEYS.FEEDBACK_RESPONSES, KEYS.PARTICIPATION
    ];

    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.error(`[STORAGE] Quota exceeded for key: ${key}`);

            if (essentialKeys.includes(key)) {
                console.warn(`[STORAGE] Essential data failure. Purging temporary logs to make space...`);
                purgeableKeys.forEach(pk => localStorage.removeItem(pk));

                // Try one last time after purge
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    console.log(`[STORAGE] Successfully saved ${key} after purge.`);
                    return true;
                } catch (retryErr) {
                    console.error(`[STORAGE] CRITICAL: Even after purge, could not save ${key}`);
                }
            } else if (purgeableKeys.includes(key)) {
                // If it's purgeable data, just truncate it or ignore it
                console.warn(`[STORAGE] Purging ${key} to save space.`);
                const truncated = Array.isArray(value) ? value.slice(0, 5) : null;
                if (truncated) {
                    try { localStorage.setItem(key, JSON.stringify(truncated)); return true; } catch { }
                }
            }
            // If we are here, we couldn't save or it was already alerted
            alert("Atención: El almacenamiento está casi lleno. Se han eliminado registros temporales para proteger tus contenidos.");
        } else {
            console.error(`[STORAGE] Error saving ${key}`, e);
        }
        return false;
    }
};

// HELPER TO INIT DATA IF EMPTY
const initStorage = <T>(key: string, initialData: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (!stored || stored === 'undefined' || stored === 'null') {
            safeSetItem(key, initialData);
            return initialData;
        }
        return JSON.parse(stored);
    } catch (e) {
        console.error(`Error accessing storage for ${key}`, e);
        safeSetItem(key, initialData);
        return initialData;
    }
};


// ============================================================
// --- DEFAULT DATA FOR NEW MODULES (must be before db object) ---
// ============================================================

const defaultZoomWidgetConfig: ZoomWidgetConfig = {
    subtitle: 'Reunión Virtual CAFH',
    activityName: 'Encuentro semanal de meditación',
    joinButtonText: 'Unirse a la Sala',
    zoomUrl: '',
};

const defaultFeedbackQuestions: FeedbackQuestion[] = [
    { id: 'fq_1', order: 1, text: '¿Cómo evaluarías la calidad general de la sesión?', type: 'rating', isActive: true },
    { id: 'fq_2', order: 2, text: '¿Qué aspecto te resultó más valioso?', type: 'multiple_choice', options: ['La temática', 'La dinámica grupal', 'El material de apoyo', 'La conducción'], isActive: true },
    { id: 'fq_3', order: 3, text: 'Comparte algún comentario o sugerencia (opcional)', type: 'text', isActive: true },
];

const defaultActivityCategories: ActivityCategory[] = [
    { id: 'cat_1', name: 'Meditación', color: '#6366f1', icon: 'Feather' },
    { id: 'cat_2', name: 'Estudio', color: '#0891b2', icon: 'BookOpen' },
    { id: 'cat_3', name: 'Retiro', color: '#059669', icon: 'Map' },
    { id: 'cat_4', name: 'Charla', color: '#d97706', icon: 'Mic' },
    { id: 'cat_5', name: 'Comunidad', color: '#db2777', icon: 'Users' },
];

// SEED VERSION CONTROL
const SEED_VERSION_VALUE = "1.1.0"; // Incrementado para restauración de datos 8 marzo

const SEED_DATA = {
    pages: [
        {
            id: 'p_historia_01',
            title: 'Quiénes Somos',
            slug: 'quienes-somos',
            status: 'Published',
            sections: [
                {
                    id: 's_hero_about',
                    type: 'Hero',
                    order: 0,
                    content: {
                        title: 'Quiénes Somos',
                        subtitle: 'Una comunidad global dedicada al desenvolvimiento espiritual y al servicio de la humanidad.',
                        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2000&auto=format&fit=crop',
                        ctaText: 'Ver Sedes',
                        ctaLink: '/about/locations'
                    }
                },
                {
                    id: 's_text_about_1',
                    type: 'Text',
                    order: 1,
                    content: {
                        text: '## Un legado de sabiduría viva\n\nFundada hace más de 80 años, Cafh nació como una respuesta a la necesidad humana de encontrar un sentido trascendente. A lo largo de las décadas, hemos evolucionado manteniendo intacta nuestra esencia: el método de vida.'
                    }
                },
                { id: 's_stats_about', type: 'Stats', order: 2, content: { items: [{ label: 'Año de Fundación', value: '1937', icon: 'Calendar' }, { label: 'Países con presencia', value: '20+', icon: 'Globe' }] } },
                { id: 's_timeline_about', type: 'Timeline', order: 3, content: {} },
                {
                    id: 's_cta_mission',
                    type: 'CTA',
                    order: 3,
                    content: {
                        title: 'Nuestra Misión',
                        text: '"Fomentar el desenvolvimiento espiritual de sus miembros para que, a través de su propio trabajo interior, contribuyan al bien de la sociedad y del mundo entero."',
                        buttonText: 'Saber más',
                        buttonLink: '/about'
                    }
                }
            ],
            seo: { title: 'Quiénes Somos | Cafh', description: 'Conoce la historia y misión de Cafh.', keywords: ['historia', 'misión', 'cafh'] }
        },
        {
            id: 'p_metodo_01',
            title: 'El Método',
            slug: 'el-metodo',
            status: 'Published',
            sections: [
                {
                    id: 's_hero_method',
                    type: 'Hero',
                    order: 0,
                    content: {
                        title: 'El Método',
                        subtitle: 'Un camino práctico para integrar la espiritualidad en la vida cotidiana.',
                        imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop',
                        ctaText: 'Empezar ahora',
                        ctaLink: '/login'
                    }
                },
                { id: 's_pillars_method', type: 'MethodPillars', order: 1, content: {} },
                {
                    id: 's_cta_meditation',
                    type: 'CTA',
                    order: 2,
                    content: {
                        title: 'Meditación Discursiva',
                        text: 'Nuestro método principal de meditación. No solo busca calmar la mente, sino transformar la conducta a través de la reflexión profunda.',
                        buttonText: 'Aprender a Meditar',
                        buttonLink: '/resources'
                    }
                }
            ],
            seo: { title: 'El Método | Cafh', description: 'Descubre el método de vida de Cafh.', keywords: ['meditación', 'espiritualidad', 'método'] }
        },
        {
            id: 'p_recursos_01',
            title: 'Biblioteca de Recursos',
            slug: 'biblioteca-recursos',
            status: 'Published',
            sections: [
                {
                    id: 's_hero_resources',
                    type: 'Hero',
                    order: 0,
                    content: {
                        title: 'Biblioteca de Recursos',
                        subtitle: 'Explora documentos, videos y audios para nutrir tu camino.',
                        imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2000&auto=format&fit=crop',
                        ctaText: 'Ver Todo',
                        ctaLink: '/resources'
                    }
                },
                { id: 's_text_resources', type: 'Text', order: 1, content: { text: '### Contenido para tu crecimiento\n\nEn esta sección encontrarás una selección de materiales diseñados para acompañar tu proceso de desenvolvimiento espiritual.' } },
                { id: 's_grid_resources', type: 'ResourcesGrid', order: 2, content: {} }
            ],
            seo: { title: 'Recursos | Cafh', description: 'Biblioteca de recursos espirituales.', keywords: ['libros', 'videos', 'meditaciones'] }
        },
        {
            id: 'p_actividades_01',
            title: 'Actividades y Retiros',
            slug: 'actividades-retiros',
            status: 'Published',
            sections: [
                {
                    id: 's_hero_activities',
                    type: 'Hero',
                    order: 0,
                    content: {
                        title: 'Actividades y Retiros',
                        subtitle: 'Participa de nuestros encuentros. Espacios diseñados para el aprendizaje y la vivencia espiritual.',
                        imageUrl: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2000&auto=format&fit=crop',
                        ctaText: 'Ver Calendario',
                        ctaLink: '/about'
                    }
                },
                { id: 's_cta_retreats', type: 'CTA', order: 1, content: { title: '¿Buscas un retiro?', text: 'Desconecta del ruido y reconecta contigo mismo en nuestros centros de retiro.', buttonText: 'Ver opciones', buttonLink: '/activities' } },
                { id: 's_calendar', type: 'EventsCalendar', order: 2, content: {} }
            ],
            seo: { title: 'Actividades | Cafh', description: 'Calendario de actividades y retiros.', keywords: ['retiros', 'eventos', 'cafh'] }
        }
    ]
};

// MULTI-TENANT CONTEXT FILTER
const filterByTenant = <T extends { tenantId?: string }>(items: T[]): T[] => {
    try {
        const sessionStr = localStorage.getItem(KEYS.SESSION);
        if (sessionStr) {
            const user: User = JSON.parse(sessionStr);
            if (user.role === UserRole.SUPER_ADMIN) return items; // Global view for Super Admins
            return items.filter(item => item.tenantId === user.tenantId); // Particionado por Sede
        }
    } catch {
        // Fallback or unauthenticated
    }
    return items;
};

// DATABASE API
export const db = {
    // Initializer (Run on App mount)
    init: () => {
        const currentVersion = localStorage.getItem(KEYS.SEED_VERSION);
        const needsSeed = currentVersion !== SEED_VERSION_VALUE;

        if (needsSeed || !localStorage.getItem(KEYS.CUSTOM_PAGES)) {
            console.log(`[SEED] Sincronizando base de datos local v${SEED_VERSION_VALUE}...`);

            // Core inits
            initStorage(KEYS.BLOG, MOCK_BLOG_POSTS);
            initStorage(KEYS.BLOG_CONFIG, BLOG_CONFIG_DEFAULT);
            initStorage(KEYS.EVENTS, MOCK_EVENTS);
            initStorage(KEYS.CONTENT, MOCK_CONTENT);
            initStorage(KEYS.CONTACTS, MOCK_CONTACTS);
            initStorage(KEYS.HISTORY, MOCK_USER_HISTORY);
            initStorage(KEYS.HERO, HERO_CONFIG);
            initStorage(KEYS.USER_PREFS, { theme: 'light', notifications: true });
            initStorage(KEYS.MEDIA, MOCK_MEDIA);
            initStorage(KEYS.EMAIL_LOGS, MOCK_EMAIL_LOGS);
            initStorage(KEYS.EMAIL_METRICS, MOCK_EMAIL_METRICS);
            initStorage(KEYS.USERS, MOCK_USERS);
            initStorage(KEYS.HOME_CONFIG, DEFAULT_HOME_CONFIG);
            initStorage(KEYS.MEGA_MENU, PUBLIC_NAV_STRUCTURE);
            initStorage(KEYS.ACTIVITY_EVENTS, [
                {
                    id: 'act_recovery_1',
                    title: 'Taller de Meditación Discursiva (Sesión Sábado)',
                    description: 'Sesión de práctica intensiva restaurada del 7 de marzo.',
                    category: 'Meditación',
                    tags: ['Práctica', 'Silencio'],
                    startDate: '2026-03-07',
                    endDate: '2026-03-07',
                    startTime: '10:00',
                    endTime: '12:00',
                    modality: 'Virtual',
                    status: 'Publicado',
                    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
                    featuredInDashboard: true,
                    recurrence: { frequency: 'none', interval: 1, daysOfWeek: [], endType: 'never' },
                    createdAt: '2026-03-07T10:00:00.000Z',
                    updatedAt: '2026-03-07T10:00:00.000Z'
                },
                {
                    id: 'act_recovery_2',
                    title: 'Reunión Semanal de Comunidad',
                    description: 'Encuentro recurrente programado para domingos.',
                    category: 'Comunidad',
                    tags: ['Grupos', 'Diálogo'],
                    startDate: '2026-03-08',
                    endDate: '2026-03-08',
                    startTime: '18:00',
                    endTime: '19:30',
                    modality: 'Híbrida',
                    status: 'Publicado',
                    featuredInDashboard: true,
                    recurrence: { frequency: 'weekly', interval: 1, daysOfWeek: [0], endType: 'never' },
                    createdAt: '2026-03-07T15:00:00.000Z',
                    updatedAt: '2026-03-07T15:00:00.000Z'
                }
            ]);

            // Specific Page Seeding
            const storedPagesStr = localStorage.getItem(KEYS.CUSTOM_PAGES);
            const existingPages = (storedPagesStr && storedPagesStr !== '[]') ? JSON.parse(storedPagesStr) : [];

            const mergedPages = Array.isArray(existingPages) ? [...existingPages] : [];
            SEED_DATA.pages.forEach(seedPage => {
                if (!mergedPages.find(p => p.slug === seedPage.slug)) {
                    mergedPages.push(seedPage);
                }
            });
            safeSetItem(KEYS.USERS, [
                ...MOCK_USERS,
                {
                    id: 'u_victor_test',
                    name: 'Victor 3 Test',
                    email: 'admin@cafh.cl',
                    role: UserRole.SUPER_ADMIN,
                    avatarUrl: '',
                    tenantId: 't_santiago_01',
                    interests: ['Meditación', 'Bienestar'],
                    joinedDate: '2026-03-06',
                    status: 'Active'
                }
            ]);
            safeSetItem(KEYS.CUSTOM_PAGES, mergedPages);
            safeSetItem(KEYS.SEED_VERSION, SEED_VERSION_VALUE);
        } else {
            initStorage(KEYS.BLOG, MOCK_BLOG_POSTS);
            initStorage(KEYS.HOME_CONFIG, DEFAULT_HOME_CONFIG);
        }

        // Inits for secondary modules
        initStorage(KEYS.ZOOM_WIDGET, defaultZoomWidgetConfig);
        initStorage(KEYS.FEEDBACK_QUESTIONS, defaultFeedbackQuestions);
        initStorage(KEYS.ACTIVITY_CATS, defaultActivityCategories);
        initStorage(KEYS.CHAT_THREADS, []);
        initStorage(KEYS.CHAT_MESSAGES, []);
        initStorage(KEYS.WIZARD_PROFILES, []);
        initStorage(KEYS.JOURNEY_QUESTIONS, []);
        initStorage(KEYS.JOURNEY_PROFILES, []);

        // Intento de Sincronización Remota (Opcional si hay URL configurada)
        db.system.syncRemote();

        console.log("Cafh Local Memory System: Initialized (Simulated 200MB Persistence)");
    },

    // AUTHENTICATION MODULE
    auth: {
        login: (email: string, pass: string): User | null => {
            const allUsers: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');

            // Allow login if email exists (prototype bypasses strict real hash pass logic)
            // For mock demo, if it's admin@cafh.cl, pass must be admin123.
            // For miembro@cafh.cl, pass must be miembro123.
            // For newly registered users, accepting any password >= 6 length.
            const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (user) {
                const isMockUser = user.email === 'admin@cafh.cl' || user.email === 'miembro@cafh.cl';
                const passValid = isMockUser
                    ? (user.email === 'admin@cafh.cl' && pass === 'admin123') || (user.email === 'miembro@cafh.cl' && pass === 'miembro123')
                    : pass.length >= 6; // for newly registered users

                if (passValid) {
                    safeSetItem(KEYS.SESSION, user);
                    return user;
                }
            }
            return null;
        },
        register: (name: string, email: string, phone: string = ''): { user?: User; error?: string } => {
            const allUsers: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
            const allContacts = db.crm.getAll();

            if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                return { error: 'El email ya está registrado en nuestra plataforma.' };
            }

            if (phone && allContacts.find(c => c.phone === phone)) {
                return { error: 'El número de teléfono ya se encuentra en uso.' };
            }

            const newUser: User = {
                id: `u_${Date.now()}`,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                role: UserRole.MEMBER, // Jamás admin por defecto
                avatarUrl: '',
                tenantId: 't_santiago_01',
                interests: [],
                joinedDate: new Date().toISOString().split('T')[0],
                status: 'Pending'
            };

            // Save to Users table
            allUsers.push(newUser);
            safeSetItem(KEYS.USERS, allUsers);

            // Automatically map/create CRM Contact
            if (!allContacts.find(c => c.email.toLowerCase() === newUser.email)) {
                db.crm.add({
                    name: newUser.name,
                    email: newUser.email,
                    phone: phone.trim(),
                    role: 'Member',
                    status: 'Pending',
                    lastContact: new Date().toISOString().split('T')[0],
                    tags: ['web_registration']
                });
            }

            return { user: newUser };
        },
        resetPassword: (email: string): boolean => {
            const allUsers: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
            const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (user) {
                // Find contact to simulate mail sending
                const allContacts = db.crm.getAll();
                const contact = allContacts.find(c => c.email.toLowerCase() === email.toLowerCase());

                if (contact) {
                    db.emails.send(contact.id, 'Recuperación de contraseña', `<p>Hola ${user.name}, haz click aquí para restablecer tu contraseña.</p>`);
                }
                return true;
            }
            return false;
        },
        logout: () => {
            localStorage.removeItem(KEYS.SESSION);
        },
        getCurrentUser: (): User | null => {
            try {
                const session = localStorage.getItem(KEYS.SESSION);
                return session ? JSON.parse(session) : null;
            } catch {
                return null;
            }
        },
        getAllUsers: (): User[] => {
            const allUsers: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
            return filterByTenant(allUsers);
        },
        updateCurrentUser: (updates: Partial<User>): User | null => {
            try {
                const session = localStorage.getItem(KEYS.SESSION);
                if (session) {
                    const current = JSON.parse(session);
                    const updated = { ...current, ...updates };

                    // Update session
                    safeSetItem(KEYS.SESSION, updated);

                    // Update user in USERS array
                    const allUsers: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
                    const idx = allUsers.findIndex(u => u.id === updated.id);
                    if (idx !== -1) {
                        allUsers[idx] = updated;
                        safeSetItem(KEYS.USERS, allUsers);
                    }

                    return updated;
                }
            } catch {
                // ignore
            }
            return null;
        }
    },

    // MANAGEABLE HERO CONFIG
    hero: {
        get: (): HeroConfig => {
            const stored = localStorage.getItem(KEYS.HERO);
            return stored ? JSON.parse(stored) : HERO_CONFIG;
        },
        update: (newConfig: HeroConfig) => {
            safeSetItem(KEYS.HERO, newConfig);
            return newConfig;
        }
    },

    // Generic Getters
    blog: {
        getAll: (): BlogPost[] => JSON.parse(localStorage.getItem(KEYS.BLOG) || '[]'),
        getConfig: (): BlogConfig => {
            const stored = localStorage.getItem(KEYS.BLOG_CONFIG);
            return stored ? JSON.parse(stored) : BLOG_CONFIG_DEFAULT;
        },
        updateConfig: (config: BlogConfig) => {
            safeSetItem(KEYS.BLOG_CONFIG, config);
            return config;
        },
        add: (post: BlogPost) => {
            const current = db.blog.getAll();
            const updated = [post, ...current];
            safeSetItem(KEYS.BLOG, updated);
            return updated;
        }
    },
    events: {
        getAll: (): CalendarEvent[] => JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]'),
        add: (event: CalendarEvent) => {
            const current = db.events.getAll();
            const updated = [...current, event];
            safeSetItem(KEYS.EVENTS, updated);
            return updated;
        }
    },
    content: {
        getAll: (): ContentItem[] => JSON.parse(localStorage.getItem(KEYS.CONTENT) || '[]'),
        // Simulates search/filter
        search: (query: string, type?: string) => {
            let items: ContentItem[] = JSON.parse(localStorage.getItem(KEYS.CONTENT) || '[]');
            if (type) items = items.filter(i => i.type === type);
            if (query) items = items.filter(i => i.title.toLowerCase().includes(query.toLowerCase()) || i.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));
            return items;
        }
    },
    media: {
        getAll: (): MediaAsset[] => JSON.parse(localStorage.getItem(KEYS.MEDIA) || '[]'),
        add: (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => {
            const current = db.media.getAll();
            const newAsset: MediaAsset = {
                ...asset,
                id: Math.random().toString(36).substr(2, 9),
                uploadedAt: new Date().toISOString().split('T')[0]
            };
            const updated = [newAsset, ...current];
            safeSetItem(KEYS.MEDIA, updated);
            return updated;
        },
        delete: (id: string) => {
            const current = db.media.getAll();
            const updated = current.filter(m => m.id !== id);
            safeSetItem(KEYS.MEDIA, updated);
            return updated;
        },
        search: (query: string, type?: string) => {
            let items = db.media.getAll();
            if (type && type !== 'all') items = items.filter(i => i.type === type);
            if (query) items = items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()) || i.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));
            return items;
        }
    },
    analytics: {
        trackConsumption: (interaction: Omit<ContentInteraction, 'id' | 'timestamp'>) => {
            const history = db.analytics.getInteractions();
            const newInteraction: ContentInteraction = {
                ...interaction,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString()
            };
            // Limit array to prevent localstorage crash
            const updated = [newInteraction, ...history].slice(0, 5000);
            safeSetItem(KEYS.CONTENT_INTERACTIONS, updated);

            // Also increment views on the content/media item directly if possible
            if (interaction.assetType === 'Article' || interaction.assetType === 'Resource' || interaction.assetType === 'Page' || interaction.assetType === 'Event') {
                const currentContent = db.content.getAll();
                const contentIndex = currentContent.findIndex(c => c.id === interaction.assetId);
                if (contentIndex !== -1) {
                    currentContent[contentIndex].views = (currentContent[contentIndex].views || 0) + 1;
                    safeSetItem(KEYS.CONTENT, currentContent);
                }
            }

            return newInteraction;
        },
        getInteractions: (): ContentInteraction[] => {
            try {
                return JSON.parse(localStorage.getItem(KEYS.CONTENT_INTERACTIONS) || '[]');
            } catch { return []; }
        }
    },
    // CMS & PAGE BUILDER MODULES
    cms: {
        // Change Log System
        logChange: (section: string, action: ChangeLog['action'], details: string, previousState?: any) => {
            const user = db.auth.getCurrentUser();
            const logs: ChangeLog[] = JSON.parse(localStorage.getItem(KEYS.CHANGE_LOG) || '[]');

            // Optimization: Don't store massive previous states in logs to avoid QuotaExceededError
            let optimizedPrev = undefined;
            if (previousState) {
                const str = JSON.stringify(previousState);
                optimizedPrev = str.length > 2000 ? { info: "Objeto demasiado grande para bitácora", size: str.length } : str;
            }

            const newLog: ChangeLog = {
                id: Math.random().toString(36).substring(2, 9),
                userId: user?.id || 'system',
                userEmail: user?.email || 'system',
                userName: user?.name || 'Sistema',
                section,
                action,
                timestamp: new Date().toISOString(),
                details,
                previousState: optimizedPrev
            };
            logs.unshift(newLog);
            try {
                safeSetItem(KEYS.CHANGE_LOG, logs.slice(0, 50)); // Reduced to 50 for safety
            } catch (e) {
                safeSetItem(KEYS.CHANGE_LOG, logs.slice(0, 5)); // Emergency fallback
            }
            return newLog;
        },
        getChangeLogs: (): ChangeLog[] => {
            try {
                const parsed = JSON.parse(localStorage.getItem(KEYS.CHANGE_LOG) || '[]');
                return Array.isArray(parsed) ? parsed : [];
            } catch { return []; }
        },

        // Home Management
        getHomeConfig: (): HomeConfig => {
            const stored = localStorage.getItem(KEYS.HOME_CONFIG);
            if (!stored) return DEFAULT_HOME_CONFIG;
            try {
                const parsed = JSON.parse(stored) || {};

                return {
                    ...DEFAULT_HOME_CONFIG,
                    ...parsed,
                    sectionOrder: Array.isArray(parsed.sectionOrder) ? parsed.sectionOrder : DEFAULT_HOME_CONFIG.sectionOrder,
                    searchItems: Array.isArray(parsed.searchItems) ? parsed.searchItems : DEFAULT_HOME_CONFIG.searchItems,
                    searchSubtitle: parsed.searchSubtitle || DEFAULT_HOME_CONFIG.searchSubtitle,
                    threeColumns: Array.isArray(parsed.threeColumns) ? parsed.threeColumns : DEFAULT_HOME_CONFIG.threeColumns,
                    hero: {
                        ...DEFAULT_HOME_CONFIG.hero,
                        ...(parsed.hero || {}),
                        backgrounds: Array.isArray(parsed.hero?.backgrounds) ? parsed.hero.backgrounds : DEFAULT_HOME_CONFIG.hero.backgrounds
                    },
                    blogSection: { ...DEFAULT_HOME_CONFIG.blogSection, ...(parsed.blogSection || {}) },
                    activitiesSection: { ...DEFAULT_HOME_CONFIG.activitiesSection, ...(parsed.activitiesSection || {}) },
                    footer: {
                        ...DEFAULT_HOME_CONFIG.footer,
                        ...(parsed.footer || {}),
                        columns: Array.isArray(parsed.footer?.columns) ? parsed.footer.columns : DEFAULT_HOME_CONFIG.footer.columns,
                        socialLinks: Array.isArray(parsed.footer?.socialLinks) ? parsed.footer.socialLinks : DEFAULT_HOME_CONFIG.footer.socialLinks
                    }
                };
            } catch {
                return DEFAULT_HOME_CONFIG;
            }
        },
        getFooterConfig: (): FooterConfig => {
            return db.cms.getHomeConfig().footer;
        },
        updateHomeConfig: (config: HomeConfig) => {
            const prev = db.cms.getHomeConfig();
            try {
                safeSetItem(KEYS.HOME_CONFIG, config);
            } catch (err) {
                console.error('CRITICAL: LocalStorage is full. Changes NOT saved permanently.', err);
                alert("⚠️ Error: El almacenamiento del navegador está lleno. Los cambios se perderán al recargar. Por favor, elimina recursos pesados o limpia tu caché.");
            }
            db.cms.logChange('Home', 'Update', 'Actualización de configuración de Home', prev);
            return config;
        },

        // Custom Pages (WYSIWYG)
        getPages: (): CustomPage[] => {
            try {
                const parsed = JSON.parse(localStorage.getItem(KEYS.CUSTOM_PAGES) || '[]');
                return Array.isArray(parsed) ? parsed : [];
            } catch { return []; }
        },
        getPageBySlug: (slug: string): CustomPage | undefined => db.cms.getPages().find(p => p.slug === slug),
        savePage: (page: CustomPage) => {
            const pages = db.cms.getPages();
            const index = pages.findIndex(p => p.id === page.id);
            const prev = index !== -1 ? pages[index] : null;

            if (index !== -1) pages[index] = page;
            else pages.push(page);

            try {
                safeSetItem(KEYS.CUSTOM_PAGES, pages);
            } catch (e) {
                console.error("Storage full saving page", e);
                alert("⚠️ Error: No hay espacio para guardar la página.");
            }
            db.cms.logChange(`Página: ${page.title}`, prev ? 'Update' : 'Create', `Guardado de página ${page.slug}`, prev);
            return pages;
        },
        deletePage: (id: string) => {
            const pages = db.cms.getPages();
            const page = pages.find(p => p.id === id);
            const updated = pages.filter(p => p.id !== id);
            safeSetItem(KEYS.CUSTOM_PAGES, updated);
            db.cms.logChange(`Página: ${page?.title}`, 'Delete', `Eliminación de página ${page?.slug}`, page);
            return updated;
        },

        // Mega Menu
        getMenu: (): MegaMenuItem[] => {
            try {
                const parsed = JSON.parse(localStorage.getItem(KEYS.MEGA_MENU) || '[]');
                return Array.isArray(parsed) ? parsed : [];
            } catch { return PUBLIC_NAV_STRUCTURE; }
        },
        updateMenu: (menu: MegaMenuItem[]) => {
            const prev = db.cms.getMenu();
            safeSetItem(KEYS.MEGA_MENU, menu);
            db.cms.logChange('Mega Menú', 'Update', 'Actualización de estructura de navegación', prev);
            return menu;
        },
        getAllAvailableRoutes: (): { label: string; path: string; isDynamic?: boolean }[] => {
            const staticRoutes = [
                { label: 'Inicio', path: '/' },
                { label: 'Quiénes Somos', path: '/about' },
                { label: 'Nuestra Historia', path: '/about/history' },
                { label: 'Misión y Visión', path: '/about/mission' },
                { label: 'Sedes en el Mundo', path: '/about/locations' },
                { label: 'Comunidad', path: '/about/community' },
                { label: 'El Método', path: '/method' },
                { label: 'Vida Interior', path: '/method/inner-life' },
                { label: 'Mística del Corazón', path: '/method/mystic' },
                { label: 'Meditación', path: '/method/meditation' },
                { label: 'Estudio', path: '/method/study' },
                { label: 'Recursos', path: '/resources' },
                { label: 'Biblioteca Digital', path: '/resources/library' },
                { label: 'Videos y Charlas', path: '/resources/videos' },
                { label: 'Blog', path: '/resources/blog' },
                { label: 'Podcast', path: '/resources/podcast' },
                { label: 'Actividades', path: '/activities' },
                { label: 'Calendario', path: '/activities/calendar' },
                { label: 'Retiros', path: '/activities/retreats' },
                { label: 'Reuniones', path: '/activities/meetings' },
                { label: 'Login / Miembros', path: '/login' },
                { label: 'Contacto', path: '/contact' },
            ];

            const dynamicPages = db.cms.getPages().map(p => ({
                label: `[Página] ${p.title}`,
                path: `/p/${p.slug}`,
                isDynamic: true
            }));

            return [...staticRoutes, ...dynamicPages];
        }
    },

    // User Context
    user: {
        getHistory: (): UserActivity[] => {
            const allHistory: UserActivity[] = JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]');
            const user = db.auth.getCurrentUser();
            if (!user) return [];
            return allHistory.filter(a => a.userId === user.id);
        },
        addHistory: (activity: UserActivity) => {
            const allHistory: UserActivity[] = JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]');
            const user = db.auth.getCurrentUser();
            if (user && !activity.userId) {
                activity.userId = user.id;
            }
            const updated = [activity, ...allHistory];
            safeSetItem(KEYS.HISTORY, updated);
        },
        getPreferences: () => JSON.parse(localStorage.getItem(KEYS.USER_PREFS) || '{}')
    },
    // CRM & EMAIL MODULES
    crm: {
        getAll: (): Contact[] => {
            const allContacts: Contact[] = JSON.parse(localStorage.getItem(KEYS.CONTACTS) || '[]');
            return filterByTenant(allContacts);
        },
        getById: (id: string): Contact | undefined => db.crm.getAll().find(c => c.id === id),
        update: (contact: Contact) => {
            const all = db.crm.getAll();
            const index = all.findIndex(c => c.id === contact.id);
            if (index !== -1) {
                all[index] = contact;
                safeSetItem(KEYS.CONTACTS, all);
            }
            return all;
        },
        save: (contact: Contact) => db.crm.update(contact),
        delete: (id: string) => {
            const all = JSON.parse(localStorage.getItem(KEYS.CONTACTS) || '[]');
            const updated = all.filter((c: any) => c.id !== id);
            safeSetItem(KEYS.CONTACTS, updated);
            return updated;
        },
        add: (contact: Omit<Contact, 'id'>) => {
            const all = db.crm.getAll();
            const newContact = { ...contact, id: Math.random().toString(36).substr(2, 9) } as Contact;
            all.push(newContact);
            safeSetItem(KEYS.CONTACTS, all);
            return newContact;
        },
        addLead: async (lead: { email: string; source: string; date: string; status: string }) => {
            const contacts = db.crm.getAll();
            const newContact: Contact = {
                id: Math.random().toString(36).substr(2, 9),
                name: lead.email.split('@')[0],
                email: lead.email,
                phone: '',
                role: 'Lead',
                status: lead.status as any,
                lastContact: lead.date,
                tags: [lead.source],
                notes: `Suscrito desde el footer. Origen: ${lead.source}`
            };
            contacts.push(newContact);
            safeSetItem(KEYS.CONTACTS, contacts);
            return newContact;
        },
        addMultiple: (newContacts: Omit<Contact, 'id'>[]) => {
            const all = db.crm.getAll();
            const hydratedContacts = newContacts.map(c => ({
                ...c,
                id: Math.random().toString(36).substr(2, 9)
            }));
            const updated = [...all, ...hydratedContacts];

            // Limit on frontend memory to avoid catastrophic crash, normally handled by DB pagination.
            if (updated.length > 5000) {
                console.warn("CRM Storage limit warning. Optimizing array.");
            }

            safeSetItem(KEYS.CONTACTS, updated);
            return hydratedContacts;
        },
        getLists: (): ContactList[] => {
            try {
                const allLists: ContactList[] = JSON.parse(localStorage.getItem(KEYS.CRM_LISTS) || '[]');
                return filterByTenant(allLists);
            } catch { return []; }
        },
        addList: (listData: Omit<ContactList, 'id' | 'createdAt'>) => {
            const all = db.crm.getLists();
            const newList: ContactList = {
                ...listData,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
                contactCount: 0
            };
            all.push(newList);
            safeSetItem(KEYS.CRM_LISTS, all);
            return newList;
        },
        updateList: (list: ContactList) => {
            const all = db.crm.getLists();
            const idx = all.findIndex(l => l.id === list.id);
            if (idx !== -1) {
                all[idx] = list;
                safeSetItem(KEYS.CRM_LISTS, all);
            }
            return all;
        },
        deleteList: (listId: string) => {
            const all = db.crm.getLists().filter(l => l.id !== listId);
            safeSetItem(KEYS.CRM_LISTS, all);

            // Remove listId from all contacts
            const contacts = db.crm.getAll();
            let changed = false;
            for (const c of contacts) {
                if (c.listIds && c.listIds.includes(listId)) {
                    c.listIds = c.listIds.filter(id => id !== listId);
                    changed = true;
                }
            }
            if (changed) {
                safeSetItem(KEYS.CONTACTS, contacts);
            }
            return all;
        }
    },
    admin: {
        approveMember: async (contactId: string) => {
            const contact = db.crm.getById(contactId);
            if (!contact || contact.status !== 'Pending') return null;

            // Updated contact status
            contact.status = 'Subscribed';
            contact.notes = (contact.notes || '') + `\n[${new Date().toISOString().split('T')[0]}] Cuenta activada por administrador.`;
            contact.tags = Array.from(new Set([...(contact.tags || []), 'Miembro', 'Active']));
            db.crm.update(contact);

            // Updated associated user status if exists
            const allUsers = db.auth.getAllUsers();
            const userIndex = allUsers.findIndex(u => u.email.toLowerCase() === contact.email.toLowerCase());
            if (userIndex !== -1) {
                allUsers[userIndex].status = 'Active';
                safeSetItem(KEYS.USERS, allUsers);

                // If currently logged in as this user, update session
                const currentUser = db.auth.getCurrentUser();
                if (currentUser && currentUser.email.toLowerCase() === contact.email.toLowerCase()) {
                    db.auth.updateCurrentUser({ status: 'Active' });
                }
            }

            // Simulate Welcome Email
            await db.emails.send(
                contact.id,
                '¡Bienvenido a la Comunidad Cafh!',
                `<h1>Hola ${contact.name}!</h1><p>Tu cuenta ha sido activada exitosamente por nuestro equipo administrativo. Ya puedes acceder a todos los contenidos exclusivos para miembros.</p><p>Que tu camino de desenvolvimiento sea pleno.</p>`
            );

            // Log change in CMS logs
            db.cms.logChange('Users', 'Update', `Usuario ${contact.email} activado por administrador.`);

            return contact;
        }
    },
    emails: {
        getLogs: (contactId?: string): EmailLog[] => {
            const all: EmailLog[] = JSON.parse(localStorage.getItem(KEYS.EMAIL_LOGS) || '[]');
            return contactId ? all.filter(l => l.contactId === contactId) : all;
        },
        getMetrics: (): EmailMetrics => JSON.parse(localStorage.getItem(KEYS.EMAIL_METRICS) || JSON.stringify(MOCK_EMAIL_METRICS)),
        getSMTPConfig: (): SMTPConfig => {
            const defaultSMTP: SMTPConfig = {
                host: 'mail.cafh.cl', port: '465', secure: true, user: 'no-reply@cafh.cl', pass: '', fromEmail: 'no-reply@cafh.cl', fromName: 'Cafh'
            };
            return JSON.parse(localStorage.getItem(KEYS.SMTP_CONFIG) || JSON.stringify(defaultSMTP));
        },
        updateSMTPConfig: (config: SMTPConfig) => {
            safeSetItem(KEYS.SMTP_CONFIG, config);
            return config;
        },
        getQueueStatus: async () => {
            try {
                const response = await fetch('/api/email/status');
                return await response.json();
            } catch (e) {
                console.error("Error fetching queue status", e);
                return { pending: 0, sent: 0, failed: 0, sentCountThisHour: 0, limit: 80 };
            }
        },
        send: async (contactId: string, subject: string, content: string) => {
            const contact = db.crm.getById(contactId);
            if (!contact) return null;

            console.log(`[Backend API] Queueing email to contact ${contact.email}: ${subject}`);

            // Mock local insertion so UI works even without backend
            const logs = db.emails.getLogs();
            const newLog: EmailLog = {
                id: Math.random().toString(36).substr(2, 9),
                contactId,
                subject,
                sentAt: new Date().toISOString().replace('T', ' ').substr(0, 16),
                status: 'Queued',
                campaignName: 'Direct Message' // Identificador de envío unitario
            };
            logs.unshift(newLog);
            safeSetItem(KEYS.EMAIL_LOGS, logs);

            try {
                await fetch('/api/email/queue', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipients: [contact.email],
                        subject,
                        content
                    })
                });
            } catch (e) {
                console.warn("Backend missing, but logged locally for CRM UI.", e);
            }
            return newLog;
        },
        sendMass: async (recipients: string[], subject: string, content: string) => {
            // Mock local insertion
            const logs = db.emails.getLogs();
            recipients.forEach(email => {
                const contact = db.crm.getAll().find(c => c.email === email);
                if (contact) {
                    logs.unshift({
                        id: Math.random().toString(36).substr(2, 9),
                        contactId: contact.id,
                        subject,
                        sentAt: new Date().toISOString().replace('T', ' ').substr(0, 16),
                        status: 'Queued',
                        campaignName: 'Mass Campaign' // Identificador de envío masivo
                    });
                }
            });
            safeSetItem(KEYS.EMAIL_LOGS, logs);

            try {
                await fetch('/api/email/queue', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipients,
                        subject,
                        content
                    })
                });
                return { success: true };
            } catch (e) {
                console.warn("Backend missing for mass update, logged locally for CRM UI.", e);
                return { success: true };
            }
        }
    },
    mailrelay: {
        syncContact: async (contact: Contact) => {
            console.log(`[Mailrelay API] Syncing contact ${contact.email}...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const updatedContact = { ...contact, mailrelayId: `mr_${Math.random().toString(36).substr(2, 5)}` };
            db.crm.update(updatedContact);
            return updatedContact;
        }
    },

    // --- CAMPAIGNS MODULE ---
    campaigns: {
        getAll: (): Campaign[] => {
            try { return JSON.parse(localStorage.getItem(KEYS.CAMPAIGNS) || '[]'); }
            catch { return []; }
        },
        getById: (id: string): Campaign | undefined => db.campaigns.getAll().find(c => c.id === id),
        save: (campaign: Campaign): Campaign => {
            const all = db.campaigns.getAll();
            const idx = all.findIndex(c => c.id === campaign.id);
            if (idx !== -1) all[idx] = campaign;
            else all.unshift(campaign);
            safeSetItem(KEYS.CAMPAIGNS, all);
            return campaign;
        },
        create: (data: Omit<Campaign, 'id' | 'createdAt' | 'metrics'>): Campaign => {
            const campaign: Campaign = {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
                metrics: { sent: 0, opened: 0, clicked: 0, bounced: 0 }
            };
            return db.campaigns.save(campaign);
        },
        delete: (id: string) => {
            const updated = db.campaigns.getAll().filter(c => c.id !== id);
            safeSetItem(KEYS.CAMPAIGNS, updated);
        },
        sendTest: async (campaignId: string, testEmail: string): Promise<void> => {
            const campaign = db.campaigns.getById(campaignId);
            if (!campaign) return;
            // Log mock test send
            console.log(`[Campaign Test] Sending test of "${campaign.subject}" to ${testEmail}`);
            // Try real API
            try {
                await fetch('/api/email/queue', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recipients: [testEmail], subject: `[TEST] ${campaign.subject}`, content: campaign.content })
                });
            } catch { console.warn('[Campaign Test] Backend not available, test logged locally.'); }
            // Update campaign record
            db.campaigns.save({ ...campaign, status: 'Testing', testEmail });
        },
        launch: async (campaignId: string): Promise<{ recipientCount: number }> => {
            const campaign = db.campaigns.getById(campaignId);
            if (!campaign) return { recipientCount: 0 };

            const allContacts = db.crm.getAll();
            let recipients: Contact[] = [];
            if (campaign.recipientType === 'all') recipients = allContacts;
            else if (campaign.recipientType === 'subscribed') recipients = allContacts.filter(c => c.status === 'Subscribed');
            else if (campaign.recipientType === 'list' && campaign.listId) {
                recipients = allContacts.filter(c => c.listIds?.includes(campaign.listId!));
            }

            const recipientEmails = recipients.map(c => c.email);

            // Log in email_logs for each recipient
            const logs = db.emails.getLogs();
            recipients.forEach(contact => {
                logs.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    contactId: contact.id,
                    subject: campaign.subject,
                    sentAt: new Date().toISOString().replace('T', ' ').substr(0, 16),
                    status: 'Queued',
                    campaignName: campaign.name
                });
            });
            safeSetItem(KEYS.EMAIL_LOGS, logs);

            // Try backend
            try {
                await fetch('/api/email/queue', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recipients: recipientEmails, subject: campaign.subject, content: campaign.content })
                });
            } catch { console.warn('[Campaign Launch] Backend not available, campaign logged locally.'); }

            // Update campaign record
            db.campaigns.save({
                ...campaign,
                status: 'Sent',
                sentAt: new Date().toISOString(),
                recipientCount: recipients.length,
                metrics: { sent: recipients.length, opened: 0, clicked: 0, bounced: 0 }
            });

            return { recipientCount: recipients.length };
        }
    },

    // ============================================================
    // AUTOMATION ENGINE
    // ============================================================
    automations: {
        getAll: (): AutomationRule[] => {
            try { return JSON.parse(localStorage.getItem(KEYS.AUTOMATIONS) || '[]'); } catch { return []; }
        },
        getById: (id: string): AutomationRule | null => {
            return db.automations.getAll().find(a => a.id === id) || null;
        },
        save: (rule: AutomationRule): AutomationRule => {
            const all = db.automations.getAll().filter(a => a.id !== rule.id);
            all.unshift({ ...rule, updatedAt: new Date().toISOString() });
            safeSetItem(KEYS.AUTOMATIONS, all);
            return rule;
        },
        create: (data: Omit<AutomationRule, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): AutomationRule => {
            const rule: AutomationRule = {
                ...data,
                id: `aut_${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                stats: { totalExecutions: 0, completed: 0, emailsSent: 0, tagsApplied: 0 }
            };
            const all = db.automations.getAll();
            all.unshift(rule);
            safeSetItem(KEYS.AUTOMATIONS, all);
            return rule;
        },
        delete: (id: string): void => {
            const all = db.automations.getAll().filter(a => a.id !== id);
            safeSetItem(KEYS.AUTOMATIONS, all);
        },
        // ── EXECUTIONS ──────────────────────────────────────────
        getExecutions: (): AutomationExecution[] => {
            try { return JSON.parse(localStorage.getItem(KEYS.AUTOMATION_EXECUTIONS) || '[]'); } catch { return []; }
        },
        saveExecution: (exec: AutomationExecution): void => {
            const all = db.automations.getExecutions().filter(e => e.id !== exec.id);
            all.unshift(exec);
            // Keep max 500 executions
            safeSetItem(KEYS.AUTOMATION_EXECUTIONS, all.slice(0, 500));
        },
        // ── ENGINE: evaluate nodes for a single contact ─────────
        _evaluateNodes: async (
            nodes: AutomationNode[],
            contact: Contact,
            execLog: string[],
            automationId: string
        ): Promise<{ emailsSent: number; tagsApplied: number }> => {
            let emailsSent = 0;
            let tagsApplied = 0;

            for (const node of nodes) {
                if (node.type === 'send_email') {
                    const n = node as SendEmailNode;
                    // Log the email send to email_logs
                    const logs: EmailLog[] = JSON.parse(localStorage.getItem(KEYS.EMAIL_LOGS) || '[]');
                    logs.unshift({
                        id: `log_aut_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                        contactId: contact.id,
                        subject: n.subject,
                        status: 'Delivered' as const,
                        sentAt: new Date().toISOString(),
                        campaignName: `[Auto] ${automationId}`,
                    });
                    safeSetItem(KEYS.EMAIL_LOGS, logs);
                    execLog.push(`📧 Email enviado: "${n.subject}" → ${contact.email}`);
                    emailsSent++;

                    // Try backend if available
                    try {
                        await fetch('/api/email/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ to: contact.email, subject: n.subject, html: n.content })
                        });
                    } catch { /* backend may not be available */ }

                } else if (node.type === 'wait') {
                    const n = node as WaitNode;
                    const unitLabel = n.unit === 'minutes' ? 'min' : n.unit === 'hours' ? 'h' : 'días';
                    execLog.push(`⏳ Espera simulada: ${n.amount} ${unitLabel}`);
                    // In a real system this would schedule a job. Here we simulate instantly.

                } else if (node.type === 'condition') {
                    const n = node as ConditionNode;
                    let conditionMet = false;

                    if (n.check === 'has_tag') {
                        conditionMet = (contact.tags || []).includes(n.value || '');
                    } else if (n.check === 'in_list') {
                        conditionMet = (contact.listIds || []).includes(n.value || '');
                    } else if (n.check === 'email_opened' || n.check === 'email_clicked') {
                        const logs: EmailLog[] = JSON.parse(localStorage.getItem(KEYS.EMAIL_LOGS) || '[]');
                        const recent = logs.filter(l =>
                            l.contactId === contact.id &&
                            (l.status === 'Opened' || l.status === 'Clicked') &&
                            new Date(l.sentAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        );
                        conditionMet = recent.length > 0;
                    }

                    execLog.push(`🔀 Condición (${n.check}): ${conditionMet ? '✅ Rama VERDADERO' : '❌ Rama FALSO'}`);
                    const branch = conditionMet ? n.branchTrue : n.branchFalse;
                    if (branch && branch.length > 0) {
                        const sub = await db.automations._evaluateNodes(branch, contact, execLog, automationId);
                        emailsSent += sub.emailsSent;
                        tagsApplied += sub.tagsApplied;
                    }

                } else if (node.type === 'update_tag') {
                    const n = node as UpdateTagNode;
                    const contacts: Contact[] = JSON.parse(localStorage.getItem(KEYS.CONTACTS) || '[]');
                    const idx = contacts.findIndex(c => c.id === contact.id);
                    if (idx !== -1) {
                        const tags = contacts[idx].tags || [];
                        if (n.action === 'add' && !tags.includes(n.tag)) {
                            contacts[idx].tags = [...tags, n.tag];
                        } else if (n.action === 'remove') {
                            contacts[idx].tags = tags.filter(t => t !== n.tag);
                        }
                        safeSetItem(KEYS.CONTACTS, contacts);
                        contact.tags = contacts[idx].tags;
                    }
                    execLog.push(`🏷️ Tag ${n.action === 'add' ? 'añadido' : 'removido'}: "${n.tag}" → ${contact.email}`);
                    tagsApplied++;

                } else if (node.type === 'move_to_list') {
                    const n = node as MoveToListNode;
                    const contacts: Contact[] = JSON.parse(localStorage.getItem(KEYS.CONTACTS) || '[]');
                    const idx = contacts.findIndex(c => c.id === contact.id);
                    if (idx !== -1) {
                        const listIds = contacts[idx].listIds || [];
                        if (!listIds.includes(n.listId)) {
                            contacts[idx].listIds = [...listIds, n.listId];
                            safeSetItem(KEYS.CONTACTS, contacts);
                        }
                    }
                    execLog.push(`📋 Movido a lista "${n.listId}" → ${contact.email}`);

                } else if (node.type === 'end') {
                    execLog.push(`🏁 Fin del flujo`);
                    break;
                }
            }
            return { emailsSent, tagsApplied };
        },
        // ── ENGINE: run automation for a single contact ─────────
        runForContact: async (automationId: string, contact: Contact): Promise<AutomationExecution> => {
            const rule = db.automations.getById(automationId);
            if (!rule) throw new Error(`Automation ${automationId} not found`);

            const exec: AutomationExecution = {
                id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                automationId,
                contactId: contact.id,
                contactEmail: contact.email,
                startedAt: new Date().toISOString(),
                currentStep: 0,
                status: 'running',
                log: [`▶ Inicio automatización "${rule.name}" para ${contact.name}`]
            };

            try {
                const result = await db.automations._evaluateNodes(rule.nodes, contact, exec.log, automationId);
                exec.status = 'completed';
                exec.completedAt = new Date().toISOString();
                exec.log.push(`✅ Completado | Emails: ${result.emailsSent} | Tags: ${result.tagsApplied}`);

                // Update automation stats
                const updated = { ...rule };
                updated.stats.totalExecutions += 1;
                updated.stats.completed += 1;
                updated.stats.emailsSent += result.emailsSent;
                updated.stats.tagsApplied += result.tagsApplied;
                db.automations.save(updated);

            } catch (err) {
                exec.status = 'failed';
                exec.log.push(`❌ Error: ${err}`);
            }

            db.automations.saveExecution(exec);
            return exec;
        },
        // ── ENGINE: run automation for a segment of contacts ────
        runForSegment: async (
            automationId: string,
            targetType: 'all' | 'subscribed' | 'list' | 'tag',
            targetValue?: string
        ): Promise<{ count: number; executions: AutomationExecution[] }> => {
            const allContacts: Contact[] = JSON.parse(localStorage.getItem(KEYS.CONTACTS) || '[]');
            let targets: Contact[] = [];

            if (targetType === 'all') targets = allContacts;
            else if (targetType === 'subscribed') targets = allContacts.filter(c => c.status === 'Subscribed');
            else if (targetType === 'list' && targetValue) targets = allContacts.filter(c => (c.listIds || []).includes(targetValue));
            else if (targetType === 'tag' && targetValue) targets = allContacts.filter(c => (c.tags || []).includes(targetValue));

            const executions: AutomationExecution[] = [];
            for (const contact of targets) {
                const exec = await db.automations.runForContact(automationId, contact);
                executions.push(exec);
            }
            return { count: targets.length, executions };
        }
    },

    // ============================================================
    // --- MÓDULO 1: SALA VIRTUAL ZOOM ---
    // ============================================================
    meetings: {
        getAll: (): CalendarEvent[] => JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]'),
        getById: (id: string): CalendarEvent | undefined =>
            (JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]') as CalendarEvent[]).find(e => e.id === id),
        save: (event: CalendarEvent): CalendarEvent => {
            const all: CalendarEvent[] = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
            const idx = all.findIndex(e => e.id === event.id);
            if (idx !== -1) all[idx] = event; else all.push(event);
            safeSetItem(KEYS.EVENTS, all);
            return event;
        },
        delete: (id: string): void => {
            const updated = (JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]') as CalendarEvent[]).filter(e => e.id !== id);
            safeSetItem(KEYS.EVENTS, updated);
        },
        create: (data: Omit<CalendarEvent, 'id'>): CalendarEvent => {
            const event: CalendarEvent = { ...data, id: `ev_${Date.now()}` };
            const all: CalendarEvent[] = JSON.parse(localStorage.getItem(KEYS.EVENTS) || '[]');
            all.push(event);
            safeSetItem(KEYS.EVENTS, all);
            return event;
        },
        getZoomConfig: (): ZoomWidgetConfig => {
            try { return JSON.parse(localStorage.getItem(KEYS.ZOOM_WIDGET) || JSON.stringify(defaultZoomWidgetConfig)); }
            catch { return defaultZoomWidgetConfig; }
        },
        updateZoomConfig: (cfg: ZoomWidgetConfig): ZoomWidgetConfig => {
            safeSetItem(KEYS.ZOOM_WIDGET, cfg);
            return cfg;
        },
    },

    // ============================================================
    // --- MÓDULO 1: FEEDBACK POST-SESIÓN ---
    // ============================================================
    feedback: {
        getQuestions: (): FeedbackQuestion[] => {
            try { return JSON.parse(localStorage.getItem(KEYS.FEEDBACK_QUESTIONS) || JSON.stringify(defaultFeedbackQuestions)); }
            catch { return defaultFeedbackQuestions; }
        },
        saveQuestions: (questions: FeedbackQuestion[]): FeedbackQuestion[] => {
            safeSetItem(KEYS.FEEDBACK_QUESTIONS, questions);
            return questions;
        },
        getResponses: (eventId?: string): FeedbackResponse[] => {
            try {
                const all: FeedbackResponse[] = JSON.parse(localStorage.getItem(KEYS.FEEDBACK_RESPONSES) || '[]');
                return eventId ? all.filter(r => r.eventId === eventId) : all;
            } catch { return []; }
        },
        submitResponse: (data: Omit<FeedbackResponse, 'id'>): FeedbackResponse => {
            const all: FeedbackResponse[] = JSON.parse(localStorage.getItem(KEYS.FEEDBACK_RESPONSES) || '[]');
            const response: FeedbackResponse = { ...data, id: `fr_${Date.now()}` };
            all.unshift(response);
            safeSetItem(KEYS.FEEDBACK_RESPONSES, all);
            // Marcar participación como respondida
            const partAll: ParticipationRecord[] = JSON.parse(localStorage.getItem(KEYS.PARTICIPATION) || '[]');
            const rec = partAll.find(p => p.userId === data.userId && p.eventId === data.eventId);
            if (rec) { rec.feedbackSubmitted = true; rec.feedbackBlocksNext = false; safeSetItem(KEYS.PARTICIPATION, partAll); }
            return response;
        },
        hasBlockingFeedback: (userId: string): boolean => {
            const all: ParticipationRecord[] = JSON.parse(localStorage.getItem(KEYS.PARTICIPATION) || '[]');
            return all.filter(p => p.userId === userId).some(p => p.feedbackBlocksNext === true);
        },
    },

    // ============================================================
    // --- MÓDULO 1: GAMIFICACIÓN ---
    // ============================================================
    gamification: {
        getBadges: (userId?: string): MemberBadge[] => {
            try {
                const all: MemberBadge[] = JSON.parse(localStorage.getItem(KEYS.MEMBER_BADGES) || '[]');
                return userId ? all.filter(b => b.userId === userId) : all;
            } catch { return []; }
        },
        awardBadge: (data: Omit<MemberBadge, 'id'>): MemberBadge => {
            const all: MemberBadge[] = JSON.parse(localStorage.getItem(KEYS.MEMBER_BADGES) || '[]');
            const badge: MemberBadge = { ...data, id: `badge_${Date.now()}` };
            all.unshift(badge);
            safeSetItem(KEYS.MEMBER_BADGES, all);
            return badge;
        },
        removeBadge: (id: string): void => {
            const updated = (JSON.parse(localStorage.getItem(KEYS.MEMBER_BADGES) || '[]') as MemberBadge[]).filter(b => b.id !== id);
            safeSetItem(KEYS.MEMBER_BADGES, updated);
        },
        getParticipation: (userId?: string): ParticipationRecord[] => {
            try {
                const all: ParticipationRecord[] = JSON.parse(localStorage.getItem(KEYS.PARTICIPATION) || '[]');
                if (userId) return all.filter(p => p.userId === userId);
                return all;
            } catch { return []; }
        },
        getByActivity: (activityId: string): ParticipationRecord[] => {
            try {
                const all: ParticipationRecord[] = JSON.parse(localStorage.getItem(KEYS.PARTICIPATION) || '[]');
                return all.filter(p => p.eventId === activityId);
            } catch { return []; }
        },
        recordParticipation: (data: Omit<ParticipationRecord, 'id'>): ParticipationRecord => {
            const all: ParticipationRecord[] = JSON.parse(localStorage.getItem(KEYS.PARTICIPATION) || '[]');
            const record: ParticipationRecord = { ...data, id: `part_${Date.now()}` };
            all.unshift(record);
            safeSetItem(KEYS.PARTICIPATION, all);

            // Sincronizar con Historial de Usuario si es Miembro
            if (record.userId && record.userType === 'Miembro') {
                db.user.addHistory({
                    id: `act_hist_${Date.now()}`,
                    userId: record.userId,
                    type: 'Event',
                    title: `Inscrito en: ${record.eventTitle}`,
                    date: record.participatedAt.split('T')[0],
                    status: 'Registered'
                });
            }

            return record;
        },
        updateParticipationRecord: (id: string, updates: Partial<ParticipationRecord>): void => {
            const all: ParticipationRecord[] = JSON.parse(localStorage.getItem(KEYS.PARTICIPATION) || '[]');
            const idx = all.findIndex(p => p.id === id);
            if (idx !== -1) { all[idx] = { ...all[idx], ...updates }; safeSetItem(KEYS.PARTICIPATION, all); }
        },
        getRanking: (): { userId: string; userName: string; points: number; badges: number; participations: number }[] => {
            const allPart: ParticipationRecord[] = JSON.parse(localStorage.getItem(KEYS.PARTICIPATION) || '[]');
            const allBadges: MemberBadge[] = JSON.parse(localStorage.getItem(KEYS.MEMBER_BADGES) || '[]');
            const map: Record<string, { userId: string; userName: string; points: number; badges: number; participations: number }> = {};
            allPart.forEach(p => {
                if (p.userId) {
                    if (!map[p.userId]) map[p.userId] = { userId: p.userId, userName: p.userName || p.userId, points: 0, badges: 0, participations: 0 };
                    map[p.userId].participations++;
                    map[p.userId].points += p.feedbackSubmitted ? 10 : 5;
                }
            });
            allBadges.forEach(b => {
                if (!map[b.userId]) map[b.userId] = { userId: b.userId, userName: b.userId, points: 0, badges: 0, participations: 0 };
                map[b.userId].badges++;
                map[b.userId].points += 20;
            });
            return Object.values(map).sort((a, b) => b.points - a.points);
        },
    },

    // ============================================================
    // --- MÓDULO 2: CALENDARIO DE ACTIVIDADES ---
    // ============================================================
    activities: {
        getAll: (): ActivityEvent[] => {
            try {
                const stored = localStorage.getItem(KEYS.ACTIVITY_EVENTS);
                if (!stored || stored === 'undefined' || stored === 'null') return [];
                const parsed = JSON.parse(stored);
                return Array.isArray(parsed) ? parsed : [];
            }
            catch (e) {
                console.error("Error loading activities", e);
                return [];
            }
        },
        getById: (id: string): ActivityEvent | undefined =>
            db.activities.getAll().find(a => a.id === id),
        save(activity: ActivityEvent): ActivityEvent {
            try {
                const all = db.activities.getAll();
                const now = new Date().toISOString();
                const updated = { ...activity, updatedAt: now };
                if (!updated.createdAt) updated.createdAt = now;

                const idx = all.findIndex(a => a.id === activity.id);
                if (idx !== -1) all[idx] = updated; else all.unshift(updated);

                safeSetItem(KEYS.ACTIVITY_EVENTS, all);

                if (activity.modality === 'Virtual' && activity.zoomUrl) {
                    db.activities._syncToMeetings(updated);
                }
                return updated;
            } catch (e) {
                console.error("Error saving activity", e);
                throw e;
            }
        },
        create(data: Omit<ActivityEvent, 'id' | 'createdAt' | 'updatedAt'>): ActivityEvent {
            const now = new Date().toISOString();
            return db.activities.save({
                ...data,
                id: `act_${Date.now()}`,
                createdAt: now,
                updatedAt: now
            } as ActivityEvent);
        },
        delete: (id: string): void => {
            try {
                const current = db.activities.getAll();
                const updated = current.filter(a => a.id !== id);
                safeSetItem(KEYS.ACTIVITY_EVENTS, updated);
            } catch (e) {
                console.error("Error deleting activity", e);
            }
        },
        _syncToMeetings(activity: ActivityEvent): void {
            try {
                if (activity.modality !== 'Virtual') return;
                const stored = localStorage.getItem(KEYS.EVENTS);
                let allEvents: CalendarEvent[] = [];
                try {
                    allEvents = stored ? JSON.parse(stored) : [];
                    if (!Array.isArray(allEvents)) allEvents = [];
                } catch { allEvents = []; }

                const existing = activity.linkedMeetingId ? allEvents.find(e => e.id === activity.linkedMeetingId) : undefined;
                const calEvent: CalendarEvent = {
                    id: existing?.id || `ev_${Date.now()}`,
                    title: activity.title,
                    date: activity.startDate,
                    day: new Date(activity.startDate + 'T12:00:00').getDate().toString(),
                    month: new Date(activity.startDate + 'T12:00:00').toLocaleDateString('es-CL', { month: 'short' }),
                    time: activity.startTime, location: 'Online', type: 'Online', color: '#4f46e5',
                    platform: 'Zoom', meetingUrl: activity.zoomUrl, eventStatus: 'Programada', linkedActivityId: activity.id,
                };
                const eIdx = allEvents.findIndex(e => e.id === calEvent.id);
                if (eIdx !== -1) allEvents[eIdx] = calEvent; else allEvents.push(calEvent);
                safeSetItem(KEYS.EVENTS, allEvents);
                // Guardar linkedMeetingId si es nuevo
                if (!activity.linkedMeetingId) {
                    const actAll = db.activities.getAll();
                    const aIdx = actAll.findIndex(a => a.id === activity.id);
                    if (aIdx !== -1) {
                        actAll[aIdx].linkedMeetingId = calEvent.id;
                        safeSetItem(KEYS.ACTIVITY_EVENTS, actAll);
                    }
                }
            } catch (e) {
                console.error("Error syncing to meetings", e);
            }
        },
        getCategories: (): ActivityCategory[] => {
            try { return JSON.parse(localStorage.getItem(KEYS.ACTIVITY_CATS) || JSON.stringify(defaultActivityCategories)); }
            catch { return defaultActivityCategories; }
        },
        saveCategories: (cats: ActivityCategory[]): ActivityCategory[] => {
            safeSetItem(KEYS.ACTIVITY_CATS, cats);
            return cats;
        },
        getFeatured: (): ActivityEvent[] => {
            const now = new Date().toISOString().slice(0, 10);
            return (JSON.parse(localStorage.getItem(KEYS.ACTIVITY_EVENTS) || '[]') as ActivityEvent[])
                .filter(a => a.status === 'Publicado' && a.featuredInDashboard)
                .map(a => {
                    const next = db.activities.getNextDate(a, now);
                    return { ...a, startDate: next };
                })
                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        },
        getNextDate(activity: ActivityEvent, fromDate: string): string {
            const start = new Date(activity.startDate + 'T00:00:00');
            const target = new Date(fromDate + 'T00:00:00');
            if (start >= target) return activity.startDate;

            const rec = activity.recurrence;
            if (!rec || rec.frequency === 'none') return activity.startDate;

            let current = new Date(target);
            for (let i = 0; i < 365; i++) {
                const ds = current.toISOString().slice(0, 10);
                if (rec.endType === 'date' && rec.endDate && ds > rec.endDate) break;
                const dayOfWeek = current.getDay();
                if (rec.frequency === 'daily') {
                    const diff = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                    if (diff % (rec.interval || 1) === 0) return ds;
                } else if (rec.frequency === 'weekly') {
                    if (rec.daysOfWeek?.includes(dayOfWeek)) return ds;
                } else if (rec.frequency === 'monthly') {
                    if (current.getDate() === start.getDate()) return ds;
                }
                current.setDate(current.getDate() + 1);
            }
            return activity.startDate;
        },
    },
    messaging: {
        getThreads: (): ChatThread[] => {
            const all: ChatThread[] = JSON.parse(localStorage.getItem(KEYS.CHAT_THREADS) || '[]');
            return filterByTenant(all);
        },
        getThreadByMember: (memberId: string): ChatThread | null => {
            return db.messaging.getThreads().find(t => t.memberId === memberId) || null;
        },
        getMessages: (threadId: string): ChatMessage[] => {
            const all: ChatMessage[] = JSON.parse(localStorage.getItem(KEYS.CHAT_MESSAGES) || '[]');
            return all.filter(m => m.threadId === threadId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        },
        saveThread: (thread: ChatThread): ChatThread => {
            const all = db.messaging.getThreads().filter(t => t.id !== thread.id);
            all.unshift(thread);
            safeSetItem(KEYS.CHAT_THREADS, all);
            return thread;
        },
        sendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>): ChatMessage => {
            const newMessage: ChatMessage = {
                ...msg,
                id: `msg_${Date.now()}`,
                timestamp: new Date().toISOString(),
                status: 'Sent'
            };
            const all: ChatMessage[] = JSON.parse(localStorage.getItem(KEYS.CHAT_MESSAGES) || '[]');
            all.push(newMessage);
            safeSetItem(KEYS.CHAT_MESSAGES, all);

            // Update thread metadata
            const thread = db.messaging.getThreads().find(t => t.id === msg.threadId);
            if (thread) {
                db.messaging.saveThread({
                    ...thread,
                    lastMessage: msg.text,
                    lastUpdate: newMessage.timestamp,
                    unreadAdmin: msg.senderRole === UserRole.MEMBER ? thread.unreadAdmin + 1 : thread.unreadAdmin,
                    unreadMember: msg.senderRole !== UserRole.MEMBER ? thread.unreadMember + 1 : thread.unreadMember
                });
            }
            return newMessage;
        },
        markAsRead: (threadId: string, role: UserRole): void => {
            const threads = db.messaging.getThreads();
            const thread = threads.find(t => t.id === threadId);
            if (thread) {
                db.messaging.saveThread({
                    ...thread,
                    unreadAdmin: (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) ? 0 : thread.unreadAdmin,
                    unreadMember: (role === UserRole.MEMBER) ? 0 : thread.unreadMember
                });
            }
            // Mark individual messages as read (simplified: matching role would be better but status is global per thread in this mock)
            const allMsgs: ChatMessage[] = JSON.parse(localStorage.getItem(KEYS.CHAT_MESSAGES) || '[]');
            // Only mark messages sent by OTHER as read by ME
            const updated = allMsgs.map(m => {
                if (m.threadId === threadId) {
                    const isMessageForMe = (role === UserRole.MEMBER && m.senderRole !== UserRole.MEMBER) ||
                        ((role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) && m.senderRole === UserRole.MEMBER);
                    if (isMessageForMe) return { ...m, status: 'Read' as const };
                }
                return m;
            });
            safeSetItem(KEYS.CHAT_MESSAGES, updated);
        }
    },
    journey: {
        getProfile: (userId: string): UserWizardProfile | null => {
            const all: UserWizardProfile[] = JSON.parse(localStorage.getItem(KEYS.WIZARD_PROFILES) || '[]');
            return all.find(p => p.userId === userId) || null;
        }
    },
    system: {
        getStorageUsage: () => {
            let total = 0;
            const details: Record<string, number> = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const size = (localStorage.getItem(key)?.length || 0) * 2; // approximation (UTF-16)
                    total += size;
                    details[key] = Math.round(size / 1024);
                }
            }
            return {
                totalKB: Math.round(total / 1024),
                totalMB: (total / (1024 * 1024)).toFixed(2),
                details
            };
        },
        resetStorage: () => {
            localStorage.removeItem(KEYS.SEED_VERSION);
            window.location.reload();
        },
        setRemoteUrl: (url: string) => localStorage.setItem(KEYS.REMOTE_SYNC_URL, url),
        getRemoteUrl: () => localStorage.getItem(KEYS.REMOTE_SYNC_URL) || '',
        exportAll: () => {
            const keys = Object.values(KEYS);
            const data: any = {};
            keys.forEach(k => {
                const val = localStorage.getItem(k);
                if (val) {
                    try { data[k] = JSON.parse(val); } catch { data[k] = val; }
                }
            });
            return data;
        },
        getHistory: () => {
            return JSON.parse(localStorage.getItem(KEYS.CHANGE_LOG) || '[]') as ChangeLog[];
        },
        logChange: (log: Omit<ChangeLog, 'id' | 'timestamp' | 'userEmail' | 'userName'>) => {
            const user = db.auth.getCurrentUser();
            const fullLog: ChangeLog = {
                id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                timestamp: new Date().toISOString(),
                userId: user?.id || 'system',
                userEmail: user?.email || 'system',
                userName: user?.name || 'Sistema Híbrido',
                ...log
            };
            const currentLogs = JSON.parse(localStorage.getItem(KEYS.CHANGE_LOG) || '[]');
            const updated = [fullLog, ...currentLogs].slice(0, 200);
            safeSetItem(KEYS.CHANGE_LOG, updated);
        },
        syncRemote: async (mode: 'merge' | 'master' = 'merge') => {
            const url = localStorage.getItem(KEYS.REMOTE_SYNC_URL);
            if (!url) return { status: 'no_url' };

            // Intento de obtener token si el repositorio es privado
            const token = localStorage.getItem('cafh_github_token');
            const headers: any = {};
            if (token) headers['Authorization'] = `token ${token}`;

            try {
                const response = await fetch(url, { headers });
                if (!response.ok) {
                    if (response.status === 404) throw new Error('Archivo no encontrado. Verifica la URL.');
                    if (response.status === 401 || response.status === 403) throw new Error('Acceso denegado. Se requiere Token de GitHub.');
                    throw new Error(`Error ${response.status}: Fallo en la descarga.`);
                }
                const remote = await response.json();

                let changesDetected = 0;
                const syncKeys = [
                    { key: KEYS.ACTIVITY_EVENTS, remoteKey: 'activities' },
                    { key: KEYS.CONTENT, remoteKey: 'content' },
                    { key: KEYS.BLOG, remoteKey: 'blog' },
                    { key: KEYS.USERS, remoteKey: 'users' },
                    { key: KEYS.MEDIA, remoteKey: 'media' }
                ];

                syncKeys.forEach(({ key, remoteKey }) => {
                    const rData = remote[remoteKey] || remote[key];
                    if (rData && Array.isArray(rData)) {
                        const local = JSON.parse(localStorage.getItem(key) || '[]');
                        let result = [...local];

                        if (mode === 'master') {
                            // MODO MASTER: El archivo externo manda. Borra local si no está en remoto (para esa categoría)
                            result = rData;
                            changesDetected += rData.length;
                        } else {
                            // MODO MERGE (Default): Mezcla inteligente. Si existe actualiza, si no añade. No borra local.
                            rData.forEach((ra: any) => {
                                const idx = result.findIndex(la => la.id === ra.id);
                                if (idx >= 0) {
                                    if (JSON.stringify(result[idx]) !== JSON.stringify(ra)) {
                                        result[idx] = ra;
                                        changesDetected++;
                                    }
                                } else {
                                    result.push(ra);
                                    changesDetected++;
                                }
                            });
                        }
                        safeSetItem(key, result);
                    }
                });

                if (changesDetected > 0) {
                    db.system.logChange({
                        section: 'Sistema > Sincronización',
                        entityType: 'System',
                        entityId: 'RemoteSync',
                        action: 'Sync',
                        details: `Sincronización remota (${mode}): ${changesDetected} registros procesados.`,
                        changes: { url, mode, count: changesDetected }
                    });
                }

                localStorage.setItem(KEYS.LAST_SYNC, new Date().toISOString());
                return { status: 'success', changes: changesDetected };
            } catch (err: any) {
                return { status: 'error', message: err.message || 'Error desconocido' };
            }
        }
    }
};

// Immediately initialize to ensure data exists before any UI renders
db.init();