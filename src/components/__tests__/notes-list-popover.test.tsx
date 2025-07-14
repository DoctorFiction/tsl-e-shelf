/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { NotesListPopover } from '../notes-list-popover';
import { Note } from '@/hooks/use-epub-reader';

// Mock external dependencies
jest.mock('@/lib/format-relative-date', () => jest.fn(() => '2 days ago'));
jest.mock('../edit-note-dialog', () => ({
  EditNoteDialog: ({ note, onSave, onClose }: { note: Note; onSave: (newNote: string) => void; onClose: () => void }) => (
    <div data-testid="edit-note-dialog">
      <p>{note.note}</p>
      <button onClick={() => onSave('Updated Note')}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  ),
}));

describe('NotesListPopover', () => {
  const mockNotes: Note[] = [
    {
      cfi: 'cfi1',
      text: 'Selected text 1',
      note: 'My first note',
      createdAt: new Date().toISOString(),
    },
    {
      cfi: 'cfi2',
      text: 'Selected text 2',
      note: 'My second note',
      createdAt: new Date().toISOString(),
    },
  ];

  const mockGoToCfi = jest.fn();
  const mockRemoveNote = jest.fn();
  const mockRemoveAllNotes = jest.fn();
  const mockEditNote = jest.fn();

  const renderComponent = (notes: Note[] = mockNotes) => {
    render(
      <NotesListPopover
        notes={notes}
        goToCfi={mockGoToCfi}
        removeNote={mockRemoveNote}
        removeAllNotes={mockRemoveAllNotes}
        editNote={mockEditNote}
      />
    );

    // Open the popover by clicking the trigger button
    fireEvent.click(screen.getByLabelText('Show notes'));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders no notes message when notes array is empty', () => {
    renderComponent([]);
    expect(screen.getByText('No notes found.')).toBeInTheDocument();
  });

  it('renders notes correctly when notes array is not empty', () => {
    renderComponent();
    expect(screen.getByText('My first note')).toBeInTheDocument();
    expect(screen.getByText('My second note')).toBeInTheDocument();
    expect(screen.getAllByText('2 days ago').length).toBe(mockNotes.length);
  });

  it('calls goToCfi when a note card is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('My first note').closest('.w-full') as HTMLElement);
    expect(mockGoToCfi).toHaveBeenCalledWith('cfi1');
  });

  it('opens the EditNoteDialog when the edit button is clicked', () => {
    renderComponent();
    const editButtons = screen.getAllByLabelText('Edit note');
    fireEvent.click(editButtons[0]);
    const dialog = screen.getByTestId('edit-note-dialog');
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText('My first note')).toBeInTheDocument();
  });

  it('calls editNote and closes dialog when save button in EditNoteDialog is clicked', async () => {
    renderComponent();
    const editButtons = screen.getAllByLabelText('Edit note');
    fireEvent.click(editButtons[0]);

    const dialog = screen.getByTestId('edit-note-dialog');
    fireEvent.click(within(dialog).getByText('Save'));

    await waitFor(() => {
      expect(mockEditNote).toHaveBeenCalledWith('cfi1', 'Updated Note');
      expect(screen.queryByTestId('edit-note-dialog')).not.toBeInTheDocument();
    });
  });

  it('calls removeNote when the delete button is clicked for a single note', () => {
    renderComponent();
    const deleteButtons = screen.getAllByLabelText('Delete note');
    fireEvent.click(deleteButtons[0]);
    expect(mockRemoveNote).toHaveBeenCalledWith('cfi1');
  });

  it('opens and confirms the delete all notes dialog', () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText('Delete all notes'));
    expect(screen.getByText('Delete All Notes')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Yes, Delete All'));
    expect(mockRemoveAllNotes).toHaveBeenCalled();
    expect(screen.queryByText('Delete All Notes')).not.toBeInTheDocument();
  });

  it('closes the delete all notes dialog when cancel is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByLabelText('Delete all notes'));
    expect(screen.getByText('Delete All Notes')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockRemoveAllNotes).not.toHaveBeenCalled();
    expect(screen.queryByText('Delete All Notes')).not.toBeInTheDocument();
  });
});
