import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Search } from 'lucide-react';
import { DashboardShell } from '../components/layout/DashboardShell';
import { useConversations, useMessages, useSendMessage } from '../hooks/useMessages';
import { useUserStore } from '../store/useUserStore';
import { cn } from '../lib/utils';

export default function MessagesPage() {
  const { user } = useUserStore();
  const { data: conversations, isLoading: convsLoading } = useConversations(user?.id || '');
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: messages } = useMessages(activeConvId);
  const sendMessage = useSendMessage();

  // Auto-select first conversation
  useEffect(() => {
    if (!activeConvId && conversations?.length) {
      setActiveConvId(conversations[0].id);
    }
  }, [conversations, activeConvId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  const handleSend = () => {
    if (!input.trim() || !activeConvId || !user?.id) return;
    sendMessage.mutate({
      conversationId: activeConvId,
      content: input.trim(),
      senderId: user.id,
    });
    setInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConvId || !user?.id) return;
    sendMessage.mutate({
      conversationId: activeConvId,
      senderId: user.id,
      file,
    });
    e.target.value = '';
  };

  const getAdvisorName = (conv: any) => conv.advisor_profiles?.profiles?.full_name || 'Advisor';
  const getAdvisorInitials = (conv: any) => {
    const name = getAdvisorName(conv);
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  };

  const getLastMessage = (conv: any) => {
    const msgs = conv.messages || [];
    if (msgs.length === 0) return '';
    const sorted = [...msgs].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return sorted[0]?.content || (sorted[0]?.file_name ? `Sent a file: ${sorted[0].file_name}` : '');
  };

  const getUnreadCount = (conv: any) => {
    return (conv.messages || []).filter((m: any) => !m.is_read && m.sender_id !== user?.id).length;
  };

  const filteredConvs = (conversations || []).filter((c: any) =>
    getAdvisorName(c).toLowerCase().includes(search.toLowerCase())
  );

  const activeConv = conversations?.find((c: any) => c.id === activeConvId);

  return (
    <DashboardShell>
      <div className="max-w-[960px]">
        <h1 className="font-display text-[32px] text-dark-text mb-6">Messages</h1>

        <div className="flex rounded-[20px] bg-dark-surface border border-dark-border overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          {/* Conversation List */}
          <div className="w-[300px] border-r border-dark-border flex-shrink-0 flex flex-col">
            <div className="p-3 border-b border-dark-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dark-muted" />
                <input
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-[8px] bg-dark-surface-2 pl-9 pr-3 py-2 font-body text-sm text-dark-text placeholder:text-dark-muted-2 focus:outline-none border border-dark-border focus:border-teal/50"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {convsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal border-t-transparent" />
                </div>
              ) : filteredConvs.length === 0 ? (
                <p className="p-4 text-center font-body text-xs text-dark-muted">No conversations yet. Book a discovery call to start messaging your advisor.</p>
              ) : (
                filteredConvs.map((conv: any) => {
                  const unread = getUnreadCount(conv);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors border-l-[3px]',
                        activeConvId === conv.id ? 'bg-dark-surface-2 border-l-teal' : 'border-l-transparent hover:bg-dark-surface-2/50'
                      )}
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal/20 font-body text-sm font-semibold text-teal">
                        {getAdvisorInitials(conv)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-body text-sm font-medium text-white truncate">{getAdvisorName(conv)}</p>
                          <span className="font-body text-[11px] text-dark-muted flex-shrink-0">
                            {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                          </span>
                        </div>
                        <p className="font-body text-xs text-dark-muted truncate mt-0.5">{getLastMessage(conv)}</p>
                      </div>
                      {unread > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal font-body text-[10px] font-semibold text-dark-base flex-shrink-0">
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {activeConv ? (
              <>
                <div className="flex items-center gap-3 px-5 py-3 border-b border-dark-border">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/20 font-body text-sm font-semibold text-teal">
                    {getAdvisorInitials(activeConv)}
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-white">{getAdvisorName(activeConv)}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {(messages || []).map((msg: any) => {
                    const isUser = msg.sender_id === user?.id;
                    if (msg.message_type === 'system') {
                      return (
                        <div key={msg.id} className="flex justify-center">
                          <span className="rounded-full bg-dark-surface-2 px-3 py-1 font-body text-[11px] text-dark-muted">{msg.content}</span>
                        </div>
                      );
                    }
                    if (msg.message_type === 'document') {
                      return (
                        <div key={msg.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
                          <div className="flex items-center gap-3 rounded-[12px] bg-dark-surface-2 border border-dark-border px-4 py-3 max-w-[320px]">
                            <Paperclip className="h-4 w-4 text-dark-muted" />
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-sm text-dark-text truncate">{msg.file_name}</p>
                            </div>
                            <button className="font-body text-xs text-teal hover:underline">Download</button>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={msg.id} className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'rounded-[12px] px-4 py-2.5 max-w-[320px]',
                          isUser
                            ? 'bg-teal/10 border border-teal/20 text-dark-text'
                            : 'bg-dark-surface-2 text-dark-text'
                        )}>
                          <p className="font-body text-sm leading-relaxed">{msg.content}</p>
                          <p className="mt-1 font-body text-[10px] text-dark-muted text-right">
                            {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                <div className="flex items-center gap-2 px-4 py-3 border-t border-dark-border">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()} className="text-dark-muted hover:text-teal transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-transparent font-body text-sm text-dark-text placeholder:text-dark-muted-2 focus:outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sendMessage.isPending}
                    className={cn('flex h-9 w-9 items-center justify-center rounded-full transition-colors', input.trim() ? 'bg-teal text-dark-base' : 'bg-dark-surface-2 text-dark-muted')}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="font-body text-sm text-dark-muted">Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
