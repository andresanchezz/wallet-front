import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "../screens/HomeScreen";
import { AuthScreen } from "../screens/AuthScreen";


interface TabI {
    name: string;
    component: React.ComponentType<any>;
    icon: keyof typeof Ionicons.glyphMap;
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export const BottomNavigation = () => {
    const [initialRoute, setInitialRoute] = useState<"Auth" | "Tabs">("Auth");

    const tabs: TabI[] = [
        { name: "Home", component: HomeScreen, icon: "albums-outline" },
    ];

    const Tabs = () => (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    const iconName =
                        tabs.find((i) => i.name === route.name)?.icon || "albums-outline";
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: "gray",
            })}
        >
            {tabs.map((tab, index) => (
                <Tab.Screen key={index} name={tab.name} component={tab.component} />
            ))}
        </Tab.Navigator>
    );

    useEffect(() => {
        const checkUser = async () => {
            const storedId = await AsyncStorage.getItem("userId");
            setInitialRoute(storedId ? "Tabs" : "Auth");
        };
        checkUser();
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Tabs" component={Tabs} />
        </Stack.Navigator>
    );
};

export default BottomNavigation;
