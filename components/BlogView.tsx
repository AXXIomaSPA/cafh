import React, { useState, useEffect } from 'react';
import { Feather, Search, Calendar, User as UserIcon, ArrowRight, ArrowLeft, Clock, Share2, Tag, ChevronRight } from 'lucide-react';
import { db } from '../storage';
import { BlogPost } from '../types';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';

// --- SHARED INTERNAL HEADER (REUSED FROM INTERNALVIEWS) ---
const InternalHeader: React.FC<{ title: string; subtitle: string; icon: any; bgImage: string }> = ({ title, subtitle, icon: Icon, bgImage }) => (
    <div className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6 overflow-hidden rounded-b-[3rem] shadow-xl">
        <div className="absolute inset-0 z-0">
            <img src={bgImage} alt={title} className="w-full h-full object-cover opacity-30 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-cafh-indigo via-cafh-indigo/80 to-slate-50"></div>
        </div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-cafh-cyan rounded-full blur-[100px] opacity-20 animate-float"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-cafh-cyan font-bold text-sm mb-6">
                <Icon size={16} />
                <span>Blog & Reflexiones</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">{title}</h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-light leading-relaxed">{subtitle}</p>
        </div>
    </div>
);

// --- BLOG LIST VIEW ---
export const BlogArchive: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('Todos');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setPosts(db.blog.getAll());

        // Handle URL query filter
        const params = new URLSearchParams(location.search);
        const urlFilter = params.get('filter');
        if (urlFilter) setFilter(urlFilter);
    }, [location.search]);

    const categories = ['Todos', ...Array.from(new Set(posts.map(p => p.category)))];

    const filtered = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(search.toLowerCase());
        const matchesCat = filter === 'Todos' || p.category === filter;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <InternalHeader
                title="Blog & Novedades"
                subtitle="Inspiración y reflexiones para el camino del desenvolvimiento espiritual."
                icon={Feather}
                bgImage="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
            />

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${filter === cat
                                    ? 'bg-cafh-indigo text-white shadow-lg'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-cafh-cyan'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar artículos..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cafh-cyan/30 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((post, i) => (
                        <article
                            key={post.id}
                            onClick={() => navigate(`/blog/${post.id}`)}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group cursor-pointer border border-slate-100 flex flex-col h-full animate-fade-in-up"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-cafh-indigo shadow-sm">
                                        {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-cafh-cyan" /> {post.date}</span>
                                    <span className="flex items-center gap-1.5"><UserIcon size={12} className="text-cafh-cyan" /> {post.author}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-4 leading-tight group-hover:text-cafh-indigo transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-cafh-cyan font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Leer más <ArrowRight size={14} />
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-cafh-cyan/10 group-hover:text-cafh-cyan transition-colors">
                                        <Clock size={14} />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">No se encontraron artículos</h3>
                        <p className="text-slate-500 mt-2">Prueba con otros términos de búsqueda o selecciona otra categoría.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- SINGLE POST VIEW ---
export const BlogPostView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const found = db.blog.getById(id);
            if (found) setPost(found);
            else navigate('/blog');
        }
    }, [id]);

    if (!post) return null;

    return (
        <div className="min-h-screen bg-white">
            {/* Post Hero */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
                <div className="absolute inset-0 bg-cafh-indigo/20"></div>

                <button
                    onClick={() => navigate('/blog')}
                    className="absolute top-28 left-6 md:left-12 z-20 flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur rounded-full text-sm font-bold text-slate-800 shadow-xl hover:bg-white transition-all group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al Blog
                </button>
            </div>

            {/* Content Area */}
            <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 pb-32">
                <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200 border border-slate-100">
                    <div className="flex flex-wrap items-center gap-6 mb-8">
                        <span className="px-4 py-1.5 bg-cafh-cyan/10 text-cafh-cyan rounded-full text-[10px] font-black uppercase tracking-widest">
                            {post.category}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Calendar size={14} />
                            {post.date}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <UserIcon size={14} />
                            {post.author}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-800 mb-10 leading-tight">
                        {post.title}
                    </h1>

                    {/* Content Section */}
                    <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed space-y-8">
                        {post.content ? (
                            <Markdown>{post.content}</Markdown>
                        ) : (
                            <p className="italic text-slate-400">Este artículo aún no tiene contenido detallado.</p>
                        )}
                    </div>

                    {/* Footer / Share */}
                    <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <UserIcon size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Escrito por</p>
                                <p className="text-slate-800 font-bold">{post.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-full text-slate-600 font-bold hover:bg-slate-100 transition-all text-sm">
                                <Share2 size={16} /> Compartir
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-cafh-indigo text-white rounded-full font-bold hover:bg-slate-800 transition-all text-sm shadow-lg shadow-cafh-indigo/20">
                                Seguir Leyendo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Next/Prev Navigation (Optional, simplified for now) */}
                <div className="mt-12 flex justify-between items-center px-8">
                    <button onClick={() => navigate('/blog')} className="text-slate-400 hover:text-cafh-indigo transition-colors flex items-center gap-2 font-bold text-sm">
                        <ChevronRight size={16} className="rotate-180" /> Anterior
                    </button>
                    <button onClick={() => navigate('/blog')} className="text-slate-400 hover:text-cafh-indigo transition-colors flex items-center gap-2 font-bold text-sm">
                        Siguiente <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
