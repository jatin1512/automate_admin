"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Plus, Eye, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddCarModal from "@/components/modals/add-car-modal";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";
import CarViewModal from "@/components/modals/car-view-modal";
import toast from "react-hot-toast";
import { sortYearsAscending, sortCompaniesByName } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function CarsPage() {
  const [addCarOpen, setAddCarOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [carsData, setCarsData] = useState<Array<any>>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [pagination, setPagination] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Array<any>>([]);
  const [years, setYears] = useState<Array<any>>([]);

  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterCompany, setFilterCompany] = useState<string>("all");
  const [filterModel, setFilterModel] = useState<string>("all");
  const [filterSubModel, setFilterSubModel] = useState<string>("all");

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    car: any | null;
    isLoading?: boolean;
  }>({ open: false, car: null });
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    car: any | null;
  }>({ open: false, car: null });

  const fetchCars = useCallback(
    async (p: number = page, l: number = limit) => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const carsUrl = `${API_BASE}/car/admin-car-pagination?page=${p}&limit=${l}`;
        const carsRes = await fetch(carsUrl, {
          headers: { ...(token ? { authorization: token } : {}) },
        });

        const carsJson = await carsRes.json().catch(() => ({}));

        if (carsRes.status) {
          setCarsData(
            Array.isArray(carsJson.data.cars) ? carsJson.data.cars : []
          );
          setPagination(carsJson.data.pagination ?? null);
        } else {
          toast.error(carsJson?.message || "Failed to fetch cars");
        }
      } catch (e) {
        toast.error("Network error while fetching cars");
      } finally {
        setLoading(false);
      }
    },
    [page, limit]
  );

  const fetchFilters = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const [companiesRes, yearsRes] = await Promise.all([
        fetch(`${API_BASE}/car/car-company`, {
          headers: { ...(token ? { authorization: token } : {}) },
        }),
        fetch(`${API_BASE}/car/model-year`, {
          headers: { ...(token ? { authorization: token } : {}) },
        }),
      ]);

      const [companiesJson, yearsJson] = await Promise.all([
        companiesRes.json().catch(() => ({})),
        yearsRes.json().catch(() => ({})),
      ]);

      if (
        (companiesJson?.code ??
          (companiesRes.ok ? 200 : companiesRes.status)) === 200
      ) {
        setCompanies(
          sortCompaniesByName(
            Array.isArray(companiesJson.data) ? companiesJson.data : []
          )
        );
      }

      if ((yearsJson?.code ?? (yearsRes.ok ? 200 : yearsRes.status)) === 200) {
        setYears(
          sortYearsAscending(
            Array.isArray(yearsJson.data) ? yearsJson.data : []
          )
        );
      }
    } catch (e) {
      console.error("Failed to load filters:", e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCars(page, limit);
  }, [page, limit, fetchCars]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    if (filterYear === "all" || filterCompany === "all") {
      setFilterModel("all");
    }
  }, [filterYear, filterCompany]);

  useEffect(() => {
    if (filterModel === "all") {
      setFilterSubModel("all");
    }
  }, [filterModel]);

  const handleSave = async (payload: any, id?: number) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      if (id) {
        const res = await fetch(`${API_BASE}/car/edit-admin-car`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { authorization: token } : {}),
          },
          body: JSON.stringify({ id, ...payload }),
        });
        const json = await res.json().catch(() => ({}));
        if ((json?.code ?? (res.ok ? 200 : res.status)) === 200) {
          toast.success(json.message || "Car updated");
          await fetchCars();
        } else {
          toast.error(json?.message || "Update failed");
        }
      } else {
        const res = await fetch(`${API_BASE}/car/add-admin-car`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { authorization: token } : {}),
          },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => ({}));
        if ((json?.code ?? (res.ok ? 200 : res.status)) === 200) {
          toast.success(json.message || "Car added");
          await fetchCars();
        } else {
          toast.error(json?.message || "Add failed");
        }
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id: number) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(`${API_BASE}/car/delete-admin-car/${id}`, {
        method: "DELETE",
        headers: { ...(token ? { authorization: token } : {}) },
      });
      const json = await res.json().catch(() => ({}));
      if ((json?.code ?? (res.ok ? 200 : res.status)) === 200) {
        toast.success(json.message || "Deleted");
        await fetchCars();
      } else {
        toast.error(json?.message || "Delete failed");
      }
    } catch (e) {
      toast.error("Network error");
    }
  };

  const filteredCars = useMemo(
    () =>
      carsData.filter((car) => {
        let ok = true;

        if (filterYear !== "all") {
          const yId = Number(filterYear);
          ok = ok && (car.modelYearId === yId || car.modelyear?.id === yId);
        }

        if (filterCompany !== "all") {
          const cId = Number(filterCompany);
          ok = ok && (car.carCompanyId === cId || car.carcompany?.id === cId);
        }

        if (filterModel !== "all") {
          const mId = Number(filterModel);
          ok = ok && (car.modelId === mId || car.model?.id === mId);
        }

        if (filterSubModel !== "all") {
          const smId = Number(filterSubModel);
          ok = ok && (car.subModelId === smId || car.submodel?.id === smId);
        }

        return ok;
      }),
    [carsData, filterYear, filterCompany, filterModel, filterSubModel]
  );

  const clearFilters = useCallback(() => {
    setFilterYear("all");
    setFilterCompany("all");
    setFilterModel("all");
    setFilterSubModel("all");
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Car Management
          </h1>
        </div>
        <div>
          <Button
            onClick={() => {
              setSelectedCar(null);
              setAddCarOpen(true);
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm md:text-base"
          >
            <Plus size={18} />
            Add New Car
          </Button>
        </div>
      </div>

      <div>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 items-start md:items-center justify-between w-full">
              <div className="flex flex-wrap gap-2 md:gap-4 items-center">
                <Select
                  value={filterYear}
                  onValueChange={(val) => {
                    setFilterYear(val);
                    if (val === "all") {
                      setFilterModel("all");
                      setFilterSubModel("all");
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="Year: All" />
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

                <Select
                  value={filterCompany}
                  onValueChange={(val) => {
                    setFilterCompany(val);
                    if (val === "all") {
                      setFilterModel("all");
                      setFilterSubModel("all");
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-40 text-sm">
                    <SelectValue placeholder="Company: All" />
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

                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-sm"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent>
            <div className="overflow-hidden -mx-4 md:mx-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase">
                      Image
                    </th>
                    <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs font-semibold text-muted-foreground uppercase hidden sm:table-cell">
                      Model & Sub model
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
                  {(loading
                    ? new Array(Math.min(6, limit)).fill(null)
                    : filteredCars
                  ).map((car: any, idx: number) => {
                    if (!car) {
                      return (
                        <tr
                          key={`skeleton-${idx}`}
                          className="border-b border-border"
                        >
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-muted animate-pulse" />
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 hidden sm:table-cell">
                            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden md:table-cell text-sm">
                            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden lg:table-cell text-sm">
                            <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                          </td>
                          <td className="py-3 md:py-4 px-3 md:px-4">
                            <div className="h-6 bg-muted rounded w-24 animate-pulse" />
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr
                        key={car?.id ?? idx}
                        className="border-b border-border hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <img
                            src={
                              car?.carImage
                                ? `${process.env.NEXT_PUBLIC_UPLOAD_PATH}${car?.carImage}`
                                : "/placeholder.svg"
                            }
                            alt={car?.model?.name ?? "car"}
                            className="h-10 w-10 md:h-12 md:w-12 rounded-lg object-cover"
                          />
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 hidden sm:table-cell">
                          <div className="font-medium text-foreground text-sm">
                            {car?.model?.name}{" "}
                            {car?.submodel?.name
                              ? `/ ${car.submodel.name}`
                              : ""}
                          </div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden md:table-cell text-sm">
                          {car?.carcompany?.name}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 text-muted-foreground hidden lg:table-cell text-sm">
                          {car?.modelyear?.year}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="flex gap-2 md:gap-3">
                            <button
                              onClick={() => {
                                setViewModal({ open: true, car: car });
                              }}
                              className="text-blue-600 hover:cursor-pointer hover:text-blue-700"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCar(car);
                                setAddCarOpen(true);
                              }}
                              className="text-blue-600 hover:cursor-pointer hover:text-blue-700"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({ open: true, car })
                              }
                              className="text-red-600 hover:cursor-pointer hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
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
                  : carsData.length || 0}{" "}
                of {pagination?.total ?? carsData.length ?? 0} results
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {addCarOpen && (
        <AddCarModal
          isOpen={addCarOpen}
          onClose={() => {
            setAddCarOpen(false);
            setSelectedCar(null);
          }}
          onSave={handleSave}
          companies={companies}
          years={years}
          initial={selectedCar}
        />
      )}

      {viewModal.open && (
        <CarViewModal
          isOpen={viewModal.open}
          onClose={() => setViewModal({ open: false, car: null })}
          car={viewModal.car}
        />
      )}
      {deleteModal.open && (
        <DeleteConfirmationModal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, car: null })}
          onConfirm={async () => {
            try {
              setDeleteModal((d) => ({ ...d, isLoading: true }));
              await handleDelete(deleteModal.car.id);
            } finally {
              setDeleteModal({ open: false, car: null });
            }
          }}
          title="Confirm Deletion"
          description="You are about to permanently delete this car. This action cannot be undone."
          itemName={deleteModal.car?.model?.name}
          isLoading={deleteModal.isLoading}
        />
      )}
    </div>
  );
}
