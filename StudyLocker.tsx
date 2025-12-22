
import React, { useState, useEffect, useRef } from 'react';
import { StudentAsset } from '../types';
import { 
  FolderLock, 
  Plus, 
  Trash2, 
  FileImage, 
  FileText, 
  Search, 
  CloudUpload, 
  Loader2, 
  Maximize2, 
  X, 
  Sparkles,
  ChevronRight,
  Clock,
  BookOpen,
  Eye,
  // Fix: Added missing Zap icon import
  Zap
} from 'lucide-react';

interface StudyLockerProps {
  assets: StudentAsset[];
  onAddAsset: (asset: StudentAsset) => void;
  onRemoveAsset: (id: string) => void;
}

const StudyLocker: React.FC<StudyLockerProps> = ({ assets, onAddAsset, onRemoveAsset }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<StudentAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredAssets = assets.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string);
      const newAsset: StudentAsset = {
        id: Date.now().toString(),
        title: file.name,
        type: file.type.includes('image') ? 'IMAGE' : 'PDF',
        data: base64,
        mimeType: file.type,
        date: new Date().toLocaleDateString(),
        subject: 'General Study',
        aiAnalysis: 'Click to analyze with AI...'
      };
      onAddAsset(newAsset);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.75rem] flex items-center justify-center shadow-xl shadow-blue-100">
            <FolderLock size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Study Locker</h1>
            <p className="text-slate-400 font-medium">Your personal vault for documents, captures & AI notes</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search locker..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-64 text-sm font-bold"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <CloudUpload size={16} />}
            <span>Upload Asset</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*,application/pdf" 
          />
        </div>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[4rem] p-24 text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-slate-50 text-slate-200 rounded-[3rem] flex items-center justify-center mx-auto shadow-inner">
            <FolderLock size={64} />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black text-slate-800">Your Locker is Empty</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto">Upload screenshots, exam papers, or handwritten notes to keep them safe in your personal study vault.</p>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-10 py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Start Archiving
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.id} 
              className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden relative cursor-pointer"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-50">
                {asset.type === 'IMAGE' ? (
                  <img src={asset.data} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={asset.title} />
                ) : (
                  <FileText size={48} className="text-blue-500" />
                )}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 size={32} className="text-white scale-75 group-hover:scale-100 transition-transform" />
                </div>
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-xl text-slate-900 shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {asset.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{asset.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={10} />
                      <span>{asset.date}</span>
                    </div>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">
                      {asset.subject}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-50">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveAsset(asset.id); }}
                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                    View & Analyze
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Overlay */}
      {selectedAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-6xl h-[85vh] flex overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-500 border border-white/20">
            {/* Viewer */}
            <div className="flex-[3] bg-slate-950 flex items-center justify-center p-4 relative">
              {selectedAsset.type === 'IMAGE' ? (
                <img src={selectedAsset.data} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
              ) : (
                <div className="text-white flex flex-col items-center space-y-4">
                  <FileText size={120} className="text-blue-400" />
                  <p className="font-bold">PDF Document Viewer</p>
                </div>
              )}
              <button 
                onClick={() => setSelectedAsset(null)}
                className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all border border-white/20"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* AI Sidepanel */}
            <div className="flex-[2] bg-white flex flex-col border-l border-slate-100">
              <div className="p-8 border-b border-slate-50 space-y-2">
                <div className="flex items-center space-x-3 text-blue-600 mb-2">
                  <Sparkles size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Study Assistant</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{selectedAsset.title}</h3>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold">
                    <Clock size={14} />
                    <span>Archived on {selectedAsset.date}</span>
                  </div>
                  <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-bold">
                    <BookOpen size={14} />
                    <span>{selectedAsset.subject}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-slate-50/30">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                    <span>Intelligent Summary</span>
                    <span className="text-green-500 bg-green-50 px-2 py-0.5 rounded">Analyzed</span>
                  </h4>
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-slate-600 leading-relaxed text-sm font-medium">
                      {selectedAsset.aiAnalysis || "AI analysis not started. This module will help you extract text, solve equations, and create flashcards from this document."}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-5 bg-white border border-slate-100 rounded-3xl text-left hover:border-blue-500 transition-all group shadow-sm">
                    <Zap size={24} className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-slate-800 text-sm">Create Exam</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">MCQs from this file</p>
                  </button>
                  <button className="p-5 bg-white border border-slate-100 rounded-3xl text-left hover:border-purple-500 transition-all group shadow-sm">
                    <BookOpen size={24} className="text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-slate-800 text-sm">Study Guide</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-bold">Generated notes</p>
                  </button>
                </div>
              </div>
              
              <div className="p-8 border-t border-slate-50 flex items-center space-x-4">
                <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 shadow-xl transition-all flex items-center justify-center space-x-2">
                  <span>Chat About Asset</span>
                  <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => { onRemoveAsset(selectedAsset.id); setSelectedAsset(null); }}
                  className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyLocker;
