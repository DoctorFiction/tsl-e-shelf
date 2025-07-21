import { totalBookCharsAtom, copiedCharsAtom, copyAllowancePercentageAtom } from "@/atoms/copy-protection";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
              <DialogTitle>Confirm Copy</DialogTitle>
              <DialogDescription>
                You are about to copy a selection of text. Please review the details below.
              </DialogDescription>
            </DialogHeader>
            <div>
              <p>
                <strong>Selected Text:</strong>
              </p>
              <p className="max-h-32 overflow-y-auto rounded-md border bg-muted p-2">{selectedText}</p>
              <div className="mt-4 space-y-2">
                <p>
                  Copied: <strong>{currentCopiedPercentage.toFixed(2)}%</strong>
                </p>
                <p>
                  Selection: <strong>{selectionPercentage.toFixed(2)}%</strong>
                </p>
                <p>
                  Remaining: <strong>{remainingPercentage.toFixed(2)}%</strong>
                </p>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Allowance Progress</p>
                  <Progress value={(currentCopiedPercentage / copyAllowance) * 100} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {copiedChars.toFixed(0)} of {(totalBookChars * copyAllowance / 100).toFixed(0)} characters copied ({currentCopiedPercentage.toFixed(2)}% of {copyAllowance.toFixed(2)}% allowance)
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              {remainingPercentage < 0 && (
                <p className="text-sm text-red-500 mr-auto">
                  Warning: This selection exceeds your remaining copy allowance.
                </p>
              )}
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleInitialConfirm} disabled={remainingPercentage < 0}>Confirm</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Final Confirmation</DialogTitle>
              <DialogDescription>
                Are you sure you want to copy this text? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                You are copying: <strong>{selectionPercentage.toFixed(2)}%</strong> of the book.
              </p>
              <p>
                After this, your remaining allowance will be: <strong>{remainingPercentage.toFixed(2)}%</strong>
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowFinalConfirmation(false)}>
                Back
              </Button>
              <Button onClick={handleFinalConfirm}>Confirm Copy</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
