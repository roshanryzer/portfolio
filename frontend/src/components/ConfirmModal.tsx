import type { ReactNode } from 'react';

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  disabled?: boolean;
};

function ConfirmModal({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  disabled = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-700 max-w-sm w-full mx-4 p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-ink-light mb-1">
            {title}
          </h2>
          {description && (
            <div className="text-sm text-slate-600 dark:text-ink-muted">
              {description}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={disabled ? undefined : onCancel}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-60"
            disabled={disabled}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={disabled ? undefined : onConfirm}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;

