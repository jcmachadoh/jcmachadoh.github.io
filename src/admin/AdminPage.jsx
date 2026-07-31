import { useEffect } from 'react';
import { useAdminStore } from './store';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

export const AdminPage = () => {
    const isAuthenticated = useAdminStore((state) => state.isAuthenticated);
    const restoreSession = useAdminStore((state) => state.restoreSession);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};
