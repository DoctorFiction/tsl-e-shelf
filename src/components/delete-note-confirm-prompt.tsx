import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface DeleteNoteConfirmPromptProps {
  open: boolean;
  setShowDeleteConfirm: (open: boolean) => void;
  handleDelete: () => void;
}

export const DeleteNoteConfirmPrompt = ({ open, setShowDeleteConfirm, handleDelete }: DeleteNoteConfirmPromptProps) => {
  return (
    <AlertDialog open={open} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kesinlikle emin misiniz?</AlertDialogTitle>
          <AlertDialogDescription>Bu işlem geri alınamaz. Notunuz kalıcı olarak silinecektir.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>İptal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
            Sil
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
