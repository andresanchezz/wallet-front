import { Wallet } from "./wallet";

export interface User {
    id: string;
    name: string;
    createdAt?: string;
    wallets?: Wallet[];
}
