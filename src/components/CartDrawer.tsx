import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import type { CartItem } from "../types/product";

const currencyFormatter = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
});

type CartDrawerProps = {
  open: boolean;
  items: CartItem[];
  subtotal: number;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
};

export default function CartDrawer({
  open,
  items,
  subtotal,
  onClose,
  onAdd,
  onDecrement,
  onRemove,
  onClear,
}: CartDrawerProps) {
  return (
    <>
      {open && (
        <button
          className="drawer-backdrop"
          type="button"
          onClick={onClose}
          aria-label="Stäng kundvagnen"
        />
      )}
      <aside
        className={`cart-drawer ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label="Kundvagn"
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Din beställning</p>
            <h2>Kundvagn</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Stäng kundvagnen" title="Stäng">
            <X size={21} aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={38} strokeWidth={1.5} aria-hidden="true" />
            <h3>Kundvagnen är tom</h3>
            <p>Lägg till produkter från sortimentet för att komma igång.</p>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-heading">
                    <div>
                      <h3>{item.name}</h3>
                      <span>{currencyFormatter.format(item.price)} / st</span>
                    </div>
                    <button className="icon-button subtle" type="button" onClick={() => onRemove(item.id)} aria-label={`Ta bort ${item.name}`} title="Ta bort">
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="quantity-row">
                    <div className="quantity-control" aria-label={`Antal ${item.name}`}>
                      <button type="button" onClick={() => onDecrement(item.id)} aria-label={`Minska antal ${item.name}`}>
                        <Minus size={16} aria-hidden="true" />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => onAdd(item)} disabled={item.quantity >= item.stock} aria-label={`Öka antal ${item.name}`}>
                        <Plus size={16} aria-hidden="true" />
                      </button>
                    </div>
                    <strong>{currencyFormatter.format(item.price * item.quantity)}</strong>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <div>
                <span>Delsumma</span>
                <strong>{currencyFormatter.format(subtotal)}</strong>
              </div>
              <p>Beställningsfunktionen läggs till i ett senare steg.</p>
              <button className="clear-cart-button" type="button" onClick={onClear}>
                <Trash2 size={17} aria-hidden="true" />
                Töm kundvagnen
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
