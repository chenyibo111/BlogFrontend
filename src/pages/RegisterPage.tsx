import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, ToastProvider, showToast } from '../components/ui';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password) {
      showToast.error('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      showToast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      await register({ email, password, name });
      showToast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      showToast.error('Failed to create account. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-4">
      <ToastProvider />
      
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif font-black text-primary">
              The Silent Curator
            </h1>
          </Link>
          <p className="mt-2 text-sm text-on-surface-variant">
            Create your account
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-[0_20px_40px_rgba(0,25,21,0.04)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              leftIcon={
                <span className="material-symbols-outlined text-sm">person</span>
              }
            />

            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              leftIcon={
                <span className="material-symbols-outlined text-sm">mail</span>
              }
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
              helperText="At least 6 characters"
            />

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
