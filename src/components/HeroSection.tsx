import { Link } from "react-router-dom";
import { Crown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-20 md:py-28 text-center" dir="rtl">
      <Link
        to="/admin"
        className="absolute top-6 left-6 text-muted-foreground/20 hover:text-gold transition-colors"
        title="Admin"
      >
        <Crown className="w-5 h-5" />
      </Link>
      <div className="max-w-3xl mx-auto px-6">
        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-8 opacity-60">
          <span className="block w-12 h-px bg-gold" />
          <span className="text-gold text-xs tracking-[0.3em] font-sans uppercase">Pilot Collection</span>
          <span className="block w-12 h-px bg-gold" />
        </div>

        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-wide text-charcoal mb-6">
          ויהי ערב
        </h1>

        <p className="font-serif text-xl md:text-2xl text-charcoal-light font-light leading-relaxed mb-4">
          השכרת שמלות ערב פרימיום
        </p>

        <p className="font-sans text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-3">
          העלי את הפריט שלך לקטלוג הפיילוט שלנו.
          <br />
          אנחנו נעבד את התמונות, נבדוק את הפרטים, ונפרסם רק לאחר אישור.
        </p>

        <p className="font-sans text-xs text-muted-foreground/70 tracking-wide">
          כל פריט עובר בדיקה ידנית לפני פרסום בקטלוג
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
