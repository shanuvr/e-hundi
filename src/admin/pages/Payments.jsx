import { Copy, QrCode, Save, Wallet } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { TextInput, Select, Toggle } from '../components/Field';

const APPS = [
  { value: 'any', label: 'Any UPI app (Default)' },
  { value: 'gpay', label: 'Google Pay' },
  { value: 'phonepe', label: 'PhonePe' },
  { value: 'paytm', label: 'Paytm' },
  { value: 'bhim', label: 'BHIM' },
];

/** Mirrors the deep link a scan/QR tap opens. Static sample, per design-only scope. */
const DEEP_LINK =
  'upi://pay?pa=shrimahadeva@upi&pn=Shri%20Mahadeva%20Temple&am=340&cu=INR&tn=Devotional%20Offering';

export default function Payments() {
  return (
    <div className="max-w-5xl space-y-4">
      <PageHeader
        title="Payments / UPI"
        subtitle="Where your temple's offerings are sent, and what the donor sees at checkout."
        actions={<Button variant="primary" icon={Save}>Save changes</Button>}
      />

      <div className="space-y-3.5">
        <SectionCard
          title="UPI collection details"
          description="Offerings are collected directly to this virtual payment address."
          icon={Wallet}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <TextInput
              label="Temple UPI ID"
              defaultValue="shrimahadeva@upi"
              hint="The handle donors approve in their UPI app."
            />
            <TextInput
              label="Registered payee name"
              defaultValue="Shri Mahadeva Temple Trust"
              hint="Must match the name registered with your bank."
            />
            <Select label="Preferred UPI app" options={APPS} />
            <TextInput label="Settlement bank account" defaultValue="HDFC Bank •••• 4417" hint="Where cleared funds land." />
          </div>
        </SectionCard>

        <SectionCard
          title="Checkout & QR generation"
          description="What the donor sees on the kiosk while completing the offering."
          icon={QrCode}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* QR box */}
            <div>
              <p className="mb-2 text-xs font-bold text-stone-700">Counter QR Code</p>
              <div className="rounded-xl border border-stone-200 bg-white p-3 w-fit shadow-xs">
                {/* Decorative checkerboard */}
                <div className="w-28 h-28 grid grid-cols-8 gap-[2px]">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const finder =
                      (i < 24 && (i % 8 < 3 || i % 8 > 4) && Math.floor(i / 8) < 3) ||
                      (i >= 40 && (i % 8 < 3 || i % 8 > 4) && Math.floor(i / 8) > 4) ||
                      (i >= 16 && i < 24 && i % 8 >= 3 && i % 8 <= 4 && Math.floor(i / 8) < 2);
                    return (
                      <span
                        key={i}
                        className={`rounded-[1px] ${finder || (i * 7) % 5 < 2 ? 'bg-stone-900' : 'bg-stone-100'}`}
                      />
                    );
                  })}
                </div>
              </div>
              <p className="mt-2 text-[11px] text-stone-500 max-w-[14rem] leading-relaxed">
                Rendered on the kiosk screen with the exact offering amount attached.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-1.5 text-xs font-bold text-stone-700">Payment link preview</p>
                <div className="flex items-start gap-2">
                  <code className="flex-1 min-w-0 rounded-lg bg-stone-50 border border-stone-200 px-3 py-2 text-xs text-stone-800 font-mono break-all leading-relaxed shadow-2xs">
                    {DEEP_LINK}
                  </code>
                  <Button variant="ghost" className="shrink-0 px-2.5 py-2" icon={Copy} aria-label="Copy link" />
                </div>
                <p className="mt-1.5 text-[11px] text-stone-500 leading-relaxed">
                  Generated automatically per donation with chosen denomination.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <Toggle label="Accept UPI offerings" hint="Primary mode on digital hundi kiosks." defaultChecked />
                <Toggle label="Accept cash offerings at counter" hint="Staff confirms cash receipt manually." defaultChecked />
                <Toggle label="Print UPI transaction reference on physical receipt" defaultChecked />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
