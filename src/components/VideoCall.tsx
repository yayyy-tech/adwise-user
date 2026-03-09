import { useEffect, useRef } from 'react';

interface VideoCallProps {
  roomUrl: string;
  token: string;
  onLeave: () => void;
  onRecordingStarted?: () => void;
}

export function VideoCall({ roomUrl, token, onLeave, onRecordingStarted }: VideoCallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.onload = () => {
      const DailyIframe = (window as any).DailyIframe;
      if (!DailyIframe || !containerRef.current) return;

      callFrameRef.current = DailyIframe.createFrame(containerRef.current, {
        showLeaveButton: true,
        showFullscreenButton: true,
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '12px',
        },
      });

      callFrameRef.current
        .on('left-meeting', onLeave)
        .on('recording-started', () => onRecordingStarted?.())
        .join({ url: roomUrl, token });
    };
    document.head.appendChild(script);

    return () => {
      callFrameRef.current?.destroy();
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [roomUrl, token, onLeave, onRecordingStarted]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0b0f0d',
      }}
    />
  );
}
