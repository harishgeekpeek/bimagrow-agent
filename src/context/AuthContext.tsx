import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { deleteMPIN } from "@/utils/mpin";

interface User {
    id: number;
    name: string;
    mobile: string;
    email: string;
    role_id: number;
    token: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loginUser: (user: User, token: string) => Promise<void>;
    logoutUser: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    loginUser: async () => { },
    logoutUser: async () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const savedToken = await AsyncStorage.getItem("token");
            const savedUser = await AsyncStorage.getItem("user");

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }

            setIsLoading(false);
        };

        loadUser();
    }, []);


    const loginUser = async (userData: User, authToken: string) => {
        await AsyncStorage.setItem("token", authToken);
        await AsyncStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setToken(authToken);

        // router.replace("/(main)/dashboard"); // Change if needed
    };


    const logoutUser = async () => {
        await AsyncStorage.clear();
        await deleteMPIN();
        setUser(null);
        setToken(null);
        router.replace("/");
    };

    return (
        <AuthContext.Provider
            value={{ user, token, loginUser, logoutUser, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
