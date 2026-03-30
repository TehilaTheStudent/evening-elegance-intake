import { Check, Loader2, Clock } from "lucide-react";

type Step = {
  label: string;
  status: "pending" | "active" | "done";
};

interface SubmissionStatusProps {
  steps: Step[];
}

const SubmissionStatus = ({ steps }: SubmissionStatusProps) => {
  return (
    <div className="space-y-3" dir="rtl">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              step.status === "done"
                ? "bg-gold text-primary-foreground"
                : step.status === "active"
                ? "bg-gold/20 text-gold border border-gold animate-pulse"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {step.status === "done" ? (
              <Check className="w-3.5 h-3.5" />
            ) : step.status === "active" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
          </div>
          <span
            className={`font-sans text-sm transition-colors ${
              step.status === "done"
                ? "text-charcoal"
                : step.status === "active"
                ? "text-gold font-medium"
                : "text-muted-foreground"
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SubmissionStatus;
