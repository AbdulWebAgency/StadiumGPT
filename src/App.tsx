import React, { useState, useEffect } from 'react';
import { useAccessibility } from './hooks/useAccessibility';
import type { UserPreferences, UserMemory } from './types';
import { monitorAuthState, saveUserMemory, getUserMemory } from './services/firebase';
import { Header } from './components/layout/Header';
import { ContextPanel } from './components/layout/ContextPanel';
import { OnboardingWizard } from './features/onboarding/OnboardingWizard';
import { CompanionChat } from './features/companion/CompanionChat';
import { StadiumMap } from './features/navigation/StadiumMap';
import { Recommendations } from './features/recommendations/Recommendations';
import { LostFound } from './features/lostfound/LostFound';
import { EmergencySOS } from './features/emergency/EmergencySOS';
import { TestPanel } from './features/testing/TestPanel';
import { MessageSquare, Map, Landmark, Package, ClipboardList } from 'lucide-react';

export const App: React.FC = () => {
  useAccessibility();
  const [user, setUser] = useState<UserPreferences | null>(null);
  const [memory, setMemory] = useState<UserMemory | null>(null);
  
  // Navigation states
  const [activeTab, setActiveTab] = useState<'chat' | 'map' | 'recs' | 'lost' | 'test'>('chat');
  const [isContextOpen, setIsContextOpen] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);

  // Monitor auth state on load
  useEffect(() => {
    const unsubscribe = monitorAuthState(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Fetch saved user memory
        if (authUser.uid) {
          const savedMem = await getUserMemory(authUser.uid);
          if (savedMem) {
            setMemory(savedMem);
          } else {
            // Default initial memory if none exists
            const defaultMem: UserMemory = {
              language: 'en',
              accessibility: 'none',
              groupSize: 1,
              dietary: 'none',
              navigationStyle: 'standard',
              favoriteFoods: []
            };
            setMemory(defaultMem);
            await saveUserMemory(authUser.uid, defaultMem);
          }
        }
      } else {
        setUser(null);
        setMemory(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle completed onboarding
  const handleOnboardingComplete = async (onboardedUser: UserPreferences, initialMemory: UserMemory) => {
    setUser(onboardedUser);
    setMemory(initialMemory);
    if (onboardedUser.uid) {
      await saveUserMemory(onboardedUser.uid, initialMemory);
    }
  };

  // Handle manual preference adjustments
  const handleUpdateMemory = async (updatedFields: Partial<UserMemory>) => {
    if (!memory || !user) return;
    const updatedMemory = { ...memory, ...updatedFields };
    setMemory(updatedMemory);
    if (user.uid) {
      await saveUserMemory(user.uid, updatedMemory);
    }
  };

  const handleLogoutState = () => {
    setUser(null);
    setMemory(null);
  };

  // Render Onboarding if user not logged in or onboarded
  if (!user || !memory) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 font-sans transition-colors duration-200 overflow-hidden">
      
      {/* Persistent Header */}
      <Header
        user={user}
        memory={memory}
        onLogout={handleLogoutState}
        onTriggerSOS={() => setIsSOSOpen(true)}
        onToggleContextPanel={() => setIsContextOpen(true)}
        onChangeLanguage={(lang) => handleUpdateMemory({ language: lang })}
      />

      {/* Main Feature View Port */}
      <main className="flex-1 p-4 md:p-6 pb-24 overflow-x-hidden" role="main">
        {activeTab === 'chat' && (
          <CompanionChat 
            memory={memory} 
            onUpdateMemory={handleUpdateMemory} 
            userId={user.uid || 'guest'} 
          />
        )}
        {activeTab === 'map' && <StadiumMap memory={memory} />}
        {activeTab === 'recs' && <Recommendations memory={memory} />}
        {activeTab === 'lost' && <LostFound userId={user.uid || 'guest'} />}
        {activeTab === 'test' && <TestPanel />}
      </main>

      {/* Navigation Tab Bar */}
      <nav 
        className="w-full fixed bottom-0 left-0 bg-slate-900 border-t border-slate-800 p-2 flex items-center justify-around z-30 shadow-2xl"
        role="navigation"
        aria-label="Primary Application Navigation"
      >
        {[
          { key: 'chat', label: 'AI Companion', icon: <MessageSquare className="w-5 h-5" /> },
          { key: 'map', label: 'Route Map', icon: <Map className="w-5 h-5" /> },
          { key: 'recs', label: 'Explore Facilities', icon: <Landmark className="w-5 h-5" /> },
          { key: 'lost', label: 'Lost & Found', icon: <Package className="w-5 h-5" /> },
          { key: 'test', label: 'Verify/Test', icon: <ClipboardList className="w-5 h-5" /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all outline-none focus:ring-2 focus:ring-fifa-green ${
              activeTab === tab.key
                ? 'text-fifa-gold font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            aria-selected={activeTab === tab.key}
            role="tab"
          >
            {tab.icon}
            <span className="text-[10px] uppercase font-extrabold tracking-wider mt-1 hidden sm:inline">
              {tab.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Collapsible Context/Preferences Drawer */}
      <ContextPanel
        isOpen={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        memory={memory}
        onUpdateMemory={handleUpdateMemory}
        isGuest={user.isGuest}
      />

      {/* SOS Panel Overlay */}
      <EmergencySOS
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        accessibilityNeeds={memory.accessibility}
      />

    </div>
  );
};
export default App;
