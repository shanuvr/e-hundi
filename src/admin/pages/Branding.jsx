import { Save, Sliders } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { Toggle } from '../components/Field';

export default function Branding() {
  return (
    <div className="max-w-4xl space-y-4">
      <PageHeader
        title="Branding & Motion"
        subtitle="Configure sacred animations and motion preferences for the temple kiosk."
        actions={<Button variant="primary" icon={Save}>Save changes</Button>}
      />

      <div className="space-y-3.5">
        <SectionCard title="Motion" description="Sacred animations on the kiosk." icon={Sliders}>
          <div className="space-y-3">
            <Toggle label="Rotating mandala" hint="The slow gold ring behind every screen." defaultChecked />
            <Toggle label="Floating diya flames" hint="Lit lamps on the welcome screen." defaultChecked />
            <Toggle label="Sparkle particles" hint="Six drifting points of light." defaultChecked />
            <Toggle
              label="Confetti on successful offering"
              hint="Gold burst fired as the darshan screen opens."
              defaultChecked
            />
            <Toggle
              label="Respect reduced-motion preference"
              hint="Follows the device's accessibility setting and disables the burst."
              defaultChecked
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
