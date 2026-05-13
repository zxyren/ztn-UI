import { CheckLine, Info, LoaderCircle, Merge, Pause, Play, RefreshCw, Rocket, Timer, X } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'queued':
        return { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: Timer };
      case 'starting':
        return { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-500/30', icon: Rocket };
      case 'downloading':
        return { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30', icon: LoaderCircle };
      case 'merging':
        return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', icon: Merge };
      case 'completed':
        return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckLine };
      case 'converting':
        return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', icon: RefreshCw };
      case 'error':
        return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', icon: X };
      case 'cancelled':
        return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', icon: Play };
      case 'cancelling':
        return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', icon: Pause };
      default:
        return { bg: 'bg-white/8', text: 'text-white/40', border: 'border-white/10', icon: Info };
    }
  };

  const style = getStatusStyle(status);
  const statusLower = status.toLowerCase();
  const isAnimating = ['downloading', 'converting'].includes(statusLower);

  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-1 text-xs font-medium sm:gap-1 sm:px-3 sm:py-1.5 ${style.bg} ${style.text} ${style.border}`}
    >
      {isAnimating ? <Icon size={14} className={`animate-spin sm:size-4`} /> : <Icon size={14} className='sm:size-4' />}
      {status}
    </span>
  );
}
