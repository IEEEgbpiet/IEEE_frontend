import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  onClose: () => void;
}

export default function ImageModal({
  isOpen,
  imageUrl,
  title,
  subtitle,
  onClose,
}: ImageModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      {/* Top action bar */}
      <div
        className="fixed top-4 right-4 z-[110] flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
          title="Open original image"
          aria-label="Open original image"
        >
          <ExternalLink size={18} />
        </a>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/25 hover:text-white hover:scale-105"
          title="Close (Esc)"
          aria-label="Close photo window"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main image container */}
      <div
        className="relative max-h-[92vh] max-w-[94vw] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/60 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
          <img
            src={imageUrl}
            alt={title || 'Full preview'}
            className="max-h-[82vh] max-w-[92vw] w-auto h-auto object-contain select-none"
          />
        </div>

        {/* Caption */}
        {(title || subtitle) && (
          <div className="mt-3 max-w-xl text-center px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
            {title && <h4 className="text-sm font-bold text-white truncate">{title}</h4>}
            {subtitle && <p className="text-xs text-slate-300 mt-0.5 truncate">{subtitle}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
