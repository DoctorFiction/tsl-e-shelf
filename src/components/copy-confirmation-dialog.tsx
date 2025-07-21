import { totalBookCharsAtom, copiedCharsAtom, copyAllowancePercentageAtom } from "@/atoms/copy-protection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAtom } from "jotai";

interface CopyConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  selectedText: string;
}

import { useState } from "react";

export function CopyConfirmationDialog({ isOpen, onConfirm, onCancel, selectedText }: CopyConfirmationDialogProps) {
  const [totalBookChars] = useAtom(totalBookCharsAtom);
  const [copiedChars] = useAtom(copiedCharsAtom);
  const [copyAllowance] = useAtom(copyAllowancePercentageAtom);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

  const selectionLength = selectedText.length;
  const currentCopiedPercentage = totalBookChars > 0 ? (copiedChars / totalBookChars) * 100 : 0;
  const selectionPercentage = totalBookChars > 0 ? (selectionLength / totalBookChars) * 100 : 0;
  const remainingPercentage = copyAllowance - (currentCopiedPercentage + selectionPercentage);

  const handleInitialConfirm = () => {
    setShowFinalConfirmation(true);
  };

  const handleFinalConfirm = () => {
    onConfirm();
    setShowFinalConfirmation(false);
  };

  const handleCancel = () => {
    setShowFinalConfirmation(false);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent>
        {!showFinalConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle>Kopyalamayı Onayla</DialogTitle>
              <DialogDescription>Bir metin parçasını kopyalamak üzeresiniz. Lütfen aşağıdaki detayları inceleyin.</DialogDescription>
            </DialogHeader>
            <div>
              <p>
                <strong>Seçilen Metin:</strong>
              </p>
              <p className="max-h-32 overflow-y-auto rounded-md border bg-muted p-2">{selectedText}</p>
              <div className="mt-4 space-y-2">
                <p>
                  Kopyalandı: <strong>{currentCopiedPercentage.toFixed(2)}%</strong>
                </p>
                <p>
                  Seçim: <strong>{selectionPercentage.toFixed(2)}%</strong>
                </p>
                <p>
                  Kalan: <strong>{remainingPercentage.toFixed(2)}%</strong>
                </p>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">İzin Durumu</p>
                  <Progress value={(currentCopiedPercentage / copyAllowance) * 100} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copiedChars.toFixed(0)} / {((totalBookChars * copyAllowance) / 100).toFixed(0)} karakter kopyalandı ({currentCopiedPercentage.toFixed(2)}% / {copyAllowance.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              {remainingPercentage < 0 && <p className="text-sm text-red-500 mr-auto">Uyarı: Bu seçim, kalan kopyalama izninizi aşıyor.</p>}
              <Button variant="outline" onClick={handleCancel}>
                İptal
              </Button>
              <Button onClick={handleInitialConfirm} disabled={remainingPercentage < 0}>
                Onayla
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Son Onay</DialogTitle>
              <DialogDescription>Bu metni kopyalamak istediğinizden emin misiniz? Bu eylem geri alınamaz.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                Kitabın <strong>{selectionPercentage.toFixed(2)}%</strong>&apos;ini kopyalıyorsunuz.
              </p>
              <p>
                Bundan sonra, kalan izniniz: <strong>{remainingPercentage.toFixed(2)}%</strong> olacak.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFinalConfirmation(false)}>
                Geri
              </Button>
              <Button onClick={handleFinalConfirm}>Kopyalamayı Onayla</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
