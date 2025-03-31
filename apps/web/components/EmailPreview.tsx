"use client";

import { useEffect, useState } from "react";

interface EmailPreviewProps {
  htmlContent: string;
}

export default function EmailPreview({ htmlContent }: EmailPreviewProps) {
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    try {
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      setIframeSrc(url);
      setIsLoading(false);

      return () => URL.revokeObjectURL(url); // Cleanup
    } catch (error) {
      console.error("Error creating blob URL:", error);
      setIsLoading(false);
    }
  }, [htmlContent]);

  return (
    <div className="w-full">
      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full border border-gray-200 rounded-md overflow-hidden">
          <iframe
            src={iframeSrc}
            className="w-full min-h-[400px] bg-white"
            sandbox="allow-same-origin"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      )}
    </div>
  );
}
