/** Builds a short real WAV clip in the browser so the player works with no audio library. */
export function makeToneWavUrl(hz: number, seconds: number): string {
  const rate = 8000;
  const n = Math.floor(rate * seconds);
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, "data"); v.setUint32(40, n * 2, true);
  const steps = [1, 1.25, 1.5, 1.25];
  for (let i = 0; i < n; i++) {
    const t = i / rate;
    const note = hz * steps[Math.floor(t * 1.5) % steps.length];
    const env = Math.min(1, t * 20, (seconds - t) * 20) * (0.55 + 0.45 * Math.abs(Math.sin(Math.PI * t * 1.5)));
    v.setInt16(44 + i * 2, Math.sin(2 * Math.PI * note * t) * 0.18 * env * 32767, true);
  }
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}
