import React from "react";
import { ShopProvider, useShop } from "./lib/ShopContext";
import HomePage from "./HomePage";
import { DashboardLayout } from "./components/DashboardLayout";

function AppContent() {
  const { isAuthenticated, logout } = useShop();

  if (!isAuthenticated) {
    return <HomePage />;
  }

  return <DashboardLayout onLogout={logout} />;
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}