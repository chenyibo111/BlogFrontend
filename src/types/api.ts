// ==================== API Response Types ====================

// Base API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Pagination response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ==================== Domain Types ====================

// Blog post
export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author: Author;
  category: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readTime: number; // in minutes
  status: PostStatus;
}

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';

// Author
export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

// Category
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  postCount: number;
}

// Comment
export interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar?: string;
    email?: string;
  };
  content: string;
  createdAt: string;
  replies?: Comment[];
}

// Newsletter subscription
export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

// Site settings
export interface SiteSettings {
  title: string;
  description: string;
  logo?: string;
  favicon?: string;
  social: {
    twitter?: string;
    github?: string;
    rss?: string;
  };
  footer: {
    copyright: string;
    links: { label: string; href: string }[];
  };
}

// ==================== API Request/Response Types ====================

// Get posts params
export interface GetPostsParams extends PaginationParams {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  year?: number;
}

// Create/Update post
export interface CreatePostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  categoryId?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: number;
}

// Create comment
export interface CreateCommentInput {
  postId: string;
  content: string;
  authorName: string;
  authorEmail?: string;
  parentCommentId?: string;
}

// Subscribe to newsletter
export interface SubscribeInput {
  email: string;
}

// ==================== API Service Types ====================

// API Service interface
export interface ApiService {
  // Posts
  getPosts(params?: GetPostsParams): Promise<PaginatedResponse<Post>>;
  getPostById(id: number): Promise<Post>;
  getPostBySlug(id: number): Promise<Post>;  // Alias for backwards compatibility
  getRelatedPosts(postId: number, limit?: number): Promise<Post[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category>;
  
  // Authors
  getAuthors(): Promise<Author[]>;
  getAuthorById(id: string): Promise<Author>;
  
  // Comments
  getCommentsByPost(postId: string): Promise<Comment[]>;
  createComment(input: CreateCommentInput): Promise<Comment>;
  
  // Site
  getSiteSettings(): Promise<SiteSettings>;
  
  // Newsletter
  subscribe(input: SubscribeInput): Promise<void>;
  
  // Search
  searchPosts(query: string, params?: PaginationParams): Promise<PaginatedResponse<Post>>;
  
  // Archive (posts grouped by year)
  getArchive(): Promise<ArchiveYear[]>;
}

// Archive year structure
export interface ArchiveYear {
  year: number;
  posts: Post[];
  count: number;
}

// Home page data
export interface HomePageData {
  featuredPost: Post;
  recentPosts: Post[];
}

// About page data
export interface AboutPageData {
  author: Author;
  interests: InterestCategory[];
  currentlyReading: Book;
}

export interface InterestCategory {
  category: string;
  items: string[];
}

export interface Book {
  title: string;
  author: string;
  description: string;
  coverImage?: string;
}
