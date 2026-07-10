import React, { useState, useEffect, useRef } from 'react';
import type { UserMemory, Message } from '../../types';
import { askStadiumAI } from '../../services/gemini';
import { Send, Sparkles, BrainCircuit, RotateCcw, HelpCircle } from 'lucide-react';

interface CompanionChatProps {
  memory: UserMemory;
  onUpdateMemory: (updated: Partial<UserMemory>) => void;
  userId: string;
}

export const CompanionChat: React.FC<CompanionChatProps> = ({
  memory,
  onUpdateMemory,
  userId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on mount/userId change
  useEffect(() => {
    const saved = localStorage.getItem(`stadiumgpt_chat_history_${userId}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Seed with a welcoming personalized message on first launch
      const welcomeText = memory.language === 'es' 
        ? `¡Hola! Soy tu compañero del estadio. Veo que vienes con un grupo de ${memory.groupSize} personas y prefieres accesibilidad: ${memory.accessibility}. ¿Cómo puedo ayudarte hoy en el estadio?`
        : memory.language === 'pt'
        ? `Olá! Sou o seu companheiro de estádio. Vejo que você está com um grupo de ${memory.groupSize} pessoas e prefere acessibilidade: ${memory.accessibility}. Como posso ajudar você hoje no estádio?`
        : memory.language === 'fr'
        ? `Bonjour ! Je suis votre compagnon de stade. Je vois que vous êtes avec un groupe de ${memory.groupSize} personnes et préférez l'accessibilité : ${memory.accessibility}. Comment puis-je vous aider aujourd'hui ?`
        : memory.language === 'ar'
        ? `مرحباً! أنا رفيقك في الملعب. أرى أنك قادم مع مجموعة مكونة من ${memory.groupSize} أفراد وتفضل ميزة الوصول: ${memory.accessibility}. كيف يمكنني مساعدتك اليوم؟`
        : `Hello! I'm your AI Stadium Companion. I see you're attending in a group of ${memory.groupSize} and have configured accessibility for ${memory.accessibility}. How can I assist you in MetLife Stadium today?`;
      
      const seedMessage: Message = {
        id: 'welcome_' + Date.now(),
        sender: 'assistant',
        content: welcomeText,
        timestamp: Date.now(),
        reasoning: 'Initial welcome message built from structured onboarding variables.'
      };
      
      setMessages([seedMessage]);
    }
  }, [userId]);

  // Handle returning users welcome recognition
  useEffect(() => {
    const savedHistory = localStorage.getItem(`stadiumgpt_chat_history_${userId}`);
    if (savedHistory) {
      const parsed: Message[] = JSON.parse(savedHistory);
      // Check if we already appended the return welcome message
      const hasWelcomeBack = parsed.some(m => m.id.startsWith('welcome_back_'));
      if (parsed.length > 2 && !hasWelcomeBack) {
        // Build returning user greeting
        const welcomeBackText = memory.language === 'es'
          ? "¡Bienvenido de nuevo al Mundial! Qué bueno verte otra vez. ¿Sigues asistiendo con tu grupo de configuración anterior o deseas realizar algún cambio?"
          : memory.language === 'pt'
          ? "Bem-vindo de volta à Copa do Mundo! Que bom ver você novamente. Você ainda está vindo com o seu grupo anterior ou quer fazer alguma alteração?"
          : memory.language === 'fr'
          ? "Bon retour au Mondial ! Ravi de vous revoir. Êtes-vous toujours avec le même groupe ou souhaitez-vous faire des changements ?"
          : memory.language === 'ar'
          ? "مرحباً بك مجدداً في كأس العالم! يسعدنا لقاؤك مرة أخرى. هل ما زلت تحضر مع مجموعتك السابقة، أم ترغب في إجراء أي تعديلات؟"
          : "Welcome back to the World Cup! Great to see you again. Last time you mentioned visiting the stadium with your group. Are you attending with the same details today, or should we adjust your preferences?";

        const welcomeBackMessage: Message = {
          id: 'welcome_back_' + Date.now(),
          sender: 'assistant',
          content: welcomeBackText,
          timestamp: Date.now(),
          reasoning: 'User is flagged as a returning fan based on pre-existing chat session storage.'
        };
        const updated = [...parsed, welcomeBackMessage];
        setMessages(updated);
        localStorage.setItem(`stadiumgpt_chat_history_${userId}`, JSON.stringify(updated));
      }
    }
  }, [userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Save user message to storage immediately
    localStorage.setItem(`stadiumgpt_chat_history_${userId}`, JSON.stringify(newMessages));

    try {
      const response = await askStadiumAI(textToSend, memory, newMessages.slice(-5)); // Pass recent 5 messages context
      const assistantMessage: Message = {
        id: 'msg_' + (Date.now() + 1),
        sender: 'assistant',
        content: response.text,
        timestamp: Date.now(),
        reasoning: response.reasoning,
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      localStorage.setItem(`stadiumgpt_chat_history_${userId}`, JSON.stringify(finalMessages));

      // Proactively learn preferences from chat keywords
      learnPreferencesFromInput(textToSend);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Learning mechanism from chat context
  const learnPreferencesFromInput = (text: string) => {
    const lower = text.toLowerCase();
    const words = lower.split(/\s+/);
    const updates: Partial<UserMemory> = {};
    
  // Learn dietary preference (latest mention wins)
for (let i = 0; i < words.length; i++) {
  const word = words[i];

  if (word === 'vegan' || word === 'vegetarian') {
    updates.dietary = 'vegan';
  }

  if (word === 'halal') {
    updates.dietary = 'halal';
  }

  if (
    (word === 'gluten' && words[i + 1] === 'free') ||
    word === 'gluten-free'
  ) {
    updates.dietary = 'gluten-free';
  }
}
// Learn preferred language from conversation
if (
  lower.includes('respond only in arabic') ||
  lower.includes('speak arabic') ||
  lower.includes('answer in arabic')
) {
  updates.language = 'ar';
} else if (
  lower.includes('respond only in english') ||
  lower.includes('speak english') ||
  lower.includes('answer in english')
) {
  updates.language = 'en';
} else if (
  lower.includes('respond only in spanish') ||
  lower.includes('speak spanish') ||
  lower.includes('answer in spanish')
) {
  updates.language = 'es';
} else if (
  lower.includes('respond only in french') ||
  lower.includes('speak french') ||
  lower.includes('answer in french')
) {
  updates.language = 'fr';
} else if (
  lower.includes('respond only in portuguese') ||
  lower.includes('speak portuguese') ||
  lower.includes('answer in portuguese')
) {
  updates.language = 'pt';
}
// Learn group size from conversation
if (
  lower.includes("i'm here alone") ||
  lower.includes("i am here alone") ||
  lower.includes("i'm alone") ||
  lower.includes("i am alone") ||
  lower.includes("just me")
) {
  updates.groupSize = 1;
} else if (
  lower.includes("we are two") ||
  lower.includes("we're two") ||
  lower.includes("2 people") ||
  lower.includes("two people")
) {
  updates.groupSize = 2;
} else if (
  lower.includes("three people") ||
  lower.includes("3 people")
) {
  updates.groupSize = 3;
} else if (
  lower.includes("four people") ||
  lower.includes("4 people")
) {
  updates.groupSize = 4;
} else if (
  lower.includes("five people") ||
  lower.includes("5 people")
) {
  updates.groupSize = 5;
}
   // Learn accessibility (latest mention wins)
for (let i = 0; i < words.length; i++) {
  const word = words[i];

  if (word === 'wheelchair') {
    updates.accessibility = 'wheelchair';
    updates.navigationStyle = 'stair-free';
  }

  if (
    word === 'stroller' ||
    word === 'strollers'
  ) {
    updates.accessibility = 'stroller';
    updates.navigationStyle = 'stair-free';
  }

  if (
    word === 'sensory' ||
    (word === 'quiet' && words[i + 1] === 'route')
  ) {
    updates.accessibility = 'sensory';
    updates.navigationStyle = 'low-crowd';
  }
}
// Learn elderly companion preference
if (
  lower.includes("grandfather") ||
  lower.includes("grandmother") ||
  lower.includes("elderly") ||
  lower.includes("senior citizen")
) {
  updates.navigationStyle = "stair-free";
}
// Learn first-time visitor status
if (
  lower.includes("first world cup") ||
  lower.includes("first visit") ||
  lower.includes("first time here")
) {
  localStorage.setItem(
    `stadiumgpt_first_visit_${userId}`,
    "true"
  );
}
// Learn presence of children
if (
  lower.includes("my son") ||
  lower.includes("my daughter") ||
  lower.includes("my kids") ||
  lower.includes("my child")
) {
  updates.navigationStyle = "low-crowd";
}
    if (Object.keys(updates).length > 0) {
      onUpdateMemory(updates);
    }
  };

  const handleResetChat = () => {
    if (window.confirm('Reset chat history? This will clear active memory parameters learned from chat.')) {
      localStorage.removeItem(`stadiumgpt_chat_history_${userId}`);
      const resetMsg: Message = {
        id: 'welcome_' + Date.now(),
        sender: 'assistant',
        content: `Conversation history has been reset. How can I assist you today?`,
        timestamp: Date.now(),
        reasoning: 'Chat history reset.'
      };
    
      setMessages([resetMsg]);
    }
  };

  // Quick prompt chips
  const quickPrompts = [
    { label: '🍔 Vegan/Halal Food', text: 'Where can I get some vegan or halal food in the stadium?' },
    { label: '♿ Wheelchair Restrooms', text: 'Where is the nearest wheelchair accessible restroom?' },
    { label: '🚪 Go to Gate A', text: 'What is the best route to Gate A from Section 100?' },
    { label: '🎒 Report Lost Bag', text: 'I lost my blue backpack. Where do I go?' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-170px)] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto">
      
      {/* Header toolbar */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-fifa-gold" />
          <div>
            <h2 className="text-xs font-extrabold uppercase text-white tracking-wider">AI Stadium Assistant</h2>
            <p className="text-[9px] text-slate-400 font-medium">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <button
          onClick={handleResetChat}
          className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          title="Reset conversation history"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-fifa-green text-white rounded-tr-none'
                  : msg.sender === 'system'
                  ? 'bg-slate-800 border border-slate-700 text-slate-300'
                  : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none'
              }`}
            >
              {msg.content}
            </div>

            {/* AI Reasoning Section */}
            {msg.sender === 'assistant' && msg.reasoning && (
              <details className="mt-1.5 max-w-[85%] group border border-slate-800 rounded-lg overflow-hidden bg-slate-950/40">
                <summary className="cursor-pointer text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-slate-200 px-3 py-1 flex items-center gap-1 list-none outline-none select-none">
                  <BrainCircuit className="w-3.5 h-3.5 text-fifa-gold group-open:rotate-90 transition-transform" />
                  <span>Personalized Reasoning</span>
                </summary>
                <div className="p-3 border-t border-slate-800 text-xs text-slate-400 bg-slate-950/80 leading-relaxed font-mono">
                  {msg.reasoning}
                </div>
              </details>
            )}

            {/* Message Time */}
            <span className="text-[9px] text-slate-500 mt-1 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-1">
            <Sparkles className="w-4 h-4 animate-spin text-fifa-gold" />
            <span>AI Companion is reasoning...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      {messages.length < 3 && (
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800">
          <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Suggestion Chips
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.text)}
                className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-full text-xs font-bold text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fifa-green"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about gates, food, restrooms, exits..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fifa-green"
          aria-label="Ask AI Assistant"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-fifa-green hover:bg-fifa-green-light disabled:opacity-50 text-white p-2.5 rounded-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-fifa-green"
          aria-label="Send Message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
