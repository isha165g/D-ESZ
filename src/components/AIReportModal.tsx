import React from 'react';
import { X, Cpu, ShieldCheck, AlertOctagon, Send, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { AIThreatAssessment } from '../types';

interface AIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AIThreatAssessment | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AIReportModal: React.FC<AIReportModalProps> = ({
  isOpen,
  onClose,
  assessment,
  isLoading,
  onRefresh
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/90 font-mono">
      <div className="w-full max-w-2xl bg-black border-2 border-white text-white flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-black border-b-2 border-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white text-black border border-white">
              <Cpu className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-widest text-white">
                Gemini AI D-ESZ Buffer Evaluation
              </h2>
              <p className="text-xs text-gray-400 uppercase">
                Automated Ecological Risk Analysis & Policy Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-white bg-black hover:bg-white hover:text-black text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
              <p className="text-sm font-mono text-white uppercase">
                Evaluating real-time GIS telemetry via Gemini...
              </p>
            </div>
          ) : assessment ? (
            <>
              {/* Risk Banner */}
              <div className="p-4 border-2 border-white bg-black text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertOctagon className="w-6 h-6" />
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      Risk Evaluation
                    </div>
                    <div className="font-bold text-lg uppercase">{assessment.riskCategory}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black">{assessment.threatScore}/100</div>
                  <div className="text-[10px] uppercase text-gray-400">Threat Score</div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-black border-2 border-white space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2 border-b border-white/30 pb-1.5">
                  <FileText className="w-4 h-4" />
                  <span>Executive Assessment</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed font-mono">{assessment.summary}</p>
              </div>

              {/* Actionable Directives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Speed limit */}
                <div className="p-4 bg-black border-2 border-white space-y-1">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Speed Limit</div>
                  <div className="text-base font-bold text-white uppercase">
                    {assessment.recommendedSpeedLimit}
                  </div>
                </div>

                {/* Suggested Action */}
                <div className="p-4 bg-black border-2 border-white space-y-1">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Mitigation Action</div>
                  <div className="text-xs font-bold text-white uppercase">
                    {assessment.suggestedAction}
                  </div>
                </div>
              </div>

              {/* Impacted Villages */}
              <div className="p-4 bg-black border-2 border-white space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2 border-b border-white/30 pb-1.5">
                  <Send className="w-4 h-4" />
                  <span>Impacted Villages (SMS Alert Triggered)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {assessment.impactedVillages.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-white text-black font-bold text-xs uppercase flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{v}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Policy Reasoning */}
              <div className="p-4 bg-black border-2 border-white space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2 border-b border-white/30 pb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dynamic Policy Reasoning</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-mono">
                  {assessment.reasoning}
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-black border-t-2 border-white flex items-center justify-between">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-2 border-2 border-white bg-black hover:bg-white hover:text-black text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Re-evaluate</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 border-2 border-white bg-white hover:bg-black hover:text-white text-black font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};

