import { useEffect, useState } from "react";
import client from "../api/client";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    Promise.all([
      client.get("/admin/dashboard"),
      client.get("/admin/properties/pending"),
      client.get("/admin/users"),
      client.get("/admin/payments"),
    ]).then(([dashboardResponse, propertyResponse, userResponse, paymentResponse]) => {
      setDashboard(dashboardResponse.data);
      setPendingProperties(propertyResponse.data);
      setUsers(userResponse.data);
      setPayments(paymentResponse.data);
    });
  }, []);

  const updateApproval = async (propertyId, approvalStatus) => {
    await client.patch(`/admin/properties/${propertyId}/approval`, {
      approvalStatus,
    });
    setPendingProperties(
      pendingProperties.filter((property) => property.id !== propertyId)
    );
  };

  const toggleUser = async (userId) => {
    const { data } = await client.patch(`/admin/users/${userId}/toggle`);
    setUsers(users.map((user) => (user.id === userId ? data : user)));
  };

  return (
    <main className="section-shell py-12">
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Admin Dashboard
          </p>
          <h1 className="mt-3 font-display text-6xl">Moderation and finance view.</h1>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          {dashboard
            ? [
                ["Users", dashboard.totalUsers],
                ["Properties", dashboard.totalProperties],
                ["Pending", dashboard.pendingProperties],
                ["Payments", dashboard.totalPayments],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[28px] border border-white/70 bg-white p-6 shadow-sm"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-4 text-4xl font-bold">{value}</p>
                </div>
              ))
            : null}
        </section>

        <section className="grid gap-8 xl:grid-cols-2">
          <div className="glass rounded-[32px] border border-white/70 p-6 shadow-float">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Pending Listings
                </p>
                <h2 className="mt-3 font-display text-4xl">Approval queue</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {pendingProperties.map((property) => (
                <div
                  key={property.id}
                  className="rounded-[28px] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">{property.title}</p>
                      <p className="text-sm text-slate-500">
                        {property.city} • ₹{property.price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="rounded-full bg-pine px-4 py-2 text-xs font-semibold text-white"
                        onClick={() => updateApproval(property.id, "APPROVED")}
                      >
                        Approve
                      </button>
                      <button
                        className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white"
                        onClick={() => updateApproval(property.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-[32px] border border-white/70 p-6 shadow-float">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              User Management
            </p>
            <h2 className="mt-3 font-display text-4xl">Accounts</h2>
            <div className="mt-6 space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-[28px] bg-white p-5 shadow-sm"
                >
                  <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-slate-500">
                      {user.email} • {user.role}
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold"
                    onClick={() => toggleUser(user.id)}
                  >
                    {user.active ? "Disable" : "Enable"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white p-6 shadow-float">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Payments
          </p>
          <h2 className="mt-3 font-display text-4xl">Rent collection log</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-4">Property</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Order ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-slate-100">
                    <td className="py-4">{payment.propertyTitle}</td>
                    <td className="py-4">₹{payment.amount}</td>
                    <td className="py-4">{payment.status}</td>
                    <td className="py-4 font-mono text-xs">
                      {payment.razorpayOrderId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
