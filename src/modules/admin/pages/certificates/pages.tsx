import LinkCard from "../components/LinkCard";

export default function Certificates() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <LinkCard
        title="Issued Certificates"
        description="View issued certificates"
        to="/admin/certificates/issued"
      />

      <LinkCard
        title="Requested Certificates"
        description="Manage certificate requests"
        to="/admin/certificates/requests"
      />

      <LinkCard
        title="Templates"
        description="Manage certificate templates"
        to="/admin/certificates/templates"
      />
    </div>
  );
}