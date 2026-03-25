import type {
  ApiService,
  ApiResponse,
  PaginatedResponse,
  Post,
  GetPostsParams,
  PaginationParams,
  Category,
  Tag,
  Author,
  Comment,
  CreateCommentInput,
  SiteSettings,
  SubscribeInput,
  ArchiveYear,
} from '../types/api';

// ==================== Error Code Mapping (#49) ====================

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'INVALID_FILE_EXTENSION'
  | 'INVALID_PATH'
  | 'REQUEST_TIMEOUT'
  | 'UNKNOWN';

export interface ApiError {
  code: ErrorCode;
  message: string;
  status: number;
}

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  VALIDATION_ERROR: 'Please check your input and try again',
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  CONFLICT: 'This resource already exists',
  INTERNAL_ERROR: 'Something went wrong. Please try again later',
  FILE_TOO_LARGE: 'File size exceeds the limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  INVALID_FILE_EXTENSION: 'Invalid file extension',
  INVALID_PATH: 'Invalid file path',
  REQUEST_TIMEOUT: 'Request timed out. Please try again',
  UNKNOWN: 'An unexpected error occurred',
};

export function parseApiError(error: unknown): ApiError {
  // Handle fetch errors
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return { code: 'REQUEST_TIMEOUT', message: ERROR_MESSAGES.REQUEST_TIMEOUT, status: 408 };
    }
    if (error.message === 'Request timeout') {
      return { code: 'REQUEST_TIMEOUT', message: ERROR_MESSAGES.REQUEST_TIMEOUT, status: 408 };
    }
    return { code: 'UNKNOWN', message: error.message, status: 500 };
  }

  // Handle response errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const apiError = error as { code: string; message?: string; status?: number };
    const code = (apiError.code || 'UNKNOWN') as ErrorCode;
    return {
      code,
      message: apiError.message || ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN,
      status: apiError.status || 500,
    };
  }

  return { code: 'UNKNOWN', message: ERROR_MESSAGES.UNKNOWN, status: 500 };
}

// ==================== API Configuration ====================

import { API_BASE_URL, API_TIMEOUT } from '../config/api';

// Re-export for convenience
export { API_BASE_URL, API_TIMEOUT } from '../config/api';

// Helper function for fetch with timeout and error handling
async function fetchWithTimeout<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      const apiError: ApiError = {
        code: (errorData.error?.code || 'UNKNOWN') as ErrorCode,
        message: errorData.error?.message || ERROR_MESSAGES[(errorData.error?.code as ErrorCode)] || ERROR_MESSAGES.UNKNOWN,
        status: response.status,
      };

      throw apiError;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw parseApiError(error);
  }
}

// Helper function to transform backend post to frontend Post type
function transformPost(backendPost: any): Post {
  // Calculate read time from content (rough estimate: 200 words per minute)
  const wordCount = backendPost.content 
    ? backendPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length 
    : 0;
  
  return {
    ...backendPost,
    // Map categories array to single category string for display (first category)
    category: backendPost.categories?.[0]?.name || 'Uncategorized',
    // Calculate read time
    readTime: Math.max(1, Math.round(wordCount / 200)),
  };
}

// Real API implementation (for production)
export const realApiService: ApiService = {
  // Posts
  async getPosts(params?: GetPostsParams): Promise<PaginatedResponse<Post>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy || '');
    if (params?.order) searchParams.set('order', params.order || '');
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);

    // Get token from localStorage if available
    const token = localStorage.getItem('access_token');

    const response = await fetchWithTimeout<ApiResponse<PaginatedResponse<any>>>(
      `${API_BASE_URL}/posts?${searchParams.toString()}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    
    // Transform posts
    return {
      ...response.data,
      items: response.data.items.map(transformPost),
    };
  },

  async getPostById(id: number): Promise<Post> {
    // Get token from localStorage if available
    const token = localStorage.getItem('access_token');
    
    const response = await fetchWithTimeout<ApiResponse<any>>(
      `${API_BASE_URL}/posts/${id}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return transformPost(response.data);
  },

  async getPostBySlug(slug: string): Promise<Post> {
    // Get token from localStorage if available
    const token = localStorage.getItem('access_token');
    
    const response = await fetchWithTimeout<ApiResponse<any>>(
      `${API_BASE_URL}/posts/${slug}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    return transformPost(response.data);
  },

  async getRelatedPosts(_postId: number, limit = 3): Promise<Post[]> {
    const response = await fetchWithTimeout<ApiResponse<PaginatedResponse<any>>>(
      `${API_BASE_URL}/posts?limit=${limit}`
    );
    return (response.data.items || []).map(transformPost);
  },

  // Archive
  async getArchive(): Promise<ArchiveYear[]> {
    // Get token from localStorage if available
    const token = localStorage.getItem('access_token');
    
    const response = await fetchWithTimeout<ApiResponse<ArchiveYear[]>>(
      `${API_BASE_URL}/posts/archive`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    
    // Transform posts in each year
    return response.data.map((year: ArchiveYear) => ({
      ...year,
      posts: year.posts.map(transformPost),
    }));
  },

  // Categories - placeholder
  async getCategories(): Promise<Category[]> {
    return [];
  },

  async getCategoryBySlug(_slug: string): Promise<Category> {
    throw new Error('Not implemented');
  },

  // Tags - placeholder
  async getTags(): Promise<Tag[]> {
    return [];
  },

  // Authors - get from posts
  async getAuthors(): Promise<Author[]> {
    return [];
  },

  async getAuthorById(_id: string): Promise<Author> {
    throw new Error('Not implemented');
  },

  // Comments - placeholder
  async getCommentsByPost(_postId: string): Promise<Comment[]> {
    return [];
  },

  async createComment(_input: CreateCommentInput): Promise<Comment> {
    void _input; // Explicitly acknowledge unused param
    throw new Error('Not implemented');
  },

  // Site settings - placeholder
  async getSiteSettings(): Promise<SiteSettings> {
    return {
      title: 'The Silent Curator',
      description: 'A minimal blog',
      social: {},
      footer: { copyright: '© 2024', links: [] },
    };
  },

  // Newsletter - placeholder
  async subscribe(_input: SubscribeInput): Promise<void> {
    void _input; // Explicitly acknowledge unused param
    throw new Error('Not implemented');
  },

  // Search - use posts endpoint
  async searchPosts(query: string, params?: PaginationParams): Promise<PaginatedResponse<Post>> {
    return this.getPosts({ ...params, search: query });
  },
};
