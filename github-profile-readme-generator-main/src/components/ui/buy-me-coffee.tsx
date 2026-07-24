'use client';

import { useEffect } from 'react';

export function BuyMeACoffeeWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('data-name', 'BMC-Widget');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-id', 'YOUR_BUYMEACOFFEE');
    script.setAttribute('data-description', 'Support the developer on Buy me a coffee!');
    script.setAttribute('data-message', '');
    script.setAttribute('data-color', '#ffdd00');
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
      const widget = document.getElementById('bmc-wbtn');
      if (widget && widget.parentNode) {
        widget.parentNode.removeChild(widget);
      }
    };
  }, []);

  return null;
}
