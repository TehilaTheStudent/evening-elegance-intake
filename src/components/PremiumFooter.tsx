const PremiumFooter = () => {
  return (
    <footer className="py-10 text-center border-t border-border" dir="rtl">
      <p className="font-serif text-lg text-charcoal/60 mb-1">ויהי ערב</p>
      <p className="font-sans text-xs text-muted-foreground/50">
        פיילוט · כל הזכויות שמורות © {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default PremiumFooter;
