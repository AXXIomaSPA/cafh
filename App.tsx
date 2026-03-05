import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PublicHeader, PublicFooter, AdminLayout } from './components/Layout';
import { HomeView, LoginView, DynamicPageView } from './components/PublicViews';
import { AboutView, MethodView, ResourcesView, ActivitiesView } from './components/InternalViews';
import { useParams } from 'react-router-dom';

// Dynamic Page Wrapper
const DynamicPageWrapper: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    return <DynamicPageView slug={slug || ''} />;
};
import { MemberDashboard } from './components/UserViews';
import { DashboardView, CRMView, AutomationsView, CMSView, MediaLibraryView, AnalyticsView, JourneyView, SettingsView } from './components/AdminViews';
import { MeetingsAdminView } from './components/MeetingsModule';
import { db } from './storage';
import { UserRole } from './types';

// Wrapper for Public Pages to include Header/Footer
const PublicLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-1">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
};

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
    const user = db.auth.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on role if unauthorized
        return <Navigate to={user.role === UserRole.MEMBER ? "/member/dashboard" : "/admin"} replace />;
    }

    return <>{children}</>;
};

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

const App: React.FC = () => {
    // Initialize Local Memory on App Mount
    useEffect(() => {
        db.init();
    }, []);

    return (
        <HashRouter>
            <ScrollToTop />
            <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={
                    <PublicLayoutWrapper>
                        <HomeView />
                    </PublicLayoutWrapper>
                } />

                {/* CMS-POWERED PAGES (FORMERLY STATIC) */}
                <Route path="/about" element={<PublicLayoutWrapper><DynamicPageView slug="quienes-somos" /></PublicLayoutWrapper>} />
                <Route path="/method" element={<PublicLayoutWrapper><DynamicPageView slug="el-metodo" /></PublicLayoutWrapper>} />
                <Route path="/resources" element={<PublicLayoutWrapper><DynamicPageView slug="biblioteca-recursos" /></PublicLayoutWrapper>} />
                <Route path="/activities" element={<PublicLayoutWrapper><DynamicPageView slug="actividades-retiros" /></PublicLayoutWrapper>} />

                {/* INTERNAL SUB-PAGES (CAN BE DYNAMIC TOO) */}
                <Route path="/about/*" element={<PublicLayoutWrapper><DynamicPageView slug="quienes-somos" /></PublicLayoutWrapper>} />
                <Route path="/method/*" element={<PublicLayoutWrapper><DynamicPageView slug="el-metodo" /></PublicLayoutWrapper>} />
                <Route path="/resources/*" element={<PublicLayoutWrapper><DynamicPageView slug="biblioteca-recursos" /></PublicLayoutWrapper>} />
                <Route path="/activities/*" element={<PublicLayoutWrapper><DynamicPageView slug="actividades-retiros" /></PublicLayoutWrapper>} />

                {/* DYNAMIC PAGES */}
                <Route path="/p/:slug" element={<PublicLayoutWrapper><DynamicPageWrapper /></PublicLayoutWrapper>} />

                {/* AUTH */}
                <Route path="/login" element={<LoginView />} />

                {/* MEMBER ROUTES (Protected) */}
                <Route path="/member/dashboard" element={
                    <ProtectedRoute allowedRoles={[UserRole.MEMBER]}>
                        <PublicLayoutWrapper>
                            <MemberDashboard />
                        </PublicLayoutWrapper>
                    </ProtectedRoute>
                } />

                {/* ADMIN ROUTES (Protected) */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><DashboardView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/crm" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><CRMView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/automations" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><AutomationsView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/cms" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><CMSView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/media" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><MediaLibraryView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><AnalyticsView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/journey" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><JourneyView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><SettingsView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/meetings" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><MeetingsAdminView /></AdminLayout></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}><AdminLayout><div className="text-center py-20 text-slate-500">Módulo en construcción</div></AdminLayout></ProtectedRoute>} />

                {/* CATCH ALL */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </HashRouter>
    );
};

export default App;