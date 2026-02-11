//teleCRM/telecrm-frontend/components/admin/AdminSidebar.tsx
import Link from "next/link";
import { LayoutDashboard, UserPlus, Building2, Users } from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-64 bg-slate-900 text-white p-4">
      <nav className="space-y-2 w-full">
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800"
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/users/add"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800"
        >
          <UserPlus size={18} />
          <span>Add User</span>
        </Link>

        {/* ✅ Add Department */}
        <Link
          href="/admin/departments/add"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800"
        >
          <Building2 size={18} />
          <span>Add Department</span>
        </Link>
        <Link
          href="/admin/teams/create"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800"
        >
          <Users size={18} />
          <span>Create Team</span>
        </Link>
      </nav>
    </aside>
  );
}
