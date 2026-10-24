import PolicyLayout from './PolicyLayout';
import { ShieldCheck, Lock, Eye, Server, UserCheck, HelpCircle } from 'lucide-react';

export default function Privacy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="How Kanikkavanji.com and Programers protect and handle your personal and transactional information."
      icon={ShieldCheck}
      currentPath="/privacy"
    >
      {/* Privacy Commitment */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <span>Effective Date: October 2026</span>
        </div>
        <p className="text-stone-300 text-sm leading-relaxed">
          <strong className="text-stone-100">Programers</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), operating <strong className="text-stone-100">Kanikkavanji.com</strong>, respects the privacy of devotees, visitors, and participating temple administrations. This policy explains our minimal-data practices.
        </p>
      </div>

      {/* 1. Frictionless & No-Account Philosophy */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>1. No Devotee Accounts Required</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          We believe spiritual offerings should be frictionless. Donors do <strong>not</strong> need to register an account, create a password, or maintain a profile on Kanikkavanji.com to make an offering.
        </p>
      </div>

      {/* 2. Information We Collect */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-400" />
          <span>2. Information We Process</span>
        </h3>
        <div className="space-y-3 text-sm text-stone-300">
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <h4 className="font-semibold text-stone-200 mb-1">A. Donor Transaction Metadata</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              When you make an offering, our payment partner Razorpay collects the donation amount, your UPI Virtual Payment Address (VPA) / mobile number, and returns a unique Razorpay Payment ID to generate your on-screen confirmation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <h4 className="font-semibold text-stone-200 mb-1">B. Temple Administration Details</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              For registered temples: Temple name, registered address, authorized contact person credentials, and official bank account details required for direct split settlements via Razorpay Route.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Financial & Payment Credentials Security */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>3. Financial Security & Razorpay Handling</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          <strong>We never store sensitive banking credentials.</strong> All financial processing is handled end-to-end by <strong className="text-stone-100">Razorpay</strong> in full compliance with RBI regulations and PCI-DSS Level 1 standards. 
          Your UPI PIN, net banking credentials, or bank passwords never touch our servers.
        </p>
      </div>

      {/* 4. Use and Sharing of Information */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-3">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-400" />
          <span>4. Zero Commercial Data Selling</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          We strictly do <strong>not</strong> sell, rent, monetize, or trade your personal or transactional details with marketing companies or advertisers.
          Information is shared only with:
        </p>
        <ul className="list-disc list-inside text-xs text-stone-300 space-y-1.5 pl-2">
          <li><strong>Razorpay:</strong> To process payments and execute automatic Route splits directly to the temple.</li>
          <li><strong>Law Enforcement / Regulatory Authorities:</strong> Only when strictly mandated by Indian law or judicial orders.</li>
        </ul>
      </div>

      {/* 5. Contact Information */}
      <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 space-y-2">
        <h3 className="text-base font-semibold text-amber-400 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>5. Privacy Officer & Contact</span>
        </h3>
        <p className="text-stone-300 text-sm leading-relaxed">
          If you have any questions regarding your transaction data or privacy practices, please contact our team at:
        </p>
        <div className="text-xs text-stone-400 pt-1 space-y-1">
          <p><strong className="text-stone-200">Programers</strong></p>
          <p>4th Floor, Park House, Thrissur, Kerala 680001, India</p>
          <p>Email: <a href="mailto:info@programers.in" className="text-amber-400 underline">info@programers.in</a> | Phone: <a href="tel:+919447151442" className="text-amber-400 underline">+91 9447151442</a></p>
        </div>
      </div>
    </PolicyLayout>
  );
}
