import LinkCard from "../components/LinkCard";

export default function Certificates() {
  return (
    <div className="space-y-6 bg-black text-white">
      {/* 3 Cards as specified in Page 2 Wireframe */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LinkCard
          title="Issued Certificates"
          to="/admin/certificates/issued"
        />

        <LinkCard
          title="Requested Certificates"
          to="/admin/certificates/requests"
        />

        <LinkCard
          title="Templates"
          to="/admin/certificates/templates"
        />
      </div>
    </div>
  );
}