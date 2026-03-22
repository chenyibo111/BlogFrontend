// UI Components - Theme-adapted primitives
import { Fragment, forwardRef, useId } from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';

// ==================== Button ====================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    children, 
    className = '', 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary text-on-primary hover:opacity-90 focus:ring-primary',
      secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-high focus:ring-surface-container',
      outline: 'border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary',
      ghost: 'text-on-surface hover:bg-surface-container focus:ring-surface-container',
      danger: 'bg-error text-on-error hover:opacity-90 focus:ring-error',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
        )}
        {!isLoading && leftIcon && <span className="text-sm">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="text-sm">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ==================== Input ====================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-on-surface mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full px-4 py-2.5 border rounded-lg bg-white
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-surface-container disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error 
                ? 'border-error focus:ring-error' 
                : 'border-outline-variant focus:ring-primary focus:border-primary'
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-sm text-on-surface-variant">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ==================== Textarea ====================
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-on-surface mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-2.5 border rounded-lg bg-white resize-none
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-surface-container disabled:cursor-not-allowed
            ${error 
              ? 'border-error focus:ring-error' 
              : 'border-outline-variant focus:ring-primary focus:border-primary'
            }
            ${className}
          `}
          {...props}
        />
        {error ? (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-sm text-on-surface-variant">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ==================== Select ====================
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-on-surface mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full px-4 py-2.5 border rounded-lg bg-white appearance-none
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-surface-container disabled:cursor-not-allowed
              ${error 
                ? 'border-error focus:ring-error' 
                : 'border-outline-variant focus:ring-primary focus:border-primary'
              }
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
            expand_more
          </span>
        </div>
        {error ? (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1.5 text-sm text-on-surface-variant">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ==================== Modal ====================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className={`w-full ${sizes[size]} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                {(title || description) && (
                  <div className="mb-4">
                    {title && (
                      <Dialog.Title as="h3" className="text-lg font-bold text-primary">
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="mt-1 text-sm text-on-surface-variant">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                )}
                
                <div className="text-on-surface">{children}</div>
                
                {footer && (
                  <div className="mt-6 flex justify-end gap-3">{footer}</div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// ==================== Toast Notifications ====================
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#1a1c1c',
          border: '1px solid #e2e2e2',
          borderRadius: '0.5rem',
          padding: '1rem',
          boxShadow: '0 20px 40px rgba(0,25,21,0.1)',
        },
        success: {
          iconTheme: {
            primary: '#001915',
            secondary: '#ffffff',
          },
        },
        error: {
          style: {
            background: '#fef2f2',
            color: '#ba1a1a',
          },
          iconTheme: {
            primary: '#ba1a1a',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}

// Toast helpers
// eslint-disable-next-line react-refresh/only-export-components
export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (toastId?: string) => toast.dismiss(toastId),
};

// ==================== Card ====================
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({ children, className = '', padding = 'md', hover = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div className={`
      bg-white rounded-lg shadow-[0_20px_40px_rgba(0,25,21,0.04)]
      ${hover ? 'transition-shadow hover:shadow-[0_20px_40px_rgba(0,25,21,0.08)]' : ''}
      ${paddings[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
}

// ==================== Badge ====================
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', size = 'md' }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-error-container text-error',
    neutral: 'bg-surface-container text-on-surface-variant',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
}
