"use client";

import { motion, Variants } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isLoading?: boolean;
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const iconVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.1 },
  },
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="absolute top-4 right-4 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </motion.button>
        </div>

        <div className="flex flex-col items-center justify-center pt-12 pb-8 px-6">
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-6"
          >
            <AlertTriangle size={48} className="text-red-600" />
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground text-center mb-3">
            {title}
          </h2>

          <p className="text-center text-muted-foreground leading-relaxed mb-8">
            {description}
            {itemName && <span className="font-semibold"> '{itemName}'</span>}
          </p>

          <div className="flex gap-3 w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full rounded-lg font-semibold"
                disabled={isLoading}
              >
                No, Cancel
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={onConfirm}
                className="w-full rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
