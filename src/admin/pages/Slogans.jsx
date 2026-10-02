import { Languages, MessageSquareQuote, Save, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { TextInput, TextArea, Toggle } from '../components/Field';

const ML = 'sm:[&_input]:font-malayalam sm:[&_textarea]:font-malayalam';

export default function Slogans() {
  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="Slogans & Text"
        subtitle="Every line of copy a donor reads on the kiosk. Give each one in Malayalam and English."
        actions={<Button variant="primary" icon={Save}>Save changes</Button>}
      />

      <div className="space-y-5">
        {/* Welcome */}
        <SectionCard
          title="Welcome screen"
          description="Screen 1 — the splash donors see while the kiosk warms up."
          icon={Sparkles}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Brand title" defaultValue="E-HUNDI" max={20} current={7} />
              <TextInput label="Brand subtitle" defaultValue="Digital Temple Offering" max={32} current={23} />
            </div>
            <TextArea
              label="Welcome quote"
              defaultValue="“Your Offering, A Blessing.”"
              rows={2}
              max={70}
              current={32}
              hint="Shown in italics beneath the ॐ symbol."
            />
            <Toggle
              label="Show the auto-advance progress bar"
              hint="The gold bar that fills over 3 seconds before moving to the hundi screen."
              defaultChecked
            />
          </div>
        </SectionCard>

        {/* Hundi */}
        <SectionCard
          title="Hundi screen"
          description="Screen 2 — the donation box donors interact with."
          icon={MessageSquareQuote}
        >
          <div className="space-y-4">
            <TextInput label="Screen label" defaultValue="Digital Hundi" max={24} current={14} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextArea
                label="Blessing (Malayalam)"
                defaultValue="ഭക്തിനിർഭരമായ ഓരോ സമർപ്പണവും അനന്തമായ പുണ്യവും ഐശ്വര്യവുമാകുന്നു"
                rows={2}
                max={90}
                current={76}
                className={ML}
              />
              <TextArea
                label="Blessing (English)"
                defaultValue="Every Sacred Offering Brings Divine Blessings"
                rows={2}
                max={90}
                current={45}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Total label" defaultValue="ആകെ" className={ML} max={16} current={4} />
              <TextInput label="Offer button" defaultValue="സമർപ്പിക്കുക" className={ML} max={24} current={11} />
            </div>

            <Toggle
              label="Show settlement text while the offering is processing"
              hint='Reads "Completing your offering" under the button during the 2 second wait.'
              defaultChecked
            />
          </div>
        </SectionCard>

        {/* Darshan */}
        <SectionCard
          title="Darshan & receipt"
          description="Screen 3 — shown after the offering is accepted."
          icon={Languages}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextArea
                label="Thanks (Malayalam)"
                defaultValue="നിങ്ങളുടെ സമർപ്പണം ദൈവം സ്വീകരിച്ചു"
                rows={2}
                max={70}
                current={36}
                className={ML}
              />
              <TextArea
                label="Thanks (English)"
                defaultValue="Your Offering Has Been Received"
                rows={2}
                max={70}
                current={34}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="View darshan button" defaultValue="ദർശനം കാണുക" className={ML} max={26} current={14} />
              <TextInput label="Make another offering" defaultValue="മറ്റൊരു സമർപ്പണം" className={ML} max={30} current={19} />
            </div>

            <TextInput label="Success heading" defaultValue="Payment Successful" max={28} current={19} />
            <TextInput
              label="Receipt footer note"
              defaultValue="Donations are tax exempt under 80G. Thank you for your offering."
              max={90}
              current={59}
              hint="Printed on the donor's receipt."
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
