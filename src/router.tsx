import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutPage from '@/modules/about/page';
import EventsPage from '@/modules/activities/EventsPage';
import RoboticsPage from '@/modules/activities/RoboticsPage';
import ContactPage from '@/modules/contact/page';
import HomePage from '@/modules/home/page';
import TeamsPage from '@/modules/teams/page';
import { NotFoundPage } from '@/pages/NotFoundPage';
import MainLayout from './components/layout/Layout';
//import PrivateRoute from './components/PrivateRoute'; //Also uncomment this later.
import Login from './modules/admin/pages/authentication/components/login';
import AdminRoutes from './modules/admin/router';

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
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* CMS / Admin Portal Nested Routes */}
        <Route
          path="/admin/*"
          element={ //Don't uncomment this as this is for the display of the admin route without user authentication. Uncomment Later 
            //<PrivateRoute>
              <AdminRoutes />
            //</PrivateRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
