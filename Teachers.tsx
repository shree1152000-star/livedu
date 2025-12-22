
import React, { useState } from 'react';
import { Teacher, View } from '../types';
import { 
  Star, 
  Search, 
  ChevronDown, 
  Video, 
  Play, 
  BookOpen, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft,
  Calculator,
  Beaker,
  Globe,
  Zap
} from 'lucide-react';

interface TeachersProps {
  onViewChange: (view: View) => void;
  onSelectTeacher: (teacher: Teacher) => void;
}

type TeacherStep = 'category' | 'subject' | 'listing';

const Teachers: React.FC<TeachersProps> = ({ onViewChange, onSelectTeacher }) => {
  const [step, setStep] = useState<TeacherStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = [
    { name: 'Math', icon: Calculator, color: 'text-blue-500 bg-blue-50' },
    { name: 'Physics', icon: Beaker, color: 'text-purple-500 bg-purple-50' },
    { name: 'English', icon: Globe, color: 'text-green-500 bg-green-50' },
    { name: 'Biology', icon: Beaker, color: 'text-red-500 bg-red-50' },
    { name: 'General Knowledge', icon: BookOpen, color: 'text-orange-500 bg-orange-50' },
    { name: 'Chemistry', icon: Zap, color: 'text-yellow-600 bg-yellow-50' },
  ];

  const teachers: Teacher[] = Array(8).fill(null).map((_, i) => ({
    id: i.toString(),
    name: 'Prof. Hannan Sarker',
    role: 'Asst. Teacher',
    institution: 'Adamji Cant. Public High School',
    experience: '11+ Years Experience',
    rating: 4.5,
    reviewCount: 20,
    status: i % 2 === 0 ? 'online' : 'offline',
    image: `https://picsum.photos/seed/teacher${i}/300/300`,
    about: "Certified TEFL Tutor with Global Experience - Patient, Supportive and Dedicated to Your Progress!",
    hourlyRate: "BDT. 330/hr"
  }));

  if (step === 'category') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Live Teachers</h2>
          <p className="text-slate-500">Connect with expert educators for personalized learning</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button 
            onClick={() => { setSelectedCategory('BCS'); setStep('subject'); }}
            className="group bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-xl transition-all text-left space-y-6"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">BCS Live Teachers</h3>
              <p className="text-slate-500 mt-2">Expert guides for BCS Preliminary, Written, and Viva preparation.</p>
            </div>
            <div className="pt-4 flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
              Find Teachers <ChevronRight size={20} />
            </div>
          </button>
          <button 
            onClick={() => { setSelectedCategory('Admission'); setStep('subject'); }}
            className="group bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-purple-500 hover:shadow-xl transition-all text-left space-y-6"
          >
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Admission Live Teachers</h3>
              <p className="text-slate-500 mt-2">University entrance specialists for Medical, Engineering, and Dhaka University.</p>
            </div>
            <div className="pt-4 flex items-center text-purple-600 font-bold group-hover:translate-x-2 transition-transform">
              Find Teachers <ChevronRight size={20} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'subject') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setStep('category')} className="flex items-center text-slate-500 hover:text-blue-600 font-bold">
          <ChevronLeft size={20} /> Back to Categories
        </button>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Select Subject</h2>
          <p className="text-slate-500">{selectedCategory} Specialists</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <button 
                key={sub.name}
                onClick={() => { setSelectedSubject(sub.name); setStep('listing'); }}
                className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center space-y-4"
              >
                <div className={`p-4 rounded-xl ${sub.color}`}>
                  <Icon size={28} />
                </div>
                <span className="font-bold text-slate-700">{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <button onClick={() => setStep('subject')} className="flex items-center text-slate-500 hover:text-blue-600 font-bold">
          <ChevronLeft size={20} /> Back to {selectedSubject} Subjects
        </button>
        <div className="text-sm font-bold text-slate-400">
          {selectedCategory} > {selectedSubject}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 max-w-md relative">
          <input 
            type="text" 
            placeholder="Search Teacher..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <div 
            key={teacher.id} 
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 p-4 flex space-x-4 cursor-pointer hover:shadow-md transition-all"
            onClick={() => onSelectTeacher(teacher)}
          >
            <div className="relative w-32 h-40 shrink-0">
              <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover rounded-xl" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span>{teacher.rating}({teacher.reviewCount})</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-800 text-lg">{teacher.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase ${teacher.status === 'online' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                    {teacher.status}
                  </span>
                </div>
                <p className="text-slate-500 text-xs font-medium mt-0.5">{teacher.role}</p>
                <p className="text-slate-500 text-xs mt-0.5">{teacher.institution}</p>
                <p className="text-blue-600 text-xs font-bold mt-2">{teacher.hourlyRate}</p>
              </div>

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-2 border border-blue-500 text-blue-500 rounded-lg text-[9px] font-bold hover:bg-blue-50">
                  <Video size={10} />
                  <span>Join Live</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-1 py-2 px-2 border border-yellow-500 text-yellow-500 rounded-lg text-[9px] font-bold hover:bg-yellow-50">
                  <Play size={10} fill="currentColor" />
                  <span>Demo</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teachers;
