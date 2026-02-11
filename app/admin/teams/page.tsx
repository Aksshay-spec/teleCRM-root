//teleCRM/telecrm-frontend/app/admin/teams/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { getAccessLevel } from "@/lib/auth";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Team {
  id: string;
  name: string;
  manager: {
    email: string;
    designation: string;
  };
  membersCount: number;
  createdAt: string;
}

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // 🔒 L1 ONLY ACCESS
  // ======================================================
  useEffect(() => {
    const accessLevel = getAccessLevel();
    if (accessLevel !== "L1") {
      router.replace("/login");
    }
  }, [router]);

  // ======================================================
  // 📥 FETCH TEAMS
  // ======================================================
  useEffect(() => {
    api
      .get<Team[]>("/teams")
      .then((res) => setTeams(res.data))
      .catch(() => alert("Failed to load teams"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading teams...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Teams</CardTitle>

          <Button onClick={() => router.push("/admin/teams/create")}>
            + Create Team
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {teams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No teams found
                  </TableCell>
                </TableRow>
              ) : (
                teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">
                      {team.name}
                    </TableCell>

                    <TableCell>{team.manager.email}</TableCell>

                    <TableCell>{team.manager.designation}</TableCell>

                    <TableCell>{team.membersCount}</TableCell>

                    <TableCell>
                      {new Date(team.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
