import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const Auth = ({ onAuthSuccess }) => {
  const [view, setView] = useState('login'); // 'login', 'signup', 'forgot_password', 'reset_password'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [oobCode, setOobCode] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    // Check URL. Firebase might pass ?mode=resetPassword&oobCode=...
    const queryParams = new URLSearchParams(window.location.search);
    const mode = queryParams.get('mode');
    const code = queryParams.get('oobCode');
    
    if (mode === 'resetPassword' && code) {
      setOobCode(code);
      setView('reset_password');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (view === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        onAuthSuccess();
      } 
      else if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess();
      }
      else if (view === 'forgot_password') {
        await sendPasswordResetEmail(auth, email, {
          url: `${window.location.origin}/?mode=resetPassword`
        });
        setSuccess('Password reset link has been sent to your email! (Please check your inbox or spam folder)');
        setEmail(''); // clear email to prevent accidental resends
      }
      else if (view === 'reset_password') {
        await confirmPasswordReset(auth, oobCode, newPassword);
        setSuccess('Password successfully reset! You can now log in with your new password.');
        setView('login');
        setNewPassword('');
        // Clean up URL parameters to prevent re-triggering reset view
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      let friendlyError = err.message;
      switch (err.code) {
        case 'auth/email-already-in-use':
          friendlyError = 'This email is already associated with an account. Try logging in.';
          break;
        case 'auth/user-not-found':
          friendlyError = 'No user found securely matched with this email.';
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          friendlyError = 'Incorrect email or password.';
          break;
        case 'auth/weak-password':
          friendlyError = 'Password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-action-code':
        case 'auth/expired-action-code':
          friendlyError = 'The password reset link is invalid or has expired. Please request a new one.';
          break;
        case 'auth/invalid-email':
          friendlyError = 'Please provide a valid email address.';
          break;
        default:
          friendlyError = err.message;
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onAuthSuccess();
    } catch (err) {
      let friendlyError = err.message;
      if (err.code === 'auth/popup-closed-by-user') {
        friendlyError = 'Google sign-in was cancelled.';
      }
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-chat-dark text-white p-4">
      <div className="w-full max-w-md bg-chat-darker p-8 rounded-xl shadow-lg border border-gray-600 transition-all">
        
        <h2 className="text-3xl font-bold mb-2 text-center text-white">
          {view === 'login' && 'Welcome Back'}
          {view === 'signup' && 'Create Account'}
          {view === 'forgot_password' && 'Forgot Password'}
          {view === 'reset_password' && 'Reset Password'}
        </h2>
        
        <p className="text-gray-400 text-sm text-center mb-6">
          {view === 'login' && 'Log in to securely access your AI Chatbot.'}
          {view === 'signup' && 'Sign up to safely build your own AI workspace.'}
          {view === 'forgot_password' && 'Enter your email below to receive a secure reset link.'}
          {view === 'reset_password' && 'Please enter a strong new password for your account.'}
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm transition-opacity">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg text-sm transition-opacity">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email field (hidden only in reset_password) */}
          {view !== 'reset_password' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-chat-dark border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors"
                placeholder="Secure email format (e.g. at@domain.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {/* Name field (signup only) */}
          {view === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-chat-dark border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Password field (login and signup) */}
          {(view === 'login' || view === 'signup') && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 pr-10 bg-chat-dark border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors"
                  placeholder="Must be at least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* New Password field (reset_password only) */}
          {view === 'reset_password' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="w-full px-4 py-2 pr-10 bg-chat-dark border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-gray-400 transition-colors"
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Processing...' : (
              view === 'login' ? 'Login' : 
              view === 'signup' ? 'Create Account' : 
              view === 'forgot_password' ? 'Send Reset Link' : 
              'Update Password'
            )}
          </button>
        </form>

        {(view === 'login' || view === 'signup') && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-sm text-gray-400">OR</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        <div className="mt-6 text-center space-y-2">
          {view === 'login' && (
            <>
              <p className="text-gray-400 text-sm">
                Don't have an account? {' '}
                <button
                  onClick={() => { setView('signup'); setError(''); setSuccess(''); }}
                  className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
              <p className="text-gray-400 text-sm">
                Forgot your password? {' '}
                <button
                  onClick={() => { setView('forgot_password'); setError(''); setSuccess(''); }}
                  className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                >
                  Reset here
                </button>
              </p>
            </>
          )}

          {(view === 'signup' || view === 'forgot_password' || view === 'reset_password') && (
            <p className="text-gray-400 text-sm">
              Back to {' '}
              <button
                onClick={() => { 
                  setView('login'); 
                  setError(''); 
                  setSuccess('');
                  if (view === 'reset_password') {
                     window.history.replaceState({}, document.title, window.location.pathname);
                  }
                }}
                className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
