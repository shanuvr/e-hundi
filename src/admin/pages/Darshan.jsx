import { CirclePlay, Clock, MessageCircle, Save } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button, UploadBox } from '../components/Controls';
import { TextInput, TextArea, Select, Toggle } from '../components/Field';

const DURATIONS = [
  { value: '15', label: '15 seconds' },
  { value: '30', label: '30 seconds' },
  { value: '60', label: '1 minute' },
  { value: '180', label: '3 minutes' },
];

export default function Darshan() {
  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        title="Darshan & Aarti Video"
        subtitle="The holy darshan video donors receive upon completing their offering, and how it reaches them."
        actions={<Button variant="primary" icon={Save}>Save changes</Button>}
      />

      <div className="space-y-5">
        <SectionCard
          title="Darshan video asset"
          description="Plays on the completion screen after an offering is accepted."
          icon={CirclePlay}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UploadBox label="Upload Aarti video" hint="MP4 or WebM · up to 25 MB" height="h-32" />
            <UploadBox label="Upload Video thumbnail" hint="Shown before playback starts" height="h-32" />
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="Direct video stream URL"
              defaultValue="https://cdn.shrimahadeva.temple/darshan/morning.mp4"
              hint="Or paste an existing hosted URL instead of uploading."
            />
            <Select label="Auto-play timeout on kiosk" options={DURATIONS} />
          </div>

          <div className="mt-4 space-y-3.5">
            <Toggle
              label="Lock darshan until offering is confirmed"
              hint="The darshan badge displays a sacred lock until UPI payment settles."
              defaultChecked
            />
            <Toggle label="Loop the aarti video continuously on darshan screen" defaultChecked />
            <Toggle label="Mute audio by default (recommended for busy temple halls)" defaultChecked />
          </div>
        </SectionCard>

        <SectionCard
          title="Digital delivery (WhatsApp & SMS)"
          description="How donors receive their blessed darshan video link on their phone."
          icon={MessageCircle}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="Temple WhatsApp sender ID"
                defaultValue="+91 98470 12345"
                hint="Darshan link and receipt are sent from this verified number."
              />
              <Select
                label="Preferred delivery channel"
                options={[
                  { value: 'whatsapp', label: 'WhatsApp (Rich card with video)' },
                  { value: 'sms', label: 'SMS text message' },
                  { value: 'both', label: 'WhatsApp + SMS backup' },
                  { value: 'none', label: 'On kiosk screen only' },
                ]}
              />
            </div>

            <TextArea
              label="Message template"
              defaultValue="Namaste! Your offering of ₹{amount} to Shri Mahadeva Temple is received. May the Lord bless you and your family. Watch your darshan: {link}"
              rows={3}
              max={220}
              current={145}
              hint="Use the dynamic tokens below to personalize the message."
            />

            <div className="flex flex-wrap gap-2">
              {['{amount}', '{link}', '{receipt}', '{temple}', '{name}'].map((t) => (
                <span
                  key={t}
                  className="rounded-lg bg-stone-950 border border-amber-500/30 px-2.5 py-1 text-xs font-mono font-semibold text-amber-200 shadow-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Aarti time schedule" description="Automatically swap the featured darshan video based on temple time." icon={Clock}>
          <div className="space-y-3">
            {[
              { slot: 'Morning Nirmalya Darshan', time: '05:30 – 09:30', file: 'morning_darshan.mp4', active: true },
              { slot: 'Midday Pooja & Aarti', time: '11:30 – 13:30', file: 'midday_aarti.mp4', active: false },
              { slot: 'Deeparadhana & Sandhya Aarti', time: '18:00 – 20:30', file: 'sandhya_deeparadhana.mp4', active: true },
            ].map((s) => (
              <div
                key={s.slot}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-700/80 bg-stone-950/70 px-4 py-3.5 shadow-sm"
              >
                <div className="w-9 h-9 shrink-0 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                  <CirclePlay className="w-4 h-4 text-amber-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-stone-100">{s.slot}</p>
                  <p className="text-xs text-stone-300 font-medium mt-0.5">
                    {s.time} · <span className="font-mono text-amber-200/80">{s.file}</span>
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                    s.active
                      ? 'bg-emerald-400/15 border-emerald-400/40 text-emerald-200'
                      : 'bg-stone-800 border-stone-600 text-stone-300 font-medium'
                  }`}
                >
                  {s.active ? '● Active' : '○ Standby'}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
