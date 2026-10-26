import { useState } from 'react';
import { CheckCircle2, Save, Sliders } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { Toggle } from '../components/Field';
import { useAdmin } from '../AdminContext';

export default function Branding() {
  const { temple } = useAdmin();
  const [toast, setToast] = useState(false);

  const handleSave = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-4">
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>Branding & motion preferences saved!</span>
        </div>
      )}

      <PageHeader
        title="Branding & Motion"
        subtitle={`Configure sacred animations and motion preferences for ${temple?.name || 'Temple'} kiosk.`}
        actions={
          <Button variant="primary" icon={Save} onClick={handleSave}>
            Save changes
          </Button>
        }
      />

      <div className="space-y-3.5">
        <SectionCard title="Motion & Sacred Atmosphere" description="Sacred animations on the kiosk display." icon={Sliders}>
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
