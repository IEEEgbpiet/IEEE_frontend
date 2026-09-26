
import {useRoutes} from "react-router-dom";
import AdminLayout from "./AdminLayout/layout";
import IssuedCertificates from "./pages/certificates/issued/CretificateIssued";
import RequestedCertificates from "./pages/certificates/request/RequestedCertificates";
import Certificates from "./pages/certificates/pages";
import {PageNotFound} from "./pages/pageNotFound";
export default function AdminRoutes() {
  return useRoutes([
    {
      path: "/",
      element: <AdminLayout />,
      children: [
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
          path: "*",
          element: <PageNotFound />,
        }
      ],
    },
  ]);
}





