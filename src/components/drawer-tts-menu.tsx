"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Volume2, Speech } from "lucide-react";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";

type Props = {
  viewerRef?: React.RefObject<HTMLDivElement | null>;
  selectedText?: string | null;
  isPinned: boolean;
};

export function DrawerTtsMenu({ viewerRef, selectedText, isPinned }: Props) {
  const { supported, status, voices, voice, setVoice, rate, setRate, speak, cancel, toggle } = useSpeechSynthesis();
  const [source, setSource] = useState<"selection" | "page">("selection");
  const sentencesRef = useRef<string[]>([]);
  const curIndexRef = useRef<number>(0);
  const cancelledRef = useRef<boolean>(false);

  const getTextToRead = useCallback(() => {
    if (source === "selection" && selectedText && selectedText.trim()) return selectedText.trim();
    const container = viewerRef?.current;
    if (!container) return "";
    const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument;
    const text = doc?.body?.innerText || doc?.body?.textContent || "";
    return text.replace(/\s+/g, " ").trim();
  }, [source, selectedText, viewerRef]);

  const getIframe = useCallback(() => {
    const container = viewerRef?.current;
    const iframe = container?.querySelector("iframe") as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument || null;
    const win = iframe?.contentWindow || null;
    return { iframe, doc, win } as const;
  }, [viewerRef]);

  const ensureTtsStyles = (doc: Document | null) => {
    if (!doc) return;
    if (doc.getElementById("tts-style-sheet")) return;
    const style = doc.createElement("style");
    style.id = "tts-style-sheet";
    style.textContent = `
      .tts-highlight { background: rgba(255, 235, 59, 0.45); border-radius: 4px; }
      #tts-cursor { position: absolute; width: 3px; background: #ef4444; border-radius: 2px; z-index: 2147483647; box-shadow: 0 0 6px rgba(239,68,68,0.6); }
    `;
    doc.head.appendChild(style);
  };

  const clearHighlights = useCallback(() => {
    const { doc } = getIframe();
    if (!doc) return;
    doc.querySelectorAll(".tts-highlight").forEach((el) => {
      const parent = el.parentNode as Node | null;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    });
    const cursor = doc.getElementById("tts-cursor");
    if (cursor?.parentElement) cursor.parentElement.removeChild(cursor);
  }, [getIframe]);

  const normalize = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

  const highlightSentence = useCallback(
    (sentence: string) => {
      const { doc, win } = getIframe();
      if (!doc || !win) return;
      ensureTtsStyles(doc);
      const target = normalize(sentence);
      if (!target) return;

      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
      let node: Node | null = walker.nextNode();
      while (node) {
        const text = node.nodeValue || "";
        const idx = normalize(text).indexOf(target);
        if (idx !== -1) {
          try {
            const range = doc.createRange();
            let rawIdx = text.toLowerCase().indexOf(sentence.trim().toLowerCase());
            if (rawIdx === -1) rawIdx = Math.max(0, idx);
            range.setStart(node, rawIdx);
            const end = Math.min((node.nodeValue || "").length, rawIdx + sentence.length);
            range.setEnd(node, end);

            const span = doc.createElement("span");
            span.className = "tts-highlight";
            range.surroundContents(span);

            let cursor = doc.getElementById("tts-cursor");
            if (!cursor) {
              cursor = doc.createElement("div");
              cursor.id = "tts-cursor";
              doc.body.appendChild(cursor);
            }
            const rect = span.getBoundingClientRect();
            cursor.style.left = `${rect.left + win.scrollX - 6}px`;
            cursor.style.top = `${rect.top + win.scrollY}px`;
            cursor.style.height = `${Math.max(16, rect.height)}px`;

            (span as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
          } catch {
            // ignore range errors
          }
          break;
        }
        node = walker.nextNode();
      }
    },
    [getIframe]
  );

  const splitIntoSentences = (text: string) => {
    const parts = text.match(/[^.!?\u2026]+[.!?\u2026]?/g) || [text];
    return parts.map((s) => s.trim()).filter(Boolean);
  };

  const speakNext = useCallback(() => {
    const sentences = sentencesRef.current;
    const i = curIndexRef.current;
    if (cancelledRef.current || i >= sentences.length) {
      clearHighlights();
      return;
    }
    const s = sentences[i];
    speak({
      text: s,
      onstart: () => {
        clearHighlights();
        highlightSentence(s);
      },
      onend: () => {
        curIndexRef.current = i + 1;
        setTimeout(() => speakNext(), 10);
      },
    });
  }, [speak, clearHighlights, highlightSentence]);

  const handlePlay = useCallback(() => {
    if (status === "idle") {
      const text = getTextToRead();
      if (!text) return;
      cancelledRef.current = false;
      sentencesRef.current = splitIntoSentences(text);
      curIndexRef.current = 0;
      speakNext();
    } else {
      toggle();
    }
  }, [status, getTextToRead, speakNext, toggle]);

  const handleStop = useCallback(() => {
    cancelledRef.current = true;
    cancel();
    clearHighlights();
  }, [cancel, clearHighlights]);

  const curatedVoices = (() => {
    const tr = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("tr"));
    const en = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
    const combined = [...tr, ...en];
    return (combined.length > 0 ? combined : voices).slice(0, 8);
  })();

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      clearHighlights();
    };
  }, [clearHighlights]);

  if (!supported) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-full flex items-center gap-2">
          <Speech className="w-5 h-5" />
          {isPinned && <span>Metin Seslendirme</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <div className="flex items-center justify-between mb-2">
          <div className="font-medium">Metin Seslendirme</div>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as "selection" | "page")}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
            aria-label="Reading source"
          >
            <option value="selection">Seçili Metin</option>
            <option value="page">Tüm Sayfa</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Button size="icon" className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handlePlay} aria-label="Play/Pause">
            {status === "speaking" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="icon" className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white" onClick={handleStop} aria-label="Stop">
            <Square className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          <span className="text-sm text-muted-foreground min-w-[60px]">Hız: {rate.toFixed(2)}x</span>
          <input type="range" min={0.5} max={1.5} step={0.05} value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full" aria-label="Speech rate" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Ses (Türkçe öncelikli)</label>
          <select
            value={voice?.name || ""}
            onChange={(e) => setVoice(curatedVoices.find((v) => v.name === e.target.value) || null)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
          >
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
