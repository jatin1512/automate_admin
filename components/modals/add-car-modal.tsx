"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { X, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { sortYearsAscending, sortCompaniesByName } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payload: any, id?: number) => Promise<void> | void;
  companies?: Array<any>;
  years?: Array<any>;
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

export default function AddCarModal({
  isOpen,
  onClose,
  onSave,
  companies = [],
  years = [],
  initial,
}: AddCarModalProps) {
  if (!isOpen) return null;

  const [modelYearId, setModelYearId] = useState<string | number>(
    initial?.modelYearId ?? ""
  );
  const [carCompanyId, setCarCompanyId] = useState<string | number>(
    initial?.carCompanyId ?? ""
  );
  const [modelId, setModelId] = useState<string | number>(
    initial?.modelId ?? ""
  );
  const [modelSearch, setModelSearch] = useState<string>("");
  const [subModelId, setSubModelId] = useState<string | number>(
    initial?.subModelId ?? ""
  );

  const [carImage, setCarImage] = useState(initial?.carImage ?? "");
  const [car3dModel, setCar3dModel] = useState(initial?.car3dModel ?? "");
  const [carManualyFile, setCarManualyFile] = useState(
    initial?.carManualyFile ?? ""
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [manualFile, setManualFile] = useState<File | null>(null);

  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [engine, setEngine] = useState("");
  const [horsePower, setHorsePower] = useState("");
  const [torque, setTorque] = useState("");
  const [mileage, setMileage] = useState("");

  const [models, setModels] = useState<Array<any>>([]);
  const [subModels, setSubModels] = useState<Array<any>>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingSubModels, setLoadingSubModels] = useState(false);

  const [specsAutoFilled, setSpecsAutoFilled] = useState(false);

  useEffect(() => {
    const fetchAllModels = async () => {
      setLoadingModels(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${API_BASE}/car/all-car-model`, {
          headers: {
            ...(token ? { authorization: token } : {}),
          },
        });
        const json = await res.json();
        if ((json?.code ?? (res.ok ? 200 : res.status)) === 200) {
          setModels(Array.isArray(json.data) ? json.data : []);
        } else {
          setModels([]);
        }
      } catch (e) {
        console.error("Error fetching models:", e);
        setModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchAllModels();
  }, []);

  useEffect(() => {
    if (modelId && models.length > 0) {
      const selectedModel = models.find((m: any) => m.id === Number(modelId));
      if (selectedModel) {
        if (selectedModel.modelYearId && !modelYearId) {
          setModelYearId(selectedModel.modelYearId);
        }
        if (selectedModel.carCompanyId && !carCompanyId) {
          setCarCompanyId(selectedModel.carCompanyId);
        }
      }
    }
  }, [modelId, models]);

  useEffect(() => {
    const fetchSubModels = async () => {
      if (!modelId) {
        setSubModels([]);
        return;
      }

      setLoadingSubModels(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(
          `${API_BASE}/car/car-sub-model-with-modelId/${modelId}`,
          {
            headers: {
              ...(token ? { authorization: token } : {}),
            },
          }
        );
        const json = await res.json();
        if ((json?.code ?? (res.ok ? 200 : res.status)) === 200) {
          setSubModels(Array.isArray(json.data) ? json.data : []);
        } else {
          setSubModels([]);
        }
      } catch (e) {
        console.error("Error fetching submodels:", e);
        setSubModels([]);
      } finally {
        setLoadingSubModels(false);
      }
    };

    fetchSubModels();
  }, [modelId]);

  useEffect(() => {
    const fetchSubModelDetails = async () => {
      if (!subModelId) {
        setTransmission("");
        setFuelType("");
        setEngine("");
        setHorsePower("");
        setTorque("");
        setMileage("");
        setSpecsAutoFilled(false);
        return;
      }

      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${API_BASE}/car/car-sub-model/${subModelId}`, {
          headers: {
            ...(token ? { authorization: token } : {}),
          },
        });
        const json = await res.json();
        if ((json?.code ?? (res.ok ? 200 : res.status)) === 200 && json.data) {
          const specs = json.data;
          setTransmission(specs.transmission || "");
          setFuelType(specs.fuelType || "");
          setEngine(specs.engine || "");
          setHorsePower(specs.horsePower || "");
          setTorque(specs.torque || "");
          setMileage(specs.mileage || "");
          setSpecsAutoFilled(true);
        }
      } catch (e) {
        console.error("Error fetching submodel details:", e);
      }
    };

    fetchSubModelDetails();
  }, [subModelId]);

  const uploadSingleFile = async (file: File): Promise<string | null> => {
    if (!file) {
      toast.error("No file provided");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    console.log(
      "Uploading file:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type
    );

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const headers: HeadersInit = {};
      if (token) {
        headers.authorization = token;
      }

      const res = await fetch(`${API_BASE}/user/profile-image`, {
        method: "POST",
        headers,
        body: formData,
      });

      const json = await res.json();
      if (
        (json?.code ?? (res.ok ? 200 : res.status)) === 200 &&
        json.data?.name
      ) {
        return json.data.name;
      } else {
        toast.error(json?.message || "Upload failed");
        return null;
      }
    } catch (e) {
      console.error("Upload error:", e);
      toast.error("Network error during upload");
      return null;
    }
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
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">
            {initial?.id ? "Edit Car Details" : "Add New Car"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Car Model
              </label>
              <Select
                value={String(modelId ?? "")}
                onValueChange={(v) => setModelId(v === "" ? "" : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingModels ? "Loading..." : "Select Car Model"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <div className="sticky top-0 z-10 bg-white p-2 border-b">
                    <Input
                      placeholder="Search model..."
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                    />
                  </div>
                  {(() => {
                    const filtered = modelSearch
                      ? models.filter((m: any) =>
                          (m.name || "")
                            .toLowerCase()
                            .includes(modelSearch.toLowerCase())
                        )
                      : models;
                    if (filtered.length === 0) {
                      return (
                        <div className="p-2 text-xs text-muted-foreground">
                          No matching model found.
                        </div>
                      );
                    }
                    return filtered.map((m: any) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Car Sub Model
              </label>
              <Select
                value={String(subModelId ?? "")}
                onValueChange={(v) => setSubModelId(v === "" ? "" : Number(v))}
                disabled={!modelId || loadingSubModels}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingSubModels ? "Loading..." : "Select Car Sub Model"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {subModels.map((sm: any) => (
                    <SelectItem key={sm.id} value={String(sm.id)}>
                      {sm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Year</label>
              <Select
                value={String(modelYearId ?? "")}
                onValueChange={(v) => setModelYearId(v === "" ? "" : Number(v))}
                disabled={!!modelId}
              >
                <SelectTrigger
                  className={modelId ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {sortYearsAscending(years).map((y: any) => (
                    <SelectItem
                      key={y.id ?? y.year}
                      value={String(y.id ?? y.year)}
                    >
                      {y.year ?? y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Company</label>
              <Select
                value={String(carCompanyId ?? "")}
                onValueChange={(v) =>
                  setCarCompanyId(v === "" ? "" : Number(v))
                }
                disabled={!!modelId}
              >
                <SelectTrigger
                  className={modelId ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {sortCompaniesByName(companies).map((c: any) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Car Image
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent/50 transition-colors relative">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imageFile ? (
                    <ImageIcon
                      size={24}
                      className="mx-auto mb-2 text-blue-600"
                    />
                  ) : carImage ? (
                    <ImageIcon
                      size={24}
                      className="mx-auto mb-2 text-green-600"
                    />
                  ) : (
                    <Upload
                      size={24}
                      className="mx-auto mb-2 text-muted-foreground"
                    />
                  )}
                  <p className="text-xs text-muted-foreground truncate">
                    {imageFile
                      ? imageFile.name
                      : carImage
                      ? carImage.split("/").pop()
                      : "Click to upload"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Car Manual (PDF)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent/50 transition-colors relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setManualFile(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {manualFile ? (
                    <FileText
                      size={24}
                      className="mx-auto mb-2 text-blue-600"
                    />
                  ) : carManualyFile ? (
                    <FileText
                      size={24}
                      className="mx-auto mb-2 text-green-600"
                    />
                  ) : (
                    <Upload
                      size={24}
                      className="mx-auto mb-2 text-muted-foreground"
                    />
                  )}
                  <p className="text-xs text-muted-foreground truncate">
                    {manualFile
                      ? manualFile.name
                      : carManualyFile
                      ? carManualyFile.split("/").pop()
                      : "Click to upload"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Car 3D Model
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:bg-accent/50 transition-colors relative">
                  <input
                    type="file"
                    accept=".glb,.usdz"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setModelFile(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {modelFile ? (
                    <FileText
                      size={24}
                      className="mx-auto mb-2 text-blue-600"
                    />
                  ) : car3dModel ? (
                    <FileText
                      size={24}
                      className="mx-auto mb-2 text-green-600"
                    />
                  ) : (
                    <Upload
                      size={24}
                      className="mx-auto mb-2 text-muted-foreground"
                    />
                  )}
                  <p className="text-xs text-muted-foreground truncate">
                    {modelFile
                      ? modelFile.name
                      : car3dModel
                      ? car3dModel.split("/").pop()
                      : "Click to upload"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Transmission
              </label>
              <Input
                placeholder="Automatic"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className={specsAutoFilled ? "bg-green-50" : ""}
                readOnly={specsAutoFilled}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Fuel Type
              </label>
              <Input
                placeholder="Gasoline"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className={specsAutoFilled ? "bg-green-50" : ""}
                readOnly={specsAutoFilled}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Engine</label>
              <Input
                placeholder="2.5L 4-Cylinder"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                className={specsAutoFilled ? "bg-green-50" : ""}
                readOnly={specsAutoFilled}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Horse Power
              </label>
              <Input
                placeholder="203 hp"
                value={horsePower}
                onChange={(e) => setHorsePower(e.target.value)}
                className={specsAutoFilled ? "bg-green-50" : ""}
                readOnly={specsAutoFilled}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Torque</label>
              <Input
                placeholder="184 lb-ft"
                value={torque}
                onChange={(e) => setTorque(e.target.value)}
                className={specsAutoFilled ? "bg-green-50" : ""}
                readOnly={specsAutoFilled}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Mileage</label>
              <Input
                placeholder="25 MPG"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className={specsAutoFilled ? "bg-green-50" : ""}
                readOnly={specsAutoFilled}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-6 border-t justify-end bg-gray-50">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={async () => {
                if (!onSave) return onClose();
                setIsSaving(true);
                try {
                  let uploadedCarImage = carImage;
                  let uploadedCar3dModel = car3dModel;
                  let uploadedCarManual = carManualyFile;

                  if (imageFile) {
                    const path = await uploadSingleFile(imageFile);
                    if (path) {
                      uploadedCarImage = path;
                      toast.success("Image uploaded");
                    } else {
                      toast.error("Failed to upload image");
                      setIsSaving(false);
                      return;
                    }
                  }

                  if (modelFile) {
                    const path = await uploadSingleFile(modelFile);
                    if (path) {
                      uploadedCar3dModel = path;
                      toast.success("3D Model uploaded");
                    } else {
                      toast.error("Failed to upload 3D model");
                      setIsSaving(false);
                      return;
                    }
                  }

                  if (manualFile) {
                    const path = await uploadSingleFile(manualFile);
                    if (path) {
                      uploadedCarManual = path;
                      toast.success("Manual uploaded");
                    } else {
                      toast.error("Failed to upload manual");
                      setIsSaving(false);
                      return;
                    }
                  }

                  await onSave(
                    {
                      modelYearId,
                      carCompanyId,
                      modelId,
                      subModelId,
                      carImage: uploadedCarImage,
                      car3dModel: uploadedCar3dModel,
                      carManualyFile: uploadedCarManual,
                    },
                    initial?.id
                  );
                } finally {
                  setIsSaving(false);
                }
                onClose();
              }}
              disabled={isSaving || !modelYearId || !carCompanyId || !modelId}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
