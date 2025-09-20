import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserContextType {
    userId: string | null;
    setUserId: (id: string | null) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType>({
    userId: null,
    setUserId: () => { },
    logout: () => { },
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userId, setUserIdState] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const storedId = await AsyncStorage.getItem("userId");
            if (storedId) setUserIdState(storedId);
        };
        loadUser();
    }, []);

    const setUserId = async (id: string | null) => {
        if (id) {
            await AsyncStorage.setItem("userId", id);
            setUserIdState(id);
        } else {
            await AsyncStorage.removeItem("userId");
            setUserIdState(null);
        }
    };

    const logout = () => setUserId(null);

    return (
        <UserContext.Provider value={{ userId, setUserId, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
