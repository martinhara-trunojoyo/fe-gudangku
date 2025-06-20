import { Outlet } from "react-router-dom";
import NavbarDashboard from "../../components/layout/admin/Navbar";

export default function AdminLayout() {
    return (
        <>
            <NavbarDashboard />
            <Outlet />
        </>
    )
}
