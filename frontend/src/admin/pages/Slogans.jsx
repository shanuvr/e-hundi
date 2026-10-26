import { useState, useRef, useEffect } from 'react';
import { 
  Save, 
  Sparkles, 
  Video, 
  UploadCloud, 
  CheckCircle2, 
  RefreshCw, 
  Film,
  FileVideo,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { TextInput, TextArea } from '../components/Field';
import { useAdmin } from '../AdminContext';

const ML = 'sm:[&_input]:font-malayalam sm:[&_textarea]:font-malayalam';
const DEFAULT_VIDEO_SRC = '/video.mp4';
const DEFAULT_VIDEO_NAME = 'video.mp4 (Sacred Temple Darshan)';
const DEFAULT_VIDEO_SIZE = '14.8 MB';

export default function Slogans() {
  const { temple, saveTemple, saving } = useAdmin();
  const fileInputRef = useRef(null);

  const [videoSrc, setVideoSrc] = useState(DEFAULT_VIDEO_SRC);
  const [videoName, setVideoName] = useState(DEFAULT_VIDEO_NAME);
  const [videoSize, setVideoSize] = useState(DEFAULT_VIDEO_SIZE);
  const [isDragging, setIsDragging] = useState(false);
  const [savedToast, setSavedToast] = useState(null);
  const [directUrl, setDirectUrl] = useState('');

  // Temple Devotional Quotes & Slogans
  const [sloganMl, setSloganMl] = useState('');
  const [sloganEn, setSloganEn] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('');

  useEffect(() => {
    if (temple) {
      if (temple.darshan_video_url) {
        setVideoSrc(temple.darshan_video_url);
        setDirectUrl(temple.darshan_video_url);
        setVideoName(temple.darshan_video_url.split('/').pop() || 'Remote Darshan Stream');
        setVideoSize('Remote Stream');
      } else {
        setVideoSrc(DEFAULT_VIDEO_SRC);
        setDirectUrl('');
        setVideoName(DEFAULT_VIDEO_NAME);
        setVideoSize(DEFAULT_VIDEO_SIZE);
      }

      setSloganMl(
        temple.slogan_ml || 'ഭക്തിനിർഭരമായ ഓരോ സമർപ്പണവും അനന്തമായ പുണ്യവും ഐശ്വര്യവുമാകുന്നു'
      );
      setSloganEn(
        temple.slogan_en || 'May the divine grace illuminate your life with peace and prosperity.'
      );
      setMessageTemplate(
        temple.darshan_message_template ||
          'Namaste! Your offering of ₹{amount} to {temple} is received with reverence. Watch sacred darshan: {link}'
      );
    }
  }, [temple]);

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
    setDirectUrl(objectUrl);

    setSavedToast({ type: 'success', text: `“${file.name}” set as active Darshan video!` });
    setTimeout(() => setSavedToast(null), 3500);
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
    setDirectUrl('');
    setSavedToast({ type: 'success', text: 'Reset to default video (/video.mp4)!' });
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleDirectUrlApply = () => {
    if (!directUrl.trim()) return;
    setVideoSrc(directUrl.trim());
    setVideoName('Online Stream Link');
    setVideoSize('Remote CDN');
    setSavedToast({ type: 'success', text: 'Video stream link applied to preview!' });
    setTimeout(() => setSavedToast(null), 3000);
  };

  const handleSaveAll = async () => {
    const res = await saveTemple({
      darshan_video_url: videoSrc === DEFAULT_VIDEO_SRC ? '' : videoSrc,
      slogan_ml: sloganMl.trim(),
      slogan_en: sloganEn.trim(),
      darshan_message_template: messageTemplate.trim(),
    });

    if (res.success) {
      setSavedToast({ type: 'success', text: 'Darshan video and slogans saved successfully!' });
    } else {
      setSavedToast({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
    setTimeout(() => setSavedToast(null), 3500);
  };

  return (
    <div className="max-w-5xl space-y-4">
      {/* Toast Notification */}
      {savedToast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg font-bold text-xs animate-bounce ${
            savedToast.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-rose-600 text-white shadow-rose-600/30'
          }`}
        >
          {savedToast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-rose-200" />
          )}
          <span>{savedToast.text}</span>
        </div>
      )}

      <PageHeader
        title="Slogans & Sacred Darshan"
        subtitle={`Customized blessing slogans, kiosk mantras, and darshan media for ${temple?.name || 'Temple'}.`}
        actions={
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        }
      />

      <div className="space-y-4">
        {/* 🌟 1. Sacred Darshan Video Manager */}
        <SectionCard
          title="Sacred Darshan Video & Aarti Media"
          description="The video stream played on the donor completion screen and Mantra Dhwani audio-video kiosk player."
          icon={Video}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Upload Box */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center text-center transition-all cursor-pointer shadow-inner ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50 scale-[1.01]'
                    : 'border-stone-300 bg-stone-50/70 hover:border-amber-400 hover:bg-amber-50/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-xs">
                  <UploadCloud className="w-5 h-5 text-amber-700" />
                </div>

                <p className="text-xs font-bold text-stone-800 group-hover:text-amber-800 transition-colors">
                  Click to choose or drag & drop Aarti Video
                </p>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  MP4, WebM, MOV · High definition recommended
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-300 text-[11px] font-semibold text-amber-900 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <Film className="w-3.5 h-3.5" />
                  <span>Choose Video File</span>
                </div>
              </div>

              {/* Direct Stream URL */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600 flex items-center justify-between">
                  <span>Or enter direct Video Stream / CDN link</span>
                  <span className="text-[10px] text-stone-400 font-normal">S3 / Cloudinary / URL</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    placeholder="https://cdn.temple.org/sacred-aarti.mp4"
                    className="flex-1 rounded-lg bg-white border border-stone-300 px-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 font-mono shadow-2xs"
                  />
                  <Button variant="outline" onClick={handleDirectUrlApply} className="shrink-0 py-1.5 text-xs">
                    Apply Link
                  </Button>
                </div>
              </div>
            </div>

            {/* Video Preview Card */}
            <div className="lg:col-span-5 rounded-xl bg-white border border-stone-200/90 p-3 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-bold text-stone-800">Active Darshan Video</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[9.5px] font-semibold text-amber-800 font-mono">
                    Live Preview
                  </span>
                </div>

                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-stone-200 bg-black flex items-center justify-center group">
                  <video
                    key={videoSrc}
                    src={videoSrc}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileVideo className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-stone-800 truncate text-[11px]">{videoName}</p>
                      <p className="text-[10px] text-stone-500">{videoSize}</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9.5px] font-semibold shrink-0">
                    Live
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-stone-100">
                <Button
                  variant="outline"
                  icon={Film}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-1.5 text-xs"
                >
                  Change File
                </Button>
                <Button
                  variant="ghost"
                  icon={RefreshCw}
                  onClick={handleResetVideo}
                  title="Reset to default"
                  className="py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 🌟 2. Main Temple Slogans & Quotes */}
        <SectionCard
          title="Temple Blessing Slogans & Motto"
          description="The primary devotional quotes and blessings displayed on the welcome screen and donation completion."
          icon={Sparkles}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextArea
                label="Main Hundi Blessing (Malayalam)"
                value={sloganMl}
                onChange={(e) => setSloganMl(e.target.value)}
                rows={3}
                className={ML}
                placeholder="ഭക്തിനിർഭരമായ ഓരോ സമർപ്പണവും അനന്തമായ പുണ്യവും ഐശ്വര്യവുമാകുന്നു"
                hint="Main devotional quote displayed on the kiosk offering screen."
              />
              <TextArea
                label="Devotional Tagline / Blessing (English)"
                value={sloganEn}
                onChange={(e) => setSloganEn(e.target.value)}
                rows={3}
                placeholder="May the divine grace illuminate your life with peace and prosperity."
                hint="English translation or secondary devotional motto."
              />
            </div>
          </div>
        </SectionCard>

        {/* 🌟 3. Digital Darshan WhatsApp Template */}
        <SectionCard
          title="Digital Darshan Message Template"
          description="Template sent via WhatsApp / SMS containing the sacred video darshan link."
          icon={MessageSquare}
        >
          <div className="space-y-2">
            <TextArea
              label="WhatsApp Notification Template"
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              rows={2}
              placeholder="Namaste! Your offering of ₹{amount} to {temple} is received. Watch darshan: {link}"
              hint="Available variables: {temple}, {amount}, {donor_name}, {link}"
            />
          </div>
        </SectionCard>

        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2.5 text-xs sm:text-sm"
          >
            {saving ? 'Saving changes…' : 'Save Slogans & Darshan'}
          </Button>
        </div>
      </div>
    </div>
  );
}
