import { useParams } from "react-router-dom";
import LinkCard from "../../components/LinkCard";

export default function DepartmentDetail() {
  const { dept = "CSE" } = useParams<{ dept: string }>();

  return (
    <div className="space-y-6 bg-black text-white">
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-semibold text-white">
          {dept.toUpperCase()} Department
        </h1>
      </div>

      {/* 2 Cards as specified in Page 11 Wireframe */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LinkCard
          title="Add Posts"
          to={`/admin/department-posts/${dept}/add`}
        />

        <LinkCard
          title="Edit Posts"
          to={`/admin/department-posts/${dept}/manage`}
        />
      </div>
    </div>
  );
}
