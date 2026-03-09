import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useConversations(userId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`conversations:${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        queryClient.invalidateQueries({ queryKey: ['conversations', userId] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *, advisor_profiles!advisor_id(id, profiles!id(full_name, avatar_url)),
          messages(id, content, created_at, sender_id, is_read, message_type, file_name)
        `)
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        queryClient.setQueryData(['messages', conversationId], (old: any[]) =>
          old ? [...old, payload.new] : [payload.new]
        );
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles!sender_id(full_name, avatar_url)')
        .eq('conversation_id', conversationId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId!)
        .eq('is_read', false);
      return data;
    },
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      senderId,
      file,
    }: {
      conversationId: string;
      content?: string;
      senderId: string;
      file?: File;
    }) => {
      let fileUrl = null;
      let fileName = null;
      if (file) {
        const { data } = await supabase.storage
          .from('documents')
          .upload(`messages/${conversationId}/${Date.now()}_${file.name}`, file);
        fileUrl = data?.path;
        fileName = file.name;
      }
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content: content || null,
          message_type: file ? 'document' : 'text',
          file_url: fileUrl,
          file_name: fileName,
        })
        .select()
        .single();
      if (error) throw error;
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
