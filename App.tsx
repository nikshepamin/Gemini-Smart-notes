import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Auth } from './components/Auth';
import { Note, User } from './types';
import { authService } from './services/authService';
import { noteService } from './services/noteService';
import { supabase } from './services/supabaseClient';
import { Loader2, BookOpen, Plus } from 'lucide-react';

interface AuthenticatedAppProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoadingNotes(true);
      const fetchedNotes = await noteService.getNotes();
      
      // Identify and cleanup empty notes on load
      const emptyNotes = fetchedNotes.filter(n => !n.title.trim() && !n.content.trim());
      
      if (emptyNotes.length > 0) {
        // We delete them from DB silently
        Promise.all(emptyNotes.map(n => noteService.deleteNote(n.id))).catch(console.error);
        
        // And filter them out from the UI state immediately
        const validNotes = fetchedNotes.filter(n => n.title.trim() || n.content.trim());
        setNotes(validNotes);
      } else {
        setNotes(fetchedNotes);
      }
    } catch (error) {
      console.error('Failed to load notes', error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Helper to delete the current active note if it's empty before switching
  const cleanupEmptyNote = async (idToCheck: string) => {
    const note = notes.find(n => n.id === idToCheck);
    
    // If note exists but has no content or title (whitespace trimmed), delete it
    if (note && !note.title.trim() && !note.content.trim()) {
      try {
        await noteService.deleteNote(note.id);
        setNotes(prev => prev.filter(n => n.id !== note.id));
      } catch (e) {
        console.error("Failed to cleanup empty note", e);
      }
    }
  };

  const handleSelectNote = async (id: string) => {
    // Before switching to a new note, check if the *current* active note is empty and should be deleted
    if (activeNoteId && activeNoteId !== id) {
       await cleanupEmptyNote(activeNoteId);
    }
    setActiveNoteId(id);
  };

  const handleBack = async () => {
    // When going back to list, check if the current note is empty
    if (activeNoteId) {
      await cleanupEmptyNote(activeNoteId);
    }
    setActiveNoteId(null);
  };

  const handleAddNote = async () => {
    // Before creating a new one, cleanup current if empty
    if (activeNoteId) {
      await cleanupEmptyNote(activeNoteId);
    }

    const newNoteTemp = {
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const createdNote = await noteService.createNote(user.id, newNoteTemp);
      setNotes([createdNote, ...notes]);
      setActiveNoteId(createdNote.id);
    } catch (e) {
      console.error("Failed to create note", e);
    }
  };

  const handleUpdateNote = async (updatedNote: Note) => {
    // Optimistic update
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );

    // Persist to DB
    try {
      await noteService.updateNote(updatedNote.id, updatedNote);
    } catch (e) {
      console.error("Failed to update note", e);
    }
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 1. Optimistic Update: Remove from UI immediately
    const prevNotes = [...notes];
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
    }

    // 2. Perform DB deletion
    try {
      await noteService.deleteNote(id);
    } catch (error: any) {
      console.error("Failed to delete note from DB", error);
      
      // 3. Revert on failure
      setNotes(prevNotes);
      if (activeNoteId === id) {
        setActiveNoteId(id);
      }
      
      alert(`Failed to delete note: ${error.message}. Please check your internet connection or account permissions.`);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      
      {/* Sidebar - increased width for better readability */}
      <div className={`
        flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300
        ${activeNoteId ? 'hidden md:flex' : 'flex'}
        w-full md:w-96 flex-shrink-0 z-20
      `}>
        <Sidebar
          user={user}
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={handleSelectNote}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
          onLogout={onLogout}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 flex flex-col h-full w-full relative bg-white dark:bg-slate-950 transition-all duration-300
        ${!activeNoteId ? 'hidden md:flex' : 'flex'}
      `}>
        {isLoadingNotes ? (
           <div className="flex-1 flex items-center justify-center text-slate-400">
             <Loader2 className="w-10 h-10 animate-spin text-indigo-500 dark:text-indigo-400" />
           </div>
        ) : activeNote ? (
          <Editor
            note={activeNote}
            onUpdate={handleUpdateNote}
            onBack={handleBack}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center relative overflow-hidden">
             {/* Background Gradients */}
             <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-28 h-28 bg-gradient-to-br from-indigo-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)] dark:shadow-[0_0_40px_rgba(99,102,241,0.15)] ring-1 ring-indigo-100 dark:ring-slate-700">
                 <BookOpen className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4 tracking-tight">Welcome back, {user.name.split(' ')[0]}</h2>
              <p className="max-w-lg mx-auto mb-10 text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                Select a note from the sidebar to start reading, or create a new one to capture your thoughts.
              </p>
              <button
                onClick={handleAddNote}
                className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-lg text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full hover:from-indigo-500 hover:to-violet-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] hover:-translate-y-0.5"
              >
                <span className="mr-2">Create New Note</span>
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
       if (session?.user) {
         setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
         });
       } else {
         setUser(null);
       }
       setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  }

  return (
    <AuthenticatedApp 
      key={user.id} 
      user={user} 
      onLogout={handleLogout} 
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
    />
  );
};

export default App;