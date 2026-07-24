'use client';

import { useEffect } from 'react';

export function KoFiWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('data-name', 'Kofi-Widget');
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    script.setAttribute('data-id', 'YOUR_KOFI');
    script.setAttribute('data-description', 'Support the developer on Ko-fi!');
    script.setAttribute('data-message', '');
    script.setAttribute('data-color', '#00b9fe');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;

    script.onload = function () {
      const event = new CustomEvent('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const widget = document.getElementById('kofi-widget-overlay');
      if (widget && widget.parentNode) {
        widget.parentNode.removeChild(widget);
      }
    };
  }, []);

  return null;
}
