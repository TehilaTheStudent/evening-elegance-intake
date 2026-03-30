import { Check, Sparkles } from "lucide-react";

interface SuccessConfirmationProps {
  onReset: () => void;
}

const SuccessConfirmation = ({ onReset }: SuccessConfirmationProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-8 animate-fade-in"
      dir="rtl"
    >
      <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center mb-6">
        <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
          <Check className="w-5 h-5 text-primary-foreground" />
        </div>
      </div>

      <h3 className="font-serif text-2xl md:text-3xl text-charcoal mb-3">
        הפריט נשלח בהצלחה
      </h3>

      <p className="font-sans text-sm text-muted-foreground max-w-sm leading-relaxed mb-2">
        הפריט שלך נשמר לבדיקה. הצוות שלנו יבדוק את הפרטים והתמונות ויאשר את
        הפרסום בקטלוג.
      </p>

      <div className="flex items-center gap-2 text-xs text-gold/80 mb-8">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="font-sans">תמונת הפריט תעבור עיבוד מקצועי</span>
      </div>

      <button
        onClick={onReset}
        className="font-sans text-sm text-charcoal-light underline underline-offset-4 decoration-gold/40 hover:text-charcoal hover:decoration-gold transition-colors"
      >
        העלאת פריט נוסף
      </button>
    </div>
  );
};

export default SuccessConfirmation;
