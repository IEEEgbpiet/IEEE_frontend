import { useRoutes } from "react-router-dom";
import AdminLayout from "./AdminLayout/layout";
import DashboardPage from "./pages/dashboard/page";
import Certificates from "./pages/certificates/pages";
import IssuedCertificates from "./pages/certificates/issued/CretificateIssued";
import RequestedCertificates from "./pages/certificates/request/RequestedCertificates";
import ManualCertificateEntry from "./pages/certificates/templates/page";
import UpcomingEventsHub from "./pages/upcomingPosts/page";
import AddUpcomingPost from "./pages/upcomingPosts/components/AddUpcomingPost";
import EditUpcomingDirectory from "./pages/upcomingPosts/components/EditUpcomingDirectory";
import EditUpcomingPostPanel from "./pages/upcomingPosts/components/EditUpcomingPostPanel";
import DepartmentPostsHub from "./pages/departmentPosts/page";
import DepartmentDetail from "./pages/departmentPosts/Components/DepartmentDetail";
import AddDepartmentPost from "./pages/departmentPosts/Components/AddDepartmentPost";
import DepartmentPostsDirectory from "./pages/departmentPosts/Components/DepartmentPostsDirectory";
import EditDepartmentPostPanel from "./pages/departmentPosts/Components/EditDepartmentPostPanel";
import SupportTicketsPage from "./pages/complain/page";
import ReportsPage from "./pages/reports/page";
import LogsPage from "./pages/logs/page";
import { PageNotFound } from "./pages/pageNotFound";

export default function AdminRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "dashboard",
          element: <DashboardPage />,
        },
        // Certificates Sub-routes (Pages 2, 3, 4, 5)
        {
          path: "certificates",
          element: <Certificates />,
        },
        {
          path: "certificates/issued",
          element: <IssuedCertificates />,
        },
        {
          path: "certificates/requests",
          element: <RequestedCertificates />,
        },
        {
          path: "certificates/templates",
          element: <ManualCertificateEntry />,
        },
        // Upcoming Events Sub-routes (Pages 6, 7, 8, 9)
        {
          path: "upcoming-posts",
          element: <UpcomingEventsHub />,
        },
        {
          path: "upcoming-posts/add",
          element: <AddUpcomingPost />,
        },
        {
          path: "upcoming-posts/manage",
          element: <EditUpcomingDirectory />,
        },
        {
          path: "upcoming-posts/edit/:id",
          element: <EditUpcomingPostPanel />,
        },
        // Department Posts Sub-routes (Pages 10, 11, 12, 13, 14)
        {
          path: "department-posts",
          element: <DepartmentPostsHub />,
        },
        {
          path: "department-posts/:dept",
          element: <DepartmentDetail />,
        },
        {
          path: "department-posts/:dept/add",
          element: <AddDepartmentPost />,
        },
        {
          path: "department-posts/:dept/manage",
          element: <DepartmentPostsDirectory />,
        },
        {
          path: "department-posts/:dept/edit/:id",
          element: <EditDepartmentPostPanel />,
        },
        // Support / Complaints (Page 15)
        {
          path: "support",
          element: <SupportTicketsPage />,
        },
        {
          path: "complain",
          element: <SupportTicketsPage />,
        },
        // Reports & MoM
        {
          path: "reports",
          element: <ReportsPage />,
        },
        // Logs
        {
          path: "logs",
          element: <LogsPage />,
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },
  ]);
}
