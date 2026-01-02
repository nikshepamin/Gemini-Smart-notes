import React from 'react';
import { Note, User } from '../types';
import { Plus, Search, Trash2, LogOut, Sun, Moon, Book } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  user: User;
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  notes,
  activeNoteId,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  onLogout,
  isDarkMode,
  toggleTheme
}) => {
  const [search, setSearch] = React.useState('');

  const filteredNotes = notes
    .filter((note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center ring-1 ring-indigo-200 dark:ring-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <Book className="w-6 h-6 fill-current" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
              My Notes
            </span>
          </div>
          
          <button 
            type="button"
            onClick={toggleTheme}
            className="p-2.5 text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-slate-800"
          >
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>
        
        <div className="relative group mb-5">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base 
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500/50
              text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600
              transition-all shadow-sm"
          />
        </div>

        <button
          onClick={onAddNote}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 px-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 font-bold text-base"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Note</span>
        </button>
      </div>

      {/* Note List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400 dark:text-slate-600 text-base">
            <div className="w-14 h-14 mb-4 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <Plus className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            </div>
            {search ? 'No notes found' : 'No notes yet. Start writing!'}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`
                group relative flex flex-col p-5 rounded-2xl cursor-pointer transition-all border
                ${activeNoteId === note.id 
                  ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-500/30 shadow-md ring-1 ring-indigo-500/20' 
                  : 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-sm'}
              `}
            >
              {/* Note Header: Title & Delete */}
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-bold text-base truncate pr-2 transition-colors flex-1 ${activeNoteId === note.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'}`}>
                  {note.title || 'Untitled Note'}
                </h3>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id, e);
                  }}
                  className="opacity-100 md:opacity-0 group-hover:opacity-100 p-2 -mr-2 -mt-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Delete note"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Note Preview */}
              <p className={`text-sm line-clamp-2 mb-3 min-h-[1.25rem] leading-relaxed ${activeNoteId === note.id ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>
                {note.content || <span className="italic opacity-50">No content...</span>}
              </p>
              
              {/* Footer: Date */}
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
              </span>
            </div>
          ))
        )}
      </div>

      {/* User Footer */}
      <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-200 to-purple-200 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-700 dark:text-indigo-200 font-bold text-lg flex-shrink-0 border border-indigo-100 dark:border-indigo-800 shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-500 truncate">{user.email}</span>
                </div>
            </div>
            <button 
                type="button"
                onClick={onLogout}
                className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                title="Log out"
            >
                <LogOut className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
};