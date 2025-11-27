"use client";

import { motion, Variants } from "framer-motion";
import { X } from "lucide-react";

interface CarSubModelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  subModel: any;
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

export default function CarSubModelDetailsModal({
  isOpen,
  onClose,
  subModel,
}: CarSubModelDetailsModalProps) {
  if (!isOpen || !subModel) return null;

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">🏎️</span>
            </div>
            <h2 className="text-xl font-bold">Car Sub-Model Details</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </motion.button>
        </div>
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Sub Model Name
              </p>
              <p className="font-bold text-lg">{subModel.name || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Car Model</p>
              <p className="font-bold text-lg">
                {subModel.model?.name || "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Company</p>
                <p className="font-bold">
                  {subModel.carcompany?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Year</p>
                <p className="font-bold">{subModel.modelyear?.year || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Transmission
                </p>
                <p className="font-bold">{subModel.transmission || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Fuel Type</p>
                <p className="font-bold">{subModel.fuelType || "N/A"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Engine</p>
              <p className="font-bold">{subModel.engine || "N/A"}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Horse Power
                </p>
                <p className="font-bold">{subModel.horsePower || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Torque</p>
                <p className="font-bold">{subModel.torque || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mileage</p>
                <p className="font-bold">{subModel.mileage || "N/A"}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
