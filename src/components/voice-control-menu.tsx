"use client";
import { useCallback, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Volume2, MessageSquareText } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";

type Props = {
  viewerRef: React.RefObject<HTMLDivElement | null>;
  selectedText?: string | null;
};

export function VoiceControlMenu({ viewerRef, selectedText }: Props) {
  const { supported, status, voices, voice, setVoice, rate, setRate, speak, cancel, toggle } = useSpeechSynthesis();
  const [source, setSource] = useState<"selection" | "page">("selection");

  const textToRead = useMemo(() => {
    if (source === "selection" && selectedText && selectedText.trim()) return selectedText.trim();
    const container = viewerRef.current;
    if (!container) return "";
    const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument;
    const text = doc?.body?.innerText || doc?.body?.textContent || "";
    return text.replace(/\s+/g, " ").trim();
  }, [source, selectedText, viewerRef]);

  const onToggle = useCallback(() => {
    if (!textToRead) return;
    if (status === "idle") speak({ text: textToRead });
    else toggle();
  }, [status, speak, toggle, textToRead]);

  // Curate: ensure Turkish voices first, then English; keep list to a reasonable size
  const curatedVoices = useMemo(() => {
    const tr = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("tr"));
    const en = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
    const combined = [...tr, ...en];
    // If no TR/EN found, fall back to all voices
    return combined.length > 0 ? combined.slice(0, 12) : voices.slice(0, 12);
  }, [voices]);

  if (!supported) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="fixed bottom-24 right-5 z-50 shadow-lg flex items-center gap-2" variant="secondary">
          <MessageSquareText className="w-4 h-4" />
          <span className="hidden md:inline">Voice Control</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Metin Seslendirme</div>
          <select value={source} onChange={(e) => setSource(e.target.value as "selection" | "page")} className="rounded-md border px-2 py-1 text-sm">
            <option value="selection">Seçili Metin</option>
            <option value="page">Tüm Sayfa</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Button size="icon" className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onToggle} aria-label="Play/Pause">
            {status === "speaking" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="icon" className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white" onClick={cancel} aria-label="Stop">
            <Square className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Speech rate"
            title={`Rate: ${rate.toFixed(2)}x`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Ses (Türkçe öncelikli)</label>
          <select value={voice?.name || ""} onChange={(e) => setVoice(curatedVoices.find((v) => v.name === e.target.value) || null)} className="rounded-md border px-2 py-1 text-sm">
            {curatedVoices.map((v) => (
              <option key={`${v.name}-${v.lang}`} value={v.name}>{`${v.name} (${v.lang})`}</option>
            ))}
          </select>
          {curatedVoices.filter((v) => (v.lang || "").toLowerCase().startsWith("tr")).length === 0 && <div className="text-xs text-muted-foreground mt-1">Türkçe ses bulunamadı.</div>}
        </div>
      </PopoverContent>
    </Popover>
  );
}
