import { useState, useRef, useEffect, useMemo } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreatePost, useUpdatePost, useUploadImage } from '../hooks/useManagement';
import { usePostBySlug } from '../hooks/useApi';
import { RichTextEditor } from '../components/RichTextEditor';
import { Button, Input, Textarea, showToast, ToastProvider } from '../components/ui';
import { getImageUrl } from '../utils/imageHelper';
import { SERVER_BASE_URL } from '../config/api';

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
}

export function WritePage() {
  const { slug: postSlug } = useParams<{ slug: string }>();
  const isEdit = !!postSlug;
  
  // Only fetch post data in edit mode
  const { data: existingPost, loading: loadingPost } = isEdit 
    ? usePostBySlug(postSlug)
    : { data: null, loading: false };
  
  const { createPost, loading: creating } = useCreatePost();
  const { updatePost, loading: updating } = useUpdatePost();
  const { uploadImage, loading: uploading } = useUploadImage();
  
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: undefined,
  });
  const [coverImagePreview, setCoverImagePreview] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute initial form data from existing post (for editing)
  const initialFormData = useMemo(() => {
    if (!existingPost || !isEdit) return null;
    return {
      title: existingPost.title,
      slug: existingPost.slug,
      excerpt: existingPost.excerpt || '',
      content: existingPost.content || '',
      coverImage: existingPost.coverImage || undefined,
    };
  }, [existingPost, isEdit]);

  // Initialize form data once when editing (using ref to prevent cascading renders)
  // This is intentional: we need to populate the form after data loads
  useEffect(() => {
    if (initialFormData && !initializedRef.current) {
      initializedRef.current = true;
      // Using queueMicrotask to defer state updates outside the effect
      // This avoids the cascading render warning while still updating the form
      queueMicrotask(() => {
        setFormData(initialFormData);
        if (existingPost?.coverImage) {
          setCoverImagePreview(getImageUrl(existingPost.coverImage));
        }
      });
    }
  }, [initialFormData, existingPost]);

  const handleSubmit = async (e: FormEvent | MouseEvent, status: 'DRAFT' | 'PUBLISHED' = 'PUBLISHED') => {
    if (e instanceof Event) {
      e.preventDefault();
    }
    
    if (!formData.title.trim()) {
      showToast.error('Please enter a title first');
      return;
    }
    
    setIsSubmitting(true);
    const toastId = showToast.loading(status === 'DRAFT' ? 'Saving draft...' : 'Publishing...');
    
    try {
      if (isEdit && existingPost) {
        // Update existing post - navigate to post detail page
        await updatePost({
          id: existingPost.id,
          ...formData,
          status,
        });
        showToast.dismiss(toastId);
        showToast.success(status === 'DRAFT' ? 'Draft updated!' : 'Post updated!');
        navigate(`/post/${existingPost.id}`);
      } else {
        // Create new post
        const newPost = await createPost({ ...formData, status });
        showToast.dismiss(toastId);
        showToast.success(status === 'DRAFT' ? 'Draft saved!' : 'Post published!');
        navigate(`/post/${newPost.id}`);
      }
    } catch (error) {
      showToast.dismiss(toastId);
      console.error('Failed to save post:', error);
      showToast.error('Failed to save post. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    handleSubmit(e, 'PUBLISHED');
  };

  const handleCoverImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showToast.error('Image size must be less than 10MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      showToast.error('Please select an image file');
      return;
    }

    try {
      const result = await uploadImage(file);
      const fullUrl = result.url.startsWith('http') ? result.url : `${SERVER_BASE_URL}${result.url}`;
      
      setFormData({ ...formData, coverImage: fullUrl });
      setCoverImagePreview(fullUrl);
      showToast.success('Image uploaded!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      showToast.error('Failed to upload image');
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData({ ...formData, slug });
  };

  const isLoading = (isEdit ? updating : creating) || uploading || isSubmitting;

  if (loadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low">
      <ToastProvider />
      
      {/* Header */}
      <header className="bg-white border-b border-outline-variant sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-serif font-bold text-primary">
            {isEdit ? 'Edit Post' : 'Write a Post'}
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
              variant="secondary"
              onClick={(e) => handleSubmit(e, 'DRAFT')}
              disabled={isLoading || !formData.title.trim()}
              isLoading={isLoading}
            >
              {isEdit ? 'Update Draft' : 'Save Draft'}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={(e) => handleSubmit(e, 'PUBLISHED')}
              disabled={isLoading || !formData.title.trim()}
              isLoading={isLoading}
            >
              {isEdit ? 'Update Post' : 'Publish'}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-8">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Title */}
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            onBlur={generateSlug}
            placeholder="Post title"
            className="text-4xl font-serif font-bold border-none focus:ring-0 px-0 placeholder:text-on-surface-variant/50"
            required
          />

          {/* Slug */}
          <Input
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="post-slug"
            className="text-sm border-b border-t-0 border-l-0 border-r-0 rounded-none focus:border-primary"
          />

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Cover Image
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-[21/9] bg-surface-container rounded-lg overflow-hidden cursor-pointer group"
            >
              {coverImagePreview ? (
                <img loading="lazy"
                  src={coverImagePreview}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                    <p className="text-sm">Click to upload cover image</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {coverImagePreview ? 'edit' : 'upload'}
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
          </div>

          {/* Excerpt */}
          <Textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="Brief description of your post..."
            rows={3}
            helperText="A short summary that appears in post listings"
          />

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2">
              Content
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Start writing your story..."
            />
            <p className="mt-2 text-xs text-on-surface-variant">
              Tip: Use the toolbar above to format your text, add images, links, and more.
            </p>
          </div>

        </form>
      </main>
    </div>
  );
}
