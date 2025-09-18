import { Transaction } from "../interfaces/transaction";

type Section = {
  title: string;
  data: Transaction[];
};

export const groupTransactionsByDate = (transactions: Transaction[]): Section[] => {
  const groups: Record<string, Transaction[]> = {};

  transactions.forEach(tx => {
    const dateObj = new Date(tx.date);
    // Formato YYYY-MM-DD para agrupar
    const dayKey = dateObj.toISOString().split("T")[0];

    if (!groups[dayKey]) groups[dayKey] = [];
    groups[dayKey].push(tx);
  });

  // Convertir a array de secciones y formatear el título
  return Object.entries(groups)
    .sort(([a], [b]) => (a > b ? -1 : 1)) // ordenar descendente
    .map(([dayKey, data]) => {
      const dateObj = new Date(dayKey);
      // Formatear a "Mayo 15 de 2025"
      const title = dateObj.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return { title, data };
    });
};
