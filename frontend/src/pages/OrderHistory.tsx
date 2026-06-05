import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import { getOrderHistory } from "@/services/orderHistoryService";

const formatter = new Intl.DateTimeFormat("pl-PL", {
  dateStyle: "medium",
  timeStyle: "short",
});

const OrderHistory = () => {
  const orders = useMemo(() => getOrderHistory(), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold text-foreground">Historia zamowien</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Lista zamowien zlozonych w tej aplikacji.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Nie masz jeszcze zapisanych zamowien.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">{order.id}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatter.format(new Date(order.createdAt))} - {order.customerName || order.customerEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{order.status}</p>
                    <p className="font-display text-2xl font-semibold text-primary">{order.total.toFixed(2)} zl</p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.bookId}`} className="grid grid-cols-[1fr_auto] gap-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-muted-foreground">{item.author}</p>
                      </div>
                      <p className="tabular-nums text-muted-foreground">
                        {item.quantity} x {item.price.toFixed(2)} zl
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-1 border-t border-border pt-4 text-sm text-muted-foreground sm:ml-auto sm:max-w-xs">
                  <div className="flex justify-between">
                    <span>Suma czesciowa</span>
                    <span>{order.subtotal.toFixed(2)} zl</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dostawa</span>
                    <span>{order.shipping.toFixed(2)} zl</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT</span>
                    <span>{order.tax.toFixed(2)} zl</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderHistory;
