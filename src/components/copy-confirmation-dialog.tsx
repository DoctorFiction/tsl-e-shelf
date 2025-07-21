import { totalBookCharsAtom, copiedCharsAtom } from "@/atoms/copy-protection";
import { Button } from "@/components/ui/button";
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

  const selectionLength = selectedText.length;
  const currentCopiedPercentage = totalBookChars > 0 ? (copiedChars / totalBookChars) * 100 : 0;
  const selectionPercentage = totalBookChars > 0 ? (selectionLength / totalBookChars) * 100 : 0;
  const remainingPercentage = 10 - (currentCopiedPercentage + selectionPercentage);

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
              Current Copied: <strong>{currentCopiedPercentage.toFixed(2)}%</strong>
            </p>
            <p>
              This Selection: <strong>{selectionPercentage.toFixed(2)}%</strong>
            </p>
            <p>
              Remaining Allowance: <strong>{remainingPercentage.toFixed(2)}%</strong>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
