"use client";

import { motion, Variants } from "framer-motion";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFileUrl, getDownloadUrl } from "@/lib/file-utils";

interface CarViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
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

export default function CarViewModal({
  isOpen,
  onClose,
  car,
}: CarViewModalProps) {
  if (!isOpen || !car) return null;

  const handleDownload = (fileUrl: string | undefined, fileName: string) => {
    if (!fileUrl) return;

    const url = getDownloadUrl(fileUrl);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">🚗</span>
            </div>
            <h2 className="text-xl font-bold">Car Details</h2>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-100 rounded-lg h-80 flex items-center justify-center overflow-hidden"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_UPLOAD_PATH}${car.carImage}`}
                alt={car.model?.name || "Car"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Car Model Name
                </p>
                <p className="font-bold text-lg">{car.model?.name || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Car Sub model name
                </p>
                <p className="font-bold text-lg">
                  {car.submodel?.name || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Company</p>
                  <p className="font-bold">{car.carcompany?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Year</p>
                  <p className="font-bold">{car.modelyear?.year || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Transmission
                  </p>
                  <p className="font-bold">
                    {car.submodel?.transmission || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Fuel Type
                  </p>
                  <p className="font-bold">{car.submodel?.fuelType || "N/A"}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Engine</p>
                <p className="font-bold">{car.submodel?.engine || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Horse Power
                  </p>
                  <p className="font-bold">
                    {car.submodel?.horsePower || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Torque</p>
                  <p className="font-bold">{car.submodel?.torque || "N/A"}</p>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="space-y-2 pt-4">
                {car.carManualyFile && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() =>
                        handleDownload(
                          car.carManualyFile,
                          `${car.model?.name || "car"}-manual.pdf`
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-lg font-semibold"
                    >
                      <Download size={18} />
                      Download Car Manual
                    </Button>
                  </motion.div>
                )}
                {car.car3dModel && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() =>
                        handleDownload(
                          car.car3dModel,
                          `${car.model?.name || "car"}-3d-model${
                            car.car3dModel.endsWith(".usdz") ? ".usdz" : ".glb"
                          }`
                        )
                      }
                      variant="outline"
                      className="w-full gap-2 rounded-lg font-semibold"
                    >
                      <span>📦</span>
                      Download 3D Model
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
