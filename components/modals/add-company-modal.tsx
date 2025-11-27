"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, id?: number) => Promise<void>;
  initial?: { id?: number; name?: string } | null;
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

export default function AddCompanyModal({
  isOpen,
  onClose,
  onSave,
  initial,
}: AddCompanyModalProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "");
  }, [initial]);

  if (!isOpen) return null;

  async function handleSave() {
    if (!name.trim()) return;
    try {
      setSaving(true);
      await onSave(name.trim(), initial?.id);
      onClose();
    } finally {
      setSaving(false);
    }
  }

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
        className="bg-white rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {initial?.id ? "Edit Company" : "Add New Company"}
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
            <label className="text-sm font-medium mb-2 block">
              Company Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maruti"
            />
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t justify-end bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
