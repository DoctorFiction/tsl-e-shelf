import { useCallback, useEffect, useRef, useState } from "react";

export type SpeakOptions = {
  text: string;
  voice?: SpeechSynthesisVoice | null;
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  onstart?: (ev: SpeechSynthesisEvent) => void;
  onend?: (ev: SpeechSynthesisEvent) => void;
  onboundary?: (ev: SpeechSynthesisEvent) => void;
};

type Status = "idle" | "speaking" | "paused";

export function useSpeechSynthesis() {
  const [supported, setSupported] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  // default slightly slower for better comprehension
  const [rate, setRate] = useState<number>(0.9);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [status, setStatus] = useState<Status>("idle");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const hasSupport = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(hasSupport);
    if (!hasSupport) return;

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const v = synth.getVoices();
      setVoices(v);

      // Priority list for voice selection to ensure consistency across devices
      const voicePriorities = [
        // Microsoft voices (Windows)
        "Microsoft Filiz - Turkish (Turkey)",
        "Microsoft Tolga - Turkish (Turkey)",
        "Microsoft Zira - English (United States)",
        "Microsoft David - English (United States)",
        // Alternative patterns
        v.find((vv) => /filiz/i.test(vv.name) && vv.lang?.toLowerCase().startsWith("tr")),
        v.find((vv) => /tolga/i.test(vv.name) && vv.lang?.toLowerCase().startsWith("tr")),
        v.find((vv) => /zira/i.test(vv.name) && vv.lang?.toLowerCase().startsWith("en")),
        v.find((vv) => /david/i.test(vv.name) && vv.lang?.toLowerCase().startsWith("en")),
        // Generic Turkish/English fallbacks
        v.find((vv) => vv.lang?.toLowerCase().startsWith("tr")),
        v.find((vv) => vv.lang?.toLowerCase().startsWith("en")),
        // Final fallback
        v[0],
      ].filter(Boolean);

      let defaultVoice = null;

      // First try to find exact name matches
      for (const priority of voicePriorities) {
        if (typeof priority === "string") {
          defaultVoice = v.find((voice) => voice.name === priority);
        } else {
          defaultVoice = priority as SpeechSynthesisVoice;
        }
        if (defaultVoice) break;
      }

      setVoice((prev) => prev ?? (defaultVoice || null));
    };

    loadVoices();
    // Some browsers load voices asynchronously
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setStatus("idle");
  }, [supported]);

  const speak = useCallback(
    ({ text, voice: v, rate: r, pitch: p, volume: vol, onstart, onend, onboundary }: SpeakOptions) => {
      if (!supported || !text?.trim()) return;

      // If speaking or paused, cancel first to start fresh
      if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
        window.speechSynthesis.cancel();
      }

      const u = new SpeechSynthesisUtterance(text);
      u.voice = v ?? voice ?? null;
      u.rate = r ?? rate;
      u.pitch = p ?? pitch;
      u.volume = vol ?? volume;

      u.onstart = (ev) => {
        setStatus("speaking");
        onstart?.(ev);
      };
      u.onpause = () => setStatus("paused");
      u.onresume = () => setStatus("speaking");
      u.onboundary = (ev) => {
        onboundary?.(ev);
      };
      u.onend = (ev) => {
        setStatus("idle");
        utteranceRef.current = null;
        onend?.(ev);
      };
      u.onerror = () => {
        setStatus("idle");
        utteranceRef.current = null;
      };

      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [supported, voice, rate, pitch, volume]
  );

  const pause = useCallback(() => {
    if (!supported) return;
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus("speaking");
    }
  }, [supported]);

  const toggle = useCallback(() => {
    if (status === "speaking") pause();
    else if (status === "paused") resume();
  }, [status, pause, resume]);

  return {
    // capabilities/state
    supported,
    status,
    voices,
    voice,
    rate,
    pitch,
    volume,
    // setters
    setVoice,
    setRate,
    setPitch,
    setVolume,
    // controls
    speak,
    pause,
    resume,
    cancel,
    toggle,
  };
}
