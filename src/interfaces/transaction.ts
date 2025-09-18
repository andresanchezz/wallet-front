export type TransactionType = 'EXPENSE' | 'INCOME' | 'TRANSFER' | 'INTEREST';

export interface TransactionResponse {
    items: Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}


export interface Transaction {
    id: string;
    wallet: {
        id: string,
        name: string
    };
    categoryId?: string;
    name: string;
    type: TransactionType;
    amount: number;
    date: string;
    createdAt?: string;
    transferId?: string;
    category: {
        id: string,
        name: string,
        icon: string,
    }
}

