import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { ArrowLeft } from 'lucide-react';

interface EditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdate, onBack }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  
  const pendingUpdateRef = useRef(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    pendingUpdateRef.current = false;
  }, [note.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        onUpdate({
          ...note,
          title,
          content,
          updatedAt: Date.now(),
        });
        pendingUpdateRef.current = false;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content, note, onUpdate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    pendingUpdateRef.current = true;
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    pendingUpdateRef.current = true;
  };

  const handleBack = () => {
    if (pendingUpdateRef.current) {
        onUpdate({
            ...note,
            title,
            content,
            updatedAt: Date.now(),
        });
    }
    onBack();
  };

  return (
    <div className="flex-1 flex flex-col h-full relative bg-slate-50/50 dark:bg-slate-950">
      {/* Toolbar / Header */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md z-10 sticky top-0 transition-colors">
        <div className="flex items-center">
          {/* Back Button for Mobile */}
          <button 
            onClick={handleBack}
            className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors mr-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium md:hidden">
             {title || 'Untitled'}
          </span>
        </div>
        
        {/* You could add other tools here like Export, Info, etc. */}
        <div className="flex items-center gap-3">
           <div className="text-xs text-slate-400 hidden md:block">
              {content.split(/\s+/).filter(w => w.length > 0).length} words
           </div>
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-8 md:py-12">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Note Title"
            className="w-full text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none focus:outline-none focus:ring-0 bg-transparent mb-6 md:mb-8 transition-colors leading-tight"
          />
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing..."
            className="w-full h-[calc(100vh-250px)] resize-none text-lg md:text-xl leading-8 text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none focus:outline-none focus:ring-0 bg-transparent transition-colors custom-scrollbar"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};