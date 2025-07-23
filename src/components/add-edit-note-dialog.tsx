import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/hooks/use-epub-reader";
import { useState } from "react";
import { Button } from "./ui/button";
import { DeleteNoteConfirmPrompt } from "./delete-note-confirm-prompt";

interface EditNoteDialogProps {
  note?: Note;
  open: boolean;
  onSave: (newNote: string) => void;
  onDelete?: (cfi: string) => void;
  onClose: () => void;
}

// TODO (2025-07-22): Fix delete note when editing.
export function AddEditNoteDialog({ note, open, onSave, onDelete, onClose }: EditNoteDialogProps) {
  const [editedNoteText, setEditedNoteText] = useState<string>(note?.note ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onSave(editedNoteText);
    onClose();
  };

  const handleDelete = () => {
    if (!note || !onDelete) return;
    onDelete(note?.cfi);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setEditedNoteText("");
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={handleClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Not {!note ? "Ekle" : "Düzenle"} </AlertDialogTitle>
            <AlertDialogDescription>Seçilen metin için notunuzu güncelleyin.</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea value={editedNoteText} onChange={(e) => setEditedNoteText(e.target.value)} className="w-full p-2 border rounded" />
          <AlertDialogFooter>
            {note && (
              <Button className="bg-red-500 hover:bg-red-600" onClick={() => setShowDeleteConfirm(true)}>
                Sil
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <AlertDialogCancel onClick={handleClose}>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave}>Kaydet</AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showDeleteConfirm && note && <DeleteNoteConfirmPrompt open={showDeleteConfirm} setShowDeleteConfirm={setShowDeleteConfirm} handleDelete={handleDelete} />}
    </>
  );
}
