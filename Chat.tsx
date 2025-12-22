
import React, { useState, useRef, useEffect } from 'react';
import { Message, QuickQuiz, StudentAsset } from '../types';
import { generateAIStream, generateQuiz } from '../services/geminiService';
import { 
  Send, Plus, Save, Sparkles, Calculator, BookOpen, History,
  Bot, User, Zap, CheckCircle2, XCircle, ChevronRight, Loader2,
  Timer, BarChart, Share2, CheckSquare, Trophy, AlertCircle,
  TrendingUp, Globe, Camera, Image as ImageIcon, Users, X, 
  MessageSquarePlus, Search, Info, Pin, FileText, Monitor, Scissors
} from 'lucide-react';

interface ChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onAddAsset?: (asset: StudentAsset) => void;
}

const QuizComponent = ({ quiz, onRestart, onNewSession }: { quiz: QuickQuiz, onRestart: (topic: string) => void, onNewSession: (msg: string) => void }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    if (showResults) return;
    if (timeLeft <= 0) { setShowResults(true); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (showResults) return;
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const score = quiz.questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correctIndex ? 1 : 0), 0);
  const accuracy = ((score / quiz.questions.length) * 100).toFixed(0);
  const allAnswered = Object.keys(answers).length === quiz.questions.length;

  if (showResults) {
    return (
      <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-2xl animate-in zoom-in duration-500">
        <div className="flex flex-col md:flex-row gap-8 items-center border-b border-slate-100 pb-8">
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-full border-8 border-blue-50 flex items-center justify-center relative overflow-hidden">
               <div className="text-center">
                <p className="text-3xl font-black text-slate-800">{accuracy}%</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Accuracy</p>
              </div>
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={351.8} strokeDashoffset={351.8 - (351.8 * (parseInt(accuracy) || 0)) / 100} className="text-blue-600" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 p-1.5 rounded-lg shadow-lg"><Trophy size={16} className="text-yellow-900" /></div>
          </div>
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h3 className="text-xl font-black text-slate-800">Exam Audit Result</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl"><p className="text-[8px] font-black text-slate-400 uppercase">Score</p><p className="text-lg font-black text-slate-800">{score}/{quiz.questions.length}</p></div>
              <div className="bg-slate-50 p-3 rounded-2xl"><p className="text-[8px] font-black text-slate-400 uppercase">Merit</p><p className="text-lg font-black text-blue-600">Pro</p></div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
              <h4 className="text-base font-bold text-slate-800 leading-tight">{idx + 1}. {q.question}</h4>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className={`p-3 rounded-xl text-xs font-bold border-2 ${oIdx === q.correctIndex ? 'bg-green-100 border-green-200 text-green-800' : answers[idx] === oIdx ? 'bg-red-100 border-red-200 text-red-800' : 'bg-white border-slate-50 opacity-60'}`}>
                    {String.fromCharCode(65 + oIdx)}. {opt}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic bg-blue-50 p-3 rounded-xl border border-blue-100">AI Logic: {q.explanation}</p>
            </div>
          ))}
        </div>
        <button onClick={() => onRestart(quiz.topic)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">Restart New Paper</button>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center space-x-1.5 shadow-sm">
            <Zap size={10} fill="white" /><span>Dynamic Mode</span>
          </div>
          <h3 className="text-lg font-black text-slate-800 truncate max-w-[200px]">{quiz.topic}</h3>
        </div>
        <div className="flex items-center space-x-2 text-slate-600 font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
          <Timer size={14} /><span className="text-sm tabular-nums">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
        </div>
      </div>
      <div className="space-y-10">
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="text-lg font-black text-slate-800 leading-tight">{idx + 1}. {q.question}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {q.options.map((option, optIdx) => (
                <button 
                  key={optIdx} 
                  onClick={() => handleAnswer(idx, optIdx)} 
                  className={`w-full text-left p-4 rounded-2xl border-2 font-bold transition-all flex items-center space-x-3 ${answers[idx] === optIdx ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg shadow-blue-50' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] border-2 ${answers[idx] === optIdx ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm">{option}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={() => setShowResults(true)} 
        disabled={!allAnswered}
        className={`w-full py-5 rounded-3xl font-black text-base shadow-xl transition-all ${allAnswered ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}`}
      >
        Submit Full Paper
      </button>
    </div>
  );
};

const Chat: React.FC<ChatProps> = ({ messages, setMessages, onAddAsset }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ data: string, mimeType: string, raw?: string, name?: string } | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const personas = [
    { name: "Math Guru", icon: <Calculator size={14} />, color: "bg-blue-100 text-blue-600" },
    { name: "Bengali Scholar", icon: <BookOpen size={14} />, color: "bg-orange-100 text-orange-600" },
    { name: "Job Scout", icon: <Search size={14} />, color: "bg-green-100 text-green-600" },
    { name: "Doubt Solver", icon: <Bot size={14} />, color: "bg-purple-100 text-purple-600" }
  ];

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isTyping]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const fullBase64 = ev.target?.result as string;
      setUploadedFile({ 
        data: fullBase64.split(',')[1], 
        mimeType: file.type,
        raw: fullBase64,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleScreenCapture = async () => {
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "browser" },
      });
      const video = document.createElement("video");
      video.srcObject = captureStream;
      video.play();
      
      // Give it a moment to render
      await new Promise((r) => setTimeout(r, 500));
      
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL("image/jpeg");
      setUploadedFile({
        data: dataUrl.split(',')[1],
        mimeType: "image/jpeg",
        raw: dataUrl,
        name: "Screen Snippet - " + new Date().toLocaleTimeString()
      });
      
      captureStream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error("Screen capture failed:", err);
    }
  };

  const handlePinToLocker = (file: typeof uploadedFile, analysis?: string) => {
    if (!file || !onAddAsset) return;
    const asset: StudentAsset = {
      id: Date.now().toString(),
      title: file.name || "Chat Upload",
      type: file.mimeType.includes('pdf') ? 'PDF' : 'IMAGE',
      data: file.raw || "",
      mimeType: file.mimeType,
      date: new Date().toLocaleDateString(),
      subject: collaborators[0] || 'Uncategorized',
      aiAnalysis: analysis || "Archived from conversation."
    };
    onAddAsset(asset);
    alert("Pinned to Study Locker! 🔒");
  };

  const handleSend = async (text: string = input) => {
    const msgText = text || input;
    if (!msgText.trim() && !uploadedFile) return;

    const currentFile = uploadedFile;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText || (currentFile?.mimeType.includes('pdf') ? "Analyzing PDF..." : "Analyzing Image..."),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedFile(null);

    setIsTyping(true);
    const assistantId = (Date.now() + 1).toString();
    
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }]);

    try {
      // Note: Gemini text extraction for PDF can be handled via multimodal inputs if converted to images
      // For this simplified logic, we primarily send images to the model. 
      // PDFs are archived but might need a text-extract fallback or wait for Native PDF support.
      const stream = await generateAIStream(msgText, messages.map(m => ({ role: m.role, content: m.content })), {
        useSearch,
        image: currentFile && !currentFile.mimeType.includes('pdf') ? { data: currentFile.data, mimeType: currentFile.mimeType } : undefined,
        persona: collaborators.length > 0 ? collaborators.join(", ") : undefined
      });

      let fullContent = "";
      for await (const chunk of stream) {
        fullContent += chunk.text || "";
        setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: fullContent } : m));
      }

      // Check for Quiz command at end of stream
      if (fullContent.toLowerCase().includes("test") || fullContent.toLowerCase().includes("exam")) {
        handleTriggerQuiz(msgText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTriggerQuiz = async (topic: string) => {
    setIsGeneratingQuiz(true);
    const quizData = await generateQuiz(topic);
    if (quizData) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've prepared an advanced MCQ paper on **${quizData.topic}**. Ready to test your merit?`,
        timestamp: new Date(),
        quiz: quizData
      }]);
    }
    setIsGeneratingQuiz(false);
  };

  const toggleCollaborator = (name: string) => {
    setCollaborators(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-[3rem] overflow-hidden shadow-2xl border border-white relative backdrop-blur-3xl">
      {/* Dynamic Collaborative Header */}
      <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl ring-4 ring-white">
              <Sparkles size={24} className="text-blue-400" />
            </div>
            {collaborators.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                +{collaborators.length}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight">Collaborative Study Lab</h3>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {collaborators.length > 0 ? `${collaborators.join(" + ")} Active` : "Gemini 3.0 Experimental"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {personas.map(p => (
              <button 
                key={p.name}
                onClick={() => toggleCollaborator(p.name)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${collaborators.includes(p.name) ? `${p.color} shadow-sm` : 'text-slate-400 hover:text-slate-600'}`}
              >
                {p.icon}
                <span>{p.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          <button 
            onClick={() => setUseSearch(!useSearch)}
            className={`p-3 rounded-2xl transition-all border-2 ${useSearch ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-white border-slate-100 text-slate-400'}`}
            title="Toggle Web Search Grounding"
          >
            <Globe size={18} />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-10 py-12 space-y-12 pb-56 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-12 py-20">
            <div className="space-y-6 max-w-xl">
              <div className="w-28 h-28 bg-white text-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative border border-slate-50">
                <Bot size={56} className="text-blue-600" />
                <div className="absolute -top-2 -right-2 bg-blue-500 w-8 h-8 rounded-full border-4 border-white animate-pulse"></div>
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Fast, Collaborative Learning.</h1>
                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  Upload photos, <span className="text-red-500 font-bold">PDFs</span>, or <span className="text-blue-600 font-bold">Snippets</span>. Summon <span className="text-purple-600 font-bold">AI Experts</span> to solve problems instantly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
              {[
                { t: "Extract news from today's BCS circular", i: <Search />, c: "text-green-600 bg-green-50" },
                { t: "Solve this math problem (Upload File)", i: <Camera />, c: "text-blue-600 bg-blue-50" },
                { t: "Capture screen part for explanation", i: <Monitor />, c: "text-purple-600 bg-purple-50" },
                { t: "Generate study plan from my notes", i: <Zap />, c: "text-orange-600 bg-orange-50" }
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    if (item.t.includes("Upload")) fileInputRef.current?.click();
                    else if (item.t.includes("Capture")) handleScreenCapture();
                    else handleSend(item.t);
                  }} 
                  className="group flex items-center space-x-4 p-6 bg-white border-2 border-slate-50 rounded-[2rem] hover:border-blue-500 hover:shadow-2xl transition-all text-left"
                >
                  <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${item.c}`}>{item.i}</div>
                  <span className="font-black text-slate-700 text-sm group-hover:text-blue-700">{item.t}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`flex max-w-[95%] space-x-5 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.role === 'user' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-blue-600 border-blue-50'}`}>
                  {msg.role === 'user' ? <User size={24} /> : <Sparkles size={24} />}
                </div>
                
                <div className="space-y-4 flex-1 min-w-0">
                  <div className={`p-8 rounded-[2.75rem] shadow-sm relative overflow-hidden group ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none border border-slate-800' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                    {msg.content === '' && msg.role === 'assistant' ? (
                       <div className="flex space-x-2 py-4">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                      </div>
                    ) : (
                      <div className="prose prose-slate max-w-none">
                        {msg.content.split('\n').map((line, i) => (
                          <p key={i} className={`mb-4 last:mb-0 leading-relaxed text-lg ${msg.role === 'user' ? 'font-bold' : 'font-medium'}`}>
                            {line}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.quiz && (
                    <div className="mt-8 animate-in zoom-in duration-500">
                      <QuizComponent quiz={msg.quiz} onRestart={handleTriggerQuiz} onNewSession={handleSend} />
                    </div>
                  )}

                  <p className={`text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 flex items-center gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Futuristic Floating Input Bar */}
      <div className="absolute bottom-8 left-0 right-0 px-10 pointer-events-none">
        <div className="max-w-5xl mx-auto pointer-events-auto">
          {uploadedFile && (
            <div className="mb-4 flex items-center bg-blue-600 text-white p-3 rounded-2xl w-fit animate-in slide-in-from-bottom-4 shadow-xl border border-blue-400">
              {uploadedFile.mimeType.includes('pdf') ? <FileText size={18} className="mr-2" /> : <ImageIcon size={18} className="mr-2" />}
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest">{uploadedFile.name || "Upload"}</span>
                <span className="text-[8px] opacity-70 font-bold">{uploadedFile.mimeType}</span>
              </div>
              <div className="flex items-center ml-4 space-x-2">
                <button 
                  onClick={() => handlePinToLocker(uploadedFile)}
                  className="bg-white/20 hover:bg-white/30 p-1.5 rounded-lg transition-colors flex items-center space-x-1"
                  title="Pin to Study Locker"
                >
                  <Pin size={12} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Pin</span>
                </button>
                <button onClick={() => setUploadedFile(null)} className="p-1.5 hover:bg-red-500 rounded-lg transition-colors"><X size={14} /></button>
              </div>
            </div>
          )}
          
          <div className="bg-white/90 backdrop-blur-3xl border-2 border-slate-100 p-2 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center group transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/5">
            <div className="flex items-center space-x-1 pl-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-blue-600 transition-colors rounded-xl hover:bg-blue-50"
                title="Upload Photo or PDF"
              >
                <Camera size={22} />
              </button>
              <button 
                onClick={handleScreenCapture}
                className="p-3 text-slate-400 hover:text-purple-600 transition-colors rounded-xl hover:bg-purple-50"
                title="Capture Screen Part"
              >
                <Monitor size={22} />
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*,application/pdf" 
            />
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={useSearch ? "Searching the web for live news..." : "Snap a problem, snip the screen, or upload a PDF..."} 
              className="flex-1 px-4 py-4 bg-transparent outline-none font-bold text-lg text-slate-800 placeholder:text-slate-300"
            />
            <div className="flex items-center space-x-2 pr-2">
               <button 
                onClick={() => setCollaborators([])}
                className={`p-4 text-slate-400 hover:text-purple-600 transition-all ${collaborators.length > 0 ? 'text-purple-600' : ''}`}
                title="Collaborative Experts"
              >
                <Users size={24} />
              </button>
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() && !uploadedFile}
                className="w-14 h-14 bg-slate-900 text-white rounded-[1.75rem] flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-20 shadow-xl shadow-slate-200"
              >
                <Send size={24} />
              </button>
            </div>
          </div>
          <p className="text-center mt-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Powered by Gemini 3.0 • Multi-modal Study persistence Edition</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
