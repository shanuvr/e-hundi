import { AlertTriangle, Bell, Globe, Monitor, RefreshCw, Save, ShieldCheck, Smartphone } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { Select, TextInput, Toggle } from '../components/Field';

const LANGUAGES = [
  { value: 'ml', label: 'മലയാളം (Malayalam) — primary' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
];

const DEVICES = [
  { name: 'Hundi Kiosk 01', where: 'Main entrance gate', online: true, last: '12s ago' },
  { name: 'Hundi Kiosk 02', where: 'Temple Mandapam hall', online: true, last: '1m ago' },
  { name: 'Hundi Kiosk 03', where: 'Devaswom Office counter', online: false, last: '3 days ago' },
];

export default function Settings() {
  return (
    <div>
      <PageHeader
        title="Settings & System"
        subtitle="Language, paired kiosk devices, security alerts, and account controls for this temple."
        actions={<Button variant="primary" icon={Save}>Save changes</Button>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard title="Language & Regional Settings" description="Default language and formatting for the kiosk and printed receipts." icon={Globe}>
          <div className="space-y-4">
            <Select label="Default kiosk language" options={LANGUAGES} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Currency format"
                options={[
                  { value: 'in', label: 'Indian (₹ 1,23,456)' },
                  { value: 'int', label: 'International (₹ 123,456)' },
                ]}
              />
              <Select
                label="Time zone"
                options={[
                  { value: 'ist', label: 'IST (UTC+5:30 — India)' },
                  { value: 'utc', label: 'UTC' },
                ]}
              />
            </div>
            <Toggle label="Show bilingual Malayalam & English text" hint="Disabling shows only the chosen single language on screen." defaultChecked />
          </div>
        </SectionCard>

        <SectionCard
          title="Paired Kiosk Hardware"
          description="Active Android & touchscreen terminals running E-Hundi."
          icon={Monitor}
          footer={
            <Button variant="outline" icon={Smartphone} className="w-full py-2.5">
              Pair a new hardware terminal
            </Button>
          }
        >
          <div className="space-y-3">
            {DEVICES.map((d) => (
              <div
                key={d.name}
                className="flex items-center gap-3.5 rounded-xl border border-stone-700/80 bg-stone-950/70 px-4 py-3.5 shadow-sm"
              >
                <div
                  className={`w-9 h-9 shrink-0 rounded-xl border flex items-center justify-center shadow-sm ${
                    d.online
                      ? 'bg-emerald-400/15 border-emerald-400/40 text-emerald-300'
                      : 'bg-stone-800 border-stone-600 text-stone-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-stone-100 truncate">{d.name}</p>
                  <p className="text-xs text-stone-300 font-medium mt-0.5">
                    {d.where} · <span className="text-amber-200/80">{d.last}</span>
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                    d.online
                      ? 'bg-emerald-400/15 border-emerald-400/40 text-emerald-200'
                      : 'bg-stone-800 border-stone-600 text-stone-300 font-medium'
                  }`}
                >
                  {d.online ? '● Online' : '○ Offline'}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notifications & Alerts" description="Configured alerts sent to temple administrators." icon={Bell}>
          <div className="space-y-4">
            <Toggle
              label="Daily collection summary notification"
              hint="Automated summary sent every morning at 08:00 AM."
              defaultChecked
            />
            <Toggle
              label="Alert on pending / unconfirmed settlements"
              hint="Triggered if a high-value donation does not clear within 15 minutes."
              defaultChecked
            />
            <Toggle
              label="Kiosk offline / disconnected alert"
              hint="Triggered when a paired device loses internet or power for over 30 minutes."
              defaultChecked
            />
            <Toggle
              label="Weekly 80G tax audit report"
              hint="Automatically emailed to registered temple trustees and auditors."
              defaultChecked
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <TextInput label="Alert recipient email" defaultValue="office@shrimahadeva.temple" />
              <TextInput label="Alert recipient phone" defaultValue="+91 471 234 5678" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Security & Authentication" description="Console access controls and cryptographic security." icon={ShieldCheck}>
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-4 py-3.5 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-200">Two-Factor Authentication Active</p>
                <p className="mt-0.5 text-xs text-stone-200">Hardware token & authenticator app verified today.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Admin master email" defaultValue="admin@shrimahadeva.temple" />
              <TextInput label="Temple trust ID" defaultValue="TT-KLM-004821" />
            </div>
            <Toggle label="Enable automatic firmware updates on kiosks" hint="Ensures terminals receive security patches seamlessly." defaultChecked />
            <Toggle label="Require staff biometric/PIN for counter cash receipt" defaultChecked />
          </div>
        </SectionCard>

        <SectionCard
          className="xl:col-span-2"
          title="Danger Zone"
          description="High-impact actions affecting physical kiosks and data caches."
          icon={AlertTriangle}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-rose-400/35 bg-rose-500/10 px-4 py-4 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-rose-200">Reset kiosk caches and configurations</p>
              <p className="mt-1 text-xs text-stone-200 leading-relaxed font-normal">
                Wipes offline caches across all paired terminals. Donation ledger and UPI records remain secure.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Button variant="ghost" icon={RefreshCw}>
                Re-sync build
              </Button>
              <Button variant="danger">Reset all kiosks</Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
