"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import AddYearModal from "@/components/modals/add-year-modal";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const existingYears = [
  { id: 1, year: 2025 },
  { id: 2, year: 2024 },
  { id: 3, year: 2023 },
];

export default function YearsPage() {
  const [yearInput, setYearInput] = useState("");
  const [years, setYears] = useState(existingYears);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    year: { id: number; year: number } | null;
  }>({ open: false, year: null });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editing, setEditing] = useState<null | { id: number; year: number }>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function getAuthToken() {
    try {
      return localStorage.getItem("token") || "";
    } catch (e) {
      return "";
    }
  }

  async function fetchYears() {
    setLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/car/model-year`, {
        headers: token ? { authorization: token } : undefined,
      });
      const json = await res.json();
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200) {
        const sorted = (json.data || [])
          .slice()
          .sort((a: any, b: any) => (a.year || 0) - (b.year || 0));
        setYears(sorted);
      } else {
        toast.error(json?.message || "Failed to load years");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchYears();
  }, []);

  const filteredYears = years
    .filter((y) => y.year.toString().includes(searchTerm))
    .sort((a, b) => a.year - b.year);

  const handleAddYear = async () => {
    if (!yearInput.trim()) return;
    if (editing) {
      await handleSaveYear(yearInput.trim(), editing.id);
      setEditing(null);
    } else {
      await handleSaveYear(yearInput.trim());
    }
    setYearInput("");
  };

  async function handleSaveYear(yearValue: string, id?: number) {
    const token = getAuthToken();
    try {
      const url = id
        ? `${API_BASE}/car/edit-model-year/${id}`
        : `${API_BASE}/car/add-model-year`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: token } : {}),
        },
        body: JSON.stringify({ year: yearValue }),
      });
      const json = await res.json();
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200) {
        toast.success(id ? "Year updated" : "Year added");
        await fetchYears();
      } else {
        toast.error(json?.message || "Failed to save year");
      }
    } catch (err) {
      toast.error("Network error");
    }
  }

  async function handleDeleteYear(id: number) {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/car/model-year/${id}`, {
        method: "DELETE",
        headers: token ? { authorization: token } : undefined,
      });
      const json = await res.json();
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code !== 200) {
        toast.error(json?.message || "Failed to delete year");
        return false;
      }

      toast.success(json?.message || "Year deleted successfully");

      try {
        const modelsRes = await fetch(`${API_BASE}/car/all-car-model`, {
          headers: token ? { authorization: token } : undefined,
        });
        const modelsJson = await modelsRes.json();
        const modelsCode =
          modelsJson?.code ?? (modelsRes.ok ? 200 : modelsRes.status);
        if (modelsCode === 200) {
          const models = Array.isArray(modelsJson.data)
            ? modelsJson.data
            : modelsJson.data?.data || [];
          const companyIds = Array.from(
            new Set(
              models
                .filter((m: any) => Number(m.modelYearId) === Number(id))
                .map((m: any) => m.carCompanyId)
                .filter(Boolean)
            )
          );

          for (const companyId of companyIds) {
            try {
              const delCompanyRes = await fetch(
                `${API_BASE}/car/car-company/${companyId}`,
                {
                  method: "DELETE",
                  headers: token ? { authorization: token } : undefined,
                }
              );
              await delCompanyRes.json();
            } catch (e) {
              toast.error(`Network error deleting company ${companyId}`);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch models after deleting year:", e);
      }

      await fetchYears();
      return true;
    } catch (err) {
      toast.error("Network error");
      return false;
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Years Management
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className=""
        >
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl">
                {editing ? "Edit Year" : "Add New Year"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                  Year
                </label>
                <Input
                  placeholder="e.g., 2024"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  type="number"
                  className="rounded-lg text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={handleAddYear}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm md:text-base"
                  >
                    {editing ? "Save Changes" : "Add Year"}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 sm:flex-none"
                >
                  {editing ? (
                    <Button
                      onClick={() => {
                        setEditing(null);
                        setYearInput("");
                      }}
                      variant="outline"
                      className="w-full rounded-lg font-semibold text-sm md:text-base"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setYearInput("")}
                      variant="outline"
                      className="w-full rounded-lg font-semibold text-sm md:text-base"
                    >
                      Clear
                    </Button>
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div>
          <Card>
            <CardHeader className="pb-3 md:pb-4">
              <CardTitle className="text-lg md:text-xl mb-3 md:mb-4">
                Existing Years
              </CardTitle>
              <Input
                placeholder="Search years..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg text-sm"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 md:p-3 border border-border rounded-lg"
                      >
                        <div className="w-24">
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex gap-1 md:gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      </div>
                    ))
                  ) : filteredYears.length > 0 ? (
                    filteredYears.map((year) => (
                      <div
                        key={year.id}
                        className="flex items-center justify-between p-2 mb-2 md:p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <span className="font-semibold text-foreground text-sm md:text-base">
                          {year.year}
                        </span>
                        <div className="flex gap-1 md:gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setEditing({ id: year.id, year: year.year });
                              setYearInput(String(year.year));
                              if (typeof window !== "undefined")
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, year })}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4 text-sm">
                      No years found
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AnimatePresence>
        {deleteModal.open && (
          <DeleteConfirmationModal
            isOpen={deleteModal.open}
            onClose={() => setDeleteModal({ open: false, year: null })}
            onConfirm={async () => {
              const id = deleteModal.year?.id;
              if (!id) return;
              setDeleting(true);
              try {
                const ok = await handleDeleteYear(id);
                if (ok) setDeleteModal({ open: false, year: null });
              } finally {
                setDeleting(false);
              }
            }}
            title="Confirm Deletion"
            description="You are about to permanently delete the year. This action will also delete all related car models, sub-models, and cars, and cannot be undone. Do you want to proceed?"
            itemName={deleteModal.year?.year.toString()}
            isLoading={deleting}
          />
        )}
      </AnimatePresence>

      <AddYearModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={async (yearValue, id) => {
          await handleSaveYear(yearValue, id);
        }}
        initial={editing}
      />
    </div>
  );
}
