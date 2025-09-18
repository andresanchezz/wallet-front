import { createContext, useContext, useState } from "react"
import { Wallet } from "../interfaces/wallet";
import { handleApiRequest } from "../utils/handleApiRequest";
import { WalletApi } from "../api/api";

type WalletContextType = {

    wallets: Wallet[],
    loadWallets: (userId: string) => void,
    createWallet: (wallet: Partial<Wallet>) => void;
    deleteWallet: (id: string) => void,

}

const WalletContext = createContext<WalletContextType>({
    wallets: [],
    loadWallets: () => { },
    createWallet: () => { },
    deleteWallet: () => { },
})

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [wallets, setWallets] = useState<Wallet[]>([]);

    const loadWallets = async (userId: string) => {

        setWallets([])

        const res = await handleApiRequest(() =>
            WalletApi().get<Wallet[]>("/wallet", { params: { userId } }), 'Cargados'
        );

        if (res) setWallets(res.data);
    };

    const createWallet = (wallet: Partial<Wallet>) => {
        // TODO: lógica para crear wallet
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
