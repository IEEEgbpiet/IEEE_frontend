import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutPage from '@/modules/about/page';
import EventsPage from '@/modules/activities/EventsPage';
import RoboticsPage from '@/modules/activities/RoboticsPage';
import ContactPage from '@/modules/contact/page';
import HomePage from '@/modules/home/page';
import TeamsPage from '@/modules/teams/page';
import CertificateForm from '@/components/Certificate';
import { NotFoundPage } from '@/pages/NotFoundPage';
import MainLayout from './components/layout/Layout';
import PrivateRoute from './components/PrivateRoute'; //Also uncomment this later.
import Login from './modules/admin/pages/authentication/components/login';
import AdminRoutes from './modules/admin/router';
import FrontendCommingSoon from './pages/FrontendCommingSoon'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/activities/events" element={<EventsPage />} />
          <Route path="/activities/robotics" element={<RoboticsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/certificate" element={<CertificateForm />} />
          <Route path="/certificates" element={<CertificateForm />} />
          <Route path="/certificate/apply" element={<CertificateForm />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/registration" element={<FrontendCommingSoon/>} />
          <Route path="/joinieee" element={<FrontendCommingSoon/>} />
        </Route>

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* CMS / Admin Portal Nested Routes */}
        <Route
          path="/admin/*"
          element=
              <PrivateRoute>
              <AdminRoutes />
            </PrivateRoute>
          
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
