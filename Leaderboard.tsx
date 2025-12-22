
import React, { useState } from 'react';
import { ChevronDown, Trophy, Medal, Target, Award, Search } from 'lucide-react';

type RankingScope = 'overall' | 'subject' | 'modelTest';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  marks: number;
  accuracy: string;
  trend: 'up' | 'down' | 'stable';
}

const Leaderboard: React.FC = () => {
  const [scope, setScope] = useState<RankingScope>('overall');
  const [selectedSubject, setSelectedSubject] = useState('Math');
  const [selectedTest, setSelectedTest] = useState('BCS Preli - 05');

  const mockData: Record<RankingScope, LeaderboardEntry[]> = {
    overall: [
      { rank: 1, name: 'Nurul Hasan Sarker', avatar: 'https://i.pravatar.cc/150?u=1', marks: 950, accuracy: '98%', trend: 'up' },
      { rank: 2, name: 'Kamrul Islam', avatar: 'https://i.pravatar.cc/150?u=2', marks: 942, accuracy: '96%', trend: 'stable' },
      { rank: 3, name: 'Hannan Sarker', avatar: 'https://i.pravatar.cc/150?u=3', marks: 920, accuracy: '94%', trend: 'up' },
      { rank: 4, name: 'Jamil Hasan', avatar: 'https://i.pravatar.cc/150?u=4', marks: 915, accuracy: '95%', trend: 'down' },
      { rank: 5, name: 'Sabbir Ahmed', avatar: 'https://i.pravatar.cc/150?u=5', marks: 890, accuracy: '92%', trend: 'stable' },
    ],
    subject: [
      { rank: 1, name: 'Hannan Sarker', avatar: 'https://i.pravatar.cc/150?u=3', marks: 98, accuracy: '100%', trend: 'up' },
      { rank: 2, name: 'Nurul Hasan Sarker', avatar: 'https://i.pravatar.cc/150?u=1', marks: 95, accuracy: '97%', trend: 'stable' },
      { rank: 3, name: 'Kamrul Islam', avatar: 'https://i.pravatar.cc/150?u=2', marks: 92, accuracy: '94%', trend: 'down' },
    ],
    modelTest: [
      { rank: 1, name: 'Kamrul Islam', avatar: 'https://i.pravatar.cc/150?u=2', marks: 185, accuracy: '93%', trend: 'up' },
      { rank: 2, name: 'Hannan Sarker', avatar: 'https://i.pravatar.cc/150?u=3', marks: 180, accuracy: '90%', trend: 'stable' },
      { rank: 3, name: 'Nurul Hasan Sarker', avatar: 'https://i.pravatar.cc/150?u=1', marks: 178, accuracy: '89%', trend: 'up' },
    ]
  };

  const currentLeaderboard = mockData[scope];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Scope Selection */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Trophy className="text-yellow-500" />
            Hall of Fame
          </h1>
          <p className="text-slate-500 font-medium">Compete with the best and track your progress</p>
        </div>

        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center border border-slate-200 shadow-inner">
          <button 
            onClick={() => setScope('overall')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${scope === 'overall' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Wholewise
          </button>
          <button 
            onClick={() => setScope('subject')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${scope === 'subject' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Subjectwise
          </button>
          <button 
            onClick={() => setScope('modelTest')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${scope === 'modelTest' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Model Testwise
          </button>
        </div>
      </div>

      {/* Contextual Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {scope === 'subject' && (
          <div className="relative">
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-slate-700 font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>Math</option>
              <option>English</option>
              <option>General Science</option>
              <option>Geography</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        )}

        {scope === 'modelTest' && (
          <div className="relative">
            <select 
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-slate-700 font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option>BCS Preli - 05</option>
              <option>Weekly Live MCQ - 02</option>
              <option>Subject Test: Algebra</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        )}

        <div className="flex-1 min-w-[240px] relative">
          <input 
            type="text" 
            placeholder="Search student..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      {/* User Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-3xl text-white shadow-xl shadow-blue-100 flex items-center space-x-5">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <Target size={32} />
          </div>
          <div>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Your Position</p>
            <p className="text-3xl font-black">#15</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-5">
          <div className="bg-green-100 p-3 rounded-2xl text-green-600">
            <Award size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Your Marks</p>
            <p className="text-3xl font-black text-slate-800">70.00</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center space-x-5">
          <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
            <Medal size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Students</p>
            <p className="text-3xl font-black text-slate-800">1.2k</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Rank</th>
                <th className="px-8 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Student</th>
                <th className="px-8 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Marks</th>
                <th className="px-8 py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Accuracy</th>
                <th className="px-8 py-5 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentLeaderboard.map((student) => (
                <tr key={student.rank} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {student.rank === 1 ? (
                        <Medal className="text-yellow-400" size={24} fill="currentColor" />
                      ) : student.rank === 2 ? (
                        <Medal className="text-slate-300" size={24} fill="currentColor" />
                      ) : student.rank === 3 ? (
                        <Medal className="text-orange-300" size={24} fill="currentColor" />
                      ) : (
                        <span className="w-6 text-center font-black text-slate-400">{student.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <img src={student.avatar} className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm" alt="" />
                      <span className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <span className="px-4 py-1.5 bg-slate-100 rounded-full font-black text-slate-700 text-sm">
                      {student.marks}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <span className="font-bold text-slate-500">{student.accuracy}</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                      student.trend === 'up' ? 'text-green-600 bg-green-50' : 
                      student.trend === 'down' ? 'text-red-600 bg-red-50' : 
                      'text-slate-500 bg-slate-100'
                    }`}>
                      {student.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-slate-500 text-sm font-medium">Showing top 50 students</p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors">Previous</button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
