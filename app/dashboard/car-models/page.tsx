"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddEditCarModelModal from "@/components/modals/add-edit-car-model-modal";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function CarModelsPage() {
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [models, setModels] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Array<any>>([]);
  const [years, setYears] = useState<Array<any>>([]);
  const [editing, setEditing] = useState<any>(null);
  const [filterCompany, setFilterCompany] = useState<string | "all">("all");
  const [filterYear, setFilterYear] = useState<string | "all">("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingModel, setDeletingModel] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  function getAuthToken() {
    try {
      return localStorage.getItem("token") || "";
    } catch (e) {
      return "";
    }
  }

  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const mRes = await fetch(`${API_BASE}/car/all-car-model`, {
        headers: token ? { authorization: token } : undefined,
      });
      const mJson = await mRes.json();
      const mCode = mJson?.code ?? (mRes.ok ? 200 : mRes.status);
      if (mCode === 200) setModels(mJson.data || []);
      else toast.error(mJson?.message || "Failed to load models");
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilters = useCallback(async () => {
    try {
      const token = getAuthToken();
      const [cRes, yRes] = await Promise.all([
        fetch(`${API_BASE}/car/car-company`, {
          headers: token ? { authorization: token } : undefined,
        }),
        fetch(`${API_BASE}/car/model-year`, {
          headers: token ? { authorization: token } : undefined,
        }),
      ]);
      const [cJson, yJson] = await Promise.all([cRes.json(), yRes.json()]);

      const cCode = cJson?.code ?? (cRes.ok ? 200 : cRes.status);
      if (cCode === 200) setCompanies(cJson.data || []);

      const yCode = yJson?.code ?? (yRes.ok ? 200 : yRes.status);
      if (yCode === 200) setYears(yJson.data || []);
    } catch (err) {
      console.error("Failed to load filters:", err);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  async function handleSave(
    payload: { name: string; modelYearId: number; carCompanyId: number },
    id?: number
  ) {
    const token = getAuthToken();
    try {
      const url = id
        ? `${API_BASE}/car/edit-car-model/${id}`
        : `${API_BASE}/car/add-car-model`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: token } : {}),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200) {
        toast.success(json?.message || (id ? "Updated" : "Created"));
        await fetchModels();
      } else {
        toast.error(json?.message || "Failed");
      }
    } catch (err) {
      toast.error("Network error");
    }
  }

  async function handleDelete(id: number): Promise<boolean> {
    const token = getAuthToken();
    try {
      const res = await fetch(`${API_BASE}/car/car-model/${id}`, {
        method: "DELETE",
        headers: token ? { authorization: token } : undefined,
      });
      const json = await res.json();
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200) {
        toast.success(json?.message || "Deleted");
        await fetchModels();
        return true;
      } else {
        toast.error(json?.message || "Failed to delete");
        return false;
      }
    } catch (err) {
      toast.error("Network error");
      return false;
    }
  }

  function resetFilters() {
    setFilterCompany("all");
    setFilterYear("all");
  }

  const filteredModels = useMemo(
    () =>
      models.filter((m) => {
        let ok = true;
        if (filterCompany !== "all") {
          const compId = Number(filterCompany);
          ok = ok && (m.carCompanyId === compId || m.carcompany?.id === compId);
        }
        if (filterYear !== "all") {
          const yId = Number(filterYear);
          ok = ok && (m.modelYearId === yId || m.modelyear?.id === yId);
        }
        return ok;
      }),
    [models, filterCompany, filterYear]
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Car Models Management
          </h1>
        </div>
        <div>
          <Button
            onClick={() => {
              setEditing(null);
              setAddModelOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm md:text-base"
          >
            <Plus size={18} />
            Add New Model
          </Button>
        </div>
      </div>

      <div>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 items-start md:items-center">
              <Select
                value={filterCompany === "all" ? "all" : filterCompany}
                onValueChange={(v) => setFilterCompany(v)}
              >
                <SelectTrigger className="w-full sm:w-40 text-sm">
                  <SelectValue placeholder="Filter by Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterYear === "all" ? "all" : filterYear}
                onValueChange={(v) => setFilterYear(v)}
              >
                <SelectTrigger className="w-full sm:w-40 text-sm">
                  <SelectValue placeholder="Filter by Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((y) => (
                    <SelectItem key={y.id} value={String(y.id)}>
                      {y.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-sm"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Model Name
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">
                      Company
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">
                      Year
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Action
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
                          <td className="py-3 md:py-4 px-3 md:px-4 hidden md:table-cell">
                            <Skeleton className="h-4 w-20" />
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="flex gap-2">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                          </td>
                        </tr>
                      ))
                    : filteredModels.map((model) => (
                        <tr
                          key={model.id}
                          className="border-b border-border hover:bg-accent/50 transition-colors"
                        >
                          <td className="py-3 md:py-4 px-3 md:px-4 font-medium text-foreground text-sm">
                            {model.name}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden sm:table-cell text-sm">
                            {model.carcompany?.name ??
                              model.carCompanyId ??
                              "-"}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden md:table-cell text-sm">
                            {model.modelyear?.year ?? model.modelYearId ?? "-"}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="flex gap-2 md:gap-3">
                              <button
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => {
                                  setEditing(model);
                                  setAddModelOpen(true);
                                }}
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setDeletingModel(model);
                                  setDeleteModalOpen(true);
                                }}
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
      </div>

      {addModelOpen && (
        <AddEditCarModelModal
          isOpen={addModelOpen}
          onClose={() => {
            setAddModelOpen(false);
            setEditing(null);
          }}
          onSave={async (payload, id) => {
            await handleSave(payload, id);
          }}
          companies={companies}
          years={years}
          initial={editing}
        />
      )}
      {deleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setDeletingModel(null);
          }}
          onConfirm={async () => {
            if (!deletingModel?.id) return;
            setDeleting(true);
            try {
              const ok = await handleDelete(deletingModel.id);
              if (ok) {
                setDeleteModalOpen(false);
                setDeletingModel(null);
              }
            } finally {
              setDeleting(false);
            }
          }}
          title="Confirm Deletion"
          description={`You are about to permanently delete the car model. This action will also delete all related car sub-models and cars, and cannot be undone. Do you want to proceed?`}
          itemName={deletingModel?.name}
          isLoading={deleting}
        />
      )}
    </div>
  );
}
