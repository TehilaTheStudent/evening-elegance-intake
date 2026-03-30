import { useState, useCallback } from "react";
import ImageUploadZone from "./ImageUploadZone";
import SubmissionStatus from "./SubmissionStatus";
import SuccessConfirmation from "./SuccessConfirmation";
import heroGown from "@/assets/hero-gown.jpg";

type FormData = {
  description: string;
  size: string;
  color: string;
  price: string;
  city: string;
  notes: string;
};

type SubmitPhase = "idle" | "uploading" | "processing" | "saving" | "done";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "מידה אחרת"];
const CITIES = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "רמת גן",
  "הרצליה",
  "נתניה",
  "אשדוד",
  "אחר",
];

const initialForm: FormData = {
  description: "",
  size: "",
  color: "",
  price: "",
  city: "",
  notes: "",
};

const UploadForm = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<SubmitPhase>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "image", string>>>({});

  const handleImageSelect = useCallback((file: File | null) => {
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
    setErrors((prev) => ({ ...prev, image: undefined }));
  }, []);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.description.trim()) newErrors.description = "שדה חובה";
    if (!form.size) newErrors.size = "שדה חובה";
    if (!form.color.trim()) newErrors.color = "שדה חובה";
    if (!form.price.trim()) newErrors.price = "שדה חובה";
    if (!form.city) newErrors.city = "שדה חובה";
    if (!imageFile) newErrors.image = "יש להעלות תמונה";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const simulateSubmit = async () => {
    if (!validate()) return;

    setPhase("uploading");
    await new Promise((r) => setTimeout(r, 1200));
    setPhase("processing");
    await new Promise((r) => setTimeout(r, 1800));
    setPhase("saving");
    await new Promise((r) => setTimeout(r, 1000));
    setPhase("done");
  };

  const reset = () => {
    setForm(initialForm);
    setImageFile(null);
    setImagePreview(null);
    setPhase("idle");
    setErrors({});
  };

  const isSubmitting = phase !== "idle" && phase !== "done";

  const steps = [
    {
      label: "העלאת תמונה",
      status:
        phase === "uploading"
          ? ("active" as const)
          : ["processing", "saving", "done"].includes(phase)
          ? ("done" as const)
          : ("pending" as const),
    },
    {
      label: "עיבוד AI לתמונת קטלוג",
      status:
        phase === "processing"
          ? ("active" as const)
          : ["saving", "done"].includes(phase)
          ? ("done" as const)
          : ("pending" as const),
    },
    {
      label: "שמירה לבדיקת צוות",
      status:
        phase === "saving"
          ? ("active" as const)
          : phase === "done"
          ? ("done" as const)
          : ("pending" as const),
    },
  ];

  if (phase === "done") {
    return (
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-card rounded-xl shadow-elevated border border-border overflow-hidden">
          <SuccessConfirmation onReset={reset} />
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-ivory/60 px-4 py-3 font-sans text-sm text-charcoal placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold-light transition-all";
  const labelClass = "block text-sm font-sans text-charcoal-light tracking-wide mb-1.5";
  const errorClass = "text-xs text-destructive mt-1 font-sans";

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20" dir="rtl">
      <div className="bg-card rounded-xl shadow-elevated border border-border overflow-hidden">
        <div className="grid md:grid-cols-5">
          {/* Visual side */}
          <div className="hidden md:flex md:col-span-2 relative bg-charcoal items-center justify-center p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/90 to-charcoal" />
            <div className="relative z-10 text-center space-y-6">
              <img
                src={heroGown}
                alt="שמלת ערב לדוגמה"
                className="w-full max-w-[240px] mx-auto rounded-lg shadow-elevated opacity-90"
                width={640}
                height={960}
              />
              <div>
                <p className="font-serif text-lg text-primary-foreground/90">
                  הפריט שלך כאן
                </p>
                <p className="font-sans text-xs text-primary-foreground/50 mt-1">
                  התמונה תעובד אוטומטית לתצוגת קטלוג מקצועית
                </p>
              </div>
            </div>
          </div>

          {/* Form side */}
          <div className="md:col-span-3 p-6 md:p-10 space-y-6">
            <div className="mb-2">
              <h2 className="font-serif text-2xl text-charcoal">העלאת פריט</h2>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                מלאי את הפרטים והפריט ייבדק לפני פרסום
              </p>
            </div>

            <ImageUploadZone
              onImageSelect={handleImageSelect}
              preview={imagePreview}
            />
            {errors.image && <p className={errorClass}>{errors.image}</p>}

            <div className="space-y-5">
              <div>
                <label className={labelClass}>
                  תיאור הפריט <span className="text-gold">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="שמלת ערב שחורה ארוכה, בד שיפון, גב פתוח..."
                  rows={3}
                  className={inputClass + " resize-none"}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className={errorClass}>{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    מידה <span className="text-gold">*</span>
                  </label>
                  <select
                    value={form.size}
                    onChange={(e) => updateField("size", e.target.value)}
                    className={inputClass + " appearance-none"}
                    disabled={isSubmitting}
                  >
                    <option value="">בחרי מידה</option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {errors.size && <p className={errorClass}>{errors.size}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    צבע <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => updateField("color", e.target.value)}
                    placeholder="שחור, זהב, בורדו..."
                    className={inputClass}
                    disabled={isSubmitting}
                  />
                  {errors.color && <p className={errorClass}>{errors.color}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    מחיר השכרה (₪) <span className="text-gold">*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="350"
                    className={inputClass}
                    disabled={isSubmitting}
                    min={0}
                  />
                  {errors.price && <p className={errorClass}>{errors.price}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    עיר <span className="text-gold">*</span>
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={inputClass + " appearance-none"}
                    disabled={isSubmitting}
                  >
                    <option value="">בחרי עיר</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.city && <p className={errorClass}>{errors.city}</p>}
                </div>
              </div>

              <div>
                <label className={labelClass}>הערות נוספות</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="פרטים נוספים, מצב הפריט, היסטוריה..."
                  className={inputClass}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {isSubmitting && (
              <div className="pt-2 animate-fade-in">
                <SubmissionStatus steps={steps} />
              </div>
            )}

            <button
              onClick={simulateSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-lg bg-charcoal text-primary-foreground font-sans text-sm tracking-wide hover:bg-charcoal-light transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-elevated"
            >
              {isSubmitting ? "שולח..." : "שליחת הפריט לבדיקה"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
