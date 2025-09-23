import { Button } from "@/components/ui/button";
import { Settings, LogOut, Home, AlignRight, AlignJustify, Play, Pause, Square, Volume2, MessageSquareText } from "lucide-react";
import { useRef, useState } from "react";
import { Typography } from "./ui/typography";
import { CircularSpinner } from "./ui/circular-spinner";
import Link from "next/link";
import { Card } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";

type EnhancedNavItem = {
  label: string;
  href: string;
  subitems?: EnhancedNavItem[];
  page?: number;
};

interface MainDrawerProps {
  onDrawerStateChange?: (isPinned: boolean) => void;
  toc?: EnhancedNavItem[];
  goToHref?: (href: string) => void;
  tocLoading?: boolean;
  // for TTS
  viewerRef?: React.RefObject<HTMLDivElement | null>;
  selectedText?: string | null;
}

export function MainDrawer({ onDrawerStateChange, toc, goToHref, tocLoading, viewerRef, selectedText }: MainDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(false);
  const { supported, status, voices, voice, setVoice, rate, setRate, speak, cancel, toggle } = useSpeechSynthesis();

  const getTextToRead = () => {
    // prefer selection if available
    if (selectedText && selectedText.trim()) return selectedText.trim();
    const container = viewerRef?.current;
    if (!container) return "";
    const iframe = container.querySelector("iframe") as HTMLIFrameElement | null;
    const doc = iframe?.contentDocument;
    const text = doc?.body?.innerText || doc?.body?.textContent || "";
    return text.replace(/\s+/g, " ").trim();
  };

  const curatedVoices = (() => {
    const tr = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("tr"));
    const en = voices.filter((v) => (v.lang || "").toLowerCase().startsWith("en"));
    const combined = [...tr, ...en];
    return (combined.length > 0 ? combined : voices).slice(0, 8);
  })();

  return (
    <div
      ref={drawerRef}
      className={`hidden md:flex fixed left-0 top-0 h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md p-4 mt-1 flex-col space-y-4 transition-all duration-300 z-50
        ${isPinned ? "w-64" : "w-20 items-center"}`}
    >
      {isPinned ? (
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Home className="w-6 h-6" />
            <div className="flex flex-col items-start">
              <Typography variant="h6">Nobel Yayın</Typography>
              <Typography variant="body2" className="text-muted-foreground">
                TSL E-Shelf
              </Typography>
            </div>
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              setIsPinned(!isPinned);
              onDrawerStateChange?.(!isPinned);
            }}
            aria-label="Collapse Drawer"
            className="p-2"
          >
            <AlignRight className="w-6 h-6" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <Link href="/" className="flex items-center justify-center p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
            <Home className="w-6 h-6" />
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              setIsPinned(!isPinned);
              onDrawerStateChange?.(!isPinned);
            }}
            aria-label="Expand Drawer"
            className="p-2"
          >
            <AlignJustify className="w-6 h-6" />
          </Button>
        </div>
      )}

      <div className="flex flex-col flex-1 min-h-0">
        <Typography variant="h6" className="font-bold">
          {isPinned && "İçindekiler"}
        </Typography>
        <div className="flex-1 min-h-0 mt-2">
          <ul role="list" aria-label="İçindekiler" className={`pr-2 ${isPinned ? "h-full overflow-y-auto divide-y divide-border" : "overflow-hidden"}`}>
            {tocLoading ? (
              <li className="flex items-center justify-center h-full py-6">
                <CircularSpinner size={1.5} />
              </li>
            ) : toc && toc.length > 0 ? (
              <>
                {toc.map((item, i) => (
                  <li key={`${item.href}-${i}`} className="last:pb-6">
                    <button type="button" onClick={() => goToHref?.(item.href)} className="w-full text-left flex items-start gap-1 px-1 py-3 hover:bg-muted/50 cursor-pointer">
                      <div className="flex-1">
                        {isPinned && (
                          <Typography variant="body2" className="text-foreground break-words leading-snug">
                            {item.label}
                          </Typography>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <li className="px-3 py-3">
                <Typography variant="body2" className="text-muted-foreground">
                  İçindekiler tablosu mevcut değil.
                </Typography>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-3 mb-4">
        {supported && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" className="w-full flex items-center gap-2">
                <MessageSquareText className="w-5 h-5" />
                {isPinned && <span>Metin Seslendirme</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="icon"
                  className="h-9 w-9 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => (status === "idle" ? speak({ text: getTextToRead() }) : toggle())}
                  aria-label="Play/Pause"
                >
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
                  title={`Hız: ${rate.toFixed(2)}x`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-muted-foreground">Ses</label>
                <select
                  value={voice?.name || ""}
                  onChange={(e) => setVoice(curatedVoices.find((v) => v.name === e.target.value) || null)}
                  className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
                >
                  {curatedVoices.map((v) => (
                    <option key={`${v.name}-${v.lang}`} value={v.name}>{`${v.name} (${v.lang})`}</option>
                  ))}
                </select>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Card className={`p-2 w-full ${isPinned ? "flex-row" : "flex-col"} items-center gap-2 bg-gray-200 dark:bg-gray-700`}>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">HÖ</div>
          {isPinned && (
            <div className="flex flex-col items-start flex-grow">
              <Typography variant="body1">Hasan Özçelik</Typography>
              <Button variant="ghost" size="sm" className="p-0 h-auto justify-start">
                <Settings className="w-4 h-4 mr-1" />
                Ayarlar
              </Button>
            </div>
          )}
        </Card>
        <Button variant="destructive" className="w-full flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          {isPinned && <span>Çıkış Yap</span>}
        </Button>
      </div>
    </div>
  );
}
