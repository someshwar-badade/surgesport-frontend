import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType, LoginResponse } from "~/types/auth.type";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("loggedUser");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser) as User);
            } catch (error) {
                console.error("Failed to parse stored user:", error);
                localStorage.removeItem("loggedUser");
                localStorage.removeItem("loggedToken");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (data: LoginResponse): void => {
        localStorage.setItem("loggedToken", data.token);
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = (): void => {
        setUser(null);
        localStorage.removeItem("loggedToken");
        localStorage.removeItem("loggedUser");
    };

    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}