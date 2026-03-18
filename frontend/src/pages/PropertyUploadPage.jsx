import { useEffect, useState } from "react";
import client from "../api/client";

const initialForm = {
  title: "",
  description: "",
  city: "",
  locality: "",
  address: "",
  latitude: "",
  longitude: "",
  price: "",
  securityDeposit: "",
  bedrooms: "1",
  bathrooms: "1",
  furnished: true,
  propertyType: "APARTMENT",
  amenities: "Lift, Parking, Security",
};

export default function PropertyUploadPage() {
  const [form, setForm] = useState(initialForm);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [myProperties, setMyProperties] = useState([]);

  const loadMyProperties = () => {
    client.get("/properties/owner/mine").then(({ data }) => setMyProperties(data));
  };

  useEffect(() => {
    loadMyProperties();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const payload = new FormData();
    payload.append(
      "property",
      new Blob(
        [
          JSON.stringify({
            ...form,
            latitude: form.latitude ? Number(form.latitude) : null,
            longitude: form.longitude ? Number(form.longitude) : null,
            price: Number(form.price),
            securityDeposit: form.securityDeposit
              ? Number(form.securityDeposit)
              : 0,
            bedrooms: Number(form.bedrooms),
            bathrooms: Number(form.bathrooms),
            amenities: form.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          }),
        ],
        { type: "application/json" }
      )
    );

    files.forEach((file) => payload.append("images", file));
    try {
      await client.post("/properties", payload);
      setMessage("Property submitted for admin approval.");
      setForm(initialForm);
      setFiles([]);
      loadMyProperties();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Property submit nahi ho payi. Dobara try karo."
      );
    }
  };

  return (
    <main className="section-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <section className="glass rounded-[32px] border border-white/70 p-6 shadow-float">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Owner Console
          </p>
          <h1 className="mt-3 font-display text-5xl">Add a new property listing.</h1>
          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
            <input
              className="field md:col-span-2"
              placeholder="Title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <textarea
              className="field md:col-span-2"
              rows="4"
              placeholder="Description"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
            <input
              className="field"
              placeholder="City"
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
            />
            <input
              className="field"
              placeholder="Locality"
              value={form.locality}
              onChange={(event) =>
                setForm({ ...form, locality: event.target.value })
              }
            />
            <input
              className="field md:col-span-2"
              placeholder="Full address"
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
            />
            <input
              className="field"
              placeholder="Latitude"
              value={form.latitude}
              onChange={(event) =>
                setForm({ ...form, latitude: event.target.value })
              }
            />
            <input
              className="field"
              placeholder="Longitude"
              value={form.longitude}
              onChange={(event) =>
                setForm({ ...form, longitude: event.target.value })
              }
            />
            <input
              className="field"
              placeholder="Monthly rent"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
            />
            <input
              className="field"
              placeholder="Security deposit"
              value={form.securityDeposit}
              onChange={(event) =>
                setForm({ ...form, securityDeposit: event.target.value })
              }
            />
            <input
              className="field"
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={(event) =>
                setForm({ ...form, bedrooms: event.target.value })
              }
            />
            <input
              className="field"
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={(event) =>
                setForm({ ...form, bathrooms: event.target.value })
              }
            />
            <select
              className="field"
              value={String(form.furnished)}
              onChange={(event) =>
                setForm({ ...form, furnished: event.target.value === "true" })
              }
            >
              <option value="true">Furnished</option>
              <option value="false">Unfurnished</option>
            </select>
            <select
              className="field"
              value={form.propertyType}
              onChange={(event) =>
                setForm({ ...form, propertyType: event.target.value })
              }
            >
              <option value="APARTMENT">Apartment</option>
              <option value="STUDIO">Studio</option>
              <option value="VILLA">Villa</option>
              <option value="PG">PG</option>
              <option value="PENTHOUSE">Penthouse</option>
            </select>
            <input
              className="field md:col-span-2"
              placeholder="Amenities separated by commas"
              value={form.amenities}
              onChange={(event) =>
                setForm({ ...form, amenities: event.target.value })
              }
            />
            <input
              className="field md:col-span-2"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
            />
            <div className="md:col-span-2">
              <button className="button-primary">Submit Listing</button>
              {message ? <p className="mt-3 text-sm text-pine">{message}</p> : null}
              {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Your Listings
            </p>
            <h2 className="mt-3 font-display text-5xl">Approval status.</h2>
          </div>
          {myProperties.map((property) => (
            <div
              key={property.id}
              className="rounded-[28px] border border-white/70 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{property.title}</p>
                  <p className="text-sm text-slate-500">
                    {property.city} • ₹{property.price}
                  </p>
                </div>
                <span className="rounded-full bg-fog px-4 py-2 text-xs font-semibold text-ink">
                  {property.approvalStatus}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
