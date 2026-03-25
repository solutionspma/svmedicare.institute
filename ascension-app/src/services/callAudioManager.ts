/**
 * Mic capture + mute for Call Lab (browser only).
 * Keeps stream refs centralized for pause/mute without tearing down WebRTC.
 */

export type CallAudioManager = {
  stream: MediaStream | null;
  getMic: () => Promise<MediaStream>;
  mute: (muted: boolean) => void;
  stop: () => void;
};

export function createCallAudioManager(): CallAudioManager {
  let stream: MediaStream | null = null;

  return {
    get stream() {
      return stream;
    },
    async getMic() {
      if (stream) return stream;
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      return stream;
    },
    mute(muted: boolean) {
      stream?.getAudioTracks().forEach((t) => {
        t.enabled = !muted;
      });
    },
    stop() {
      stream?.getTracks().forEach((t) => t.stop());
      stream = null;
    },
  };
}
