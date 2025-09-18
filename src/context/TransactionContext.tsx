import { createContext, useContext, useState } from "react";
import { Transaction, TransactionResponse } from "../interfaces/transaction";
import { handleApiRequest } from "../utils/handleApiRequest";
import { WalletApi } from "../api/api";

type TransactionContextType = {
    transactions: Transaction[];
    transactionsByWallet: Record<string, Transaction[]>;
    setTransactionsByWallet: React.Dispatch<React.SetStateAction<Record<string, Transaction[]>>>;
    loadTransactions: (walletId?: string) => Promise<void>;
    loadMoreTransactions: (walletId?: string) => Promise<void>;
    hasMore: boolean;
    loading: boolean;
};

const TransactionContext = createContext<TransactionContextType>({
    transactions: [],
    transactionsByWallet: {},
    setTransactionsByWallet: () => { { } },
    loadTransactions: async () => { },
    loadMoreTransactions: async () => { },
    hasMore: true,
    loading: false,
});

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsByWallet, setTransactionsByWallet] = useState<Record<string, Transaction[]>>({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pagesByWallet, setPagesByWallet] = useState<Record<string, number>>({});
    const [totalPagesByWallet, setTotalPagesByWallet] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);

    const loadTransactions = async (walletId?: string) => {
        setLoading(true);

        const currentPage = walletId ? (pagesByWallet[walletId] || 1) : 1;

        const res = await handleApiRequest<TransactionResponse>(
            () =>
                WalletApi()
                    .get("/transaction", { params: { walletId, page: currentPage, limit: 10 } })
                    .then(res => res.data),
            "Transacciones cargadas"
        );

        if (res) {
            if (walletId) {
                setTransactionsByWallet(prev => ({ ...prev, [walletId]: res.items }));
                setPagesByWallet(prev => ({ ...prev, [walletId]: 1 }));
                setTotalPagesByWallet(prev => ({ ...prev, [walletId]: res.totalPages }));
            } else {
                setTransactions(res.items);
                setPage(1);
                setTotalPages(res.totalPages);
            }
        }

        setLoading(false);
    };

    const loadMoreTransactions = async (walletId?: string) => {
        if (loading) return;

        const currentPage = walletId ? (pagesByWallet[walletId] || 1) : page;
        const totalPagesCurrent = walletId ? (totalPagesByWallet[walletId] || 1) : totalPages;

        if (currentPage >= totalPagesCurrent) return;

        setLoading(true);
        const nextPage = currentPage + 1;

        const res = await handleApiRequest<TransactionResponse>(
            () =>
                WalletApi()
                    .get("/transaction", { params: { walletId, page: nextPage, limit: 10 } })
                    .then(res => res.data),
            ""
        );

        if (res) {
            if (walletId) {
                setTransactionsByWallet(prev => ({
                    ...prev,
                    [walletId]: [...(prev[walletId] || []), ...res.items]
                }));
                setPagesByWallet(prev => ({ ...prev, [walletId]: nextPage }));
                setTotalPagesByWallet(prev => ({ ...prev, [walletId]: res.totalPages }));
            } else {
                setTransactions(prev => [...prev, ...res.items]);
                setPage(nextPage);
                setTotalPages(res.totalPages);
            }
        }

        setLoading(false);
    };

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                transactionsByWallet,
                setTransactionsByWallet,
                loadTransactions,
                loadMoreTransactions,
                hasMore: page < totalPages,
                loading,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("useTransactions debe usarse dentro de un TransactionProvider");
    }
    return context;
};
