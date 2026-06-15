import { useState, useRef, useEffect, useCallback } from "react";
import { sendChat } from "@/lib/api";
import type { CollectionEntry } from "@/lib/types";
import { coinTitle } from "@/lib/collection";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Props {
  collection: CollectionEntry[];
}

const SUGGESTIONS = [
  "Roma sikkelerinde hangi imparatorlar en nadirdir?",
  "Sikkemin derecesini nasıl yükseltebilirim?",
  "Antik sikke bakımı nasıl yapılır?",
  "Müzayedede sikke alırken nelere dikkat etmeliyim?",
  "Bizans altınları neden bu kadar değerlidir?",
  "Sikke temizliği yapmalı mıyım?",
];

export default function ChatPage({ collection }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const coinContext = collection
    .filter(e => e.inCollection)
    .slice(0, 5)
    .map(e => coinTitle(e.analysis.identification))
    .join(", ");

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed, id: `u${Date.now()}` };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChat(
        next.map(m => ({ role: m.role, content: m.content })),
        coinContext || undefined,
      );
      setMessages(prev => [...prev, { role: "assistant", content: reply, id: `a${Date.now()}` }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Bağlantı hatası. İnternet bağlantınızı kontrol edin.",
        id: `a${Date.now()}`,
      }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, coinContext]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {isEmpty && (
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="w-16 h-16 rounded-full border-2 border-[#C9A84C] flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0D0B07]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-cinzel text-lg text-[#E8DDB5] tracking-wider">Numisma Danışmanı</h3>
              <p className="font-cormorant text-[#8A7A55] mt-1 leading-relaxed">
                Antik sikkeler, değerleme, müzayede ve koleksiyonculuk hakkında her soruyu yanıtlarım.
              </p>
            </div>
            <div className="w-full space-y-2 mt-2">
              <p className="font-mono text-xs text-[#8A7A55] tracking-widest text-center">ÖRNEK SORULAR</p>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="w-full text-left px-4 py-3 bg-[#1E1A10] border border-[#3A3020] rounded-xl font-cormorant text-[#E8DDB5] hover:border-[#C9A84C] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0 mb-1">
                <svg className="w-3 h-3 text-[#0D0B07]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                </svg>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-xl font-cormorant text-base leading-relaxed ${
                m.role === "user"
                  ? "bg-[#C9A84C] text-[#0D0B07]"
                  : "bg-[#1E1A10] border border-[#3A3020] text-[#E8DDB5]"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0 mb-1">
              <svg className="w-3 h-3 text-[#0D0B07]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
            </div>
            <div className="bg-[#1E1A10] border border-[#3A3020] rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#3A3020] bg-[#16130C] px-4 py-3">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Soru sorun…"
            rows={1}
            maxLength={500}
            className="flex-1 bg-[#1E1A10] border border-[#3A3020] rounded-xl px-4 py-3 text-[#E8DDB5] font-cormorant text-base focus:border-[#C9A84C] outline-none resize-none max-h-32 placeholder-[#6A5A40]"
            style={{ overflowY: "auto" }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40"
            style={{ backgroundColor: input.trim() && !loading ? "#C9A84C" : "#3A3020" }}
          >
            <svg className="w-4 h-4" style={{ color: input.trim() && !loading ? "#0D0B07" : "#8A7A55" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
