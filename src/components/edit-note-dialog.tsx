
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Note } from "@/hooks/use-epub-reader";
import { useState } from "react";

interface EditNoteDialogProps {
  note: Note;
  onSave: (newNote: string) => void;
  onClose: () => void;
}

export function EditNoteDialog({ note, onSave, onClose }: EditNoteDialogProps) {
  const [editedNoteText, setEditedNoteText] = useState(note.note);

  const handleSave = () => {
    onSave(editedNoteText);
    onClose();
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Note</AlertDialogTitle>
          <AlertDialogDescription>
            Update your note for the selected text.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={editedNoteText}
          onChange={(e) => setEditedNoteText(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
