/*
 * Copyright DB InfraGO AG and contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

const FocusIframe = ({ src }: { src: string }) => {
  const [focused, setFocused] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setInterval(() => {
      if (document.activeElement === iframeRef.current) {
        setFocused(true);
      } else {
        setFocused(false);
      }
    }, 300);
  }, []);

  function setFocus() {
    iframeRef.current?.focus();
  }

  return (
    <div className="relative h-full w-full">
      {!focused && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          onClick={setFocus}
        >
          <div className="text-2xl text-white">Click to focus</div>
        </div>
      )}
      <iframe
        src={src}
        ref={iframeRef}
        allow="clipboard-read; clipboard-write"
        className="h-full w-full border-0"
      ></iframe>
    </div>
  );
};

export default FocusIframe;
