import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface Props {
  src: string;
}

export function CustomAudioPlayer({ src }: Props) {
  return (
    <div className="w-full bg-secondary/30 rounded-xl overflow-hidden border border-white/5 backdrop-blur-sm">
      <AudioPlayer
        src={src}
        autoPlay={false}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        showJumpControls={false}
        layout="horizontal-reverse"
        style={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          color: 'white',
        }}
      />
      <style>{`
        .rhap_container {
          background-color: transparent !important;
          padding: 16px !important;
        }
        .rhap_time {
          color: #a1a1aa !important;
          font-family: var(--font-sans) !important;
          font-size: 12px !important;
        }
        .rhap_progress-filled {
          background-color: hsl(var(--primary)) !important;
        }
        .rhap_progress-indicator {
          background-color: white !important;
          width: 12px !important;
          height: 12px !important;
          top: -4px !important;
        }
        .rhap_main-controls-button {
          color: white !important;
        }
        .rhap_play-pause-button {
          font-size: 32px !important;
        }
      `}</style>
    </div>
  );
}
