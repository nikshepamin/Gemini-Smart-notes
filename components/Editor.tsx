import React, { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { Button } from './Button';
import { Sparkles, Wand2, SpellCheck, RefreshCw, PenLine, ArrowLeft, MoreHorizontal } from 'lucide-react';
import * as GeminiService from '../services/geminiService';

interface EditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdate, onBack }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  
  const pendingUpdateRef = useRef(false);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setAiMessage(null);
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

  const handleAiAction = async (action: 'improve' | 'fix' | 'summarize' | 'title' | 'continue') => {
    if (!content.trim() && action !== 'continue') return;
    
    setIsAiLoading(true);
    setAiMessage("Gemini is thinking...");
    
    try {
      let result = '';
      
      switch (action) {
        case 'improve':
          result = await GeminiService.improveWriting(content);
          setContent(result);
          pendingUpdateRef.current = true;
          setAiMessage("Text improved!");
          break;
        case 'fix':
          result = await GeminiService.fixGrammar(content);
          setContent(result);
          pendingUpdateRef.current = true;
          setAiMessage("Grammar fixed!");
          break;
        case 'summarize':
          result = await GeminiService.summarizeContent(content);
          const newContentWithSummary = `${content}\n\n### AI Summary\n${result}`;
          setContent(newContentWithSummary);
          pendingUpdateRef.current = true;
          setAiMessage("Summary added to bottom!");
          break;
        case 'title':
          result = await GeminiService.generateTitle(content);
          setTitle(result);
          pendingUpdateRef.current = true;
          setAiMessage("Title updated!");
          break;
        case 'continue':
          result = await GeminiService.continueWriting(content);
          setContent(prev => prev + (prev.endsWith(' ') ? '' : ' ') + result);
          pendingUpdateRef.current = true;
          setAiMessage("Text continued!");
          break;
      }
    } catch (error) {
      console.error(error);
      setAiMessage("Failed to process request.");
    } finally {
      setIsAiLoading(false);
      setTimeout(() => setAiMessage(null), 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative bg-slate-50/50 dark:bg-slate-950">
      {/* Toolbar / Header */}
      <div className="h-20 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md z-10 sticky top-0 transition-colors">
        <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar py-2">
          {/* Back Button for Mobile */}
          <button 
            onClick={handleBack}
            className="md:hidden p-3 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-1 border-l pl-2 md:pl-4 border-slate-200 dark:border-slate-800 md:border-slate-200 md:dark:border-slate-800 border-none">
            <Button 
              variant="ghost" 
              size="md" 
              onClick={() => handleAiAction('fix')}
              disabled={isAiLoading}
              title="Fix Grammar"
              className="text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              <SpellCheck className="w-5 h-5 md:mr-2 text-indigo-500 dark:text-indigo-400" />
              <span className="hidden md:inline">Fix</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="md" 
              onClick={() => handleAiAction('improve')}
              disabled={isAiLoading}
              title="Improve Writing"
              className="text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
            >
              <Wand2 className="w-5 h-5 md:mr-2 text-purple-500 dark:text-purple-400" />
              <span className="hidden md:inline">Improve</span>
            </Button>

            <Button 
              variant="ghost" 
              size="md" 
              onClick={() => handleAiAction('continue')}
              disabled={isAiLoading}
              title="Continue Writing"
              className="text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
            >
               <PenLine className="w-5 h-5 md:mr-2 text-blue-500 dark:text-blue-400" />
               <span className="hidden md:inline">Continue</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
            {aiMessage && (
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-fade-in px-2 hidden lg:inline-block">
                    {aiMessage}
                </span>
            )}
           <Button 
              variant="secondary" 
              size="md"
              onClick={() => handleAiAction('title')}
              disabled={isAiLoading}
              title="Auto-generate Title"
              className="hidden md:inline-flex dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 font-medium"
            >
              <RefreshCw className={`w-4 h-4 md:mr-2 ${isAiLoading ? 'animate-spin' : ''}`} />
               <span className="hidden md:inline">Auto Title</span>
            </Button>
           <Button 
              variant="primary" 
              size="md"
              onClick={() => handleAiAction('summarize')}
              disabled={isAiLoading}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] border-none font-semibold px-6"
            >
              <Sparkles className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Summarize</span>
            </Button>
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
            placeholder="Start writing or ask Gemini to help..."
            className="w-full h-[calc(100vh-250px)] resize-none text-lg md:text-xl leading-8 text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none focus:outline-none focus:ring-0 bg-transparent transition-colors custom-scrollbar"
            spellCheck={false}
          />
        </div>
      </div>
      
      {/* Mobile AI Quick Actions (Bottom Bar) */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-800 p-3 flex justify-around bg-white dark:bg-slate-950 pb-safe">
          <button onClick={() => handleAiAction('continue')} className="flex flex-col items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 p-2 active:scale-95 transition-transform font-medium">
             <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-0.5">
               <PenLine className="w-5 h-5 text-blue-500" />
             </div>
             Continue
          </button>
           <button onClick={() => handleAiAction('improve')} className="flex flex-col items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 p-2 active:scale-95 transition-transform font-medium">
             <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-0.5">
               <Wand2 className="w-5 h-5 text-purple-500" />
             </div>
             Improve
          </button>
           <button onClick={() => handleAiAction('title')} className="flex flex-col items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 p-2 active:scale-95 transition-transform font-medium">
             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-0.5">
               <RefreshCw className={`w-5 h-5 text-slate-500 ${isAiLoading ? 'animate-spin' : ''}`} />
             </div>
             Title
          </button>
      </div>
    </div>
  );
};