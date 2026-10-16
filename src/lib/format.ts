const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const formatPrice = (value?: number | null): string =>
  typeof value === "number" && Number.isFinite(value)
    ? currencyFormatter.format(value)
    : "";

export const formatDate = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
};

export const formatDateTime = (value?: string | null): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${dateFormatter.format(date)} às ${date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

/**
 * Economia calculada apenas quando os dois preços existem e o original é maior.
 * Nunca inventamos desconto a partir de dados incompletos.
 */
export const computeSavings = (
  price?: number | null,
  originalPrice?: number | null,
): number | null => {
  if (typeof price !== "number" || typeof originalPrice !== "number") return null;
  if (!Number.isFinite(price) || !Number.isFinite(originalPrice)) return null;
  if (originalPrice <= price) return null;
  return Number((originalPrice - price).toFixed(2));
};

export const truncate = (value: string, max: number): string =>
  value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
