"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  sortYearsAscending,
  sortCompaniesByName,
} from "@/lib/utils";

interface Company {
  id: number;
  name: string;
}
interface Year {
  id: number;
  year: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    payload: { name: string; modelYearId: number; carCompanyId: number },
    id?: number
  ) => Promise<void>;
  companies: Company[];
  years: Year[];
  initial?: {
    id?: number;
    name?: string;
    modelYearId?: number;
    carCompanyId?: number;
  } | null;
}

export default function AddEditCarModelModal({
  isOpen,
  onClose,
  onSave,
  companies,
  years,
  initial,
}: Props) {
  const [name, setName] = useState("");
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [yearId, setYearId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "");
    setCompanyId(initial?.carCompanyId ?? null);
    setYearId(initial?.modelYearId ?? null);
  }, [initial]);

  if (!isOpen) return null;

  async function handleSave() {
    if (!name.trim() || !companyId || !yearId) return;
    setSaving(true);
    try {
      await onSave(
        { name: name.trim(), modelYearId: yearId, carCompanyId: companyId },
        initial?.id
      );
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {initial?.id ? "Edit Car Model" : "Add New Car Model"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Model Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Toyota Fortuner"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Company</label>
            <Select
              value={companyId ? String(companyId) : undefined}
              onValueChange={(v) => setCompanyId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company" />
              </SelectTrigger>
              <SelectContent>
                {sortCompaniesByName(companies).map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Year</label>
            <Select
              value={yearId ? String(yearId) : undefined}
              onValueChange={(v) => setYearId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {sortYearsAscending(years).map((y) => (
                  <SelectItem key={y.id} value={String(y.id)}>
                    {y.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t justify-end bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
