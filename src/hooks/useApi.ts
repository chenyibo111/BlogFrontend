import { useState, useEffect, useCallback } from 'react';
import { api } from '../services';
import type {
  Post,
  GetPostsParams,
  PaginatedResponse,
  Category,
  Tag,
  Author,
  Comment,
  CreateCommentInput,
  SiteSettings,
  SubscribeInput,
  ArchiveYear,
} from '../types/api';

// Generic hook for async data fetching
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refresh };
}

// Posts hooks
export function usePosts(params?: GetPostsParams) {
  return useAsyncData<PaginatedResponse<Post>>(
    () => api.getPosts(params),
    [JSON.stringify(params)]
  );
}

export function usePostById(id: number | string) {
  return useAsyncData<Post>(() => api.getPostById(typeof id === 'string' ? parseInt(id) : id), [id]);
}

// Use slug directly instead of converting to number
export function usePostBySlug(slug: string) {
  return useAsyncData<Post>(() => api.getPostBySlug(slug), [slug]);
}

export function useRelatedPosts(postId: number, limit?: number) {
  return useAsyncData<Post[]>(
    () => api.getRelatedPosts(postId, limit),
    [postId, limit]
  );
}

// Categories hooks
export function useCategories() {
  return useAsyncData<Category[]>(() => api.getCategories(), []);
}

export function useCategoryBySlug(slug: string) {
  return useAsyncData<Category>(() => api.getCategoryBySlug(slug), [slug]);
}

// Tags hooks
export function useTags() {
  return useAsyncData<Tag[]>(() => api.getTags(), []);
}

// Authors hooks
export function useAuthors() {
  return useAsyncData<Author[]>(() => api.getAuthors(), []);
}

export function useAuthorById(id: string) {
  return useAsyncData<Author>(() => api.getAuthorById(id), [id]);
}

// Comments hooks
export function useCommentsByPost(postId: string) {
  return useAsyncData<Comment[]>(
    () => api.getCommentsByPost(postId),
    [postId]
  );
}

export function useCreateComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createComment = useCallback(async (input: CreateCommentInput) => {
    setLoading(true);
    setError(null);
    try {
      const comment = await api.createComment(input);
      return comment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create comment'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createComment, loading, error };
}

// Site settings hook
export function useSiteSettings() {
  return useAsyncData<SiteSettings>(() => api.getSiteSettings(), []);
}

// Newsletter subscription hook
export function useNewsletterSubscribe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const subscribe = useCallback(async (input: SubscribeInput) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.subscribe(input);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to subscribe'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { subscribe, loading, error, success };
}

// Search hook
export function useSearchPosts(query: string, params?: GetPostsParams) {
  return useAsyncData<PaginatedResponse<Post>>(
    () => api.searchPosts(query, params),
    [query, JSON.stringify(params)]
  );
}

// Archive hook
export function useArchive() {
  return useAsyncData<ArchiveYear[]>(() => api.getArchive(), []);
}
