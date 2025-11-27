"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddCarSubModelModal from "@/components/modals/add-car-sub-model-modal";
import CarSubModelDetailsModal from "@/components/modals/car-sub-model-details-modal";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function CarSubModelsPage() {
  const [addSubModelOpen, setAddSubModelOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedSubModel, setSelectedSubModel] = useState<any>(null);
  const [subModels, setSubModels] = useState<Array<any>>([]);
  const [allSubModels, setAllSubModels] = useState<Array<any>>([]);
  const [companies, setCompanies] = useState<Array<any>>([]);
  const [years, setYears] = useState<Array<any>>([]);
  const [models, setModels] = useState<Array<any>>([]);
  const [allModels, setAllModels] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [pagination, setPagination] = useState<any | null>(null);

  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [filterModel, setFilterModel] = useState<string>("all");

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    subModel: any | null;
    isLoading: boolean;
  }>({
    open: false,
    subModel: null,
    isLoading: false,
  });

  function getAuthToken() {
    try {
      return localStorage.getItem("token") || "";
    } catch (e) {
      return "";
    }
  }

  const fetchSubModelsData = useCallback(
    async (p: number = page, l: number = limit) => {
      setLoading(true);
      try {
        const token = getAuthToken();
        const smRes = await fetch(
          `${API_BASE}/car/all-car-sub-model-pagination?page=${p}&limit=${l}`,
          {
            headers: token ? { authorization: token } : undefined,
          }
        );

        const smJson = await smRes.json();
        const smCode = smJson?.code ?? (smRes.ok ? 200 : smRes.status);
        if (smCode === 200) {
          setSubModels(smJson.data?.subModels || smJson.data || []);
          setPagination(smJson.data?.pagination || null);
        } else {
          toast.error(smJson?.message || "Failed to load sub models");
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
      const [cRes, yRes, mRes] = await Promise.all([
        fetch(`${API_BASE}/car/car-company`, {
          headers: token ? { authorization: token } : undefined,
        }),
        fetch(`${API_BASE}/car/model-year`, {
          headers: token ? { authorization: token } : undefined,
        }),
        fetch(`${API_BASE}/car/all-car-model`, {
          headers: token ? { authorization: token } : undefined,
        }),
      ]);

      const [cJson, yJson, mJson] = await Promise.all([
        cRes.json(),
        yRes.json(),
        mRes.json(),
      ]);

      const cCode = cJson?.code ?? (cRes.ok ? 200 : cRes.status);
      if (cCode === 200) setCompanies(cJson.data || []);

      const yCode = yJson?.code ?? (yRes.ok ? 200 : yRes.status);
      if (yCode === 200) setYears(yJson.data || []);

      const mCode = mJson?.code ?? (mRes.ok ? 200 : mRes.status);
      if (mCode === 200) {
        setModels(mJson.data || []);
        setAllModels(mJson.data || []);
      }
    } catch (err) {
      console.error("Failed to load filters:", err);
    }
  }, []);

  useEffect(() => {
    fetchSubModelsData(page, limit);
  }, [page, limit, fetchSubModelsData]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  async function handleSave(payload: any, id?: number) {
    const token = getAuthToken();
    try {
      if (id) {
        const res = await fetch(`${API_BASE}/car/edit-car-sub-model/${id}`, {
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
          toast.success(json.message || "Sub model updated");
          await fetchSubModelsData();
        } else {
          toast.error(json?.message || "Update failed");
        }
      } else {
        const res = await fetch(`${API_BASE}/car/add-car-sub-model`, {
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
          toast.success(json.message || "Sub model added");

          const subModelId = json.data?.id;
          if (subModelId) {
            const carPayload = {
              modelYearId: payload.modelYearId,
              carCompanyId: payload.carCompanyId,
              modelId: payload.modelId,
              subModelId: subModelId,
              transmission: payload.transmission,
              fuelType: payload.fuelType,
              engine: payload.engine,
              horsePower: payload.horsePower,
              torque: payload.torque,
            };

            const carRes = await fetch(`${API_BASE}/car/add-admin-car`, {
              method: "POST",
              headers: {
                "content-type": "application/json",
                ...(token ? { authorization: token } : {}),
              },
              body: JSON.stringify(carPayload),
            });

            const carJson = await carRes.json();
            if ((carJson?.code ?? (carRes.ok ? 200 : carRes.status)) === 200) {
              toast.success("Admin car created successfully");
            }
          }

          await fetchSubModelsData();
        } else {
          toast.error(json?.message || "Add failed");
        }
      }
    } catch (e) {
      toast.error("Network error");
    }
  }

  async function handleDelete(id: number) {
    const token = getAuthToken();
    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`${API_BASE}/car/car-sub-model/${id}`, {
        method: "DELETE",
        headers: token ? { authorization: token } : undefined,
      });
      const json = await res.json();
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200) {
        toast.success(json.message || "Deleted");
        await fetchSubModelsData();
      } else {
        toast.error(json?.message || "Delete failed");
      }
    } catch (e) {
      toast.error("Network error");
    } finally {
      setDeleteModal({ open: false, subModel: null, isLoading: false });
    }
  }

  const filteredSubModels = useMemo(
    () =>
      subModels.filter((sm) => {
        let ok = true;

        if (filterYear !== "all") {
          const yId = Number(filterYear);
          ok = ok && (sm.modelYearId === yId || sm.modelyear?.id === yId);
        }

        if (filterCompany !== "all") {
          const cId = Number(filterCompany);
          ok = ok && (sm.carCompanyId === cId || sm.carcompany?.id === cId);
        }

        if (filterModel !== "all") {
          const mId = Number(filterModel);
          ok = ok && (sm.modelId === mId || sm.model?.id === mId);
        }

        return ok;
      }),
    [subModels, filterYear, filterCompany, filterModel]
  );

  const clearFilters = useCallback(() => {
    setFilterYear("all");
    setFilterCompany("all");
    setFilterModel("all");
  }, []);

  const handleViewDetails = useCallback((subModel: any) => {
    setSelectedSubModel(subModel);
    setDetailsOpen(true);
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Manage Car Sub Models
          </h1>
        </div>
        <div>
          <Button
            onClick={() => {
              setEditing(null);
              setAddSubModelOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm md:text-base"
          >
            <Plus size={18} />
            Add New Sub Model
          </Button>
        </div>
      </div>

      <div>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 items-start md:items-center justify-between w-full">
              <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="Filter by Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((y: any) => (
                      <SelectItem key={y.id} value={String(y.id)}>
                        {y.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="Filter by Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((c: any) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterModel} onValueChange={setFilterModel}>
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="Filter by Car Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Models</SelectItem>
                    {models.map((m: any) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full sm:w-auto text-sm"
                >
                  Clear Filters
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">
                  Show
                </label>
                <select
                  value={limit}
                  onChange={(e) => {
                    const v = Number(e.target.value) || 20;
                    setLimit(v);
                    setPage(1);
                  }}
                  className="text-sm bg-background border border-border rounded px-2 py-1"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={150}>150</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Sub Model Name
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">
                      Car Model Name
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden md:table-cell">
                      Company
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden lg:table-cell">
                      Year
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(loading ? new Array(5).fill(null) : filteredSubModels).map(
                    (model: any, idx: number) => {
                      if (!model) {
                        return (
                          <tr
                            key={`skeleton-${idx}`}
                            className="border-b border-border"
                          >
                            <td className="py-3 md:py-4 px-3 md:px-4">
                              <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="py-3 md:py-4 px-3 md:px-4 hidden sm:table-cell">
                              <Skeleton className="h-4 w-20" />
                            </td>
                            <td className="py-3 md:py-4 px-3 md:px-4 hidden md:table-cell">
                              <Skeleton className="h-4 w-16" />
                            </td>
                            <td className="py-3 md:py-4 px-3 md:px-4 hidden lg:table-cell">
                              <Skeleton className="h-4 w-12" />
                            </td>
                            <td className="py-3 md:py-4 px-3 md:px-4">
                              <Skeleton className="h-6 w-20" />
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr
                          key={model.id}
                          className="border-b border-border hover:bg-accent/50 transition-colors"
                        >
                          <td className="py-3 md:py-4 px-3 md:px-4 font-medium text-foreground text-sm">
                            {model.name}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-blue-600 hidden sm:table-cell text-sm">
                            {model.model?.name}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden md:table-cell text-sm">
                            {model.carcompany?.name}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden lg:table-cell text-sm">
                            {model.modelyear?.year}
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="flex gap-2 md:gap-3">
                              <button
                                onClick={() => handleViewDetails(model)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditing(model);
                                  setAddSubModelOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    open: true,
                                    subModel: model,
                                    isLoading: false,
                                  })
                                }
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {pagination && (
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
                    : subModels.length || 0}{" "}
                  of {pagination?.total ?? subModels.length ?? 0} results
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
                    disabled={
                      pagination ? page >= pagination.totalPages : false
                    }
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs md:text-sm"
                  >
                    →
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {addSubModelOpen && (
        <AddCarSubModelModal
          isOpen={addSubModelOpen}
          onClose={() => {
            setAddSubModelOpen(false);
            setEditing(null);
          }}
          onSave={handleSave}
          companies={companies}
          years={years}
          models={allModels}
          initial={editing}
        />
      )}
      {detailsOpen && selectedSubModel && (
        <CarSubModelDetailsModal
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          subModel={selectedSubModel}
        />
      )}
      {deleteModal.open && (
        <DeleteConfirmationModal
          isOpen={deleteModal.open}
          onClose={() =>
            setDeleteModal({ open: false, subModel: null, isLoading: false })
          }
          onConfirm={async () => {
            if (deleteModal.subModel?.id) {
              await handleDelete(deleteModal.subModel.id);
            }
          }}
          title="Delete Car Sub-model Confirmation"
          description="You are about to permanently delete the car sub model. This action will also delete all related cars, and cannot be undone. Do you want to proceed?"
          itemName={deleteModal.subModel?.name}
          isLoading={deleteModal.isLoading}
        />
      )}
    </div>
  );
}
