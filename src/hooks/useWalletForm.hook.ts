import { useState } from "react";
import { useWallets } from "../context/WalletContext";
import { parseDecimalInput } from "../utils/number";
import { Alert } from "react-native";


export const useWalletForm = () => {
    const { createWallet } = useWallets();

    const [name, setName] = useState("");
    const [type, setType] = useState<"WALLET" | "CREDIT_CARD">("WALLET");
    const [interestRate, setInterestRate] = useState("");
    const [balance, setBalance] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetWForm = () => {
        setName("");
        setType("WALLET");
        setInterestRate("");
        setBalance("");
        setError(null);
        setLoading(false);
    };

    const handleSubmit = async (): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const walletData = {
                name,
                type,
                interestRate: type === "CREDIT_CARD" ? 0 : interestRate ? parseFloat(interestRate.replace(",", ".")) : 0,
                balance: type === "CREDIT_CARD" ? 0 : balance ? parseDecimalInput(balance) ?? 0 : 0,
            };

            const success = await createWallet(walletData);

            if (success) {
                resetWForm();
                return true;
            } else {
                setError("No se pudo crear la wallet");
                return false;
            }
        } catch (e: any) {
            setError(e.message ?? "Error al crear wallet");
            return false;
        } finally {
            setLoading(false);
        }
    };


    return {
        name,
        setName,
        type,
        setType,
        interestRate,
        setInterestRate,
        balance,
        setBalance,
        loading,
        error,
        resetWForm,
        handleSubmit, // 👉 retorna true/false
    };
};
