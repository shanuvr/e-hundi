import PolicyLayout from './PolicyLayout';
import { Truck, CheckCircle2, ShieldCheck, MonitorCheck, HelpCircle } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      subtitle="Fulfillment policy regarding digital temple offerings and transactions on Kanikkavanji.com."
      icon={Truck}
      currentPath="/shipping-policy"
    >
      {/* Primary Statement */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <span>Digital Service & Offering Platform</span>
        </div>
        <h2 className="text-xl font-bold font-philosopher text-stone-100">
          No Physical Goods Sold or Shipped
        </h2>
        <p className="text-stone-300 text-sm leading-relaxed">
          <strong className="text-stone-100">Kanikkavanji.com</strong> is purely an online technology platform facilitating voluntary digital offerings and donations to verified Indian temples. 
        </p>
        <p className="text-stone-300 text-sm leading-relaxed">
          The platform does not sell, package, courier, or dispatch any tangible, physical merchandise, prasadam, or manufactured goods. Accordingly, <strong>no physical shipping or courier delivery services apply</strong> to any transaction on this platform.
        </p>
      </div>

      {/* Mode of Fulfillment */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <MonitorCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-stone-100">
              Instant On-Screen Digital Fulfillment
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              Upon successful payment authorization via UPI through Razorpay, delivery of the service is fulfilled <strong>immediately and digitally</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center gap-2 text-stone-200 text-sm font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant Confirmation Screen</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Devotees immediately see a sanctum Darshan screen confirming their offering amount, deity blessing, and Razorpay transaction identifier.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <div className="flex items-center gap-2 text-stone-200 text-sm font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SMS / UPI App Confirmation</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Devotees receive standard transactional debit notifications and UTR confirmation directly within their chosen UPI mobile banking application.
            </p>
          </div>
        </div>
      </div>

      {/* Indian Donors Only */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 space-y-2">
        <h3 className="text-sm font-semibold text-stone-100 flex items-center gap-2">
          <span>Domestic Indian Transactions Only</span>
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          Donations are accepted from Indian resident donors only through domestic Indian bank accounts and UPI IDs. The platform does not accept international or foreign cards/donations under FCRA regulations.
        </p>
      </div>

      {/* Support & Contact */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-2 text-xs text-stone-400">
        <h4 className="font-semibold text-stone-200 text-sm mb-1">Need Confirmation Support?</h4>
        <p className="text-stone-300">
          If your offering screen was interrupted during payment, please contact our support desk:
        </p>
        <p className="pt-1">
          <strong className="text-stone-300">Programers</strong> · 4th Floor, Park House, Thrissur, Kerala 680001, India<br />
          Helpline: <a href="tel:+919447151442" className="text-amber-400 underline">+91 9447151442</a> | Email: <a href="mailto:info@programers.in" className="text-amber-400 underline">info@programers.in</a>
        </p>
      </div>
    </PolicyLayout>
  );
}
