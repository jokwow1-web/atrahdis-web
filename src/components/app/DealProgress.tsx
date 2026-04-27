import { useMemo } from 'react';
import type { DealStep } from '../../types/deal';

interface Props {
  steps: DealStep[];
}

const statusColor: Record<string, string> = {
  pending: 'bg-gray-700 border-gray-600 text-gray-400',
  in_progress: 'bg-blue-600 border-blue-400 text-white ring-2 ring-blue-400/40',
  completed: 'bg-gold-500 border-gold-400 text-white',
  blocked: 'bg-red-600 border-red-400 text-white',
};

const statusLineColor: Record<string, string> = {
  pending: 'bg-gray-700',
  in_progress: 'bg-blue-600',
  completed: 'bg-gold-500',
  blocked: 'bg-red-600',
};

export default function DealProgress({ steps }: Props) {
  const sorted = useMemo(() => {
    return [...steps].sort((a, b) => a.step_number - b.step_number);
  }, [steps]);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between gap-2 overflow-x-auto pb-4">
        {sorted.map((step, idx) => {
          const isLast = idx === sorted.length - 1;
          return (
            <div key={step.id} className="flex items-center min-w-[5rem] flex-1">
              <div className="flex flex-col items-center text-center w-full">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${statusColor[step.status] || statusColor.pending}`}
                  title={step.notes || step.title}
                >
                  {step.status === 'completed' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : step.status === 'blocked' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    step.step_number
                  )}
                </div>
                <p className="mt-2 text-[10px] leading-tight text-gray-300 truncate w-full px-1">
                  {step.title}
                </p>
              </div>
              {!isLast && (
                <div className={`h-1 flex-1 mx-1 rounded-full mt-[-1.2rem] ${statusLineColor[step.status] || statusLineColor.pending}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
