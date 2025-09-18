import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";


interface TabI {
    name: string;
    component: React.ComponentType<any>;
    icon: keyof typeof Ionicons.glyphMap;
}

export const BottomNavigation = () => {

    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    const tabs: TabI[] = [
        { name: "Home", component: HomeScreen, icon: "albums-outline" },
    ];

    const Tabs = () => (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    const iconName = tabs.find((i) => i.name === route.name)?.icon || "albums-outline";
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                headerShown: false,
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: "gray",
            })}
        >
            {
                tabs.map((tab, index) => (
                    <Tab.Screen key={index} name={tab.name} component={tab.component} />
                ))
            }
        </Tab.Navigator>
    );

    return (
        <Stack.Navigator>
            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default BottomNavigation;
