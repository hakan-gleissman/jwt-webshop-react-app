import { LogOut, ShoppingBag, ShoppingCart } from "lucide-react";

type AppHeaderProps = {
  username: string;
  cartCount: number;
  onOpenCart: () => void;
  onLogout: () => void;
};

export default function AppHeader({
  username,
  cartCount,
  onOpenCart,
  onLogout,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <a className="brand" href="/shop" aria-label="Sprint Shop startsida">
          <span className="brand-icon" aria-hidden="true">
            <ShoppingBag size={22} />
          </span>
          <span>Sprint Shop</span>
        </a>

        <div className="header-actions">
          <span className="signed-in-user">Inloggad som {username}</span>
          <button className="header-button cart-button" type="button" onClick={onOpenCart}>
            <ShoppingCart size={18} aria-hidden="true" />
            Kundvagn
            <span className="cart-count" aria-label={`${cartCount} varor`}>
              {cartCount}
            </span>
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={onLogout}
            aria-label="Logga ut"
            title="Logga ut"
          >
            <LogOut size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
