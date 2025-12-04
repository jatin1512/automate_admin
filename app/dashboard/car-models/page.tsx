"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { sortYearsAscending, sortCompaniesByName } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function CarModelsPage() {
  const [addModelOpen, setAddModelOpen] = useState(false);
  const [models, setModels] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [pagination, setPagination] = useState<any | null>(null);
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

  const fetchModels = useCallback(
    async (p: number = page, l: number = limit) => {
      setLoading(true);
      try {
        const token = getAuthToken();
        const mRes = await fetch(
          `${API_BASE}/car/all-car-model-pagination?page=${p}&limit=${l}`,
          {
            headers: token ? { authorization: token } : undefined,
          }
        );
        const mJson = await mRes.json();
        const mCode = mJson?.code ?? (mRes.ok ? 200 : mRes.status);
        if (mCode === 200) {
          const data = mJson.data;
          if (data?.models) {
            setModels(data.models || []);
            setPagination(data.pagination || null);
          } else {
            // Fallback if API returns array directly
            setModels(Array.isArray(data) ? data : []);
            setPagination(null);
          }
        } else {
          toast.error(mJson?.message || "Failed to load models");
        }
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

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
      if (cCode === 200) setCompanies(sortCompaniesByName(cJson.data || []));

      const yCode = yJson?.code ?? (yRes.ok ? 200 : yRes.status);
      if (yCode === 200) setYears(sortYearsAscending(yJson.data || []));
    } catch (err) {
      console.error("Failed to load filters:", err);
    }
  }, []);

  useEffect(() => {
    fetchModels(page, limit);
  }, [page, limit, fetchModels]);

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
        await fetchModels(page, limit);
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
        await fetchModels(page, limit);
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
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 items-start sm:items-center">
              <Select
                value={filterCompany === "all" ? "all" : filterCompany}
                onValueChange={(v) => setFilterCompany(v)}
              >
                <SelectTrigger className="w-full sm:w-48 text-sm bg-gray-50">
                  <SelectValue placeholder="Filter by Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Filter by Companies</SelectItem>
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
                <SelectTrigger className="w-full sm:w-48 text-sm bg-gray-50">
                  <SelectValue placeholder="Filter by Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Filter by Years</SelectItem>
                  {years.map((y) => (
                    <SelectItem key={y.id} value={String(y.id)}>
                      {y.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none text-sm"
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
                  {loading ? (
                    Array.from({ length: Math.min(6, limit) }).map((_, i) => (
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
                  ) : filteredModels.length > 0 ? (
                    filteredModels.map((model) => (
                      <tr
                        key={model.id}
                        className="border-b border-border hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-3 md:py-4 px-3 md:px-4 font-medium text-foreground text-sm">
                          {model.name}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden sm:table-cell text-sm">
                          {model.carcompany?.name ?? model.carCompanyId ?? "-"}
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
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-6 text-center text-muted-foreground text-sm"
                      >
                        No car models found for selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
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
                  : models.length || 0}{" "}
                of {pagination?.total ?? models.length ?? 0} results
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
                {(() => {
                  const totalPages = pagination?.totalPages ?? 1;
                  const pages: number[] = [];
                  if (totalPages <= 6) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    for (let i = 1; i <= Math.min(3, totalPages); i++)
                      pages.push(i);
                    if (page > 3 && page < totalPages - 2) {
                      if (page > 4) pages.push(-1);
                      pages.push(page);
                    }
                    if (totalPages > 3) pages.push(-2);
                    for (
                      let i = Math.max(totalPages - 2, 4);
                      i <= totalPages;
                      i++
                    )
                      pages.push(i);
                  }
                  return pages.map((p, i) =>
                    p < 0 ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="px-2 text-muted-foreground"
                      >
                        ...
                      </span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        className={`text-xs md:text-sm ${
                          p === page ? "bg-blue-600" : ""
                        }`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    )
                  );
                })()}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination ? page >= pagination.totalPages : false}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-xs md:text-sm"
                >
                  →
                </Button>
                <div className="ml-4">
                  <Select
                    onValueChange={(v) => {
                      setLimit(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 text-sm">
                      <SelectValue placeholder={`${limit}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="150">150</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
