import { BillingCards } from '@/components/dashboard/billing-card';
export default function BillingPage() {
  return (
    <div className="container mx-auto pt-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground mt-1">
            Manage your billing information, view invoices, and update payment
            methods. Ensure your account remains active and uninterrupted.
          </p>
        </div>
      </div>

      {/* Billing Pricing Section */}
      <div className="">
        <BillingCards />
      </div>
    </div>
  );
}
