import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import ShopPage from "./pages/ShopPage";
import { isAuthenticated } from "./services/authService";

function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}

function StartPage() {
  return <Navigate to={isAuthenticated() ? "/shop" : "/login"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/shop" replace /> : <LoginPage />}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/shop" element={<ShopPage />} />
        </Route>
        <Route path="/dashboard" element={<Navigate to="/shop" replace />} />
        <Route path="*" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
