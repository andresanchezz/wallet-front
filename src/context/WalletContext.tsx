import { createContext, useContext, useState } from "react"
import { Wallet } from "../interfaces/wallet";
import { handleApiRequest } from "../utils/handleApiRequest";
import { WalletApi } from "../api/api";
import { useUser } from "./UserContext";

type WalletContextType = {

    wallets: Wallet[],
    loadWallets: (userId: string) => void,
    createWallet: (wallet: Partial<Wallet>) => Promise<boolean>;
    deleteWallet: (id: string) => void,

}

const WalletContext = createContext<WalletContextType>({
    wallets: [],
    loadWallets: () => { },
    createWallet: async () => false,
    deleteWallet: () => { },
})

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [wallets, setWallets] = useState<Wallet[]>([]);

    const { userId } = useUser();

    const loadWallets = async () => {

        setWallets([])

        const res = await handleApiRequest(() =>
            WalletApi().get<Wallet[]>("/wallet", { params: { userId } }), 'Cargados'
        );

        if (res) setWallets(res.data);
    };

    const createWallet = async (wallet: Partial<Wallet>): Promise<boolean> => {
        const tempWallet: Wallet = {
            id: Math.random().toString(),
            name: wallet.name || "",
            type: wallet.type || "WALLET",
            interestRate: wallet.interestRate || 0,
            balance: wallet.balance || 0,
            userId: userId!,
        };

        setWallets((prev) => [...prev, tempWallet]);

        try {
            const res = await handleApiRequest(() =>
                WalletApi().post<Wallet>("/wallet", { ...wallet, userId }),
                "Wallet creada"
            );

            if (res) {
                setWallets((prev) =>
                    prev.map((w) => (w.id === tempWallet.id ? res.data : w))
                );
                return true;
            } else {
                setWallets((prev) => prev.filter((w) => w.id !== tempWallet.id));
                return false;
            }
        } catch (error) {
            setWallets((prev) => prev.filter((w) => w.id !== tempWallet.id));
            return false;
        }
    };

    const deleteWallet = (id: string) => {
        // TODO: lógica para eliminar wallet
    };

    return (
        <WalletContext.Provider value={{ wallets, loadWallets, createWallet, deleteWallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallets = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallets debe usarse dentro de un WalletProvider");
    }
    return context;
};
