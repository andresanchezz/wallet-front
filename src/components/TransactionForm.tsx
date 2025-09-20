import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTransactionForm } from "../hooks/useTransactionForm.hook";
import { useWallets } from "../context/WalletContext";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FormField } from "./FormField";


export const TransactionForm = () => {
    const {
        name,
        setName,
        type,
        setType,
        direction,
        setDirection,
        amount,
        setAmount,
        setWalletId,
        categoryId,
        setCategoryId,
        categories,
        handleSubmit,
        date,
        setDate,
    } = useTransactionForm();

    const { wallets } = useWallets();
    const [showDatePicker, setShowDatePicker] = useState(false);

    return (
        <View style={styles.container}>
            <FormField label="Nombre">
                <BottomSheetTextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ej: Pago de servicios"
                    style={styles.input}
                />
            </FormField>

            <FormField label="Monto">
                <BottomSheetTextInput
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="Ej: 50000"
                    keyboardType="numeric"
                    style={styles.input}
                />
            </FormField>

            <FormField label="Tipo">
                <Picker
                    selectedValue={type}
                    onValueChange={(v) => setType(v)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    <Picker.Item label="Ingreso" value="INCOME" />
                    <Picker.Item label="Gasto" value="EXPENSE" />
                    <Picker.Item label="Transferencia" value="TRANSFER" />
                    <Picker.Item label="Interés" value="INTEREST" />
                </Picker>
            </FormField>

            {type === "TRANSFER" && (
                <FormField label="Dirección">
                    <Picker
                        selectedValue={direction}
                        onValueChange={(v) => setDirection(v)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item label="Entrante" value="IN" />
                        <Picker.Item label="Saliente" value="OUT" />
                    </Picker>
                </FormField>
            )}

            <FormField label="Categoría">
                <Picker
                    selectedValue={categoryId}
                    onValueChange={(v) => setCategoryId(v)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    {categories.map((c) => (
                        <Picker.Item key={c.id} label={c.name} value={c.id} />
                    ))}
                </Picker>
            </FormField>

            <FormField label="Wallet">
                <Picker
                    selectedValue={categoryId}
                    onValueChange={(v) => setWalletId(v)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                >
                    {wallets.map((c) => (
                        <Picker.Item key={c.id} label={c.name} value={c.id} />
                    ))}
                </Picker>
            </FormField>

            <FormField label="Fecha">
                <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>{format(date, "d 'de' MMMM yyyy", { locale: es })}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "default"}
                        onChange={(_, selectedDate) => {
                            setShowDatePicker(Platform.OS === "ios");
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}
            </FormField>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={{ color: "white", textAlign: "center" }}>
                    Crear Transacción
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12,
    },
    input: {
        paddingVertical: 16,
    },
    picker: {},
    pickerItem: {
        fontSize: 14,
        height: 128,
    },
    dateButton: {
        marginTop: 12
    },
    button: {
        paddingVertical: 12,
        backgroundColor: "rgba(0, 0, 0, 1)",
        borderRadius: 8,
    },
});
