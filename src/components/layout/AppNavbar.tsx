import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";

import type { UserRole } from "../../types/domain";

interface AppNavbarProps {
  isAuthenticated: boolean;
  role: UserRole | null;
  userLabel: string;
  logoutLoading: boolean;
  onLogout: () => void;
}

export const AppNavbar = ({
  isAuthenticated,
  role,
  userLabel,
  logoutLoading,
  onLogout
}: AppNavbarProps): JSX.Element => (
  <div className="navbar-shell">
    <Navbar expand="md" className="app-navbar">
      <Navbar.Toggle aria-controls="main-navbar" />
      <Navbar.Collapse id="main-navbar">
        <Nav className="navbar-links">
          <NavLink to="/services" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
            Список услуг
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/xrf-claims" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
              {role === "moderator" ? "Реестр заявок" : "Мои заявки"}
            </NavLink>
          )}

          {!isAuthenticated ? (
            <>
              <NavLink to="/auth/login" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
                Вход
              </NavLink>
              <NavLink to="/auth/register" className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}>
                Регистрация
              </NavLink>
            </>
          ) : (
            <>
              <span className="navbar-user">{userLabel}</span>
              <Link
                to="/services"
                className={`navbar-link ${logoutLoading ? "navbar-link-disabled" : ""}`}
                onClick={(event) => {
                  event.preventDefault();
                  if (!logoutLoading) {
                    onLogout();
                  }
                }}
              >
                {logoutLoading ? "Выход..." : "Выход"}
              </Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </div>
);
