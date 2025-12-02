"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    user: any | null;
    isLoading?: boolean;
  }>({ open: false, user: null });
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number>(20);

  const fetchUsers = async (p = 1, l = limit) => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE}/user/all?page=${p}&limit=${l}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: token } : {}),
        },
      });
      const json = await res.json().catch(() => ({}));
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200 && json?.data && Array.isArray(json.data.users)) {
        setUsers(json.data.users);
        setPagination(json.data.pagination ?? null);
      } else {
        console.error(
          "Failed to fetch users",
          json?.message || "Unknown error"
        );
      }
    } catch (e) {
      console.error("Network error", "Could not fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page, limit]);

  const handleDelete = async (id: number) => {
    setDeleteModal((d) => ({ ...d, isLoading: true }));
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API_BASE}/user/delete/${id}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: token } : {}),
        },
      });
      const json = await res.json().catch(() => ({}));
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200) {
        console.log("Deleted", json?.message || "User deleted");
        fetchUsers(page);
      } else {
        console.error(
          "Delete failed",
          json?.message || "Could not delete user"
        );
      }
    } catch (e) {
      console.error("Network error", "Could not delete user");
    } finally {
      setDeleteModal({ open: false, user: null });
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    return (
      (user.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Users Management
          </h1>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 max-w-xl bg-background border border-border rounded-lg px-3 md:px-4 py-2">
        <Search size={18} className="text-muted-foreground shrink-0" />
        <Input
          placeholder="Search by name, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 text-sm"
        />
        <div className="ml-3 hidden sm:flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Show</label>
          <select
            value={limit}
            onChange={(e) => {
              const v = Number(e.target.value) || 20;
              setLimit(v);
              setPage(1);
            }}
            className="text-sm bg-background border border-border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div>
        <Card>
          <CardContent>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Name
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">
                      Email
                    </th>
                    <th className="text-center py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">
                      Mobile No
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">
                      Date Joined
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <AnimatePresence mode="wait">
                  <motion.tbody
                    key={`page-${page}-limit-${limit}`}
                    variants={{
                      hidden: { opacity: 0, y: 6 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { staggerChildren: 0.03 },
                      },
                      exit: { opacity: 0, y: -6 },
                    }}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {(loading ? new Array(6).fill(null) : filteredUsers).map(
                      (user: any, idx: number) => (
                        <motion.tr
                          key={user?.id ?? idx}
                          variants={{
                            visible: {
                              opacity: 1,
                              y: 0,
                              transition: {
                                type: "spring",
                                stiffness: 120,
                                damping: 18,
                              },
                            },
                            exit: { opacity: 0, y: -8 },
                          }}
                          whileHover={{}}
                          className="border-b border-border hover:bg-accent/50 transition-colors"
                        >
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <Avatar className="h-8 w-8 md:h-10 md:w-10">
                                {!loading && user?.user_image ? (
                                  <AvatarImage
                                    src={`${process.env.NEXT_PUBLIC_UPLOAD_PATH}${user.user_image}`}
                                  />
                                ) : (
                                  <AvatarImage src="/placeholder.svg" />
                                )}
                                <AvatarFallback>
                                  {!loading
                                    ? (user?.name || "--")
                                        .slice(0, 2)
                                        .toUpperCase()
                                    : ""}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-foreground text-sm">
                                {loading ? (
                                  <div className="h-4 bg-muted rounded w-28" />
                                ) : (
                                  user?.name
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden sm:table-cell text-xs md:text-sm">
                            {loading ? (
                              <div className="h-4 bg-muted rounded w-40" />
                            ) : (
                              user?.email
                            )}
                          </td>
                          <td className="py-3 text-center md:py-4 px-3 md:px-4 text-muted-foreground hidden md:table-cell text-xs md:text-sm">
                            {loading ? (
                              <div className="h-4 bg-muted rounded w-32" />
                            ) : user?.mobile_number ? (
                              user.mobile_number
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden lg:table-cell text-xs md:text-sm">
                            {loading ? (
                              <div className="h-4 bg-muted rounded w-28" />
                            ) : (
                              formatDate(user?.date_joined)
                            )}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <button
                              onClick={() =>
                                setDeleteModal({ open: true, user })
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      )
                    )}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>

            <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              <p className="text-xs md:text-sm text-muted-foreground">
                Showing{" "}
                {pagination
                  ? (pagination.currentPage - 1) * pagination.perPage + 1
                  : 1}{" "}
                to{" "}
                {pagination
                  ? Math.min(
                      pagination.currentPage * pagination.perPage,
                      pagination.total
                    )
                  : users.length || 0}{" "}
                of {pagination?.total ?? users.length ?? 0} results
              </p>
              <div className="flex gap-1 md:gap-2 overflow-x-auto">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-xs md:text-sm"
                >
                  ←
                </Button>
                {Array.from({ length: pagination?.totalPages ?? 1 }).map(
                  (_, i) => (
                    <Button
                      key={i}
                      variant={i + 1 === page ? "default" : "outline"}
                      size="sm"
                      className={`text-xs md:text-sm ${
                        i + 1 === page ? "bg-blue-600" : ""
                      }`}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination ? page >= pagination.totalPages : false}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-xs md:text-sm"
                >
                  →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {deleteModal.open && (
          <DeleteConfirmationModal
            isOpen={deleteModal.open}
            onClose={() => setDeleteModal({ open: false, user: null })}
            onConfirm={() => handleDelete(deleteModal.user.id)}
            title="Confirm Deletion"
            description="You are about to permanently delete the user. This action cannot be undone."
            itemName={deleteModal.user?.name}
            isLoading={deleteModal.isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
