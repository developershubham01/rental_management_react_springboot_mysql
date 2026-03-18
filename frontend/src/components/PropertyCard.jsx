import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  const image = property.images?.[0]
    ? `${import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8080"}${property.images[0]}`
    : "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-float transition hover:-translate-y-1">
      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={property.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
          {property.propertyType}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
          ₹{property.price}
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {property.city} • {property.locality}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{property.title}</h3>
          <p className="mt-2 min-h-10 text-sm text-slate-600">
            {property.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-fog px-3 py-2">
            {property.bedrooms} Bedrooms
          </span>
          <span className="rounded-full bg-fog px-3 py-2">
            {property.bathrooms} Bathrooms
          </span>
          <span className="rounded-full bg-fog px-3 py-2">
            {property.furnished ? "Furnished" : "Unfurnished"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Owner: {property.owner.fullName}</p>
          <Link to={`/properties/${property.id}`} className="button-primary">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
