//teleCRM/telecrm-frontend/app/admin/departments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Department {
  id: string;
  name: string;
  createdAt: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get<Department[]>("/departments");
      setDepartments(res.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to load departments",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Departments</h1>

        <Link href="/admin/departments/add">
          <Button>Add Department</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department List</CardTitle>
        </CardHeader>

        <CardContent>
          {loading && (
            <p className="text-sm text-muted-foreground">
              Loading departments...
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && departments.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No departments found
            </p>
          )}

          {!loading && departments.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="capitalize">
                      {dept.name}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        dept.createdAt,
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
