import { useState } from "react";

interface Step {
  id: string;
  step_code: string;
  step_label: string;
  step_order: number;
  status: string;
  completed_at?: string;
  blocker_reason?: string;
}

export default function DealProgress({
  steps,
  dealId,
}: {
  steps: Step[];
  dealId: string;
}) {
  const [localSteps, setLocalSteps] = useState<Step[]>(steps);

  const toggleStep = async (stepId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    // Optimistic update
    setLocalSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, status: newStatus, completed_at: newStatus === "completed" ? new Date().toISOString() : undefined }
          : s
      )
    );
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900">Progress Deal</h3>
      <div className="mt-4 space-y-3">
        {localSteps.length === 0 && (
          <p className="text-sm text-slate-500">Belum ada langkah yang ditentukan.</p>
        )}
        {localSteps.map((step) => (
          <div
            key={step.id}
            className="flex items-start gap-3 rounded-lg border p-3 transition hover:bg-slate-50"
          >
            <button
              onClick={() => toggleStep(step.id, step.status)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                step.status === "completed"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-300 bg-white"
              }`}
            >
              {step.status === "completed" && (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{step.step_label || step.step_code}</p>
              {step.blocker_reason && (
                <p className="mt-0.5 text-xs text-red-600">{step.blocker_reason}</p>
              )}
              {step.completed_at && (
                <p className="mt-0.5 text-xs text-slate-500">
                  Selesai: {new Date(step.completed_at).toLocaleDateString("id-ID")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
