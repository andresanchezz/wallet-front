export type WalletType = 'WALLET' | 'CREDIT_CARD';

export interface Wallet {
    id: string;
    userId: string;           // existe en Prisma
    name: string;             // unificado con Prisma (antes era bank)
    type: WalletType;         // Prisma lo tiene como string, lo normalizamos a enum
    balance: number;          // Decimal → number
    interestRate?: number;    // puede ser null en Prisma
    accruedInterest?: number; // puede ser null en Prisma
}
