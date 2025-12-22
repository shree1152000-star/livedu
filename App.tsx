
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './pages/Chat';
import MCQ from './pages/MCQ';
import Teachers from './pages/Teachers';
import TeacherProfile from './pages/TeacherProfile';
import Lectures from './pages/Lectures';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';
import StudyLocker from './pages/StudyLocker';
import { View, Teacher, Message, ChatHistoryItem, UserRole, StudentAsset } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('chat');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  // Helper to ensure timestamp is a Date object (localStorage saves as string)
  const sanitizeMessages = (msgs: any[]): Message[] => {
    return msgs.map(m => ({
      ...m,
      timestamp: m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp)
    }));
  };

  // Persistence States
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      if (!saved) return [];
      const parsed: ChatHistoryItem[] = JSON.parse(saved);
      return parsed.map(chat => ({
        ...chat,
        messages: sanitizeMessages(chat.messages)
      }));
    } catch (e) {
      console.error("Failed to load chat history", e);
      return [];
    }
  });

  const [studentAssets, setStudentAssets] = useState<StudentAsset[]>(() => {
    try {
      const saved = localStorage.getItem('student_assets');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load assets", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('student_assets', JSON.stringify(studentAssets));
  }, [studentAssets]);

  const handleSetRole = (role: UserRole) => {
    setUserRole(role);
    if (role === 'student' && currentView === 'admin') {
      setCurrentView('chat');
    }
  };

  const handleNewChat = () => {
    if (messages.length > 0) {
      const newHistoryItem: ChatHistoryItem = {
        id: Date.now().toString(),
        title: messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? "..." : ""),
        date: new Date().toLocaleDateString(),
        messages: sanitizeMessages([...messages])
      };
      setChatHistory(prev => [newHistoryItem, ...prev]);
    }
    setMessages([]);
    setCurrentView('chat');
  };

  const loadChat = (chat: ChatHistoryItem) => {
    setMessages(sanitizeMessages(chat.messages));
    setCurrentView('chat');
  };

  const handleAddAsset = (asset: StudentAsset) => {
    setStudentAssets(prev => [asset, ...prev]);
  };

  const handleRemoveAsset = (id: string) => {
    setStudentAssets(prev => prev.filter(a => a.id !== id));
  };

  const renderView = () => {
    const isAdminOrCollab = userRole === 'admin' || userRole === 'collaborator';
    
    // STRICT GATING
    if (currentView === 'admin' && !isAdminOrCollab) {
      return <Chat messages={messages} setMessages={setMessages} onAddAsset={handleAddAsset} />;
    }

    switch (currentView) {
      case 'chat':
        return <Chat messages={messages} setMessages={setMessages} onAddAsset={handleAddAsset} />;
      case 'mcq':
        return <MCQ onViewChange={setCurrentView} />;
      case 'locker':
        return <StudyLocker assets={studentAssets} onAddAsset={handleAddAsset} onRemoveAsset={handleRemoveAsset} />;
      case 'teachers':
        return (
          <Teachers 
            onViewChange={setCurrentView} 
            onSelectTeacher={(t) => {
              setSelectedTeacher(t);
              setCurrentView('teacher_profile');
            }} 
          />
        );
      case 'teacher_profile':
        return selectedTeacher ? (
          <TeacherProfile 
            teacher={selectedTeacher} 
            onBack={() => setCurrentView('teachers')} 
          />
        ) : <Teachers onViewChange={setCurrentView} onSelectTeacher={setSelectedTeacher} />;
      case 'lectures':
        return <Lectures />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'admin':
        return <Admin />;
      default:
        return <Chat messages={messages} setMessages={setMessages} onAddAsset={handleAddAsset} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={loadChat}
        userRole={userRole}
        onSetRole={handleSetRole}
      />
      
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
        <div className="h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
