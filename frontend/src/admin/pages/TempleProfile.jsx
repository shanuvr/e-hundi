import { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  Image as ImageIcon, 
  Landmark, 
  Lock, 
  MapPin, 
  Phone, 
  Save, 
  ShieldAlert 
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { TextInput, Select } from '../components/Field';
import { useAdmin } from '../AdminContext';

const LANGUAGES = [
  { value: 'ml', label: 'മലയാളം (Malayalam)' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
];

export default function TempleProfile() {
  const { temple, saveTemple, saving } = useAdmin();

  const [form, setForm] = useState({
    name: '',
    name_ml: '',
    short_name: '',
    slug: '',
    primary_language: 'ml',
    logo_url: '',
    phone: '',
    whatsapp: '',
    email: '',
    street_address: '',
    city: '',
    state: 'Kerala',
    pin_code: '',
    gstin: '',
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (temple) {
      setForm({
        name: temple.name || '',
        name_ml: temple.name_ml || '',
        short_name: temple.short_name || '',
        slug: temple.slug || '',
        primary_language: temple.primary_language || 'ml',
        logo_url: temple.logo_url || '',
        phone: temple.phone || '',
        whatsapp: temple.whatsapp || '',
        email: temple.email || '',
        street_address: temple.street_address || '',
        city: temple.city || '',
        state: temple.state || 'Kerala',
        pin_code: temple.pin_code || '',
        gstin: temple.gstin || '',
      });
    }
  }, [temple]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const res = await saveTemple(form);
    if (res.success) {
      setToast({ type: 'success', text: 'Temple profile updated successfully!' });
    } else {
      setToast({ type: 'error', text: res.error || 'Failed to update profile' });
    }
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="max-w-5xl space-y-4">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg font-bold text-xs animate-bounce ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-200" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      <PageHeader
        title="Temple Profile"
        subtitle={`Live configuration for ${temple?.name || 'your mandapam'}. How your temple appears on the kiosk and receipts.`}
        actions={
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        }
      />

      <form onSubmit={handleSave} className="space-y-3.5">
        <SectionCard
          title="Identity"
          description="Shown on the welcome screen badge, donor kiosk header, and printed receipts."
          icon={Landmark}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <TextInput
              label="Temple name (English)"
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Chinmaya Sri Bhuvaneswari Temple"
              hint="Appears in the kiosk header and on every receipt."
            />
            <TextInput
              label="Temple name (Malayalam)"
              value={form.name_ml}
              onChange={(e) => handleChange('name_ml', e.target.value)}
              placeholder="e.g. ചിന്മയ ശ്രീ ഭുവനേശ്വരി ക്ഷേത്രം"
              className="sm:[&_input]:font-malayalam"
              hint="Rendered in sacred Malayalam typography across screens."
            />
            <TextInput
              label="Short name"
              value={form.short_name}
              onChange={(e) => handleChange('short_name', e.target.value)}
              placeholder="e.g. Sri Bhuvaneswari"
              hint="Used in the navigation bar and compact displays."
            />
            <div>
              <TextInput
                label="Custom URL Slug (/templename)"
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="e.g. bhuvaneswari-temple"
                hint="Your temple's dedicated public address on E-Hundi."
              />
              {form.slug && (
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-800">
                  <span className="font-medium text-stone-500">Live Address:</span>
                  <a
                    href={`/${form.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-semibold underline hover:text-amber-950 inline-flex items-center gap-1"
                  >
                    /{form.slug}
                    <ExternalLink className="w-3 h-3 text-amber-700" />
                  </a>
                </div>
              )}
            </div>
            <Select
              label="Primary language"
              options={LANGUAGES}
              value={form.primary_language}
              onChange={(e) => handleChange('primary_language', e.target.value)}
              hint="Default audio chant and screen label language."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Visual Branding & Logo"
          description="Temple emblem or deity icon used on receipts and kiosk headers."
          icon={ImageIcon}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <TextInput
              label="Logo Image URL / Path"
              value={form.logo_url}
              onChange={(e) => handleChange('logo_url', e.target.value)}
              placeholder="/mandir-logo.png or https://cdn.temple.org/logo.png"
              hint="Direct link to temple logo PNG/SVG."
            />
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-center shrink-0 text-amber-800 font-bold overflow-hidden shadow-xs">
                {form.logo_url ? (
                  <img
                    src={form.logo_url}
                    alt="Logo preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="font-om text-xl leading-none">ॐ</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-stone-800 truncate">
                  {form.short_name || form.name || 'Emblem Preview'}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Live logo preview on kiosk badge
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Contact & Darshan Delivery"
          description="Used for sending digital darshan receipts and donor queries."
          icon={Phone}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <TextInput
              label="Phone number"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+91 471 234 5678"
            />
            <TextInput
              label="WhatsApp number"
              value={form.whatsapp}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="+91 98470 12345"
              hint="Digital receipt messages are triggered from this number."
            />
            <TextInput
              label="Administrator Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="office@temple.org"
              className="sm:col-span-2"
              hint="Primary administrative contact and notification email."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Location & Receipt Metadata"
          description="Location details printed at the footer of 80G tax donation receipts."
          icon={MapPin}
        >
          <div className="space-y-3">
            <TextInput
              label="Street address"
              value={form.street_address}
              onChange={(e) => handleChange('street_address', e.target.value)}
              placeholder="Temple Road, East Gate"
              className="sm:max-w-[70%]"
            />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <TextInput
                label="City / Town"
                value={form.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Thiruvananthapuram"
                className="sm:col-span-2"
              />
              <TextInput
                label="State"
                value={form.state}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="Kerala"
              />
              <TextInput
                label="PIN code"
                value={form.pin_code}
                onChange={(e) => handleChange('pin_code', e.target.value)}
                placeholder="695001"
              />
            </div>
            <div className="sm:max-w-[40%]">
              <TextInput
                label="GSTIN / Trust Tax Registration"
                value={form.gstin}
                onChange={(e) => handleChange('gstin', e.target.value)}
                placeholder="32AAAAA0000A1Z5"
              />
            </div>
          </div>
        </SectionCard>

        {/* Banking Notice */}
        <div className="rounded-xl border border-stone-200 bg-amber-50/50 p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-800 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="min-w-0 text-xs">
            <p className="font-semibold text-stone-800">
              Verified Settlement Bank Account
            </p>
            <p className="mt-0.5 text-stone-600 leading-relaxed text-[11.5px]">
              Bank: <span className="font-semibold text-stone-900">{temple?.bank_name || 'Verified Bank'}</span> · 
              Payee: <span className="font-semibold text-stone-900">{temple?.bank_account_holder || temple?.name || 'Verified Payee'}</span> · 
              A/C: <span className="font-mono text-stone-700">•••• {temple?.bank_account_number?.slice(-4) || '----'}</span>
            </p>
            <p className="mt-1 text-[11px] text-stone-500">
              For security compliance, bank settlement details are exclusive to Superadmin and locked for temple consoles.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            disabled={saving}
            className="px-6 py-2.5 text-xs sm:text-sm"
          >
            {saving ? 'Saving changes…' : 'Save Temple Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
