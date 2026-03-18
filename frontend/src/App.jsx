import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import BookingPage from "./pages/BookingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PropertyUploadPage from "./pages/PropertyUploadPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import SearchPage from "./pages/SearchPage";
import SignupPage from "./pages/SignupPage";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/properties/:propertyId" element={<PropertyDetailPage />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-property"
          element={
            <ProtectedRoute>
              <PropertyUploadPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
