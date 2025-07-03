import { useState, useCallback } from "react";

/**
 * useDialog - A simple hook for managing open/close state of dialogs or modals.
 * @param initialOpen - Whether the dialog should be open initially (default: false)
 * @returns { isOpen, open, close, toggle, setOpen }
 */
export function useDialog(initialOpen = false) {
  const [isOpen, setOpen] = useState(initialOpen);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  return { isOpen, open, close, toggle, setOpen };
}
