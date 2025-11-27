"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const registrations = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "+1 234 567 890",
    date: "2023-10-26",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    mobile: "+1 345 678 901",
    date: "2023-10-25",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.b@example.com",
    mobile: "+1 456 789 012",
    date: "2023-10-24",
  },
  {
    id: 4,
    name: "Emily White",
    email: "emily.w@example.com",
    mobile: "+1 567 890 123",
    date: "2023-10-23",
  },
  {
    id: 5,
    name: "David Green",
    email: "david.g@example.com",
    mobile: "+1 678 901 234",
    date: "2023-10-22",
  },
];

export default function RecentRegistrationsTable({
  recentUsers,
  loading,
}: {
  recentUsers?: Array<any>;
  loading?: boolean;
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Recent Registrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                  User Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">
                  Email
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">
                  Mobile No
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody>
              {(loading
                ? new Array(5).fill(null)
                : recentUsers && recentUsers.length
                ? recentUsers
                : registrations
              ).map((reg: any, idx: number) => {
                const key = reg?.id ?? idx;
                const name =
                  reg?.name ??
                  reg?.full_name ??
                  reg?.user_name ??
                  reg?.user ??
                  "Unknown";
                const email = reg?.email ?? reg?.user_email ?? "-";
                const mobile = reg?.mobile_number ?? reg?.mobile ?? "-";
                const date = reg?.registration_date ?? reg?.date ?? "-";

                return (
                  <tr
                    key={key}
                    className="border-b border-border hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-foreground text-sm">
                      {loading ? (
                        <div className="h-4 bg-muted rounded w-32" />
                      ) : (
                        name
                      )}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm hidden sm:table-cell">
                      {loading ? (
                        <div className="h-4 bg-muted rounded w-40" />
                      ) : (
                        email
                      )}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm hidden md:table-cell">
                      {loading ? (
                        <div className="h-4 bg-muted rounded w-32" />
                      ) : (
                        mobile
                      )}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-sm">
                      {loading ? (
                        <div className="h-4 bg-muted rounded w-28" />
                      ) : (
                        date
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
