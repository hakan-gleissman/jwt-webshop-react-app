import { Package, Plus, ShoppingCart } from "lucide-react";
import type { Product } from "../types/product";

const currencyFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
});

type ProductCardProps = {
  product: Product;
  cartQuantity: number;
  onAdd: (product: Product) => void;
};

export default function ProductCard({
  product,
  cartQuantity,
  onAdd,
}: ProductCardProps) {
  const available = Math.max(product.stock - cartQuantity, 0);

  return (
    <article className="product-card">
      <div className="product-visual" aria-hidden="true">
        <Package size={34} strokeWidth={1.6} />
      </div>
      <div className="product-content">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>
        <div className="product-meta">
          <strong>{currencyFormatter.format(product.price)}</strong>
          <span className={available > 0 ? "stock-in" : "stock-out"}>
            {available > 0 ? `${available} i lager` : "Slut i lager"}
          </span>
        </div>
        <button
          className="add-button"
          type="button"
          onClick={() => onAdd(product)}
          disabled={available === 0}
        >
          {available === 0 ? <ShoppingCart size={18} /> : <Plus size={18} />}
          {available === 0 ? "Kan inte lägga till fler" : "Lägg i kundvagnen"}
        </button>
      </div>
    </article>
  );
}
