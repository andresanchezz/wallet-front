import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleApiRequest } from "../utils/handleApiRequest";
import { WalletApi } from "../api/api";
import { FormField } from "../components/FormField";
import { useUser } from "../context/UserContext";


export const AuthScreen = ({ navigation }: any) => {
    const [name, setName] = useState("");
    const { setUserId } = useUser();

    const handleAuth = async () => {
        if (!name.trim()) return;

        const res = await handleApiRequest(() =>
            WalletApi().post("/auth/login", { name }),
            "Autenticado"
        );

        if (res) {
            const userId = res.data.id;
            await setUserId(userId);
            navigation.replace("Tabs");
        }
    };


    return (
        <View style={styles.container}>
            <FormField label="Hello, you">
                <TextInput
                    style={{ paddingVertical: 8 }}
                    value={name}
                    onChangeText={setName}
                    placeholder="What's your name? "
                />
            </FormField>
            <TouchableOpacity style={styles.button} onPress={handleAuth}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Continue</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    label: { fontSize: 18, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    button: {
        paddingVertical: 12,
        backgroundColor: "rgba(0, 0, 0, 1)",
        borderRadius: 8,
    },
});

export default AuthScreen;
