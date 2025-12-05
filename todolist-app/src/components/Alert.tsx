import type { ReactNode } from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_STYLES: Record<
  AlertVariant,
  { icon: string; container: string; closeButton: string }
> = {
  info: {
    icon: 'ℹ️',
    container: 'border-blue-200 bg-blue-50 text-blue-800',
    closeButton:
      'focus:ring-blue-300 hover:bg-blue-200/40 focus:ring-offset-blue-50',
  },
  success: {
    icon: '✅',
    container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    closeButton:
      'focus:ring-emerald-300 hover:bg-emerald-200/40 focus:ring-offset-emerald-50',
  },
  warning: {
    icon: '⚠️',
    container: 'border-amber-300 bg-amber-50 text-amber-900',
    closeButton:
      'focus:ring-amber-300 hover:bg-amber-200/40 focus:ring-offset-amber-50',
  },
  danger: {
    icon: '⛔',
    container: 'border-rose-200 bg-rose-50 text-rose-900',
    closeButton:
      'focus:ring-rose-300 hover:bg-rose-200/40 focus:ring-offset-rose-50',
  },
};

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
  icon?: ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  variant = 'info',
  title,
  children,
  icon,
  dismissible = false,
  onClose,
  className,
}: AlertProps) {
  const style = VARIANT_STYLES[variant];
  const composedClassName = [
    'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm',
    style.container,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const canDismiss = dismissible && typeof onClose === 'function';
  const iconNode = icon ?? style.icon;

  return (
    <div role="alert" className={composedClassName}>
      {iconNode ? (
        <span className="text-lg leading-6" aria-hidden="true">
          {iconNode}
        </span>
      ) : null}
      <div className="flex-1 text-sm leading-5">
        {title && <p className="font-semibold">{title}</p>}
        {children ? (
          <div className={title ? 'mt-1 opacity-90' : 'opacity-90'}>
            {children}
          </div>
        ) : null}
      </div>
      {canDismiss ? (
        <button
          type="button"
          aria-label="Dismiss alert"
          className={
            'ml-2 rounded-full p-1 text-current transition focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
            style.closeButton
          }
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      ) : null}
    </div>
  );
}
