import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageUploadZoneProps {
  onImageSelect: (file: File | null) => void;
  preview: string | null;
}

const ImageUploadZone = ({ onImageSelect, preview }: ImageUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageSelect(file);
  };

  const removeImage = () => {
    onImageSelect(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-sans text-charcoal-light tracking-wide">
        תמונת הפריט <span className="text-gold">*</span>
      </label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden shadow-soft border border-gold-light/30 bg-ivory">
          <img
            src={preview}
            alt="תצוגה מקדימה"
            className="w-full h-72 object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-charcoal/70 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-charcoal transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer h-72 flex flex-col items-center justify-center gap-4 ${
            isDragging
              ? "border-gold bg-gold/5 shadow-glow"
              : "border-border hover:border-gold-light hover:shadow-soft bg-ivory/50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            {isDragging ? (
              <ImageIcon className="w-6 h-6 text-gold" />
            ) : (
              <Upload className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div className="text-center px-4">
            <p className="font-sans text-sm text-charcoal-light">
              גררי תמונה לכאן או לחצי לבחירה
            </p>
            <p className="font-sans text-xs text-muted-foreground mt-2">
              JPG, PNG עד 10MB
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground/70 font-sans leading-relaxed">
        ✦ התמונה תעבור עיבוד AI אוטומטי לתצוגת קטלוג מקצועית
      </p>
    </div>
  );
};

export default ImageUploadZone;
