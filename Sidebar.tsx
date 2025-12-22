
import React, { useState } from 'react';
import { View, ChatHistoryItem, UserRole } from '../types';
import { 
  MessageSquare, 
  HelpCircle, 
  Users, 
  PlayCircle, 
  BarChart2, 
  LayoutGrid,
  Menu,
  Plus,
  Trash2,
  Clock,
  ShieldAlert,
  Key,
  X,
  History,
  LogOut,
  FolderLock
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  chatHistory: ChatHistoryItem[];
  onNewChat: () => void;
  onSelectChat: (chat: ChatHistoryItem) => void;
  userRole: UserRole;
  onSetRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  chatHistory, 
  onNewChat, 
  onSelectChat,
  userRole,
  onSetRole
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  const handleTeamLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === 'admin123') {
      onSetRole('admin');
      setShowLogin(false);
      setAccessCode('');
      setError('');
    } else if (accessCode === 'team_collab') {
      onSetRole('collaborator');
      setShowLogin(false);
      setAccessCode('');
      setError('');
    } else {
      setError('Invalid Access Code');
    }
  };

  const navItems = [
    { id: 'chat' as View, label: 'New Chat', icon: Plus },
    { id: 'mcq' as View, label: 'Live MCQ Exam', icon: HelpCircle },
    { id: 'teachers' as View, label: 'Live Teacher', icon: Users },
    { id: 'lectures' as View, label: 'Lectures', icon: PlayCircle },
    { id: 'leaderboard' as View, label: 'Leaderboard', icon: BarChart2 },
    { id: 'locker' as View, label: 'Study Locker', icon: FolderLock },
  ];

  const isAdminOrCollab = userRole === 'admin' || userRole === 'collaborator';

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-50">
      {/* Team Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="text-blue-600" size={20} />
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Team Entry</h3>
              </div>
              <button onClick={() => setShowLogin(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">Owner & Collaborator Access Only</p>
            <form onSubmit={handleTeamLogin} className="space-y-4">
              <div className="relative">
                <input 
                  autoFocus
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter Team Key"
                  className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                />
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
              {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest px-1 text-center">{error}</p>}
              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Authenticate
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onViewChange('chat')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutGrid className="text-white" size={18} />
          </div>
          <span className="font-black text-slate-800 tracking-tight text-lg">EduPro</span>
        </div>
        <button onClick={onNewChat} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-blue-600" title="New Chat Session">
          <Plus size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="mt-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'mcq' && ['exam_result', 'exam_review', 'exam_history'].includes(currentView));
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'chat') onNewChat();
                else onViewChange(item.id);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive 
                ? 'bg-blue-50 text-blue-600 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin Section - STRICTLY gated to Owners/Team */}
      {isAdminOrCollab && (
        <div className="mt-4 px-3">
          <div className="h-px bg-slate-100 mx-3 mb-4 opacity-50"></div>
          <button
            onClick={() => onViewChange('admin')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
              currentView === 'admin' 
              ? 'bg-red-50 text-red-600 shadow-sm' 
              : 'text-slate-500 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <ShieldAlert size={18} />
            <span className="font-bold text-sm">Team Workspace</span>
          </button>
        </div>
      )}

      {/* Chat History Section */}
      <div className="flex-1 mt-6 flex flex-col overflow-hidden">
        <div className="px-4 mb-2 flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
            <History size={12} />
            Saved Chats
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-hide pb-4">
          {chatHistory.length === 0 ? (
            <div className="px-4 py-8 text-center space-y-2">
              <MessageSquare size={24} className="text-slate-100 mx-auto" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No history yet</p>
            </div>
          ) : chatHistory.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className="w-full group flex items-start space-x-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
            >
              <MessageSquare size={14} className="text-slate-400 mt-1 shrink-0 group-hover:text-blue-500" />
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-slate-700 truncate group-hover:text-blue-600">{chat.title}</p>
                <div className="flex items-center space-x-1 mt-0.5 text-[9px] text-slate-400 uppercase font-black tracking-tighter">
                  <Clock size={8} />
                  <span>{chat.date}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative cursor-pointer" onClick={() => !isAdminOrCollab && setShowLogin(true)}>
              <img 
                src={isAdminOrCollab ? "https://picsum.photos/seed/admin/100/100" : "https://i.pravatar.cc/100?u=student"} 
                alt="User" 
                className="w-9 h-9 rounded-full border border-white shadow-sm transition-transform active:scale-90"
              />
              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${isAdminOrCollab ? 'bg-red-500' : 'bg-green-500'}`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-xs truncate">
                {userRole === 'admin' ? 'Owner' : userRole === 'collaborator' ? 'Team Member' : 'John Student'}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest truncate">
                  {userRole === 'admin' ? 'Super Admin' : userRole === 'collaborator' ? 'Collaborator' : 'Premium Student'}
                </p>
              </div>
            </div>
          </div>
          {isAdminOrCollab && (
            <button 
              onClick={() => onSetRole('student')}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Exit Team Mode"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
