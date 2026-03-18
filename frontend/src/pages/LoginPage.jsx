import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../state/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await client.post("/auth/login", form);
      login(data);
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="section-shell flex min-h-[calc(100vh-90px)] items-center py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-2">
        <div className="rounded-[36px] bg-ink p-8 text-white shadow-float">
          <p className="text-xs uppercase tracking-[0.35em] text-white/70">
            Welcome Back
          </p>
          <h1 className="mt-4 font-display text-6xl leading-none">
            Sign in and keep the move simple.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/75">
            Access bookings, rent payments, saved properties, and the AI
            recommendation assistant from one place.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass rounded-[36px] border border-white/70 p-8 shadow-float"
        >
          <h2 className="font-display text-5xl">Login</h2>
          <div className="mt-8 space-y-4">
            <input
              className="field"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <input
              type="password"
              className="field"
              placeholder="Password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
          </div>
          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
          <button className="button-primary mt-6 w-full">Login</button>
          <p className="mt-6 text-sm text-slate-500">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-ember">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

