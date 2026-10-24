import PolicyLayout from './PolicyLayout';
import { RotateCcw, AlertTriangle, Clock, CheckCircle2, Phone, Mail, HelpCircle } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <PolicyLayout
      title="Refund & Cancellation Policy"
      subtitle="Clear, transparent terms regarding voluntary temple donations and payment failure resolutions."
      icon={RotateCcw}
      currentPath="/refund-policy"
    >
      {/* Primary Principle Card */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Core Principle</span>
        </div>
        <h2 className="text-xl font-bold font-philosopher text-stone-100">
          Temple Offerings are Voluntary & Strictly Non-Refundable
        </h2>
        <p className="text-stone-300 text-sm leading-relaxed">
          Donations made on <strong className="text-stone-100">Kanikkavanji.com</strong> are voluntary spiritual offerings (കാണിക്ക / വഴിപാട് / Hundi) dedicated to the respective deity and temple institution. 
        </p>
        <p className="text-stone-300 text-sm leading-relaxed">
          Once a transaction is successfully completed, the funds are automatically routed and settled directly to the temple’s registered bank account via <strong>Razorpay Route</strong>. Consequently, offerings cannot be cancelled, recalled, or refunded under ordinary circumstances.
        </p>
      </div>

      {/* No Tax Exemption Notice */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-2">
        <h3 className="text-base font-semibold text-stone-100 flex items-center gap-2">
          <span>No 80G Tax Certificates or Tax Exemptions</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          Donations made through this platform are <strong>not eligible for tax exemption</strong> under Section 80G of the Indian Income Tax Act. No donation tax receipts or 80G certificates are issued by Kanikkavanji.com or Programers.
        </p>
      </div>

      {/* Exception & Error Resolution */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-semibold font-philosopher text-amber-400">
          Exceptions: Technical Failures & Duplicate Debits
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          While voluntary donations cannot be revoked, we are committed to safeguarding devotees against technical errors or banking glitches. We handle the following two scenarios:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80">
            <h4 className="font-semibold text-stone-200 text-sm mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Failed Payment with Debit</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              If your bank account was debited via UPI, but the transaction timed out or showed a failure screen without generating a confirmation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800/80">
            <h4 className="font-semibold text-stone-200 text-sm mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Accidental Duplicate Charge</span>
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              If network lags caused your UPI application to process multiple identical debits for a single attempted offering.
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Resolution Turnaround */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-stone-100">
              Guaranteed 7-Day Resolution Window
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              In the event of a failed debit or duplicate payment, please notify us immediately. Our team will verify the payment log with Razorpay and the banking network and complete the resolution or refund to the original source account within <strong className="text-emerald-300">7 business days</strong>.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-800 text-xs text-stone-300 space-y-2">
          <p className="font-semibold text-stone-200">How to report a payment error:</p>
          <ul className="list-disc list-inside space-y-1 text-stone-400">
            <li>Email: <a href="mailto:info@programers.in" className="text-amber-400 underline font-mono">info@programers.in</a></li>
            <li>Helpline: <a href="tel:+919447151442" className="text-amber-400 underline font-mono">+91 9447151442</a></li>
            <li>Information needed: Date, Amount (₹), 12-digit UPI Reference (UTR), and Temple Name.</li>
          </ul>
        </div>
      </div>

      {/* Operating Entity Details */}
      <div className="p-5 rounded-xl bg-stone-900/30 border border-stone-800/80 text-xs text-stone-400">
        <p>
          <strong className="text-stone-300">Platform Operator:</strong> Programers, 4th Floor, Park House, Thrissur, Kerala 680001, India. Kanikkavanji is a technology intermediary only and does not hold donor funds.
        </p>
      </div>
    </PolicyLayout>
  );
}
