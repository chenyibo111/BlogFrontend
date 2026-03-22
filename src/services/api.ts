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

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 10000; // 10 seconds

// Helper function for fetch with timeout
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Helper function to transform backend post to frontend Post type
function transformPost(backendPost: any): Post {
  return {
    ...backendPost,
    // Map categories array to single category string (use first category or default)
    category: backendPost.categories?.[0]?.name || 'Uncategorized',
    // Calculate read time from content (rough estimate: 200 words per minute)
    readTime: backendPost.content ? Math.max(1, Math.round(backendPost.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)) : 1,
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

  // Alias for backwards compatibility
  async getPostBySlug(id: number): Promise<Post> {
    return this.getPostById(id);
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
