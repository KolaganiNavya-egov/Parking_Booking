// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../database/database";

const useRole = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const data = await db.login.where('status').equals('logged in').toArray();
            if (data.length > 0) {
                setRole(data[0].role);
            } else {
                setRole(null);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    return { role, loading };
};

export const UserRoute = ({ children }) => {
    const { role, loading } = useRole();

    if (loading) return null;
    if (role !== "user") return <Navigate to="/" replace />;
    return children;
};

export const StaffRoute = ({ children }) => {
    const { role, loading } = useRole();

    if (loading) return null;
    if (role !== "staff") return <Navigate to="/" replace />;
    return children;
};

export const AdminRoute = ({ children }) => {
    const { role, loading } = useRole();

    if (loading) return null;
    if (role !== "admin") return <Navigate to="/" replace />;
    return children;
};
