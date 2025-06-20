import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicLayout from "./assets/layouts/public";
import LandingPage from "./assets/pages/public";
import Register from "./assets/pages/admin/auth/Register";
import Login from "./assets/pages/admin/auth/Login";
import AdminLayout from "./assets/layouts/admin/Index";
import HeroDashboard from "./assets/pages/admin/Index";
import TambahUMKM from "./assets/pages/admin/umkm/Tambah";
import EditUMKM from "./assets/pages/admin/umkm/Edit";
import PetugasIndex from "./assets/pages/admin/petugas/Index";
import PetugasTambah from "./assets/pages/admin/petugas/tambah";
import PetugasEdit from "./assets/pages/admin/petugas/Edit";
import SupplierIndex from "./assets/pages/shared/supplier/Index";
import PetugasLayout from "./assets/layouts/petugas/Index";
import Dashboard from "./assets/pages/shared/dashboard";
import SupplierTambah from "./assets/pages/shared/supplier/Tambah";
import SupplierEdit from "./assets/pages/shared/supplier/Edit";
import KategoriIndex from "./assets/pages/shared/kategori/Index";
import KategoriTambah from "./assets/pages/shared/kategori/Tambah";
import KategoriEdit from "./assets/pages/shared/kategori/Edit";
import BarangIndex from "./assets/pages/shared/barang";
import BarangTambah from "./assets/pages/shared/barang/Tambah";
import BarangEdit from "./assets/pages/shared/barang/Edit";
import TambahBarangMasuk from "./assets/pages/shared/barang/masuk/Tambah";
import TambahBarangKeluar from "./assets/pages/shared/barang/keluar/Tambah";
import BarangKeluar from "./assets/pages/shared/laporan/BarangKeluar";
import BarangMasuk from "./assets/pages/shared/laporan/BarangMasuk";
import ForgotPassword from "./assets/pages/admin/auth/ForgotPasword";
import ResetPassword from "./assets/pages/admin/auth/ResetPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
          </Route>
          {/* End Of Public Routes */}

          {/* Standalone Auth Pages (no navbar) */}
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          {/* End Of Standalone Auth Pages */}

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<HeroDashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* UMKM */}
            <Route path="registrasi-umkm" element={<TambahUMKM />} />
            <Route path="edit-umkm" element={<EditUMKM />} />
            {/* End Of UMKM */}

            {/* Petugas */}
            <Route path="petugas" element={<PetugasIndex />} />
            <Route path="petugas/tambah" element={<PetugasTambah />} />
            <Route path="petugas/edit/:id" element={<PetugasEdit />} />
            <Route path="supplier" element={<SupplierIndex />} />
            <Route path="supplier/tambah" element={<SupplierTambah />} />
            <Route path="supplier/edit/:id" element={<SupplierEdit />} />
            <Route path="kategori" element={<KategoriIndex />} />
            <Route path="kategori/tambah" element={<KategoriTambah />} />
            <Route path="kategori/edit/:id" element={<KategoriEdit />} />
            <Route path="barang" element={<BarangIndex />} />
            <Route path="barang/tambah" element={<BarangTambah />} />
            <Route path="barang/edit/:id" element={<BarangEdit />} />
            <Route path="barang/masuk/:id" element={<TambahBarangMasuk />} />
            <Route path="barang/keluar/:id" element={<TambahBarangKeluar />} />
            <Route path="laporan/keluar" element={<BarangKeluar />} />
            <Route path="laporan/masuk" element={<BarangMasuk />} />

            {/* End Of Petugas */}
          </Route>
          {/* End Of Admin Routes */}

          {/* Petugas Routes */}
          <Route path="/petugas" element={<PetugasLayout />}>
            <Route index element={<Dashboard />} />
            {/* Petugas */}
            <Route path="supplier" element={<SupplierIndex />} />
            <Route path="supplier/tambah" element={<SupplierTambah />} />
            <Route path="supplier/edit/:id" element={<SupplierEdit />} />
            <Route path="kategori" element={<KategoriIndex />} />
            <Route path="kategori/tambah" element={<KategoriTambah />} />
            <Route path="kategori/edit/:id" element={<KategoriEdit />} />
            <Route path="barang" element={<BarangIndex />} />
            <Route path="barang/tambah" element={<BarangTambah />} />
            <Route path="barang/edit/:id" element={<BarangEdit />} />
            <Route path="barang/masuk/:id" element={<TambahBarangMasuk />} />
            <Route path="barang/keluar/:id" element={<TambahBarangKeluar />} />
            <Route path="laporan/keluar" element={<BarangKeluar />} />
            <Route path="laporan/masuk" element={<BarangMasuk />} />

            {/* End Of Petugas */}
          </Route>
          {/* End Of Petugas Routes */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
