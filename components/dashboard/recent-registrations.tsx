"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default function RecentRegistrationsTable({
  recentUsers,
  loading,
}: {
  recentUsers?: Array<any>;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Recent Registrations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto text-center">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                  User Name
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">
                  Email
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">
                  Mobile No
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">
                  Registration Date
                </th>
              </tr>
            </thead>
            <tbody>
              {(loading
                ? new Array(5).fill(null)
                : recentUsers && recentUsers.length
                ? recentUsers
                : []
              ).map((reg: any, idx: number) => {
                const key = reg?.id ?? idx;
                const nameValue =
                  reg?.name ??
                  reg?.full_name ??
                  reg?.user_name ??
                  reg?.user ??
                  null;
                const name =
                  nameValue && String(nameValue).trim()
                    ? String(nameValue).trim()
                    : "-";
                const email =
                  reg?.email && String(reg.email).trim()
                    ? String(reg.email).trim()
                    : "-";
                const mobile =
                  reg?.mobile_number && String(reg.mobile_number).trim()
                    ? String(reg.mobile_number).trim()
                    : reg?.mobile && String(reg.mobile).trim()
                    ? String(reg.mobile).trim()
                    : "-";
                const rawDate = reg?.registration_date ?? reg?.date ?? null;
                const date = rawDate ? formatDate(rawDate) : "-";

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
