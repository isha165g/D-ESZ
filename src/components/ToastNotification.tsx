import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { ToastAlert } from '../services/AIService';

interface ToastNotificationProps {
  toast: ToastAlert | null;
  onDismiss: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-20 right-4 z-[3000] max-w-md w-full bg-black border-2 border-white p-4 text-white font-mono shadow-[6px_6px_0px_rgba(255,255,255,0.3)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white text-black border border-white shrink-0">
            <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                {toast.title}
              </h4>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-white text-black uppercase">
                SMS SENT
              </span>
            </div>
            <p className="text-xs text-gray-200 leading-snug font-mono mb-2 uppercase">
              {toast.message}
            </p>
            <div className="flex items-center gap-3 text-[10px] font-mono text-gray-300 bg-black p-2 border border-white/40 uppercase">
              <div>Target: <strong className="text-white">{toast.villageTarget}</strong></div>
              <div>Speed Limit: <strong className="text-white">{toast.speedLimit}</strong></div>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 border border-white bg-black hover:bg-white hover:text-black text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

