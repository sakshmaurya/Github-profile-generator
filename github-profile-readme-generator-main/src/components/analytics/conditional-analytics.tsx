'use client';

import { useEffect } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useConsent } from '@/hooks/use-consent';
import { initializeAnalytics } from '@/lib/analytics';

export function ConditionalAnalytics() {
  const { status } = useConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (status === 'accepted' && gaId) {
      const timer = setTimeout(() => {
        initializeAnalytics();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status, gaId]);

  if (status !== 'accepted' || !gaId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
