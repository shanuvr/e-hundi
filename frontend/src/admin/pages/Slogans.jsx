import { useState, useRef } from 'react';
import { 
  Save, 
  Sparkles, 
  Video, 
  UploadCloud, 
  CheckCircle2, 
  RefreshCw, 
  Film,
  FileVideo
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SectionCard from '../components/SectionCard';
import { Button } from '../components/Controls';
import { TextInput, TextArea, Toggle } from '../components/Field';

const ML = 'sm:[&_input]:font-malayalam sm:[&_textarea]:font-malayalam';
const DEFAULT_VIDEO_SRC = '/video.mp4';
const DEFAULT_VIDEO_NAME = 'video.mp4 (Sacred Temple Darshan)';
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

    setSavedToast(`“${file.name}” set as active Darshan video!`);
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
    setSavedToast('Reset to default video (/video.mp4)!');
    setTimeout(() => setSavedToast(''), 3000);
  };

  const handleDirectUrlApply = () => {
    if (!directUrl.trim()) return;
    setVideoSrc(directUrl.trim());
    setVideoName('Online Stream Link');
    setVideoSize('Remote CDN');
    setSavedToast('Video stream link applied!');
    setTimeout(() => setSavedToast(''), 3000);
  };

  const handleSaveAll = () => {
    setSavedToast('Changes saved successfully!');
    setTimeout(() => setSavedToast(''), 3000);
  };

  return (
    <div className="max-w-5xl space-y-4">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-amber-600 text-stone-950 font-bold text-xs shadow-lg animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-stone-950" />
          <span>{savedToast}</span>
        </div>
      )}

      <PageHeader
        title="Slogans & Darshan Video"
        subtitle="Manage the sacred Darshan video stream and temple blessing quotes."
        actions={
          <Button variant="primary" icon={Save} onClick={handleSaveAll}>
            Save changes
          </Button>
        }
      />

      <div className="space-y-4">
        {/* 🌟 1. Sacred Darshan Video Manager */}
        <SectionCard
          title="Sacred Darshan Video & Aarti Media"
          description="Upload or set the video stream played on the donor completion screen and Mantra Dhwani player."
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
                    Screen 3 Kiosk
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
          description="The primary devotional quotes displayed on the welcome screen and donation hundi."
          icon={Sparkles}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextArea
                label="Welcome Plaque Slogan (Malayalam)"
                defaultValue="&ldquo;നിങ്ങളുടെ സമർപ്പണം, ഭഗവാന്റെ അനുഗ്രഹം&rdquo;"
                rows={2}
                className={ML}
                hint="Displayed on the brass plaque under the sacred Om."
              />
              <TextArea
                label="Main Hundi Blessing (Malayalam)"
                defaultValue="ഭക്തിനിർഭരമായ ഓരോ സമർപ്പണവും അനന്തമായ പുണ്യവും ഐശ്വര്യവുമാകുന്നു"
                rows={2}
                className={ML}
                hint="Main devotional quote on the offering screen."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <TextInput
                label="Temple Moolamantra Tag"
                defaultValue="॥ ഓം നമഃ ശിവായ ॥"
                className={ML}
                hint="Flanked by the sacred burning diyas."
              />
              <TextInput
                label="Devotional Tagline"
                defaultValue="ഡിജിറ്റൽ ഭാണ്ഡാര സമർപ്പണം"
                className={ML}
                hint="Subtitle under the temple title."
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
