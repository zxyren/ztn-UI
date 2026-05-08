import { type RefObject } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Delete01Icon,
  CloudDownloadIcon,
  Folder03Icon,
  Task02Icon,
  MusicNote03Icon,
  PlayListIcon,
  Image03Icon,
} from '@hugeicons/core-free-icons';
import { AnimatePresence, motion } from 'framer-motion';

interface DownloadControlsProps {
  videoLink: string;
  setVideoLink: (v: string) => void;
  selectedDirectory: FileSystemDirectoryHandle | null;
  setSelectedDirectory: (h: FileSystemDirectoryHandle | null) => void;
  queueSingle: (format: 'video' | 'audio' | 'image') => void;
  uploadList: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
}

const inputBase =
  'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/60 focus:bg-white/8 backdrop-blur-sm';

export function DownloadControls({
  videoLink,
  setVideoLink,
  selectedDirectory,
  setSelectedDirectory,
  queueSingle,
  uploadList,
  fileInputRef,
}: DownloadControlsProps) {
  const handleSelectDirectory = async () => {
    if (!('showDirectoryPicker' in window)) return alert('Directory picker not supported. Use Chrome, Edge, or Opera.');
    try {
      setSelectedDirectory(await (window as any).showDirectoryPicker({ mode: 'readwrite' }));
    } catch (e: any) {
      if (e.name !== 'AbortError') alert('Failed to select directory.');
    }
  };

  const handlePaste = async () => {
    try {
      setVideoLink(await navigator.clipboard.readText());
    } catch {
      /* silent */
    }
  };

  const formatButtons = [
    {
      fmt: 'video' as const,
      icon: PlayListIcon,
      label: 'MP4',
      cls: 'rounded-l-xl rounded-r-none border-r-0 border-rose-500/40 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300',
    },
    {
      fmt: 'audio' as const,
      icon: MusicNote03Icon,
      label: 'MP3',
      cls: 'rounded-none border-x-0 border-indigo-500/40 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300',
    },
    {
      fmt: 'image' as const,
      icon: Image03Icon,
      label: 'IMG',
      cls: 'rounded-r-xl rounded-l-none border-l-0 border-emerald-500/40 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* URL Input */}
      <div>
        <div className='flex flex-col gap-2 sm:flex-row sm:gap-3'>
          <div className='relative flex-1'>
            <input
              className={`h-11 min-w-0 pr-24 sm:h-12 sm:pr-28 ${inputBase}`}
              type='text'
              placeholder='Paste video, audio, or image URL…'
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && queueSingle('video')}
            />
            <button
              onClick={handlePaste}
              className='bg-white/8 hover:bg-white/12 absolute right-1.5 top-1/2 flex h-8 -translate-y-1/2 items-center gap-1.5 rounded-xl border border-white/15 px-2.5 text-xs font-medium tracking-wider text-white/60 transition-all hover:border-white/25 hover:text-white sm:h-9 sm:px-3 sm:text-sm'
            >
              <HugeiconsIcon icon={Task02Icon} size={15} />
              <span>Paste</span>
            </button>
          </div>

          {/* Format buttons */}
          <div className='flex'>
            {formatButtons.map(({ fmt, icon, label, cls }) => (
              <button
                key={fmt}
                onClick={() => queueSingle(fmt)}
                className={`flex h-10 flex-1 items-center justify-center gap-1.5 border px-3 text-xs font-semibold transition-all sm:h-12 sm:px-5 sm:text-sm ${cls}`}
              >
                <HugeiconsIcon icon={icon} size={16} className='sm:size-5' />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save Folder + Batch Upload */}
      <div className='grid gap-3 border-t border-white/10 pt-4 sm:gap-3 sm:pt-5 lg:grid-cols-2'>
        {/* Save Location */}
        <div className='space-y-2 rounded-xl border border-white/10 bg-white/5 p-2.5 sm:rounded-2xl sm:p-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-white/40 sm:text-base'>Save Location</p>
            <p className='text-xs text-white/25 sm:text-sm'>Choose where completed files are saved.</p>
          </div>
          <div className='flex min-w-0 flex-col gap-2 sm:flex-row sm:gap-2'>
            <motion.button
              layout
              type='button'
              onClick={handleSelectDirectory}
              className='flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white/50 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white sm:min-h-11 sm:rounded-xl sm:px-4 sm:text-sm'
            >
              <AnimatePresence mode='popLayout'>
                {selectedDirectory ? (
                  <motion.span
                    key='sel'
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className='flex min-w-0 items-center truncate'
                  >
                    <HugeiconsIcon icon={Folder03Icon} size={16} className='mr-1.5 shrink-0 text-indigo-400 sm:size-5' />
                    <span className='truncate font-semibold text-white'>{selectedDirectory.name}</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key='def'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='flex items-center gap-1.5 font-medium'
                  >
                    <HugeiconsIcon icon={Folder03Icon} size={16} className='sm:size-5' />
                    <span className='hidden sm:inline'>Choose</span> Folder
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <AnimatePresence>
              {selectedDirectory && (
                <motion.button
                  key='clr'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setSelectedDirectory(null)}
                  className='flex h-10 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-white/50 transition-all hover:border-rose-500/30 hover:bg-rose-500/15 hover:text-rose-400 sm:h-11 sm:rounded-xl sm:px-3 sm:text-sm'
                >
                  <HugeiconsIcon icon={Delete01Icon} size={16} className='sm:size-5' />
                  <span className='hidden sm:inline'>Clear</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Batch Upload */}
        <div className='space-y-2 rounded-xl border border-white/10 bg-white/5 p-2.5 sm:space-y-2.5 sm:rounded-2xl sm:p-3'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-white/40 sm:text-base'>Batch Upload</p>
            <p className='text-xs text-white/25 sm:text-sm'>
              Drop a <code className='rounded bg-white/10 px-1 py-0.5 text-white/50'>.txt</code> file with many URLs.
            </p>
          </div>
          <input ref={fileInputRef} type='file' accept='.txt' className='hidden' id='batch-file' onChange={uploadList} />
          <label
            htmlFor='batch-file'
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-indigo-500/40', 'bg-indigo-500/10');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('border-indigo-500/40', 'bg-indigo-500/10');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-indigo-500/40', 'bg-indigo-500/10');
              if (fileInputRef.current && e.dataTransfer.files.length > 0) {
                fileInputRef.current.files = e.dataTransfer.files;
                fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }}
            className='group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 p-4 text-center transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5 sm:rounded-xl sm:p-6'
          >
            <div className='flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-3 transition-all duration-300 group-hover:rounded-xl'>
              <HugeiconsIcon icon={CloudDownloadIcon} size={28} className='text-white/30' />
            </div>
            <div>
              <p className='text-xs font-semibold text-white/60 sm:text-sm'>Drop file here</p>
              <p className='text-xs text-white/25'>or click to browse</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
