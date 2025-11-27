"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
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
import toast from "react-hot-toast";

interface AddCarSubModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: any, id?: number) => Promise<void> | void;
  companies?: Array<any>;
  years?: Array<any>;
  models?: Array<any>;
  initial?: any;
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function AddCarSubModelModal({
  isOpen,
  onClose,
  onSave,
  companies = [],
  years = [],
  models = [],
  initial,
}: AddCarSubModelModalProps) {
  if (!isOpen) return null;

  const [modelId, setModelId] = useState<string | number>(
    initial?.modelId ?? ""
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [transmission, setTransmission] = useState(initial?.transmission ?? "");
  const [fuelType, setFuelType] = useState(initial?.fuelType ?? "");
  const [engine, setEngine] = useState(initial?.engine ?? "");
  const [horsePower, setHorsePower] = useState(initial?.horsePower ?? "");
  const [torque, setTorque] = useState(initial?.torque ?? "");
  const [mileage, setMileage] = useState(initial?.mileage ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const selectedModel = models.find((m: any) => m.id === Number(modelId));
  const company = companies.find(
    (c: any) => c.id === selectedModel?.carCompanyId
  );
  const year = years.find((y: any) => y.id === selectedModel?.modelYearId);

  useEffect(() => {
    if (initial) {
      setModelId(initial.modelId ?? "");
      setName(initial.name ?? "");
      setTransmission(initial.transmission ?? "");
      setFuelType(initial.fuelType ?? "");
      setEngine(initial.engine ?? "");
      setHorsePower(initial.horsePower ?? "");
      setTorque(initial.torque ?? "");
      setMileage(initial.mileage ?? "");
    }
  }, [initial]);

  return (
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {initial?.id ? "Edit Car Sub-Model" : "Add New Car Sub-Model"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Car Model <span className="text-red-600">*</span>
            </label>
            <Select
              value={String(modelId ?? "")}
              onValueChange={(v) => setModelId(v === "" ? "" : Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Model..." />
              </SelectTrigger>
              <SelectContent>
                {models.map((m: any) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Car Company
              </label>
              <Input
                disabled
                value={company?.name || "Select model first"}
                className="bg-muted"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Year</label>
              <Input
                disabled
                value={year?.year || "Select model first"}
                className="bg-muted"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Sub model Name <span className="text-red-600">*</span>
            </label>
            <Input
              placeholder="e.g., Camry LE"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Transmission
              </label>
              <Input
                placeholder="e.g., Automatic"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Fuel Type
              </label>
              <Input
                placeholder="e.g., Gasoline"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Engine</label>
              <Input
                placeholder="e.g., 2.5L I-4"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Horse Power
              </label>
              <Input
                placeholder="e.g., 203 hp"
                value={horsePower}
                onChange={(e) => setHorsePower(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Torque</label>
              <Input
                placeholder="e.g., 184 lb-ft"
                value={torque}
                onChange={(e) => setTorque(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mileage</label>
              <Input
                placeholder="e.g., 25 MPG"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t justify-end bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={async () => {
                if (!onSave) return onClose();
                if (!modelId || !name) {
                  toast.error("Please fill in required fields");
                  return;
                }

                setIsSaving(true);
                try {
                  await onSave(
                    {
                      modelId: Number(modelId),
                      modelYearId: selectedModel?.modelYearId,
                      carCompanyId: selectedModel?.carCompanyId,
                      name,
                      transmission,
                      fuelType,
                      engine,
                      horsePower,
                      torque,
                      mileage,
                    },
                    initial?.id
                  );
                } finally {
                  setIsSaving(false);
                }
                onClose();
              }}
              disabled={isSaving || !modelId || !name}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
