import { Outlet } from "react-router-dom";
import NavbarDashboard from "../../components/layout/petugas/Navbar";

export default function PetugasLayout() {
    return (
        <>
            <NavbarDashboard />
            <Outlet />
        </>
    )
}
