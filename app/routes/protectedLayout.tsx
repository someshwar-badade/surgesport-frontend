
import { Outlet } from "react-router";
import { ProtectedRoute } from "~/utils/protected-routes";

export default function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <Outlet />
        </ProtectedRoute>
    );
}