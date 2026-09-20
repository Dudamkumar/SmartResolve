import { useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "./layout.css";

export default function AppLayout({
  children,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-layout">

        <Topbar
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main className="page-content">
          {children}
        </main>

      </div>
    </>
  );
}