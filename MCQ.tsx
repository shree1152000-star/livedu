
import React, { useState, useEffect } from 'react';
import { View, Question } from '../types';
import { 
  Clock, 
  Trophy, 
  ChevronRight, 
  CheckCircle, 
  XCircle, 
  Lock, 
  UserPlus, 
  Info, 
  ChevronLeft,
  BookOpen,
  GraduationCap,
  Calculator,
  Zap,
  Globe,
  Beaker
} from 'lucide-react';

interface MCQProps {
  onViewChange: (view: View) => void;
}

type ExamStep = 'category' | 'subject' | 'config' | 'exam' | 'result' | 'review';

const MCQ: React.FC<MCQProps> = ({ onViewChange }) => {
  const [step, setStep] = useState<ExamStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedMarks, setSelectedMarks] = useState<number>(10);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  const subjects = [
    { name: 'Math', icon: Calculator, color: 'text-blue-500 bg-blue-50' },
    { name: 'Physics', icon: Beaker, color: 'text-purple-500 bg-purple-50' },
    { name: 'English', icon: Globe, color: 'text-green-500 bg-green-50' },
    { name: 'Biology', icon: Beaker, color: 'text-red-500 bg-red-50' },
    { name: 'General Knowledge', icon: BookOpen, color: 'text-orange-500 bg-orange-50' },
    { name: 'Chemistry', icon: Zap, color: 'text-yellow-600 bg-yellow-50' },
  ];

  const markOptions = [10, 20, 50, 100, 200];

  const defaultQuestions: Question[] = Array(3).fill(null).map((_, i) => ({
    id: 'def' + i,
    text: "Who is the first Mathematician to be elected as the fellow of the Royal Society of the British Empire?",
    subject: "Math",
    options: [
      { id: 'A', text: 'Aryabhata' },
      { id: 'B', text: 'Euclid' },
      { id: 'C', text: 'Pythagoras' },
      { id: 'D', text: 'Ramanujan' }
    ],
    correctAnswer: 'D',
    explanation: 'Ramanujan was the first indian mathematician to be elected as a fellow of the Royal Society due to his extraordinary contributions to mathematics.'
  }));

  const loadQuestions = () => {
    const adminQsRaw = localStorage.getItem('admin_questions');
    let pool: Question[] = [];
    if (adminQsRaw) {
      const adminQs: Question[] = JSON.parse(adminQsRaw);
      pool = adminQs.filter(q => q.subject === selectedSubject);
    }
    
    // If admin has no questions for this subject, use default mock data
    if (pool.length === 0) {
      pool = defaultQuestions;
    }
    
    setActiveQuestions(pool);
  };

  const handleStartExam = () => {
    loadQuestions();
    if (selectedMarks > 50 && !isRegistered) {
      setShowRegModal(true);
    } else {
      setStep('exam');
    }
  };

  const handleRegistrationComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    setShowRegModal(false);
    setStep('exam');
  };

  const goBack = () => {
    if (step === 'subject') setStep('category');
    if (step === 'config') setStep('subject');
  };

  // UI Components
  const StepIndicator = () => (
    <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 mb-8">
      <span className={step === 'category' ? 'text-blue-600' : ''}>Category</span>
      <ChevronRight size={14} />
      <span className={step === 'subject' ? 'text-blue-600' : ''}>Subject</span>
      <ChevronRight size={14} />
      <span className={step === 'config' ? 'text-blue-600' : ''}>Configure</span>
    </div>
  );

  if (step === 'category') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Live MCQ Exam</h2>
          <p className="text-slate-500">Select a category to start your preparation</p>
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
              <h3 className="text-2xl font-bold text-slate-800">BCS Live MCQ Exam</h3>
              <p className="text-slate-500 mt-2">Comprehensive test bank for BCS Preliminary and Written preparation.</p>
            </div>
            <div className="pt-4 flex items-center text-blue-600 font-bold group-hover:translate-x-2 transition-transform">
              Explore Exams <ChevronRight size={20} />
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
              <h3 className="text-2xl font-bold text-slate-800">Admission Live MCQ Exam</h3>
              <p className="text-slate-500 mt-2">University and professional college entrance exam preparation.</p>
            </div>
            <div className="pt-4 flex items-center text-purple-600 font-bold group-hover:translate-x-2 transition-transform">
              Explore Exams <ChevronRight size={20} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'subject') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between">
          <button onClick={goBack} className="flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors">
            <ChevronLeft size={20} /> Back to Categories
          </button>
          <StepIndicator />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">Select Subject</h2>
          <p className="text-slate-500">Choosing subject for {selectedCategory} Exam</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const Icon = sub.icon;
            return (
              <button 
                key={sub.name}
                onClick={() => { setSelectedSubject(sub.name); setStep('config'); }}
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

  if (step === 'config') {
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 relative">
        {/* Registration Modal */}
        {showRegModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-200">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <UserPlus size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Registration Required</h3>
                <p className="text-slate-500">
                  Exams with more than 50 marks are exclusive to registered students. Register now to unlock 100+ marks professional model tests.
                </p>
              </div>

              <form onSubmit={handleRegistrationComplete} className="mt-8 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email or Phone</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Email or Phone Number" />
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                    Register & Start Exam
                  </button>
                </div>
                <button type="button" onClick={() => setShowRegModal(false)} className="w-full text-slate-400 font-bold text-sm">Maybe Later</button>
              </form>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <button onClick={goBack} className="flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors">
            <ChevronLeft size={20} /> Back to Subjects
          </button>
          <StepIndicator />
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Exam Configuration</h2>
            <p className="text-slate-500">{selectedCategory} Exam - {selectedSubject}</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Number of Questions (Marks)</label>
            <div className="grid grid-cols-5 gap-2">
              {markOptions.map((marks) => (
                <button
                  key={marks}
                  onClick={() => setSelectedMarks(marks)}
                  className={`py-3 rounded-xl font-bold transition-all border-2 ${
                    selectedMarks === marks 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {marks}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl flex items-start space-x-3 border border-blue-100">
            <Info className="text-blue-500 shrink-0" size={20} />
            <div className="text-xs space-y-1">
              <p className="font-bold text-blue-900 uppercase tracking-wider">Exam Summary</p>
              <p className="text-blue-700">Total Questions: {selectedMarks}</p>
              <p className="text-blue-700">Estimated Duration: {Math.floor(selectedMarks * 1.5)} minutes</p>
              {selectedMarks > 50 && (
                <p className="font-black text-blue-800 mt-2">✨ This exam requires student registration.</p>
              )}
            </div>
          </div>

          <button 
            onClick={handleStartExam}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            {selectedMarks > 50 && !isRegistered && <Lock size={20} />}
            {selectedMarks > 50 && !isRegistered ? 'Register & Start' : 'Start Exam Now'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'exam') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-600 font-bold">
            <Clock size={20} className="text-blue-500" />
            <span>Time Remain: 40:00</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">{selectedSubject} - {selectedMarks} Marks</h2>
          <div className="text-slate-600 font-bold">Total: {selectedMarks}</div>
        </div>

        <div className="space-y-8">
          {activeQuestions.map((q, idx) => (
            <div key={q.id} className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
              <p className="text-xl font-bold text-slate-800 leading-relaxed">
                {idx + 1}. {q.text}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center justify-between ${
                      selectedAnswers[q.id] === opt.id 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{opt.id}. {opt.text}</span>
                    {selectedAnswers[q.id] === opt.id && <CheckCircle size={20} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 flex justify-end">
          <button 
            onClick={() => setStep('result')}
            className="px-12 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Submit Exam
          </button>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-300">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">{selectedSubject} Results</h2>
          <p className="text-slate-500 font-bold">Total Marks: {selectedMarks}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
            <p className="text-slate-500 font-bold mb-2">Your Marks</p>
            <p className="text-6xl font-black text-slate-800">
               {Object.keys(selectedAnswers).filter(id => selectedAnswers[id] === activeQuestions.find(q => q.id === id)?.correctAnswer).length}
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center shadow-sm">
            <p className="text-slate-500 font-bold mb-2">Status</p>
            <p className="text-5xl font-black text-blue-600 uppercase tracking-widest">Completed</p>
          </div>
        </div>

        <button 
          onClick={() => setStep('review')}
          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          See Answer of the Quiz
        </button>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-green-500 text-white p-4 rounded-xl text-center font-bold text-lg">
          Detailed Explanation
        </div>

        <div className="space-y-8">
          {activeQuestions.map((q, idx) => (
            <div key={q.id} className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
              <p className="text-xl font-bold text-slate-800 leading-relaxed">
                {idx + 1}. {q.text}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map(opt => {
                  const isCorrect = opt.id === q.correctAnswer;
                  const isSelected = selectedAnswers[q.id] === opt.id;
                  const isWrong = isSelected && !isCorrect;

                  return (
                    <div
                      key={opt.id}
                      className={`w-full text-left p-4 rounded-xl border transition-all font-medium flex items-center justify-between ${
                        isCorrect 
                        ? 'bg-green-100 border-green-300 text-green-800' 
                        : isWrong
                        ? 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-slate-50 border-slate-100 text-slate-500'
                      }`}
                    >
                      <span>{opt.id}. {opt.text}</span>
                      {isCorrect && <CheckCircle size={20} />}
                      {isWrong && <XCircle size={20} />}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl space-y-2">
                <p className="font-black text-blue-900 uppercase text-sm tracking-widest">Explanation:</p>
                <p className="text-blue-800 leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setStep('category')}
          className="w-full py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return null;
};

export default MCQ;
