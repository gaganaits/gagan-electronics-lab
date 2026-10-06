"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  UploadCloud,
  FileCode2,
  FileText,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Sparkles,
} from "lucide-react";
import { initialProducts } from "@/data/products";
import { materialsList } from "@/data/materials";

interface SelectedFile {
  file: File;
  id: string;
  name: string;
  sizeFormatted: string;
  type: string;
  extension: string;
  error?: string;
}

const ALLOWED_EXTS = ["stl", "pdf", "jpg", "jpeg", "png", "webp"];

function RequestQuoteContent() {
  const searchParams = useSearchParams();
  const initialProductParam = searchParams.get("product") || "";
  const initialServiceParam = searchParams.get("service") || "";

  // Step state: 1 = Project, 2 = Files, 3 = Contact, 4 = Review, 5 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form state
  const [serviceType, setServiceType] = useState<string>(
    initialServiceParam || initialProducts[0].name
  );
  const [productId, setProductId] = useState<string>(initialProductParam);
  const [quantity, setQuantity] = useState<number>(1);
  const [material, setMaterial] = useState<string>("PLA+");
  const [color, setColor] = useState<string>("Black");
  const [quality, setQuality] = useState<string>("Standard (0.2 mm / 200 µm)");
  const [infill, setInfill] = useState<string>("20% Gyroid (Standard Rigid)");
  const [requiredDate, setRequiredDate] = useState<string>("");
  const [requirements, setRequirements] = useState<string>("");

  // Files & Drive
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [googleDriveUrl, setGoogleDriveUrl] = useState<string>("");
  const [driveUrlError, setDriveUrlError] = useState<string>("");

  // Contact
  const [customerName, setCustomerName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [confirmationReference, setConfirmationReference] = useState<string>("");
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL pre-selection
  useEffect(() => {
    if (initialProductParam) {
      const match = initialProducts.find((p) => p.id === initialProductParam);
      if (match) {
        setProductId(match.id);
        setServiceType(match.name);
      }
    }
  }, [initialProductParam]);

  // File handling
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleFilesAdded = (rawFiles: FileList | null) => {
    if (!rawFiles) return;

    if (files.length + rawFiles.length > 10) {
      alert("Maximum 10 files per quote. You can provide a Google Drive link for larger batches.");
      return;
    }

    const newItems: SelectedFile[] = [];

    Array.from(rawFiles).forEach((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      let error: string | undefined;

      if (!ALLOWED_EXTS.includes(ext)) {
        error = `Unsupported format (.${ext}). Only STL, PDF, JPG, PNG, and WEBP files are allowed.`;
      } else if (ext === "stl" && file.size > 50 * 1024 * 1024) {
        error = "STL file exceeds 50 MB limit.";
      } else if (ext === "pdf" && file.size > 20 * 1024 * 1024) {
        error = "PDF file exceeds 20 MB limit.";
      } else if (file.size > 10 * 1024 * 1024 && ext !== "stl" && ext !== "pdf") {
        error = "Image file exceeds 10 MB limit.";
      }

      newItems.push({
        file,
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        sizeFormatted: formatBytes(file.size),
        type: file.type,
        extension: ext,
        error,
      });
    });

    setFiles((prev) => [...prev, ...newItems]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDriveUrlChange = (val: string) => {
    setGoogleDriveUrl(val);
    if (!val.trim()) {
      setDriveUrlError("");
      return;
    }

    try {
      const parsed = new URL(val);
      const host = parsed.hostname.toLowerCase();
      if (host !== "drive.google.com" && host !== "docs.google.com") {
        setDriveUrlError("Link must be hosted on drive.google.com or docs.google.com");
      } else {
        setDriveUrlError("");
      }
    } catch {
      setDriveUrlError("Please enter a valid URL (e.g. https://drive.google.com/...)");
    }
  };

  // Step validations
  const validateStep1 = () => {
    return quantity >= 1 && material.trim().length > 0;
  };

  const validateStep2 = () => {
    const hasValidFiles = files.some((f) => !f.error);
    const hasDriveUrl = Boolean(googleDriveUrl.trim() && !driveUrlError);
    const hasRequirementsNote = requirements.trim().length > 10;
    return hasValidFiles || hasDriveUrl || hasRequirementsNote;
  };

  const validateStep3 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      customerName.trim().length >= 2 &&
      emailRegex.test(email.trim()) &&
      phone.trim().length >= 7 &&
      location.trim().length >= 2
    );
  };

  // Submit quote to server
  const handleSubmitQuote = async () => {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("customerName", customerName.trim());
      formData.append("companyName", companyName.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());
      formData.append("location", location.trim());
      formData.append("serviceType", serviceType);
      formData.append("productId", productId);
      formData.append("quantity", quantity.toString());
      formData.append("material", material);
      formData.append("color", color);
      formData.append("quality", quality);
      formData.append("infill", infill);
      formData.append("requiredDate", requiredDate);
      formData.append("requirements", requirements.trim());
      formData.append("googleDriveUrl", googleDriveUrl.trim());

      // Append valid files
      files
        .filter((f) => !f.error)
        .forEach((f) => {
          formData.append("files", f.file);
        });

      try {
        const response = await fetch("/api/quotes", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setConfirmationReference(data.reference);
          setCurrentStep(5);
          return;
        }
      } catch (fetchErr) {
        // Fallback for static GitHub Pages demo mode
      }

      // If backend API is unavailable (static GitHub Pages demo mode), generate client reference and save locally
      const demoRef = `QT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      try {
        const localQuote = {
          id: `demo-${Date.now()}`,
          publicReference: demoRef,
          customerName: customerName.trim(),
          companyName: companyName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          location: location.trim(),
          serviceType,
          productId,
          quantity,
          material,
          color,
          quality,
          infill,
          requiredDate,
          requirements: requirements.trim(),
          googleDriveUrl: googleDriveUrl.trim(),
          files: files.map((f, i) => ({
            id: `demo-f-${i}`,
            originalFilename: f.file.name,
            sizeBytes: f.file.size,
            extension: f.file.name.split(".").pop()?.toLowerCase() || "stl",
          })),
          status: "NEW",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const existing = localStorage.getItem("gel_quotes");
        const list = existing ? JSON.parse(existing) : [];
        list.unshift(localQuote);
        localStorage.setItem("gel_quotes", JSON.stringify(list));
      } catch {
        // Ignore localStorage issues
      }

      setConfirmationReference(demoRef);
      setCurrentStep(5); // Move to success step
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceToClipboard = () => {
    if (confirmationReference) {
      navigator.clipboard.writeText(confirmationReference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  // Confirmation Step (Step 5)
  if (currentStep === 5) {
    return (
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-stone-200/90 rounded-card-xl p-8 sm:p-12 shadow-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="font-handwriting text-2xl text-stone-600 select-none">
              request received
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
              Your quote request is in.
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto">
              We have received your CAD files and project specifications. Our lab engineers will review your geometry and email you an itemized quotation.
            </p>
          </div>

          {/* Reference badge */}
          <div className="bg-[#FAF8F3] border border-stone-200 rounded-card-md p-6 max-w-md mx-auto space-y-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-stone-500">
              Your Reference Number
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-stone-900 tracking-tight">
                {confirmationReference}
              </span>
              <button
                type="button"
                onClick={copyReferenceToClipboard}
                className="p-2 rounded-full hover:bg-stone-200 text-stone-600 transition-colors"
                title="Copy reference number"
              >
                {copiedRef ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-stone-500 pt-1">
              Please save this reference for any correspondence regarding this order.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors w-full sm:w-auto"
            >
              Return to home
            </Link>
            <button
              type="button"
              onClick={() => {
                setConfirmationReference("");
                setFiles([]);
                setRequirements("");
                setCurrentStep(1);
              }}
              className="px-6 py-3 rounded-full text-sm font-medium bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors w-full sm:w-auto"
            >
              Submit another quote
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
          Quotation Request Flow
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Request a 3D printing quotation.
        </h1>
        <p className="text-sm sm:text-base text-stone-600">
          Upload your files or paste a Google Drive folder. We review geometry, tolerances, and material fitment before quoting.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 w-full z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-stone-900 transition-all duration-300 z-0"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {[
            { num: 1, label: "Project" },
            { num: 2, label: "Files & CAD" },
            { num: 3, label: "Contact" },
            { num: 4, label: "Review" },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep >= s.num
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-white border-2 border-stone-300 text-stone-400"
                }`}
              >
                {currentStep > s.num ? <Check className="w-4 h-4 text-coral-300" /> : s.num}
              </div>
              <span className="text-[11px] font-medium text-stone-600 mt-1.5 hidden sm:block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-stone-200/90 rounded-card-xl p-6 sm:p-10 shadow-soft">
        {/* STEP 1: PROJECT & SPECS */}
        {currentStep === 1 && (
          <div className="space-y-6 sm:space-y-8">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-xl font-bold text-stone-900">
                1. Project & manufacturing parameters
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Select your preferred hardware, material, and batch size.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Service / Printer */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Service / Machine Technology
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                >
                  {initialProducts.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.technology.split("(")[0]})
                    </option>
                  ))}
                  <option value="General Engineering Consultation">
                    Unsure (Advise me on best process)
                  </option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  required
                />
              </div>

              {/* Material Preference */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Material Preference
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                >
                  {materialsList.map((m) => (
                    <option key={m.id} value={m.name.split("(")[0].trim()}>
                      {m.name}
                    </option>
                  ))}
                  <option value="Client Specified / Need Advice">Other (Describe below)</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Color Preference
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                >
                  <option value="Black">Black (Standard Industrial)</option>
                  <option value="White">White</option>
                  <option value="Grey">Mechanical Grey</option>
                  <option value="Clear Translucent">Clear / Translucent</option>
                  <option value="Orange / Signal Blue">Vibrant (Orange / Blue / Red)</option>
                  <option value="Any Available">Any color available (Fastest print)</option>
                </select>
              </div>

              {/* Layer Quality */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Layer Quality Grade
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                >
                  <option value="Standard (0.2 mm / 200 µm)">
                    Standard (0.2 mm / 200 µm) — Recommended
                  </option>
                  <option value="Fine Detail (0.12 mm / 120 µm)">
                    Fine Detail (0.12 mm / 120 µm)
                  </option>
                  <option value="Ultra-Fine MSLA (0.05 mm / 50 µm)">
                    Ultra-Fine MSLA Resin (0.05 mm / 50 µm)
                  </option>
                  <option value="Rapid Draft (0.28 mm / 280 µm)">
                    Rapid Draft (0.28 mm / 280 µm) — Fastest
                  </option>
                </select>
              </div>

              {/* Infill */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Internal Infill Density
                </label>
                <select
                  value={infill}
                  onChange={(e) => setInfill(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                >
                  <option value="20% Gyroid (Standard Rigid)">20% Gyroid (Standard Rigid Prototype)</option>
                  <option value="40% Hexagonal (High Mechanical Load)">40% Infill (Load Bearing)</option>
                  <option value="100% Solid (Max Strength)">100% Solid (Maximum Impact Strength)</option>
                  <option value="15% Light (Aesthetic Display Only)">15% Light (Visual Model)</option>
                </select>
              </div>
            </div>

            {/* Additional Project Requirements */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                Additional Requirements / Critical Tolerances / Assembly Notes
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Specify critical fit dimensions, threaded brass insert sizes (e.g. 4x M3 inserts required), surface finishing requirements, or target delivery deadline..."
                className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!validateStep1()}
                className="px-6 py-3 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <span>Continue to files</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FILES & GOOGLE DRIVE */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-xl font-bold text-stone-900">
                2. Upload CAD models or drawings
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Upload your files directly or paste a Google Drive folder link.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFilesAdded(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-stone-900 bg-sage-50/50 hover:bg-sage-50 rounded-card-md p-8 sm:p-12 text-center cursor-pointer transition-all space-y-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".stl,.pdf,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => handleFilesAdded(e.target.files)}
              />

              <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto text-stone-700 shadow-sm">
                <UploadCloud className="w-6 h-6 text-stone-700" />
              </div>

              <div>
                <p className="text-sm sm:text-base font-semibold text-stone-900">
                  Drag and drop files here, or <span className="underline text-stone-800">browse files</span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Supported: <span className="font-medium text-stone-700">STL</span> (up to 50 MB) · <span className="font-medium text-stone-700">PDF</span> (up to 20 MB) · <span className="font-medium text-stone-700">Images</span> (up to 10 MB)
                </p>
              </div>
            </div>

            {/* List of uploaded files */}
            {files.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block">
                  Attached files ({files.length} / 10)
                </span>
                <div className="space-y-2">
                  {files.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-card-sm border flex items-center justify-between text-xs sm:text-sm ${
                        item.error
                          ? "bg-red-50 border-red-200 text-red-900"
                          : "bg-[#FAF8F3] border-stone-200 text-stone-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {item.extension === "stl" ? (
                          <FileCode2 className="w-5 h-5 text-stone-700 shrink-0" />
                        ) : item.extension === "pdf" ? (
                          <FileText className="w-5 h-5 text-stone-700 shrink-0" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-stone-700 shrink-0" />
                        )}

                        <div className="overflow-hidden">
                          <p className="font-medium truncate max-w-xs sm:max-w-md">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-stone-500">
                            {item.sizeFormatted} · {item.extension.toUpperCase()}
                          </p>
                          {item.error && (
                            <p className="text-[11px] text-red-600 font-semibold mt-0.5">
                              {item.error}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Drive Option */}
            <div id="google-drive" className="bg-[#FAF8F3] border border-stone-200 rounded-card-md p-6 space-y-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-stone-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  Prefer to share from Google Drive?
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                For large CAD assemblies, ZIP folders, or files over 50 MB, paste a Google Drive link below. Please ensure sharing permission is set to <em>"Anyone with the link can view"</em>.
              </p>

              <div>
                <input
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={googleDriveUrl}
                  onChange={(e) => handleDriveUrlChange(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-card-sm border text-sm bg-white focus:border-stone-900 ${
                    driveUrlError ? "border-red-400 text-red-900" : "border-stone-200 text-stone-800"
                  }`}
                />
                {driveUrlError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{driveUrlError}</p>
                )}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={!validateStep2()}
                className="px-6 py-3 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <span>Continue to contact details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONTACT & LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-6 sm:space-y-8">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-xl font-bold text-stone-900">
                3. Contact information & delivery location
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Where should we send your quotation and deliver the completed components?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  required
                />
              </div>

              {/* Company / Institution */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Robotics Labs"
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajesh@company.com"
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  required
                />
              </div>

              {/* City / Location */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
                  City / Location / Shipping Pincode *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Chandigarh, Punjab 160017 / Bangalore / Delhi NCR"
                  className="w-full px-4 py-2.5 rounded-card-sm border border-stone-200 text-sm text-stone-800 bg-[#FAF8F3] focus:bg-white focus:border-stone-900"
                  required
                />
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                disabled={!validateStep3()}
                className="px-6 py-3 rounded-full text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <span>Review order details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="border-b border-stone-100 pb-4">
              <h2 className="text-xl font-bold text-stone-900">
                4. Review your quotation request
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Please verify your details before submitting to our engineering queue.
              </p>
            </div>

            {/* Summary Grid */}
            <div className="bg-[#FAF8F3] border border-stone-200/90 rounded-card-md p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-stone-200/70">
                <div>
                  <span className="text-stone-500 block text-xs">Customer Name</span>
                  <span className="font-semibold text-stone-900">{customerName}</span>
                  {companyName && (
                    <span className="text-xs text-stone-600 block">{companyName}</span>
                  )}
                </div>
                <div>
                  <span className="text-stone-500 block text-xs">Contact & Location</span>
                  <span className="font-semibold text-stone-900">{email}</span>
                  <span className="text-xs text-stone-600 block">{phone} · {location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-stone-200/70">
                <div>
                  <span className="text-stone-500 block text-xs">Technology</span>
                  <span className="font-semibold text-stone-900">{serviceType}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-xs">Quantity</span>
                  <span className="font-semibold text-stone-900 font-mono">{quantity} unit(s)</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-xs">Material & Color</span>
                  <span className="font-semibold text-stone-900">{material} ({color})</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-xs">Layer & Infill</span>
                  <span className="font-semibold text-stone-900">{quality.split("—")[0]}</span>
                </div>
              </div>

              {/* Files summary */}
              <div>
                <span className="text-stone-500 block text-xs mb-1">Attached Files</span>
                {files.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {files.filter((f) => !f.error).map((f) => (
                      <span
                        key={f.id}
                        className="px-2.5 py-1 rounded bg-white border border-stone-200 font-mono text-xs text-stone-700"
                      >
                        {f.name} ({f.sizeFormatted})
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-stone-500 italic">No files attached</span>
                )}

                {googleDriveUrl && (
                  <div className="mt-2 text-xs text-stone-700">
                    <span className="font-medium">Google Drive link: </span>
                    <span className="font-mono text-stone-600 break-all">{googleDriveUrl}</span>
                  </div>
                )}
              </div>

              {requirements && (
                <div className="pt-2 border-t border-stone-200/70">
                  <span className="text-stone-500 block text-xs mb-1">Project Notes</span>
                  <p className="text-xs text-stone-800 leading-relaxed italic bg-white p-3 rounded border border-stone-200">
                    "{requirements}"
                  </p>
                </div>
              )}
            </div>

            {/* Error notice if submission failed */}
            {submitError && (
              <div className="p-4 rounded-card-sm bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* NDA / Terms Agreement */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
              />
              <label htmlFor="agree" className="text-xs text-stone-600 leading-relaxed">
                I understand that Gagan Electronics Lab handles all CAD files confidentially under strict proprietary terms. I agree to the{" "}
                <Link href="/terms-and-conditions" target="_blank" className="underline text-stone-900">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" target="_blank" className="underline text-stone-900">
                  Privacy Policy
                </Link>
                .
              </label>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitQuote}
                disabled={isSubmitting || !agreeTerms}
                className="px-8 py-3.5 rounded-full text-sm font-semibold bg-coral-300 hover:bg-coral-400 text-stone-900 shadow-coral hover:shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                    <span>Submitting quotation request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit quotation request</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust and privacy footer notice */}
      <div className="mt-8 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
        <Shield className="w-4 h-4 text-emerald-700" />
        <span>
          Files stored in private encrypted storage · Strictly confidential engineering review
        </span>
      </div>
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <Suspense
      fallback={
        <div className="pt-40 pb-24 text-center text-xs text-stone-500">
          Loading quotation flow...
        </div>
      }
    >
      <RequestQuoteContent />
    </Suspense>
  );
}
