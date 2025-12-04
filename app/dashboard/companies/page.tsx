"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, sortCompaniesByName } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import AddCompanyModal from "@/components/modals/add-company-modal";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    company: null as any,
  });
  const [deleting, setDeleting] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editing, setEditing] = useState<null | { id: number; name: string }>(
    null
  );

  const [companies, setCompanies] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  function getAuthToken() {
    try {
      return localStorage.getItem("token") || "";
    } catch (e) {
      return "";
    }
  }

  async function fetchCompanies() {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/car/car-company`, {
        headers: token ? { authorization: token } : undefined,
      });
      const json = await res.json();
      if (res.ok) {
        setCompanies(sortCompaniesByName(json.data || []));
      } else {
        toast.error(json.message || "Failed to load companies");
      }
    } catch (err) {
      toast.error("Error fetching companies");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanies();
  }, []);

  async function handleSaveCompany(name: string, id?: number) {
    const token = getAuthToken();
    try {
      if (id) {
        const res = await fetch(`${API_BASE}/car/edit-car-company/${id}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { authorization: token } : {}),
          },
          body: JSON.stringify({ name }),
        });
        const json = await res.json();
        if (res.ok) {
          toast.success(json.message || "Company updated");
          await fetchCompanies();
          return;
        }
      }

      const res = await fetch(`${API_BASE}/car/add-car-company`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: token } : {}),
        },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(json.message || "Company added");
        await fetchCompanies();
      } else {
        toast.error(json.message || "Failed to save");
      }
    } catch (err) {
      toast.error("Network error");
    }
  }

  async function handleDeleteCompany(id: number) {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/car/car-company/${id}`, {
        method: "DELETE",
        headers: token ? { authorization: token } : undefined,
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(json.message || "Company deleted");
        await fetchCompanies();
        return true;
      } else {
        toast.error(json.message || "Failed to delete");
        return false;
      }
    } catch (err) {
      toast.error("Network error");
      return false;
    }
  }

  const filteredCompanies = sortCompaniesByName(
    companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
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
            Companies Management
          </h1>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => {
              setEditing(null);
              setAddModalOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm md:text-base"
          >
            <Plus size={18} />
            Add New Company
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-3 md:pb-4">
            <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 md:px-4 py-2">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <Input
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 focus-visible:ring-0 text-sm"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden -mx-4 md:mx-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Name
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">
                      Creation Date
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i} className="border-b border-border">
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <Skeleton className="h-4 w-48" />
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 hidden sm:table-cell">
                            <Skeleton className="h-4 w-28" />
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="flex gap-2 md:gap-3">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          </td>
                        </tr>
                      ))
                    : filteredCompanies.map((company) => (
                        <tr className="border-b border-border hover:bg-accent/50 transition-colors">
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="font-medium text-foreground text-sm">
                              {company.name}
                            </div>
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden sm:table-cell text-sm">
                            {formatDate(
                              company.createdAt || company.createdDate
                            )}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="flex gap-2 md:gap-3">
                              <button
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => {
                                  setEditing({
                                    id: company.id,
                                    name: company.name,
                                  });
                                  setAddModalOpen(true);
                                }}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteModal({ open: true, company })
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AddCompanyModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={async (name, id) => {
          await handleSaveCompany(name, id);
        }}
        initial={editing}
      />

      <AnimatePresence>
        {deleteModal.open && (
          <DeleteConfirmationModal
            isOpen={deleteModal.open}
            onClose={() => setDeleteModal({ open: false, company: null })}
            onConfirm={async () => {
              const id = deleteModal.company?.id;
              if (!id) return;
              setDeleting(true);
              try {
                const ok = await handleDeleteCompany(id);
                if (ok) setDeleteModal({ open: false, company: null });
              } finally {
                setDeleting(false);
              }
            }}
            title="Confirm Deletion"
            description="You are about to permanently delete the company. This action will also delete all related car models, sub-models, and cars and cannot be undone. Do you want to proceed?"
            itemName={deleteModal.company?.name}
            isLoading={deleting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
