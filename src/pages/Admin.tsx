import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing } from "@/lib/types";
import { Link } from "react-router-dom";
import { Crown, ArrowRight } from "lucide-react";

const statusStyles = {
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
};

const statusLabels = {
  approved: "מאושר",
  rejected: "נדחה",
  pending: "ממתין",
};

const Admin = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setListings(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Listing[]
        );
      },
      (error) => {
        console.error("Firestore error:", error);
        const fallbackQ = collection(db, "listings");
        onSnapshot(fallbackQ, (snapshot) => {
          setListings(
            snapshot.docs.map((d) => ({
              id: d.id,
              ...d.data(),
            })) as Listing[]
          );
        });
      }
    );
    return () => unsubscribe();
  }, []);

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, "listings", id), { status: "approved" });
  };

  const handleReject = async (id: string) => {
    await updateDoc(doc(db, "listings", id), { status: "rejected" });
  };

  const filteredListings =
    filter === "all" ? listings : listings.filter((l) => l.status === filter);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-5 h-5 text-gold" />
          <h1 className="font-serif text-xl text-charcoal">ניהול מלאי</h1>
        </div>
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-charcoal transition-colors font-sans"
        >
          חזרה לדף הראשי
          <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(["all", "pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-sans transition-all ${
                filter === status
                  ? "bg-charcoal text-primary-foreground shadow-soft"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {status === "all"
                ? "הכל"
                : status === "pending"
                ? "ממתין"
                : status === "approved"
                ? "מאושר"
                : "נדחה"}
              {status !== "all" && (
                <span className="mr-2 opacity-60">
                  ({listings.filter((l) => l.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="bg-card p-20 rounded-xl border-2 border-dashed border-border text-center">
            <p className="font-serif text-xl text-muted-foreground">
              אין פריטים{" "}
              {filter !== "all"
                ? `במצב "${statusLabels[filter]}"`
                : ""}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-card rounded-xl overflow-hidden shadow-soft border border-border"
              >
                <div className="bg-secondary relative">
                  <img
                    src={listing.processedImageUrl || listing.originalImageUrl}
                    alt={listing.description}
                    className="w-full max-h-96 object-contain"
                  />
                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-sans font-medium ${
                      statusStyles[listing.status]
                    }`}
                  >
                    {statusLabels[listing.status]}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-serif text-lg text-charcoal">
                    {listing.description}
                  </h3>
                  <div className="text-sm text-muted-foreground font-sans space-y-1">
                    <p>
                      מידה: {listing.size} | עיר: {listing.city}
                    </p>
                    <p className="text-lg font-serif text-charcoal">
                      ₪{listing.price} להשכרה
                    </p>
                  </div>
                  {listing.status === "pending" && listing.id && (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApprove(listing.id!)}
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg font-sans text-sm hover:bg-green-600 transition-colors"
                      >
                        אשר
                      </button>
                      <button
                        onClick={() => handleReject(listing.id!)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-sans text-sm hover:bg-red-600 transition-colors"
                      >
                        דחה
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
