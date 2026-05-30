import { useCart } from "@/hooks/useCart";
import { removeFromCart, updateQuantity, clearCart } from "@/services/cartService";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const CartSheet = () => {
  const { cart, count, total } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span className="hidden sm:inline">Koszyk</span>
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col [&>button:first-of-type]:hidden">
        <div className="flex items-center justify-between border-b border-border px-8 py-6">
          <SheetTitle className="font-display text-2xl font-normal tracking-[-0.015em]">
            Koszyk
          </SheetTitle>
          <SheetClose className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <X className="h-4 w-4" />
          </SheetClose>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Koszyk jest pusty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {cart.map((item) => (
                <div key={item.book.id} className="grid grid-cols-[56px_1fr_auto] gap-4 border-b border-border py-5 last:border-0">
                  <img
                    src={item.book.coverUrl}
                    alt={item.book.title}
                    className="h-[84px] w-14 rounded-sm object-cover"
                  />
                  <div className="space-y-1">
                    <h4 className="font-display text-sm font-medium leading-tight">
                      {item.book.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{item.book.author}</p>
                    <p className="text-xs text-muted-foreground">Dostepne: {item.book.stock}</p>
                    <div className="mt-2 flex h-8 w-fit items-center rounded-sm border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-8 rounded-none text-muted-foreground hover:text-foreground"
                        onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="min-w-[22px] text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-8 rounded-none text-muted-foreground hover:text-foreground"
                        disabled={item.quantity >= item.book.stock}
                        onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-sm tabular-nums text-foreground">
                      {(item.book.price * item.quantity).toFixed(2)} zł
                    </span>
                    <button
                      className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-destructive"
                      onClick={() => removeFromCart(item.book.id)}
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold">Suma</span>
                <span className="font-display text-2xl font-bold text-primary">
                  {total.toFixed(2)} zł
                </span>
              </div>
              <SheetClose asChild>
                <Link to="/zamowienie">
                  <Button className="w-full" size="lg">
                    Zamów
                  </Button>
                </Link>
              </SheetClose>
              <Button variant="ghost" className="w-full" onClick={clearCart}>
                Wyczyść koszyk
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
