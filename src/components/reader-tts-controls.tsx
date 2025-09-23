"use client";
import { useCallback, useMemo, useState } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { Play, Pause, Square, Volume2 } from "lucide-react";

type Props = {
  // container that holds the epub.js rendition iframe
  viewerRef: React.RefObject<HTMLDivElement | null>;
  // optional currently selected text from reader, if available
  selectedText?: string | null;
};

export function ReaderTtsControls({ viewerRef, selectedText }: Props) {
  const { supported, status, voices, voice, setVoice, rate, setRate, speak, cancel, toggle } = useSpeechSynthesis();
  const [source, setSource] = useState<"selection" | "page">("selection");

  const buttonLabel = status === "speaking" ? "Pause" : status === "paused" ? "Resume" : "Play";

  const textToRead = useMemo(() => {
    if (source === "selection" && selectedText && selectedText.trim()) return selectedText.trim();

    // Fallback: try to read the currently visible chapter/page text from the iframe
    const container = viewerRef.current;
    if (!container) return "";
    const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument;
    const text = doc?.body?.innerText || doc?.body?.textContent || "";
    // Trim and reduce multiple spaces/newlines for smoother TTS
    return text.replace(/\s+/g, " ").trim();
  }, [source, selectedText, viewerRef]);

  const onPlay = useCallback(() => {
    if (!textToRead) return;
    speak({ text: textToRead });
  }, [speak, textToRead]);

  const onToggle = useCallback(() => {
    if (!textToRead) return;
    if (status === "idle") onPlay();
    else toggle();
  }, [status, toggle, onPlay, textToRead]);

  // Build a curated list: Turkish and English only, up to 2 male + 2 female if detectable
  const curatedVoices = useMemo(() => {
    const trEn = voices.filter((v) => {
      const lang = (v.lang || "").toLowerCase();
      return lang.startsWith("tr") || lang.startsWith("en");
    });

    // Try to guess gender from voice name
    const isFemale = (name: string) => /female|woman|samantha|victoria|zira|zira|zira|zira|zira|zira|zira|zira|zira/i.test(name);
    const isMale = (name: string) => /male|man|daniel|fred|zira|alec|alex|michael|murat|yigit|yusuf|kerem/i.test(name);

    const females: SpeechSynthesisVoice[] = [];
    const males: SpeechSynthesisVoice[] = [];
    const unknown: SpeechSynthesisVoice[] = [];

    for (const v of trEn) {
      const name = v.name || "";
      if (isFemale(name)) females.push(v);
      else if (isMale(name)) males.push(v);
      else unknown.push(v);
    }

    const pickUpTo = (arr: SpeechSynthesisVoice[], n: number) => arr.slice(0, n);

    const pickedFemales = pickUpTo(females, 2);
    const pickedMales = pickUpTo(males, 2);
    const remaining = 4 - (pickedFemales.length + pickedMales.length);
    const pickedUnknown = remaining > 0 ? pickUpTo(unknown, remaining) : [];

    const picked = [...pickedFemales, ...pickedMales, ...pickedUnknown];
    // If we still have fewer than 4, fill from the remaining trEn pool without duplicates
    if (picked.length < 4) {
      const remainingPool = trEn.filter((v) => !picked.includes(v));
      picked.push(...pickUpTo(remainingPool, 4 - picked.length));
    }
    return picked;
  }, [voices]);

  if (!supported) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg px-3 py-2 backdrop-blur-sm">
      {/* Play / Pause */}
      <button className="inline-flex items-center justify-center rounded-full h-9 w-9 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onToggle} title={buttonLabel} aria-label={buttonLabel}>
        {status === "speaking" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      {/* Stop */}
      <button className="inline-flex items-center justify-center rounded-full h-9 w-9 bg-red-600 hover:bg-red-700 text-white" onClick={cancel} title="Stop" aria-label="Stop">
        <Square className="h-4 w-4" />
      </button>

      {/* Rate */}
      <div className="flex items-center gap-2 pl-2">
        <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.05}
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-28"
          aria-label="Speech rate"
          title={`Rate: ${rate.toFixed(2)}x`}
        />
      </div>

      {/* Source */}
      <select
        value={source}
        onChange={(e) => setSource(e.target.value as "selection" | "page")}
        className="ml-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
        aria-label="Reading source"
      >
        <option value="selection">Selection</option>
        <option value="page">Page</option>
      </select>

      {/* Voice (TR/EN curated) */}
      <select
        value={voice?.name || ""}
        onChange={(e) => setVoice(curatedVoices.find((v) => v.name === e.target.value) || null)}
        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
        aria-label="Voice"
      >
        {curatedVoices.map((v) => (
          <option key={`${v.name}-${v.lang}`} value={v.name}>{`${v.name} (${v.lang})`}</option>
        ))}
      </select>
    </div>
  );
}
