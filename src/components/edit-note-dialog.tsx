
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
  onDelete: (cfi: string) => void;
  onClose: () => void;
}

export function EditNoteDialog({ note, onSave, onDelete, onClose }: EditNoteDialogProps) {
  const [editedNoteText, setEditedNoteText] = useState(note.note);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    onSave(editedNoteText);
    onClose();
  };

  const handleDelete = () => {
    onDelete(note.cfi);
    onClose();
  };

  return (
    <>
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
            <AlertDialogAction onClick={() => setShowDeleteConfirm(true)} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
            <div className="flex gap-2 ml-auto">
              <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showDeleteConfirm && (
        <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
      
