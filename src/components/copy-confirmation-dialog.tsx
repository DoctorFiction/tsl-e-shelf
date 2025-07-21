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

export function CopyConfirmationDialog({ isOpen, onConfirm, onCancel, selectedText }: CopyConfirmationDialogProps) {
  const [totalBookChars] = useAtom(totalBookCharsAtom);
  const [copiedChars] = useAtom(copiedCharsAtom);
  const [copyAllowance] = useAtom(copyAllowancePercentageAtom);

  const selectionLength = selectedText.length;
  const currentCopiedPercentage = totalBookChars > 0 ? (copiedChars / totalBookChars) * 100 : 0;
  const selectionPercentage = totalBookChars > 0 ? (selectionLength / totalBookChars) * 100 : 0;
  const remainingPercentage = copyAllowance - (currentCopiedPercentage + selectionPercentage);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
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
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={remainingPercentage < 0}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
