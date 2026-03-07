import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from './components/Auth';
import ChatUI from './components/ChatUI';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isResetMode, setIsResetMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'resetPassword') {
      setIsResetMode(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const Loader = () => (
    <div className="h-screen w-full bg-chat-dark flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-screen w-full bg-chat-dark">
      {(!user || isResetMode) ? <Auth onAuthSuccess={() => setIsResetMode(false)} /> : <ChatUI user={user} />}
    </div>
  );
}

export default App;
