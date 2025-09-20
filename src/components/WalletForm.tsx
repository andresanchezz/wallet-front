import React from "react";
import { View, Text, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useWalletForm } from "../hooks/useWalletForm.hook";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

type WalletFormProps = {
    onSuccess?: () => void;
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        {children}
    </View>
);

export const WalletForm: React.FC<WalletFormProps> = ({ onSuccess }) => {
    const {
        name,
        setName,
        type,
        setType,
        interestRate,
        setInterestRate,
        balance,
        setBalance,
        handleSubmit: submitWallet,
        error,
        loading,
    } = useWalletForm();

    const handleSubmit = async () => {
        const success = await submitWallet();
        if (success && onSuccess) onSuccess();
    };

    // Si es tarjeta de crédito, limpiar balance e interestRate
    const handleTypeChange = (value: "WALLET" | "CREDIT_CARD") => {
        setType(value);
        if (value === "CREDIT_CARD") {
            setBalance("0");
            setInterestRate("0");
        } else {
            setBalance("");
            setInterestRate("");
        }
    };

    return (
        <View style={styles.container}>
            <FormField label="Bank/Card name">
                <BottomSheetTextInput
                    keyboardType="default"
                    value={name}
                    onChangeText={setName}
                    placeholder="Ej: Bank this.name"
                    style={styles.input}
                />
            </FormField>

            <FormField label="Type">
                <Picker
                    selectedValue={type}
                    onValueChange={handleTypeChange}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="Wallet" value="WALLET" />
                    <Picker.Item label="Credit card" value="CREDIT_CARD" />
                </Picker>
            </FormField>

            {type === "WALLET" && (
                <>
                    <FormField label="Interest rate (%)">
                        <BottomSheetTextInput
                            keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
                            value={interestRate}
                            onChangeText={setInterestRate}
                            placeholder="9.5"
                            style={styles.input}
                        />
                    </FormField>

                    <FormField label="Initial balance">
                        <BottomSheetTextInput
                            value={balance}
                            onChangeText={setBalance}
                            placeholder="10.000"
                            keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
                            style={styles.input}
                        />
                    </FormField>
                </>
            )}

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.5 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={{ color: "white", textAlign: "center" }}>
                    {loading ? "Loading..." : "Create"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, gap: 12 },
    field: { marginBottom: 12 },
    label: { fontWeight: "500", marginBottom: 4 },
    input: { paddingVertical: 16 },
    picker: {},
    pickerItem: { fontSize: 14, height: 128 },
    button: { paddingVertical: 12, backgroundColor: "black", borderRadius: 8 },
    error: { color: "red", marginTop: 8 },
});
