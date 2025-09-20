// utils/number.ts
export const parseDecimalInput = (value?: string): number | null => {
    if (!value && value !== "0") return null;
    const normalized = String(value).replace(/\s+/g, '').replace(',', '.');
    const num = Number(normalized);
    return Number.isFinite(num) ? num : null;
};
