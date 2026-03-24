import { useEffect, useRef, useCallback } from 'react';

/**
 * #54: Focus management hook for accessibility
 * 
 * Restores focus to a specified element after an action completes.
 * Useful for modals, forms, and dynamic content changes.
 * 
 * @example
 * ```tsx
 * const { restoreFocus, saveFocus } = useFocusManagement();
 * 
 * // Save focus before opening modal
 * <button onClick={() => { saveFocus(); openModal(); }}>Open</button>
 * 
 * // Restore focus after closing modal
 * <button onClick={() => { closeModal(); restoreFocus(); }}>Close</button>
 * ```
 */
export function useFocusManagement() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    }, 0);
  }, []);

  return { saveFocus, restoreFocus, previousFocus: previousFocusRef };
}

/**
 * Hook to focus an element on mount
 * 
 * @example
 * ```tsx
 * const focusRef = useFocusOnMount<HTMLDivElement>();
 * return <div ref={focusRef} tabIndex={-1}>Focused on mount</div>
 * ```
 */
export function useFocusOnMount<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return ref;
}

/**
 * Hook to announce messages to screen readers
 * 
 * @example
 * ```tsx
 * const announce = useAnnounce();
 * announce('Form submitted successfully');
 * ```
 */
export function useAnnounce() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('sr-announcer') || createAnnouncer();
    
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }, []);

  return announce;
}

function createAnnouncer(): HTMLElement {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.className = 'sr-only';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  document.body.appendChild(announcer);
  return announcer;
}