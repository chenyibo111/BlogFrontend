import { useState, useCallback } from 'react';
import { managementApiService } from '../services/managementApi';
import type {
  CreatePostInput,
  UpdatePostInput,
  ImageOptions,
} from '../types/management';

// Posts
export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPost = useCallback(async (input: CreatePostInput) => {
    setLoading(true);
    setError(null);
    try {
      const post = await managementApiService.createPost(input);
      return post;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create post'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPost, loading, error };
}

export function useUpdatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePost = useCallback(async (input: UpdatePostInput) => {
    setLoading(true);
    setError(null);
    try {
      const post = await managementApiService.updatePost(input);
      return post;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update post'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePost, loading, error };
}

export function useDeletePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePost = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      await managementApiService.deletePost(String(id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete post'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deletePost, loading, error };
}

// Media Upload
export function useUploadImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadImage = useCallback(async (file: File, options?: ImageOptions) => {
    setLoading(true);
    setError(null);
    try {
      return await managementApiService.uploadImage(file, options);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload image'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { uploadImage, loading, error };
}
