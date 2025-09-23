"use client";
import { useCallback, useMemo, useState } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { Play, Pause, Square, Volume2 } from "lucide-react";

type Props = {
  // container that holds the epub.js rendition iframe
  viewerRef: React.RefObject<HTMLDivElement | null>;
  // optional currently selected text from reader, if available
  selectedText?: string | null;
  // function to get current page text
  getCurrentPageText?: () => string;
};

export function ReaderTtsControls({ viewerRef, selectedText, getCurrentPageText }: Props) {
  const { supported, status, voices, voice, setVoice, rate, setRate, speak, cancel, toggle } = useSpeechSynthesis();
  const [source, setSource] = useState<"selection" | "page">("page"); // Default to "page"

  const buttonLabel = status === "speaking" ? "Pause" : status === "paused" ? "Resume" : "Play";

  const textToRead = useMemo(() => {
    if (source === "selection" && selectedText && selectedText.trim()) return selectedText.trim();

    // Use getCurrentPageText if available, otherwise fallback to iframe method
    if (getCurrentPageText) {
      return getCurrentPageText();
    }

    // Fallback: try to read the currently visible chapter/page text from the iframe
    const container = viewerRef.current;
    if (!container) return "";
    const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument;
    const text = doc?.body?.innerText || doc?.body?.textContent || "";
    // Trim and reduce multiple spaces/newlines for smoother TTS
    return text.replace(/\s+/g, " ").trim();
  }, [source, selectedText, getCurrentPageText, viewerRef]);

  const onPlay = useCallback(() => {
    if (!textToRead) return;
    speak({ text: textToRead });
  }, [speak, textToRead]);

  const onToggle = useCallback(() => {
    if (!textToRead) return;
    if (status === "idle") onPlay();
    else toggle();
  }, [status, toggle, onPlay, textToRead]);

  // Create a consistent set of voices: Turkish and English, male and female
  const standardVoices = useMemo(() => {
    // First, filter to only Turkish and English voices
    const trEnVoices = voices.filter((v) => {
      const lang = (v.lang || "").toLowerCase();
      return lang.startsWith("tr") || lang.startsWith("en");
    });

    // Define preferred voice patterns for better consistency
    const preferredPatterns = [
      // Turkish voices - common patterns
      { pattern: /filiz|turkish.*female/i, lang: "tr", gender: "female", fallbackName: "Turkish Female" },
      { pattern: /tolga|turkish.*male/i, lang: "tr", gender: "male", fallbackName: "Turkish Male" },

      // English voices - common patterns across different platforms
      { pattern: /(zira|hazel|microsoft.*female|english.*female)/i, lang: "en", gender: "female", fallbackName: "English Female" },
      { pattern: /(david|mark|microsoft.*male|english.*male)/i, lang: "en", gender: "male", fallbackName: "English Male" },
    ];

    const foundVoices: { voice: SpeechSynthesisVoice; name: string; lang: string; gender: string }[] = [];

    // Try to find preferred voices
    for (const pattern of preferredPatterns) {
      const matchedVoice = trEnVoices.find((v) => {
        const nameMatch = pattern.pattern.test(v.name);
        const langMatch = v.lang?.toLowerCase().startsWith(pattern.lang);
        return nameMatch || (langMatch && pattern.pattern.test(v.name));
      });

      if (matchedVoice && !foundVoices.find((fv) => fv.voice.name === matchedVoice.name)) {
        foundVoices.push({
          voice: matchedVoice,
          name: pattern.fallbackName,
          lang: pattern.lang,
          gender: pattern.gender,
        });
      }
    }

    // If we don't have enough voices, add any remaining Turkish/English voices
    if (foundVoices.length < 4) {
      const remainingVoices = trEnVoices.filter((v) => !foundVoices.find((fv) => fv.voice.name === v.name));

      for (const remainingVoice of remainingVoices) {
        if (foundVoices.length >= 4) break;

        const lang = remainingVoice.lang?.toLowerCase().startsWith("tr") ? "tr" : "en";
        const langName = lang === "tr" ? "Turkish" : "English";

        foundVoices.push({
          voice: remainingVoice,
          name: `${remainingVoice.name} (${langName})`,
          lang: lang,
          gender: "unknown",
        });
      }
    }

    // If still not enough, add the first 4 available voices as fallback
    if (foundVoices.length === 0 && voices.length > 0) {
      const fallbackVoices = voices.slice(0, 4);
      fallbackVoices.forEach((v) => {
        foundVoices.push({
          voice: v,
          name: v.name || "Unknown Voice",
          lang: v.lang || "unknown",
          gender: "unknown",
        });
      });
    }

    return foundVoices;
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

      {/* Source - only show if there's selected text */}
      {selectedText && selectedText.trim() && (
        <select
          value={source}
          onChange={(e) => setSource(e.target.value as "selection" | "page")}
          className="ml-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
          aria-label="Reading source"
        >
          <option value="selection">Seçili Metin</option>
          <option value="page">Sayfa</option>
        </select>
      )}

      {/* Voice (Turkish/English curated) */}
      <select
        value={voice?.name || ""}
        onChange={(e) => {
          const selectedStandardVoice = standardVoices.find((sv) => sv.voice.name === e.target.value);
          setVoice(selectedStandardVoice?.voice || null);
        }}
        className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
        aria-label="Voice"
      >
        {standardVoices.map((sv) => (
          <option key={`${sv.voice.name}-${sv.voice.lang}`} value={sv.voice.name}>
            {sv.name}
          </option>
        ))}
      </select>
    </div>
  );
}
