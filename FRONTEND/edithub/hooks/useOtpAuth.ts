'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useOtpAuth() {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  /**
   * Require the user to be authenticated before running an action.
   * If already authenticated, run immediately. Otherwise show the OTP modal.
   */
  const requireAuth = useCallback((action: () => void) => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        action();
      } else {
        setPendingAction(() => action);
        setShowOtpModal(true);
      }
    });
  }, []);

  const handleOtpSuccess = useCallback(() => {
    setShowOtpModal(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleClose = useCallback(() => {
    setShowOtpModal(false);
    setPendingAction(null);
  }, []);

  return { showOtpModal, requireAuth, handleOtpSuccess, handleClose };
}
