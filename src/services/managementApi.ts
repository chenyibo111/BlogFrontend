import type {
  Post,
  UpdatePostInput,
} from '../types/api';
import type {
  CreatePostInput,
  UploadResponse,
  ManagementApiService,
} from '../types/management';
import { tokenStorage, authApiService } from './authApi';
import { API_BASE_URL } from '../config/api';

// Fetch wrapper with auth and token refresh
async function fetchWithAuth(url: string, options?: RequestInit, retry = true): Promise<Response> {
  const token = tokenStorage.getAccessToken();
  
  // Don't set Content-Type for FormData (let browser set it for multipart)
  const isFormData = options?.body instanceof FormData;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  
  // Handle 401 - try to refresh token once
  if (response.status === 401 && retry) {
    const refreshToken = tokenStorage.getRefreshToken();
    
    if (refreshToken) {
      try {
        // Try to refresh the token
        const newTokens = await authApiService.refreshToken();
        
        // Retry the original request with new token
        return await fetch(url, {
          ...options,
          headers: {
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
            Authorization: `Bearer ${newTokens.accessToken}`,
            ...options?.headers,
          },
        });
      } catch {
        // Refresh failed, clear tokens and redirect to login
        tokenStorage.clearTokens();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    } else {
      // No refresh token, redirect to login
      tokenStorage.clearTokens();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
  }
  
  return response;
}

// Mock data
const mockPosts: Post[] = [
  {
    id: 1,
    slug: 'architecture-of-silence',
    title: 'The Architecture of Silence',
    excerpt: 'Exploring how negative space enhances user experience.',
    content: '<p>Full article content...</p>',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiXhVcucyPsaXuVbFrQlGNKohN2cNTa6PJynarWSuRDcYxNK0T7F_-YKPYOO70R1EN-bfhWkH5x_R3M_mMU7TJInDuBleohDcsge7D35vez1xpwq4Sz6-ACvZmuvz4daGgj5HMxvyw_KvN2aT3YabaiKWrcWF6tMpudp3en9RigERXnJSwtuyi1w-pCZs8CzoakoZvdyxAkwn0mlvZkVxdbHu02fddbIqwW5b69enQbN9wfAdoVgKfA--sh1sdpRc2I9JsOmJo_DQB',
    author: { id: '1', name: 'Elias Thorne', avatar: '' },
    authorId: '1',
    categories: [],
    views: 100,
    publishedAt: '2024-03-12T00:00:00Z',
    createdAt: '2024-03-12T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
    status: 'PUBLISHED',
    category: 'Design',
    readTime: 8,
  },
];

// Helper for placeholder methods
const emptyPost = {} as Post;
const emptyUploadResponse = {} as UploadResponse;
const emptyMediaResponse = { items: [], total: 0, page: 1, limit: 20, totalPages: 0 };

// Mock management service (simplified for writing only)
export const mockManagementApiService: ManagementApiService = {
  async createPost(input: CreatePostInput): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newPost: Post = {
      id: mockPosts.length > 0 ? Math.max(...mockPosts.map(p => p.id)) + 1 : 1,
      slug: input.slug || input.title.toLowerCase().replace(/\s+/g, '-'),
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage,
      author: { id: '1', name: 'Elias Thorne', avatar: '' },
      authorId: '1',
      categories: [],
      views: 0,
      publishedAt: input.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: input.status || 'DRAFT',
      category: 'Uncategorized',
      readTime: Math.ceil(input.content.length / 1000) || 5,
    };
    
    mockPosts.unshift(newPost);
    return newPost;
  },
  
  async updatePost(input: UpdatePostInput): Promise<Post> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockPosts.findIndex(p => p.id === input.id);
    if (index === -1) throw new Error('Post not found');
    
    const currentPost = mockPosts[index];
    const updated: Post = {
      ...currentPost,
      ...input,
      status: input.status || currentPost.status,
      updatedAt: new Date().toISOString(),
    };
    
    mockPosts[index] = updated;
    return updated;
  },
  
  async uploadImage(file: File): Promise<UploadResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock upload - create object URL for preview
    const url = URL.createObjectURL(file);
    
    return {
      file: {
        id: String(Date.now()),
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        uploadedBy: '1',
        createdAt: new Date().toISOString(),
      },
      url,
    };
  },
  
  // Placeholder methods to satisfy interface
  deletePost: async () => {},
  publishPost: async () => mockPosts[0],
  unpublishPost: async () => mockPosts[0],
  getPostVersions: async () => [],
  restoreVersion: async () => mockPosts[0],
  uploadFile: async () => emptyUploadResponse,
  deleteMedia: async () => {},
  getMediaLibrary: async () => emptyMediaResponse,
  createCategory: async () => ({}),
  updateCategory: async () => ({}),
  deleteCategory: async () => {},
  createTag: async () => ({}),
  updateTag: async () => ({}),
  deleteTag: async () => {},
  getPostStats: async () => ({ views: 0, likes: 0, comments: 0, shares: 0 }),
  getDashboardStats: async () => ({ totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalViews: 0, totalUsers: 0, recentPosts: [], popularPosts: [] }),
};

// Real management API service (for production)
export const realManagementApiService: ManagementApiService = {
  async createPost(input: CreatePostInput): Promise<Post> {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await response.json();
    return data.data;
  },
  
  async updatePost(input: UpdatePostInput): Promise<Post> {
    const response = await fetchWithAuth(`${API_BASE_URL}/posts/${input.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await response.json();
    return data.data;
  },
  
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetchWithAuth(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.data;
  },
  
  // Placeholder methods
  deletePost: async () => {},
  publishPost: async () => emptyPost,
  unpublishPost: async () => emptyPost,
  getPostVersions: async () => [],
  restoreVersion: async () => emptyPost,
  uploadFile: async () => emptyUploadResponse,
  deleteMedia: async () => {},
  getMediaLibrary: async () => emptyMediaResponse,
  createCategory: async () => ({}),
  updateCategory: async () => ({}),
  deleteCategory: async () => {},
  createTag: async () => ({}),
  updateTag: async () => ({}),
  deleteTag: async () => {},
  getPostStats: async () => ({ views: 0, likes: 0, comments: 0, shares: 0 }),
  getDashboardStats: async () => ({ totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalViews: 0, totalUsers: 0, recentPosts: [], popularPosts: [] }),
};

// Export (switch between mock and real)
// export const managementApiService = mockManagementApiService;
export const managementApiService = realManagementApiService;