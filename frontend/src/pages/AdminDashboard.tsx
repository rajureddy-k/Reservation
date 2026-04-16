import { useState } from 'react';
import { Film, MapPin, Calendar, Armchair } from 'lucide-react';
import { MovieManagement } from './admin/MovieManagement';
import { CinemaManagement } from './admin/CinemaManagement';
import { ScheduleManagement } from './admin/ScheduleManagement';
import { SeatManagement } from './admin/SeatManagement';

type Tab = 'movies' | 'cinemas' | 'schedules' | 'seats';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('movies');

  const tabs = [
    { id: 'movies' as Tab, label: 'Movies', icon: Film },
    { id: 'cinemas' as Tab, label: 'Cinemas', icon: MapPin },
    { id: 'schedules' as Tab, label: 'Schedules', icon: Calendar },
    { id: 'seats' as Tab, label: 'Seats', icon: Armchair },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your cinema system</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex space-x-1 p-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'movies' && <MovieManagement />}
          {activeTab === 'cinemas' && <CinemaManagement />}
          {activeTab === 'schedules' && <ScheduleManagement />}
          {activeTab === 'seats' && <SeatManagement />}
        </div>
      </div>
    </div>
  );
}
