import { useState } from "react";
import client from "../api/client";

export default function AIRecommendationPanel() {
  const [form, setForm] = useState({
    city: "Navi Mumbai",
    budget: "15000",
    bedrooms: "1",
    furnished: "true",
    preferences: "metro, office commute, gated society",
  });
  const [summary, setSummary] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await client.post("/ai/recommendations", {
        city: form.city,
        budget: Number(form.budget),
        bedrooms: Number(form.bedrooms),
        furnished: form.furnished === "true",
        preferences: form.preferences.split(",").map((item) => item.trim()),
      });
      setSummary(data.summary);
      setProperties(data.recommendedProperties || []);
    } catch (requestError) {
      setSummary("");
      setProperties([]);
      setError(
        requestError.response?.data?.message ||
          "connnect the rapid api"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-white/60 bg-white p-6 shadow-float"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-ember">
          AI Recommendations
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight">
          Ask for the shortlist you actually want.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <input
            className="field"
            placeholder="City"
            value={form.city}
            onChange={(event) => setForm({ ...form, city: event.target.value })}
          />
          <input
            className="field"
            placeholder="Budget"
            value={form.budget}
            onChange={(event) => setForm({ ...form, budget: event.target.value })}
          />
          <input
            className="field"
            placeholder="Bedrooms"
            value={form.bedrooms}
            onChange={(event) =>
              setForm({ ...form, bedrooms: event.target.value })
            }
          />
          <select
            className="field"
            value={form.furnished}
            onChange={(event) =>
              setForm({ ...form, furnished: event.target.value })
            }
          >
            <option value="true">Furnished</option>
            <option value="false">Unfurnished</option>
          </select>
          <textarea
            className="field md:col-span-2"
            rows="4"
            placeholder="Preferences"
            value={form.preferences}
            onChange={(event) =>
              setForm({ ...form, preferences: event.target.value })
            }
          />
        </div>
        <button type="submit" className="button-primary mt-6">
          {loading ? "Thinking..." : "Get Recommendations"}
        </button>
      </form>

      <div className="rounded-[32px] bg-ink p-6 text-white shadow-float">
        <p className="text-xs uppercase tracking-[0.35em] text-white/70">
          Example
        </p>
        <p className="mt-3 text-2xl font-semibold">
          “Recommended properties in Navi Mumbai under ₹15000”
        </p>
        <p className="mt-6 text-sm leading-7 text-white/80">
          {summary || "Submit the form to receive a generated summary and matching listings."}
        </p>
        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
        <div className="mt-8 space-y-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="rounded-3xl border border-white/15 bg-white/10 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{property.title}</p>
                  <p className="text-sm text-white/70">
                    {property.locality}, {property.city}
                  </p>
                </div>
                <p className="text-sm font-semibold">₹{property.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
