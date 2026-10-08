import { useState, useRef, useEffect } from 'react';
import { 
  Languages, 
  MessageSquareQuote, 
  Save, 
  Sparkles, 
  Video, 
  UploadCloud, 
  CheckCircle2, 
  RefreshCw, 
  Play, 
  Volume2, 
  Film,
  FileVideo
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { TextInput, TextArea, Toggle } from '../components/Field';

const ML = 'sm:[&_input]:font-malayalam sm:[&_textarea]:font-malayalam';
const DEFAULT_VIDEO_SRC = '/vedio.mp4';
const DEFAULT_VIDEO_NAME = 'vedio.mp4 (Sacred Temple Darshan)';
const DEFAULT_VIDEO_SIZE = '14.8 MB';

export default function Slogans() {
  const fileInputRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(DEFAULT_VIDEO_SRC);
  const [videoName, setVideoName] = useState(DEFAULT_VIDEO_NAME);
  const [videoSize, setVideoSize] = useState(DEFAULT_VIDEO_SIZE);
  const [isDragging, setIsDragging] = useState(false);
  const [savedToast, setSavedToast] = useState('');
  const [directUrl, setDirectUrl] = useState(DEFAULT_VIDEO_SRC);

  const handleFileChange = (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    
    setVideoSrc(objectUrl);
    setVideoName(file.name);
    setVideoSize(sizeStr);
    setDirectUrl('');

    setSavedToast(`“${file.name}” selected as Darshan video!`);
    setTimeout(() => setSavedToast(''), 3000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleResetVideo = () => {
    setVideoSrc(DEFAULT_VIDEO_SRC);
    setVideoName(DEFAULT_VIDEO_NAME);
    setVideoSize(DEFAULT_VIDEO_SIZE);
    setDirectUrl(DEFAULT_VIDEO_SRC);
    setSavedToast('Reset back to default temple video (/vedio.mp4)!');
    setTimeout(() => setSavedToast(''), 3000);
  };

  const handleDirectUrlApply = () => {
    if (!directUrl.trim()) return;
    setVideoSrc(directUrl.trim());
    setVideoName('Online Stream Link');
    setVideoSize('Remote CDN');
    setSavedToast('Direct video stream URL applied!');
    setTimeout(() => setSavedToast(''), 3000);
  };

  const handleSaveAll = () => {
    setSavedToast('Changes saved (UI Mockup)!');
    setTimeout(() => setSavedToast(''), 3000);
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-600 text-stone-950 font-bold text-xs shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-stone-950" />
          <span>{savedToast}</span>
        </div>
      )}

      <PageHeader
        title="Slogans & Text"
        subtitle="Every line of copy a donor reads on the kiosk. Give each one in Malayalam and English."
        actions={
          <Button variant="primary" icon={Save} onClick={handleSaveAll}>
            Save changes
          </Button>
        }
      />

      <div className="space-y-5">
        {/* 🌟 Dedicated Video Upload Section */}
        <SectionCard
          title="Devotional Darshan Video & Slogan Media"
          description="Upload or update the sacred Aarti video and devotional chants played on Screen 3 (Mantra Dhwani, Darshan video tiles, and expanded holy modal)."
          icon={Video}
        >
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Drag and Drop Upload Zone */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-inner ${
                  isDragging
                    ? 'border-amber-300 bg-amber-400/15 scale-[1.01]'
                    : 'border-amber-400/35 bg-stone-950/70 hover:border-amber-400 hover:bg-amber-400/[0.06]'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-700/10 border border-amber-400/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <UploadCloud className="w-6 h-6 text-amber-300" />
                </div>

                <p className="text-sm font-bold text-amber-100 group-hover:text-amber-200 transition-colors">
                  Click to browse or drag & drop Aarti video
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Supports MP4, WebM, MOV &middot; High definition recommended &middot; Up to 100 MB
                </p>

                <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-xs font-semibold text-amber-200 group-hover:bg-amber-400 group-hover:text-stone-950 transition-all">
                  <Film className="w-3.5 h-3.5" />
                  <span>Select Video File</span>
                </div>
              </div>

              {/* Direct Stream URL input fallback */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-200/80 flex items-center justify-between">
                  <span>Or paste direct Video stream URL / CDN link</span>
                  <span className="text-[10px] text-stone-400 font-normal">Optional</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    placeholder="https://cdn.temple.org/sacred-aarti.mp4"
                    className="flex-1 rounded-xl bg-stone-950/80 border border-amber-400/30 px-3 py-2 text-xs text-amber-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 font-mono"
                  />
                  <Button variant="outline" onClick={handleDirectUrlApply} className="shrink-0">
                    Apply URL
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Active Video Preview Player Card */}
            <div className="lg:col-span-5 rounded-2xl bg-stone-950/90 border border-amber-400/40 p-3.5 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-xs font-bold text-amber-200">Active Darshan Video</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-[10px] font-semibold text-amber-300 font-mono">
                    Screen 3 Kiosk
                  </span>
                </div>

                {/* Embedded Video Player */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-amber-400/30 bg-black flex items-center justify-center group">
                  <video
                    key={videoSrc}
                    src={videoSrc}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Video Metadata Info */}
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-stone-900/90 border border-amber-400/20 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileVideo className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-amber-100 truncate text-[11px]">{videoName}</p>
                      <p className="text-[10px] text-stone-400">{videoSize}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold shrink-0">
                    Ready
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3.5 flex items-center gap-2 pt-2 border-t border-amber-400/15">
                <Button
                  variant="outline"
                  icon={Film}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-1.5 text-xs"
                >
                  Change Video
                </Button>
                <Button
                  variant="ghost"
                  icon={RefreshCw}
                  onClick={handleResetVideo}
                  title="Reset to default /vedio.mp4"
                  className="py-1.5 text-xs text-stone-300 hover:text-amber-200"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-400/15 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Toggle
              label="Continuous loop playback"
              hint="Restarts the holy video seamlessly upon completion."
              defaultChecked
            />
            <Toggle
              label="Enable accompanying sacred chanting audio"
              hint="Plays the audio track alongside the video darshan."
              defaultChecked
            />
          </div>
        </SectionCard>

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
