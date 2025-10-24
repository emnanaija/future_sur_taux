import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { FutureCreationForm } from './components/forms/FutureCreationForm';
import { FutureList } from './components/FutureList';
import { Plus, BarChart3, Home } from 'lucide-react';

type AppView = 'list' | 'create';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('list');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-teal-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Future sur Taux</h1>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentView === 'list'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Liste des Futures</span>
              </button>
              <button
                onClick={() => setCurrentView('create')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentView === 'create'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Créer un Future</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main>
        {currentView === 'list' ? (
          <FutureList />
        ) : (
          <FutureCreationForm onSuccess={() => setCurrentView('list')} />
        )}
      </main>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
