import{ createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {User} from "../types/auth.types.ts";



interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');

            if (storedUser && token) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch {
                    // Nếu JSON lỗi thì bỏ qua
                }
            }
            // 2. Kiểm tra xong rồi thì tắt loading
            setIsInitializing(false);
        };

        initAuth();
    }, []);

    const login = ( userData: User, accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    if (isInitializing) {
        return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
    }
    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được dùng bên trong AuthProvider");
    }
    console.log("Context: ", context);
    return context;
};