import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../state/AuthContext";

export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    client.get(`/properties/${propertyId}`).then(({ data }) => setProperty(data));
  }, [propertyId]);

  if (!property) {
    return <main className="section-shell py-12">Loading property...</main>;
  }

  const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080";
  const images = property.images?.length
    ? property.images.map((image) => `${backendOrigin}${image}`)
    : [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      ];
  const mapQuery =
    property.latitude && property.longitude
      ? `${property.latitude},${property.longitude}`
      : encodeURIComponent(property.address);

  return (
    <main className="section-shell py-12">
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
            <img
              src={images[0]}
              alt={property.title}
              className="h-[420px] w-full rounded-[32px] object-cover shadow-float"
            />
            <div className="grid gap-4">
              {images.slice(1, 3).map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={property.title}
                  className="h-[202px] w-full rounded-[28px] object-cover"
                />
              ))}
            </div>
          </div>

          <div className="glass rounded-[32px] border border-white/70 p-6 shadow-float">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              {property.city} • {property.locality}
            </p>
            <h1 className="mt-3 font-display text-5xl">{property.title}</h1>
            <p className="mt-5 text-base leading-8 text-slate-600">
              {property.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {property.amenities?.map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-fog px-4 py-2 text-sm font-medium text-ink"
                >
                  {amenity}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-4">
              <Metric label="Monthly Rent" value={`₹${property.price}`} />
              <Metric label="Bedrooms" value={property.bedrooms} />
              <Metric label="Bathrooms" value={property.bathrooms} />
              <Metric
                label="Furnishing"
                value={property.furnished ? "Furnished" : "Unfurnished"}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-ink p-6 text-white shadow-float">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              Owner Info
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              {property.owner.fullName}
            </h2>
            <p className="mt-2 text-sm text-white/70">{property.owner.email}</p>
            <p className="text-sm text-white/70">{property.owner.phone}</p>

            <div className="mt-8 flex gap-3">
              <button
                className="button-primary bg-white text-ink hover:bg-white"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  navigate("/booking", { state: { property } });
                }}
              >
                Schedule Visit
              </button>
              <Link to="/search" className="button-secondary border-white/20 bg-white/10 text-white hover:text-white">
                Back
              </Link>
            </div>
          </div>

          <div className="glass overflow-hidden rounded-[32px] border border-white/70 shadow-float">
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Location Map
              </p>
              <p className="mt-2 text-sm text-slate-600">{property.address}</p>
            </div>
            <iframe
              title="map"
              className="h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-[28px] bg-white px-4 py-5">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
      <p className="mt-3 text-xl font-semibold">{value}</p>
    </div>
  );
}
