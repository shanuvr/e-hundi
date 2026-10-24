import PolicyLayout from './PolicyLayout';
import { Info, Building, ShieldCheck, Heart, Zap, Landmark, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <PolicyLayout
      title="About Kanikkavanji"
      subtitle="Digital temple offering platform connecting devotees and sanctums across India with absolute transparency."
      icon={Info}
      currentPath="/about"
    >
      {/* Overview Card */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <h2 className="text-xl font-semibold font-philosopher text-amber-400 mb-4 flex items-center gap-2">
          <span>Who We Are</span>
        </h2>
        <p className="text-stone-300 leading-relaxed mb-4">
          <strong className="text-stone-100">Kanikkavanji.com</strong> is a dedicated online donation platform engineered specifically for temples in India. 
          Owned and operated by <strong className="text-stone-100">Programers</strong>, based in Thrissur, Kerala, our mission is to empower traditional sanctums with contemporary digital financial technology.
        </p>
        <p className="text-stone-300 leading-relaxed">
          In ancient temple traditions, the <em>Kanikkavanji</em> (കാണിക്കവഞ്ചി / Hundi) symbolizes humble, voluntary devotion. We bring this sacred ritual into the modern era, enabling devotees to offer their prayers and contributions securely from anywhere in India using familiar UPI interfaces.
        </p>
      </div>

      {/* Technology Platform Only Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-stone-100">
              Technology Platform Only
            </h3>
            <p className="text-stone-300 text-sm leading-relaxed">
              We are strictly a <strong>technology provider</strong>. We are not a temple, religious trust, endowment board, or charity. 
              We provide the digital software infrastructure that allows verified Indian temples to receive direct electronic offerings.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold font-philosopher text-stone-100">
          How Kanikkavanji Operates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h4 className="font-semibold text-stone-200 mb-2">Dedicated Temple URL</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Temples register and receive their own dedicated digital kiosk page at <code className="text-amber-300 bg-stone-950 px-1.5 py-0.5 rounded text-[11px]">kanikkavanji.com/temple_name</code>.
            </p>
          </div>

          <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h4 className="font-semibold text-stone-200 mb-2">Frictionless UPI</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Devotees simply open the page, choose their offering amount, and pay instantly via UPI through Razorpay. No account or password required.
            </p>
          </div>

          <div className="bg-stone-900/40 border border-stone-800/80 rounded-xl p-5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h4 className="font-semibold text-stone-200 mb-2">Direct Settlement</h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Donations are split automatically using <strong>Razorpay Route</strong> and settled directly into the respective temple's bank account. We never hold donor funds.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold font-philosopher text-amber-400 mb-4">
          Our Operational Pillars
        </h2>
        <ul className="space-y-3.5 text-sm text-stone-300">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong className="text-stone-100">Zero Donor Deduction:</strong> No transaction fees, convenience charges, or commissions are deducted from devotees' contributions. 100% of your offering reaches the temple.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong className="text-stone-100">Zero Fund Holding:</strong> Payments are processed directly through Razorpay Route split settlement. Kanikkavanji never retains custody of religious offerings.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong className="text-stone-100">Domestic Indian Offerings Only:</strong> In strict compliance with regulatory frameworks, the platform only facilitates contributions from Indian domestic donors. Foreign contributions are not supported.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong className="text-stone-100">Temple Autonomy:</strong> All text, announcements, and deity details on each temple page are supplied by the respective temple authority. Each temple is solely responsible for its funds.</span>
          </li>
        </ul>
      </div>

      {/* Operational Details */}
      <div className="bg-stone-900/30 border border-stone-800/80 rounded-xl p-5 text-xs text-stone-400">
        <p>
          <strong className="text-stone-300">Entity Details:</strong> Kanikkavanji.com is owned and operated by Programers, 4th Floor, Park House, Thrissur, Kerala 680001, India. For inquiries or operational assistance, email <a href="mailto:info@programers.in" className="text-amber-400 underline">info@programers.in</a> or call <a href="tel:+919447151442" className="text-amber-400 underline">+91 9447151442</a>.
        </p>
      </div>
    </PolicyLayout>
  );
}
