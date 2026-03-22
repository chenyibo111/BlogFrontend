import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Textarea, showToast, ToastProvider } from '../components/ui';
import { getImageUrl } from '../utils/imageHelper';

export function ProfilePage() {
  const { user, updateProfile, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast.error('Avatar size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast.error('Please select an image file');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, avatar: data.data.url }));
        showToast.success('Avatar updated!');
      } else {
        showToast.error(data.error?.message || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      showToast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar,
      });
      showToast.success('Profile updated!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      <ToastProvider />
      
      {/* Header */}
      <header className="bg-white border-b border-outline-variant">
        <div className="max-w-3xl mx-auto px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-serif font-bold text-primary">
            Profile Settings
          </h1>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Profile Picture</h2>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
                  {formData.avatar ? (
                    <img
                      src={getImageUrl(formData.avatar)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-3xl font-bold text-on-surface-variant">
                      {formData.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-primary text-on-primary rounded-full hover:opacity-90 transition-opacity"
                  title="Change avatar"
                >
                  <span className="material-symbols-outlined text-sm">camera_alt</span>
                </button>
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-on-surface mb-2">
                  Upload a profile picture. Recommended size: 400x400px.
                </p>
                <p className="text-xs text-on-surface-variant">
                  Accepted formats: JPEG, PNG, GIF, WebP. Max size: 5MB.
                </p>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            
            {isUploading && (
              <div className="mt-4 text-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                Uploading...
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                leftIcon={
                  <span className="material-symbols-outlined text-sm">person</span>
                }
              />

              <Input
                label="Email"
                type="email"
                value={user?.email || ''}
                disabled
                placeholder="Your email"
                leftIcon={
                  <span className="material-symbols-outlined text-sm">mail</span>
                }
                helperText="Email cannot be changed"
              />

              <Textarea
                label="Bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                helperText="Brief description for your profile"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving || isLoading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
