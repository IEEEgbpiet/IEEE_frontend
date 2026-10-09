import { Routes, Route } from 'react-router-dom';

import AdminLayout from './AdminLayout/layout';

// Dashboard
import DashboardPage from './pages/dashboard/page';

// Certificates
import Certificates from './pages/certificates/pages';
import IssuedCertificates from './pages/certificates/issued/CretificateIssued';
import RequestedCertificates from './pages/certificates/request/RequestedCertificates';
import ManualCertificateEntry from './pages/certificates/templates/page';

// Upcoming Events
import UpcomingEventsHub from './pages/upcomingPosts/page';
import AddUpcomingPost from './pages/upcomingPosts/components/AddUpcomingPost';
import EditUpcomingDirectory from './pages/upcomingPosts/components/EditUpcomingDirectory';
import EditUpcomingPostPanel from './pages/upcomingPosts/components/EditUpcomingPostPanel';

// Department Posts
import DepartmentPostsHub from './pages/departmentPosts/page';
import DepartmentDetail from './pages/departmentPosts/Components/DepartmentDetail';
import AddDepartmentPost from './pages/departmentPosts/Components/AddDepartmentPost';
import DepartmentPostsDirectory from './pages/departmentPosts/Components/DepartmentPostsDirectory';
import EditDepartmentPostPanel from './pages/departmentPosts/Components/EditDepartmentPostPanel';

// Support
import SupportTicketsPage from './pages/complain/page';

// Reports
import ReportsPage from './pages/reports/page';

// System
import LogsPage from './pages/logs/page';

// Security & Authentication
import ChangePassword from './pages/authentication/ChangePassword';
import ForgotPassword from './pages/authentication/ForgotPassword';

// Registration
import AdminRegistrationPage from './pages/registration/page';

// Student Directory
import DirectoryPage from './pages/Directory/page';

// Shared
import CommingSoonPage from '../../pages/ComingSoonpage';
import { PageNotFound } from './pages/pageNotFound';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* ============================================================
            DASHBOARD
        ============================================================ */}

        <Route index element={<DashboardPage />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* ============================================================
            CERTIFICATES & EMAILS
        ============================================================ */}

        <Route path="certificates">
          <Route index element={<Certificates />} />
          <Route path="issued" element={<IssuedCertificates />} />
          <Route path="requests" element={<RequestedCertificates />} />
          <Route path="templates" element={<ManualCertificateEntry />} />
        </Route>

        {/* ============================================================
            UPCOMING EVENTS
        ============================================================ */}

        <Route path="upcoming-posts">
          <Route index element={<UpcomingEventsHub />} />
          <Route path="add" element={<AddUpcomingPost />} />
          <Route path="manage" element={<EditUpcomingDirectory />} />
          <Route path="edit/:id" element={<EditUpcomingPostPanel />} />
        </Route>

        {/* ============================================================
            DEPARTMENT POSTS
        ============================================================ */}

        <Route path="department-posts">
          <Route index element={<DepartmentPostsHub />} />
          <Route path=":dept" element={<DepartmentDetail />} />
          <Route path=":dept/add" element={<AddDepartmentPost />} />
          <Route path=":dept/manage" element={<DepartmentPostsDirectory />} />
          <Route path=":dept/edit/:id" element={<EditDepartmentPostPanel />} />
        </Route>

        {/* ============================================================
            SUPPORT
        ============================================================ */}

        <Route path="support" element={<SupportTicketsPage />} />

        {/* ============================================================
            REPORTS & MINUTES OF MEETING
        ============================================================ */}

        <Route path="reports" element={<ReportsPage />} />

        {/* ============================================================
            SYSTEM / ADMIN
        ============================================================ */}

        <Route path="logs" element={<LogsPage />} />

        {/* ============================================================
            SECURITY / PASSWORD
        ============================================================ */}

        <Route path="change-password" element={<ChangePassword />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* ============================================================
            REGISTRATION
        ============================================================ */}

        <Route path="registration" element={<AdminRegistrationPage />} />

        {/* ============================================================
            STUDENT DIRECTORY
        ============================================================ */}

        <Route path="directory" element={<DirectoryPage />} />
        <Route path="Directory" element={<DirectoryPage />} />

        {/* ============================================================
            COMING SOON
        ============================================================ */}

        <Route path="ieeeapplication" element={<CommingSoonPage />} />
        <Route path="members" element={<CommingSoonPage />} />
        <Route path="drive" element={<CommingSoonPage />} />

        {/* ============================================================
            ADMIN 404
        ============================================================ */}

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
