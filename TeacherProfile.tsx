
import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import { 
  Book, 
  Star, 
  Play, 
  ArrowLeft, 
  MessageCircle, 
  Video, 
  CreditCard,
  ExternalLink,
  FileText,
  BrainCircuit,
  CheckCircle2,
  Clock,
  ShieldCheck,
  PartyPopper,
  Send,
  ThumbsUp
} from 'lucide-react';

interface TeacherProfileProps {
  teacher: Teacher;
  onBack: () => void;
}

type InteractionMode = 'view' | 'chat' | 'payment' | 'payment_success' | 'session' | 'post_session';

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher, onBack }) => {
  const [activeTab, setActiveTab] = useState<'education' | 'experience' | 'reviews'>('education');
  const [mode, setMode] = useState<InteractionMode>('view');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Feedback State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const chapters = [
    "Algebra & Formulas",
    "Differentiation & Integration",
    "Trigonometry Applications",
    "Mental Arithmetic Hacks",
    "Statistical Data Analysis"
  ];

  const handlePayment = () => {
    setIsProcessingPayment(true);
    // Simulate Gateway Processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setMode('payment_success');
      
      // Auto-transition to session after showing success message
      setTimeout(() => {
        setMode('session');
      }, 3000);
    }, 2000);
  };

  const handleSubmitFeedback = () => {
    setFeedbackSubmitted(true);
    // In a real app, this would send data to the backend
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 relative">
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-blue-500 font-medium transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Back to Teachers
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img src={teacher.image} alt={teacher.name} className="w-64 h-64 object-cover rounded-3xl shadow-lg shrink-0" />
            <div className="space-y-4 flex-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold text-slate-800">{teacher.name}</h1>
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <p className="text-slate-600 leading-relaxed text-sm max-w-2xl">{teacher.about}</p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 text-xs font-bold">
                  <Book size={14} className="text-blue-500" />
                  <span>BCS Specialist</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 text-xs font-bold">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span>4.5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interaction Flow Content */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
            {mode === 'view' && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-1.5 rounded-2xl inline-flex w-full border border-slate-200">
                  {(['education', 'experience', 'reviews'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="pt-4 flex-1">
                  {activeTab === 'education' && <p className="text-slate-500 italic">Education details loading...</p>}
                  {activeTab === 'experience' && <p className="text-slate-500 italic">Work history loading...</p>}
                  {activeTab === 'reviews' && <p className="text-slate-500 italic">No reviews yet.</p>}
                </div>
              </div>
            )}

            {mode === 'chat' && (
              <div className="space-y-6 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">Topic Selection</h3>
                  <button onClick={() => setMode('view')} className="text-slate-400 hover:text-slate-600">Cancel</button>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700">Select the chapter you want to study today:</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chapters.map((chapter) => (
                      <button
                        key={chapter}
                        onClick={() => setSelectedChapter(chapter)}
                        className={`text-left p-4 rounded-xl border-2 transition-all font-medium ${selectedChapter === chapter ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200 text-slate-600'}`}
                      >
                        {chapter}
                      </button>
                    ))}
                  </div>
                </div>
                {selectedChapter && (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center space-x-3 text-green-700">
                    <CheckCircle2 size={20} />
                    <p className="text-sm font-bold">Teacher has agreed to take a class on "{selectedChapter}".</p>
                  </div>
                )}
                <button 
                  disabled={!selectedChapter}
                  onClick={() => setMode('payment')}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                  Proceed to Payment
                </button>
              </div>
            )}

            {mode === 'payment' && (
              <div className="space-y-8 animate-in zoom-in-95 text-center py-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-800">Payment Checkout</h3>
                  <p className="text-slate-500">Service Fee: <span className="text-blue-600 font-bold">{teacher.hourlyRate}</span></p>
                </div>
                
                <div className="bg-pink-50 p-8 rounded-3xl border-2 border-pink-100 space-y-4 max-w-sm mx-auto shadow-xl shadow-pink-100/50">
                  <img src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/BKash_logo.svg/1200px-BKash_logo.svg.png" className="h-12 mx-auto" alt="Bkash" />
                  <div className="space-y-1">
                    <p className="text-pink-600 font-black text-sm uppercase tracking-widest">Bkash Gateway</p>
                    <p className="text-[10px] text-pink-400 font-bold">Secure SSL Encrypted Payment</p>
                  </div>
                  <button 
                    onClick={handlePayment}
                    className="w-full py-4 bg-[#D12053] text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    {isProcessingPayment ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span>Confirm Payment</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-2 text-slate-400">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-tighter">Your transaction is 100% secure</span>
                </div>
              </div>
            )}

            {mode === 'payment_success' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-8 py-12 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 scale-150"></div>
                  <div className="absolute -top-4 -right-4 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-6 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  
                  <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-200 relative z-10">
                    <CheckCircle2 size={64} className="animate-in slide-in-from-bottom-2 duration-500" />
                  </div>
                </div>

                <div className="text-center space-y-4 max-w-sm">
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                    <PartyPopper size={14} />
                    <span>Transaction Successful</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-800">Payment Done!</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Your session for <span className="font-bold text-slate-700">"{selectedChapter}"</span> has been confirmed. Redirecting you to the classroom...
                  </p>
                </div>

                <div className="w-full max-w-xs bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preparing Class</span>
                  </div>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 animate-[loading_3s_ease-in-out]"></div>
                  </div>
                </div>
                
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes loading {
                    0% { width: 0%; }
                    100% { width: 100%; }
                  }
                ` }} />
              </div>
            )}

            {mode === 'session' && (
              <div className="space-y-8 animate-in zoom-in-95">
                <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-xl shadow-blue-100 text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black">Class is Ready!</h3>
                    <p className="text-blue-100">Topic: {selectedChapter}</p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <a 
                      href="https://meet.google.com" 
                      target="_blank" 
                      className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-all"
                    >
                      <Video size={20} />
                      <span>Join via Google Meet</span>
                    </a>
                    <a 
                      href="https://zoom.us" 
                      target="_blank" 
                      className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-900 transition-all"
                    >
                      <ExternalLink size={20} />
                      <span>Join via Zoom</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setMode('post_session')}
                    className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-4 hover:border-blue-500 transition-all group"
                  >
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                      <BrainCircuit size={28} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">End Class & Take Test</p>
                      <p className="text-xs text-slate-500">AI-powered quick MCQ exam</p>
                    </div>
                  </button>
                  <button className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center space-x-4 hover:border-green-500 transition-all group">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800">Download Lecture PDF</p>
                      <p className="text-xs text-slate-500">Summary & notes of current session</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {mode === 'post_session' && (
              <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-8 animate-in zoom-in-95">
                {!feedbackSubmitted ? (
                  <div className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={32} />
                      </div>
                      <h3 className="text-2xl font-black text-slate-800">Rate Your Session</h3>
                      <p className="text-slate-500 font-medium">How was your class with {teacher.name}?</p>
                    </div>

                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform active:scale-90"
                        >
                          <Star 
                            size={40} 
                            className={`${
                              (hoverRating || rating) >= star 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-slate-200'
                            } transition-colors`} 
                          />
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest px-1">Any comments? (Optional)</label>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you liked or what could be improved..."
                        className="w-full h-24 p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
                      />
                    </div>

                    <button 
                      onClick={handleSubmitFeedback}
                      disabled={rating === 0}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                      <span>Submit Feedback</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-100">
                      <ThumbsUp size={48} className="animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-slate-800">Thanks for the feedback!</h3>
                      <p className="text-slate-500 font-medium max-w-xs mx-auto">Your review helps us maintain high quality education standards.</p>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center space-x-2">
                        <BrainCircuit size={20} />
                        <span>Start AI MCQ Test</span>
                      </button>
                      <button onClick={() => setMode('view')} className="px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                        Back to Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6 sticky top-8">
            <div className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-video bg-slate-900">
              <img src="https://picsum.photos/seed/video/600/400" className="w-full h-full object-cover opacity-80" alt="Demo" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                  <Play size={24} className="text-white ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">DEMO</div>
            </div>

            <div className="flex justify-between items-center px-1">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Rate Per Hour</div>
              <p className="text-blue-600 font-black text-xl">{teacher.hourlyRate}</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setMode('chat')}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <MessageCircle size={20} />
                <span>Chat with Teacher</span>
              </button>
              <button className="w-full py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-all">
                <Video size={20} />
                <span>Join Live Class</span>
              </button>
              <button className="w-full py-3 bg-yellow-50 text-yellow-600 rounded-xl font-bold text-xs uppercase tracking-widest">
                Watch Demo Class
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-3">
              <Clock className="text-slate-400" size={18} />
              <div className="text-[10px] text-slate-500 font-bold uppercase leading-tight">
                Teacher usually responds within 5 minutes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
