import React, { useState, useEffect } from 'react';
import { db } from '../storage';
import { Activity, Database, Check, Loader2 } from 'lucide-react';

export const SystemMonitor: React.FC = () => {
    const [usage, setUsage] = useState(db.system.getStorageUsage());
    const [isInitializing, setIsInitializing] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [syncStatus, setSyncStatus] = useState<string | null>(null);

    useEffect(() => {
        // Initial load simulation
        const timer = setTimeout(() => {
            setIsInitializing(false);
            // Hide after 5 seconds to not be intrusive, but user wants it "forever"
            // Actually, keep it small and persistent or show on data changes?
            // "para que el usuario sepa que carga los datos al momento de abrir"
            // I'll keep it persistent but very subtle.
        }, 3000);

        // Update usage every time storage changes (simulated pulse)
        const interval = setInterval(() => {
            setUsage(db.system.getStorageUsage());
        }, 5000);

        // Fade in
        setTimeout(() => setIsVisible(true), 500);

        // Listen for remote sync events
        const handleSync = (e: any) => {
            setSyncStatus('¡Sincronizado!');
            // Pequeño delay para que el usuario alcance a ver que se actualizó 
            // y luego recarga la ventana suavemente para que todo el React Tree tome los datos nuevos.
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        };

        window.addEventListener('cafh_data_synced', handleSync);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            window.removeEventListener('cafh_data_synced', handleSync);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[9999] pointer-events-none select-none flex flex-col items-start gap-3 font-sans group">
            <div className="bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-[1.5rem] p-4 shadow-[0_10px_40px_rgba(16,185,129,0.15)] flex items-center gap-4 animate-in slide-in-from-left-10 duration-700 pointer-events-auto hover:bg-emerald-500/20 transition-all">
                <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        {isInitializing ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Activity className="animate-pulse" size={20} />
                        )}
                    </div>
                    {!isInitializing && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-ping" />
                    )}
                </div>

                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70">Sistema Operativo</span>
                        {isInitializing ? (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full animate-pulse">Iniciando...</span>
                        ) : (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                <Check size={8} /> Activo
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-emerald-400 leading-none">Memoria Local</span>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 h-1.5 bg-emerald-500/10 rounded-full overflow-hidden border border-emerald-500/10">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                    style={{ width: `${Math.min((usage.totalKB / 5120) * 100, 100)}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-emerald-500/60">{usage.totalKB}KB / 5MB</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer for persistence */}
            <div className="bg-black/80 backdrop-blur-md px-3 py-2 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/20 shadow-lg mb-2 flex items-center gap-2">
                Datos Demo Web Cargados (En revisión)
                {syncStatus && (
                    <span className="bg-emerald-500 text-black px-2 py-0.5 rounded-full text-[10px] animate-pulse">
                        {syncStatus}
                    </span>
                )}
            </div>
        </div>
    );
};
