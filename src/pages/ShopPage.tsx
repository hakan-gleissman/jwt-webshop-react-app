import { AlertCircle, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import AppHeader from "../components/AppHeader";
import CartDrawer from "../components/CartDrawer";
import ProductCard from "../components/ProductCard";
import { getUser, logout } from "../services/authService";
import { getProducts, ProductApiError } from "../services/productService";
import type { CartItem, Product } from "../types/product";
import "./ShopPage.css";

const collator = new Intl.Collator("sv", { sensitivity: "base" });
const CART_KEY = "webshop_cart";

function readStoredCart(): CartItem[] {
  try {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export default function ShopPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>(readStoredCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await getProducts());
    } catch (requestError) {
      if (requestError instanceof ProductApiError && requestError.status === 401) {
        logout();
        navigate("/login", { replace: true });
        return;
      }
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Kunde inte hämta produkterna.",
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => collator.compare(a.name, b.name)),
    [products],
  );

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function addToCart(product: Product) {
    if (product.stock < 1) return;

    setCartItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === product.id);
      if (!existing) return [...currentItems, { ...product, quantity: 1 }];
      if (existing.quantity >= product.stock) return currentItems;

      return currentItems.map((item) =>
        item.id === product.id
          ? { ...product, quantity: item.quantity + 1 }
          : item,
      );
    });
  }

  function decrementCartItem(productId: number) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeCartItem(productId: number) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="shop-page">
      <AppHeader
        username={user?.subject ?? "användare"}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onLogout={handleLogout}
      />

      <main className="shop-main">
        <section className="shop-heading">
          <div>
            <p className="eyebrow">Webbshop</p>
            <h1>Produkter</h1>
            <p>Välj bland produkter i lager.</p>
          </div>
          {!loading && !error && (
            <span className="product-count">{products.length} produkter</span>
          )}
        </section>

        {loading && (
          <div className="status-panel" role="status">
            <RefreshCw className="spin" size={24} aria-hidden="true" />
            <span>Hämtar produkter...</span>
          </div>
        )}

        {!loading && error && (
          <div className="status-panel error-panel" role="alert">
            <AlertCircle size={25} aria-hidden="true" />
            <div>
              <h2>Produkterna kunde inte visas</h2>
              <p>{error}</p>
            </div>
            <button type="button" onClick={() => void loadProducts()}>
              <RefreshCw size={17} aria-hidden="true" />
              Försök igen
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="status-panel">
            <p>Det finns inga produkter att visa ännu.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <section className="category-section">
            <div className="category-heading">
              <h2>Alla produkter</h2>
              <span>{products.length}</span>
            </div>
            <div className="product-grid">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={
                    cartItems.find((item) => item.id === product.id)?.quantity ?? 0
                  }
                  onAdd={addToCart}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        items={cartItems}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onAdd={addToCart}
        onDecrement={decrementCartItem}
        onRemove={removeCartItem}
        onClear={() => setCartItems([])}
      />
    </div>
  );
}
