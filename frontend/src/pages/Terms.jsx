import PolicyLayout from './PolicyLayout';
import { FileText, AlertTriangle, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

export default function Terms() {
  return (
    <PolicyLayout
      title="Terms and Conditions"
      subtitle="Please review the operational terms and conditions governing the use of Kanikkavanji.com."
      icon={FileText}
      currentPath="/terms"
    >
      {/* Intro Badge */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <span>Last Updated: October 2026</span>
        </div>
        <p className="text-stone-300 text-sm leading-relaxed">
          Welcome to <strong className="text-stone-100">Kanikkavanji.com</strong> (&quot;Platform&quot;), owned and operated by <strong className="text-stone-100">Programers</strong>, located at 4th Floor, Park House, Thrissur, Kerala 680001, India (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
        </p>
        <p className="text-stone-300 text-sm leading-relaxed">
          By accessing or utilizing our platform as a devotee (donor) or registering as a temple committee/trust, you agree to comply with and be bound by the following terms and conditions.
        </p>
      </div>

      {/* 1. Nature of the Platform */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <span>1. Nature of the Platform & Intermediary Role</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          Kanikkavanji.com is solely a <strong>technology platform and intermediary</strong> that enables registered temples across India to accept digital voluntary offerings via Unified Payments Interface (UPI).
        </p>
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-stone-300 leading-relaxed">
          <strong className="text-amber-400 font-semibold">Important Declaration:</strong> We are not a temple, religious trust, endowment committee, charity, or financial institution. We do not solicit donations for ourselves nor do we manage religious rituals.
        </div>
      </div>

      {/* 2. Direct Settlement & Fund Custody */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <span>2. Payment Processing & Direct Settlement</span>
        </h3>
        <ul className="space-y-2.5 text-sm text-stone-300">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>All payments are securely processed by authorized payment aggregator <strong>Razorpay</strong>.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Each donation is split automatically using <strong>Razorpay Route</strong> and settled directly to the designated temple’s verified bank account.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong className="text-stone-100">Zero Fund Custody:</strong> Kanikkavanji.com and Programers do not hold, pool, or pass on donor money at any point in time.</span>
          </li>
        </ul>
      </div>

      {/* 3. Donor Terms */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <span>3. Devotee (Donor) Terms</span>
        </h3>
        <div className="space-y-2 text-sm text-stone-300 leading-relaxed">
          <p>
            • <strong>No Account Required:</strong> Devotees can offer contributions directly on a temple&apos;s page (<code className="text-amber-300 bg-stone-950 px-1 py-0.5 rounded text-xs">kanikkavanji.com/temple_name</code>) without registering an account or logging in.
          </p>
          <p>
            • <strong>Voluntary & Non-Refundable:</strong> All offerings made through Kanikkavanji.com are entirely voluntary devotional offerings. Once confirmed, offerings cannot be cancelled, reversed, or refunded.
          </p>
          <p>
            • <strong>No Tax Exemption / No 80G:</strong> Donations made via this platform are not eligible for tax deductions under Section 80G of the Indian Income Tax Act. No 80G receipts or official tax certificates are issued by the platform.
          </p>
          <p>
            • <strong>Domestic Indian Donors Only:</strong> Devotees must use Indian bank accounts, Indian UPI apps, and INR currency. Foreign donations and international cards are strictly blocked under Foreign Contribution Regulation Act (FCRA) rules.
          </p>
        </div>
      </div>

      {/* 4. Temple Terms & Registration */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <span>4. Temple Registration & Platform Fees</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          Temples register with Programers to obtain their dedicated digital hundi page.
        </p>
        <ul className="space-y-2 text-sm text-stone-300">
          <li>
            • <strong>Registration Fee:</strong> Participating temples pay a <strong>one-time setup and registration fee of ₹5,000</strong> to Programers for digital setup, verification, and onboarding.
          </li>
          <li>
            • <strong>Zero Commission on Donations:</strong> Programers does not deduct any percentage, commission, or transaction cut from donor offerings. 100% of the donated sum is routed to the temple account.
          </li>
          <li>
            • <strong>Content Responsibility:</strong> The text, deity photography, daily rituals, and details on each temple page are supplied by the temple authorities. The temple assumes full legal and spiritual responsibility for fund utilization.
          </li>
        </ul>
      </div>

      {/* 5. Payment Errors & Grievances */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <span>5. Payment Errors & Resolution Turnaround</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          In cases where a devotee is debited twice due to network latency, or where an amount is deducted but payment status failed, the devotee should contact <strong className="text-amber-400">info@programers.in</strong> or <strong className="text-amber-400">+91 9447151442</strong> with proof of debit. We will coordinate with Razorpay and resolve the complaint within <strong>7 business days</strong>.
        </p>
      </div>

      {/* 6. Governing Law & Jurisdiction */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-2">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>6. Governing Law and Jurisdiction</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          These Terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with the platform shall be subject to the exclusive jurisdiction of the competent courts in <strong>Thrissur, Kerala, India</strong>.
        </p>
      </div>
    </PolicyLayout>
  );
}
