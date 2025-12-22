
import React, { useState, useEffect } from 'react';
import { Lecture, AdminDocument } from '../types';
import { PlayCircle, ChevronDown, MonitorPlay, FileText, Download, Bookmark } from 'lucide-react';

const Lectures: React.FC = () => {
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>({
    id: '1',
    title: 'Lecture - 01',
    duration: '15:00'
  });
  const [adminDocs, setAdminDocs] = useState<AdminDocument[]>([]);

  useEffect(() => {
    const savedDocs = localStorage.getItem('admin_documents');
    if (savedDocs) setAdminDocs(JSON.parse(savedDocs));
  }, []);

  const lectures: Lecture[] = [
    { id: '1', title: 'Lecture - 01', duration: '15:00' },
    { id: '2', title: 'Lecture - 02', duration: '15:00' },
    { id: '3', title: 'Lecture - 03', duration: '15:00' },
    { id: '4', title: 'Lecture - 04', duration: '15:00' },
    { id: '5', title: 'Lecture - 05', duration: '15:00' },
  ];

  return (
    <div className="space-y-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="bg-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 flex items-center cursor-pointer">
          Math <ChevronDown size={16} className="ml-2" />
        </div>
        <div className="bg-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 flex items-center cursor-pointer">
          Calculus <ChevronDown size={16} className="ml-2" />
        </div>
        <button className="bg-blue-500 text-white rounded-xl px-6 py-2 text-sm font-bold shadow-lg shadow-blue-100">Apply Filters</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative group cursor-pointer">
            <img 
              src="https://picsum.photos/seed/lect/1280/720" 
              className="w-full h-full object-cover opacity-80" 
              alt="Lecture Preview"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-2xl group-hover:scale-110 transition-transform">
                <PlayCircle size={48} className="text-white" fill="currentColor" />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">{selectedLecture?.title}</h2>
            <p className="text-slate-500 font-medium text-sm">Duration: {selectedLecture?.duration}</p>
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0 space-y-4">
          <h3 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-2">
            <MonitorPlay size={20} className="text-blue-600" />
            Playlist
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {lectures.map((lecture) => (
              <div 
                key={lecture.id}
                onClick={() => setSelectedLecture(lecture)}
                className={`flex items-center space-x-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedLecture?.id === lecture.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${selectedLecture?.id === lecture.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <MonitorPlay size={20} />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${selectedLecture?.id === lecture.id ? 'text-blue-700' : 'text-slate-700'}`}>{lecture.title}</h4>
                  <p className="text-slate-400 text-xs font-medium">Duration: {lecture.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Resources Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Bookmark className="text-purple-600" />
            Resource Library
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            Admin Verified
          </span>
        </div>
        
        {adminDocs.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center text-slate-400">
             No study materials uploaded for this section yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-4 rounded-2xl ${doc.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                    <FileText size={24} />
                  </div>
                  <button className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                    <Download size={20} />
                  </button>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{doc.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{doc.subject}</span>
                    <span className="text-slate-200">•</span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{doc.fileSize}</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-300">
                  <span>Uploaded {doc.uploadDate}</span>
                  <span className="text-blue-400">Open Resource</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lectures;
