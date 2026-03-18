import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";
import AIRecommendationPanel from "../components/AIRecommendationPanel";
import PropertyCard from "../components/PropertyCard";

export default function HomePage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    client.get("/properties").then(({ data }) => setProperties(data.slice(0, 3)));
  }, []);

  return (
    <main className="pb-20">
      <section className="section-shell grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-ember/20 bg-ember/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            Search. Visit. Rent.
          </div>
          <div className="space-y-6">
            <h1 className="max-w-3xl font-display text-6xl leading-[0.95] text-ink sm:text-7xl">
              Rental discovery built for fast-moving city life.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Explore approved rental listings, schedule visits, pay rent online,
              and get AI-backed suggestions tuned to budget, location, and
              commute priorities.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/search" className="button-primary">
              Explore Listings
            </Link>
            <Link to="/signup" className="button-secondary">
              List Your Property
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["1K+", "active renters"],
              ["200+", "approved homes"],
              ["24/7", "booking support"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-[28px] border border-white/60 bg-white/80 p-5"
              >
                <p className="text-3xl font-bold">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[36px] border border-white/60 bg-ink p-8 text-white shadow-float">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Featured Search
            </p>
            <h2 className="mt-4 font-display text-5xl leading-tight">
              Find homes that match the city rhythm you want.
            </h2>
            <div className="mt-8 space-y-4">
              {[
                "Verified owners and moderated listings",
                "Visit booking flow with preferred slots",
                "Rent payment support through Razorpay",
                "Admin approval and payment visibility",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell py-12">
        <AIRecommendationPanel />
      </section>

      <section className="section-shell py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Approved Listings
            </p>
            <h2 className="mt-3 font-display text-5xl">Homes ready for visits.</h2>
          </div>
          <Link to="/search" className="button-secondary">
            View All
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}

