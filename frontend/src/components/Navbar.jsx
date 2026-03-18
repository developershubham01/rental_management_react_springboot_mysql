import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

function navClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm transition ${
    isActive ? "bg-white text-ink shadow" : "text-slate-600 hover:text-ink"
  }`;
}

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-sand/80 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-lg font-bold text-white">
            R
          </div>
          <div>
            <p className="font-display text-2xl leading-none">Rentify</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Rental Platform
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/70 p-1 shadow-sm md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/search" className={navClass}>
            Search
          </NavLink>
          <NavLink to="/list-property" className={navClass}>
            List Property
          </NavLink>
          <NavLink to="/booking" className={navClass}>
            Booking
          </NavLink>
          {isAdmin ? (
            <NavLink to="/admin" className={navClass}>
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">{user?.fullName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                className="button-secondary"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="button-secondary">
                Login
              </Link>
              <Link to="/signup" className="button-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
