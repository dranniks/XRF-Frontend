import { Navigate, Route, Routes } from "react-router-dom";

import { AppBreadcrumbs } from "./components/layout/AppBreadcrumbs";
import { AppNavbar } from "./components/layout/AppNavbar";
import { SiteHeader } from "./components/layout/SiteHeader";
import { mockServices } from "./mock/services";
import { ClaimPage } from "./pages/ClaimPage";
import { ClaimsListPage } from "./pages/ClaimsListPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ServicesPage } from "./pages/ServicesPage";
import { logoutThunk } from "./store/authSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const userLabel = authState.user ? `${authState.user.fullName} (${authState.user.login})` : "";

  return (
    <>
      <SiteHeader />
      <AppNavbar
        isAuthenticated={authState.isAuthenticated}
        role={authState.user?.role ?? null}
        userLabel={userLabel}
        logoutLoading={authState.isLoading}
        onLogout={() => {
          void dispatch(logoutThunk());
        }}
      />

      <main className="page">
        <AppBreadcrumbs services={mockServices} />

        <Routes>
          <Route path="/" element={<Navigate to="/services" replace />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/xrf-claims" element={<ClaimsListPage />} />
          <Route path="/xrf-claims/:id" element={<ClaimPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
