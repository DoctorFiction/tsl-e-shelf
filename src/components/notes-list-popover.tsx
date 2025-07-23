import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Typography } from "@/components/ui/typography";
import { Note } from "@/hooks/use-epub-reader";
import formatRelativeDate from "@/lib/format-relative-date";
import { FilePenLine, Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddEditNoteDialog } from "./add-edit-note-dialog";
import { DeleteNoteConfirmPrompt } from "./delete-note-confirm-prompt";

interface NotesListPopoverProps {
  notes: Note[];
  goToCfi: (cfi: string) => void;
  removeNote: (cfiToRemove: string) => void;
  removeAllNotes: () => void;
  editNote: (cfi: string, newNote: string) => void;
}

export function NotesListPopover({ notes, goToCfi, removeNote, removeAllNotes, editNote }: NotesListPopoverProps) {
  const [noteDeleteDialogOpen, setNoteDeleteDialogOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveEdit = (newNote: string) => {
    if (editingNote) {
      editNote(editingNote.cfi, newNote);
      setEditingNote(null);
    }
  };

  const handleDeleteNote = (note?: Note) => {
    const cfiToRemove = note ? note.cfi : editingNote ? editingNote.cfi : null;
    if (!cfiToRemove) return;
    removeNote(cfiToRemove);
    setEditingNote(null);
  };

  const handleShowDeletePrompt = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
          aria-label="Notları Göster"
          type="button"
        >
          <FilePenLine className="w-4 h-4 text-purple-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4" align="start" side="bottom">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="body1" className="font-bold">
            Notlar
          </Typography>
          {notes && notes.length > 0 && (
            <AlertDialog open={noteDeleteDialogOpen} onOpenChange={setNoteDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" aria-label="Tüm notları sil">
                  <Trash className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tüm Notları Sil</AlertDialogTitle>
                  <AlertDialogDescription>Bu işlem tüm notları kalıcı olarak silecek. Bu işlem geri alınamaz.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      removeAllNotes();
                      setNoteDeleteDialogOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Evet, Tümünü Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <ul className="max-h-64 overflow-y-auto">
          {notes && notes.length > 0 ? (
            notes.map((note, i) => {
              return (
                <Card
                  key={i}
                  className="relative px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group overflow-hidden border border-gray-200 dark:border-gray-700 mb-2"
                >
                  <div
                    className="w-full"
                    onClick={() => {
                      goToCfi(note.cfi);
                    }}
                  >
                    <div className="absolute top-3 right-3">
                      <Typography variant="caption" className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeDate(note.createdAt)}
                      </Typography>
                    </div>

                    <div className="pr-12 mb-8">
                      <Typography variant="body2" className="line-clamp-3 text-gray-900 dark:text-gray-100 leading-relaxed">
                        {note.text}
                      </Typography>
                    </div>

                    <div className="absolute bottom-3 left-4">
                      <Typography variant="caption" className="text-xs text-gray-500 dark:text-gray-400">
                        {note.note}
                      </Typography>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <button
                      className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md hover:shadow-lg"
                      aria-label="Notu Düzenle"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(note);
                      }}
                      type="button"
                    >
                      <FilePenLine className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md hover:shadow-lg"
                      aria-label="Notu Sil"
                      onClick={handleShowDeletePrompt}
                      type="button"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {showDeleteConfirm && <DeleteNoteConfirmPrompt open={showDeleteConfirm} setShowDeleteConfirm={setShowDeleteConfirm} handleDelete={() => handleDeleteNote(note)} />}
                </Card>
              );
            })
          ) : (
            <Typography variant="body2" className="text-gray-400">
              Not bulunamadı.
            </Typography>
          )}
        </ul>
        {editingNote && <AddEditNoteDialog open={!!editingNote} note={editingNote} onSave={handleSaveEdit} onDelete={() => handleDeleteNote()} onClose={() => setEditingNote(null)} />}
      </PopoverContent>
    </Popover>
  );
}
