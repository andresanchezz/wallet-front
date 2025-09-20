export const cleanCurrencyInput = (value: string): string => {
    return value.replace(/[^\d,.-]/g, "");
};
