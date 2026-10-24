import PolicyLayout from './PolicyLayout';
import { AlertCircle, ShieldAlert, Landmark, Scale, CheckCircle2 } from 'lucide-react';

export default function Disclaimer() {
  return (
    <PolicyLayout
      title="Platform Disclaimer"
      subtitle="Important legal, regulatory, and operational disclaimers regarding Kanikkavanji.com."
      icon={AlertCircle}
      currentPath="/disclaimer"
    >
      {/* 1. Intermediary / Technology Platform Status */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <span>Technology Intermediary Notice</span>
        </div>
        <h2 className="text-xl font-bold font-philosopher text-stone-100">
          We Are a Technology Platform Only
        </h2>
        <p className="text-stone-300 text-sm leading-relaxed">
          <strong className="text-stone-100">Kanikkavanji.com</strong> is operated by <strong className="text-stone-100">Programers</strong>, Thrissur, Kerala. 
          The Company acts solely as a technology service provider and software intermediary.
        </p>
        <p className="text-stone-300 text-sm leading-relaxed">
          <strong className="text-amber-300">We are not a temple, religious trust, endowment board, non-profit society, or charity.</strong> We do not conduct religious rites, rituals, or pujas, nor do we manage the day-to-day spiritual affairs of any temple listed on this platform.
        </p>
      </div>

      {/* 2. Temple Content & Fund Responsibility */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-amber-400" />
          <span>Temple Information & Utilization of Offerings</span>
        </h3>
        <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
          <p>
            • <strong>Page Information:</strong> All text, announcements, timings, deity photographs, and festival notices published on each temple&apos;s page (<code className="text-amber-300 bg-stone-950 px-1 py-0.5 rounded text-xs">kanikkavanji.com/temple_name</code>) are provided directly by the respective temple authorities. While we perform baseline verification, the accuracy of temple history and notices is the sole responsibility of the temple.
          </p>
          <p>
            • <strong>Fund Custody & Utilization:</strong> Offerings are split automatically via <strong>Razorpay Route</strong> and settled directly to the temple’s official bank account. Programers does not hold, manage, or disburse donor funds. <strong>Each temple is independently and exclusively responsible</strong> for how it utilizes the offerings received for temple upkeep, rituals, or social work.
          </p>
        </div>
      </div>

      {/* 3. Tax Exemption Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Tax Notice</span>
        </div>
        <h3 className="text-base font-bold text-stone-100">
          No 80G Tax Exemption or Tax Deductible Receipts
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          Donations made through Kanikkavanji.com are <strong>not eligible for tax deduction under Section 80G</strong> of the Indian Income Tax Act. The platform does not issue 80G tax exemption certificates or income tax receipts. Devotees offer contributions purely out of voluntary devotion.
        </p>
      </div>

      {/* 4. Domestic Donors Only & FCRA Disclaimer */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 sm:p-8 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <span>FCRA Compliance: Indian Domestic Offerings Only</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          Under the Foreign Contribution (Regulation) Act (FCRA), this platform only accepts contributions originating from <strong>domestic Indian bank accounts and Indian UPI applications</strong> in Indian Rupees (INR). 
          Foreign contributions, international debit/credit cards, and Non-Resident Ordinary (NRO) / Non-Resident External (NRE) accounts not authorized under domestic guidelines are strictly prohibited.
        </p>
      </div>

      {/* 5. Limitation of Liability */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-stone-200">
          Limitation of Liability
        </h3>
        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
          Programers shall not be liable for any indirect, incidental, or consequential damages resulting from downtime of third-party payment gateways (Razorpay), banking network outages, or temple-level actions. In the event of a verified payment debit failure or double deduction, our liability is strictly limited to facilitating resolution within 7 business days.
        </p>
      </div>

      {/* Contact snippet */}
      <div className="p-5 rounded-xl bg-stone-900/30 border border-stone-800 text-xs text-stone-400">
        <p>
          <strong className="text-stone-300">Registered Office:</strong> Programers, 4th Floor, Park House, Thrissur, Kerala 680001, India. Contact: <a href="mailto:info@programers.in" className="text-amber-400 underline">info@programers.in</a> | Phone: <a href="tel:+919447151442" className="text-amber-400 underline">+91 9447151442</a>.
        </p>
      </div>
    </PolicyLayout>
  );
}
