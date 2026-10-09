import { Image, Landmark, MapPin, Phone, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button, UploadBox } from '../components/Controls';
import { TextInput, Select } from '../components/Field';

const LANGUAGES = [
  { value: 'ml', label: 'മലയാളം (Malayalam)' },
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी (Hindi)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
];

export default function TempleProfile() {
  return (
    <div className="max-w-5xl space-y-4">
      <PageHeader
        title="Temple Profile"
        subtitle="How your temple appears to donors on the kiosk and on printed receipts."
        actions={<Button variant="primary" icon={Save}>Save changes</Button>}
      />

      <div className="space-y-3.5">
        <SectionCard
          title="Identity"
          description="Shown on the welcome screen badge and the donation receipt."
          icon={Landmark}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <TextInput
              label="Temple name (English)"
              defaultValue="Shri Mahadeva Temple"
              hint="Appears in the kiosk header and on every receipt."
            />
            <TextInput
              label="Temple name (Malayalam)"
              defaultValue="ശ്രീ മഹാദേവ ക്ഷേത്രം"
              className="sm:[&_input]:font-malayalam"
            />
            <TextInput label="Short name" defaultValue="Shri Mahadeva" hint="Used where space is tight." />
            <Select label="Primary language" options={LANGUAGES} />
          </div>
        </SectionCard>

        <SectionCard title="Assets" description="Logo and imagery used across the kiosk." icon={Image}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <UploadBox label="Temple logo" hint="PNG or SVG · max 2 MB" />
            <UploadBox label="Temple photograph" hint="Shown behind the mandala" />
          </div>
        </SectionCard>

        <SectionCard title="Contact" description="Used for darshan delivery and support." icon={Phone}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <TextInput label="Phone number" defaultValue="+91 471 234 5678" />
            <TextInput label="WhatsApp number" defaultValue="+91 98470 12345" hint="Darshan is sent to this number." />
            <TextInput label="Email" defaultValue="office@shrimahadeva.temple" className="sm:col-span-2" />
          </div>
        </SectionCard>

        <SectionCard title="Location" description="Appears on the receipt footer." icon={MapPin}>
          <div className="space-y-3">
            <TextInput
              label="Street address"
              defaultValue="East Fort, Marine Drive"
              className="sm:max-w-[60%]"
            />
            <TextInput label="City" defaultValue="Thiruvananthapuram" className="sm:max-w-[40%]" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <TextInput label="State" defaultValue="Kerala" />
              <TextInput label="PIN code" defaultValue="695001" />
              <TextInput label="GSTIN" defaultValue="32AAAAA0000A1Z5" />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
