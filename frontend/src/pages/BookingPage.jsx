import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import client from "../api/client";

export default function BookingPage() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    propertyId: location.state?.property?.id || "",
    visitDate: "",
    visitTime: "11:00",
    note: "",
  });

  useEffect(() => {
    client.get("/properties").then(({ data }) => setProperties(data));
    client.get("/bookings/mine").then(({ data }) => setBookings(data));
  }, []);

  const handleBooking = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const { data } = await client.post("/bookings", form);
      setBookings([data, ...bookings]);
      setMessage("Visit booked successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Visit book nahi ho payi.");
    }
  };

  const handleRentPayment = async () => {
    setMessage("");
    setError("");
    if (!form.propertyId) {
      setMessage("Select a property before creating a payment.");
      return;
    }

    const property = properties.find((item) => item.id === Number(form.propertyId));
    if (!property) {
      setError("Selected property load nahi hui.");
      return;
    }
    if (!window.Razorpay) {
      setError("Razorpay checkout script load nahi hua.");
      return;
    }

    let data;
    try {
      const response = await client.post("/payments/order", {
        propertyId: Number(form.propertyId),
        amount: property.price,
      });
      data = response.data;
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Payment order create nahi ho paya."
      );
      return;
    }

    const options = {
      key: data.razorpayKey,
      amount: Number(property.price) * 100,
      currency: "INR",
      name: "Rentify",
      description: `Rent payment for ${property.title}`,
      order_id: data.orderId,
      handler: async function (response) {
        try {
          await client.post("/payments/verify", {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          setMessage("Payment completed successfully.");
        } catch (requestError) {
          setError(
            requestError.response?.data?.message ||
              "Payment verify nahi ho paya."
          );
        }
      },
      prefill: {},
      theme: {
        color: "#172033",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <main className="section-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section className="glass rounded-[32px] border border-white/70 p-6 shadow-float">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Visit Booking
          </p>
          <h1 className="mt-3 font-display text-5xl">Schedule a property visit.</h1>
          <form onSubmit={handleBooking} className="mt-8 space-y-4">
            <select
              className="field"
              value={form.propertyId}
              onChange={(event) =>
                setForm({ ...form, propertyId: event.target.value })
              }
            >
              <option value="">Select property</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.title} • {property.city} • ₹{property.price}
                </option>
              ))}
            </select>
            <input
              type="date"
              className="field"
              value={form.visitDate}
              onChange={(event) =>
                setForm({ ...form, visitDate: event.target.value })
              }
            />
            <input
              type="time"
              className="field"
              value={form.visitTime}
              onChange={(event) =>
                setForm({ ...form, visitTime: event.target.value })
              }
            />
            <textarea
              className="field"
              rows="4"
              placeholder="Anything the owner should know?"
              value={form.note}
              onChange={(event) => setForm({ ...form, note: event.target.value })}
            />
            <div className="flex flex-wrap gap-3">
              <button type="submit" className="button-primary">
                Book Visit
              </button>
              <button
                type="button"
                className="button-secondary"
                onClick={handleRentPayment}
              >
                Pay Rent with Razorpay
              </button>
            </div>
            {message ? <p className="text-sm text-pine">{message}</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Upcoming Visits
            </p>
            <h2 className="mt-3 font-display text-5xl">Your schedule.</h2>
          </div>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-[28px] border border-white/70 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">{booking.propertyTitle}</p>
                  <p className="text-sm text-slate-500">
                    {booking.visitDate} at {booking.visitTime}
                  </p>
                </div>
                <span className="rounded-full bg-fog px-3 py-2 text-xs font-semibold text-ink">
                  {booking.status}
                </span>
              </div>
              {booking.note ? (
                <p className="mt-3 text-sm text-slate-600">{booking.note}</p>
              ) : null}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
