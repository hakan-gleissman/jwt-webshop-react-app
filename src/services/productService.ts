import type { Product } from "../types/product";
import { getToken } from "./authService";

const PRODUCT_API_BASE =
  import.meta.env.VITE_PRODUCT_API_BASE_URL ?? "http://localhost:8081";

export class ProductApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function getProducts(): Promise<Product[]> {
  const token = getToken();
  const response = await fetch(`${PRODUCT_API_BASE}/products`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new ProductApiError(
      `Kunde inte hämta produkterna (${response.status}).`,
      response.status,
    );
  }

  return response.json() as Promise<Product[]>;
}
