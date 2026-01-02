import { supabase } from './supabaseClient';
import { Note } from '../types';

export const noteService = {
  async getNotes(): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(mapFromDb);
  },

  async createNote(userId: string, note: Partial<Note>): Promise<Note> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User must be logged in to create notes");

    const now = Date.now();
    const { data, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: note.title || '',
        content: note.content || '',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapFromDb(data);
  },

  async updateNote(id: string, updates: Partial<Note>): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .update({
        title: updates.title,
        content: updates.content,
        updated_at: Date.now(),
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};

const mapFromDb = (dbNote: any): Note => ({
  id: dbNote.id,
  userId: dbNote.user_id,
  title: dbNote.title || '',
  content: dbNote.content || '',
  // Handle both possible DB types just in case: bigint (number) or timestamptz (string)
  createdAt: typeof dbNote.created_at === 'string' ? new Date(dbNote.created_at).getTime() : Number(dbNote.created_at),
  updatedAt: typeof dbNote.updated_at === 'string' ? new Date(dbNote.updated_at).getTime() : Number(dbNote.updated_at),
});