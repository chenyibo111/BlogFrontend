// Blog writing and management types
import type { Post, PaginationParams, PaginatedResponse } from './api';

export interface PostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  categoryId?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  seo?: SeoMetadata;
}

export interface SeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
}

export interface PostVersion {
  id: string;
  postId: string;
  title: string;
  content: string;
  version: number;
  createdAt: string;
  createdBy: string;
}

export type CreatePostInput = PostInput;

export interface UpdatePostInput extends Partial<PostInput> {
  id: number;
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface PostWithStats extends Post {
  stats: PostStats;
}

// Media/Upload types
export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface UploadResponse {
  file: MediaFile;
  url: string;
}

// Category management
export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

// Tag management
export interface CreateTagInput {
  name: string;
  slug?: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
  id: string;
}

// Admin/Management API Service
export interface ManagementApiService {
  // Posts
  createPost(input: CreatePostInput): Promise<Post>;
  updatePost(input: UpdatePostInput): Promise<Post>;
  deletePost(id: string): Promise<void>;
  publishPost(id: string): Promise<Post>;
  unpublishPost(id: string): Promise<Post>;
  getPostVersions(postId: string): Promise<PostVersion[]>;
  restoreVersion(versionId: string): Promise<Post>;
  
  // Media
  uploadFile(file: File, folder?: string): Promise<UploadResponse>;
  uploadImage(file: File, options?: ImageOptions): Promise<UploadResponse>;
  deleteMedia(id: string): Promise<void>;
  getMediaLibrary(params?: PaginationParams): Promise<PaginatedResponse<MediaFile>>;
  
  // Categories
  createCategory(input: CreateCategoryInput): Promise<Record<string, unknown>>;
  updateCategory(input: UpdateCategoryInput): Promise<Record<string, unknown>>;
  deleteCategory(id: string): Promise<void>;
  
  // Tags
  createTag(input: CreateTagInput): Promise<Record<string, unknown>>;
  updateTag(input: UpdateTagInput): Promise<Record<string, unknown>>;
  deleteTag(id: string): Promise<void>;
  
  // Stats
  getPostStats(postId: string): Promise<{ views: number; likes: number; comments: number; shares: number }>;
  getDashboardStats(): Promise<{
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalViews: number;
    totalUsers: number;
    recentPosts: Post[];
    popularPosts: PostWithStats[];
  }>;
}

export interface ImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  formats?: ('original' | 'webp' | 'avif')[];
}

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalUsers: number;
  recentPosts: Post[];
  popularPosts: PostWithStats[];
}

// Editor types
export interface EditorConfig {
  placeholder?: string;
  enableImageUpload?: boolean;
  enableLinkPreview?: boolean;
  enableTable?: boolean;
  enableCodeBlock?: boolean;
  enableHeading?: boolean;
  enableList?: boolean;
  enableBlockquote?: boolean;
  enableHorizontalRule?: boolean;
  enableHistory?: boolean;
}

export interface EditorInstance {
  getHTML(): string;
  getJSON(): Record<string, unknown>;
  getText(): string;
  setContent(content: string): void;
  clear(): void;
}