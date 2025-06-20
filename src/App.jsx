import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Registrasi from "./Pages/Registrasi";
import DashboardPetugas from "./components/dashboard-petugas";
import DashboardAdmin from "./components/dashboard-admin";
import Barang from "./Pages/Barang/barang";
import TambahBarang from "./Pages/Barang/tambahbarang";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registrasi />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-petugas" element={<DashboardPetugas />} />
        <Route path="/barang" element={<Barang />} />
        <Route path="/tambahbarang" element={<TambahBarang />} />
      </Routes>
    </Router>
  );
};

export default App;
