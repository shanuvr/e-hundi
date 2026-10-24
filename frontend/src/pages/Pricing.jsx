import PolicyLayout from './PolicyLayout';
import { IndianRupee, Check, ShieldCheck, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <PolicyLayout
      title="Pricing & Fee Structure"
      subtitle="Complete transparency: Zero deductions on donor offerings, and simple one-time onboarding for temples."
      icon={IndianRupee}
      currentPath="/pricing"
    >
      {/* Dual Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* For Devotees / Donors */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span>For Devotees & Donors</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold font-philosopher text-stone-100">₹0</span>
                <span className="text-stone-400 text-sm">/ Always Free</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">No platform cuts or hidden convenience fees</p>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed pt-2">
              Every single rupee offered by devotees goes directly to the intended sanctum without any deduction from Programers.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>0% Commission:</strong> No percentage deducted by us from your voluntary offering.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Account Needed:</strong> Pay directly via any Indian UPI app (GPay, PhonePe, Paytm).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Direct Settlement:</strong> Split settled instantly to the temple’s official bank account.</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-stone-800 text-xs text-stone-400">
            Dedicated entirely to devotional integrity.
          </div>
        </div>

        {/* For Temples */}
        <div className="bg-stone-900/80 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative shadow-lg shadow-amber-500/5">
          <div className="absolute top-0 right-0 bg-amber-500 text-stone-950 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl">
            Temple Onboarding
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <span>For Temple Trusts & Committees</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-bold font-philosopher text-amber-400">₹5,000</span>
                <span className="text-stone-400 text-sm">one-time setup</span>
              </div>
              <p className="text-xs text-amber-200/70 mt-1">Single registration fee · No recurring monthly software subscription</p>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed pt-2">
              Turnkey onboarding, verification, and provision of your branded digital hundi system.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Custom Dedicated URL:</strong> Your own portal (<code className="text-amber-300">kanikkavanji.com/your_temple</code>).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Razorpay Route Integration:</strong> Automated split settlements direct to the temple bank account.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>QR Code & Kiosk Ready:</strong> Ready for temple counter displays and kiosks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Admin Console Access:</strong> Real-time reporting, audit trail, and donation analytics.</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-stone-800">
            <Link
              to="/contact"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
            >
              <span>Register Your Temple</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Operational Principles FAQ */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-semibold font-philosopher text-amber-400">
          Frequently Asked Questions on Pricing
        </h3>

        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-stone-200 mb-1">
              Does Kanikkavanji take any percentage from devotee donations?
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              No. Programers does not take any percentage or commission from devotee donations. Standard banking and Razorpay gateway network charges may apply according to Razorpay merchant terms.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-800">
            <h4 className="font-semibold text-stone-200 mb-1">
              Who holds the donor money during payment?
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              We never hold donor money. Payments are processed by Razorpay and automatically split and settled into the temple’s designated bank account via Razorpay Route.
            </p>
          </div>

          <div className="pt-3 border-t border-stone-800">
            <h4 className="font-semibold text-stone-200 mb-1">
              Are there annual maintenance charges?
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Temples pay a one-time onboarding fee of ₹5,000 for verification, custom URL setup, and platform configuration. Any custom hardware or bespoke requirements are quoted separately on request.
            </p>
          </div>
        </div>
      </div>

      {/* Contact snippet */}
      <div className="p-4 rounded-xl bg-stone-900/30 border border-stone-800 text-xs text-stone-400 text-center">
        For temple registration inquiries, reach out at <a href="mailto:info@programers.in" className="text-amber-400 underline">info@programers.in</a> or call <a href="tel:+919447151442" className="text-amber-400 underline">+91 9447151442</a>.
      </div>
    </PolicyLayout>
  );
}
