import { useEffect, useState } from "react";
import client from "../api/client";
import PropertyCard from "../components/PropertyCard";

export default function SearchPage() {
  const [filters, setFilters] = useState({
    city: "",
    maxPrice: "",
    bedrooms: "",
    furnished: "",
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async (nextFilters = filters) => {
    setLoading(true);
    const params = {};
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== "") {
        params[key] = value;
      }
    });
    const { data } = await client.get("/properties", { params });
    setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const submitFilters = (event) => {
    event.preventDefault();
    fetchProperties(filters);
  };

  return (
    <main className="section-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <form
          onSubmit={submitFilters}
          className="glass h-fit rounded-[32px] border border-white/70 p-6 shadow-float"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Search Filters
          </p>
          <h1 className="mt-3 font-display text-4xl">Search Rentals</h1>
          <div className="mt-6 space-y-4">
            <input
              className="field"
              placeholder="City"
              value={filters.city}
              onChange={(event) =>
                setFilters({ ...filters, city: event.target.value })
              }
            />
            <input
              className="field"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(event) =>
                setFilters({ ...filters, maxPrice: event.target.value })
              }
            />
            <input
              className="field"
              placeholder="Bedrooms"
              value={filters.bedrooms}
              onChange={(event) =>
                setFilters({ ...filters, bedrooms: event.target.value })
              }
            />
            <select
              className="field"
              value={filters.furnished}
              onChange={(event) =>
                setFilters({ ...filters, furnished: event.target.value })
              }
            >
              <option value="">Any furnishing</option>
              <option value="true">Furnished</option>
              <option value="false">Unfurnished</option>
            </select>
          </div>
          <button className="button-primary mt-6 w-full">Apply Filters</button>
        </form>

        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Results
              </p>
              <h2 className="mt-3 font-display text-5xl">
                {loading ? "Loading listings..." : `${properties.length} homes found`}
              </h2>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
