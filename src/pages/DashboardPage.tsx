import { useNavigate } from "react-router";
import { logout, getUser } from "../services/authService";
import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = getUser();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logga ut
        </button>
      </header>
      <main className="dashboard-main">
        <div className="welcome-card">
          <span className="welcome-icon">👋</span>
          <h2>Välkommen, {user?.subject ?? "Användare"}!</h2>
          <p>Du är inloggad.</p>
          {user?.roles && user.roles.length > 0 && (
            <div className="roles">
              <span className="roles-label">Roller:</span>
              {user.roles.map((role) => (
                <span key={role} className="role-badge">
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
