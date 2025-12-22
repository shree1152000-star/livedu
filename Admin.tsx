
import React, { useState, useEffect, useRef } from 'react';
import { Question, AdminDocument } from '../types';
import { extractQuestionsFromImage } from '../services/geminiService';
import { 
  Plus, 
  Trash2, 
  FileText, 
  HelpCircle, 
  Save, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Database,
  CloudUpload,
  ShieldCheck,
  Users,
  X,
  Sparkles,
  Loader2,
  FileImage,
  ArrowRight
} from 'lucide-react';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'documents' | 'ai_extract'>('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [documents, setDocuments] = useState<AdminDocument[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<Question[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form States
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    subject: 'Math',
    text: '',
    options: [
      { id: 'A', text: '' },
      { id: 'B', text: '' },
      { id: 'C', text: '' },
      { id: 'D', text: '' }
    ],
    correctAnswer: 'A',
    explanation: ''
  });

  const [newDoc, setNewDoc] = useState<Partial<AdminDocument>>({
    title: '',
    subject: 'Math',
    type: 'PDF'
  });

  useEffect(() => {
    try {
      const savedQuestions = localStorage.getItem('admin_questions');
      const savedDocs = localStorage.getItem('admin_documents');
      if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
      if (savedDocs) setDocuments(JSON.parse(savedDocs));
    } catch (e) {
      console.error("Failed to load data from storage:", e);
    }
  }, []);

  const saveToStorage = (type: 'q' | 'd', data: any[]) => {
    localStorage.setItem(type === 'q' ? 'admin_questions' : 'admin_documents', JSON.stringify(data));
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const fullQuestion: Question = {
      ...newQuestion as Question,
      id: Date.now().toString()
    };
    const updated = [...questions, fullQuestion];
    setQuestions(updated);
    saveToStorage('q', updated);
    setShowAddForm(false);
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setNewQuestion({
      subject: 'Math',
      text: '',
      options: [{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }, { id: 'D', text: '' }],
      correctAnswer: 'A',
      explanation: ''
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        const extracted = await extractQuestionsFromImage(base64, file.type);
        setExtractedPreview(extracted);
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsProcessing(false);
    }
  };

  const saveExtractedQuestions = () => {
    const questionsWithIds = extractedPreview.map(q => ({
      ...q,
      id: Math.random().toString(36).substr(2, 9)
    }));
    const updated = [...questions, ...questionsWithIds];
    setQuestions(updated);
    saveToStorage('q', updated);
    setExtractedPreview([]);
    setActiveTab('questions');
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const doc: AdminDocument = {
      ...newDoc as AdminDocument,
      id: Date.now().toString(),
      topic: newDoc.title || 'General',
      uploadDate: new Date().toLocaleDateString(),
      fileSize: (Math.random() * 5 + 1).toFixed(1) + ' MB'
    };
    const updated = [...documents, doc];
    setDocuments(updated);
    saveToStorage('d', updated);
    setShowAddForm(false);
    setNewDoc({ title: '', subject: 'Math', type: 'PDF' });
  };

  const deleteItem = (type: 'q' | 'd', id: string) => {
    if (type === 'q') {
      const updated = questions.filter(q => q.id !== id);
      setQuestions(updated);
      saveToStorage('q', updated);
    } else {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      saveToStorage('d', updated);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl shadow-slate-200">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Database size={32} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-black tracking-tight">Team Workspace</h1>
              <div className="px-2 py-0.5 bg-green-500 rounded text-[8px] font-black uppercase tracking-widest">Live</div>
            </div>
            <p className="text-slate-400 font-medium">Control center for EduPro resources and content delivery</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setActiveTab('ai_extract')}
            className={`flex items-center space-x-2 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
              activeTab === 'ai_extract' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles size={16} />
            <span>AI Batch Extract</span>
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center space-x-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10"
          >
            <Plus size={18} />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('questions')}
          className={`px-8 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all border-b-2 flex items-center space-x-2 ${activeTab === 'questions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <HelpCircle size={14} />
          <span>Question Bank ({questions.length})</span>
        </button>
        <button 
          onClick={() => setActiveTab('documents')}
          className={`px-8 py-6 font-black text-xs uppercase tracking-[0.2em] transition-all border-b-2 flex items-center space-x-2 ${activeTab === 'documents' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          <FileText size={14} />
          <span>Documents ({documents.length})</span>
        </button>
      </div>

      {activeTab === 'ai_extract' && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-12 text-center space-y-6">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
              <FileImage size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Batch Question Processor</h3>
              <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                Upload images of exam papers or screenshots (like BCS questions). Gemini AI will extract text, detect subjects, and identify correct answers automatically.
              </p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 mx-auto shadow-2xl shadow-slate-200"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Analyzing Image...</span>
                </>
              ) : (
                <>
                  <CloudUpload size={20} />
                  <span>Choose Image to Process</span>
                </>
              )}
            </button>
          </div>

          {extractedPreview.length > 0 && (
            <div className="bg-white rounded-[2.5rem] border border-blue-100 shadow-2xl shadow-blue-100/50 overflow-hidden animate-in zoom-in duration-300">
              <div className="bg-blue-600 p-8 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black flex items-center gap-3">
                    <Sparkles />
                    Extracted Questions Preview ({extractedPreview.length})
                  </h3>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Please review before saving to Global Pool</p>
                </div>
                <button 
                  onClick={saveExtractedQuestions}
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg"
                >
                  Confirm & Save All
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {extractedPreview.map((q, i) => (
                  <div key={i} className="p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{q.subject}</span>
                        <h4 className="text-lg font-bold text-slate-800">{q.text}</h4>
                      </div>
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-black">
                        {q.correctAnswer}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {q.options.map(opt => (
                        <div key={opt.id} className={`p-4 rounded-xl border text-sm font-medium ${opt.id === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                          {opt.id}. {opt.text}
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-xs font-medium text-slate-500 leading-relaxed italic">
                      <span className="font-black text-slate-400 uppercase tracking-widest mr-2">Reason:</span>
                      {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                  {activeTab === 'questions' ? 'New MCQ Entry' : 'Upload Resource'}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manual Content Distribution</p>
              </div>
              <button onClick={() => setShowAddForm(false)} className="text-slate-300 hover:text-slate-600 p-2 transition-colors">
                <X size={28} />
              </button>
            </div>

            {activeTab === 'questions' ? (
              <form onSubmit={handleAddQuestion} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subject Category</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                      value={newQuestion.subject}
                      onChange={e => setNewQuestion({...newQuestion, subject: e.target.value})}
                    >
                      <option>Math</option>
                      <option>Physics</option>
                      <option>English</option>
                      <option>History</option>
                      <option>Bengali</option>
                      <option>General Knowledge</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Key</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                      value={newQuestion.correctAnswer}
                      onChange={e => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question Definition</label>
                  <textarea 
                    required
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] font-medium text-lg leading-relaxed"
                    placeholder="Enter the MCQ question clearly..."
                    value={newQuestion.text}
                    onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['A', 'B', 'C', 'D'].map((opt, i) => (
                    <div key={opt} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Option {opt}</label>
                      <input 
                        required
                        type="text"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                        placeholder={`Option ${opt} text`}
                        value={newQuestion.options?.[i].text}
                        onChange={e => {
                          const opts = [...(newQuestion.options || [])];
                          opts[i].text = e.target.value;
                          setNewQuestion({...newQuestion, options: opts});
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI & Teacher Explanation</label>
                  <textarea 
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    placeholder="Detailed breakdown of why the answer is correct..."
                    value={newQuestion.explanation}
                    onChange={e => setNewQuestion({...newQuestion, explanation: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100">
                  Deploy to Question Bank
                </button>
              </form>
            ) : (
              <form onSubmit={handleAddDoc} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Title</label>
                  <input 
                    required
                    type="text"
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                    placeholder="e.g. BCS 45th Preliminary Digest"
                    value={newDoc.title}
                    onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={newDoc.subject}
                      onChange={e => setNewDoc({...newDoc, subject: e.target.value})}
                    >
                      <option>Math</option>
                      <option>Physics</option>
                      <option>English</option>
                      <option>General Science</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">File Format</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                      value={newDoc.type}
                      onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                    >
                      <option>PDF</option>
                      <option>DOC</option>
                      <option>IMG</option>
                    </select>
                  </div>
                </div>
                
                <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 text-center space-y-4 hover:border-blue-400 transition-all cursor-pointer bg-slate-50/50 group">
                   <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                     <CloudUpload size={40} />
                   </div>
                   <div>
                     <p className="font-black text-slate-800 text-lg">Distribute New Asset</p>
                     <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mt-2">Maximum File size 25MB (PDF/DOC)</p>
                   </div>
                </div>

                <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200">
                  Global Release
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {activeTab !== 'ai_extract' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/40 overflow-hidden animate-in fade-in duration-500">
          {activeTab === 'questions' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference & Detail</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tag</th>
                    <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Key</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-10 py-32 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <Database size={32} />
                          </div>
                          <p className="text-slate-400 font-bold">Workspace is empty. Initiate content generation.</p>
                        </div>
                      </td>
                    </tr>
                  ) : questions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6 max-w-md">
                        <p className="font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{q.text}</p>
                        <p className="text-[10px] text-slate-300 uppercase font-black tracking-tighter">REF: {q.id}</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                          {q.subject}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center mx-auto text-xs font-black">
                          {q.correctAnswer}
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => deleteItem('q', q.id)}
                          className="p-3 text-red-300 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Identity</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Domain</th>
                    <th className="px-10 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Properties</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-10 py-32 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <CloudUpload size={32} />
                          </div>
                          <p className="text-slate-400 font-bold">No assets in repository. Start global distribution.</p>
                        </div>
                      </td>
                    </tr>
                  ) : documents.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-10 py-6 flex items-center space-x-5">
                        <div className={`p-4 rounded-2xl shadow-sm ${d.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-lg leading-tight">{d.title}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Released {d.uploadDate}</p>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-4 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-100">
                          {d.subject}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center font-black text-slate-400 text-xs">
                        {d.type} <span className="mx-1 opacity-20">|</span> {d.fileSize}
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => deleteItem('d', d.id)}
                          className="p-3 text-red-300 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2.5rem] flex items-center space-x-6">
        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-1">Authenticated Environment</h4>
          <p className="text-sm text-blue-700 font-medium">This workspace is exclusive to the website owner and authorized team members. All uploads are globally distributed instantly.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
