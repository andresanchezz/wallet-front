import { useState, useEffect } from "react";
import { WalletApi } from "../api/api";
import { handleApiRequest } from "../utils/handleApiRequest";

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER" | "INTEREST";
export type TransactionDirection = "IN" | "OUT";

export interface Category {
    id: string;
    name: string;
    icon?: string;
    color?: string; // simulamos que backend devuelve esto
}

export const useTransactionForm = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState<TransactionType>("EXPENSE");
    const [direction, setDirection] = useState<TransactionDirection>("OUT");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [walletId, setWalletId] = useState("");
    const [categoryId, setCategoryId] = useState("");

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // 🔹 cargar categorías desde el backend
    const loadCategories = async () => {
        setLoadingCategories(true);

        const res = await handleApiRequest<Category[]>(
            () => WalletApi().get("/category").then((r) => r.data),
            "Categorías cargadas"
        );

        if (res) {
            // si no hay color, dale rojo
            const withColors = res.map((c) => ({
                ...c,
                color: c.color || "#FF0000",
            }));
            setCategories(withColors);
        }

        setLoadingCategories(false);
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // 🔹 manejar submit
    const handleSubmit = async () => {
        const payload = {
            name,
            type,
            direction,
            amount: parseFloat(amount),
            date: date.toISOString(),
            walletId,
            categoryId,
        };

        console.log("Crear transacción", payload);

        // TODO: llamar al endpoint POST /transaction
        // await WalletApi().post("/transaction", payload);
    };

    const resetTForm = () => {
        setName("")
        setAmount("")
        setDate(new Date())
    }

    return {
        name,
        setName,
        type,
        setType,
        direction,
        setDirection,
        amount,
        setAmount,
        date,
        setDate,
        walletId,
        setWalletId,
        categoryId,
        setCategoryId,
        categories,
        loadingCategories,
        handleSubmit,
        resetTForm
    };
};
