/**
 * MeetingsMemberView.tsx
 * Fase 3 — Módulo 1: Vistas del MIEMBRO para Sala Virtual Zoom
 *
 * PRINCIPIO: Código 100% aditivo. No modifica UserViews.tsx ni ningún componente existente.
 * Exporta piezas que UserViews.tsx importa opcionalmente para reemplazar el widget existente.
 *
 * Exports:
 *   - ZoomWidget         → reemplaza el bloque "Sala Virtual" del dashboard del miembro
 *   - EventDetailSheet   → modal de detalle con agenda estructurada y material
 *   - FeedbackWizard     → wizard post-sesión obligatorio
 *   - MemberBadgesRow    → fila de badges/gamificación para el perfil del miembro
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    Video, Calendar, Clock, User, Shield, Copy, Check,
    ArrowRight, X, ChevronRight, ChevronLeft, Star,
    CheckCircle2, AlertTriangle, Award, FileText,
    Music, Image as ImageIcon, Film, List, Lock,
    Sparkles, Trophy, ExternalLink, Info
} from 'lucide-react';
import { db } from '../storage';
import {
    CalendarEvent, FeedbackQuestion, FeedbackResponse,
    MemberBadge, BadgeType, MeetingAgendaItem, MediaAsset
} from '../types';

// ============================================================
// ZOOM LOGO — mismo que MeetingsModule.tsx (autocontenido)
// ============================================================
const ZoomLogo: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="40" height="40" rx="8" fill="#2D8CFF" />
        <path d="M6 14C6 11.79 7.79 10 10 10H22C24.21 10 26 11.79 26 14V26C26 28.21 24.21 30 22 30H10C7.79 30 6 28.21 6 26V14Z" fill="white" />
        <path d="M28 16L34 12V28L28 24V16Z" fill="white" />
    </svg>
);

// ============================================================
// BADGE CONFIG
// ============================================================
const BADGE_CFG: Record<BadgeType, { emoji: string; label: string; color: string }> = {
    estrella: { emoji: '⭐', label: 'Estrella', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    medalla_bronce: { emoji: '🥉', label: 'Bronce', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    medalla_plata: { emoji: '🥈', label: 'Plata', color: 'bg-slate-100 text-slate-700 border-slate-300' },
    medalla_oro: { emoji: '🥇', label: 'Oro', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    especial: { emoji: '🏆', label: 'Especial', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

// ============================================================
// FEEDBACK WIZARD — post-session mandatory flow
// ============================================================
interface FeedbackWizardProps {
    eventId: string;
    eventTitle: string;
    userId: string;
    userName: string;
    onComplete: () => void;
    onCancel: () => void;
}

export const FeedbackWizard: React.FC<FeedbackWizardProps> = ({
    eventId, eventTitle, userId, userName, onComplete, onCancel
}) => {
    const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
    const [step, setStep] = useState(0); // 0 = intro, 1..n = preguntas, n+1 = gracias
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const qs = db.feedback.getQuestions().filter(q => q.isActive);
        setQuestions(qs);
    }, []);

    const totalSteps = questions.length;
    const isIntro = step === 0;
    const isDone = step === totalSteps + 1;
    const currentQ = questions[step - 1];

    const handleAnswer = (qId: string, value: any) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleNext = () => {
        if (step === totalSteps) {
            // Submit
            setSubmitting(true);
            const overallRating = Object.values(answers).filter(v => typeof v === 'number').reduce((a: number, b: any) => a + b, 0) /
                (Object.values(answers).filter(v => typeof v === 'number').length || 1);

            const response: FeedbackResponse = {
                id: `fr_${Date.now()}`,
                eventId,
                userId,
                userName,
                submittedAt: new Date().toISOString(),
                overallRating,
                answers: questions.map(q => ({
                    questionId: q.id,
                    questionText: q.text,
                    value: answers[q.id] ?? '',
                })),
            };
            db.feedback.submitResponse(response);
            // Award participation record
            db.gamification.recordParticipation({
                userId,
                eventId,
                eventTitle: eventTitle,
                participatedAt: new Date().toISOString(),
                feedbackSubmitted: true,
                feedbackBlocksNext: false,
            });
            // Award star badge automatically
            db.gamification.awardBadge({
                userId,
                type: 'estrella',
                label: 'Asistencia registrada',
                reason: `Evaluación completada: ${eventTitle}`,
                awardedAt: new Date().toISOString(),
                awardedBy: 'system',
            });
            setSubmitting(false);
            setStep(totalSteps + 1);
        } else {
            setStep(s => s + 1);
        }
    };

    const progressPct = totalSteps > 0 ? Math.round((Math.max(0, step - 1) / totalSteps) * 100) : 0;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" />
            <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 pt-8 pb-0">
                    {!isIntro && !isDone && (
                        <>
                            <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-bold uppercase tracking-widest">
                                <span>Pregunta {step} de {totalSteps}</span>
                                <span>{progressPct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
                                <div
                                    className="h-full bg-cafh-indigo rounded-full transition-all duration-500"
                                    style={{ width: `${progressPct}%` }}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Content */}
                <div className="px-8 py-6 flex-1 min-h-[320px] flex flex-col justify-center">
                    {/* INTRO */}
                    {isIntro && (
                        <div className="text-center space-y-5">
                            <div className="w-20 h-20 bg-cafh-indigo/10 rounded-[2rem] flex items-center justify-center mx-auto">
                                <Star className="text-cafh-indigo" size={36} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-2">
                                    ¿Cómo estuvo la sesión?
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Tu evaluación de <strong>"{eventTitle}"</strong> es obligatoria.<br />
                                    Solo toma {totalSteps} {totalSteps === 1 ? 'pregunta' : 'preguntas'} y nos ayuda a mejorar.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-4 py-3 text-amber-700 text-xs font-medium border border-amber-100">
                                <AlertTriangle size={14} className="shrink-0" />
                                Sin completar esta evaluación, no podrás unirte a futuras sesiones.
                            </div>
                        </div>
                    )}

                    {/* QUESTION */}
                    {!isIntro && !isDone && currentQ && (
                        <div className="space-y-6">
                            <p className="text-xl font-bold text-slate-800 leading-snug">{currentQ.text}</p>

                            {/* Rating */}
                            {currentQ.type === 'rating' && (
                                <div className="flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => handleAnswer(currentQ.id, n)}
                                            className={`text-3xl transition-all duration-150 hover:scale-125 ${(answers[currentQ.id] || 0) >= n ? 'opacity-100 scale-110' : 'opacity-30'
                                                }`}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Multiple choice */}
                            {currentQ.type === 'multiple_choice' && (
                                <div className="space-y-3">
                                    {(currentQ.options || []).map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(currentQ.id, opt)}
                                            className={`w-full text-left px-5 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 ${answers[currentQ.id] === opt
                                                ? 'border-cafh-indigo bg-cafh-indigo/5 text-cafh-indigo'
                                                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[currentQ.id] === opt ? 'border-cafh-indigo' : 'border-slate-300'
                                                    }`}>
                                                    {answers[currentQ.id] === opt && (
                                                        <span className="w-2 h-2 rounded-full bg-cafh-indigo" />
                                                    )}
                                                </span>
                                                {opt}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Text */}
                            {currentQ.type === 'text' && (
                                <textarea
                                    value={answers[currentQ.id] || ''}
                                    onChange={e => handleAnswer(currentQ.id, e.target.value)}
                                    placeholder="Escribe tu respuesta aquí..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cafh-indigo/30 focus:border-cafh-indigo resize-none transition-all"
                                />
                            )}
                        </div>
                    )}

                    {/* DONE */}
                    {isDone && (
                        <div className="text-center space-y-5">
                            <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto">
                                <CheckCircle2 className="text-emerald-500" size={40} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Gracias por tu evaluación!</h3>
                                <p className="text-sm text-slate-500">
                                    Tu contribución nos ayuda a mejorar cada encuentro. <br />
                                    Has ganado +10 puntos de participación. 🎉
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-2 bg-amber-50 rounded-xl px-4 py-3 text-amber-700 text-sm font-bold border border-amber-100">
                                <Award size={16} /> Participación registrada
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-8 pb-8 flex gap-3">
                    {isIntro && (
                        <>
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:bg-slate-50 transition-colors"
                            >
                                Ahora no
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                disabled={totalSteps === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-cafh-indigo text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50"
                            >
                                Comenzar <ChevronRight size={16} />
                            </button>
                        </>
                    )}
                    {!isIntro && !isDone && (
                        <>
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={submitting || (currentQ && answers[currentQ.id] === undefined && currentQ.type !== 'text')}
                                className="flex-1 flex items-center justify-center gap-2 bg-cafh-indigo text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-40"
                            >
                                {step === totalSteps ? 'Enviar evaluación ✓' : <>Siguiente <ChevronRight size={16} /></>}
                            </button>
                        </>
                    )}
                    {isDone && (
                        <button
                            onClick={onComplete}
                            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors shadow-lg shadow-green-900/20"
                        >
                            <CheckCircle2 size={16} /> Continuar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ============================================================
// EVENT DETAIL SHEET — modal mejorado con agenda estructurada
// ============================================================
interface EventDetailSheetProps {
    event: CalendarEvent;
    onClose: () => void;
    onJoin: () => void;
    isBlocked: boolean; // pending feedback from a previous session
}

export const EventDetailSheet: React.FC<EventDetailSheetProps> = ({
    event, onClose, onJoin, isBlocked
}) => {
    const [copied, setCopied] = useState(false);
    const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);

    useEffect(() => {
        if (event.mediaRefs?.length) {
            const allMedia = db.media.getAll();
            const linked = event.mediaRefs
                .map(ref => allMedia.find(a => a.id === ref.mediaAssetId))
                .filter(Boolean) as MediaAsset[];
            setMediaAssets(linked);
        }
    }, [event]);

    const handleCopy = () => {
        if (event.meetingUrl) navigator.clipboard.writeText(event.meetingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getAssetIcon = (type?: string) => {
        if (type === 'document') return <FileText size={14} className="text-blue-500" />;
        if (type === 'audio') return <Music size={14} className="text-purple-500" />;
        if (type === 'video') return <Film size={14} className="text-red-500" />;
        return <ImageIcon size={14} className="text-slate-400" />;
    };

    // Use new structured agenda if available, otherwise fall back to legacy string array
    const hasStructuredAgenda = event.agendaItems && event.agendaItems.length > 0;
    const legacyAgenda: string[] = (event as any).agenda || [];

    const organizer = event.organizerContactId
        ? db.crm.getAll().find(c => c.id === event.organizerContactId)
        : null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row" style={{ maxHeight: '90vh' }}>

                {/* ── LEFT: Details ── */}
                <div className="flex-1 bg-slate-50 border-r border-slate-100 flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-4">
                            <ZoomLogo size={28} />
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesión Zoom</p>
                                <p className="text-base font-bold text-slate-800 leading-tight">{event.title}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-full px-3 py-1.5">
                                <Calendar size={11} /> {event.date}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-full px-3 py-1.5">
                                <Clock size={11} /> {event.time}
                            </span>
                            {organizer && (
                                <span className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-full px-3 py-1.5">
                                    <User size={11} /> {organizer.name}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-full px-3 py-1.5">
                                <Shield size={11} /> Solo miembros
                            </span>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-8 space-y-8">
                        {/* Structured Agenda */}
                        {hasStructuredAgenda ? (
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <List size={12} /> Agenda del Encuentro
                                </h4>
                                <ul className="space-y-3 relative border-l-2 border-slate-200 ml-2 pl-6">
                                    {(event.agendaItems || []).map((item, idx) => (
                                        <li key={item.id} className="relative">
                                            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-cafh-indigo" />
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="text-sm font-medium text-slate-700">{item.title}</span>
                                                <span className="text-xs text-slate-400 shrink-0 bg-slate-100 rounded-full px-2 py-0.5">
                                                    {item.durationMinutes} min
                                                </span>
                                            </div>
                                            {item.description && (
                                                <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3 text-xs text-slate-400 ml-2 pl-6">
                                    Total estimado: <strong>{(event.agendaItems || []).reduce((a, b) => a + b.durationMinutes, 0)} min</strong>
                                </div>
                            </div>
                        ) : legacyAgenda.length > 0 ? (
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Agenda</h4>
                                <ul className="space-y-3 relative border-l-2 border-slate-200 ml-2 pl-6">
                                    {legacyAgenda.map((item, idx) => (
                                        <li key={idx} className="relative text-sm font-medium text-slate-700">
                                            <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-white border-2 border-cafh-cyan" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-slate-100 rounded-xl p-4 text-center text-slate-400 text-sm italic">
                                Agenda no disponible para esta sesión.
                            </div>
                        )}

                        {/* Material de apoyo (Biblioteca de Medios) */}
                        {mediaAssets.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText size={12} /> Material de Apoyo
                                </h4>
                                <div className="space-y-2.5">
                                    {mediaAssets.map(asset => (
                                        <div key={asset.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-cafh-indigo/20 transition-colors">
                                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                                                {getAssetIcon(asset.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-700 truncate">{asset.name}</p>
                                                <p className="text-xs text-slate-400">{asset.type} · {asset.size}</p>
                                            </div>
                                            <ExternalLink size={13} className="text-slate-300 shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Legacy resources */}
                        {mediaAssets.length === 0 && (event as any).resources?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Material</h4>
                                <div className="space-y-2">
                                    {((event as any).resources as any[]).map((res: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                                            <FileText size={14} className="text-slate-400" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{res.title}</p>
                                                <p className="text-xs text-slate-400">{res.type}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT: Action Panel ── */}
                <div className="w-full md:w-[360px] bg-white p-8 flex flex-col relative">
                    <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                        <X size={18} />
                    </button>

                    {/* Zoom brand block */}
                    <div className="flex items-center gap-3 mb-6 mt-2">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <ZoomLogo size={28} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Zoom Meeting</p>
                            <p className="text-xs text-slate-400">Plataforma oficial de la comunidad</p>
                        </div>
                    </div>

                    <div className="flex-1">
                        {/* Blocked state */}
                        {isBlocked ? (
                            <div className="space-y-4">
                                <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
                                    <Lock size={32} className="text-red-400 mx-auto mb-3" />
                                    <p className="font-bold text-red-700 text-sm mb-1">Acceso bloqueado</p>
                                    <p className="text-xs text-red-500 leading-relaxed">
                                        Tienes una evaluación pendiente de una sesión anterior. <br />
                                        Complétala para poder unirte nuevamente.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Status */}
                                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-emerald-700">Sala disponible</p>
                                        <p className="text-[11px] text-emerald-500">Sala de espera habilitada</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                                    <div className="flex items-center gap-2.5 text-slate-600">
                                        <Clock size={14} className="text-cafh-indigo shrink-0" />
                                        <span className="text-sm">{event.time}</span>
                                    </div>
                                    {organizer && (
                                        <div className="flex items-center gap-2.5 text-slate-600">
                                            <User size={14} className="text-cafh-indigo shrink-0" />
                                            <span className="text-sm">Organiza: <strong>{organizer.name}</strong></span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2.5 text-slate-600">
                                        <Shield size={14} className="text-cafh-indigo shrink-0" />
                                        <span className="text-sm">Sala privada para miembros</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2 text-blue-700 text-xs">
                                    <Info size={14} className="shrink-0 mt-0.5" />
                                    Serás redirigido a Zoom. Conecta tu cámara y micrófono allí.
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 mt-6">
                        <button
                            onClick={isBlocked ? undefined : onJoin}
                            disabled={isBlocked}
                            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 group transition-all shadow-lg ${isBlocked
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-cafh-indigo text-white hover:bg-blue-800 shadow-blue-900/20'
                                }`}
                        >
                            {isBlocked ? <Lock size={18} /> : <ZoomLogo size={20} />}
                            {isBlocked ? 'Evaluación pendiente' : 'Unirse a Zoom'}
                            {!isBlocked && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                        {!isBlocked && event.meetingUrl && (
                            <button
                                onClick={handleCopy}
                                className="w-full py-3 text-slate-500 font-semibold text-sm hover:text-cafh-indigo hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                                {copied ? 'Enlace copiado' : 'Copiar enlace de invitación'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================
// MEMBER BADGES ROW — fila pública de badges del miembro
// ============================================================
interface MemberBadgesRowProps {
    userId: string;
    maxVisible?: number;
}

export const MemberBadgesRow: React.FC<MemberBadgesRowProps> = ({ userId, maxVisible = 5 }) => {
    const [badges, setBadges] = useState<MemberBadge[]>([]);

    useEffect(() => {
        const all = db.gamification.getBadges().filter(b => b.userId === userId);
        setBadges(all);
    }, [userId]);

    if (badges.length === 0) return null;

    const visible = badges.slice(0, maxVisible);
    const extra = badges.length - maxVisible;

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {visible.map(b => {
                const cfg = BADGE_CFG[b.type];
                return (
                    <span
                        key={b.id}
                        title={`${cfg.label}: ${b.label}`}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}
                    >
                        {cfg.emoji} {cfg.label}
                    </span>
                );
            })}
            {extra > 0 && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                    +{extra} más
                </span>
            )}
        </div>
    );
};

// ============================================================
// ZOOM WIDGET — reemplaza el bloque "Sala Virtual" del dashboard
// ============================================================
interface ZoomWidgetProps {
    /** Pasa el evento online próximo desde MemberDashboard */
    event: CalendarEvent | null;
    /** ID del miembro autenticado */
    userId: string;
    userName: string;
}

export const ZoomWidget: React.FC<ZoomWidgetProps> = ({ event, userId, userName }) => {
    const [showDetail, setShowDetail] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackEventId, setFeedbackEventId] = useState('');
    const [feedbackEventTitle, setFeedbackEventTitle] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (userId) {
            setIsBlocked(db.feedback.hasBlockingFeedback(userId));
        }
    }, [userId]);

    const handleJoin = useCallback(() => {
        if (event?.meetingUrl) {
            window.open(event.meetingUrl, '_blank');
            setShowDetail(false);
            // After joining, trigger feedback for that session
            setTimeout(() => {
                setFeedbackEventId(event.id);
                setFeedbackEventTitle(event.title);
                setShowFeedback(true);
            }, 2000);
        }
    }, [event]);

    const handleFeedbackComplete = useCallback(() => {
        setShowFeedback(false);
        setIsBlocked(db.feedback.hasBlockingFeedback(userId));
    }, [userId]);

    const statusColor = event?.eventStatus;

    return (
        <>
            {/* Widget Card */}
            <div className="bg-slate-900 text-white rounded-[1.75rem] p-7 shadow-xl relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-cafh-cyan/10 rounded-full pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <ZoomLogo size={26} />
                        <h3 className="text-base font-bold text-white">Sala Virtual</h3>
                    </div>
                    {isBlocked && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 rounded-full px-2.5 py-1">
                            <Lock size={10} /> Bloqueado
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {event ? (
                        <div className="space-y-4">
                            <div className="bg-white/8 backdrop-blur rounded-2xl p-4 border border-white/10">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-bold text-white leading-tight line-clamp-2">{event.title}</p>
                                    <span className={`shrink-0 ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor === 'En curso'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                                        : 'bg-white/10 text-slate-300 border-white/10'
                                        }`}>
                                        {statusColor === 'En curso' ? '● En vivo' : statusColor || 'Programada'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-xs mt-2">
                                    <span className="flex items-center gap-1"><Calendar size={10} /> {event.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={10} /> {event.time}</span>
                                </div>
                            </div>

                            {isBlocked ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                                    <p className="text-xs text-red-300 font-medium">Completa tu evaluación pendiente para acceder</p>
                                    <button
                                        onClick={() => { setFeedbackEventId(event.id); setFeedbackEventTitle(event.title); setShowFeedback(true); }}
                                        className="mt-2 text-xs font-bold text-red-300 hover:text-red-200 underline"
                                    >
                                        Ir a la evaluación →
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDetail(true)}
                                    className="w-full py-3.5 bg-[#2D8CFF] hover:bg-[#1a7aef] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 group transition-all shadow-lg shadow-blue-900/30"
                                >
                                    <ZoomLogo size={18} />
                                    Unirse a la sesión
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    ) : (
                        /* No upcoming event */
                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-center">
                                <Calendar size={28} className="text-slate-500 mx-auto mb-2" />
                                <p className="text-slate-400 text-sm">Sin sesiones virtuales próximas</p>
                            </div>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold text-sm transition-colors">
                                Ver Calendario Completo
                            </button>
                        </div>
                    )}
                </div>

                {/* Badges strip */}
                {userId && (
                    <div className="relative z-10 mt-4 pt-4 border-t border-white/10">
                        <MemberBadgesRow userId={userId} maxVisible={4} />
                    </div>
                )}
            </div>

            {/* Event Detail Sheet */}
            {showDetail && event && (
                <EventDetailSheet
                    event={event}
                    onClose={() => setShowDetail(false)}
                    onJoin={handleJoin}
                    isBlocked={isBlocked}
                />
            )}

            {/* Feedback Wizard */}
            {showFeedback && (
                <FeedbackWizard
                    eventId={feedbackEventId}
                    eventTitle={feedbackEventTitle}
                    userId={userId}
                    userName={userName}
                    onComplete={handleFeedbackComplete}
                    onCancel={() => setShowFeedback(false)}
                />
            )}
        </>
    );
};
