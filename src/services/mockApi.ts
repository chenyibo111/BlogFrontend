import type {
  ApiService,
  PaginatedResponse,
  Post,
  GetPostsParams,
  Category,
  Tag,
  Author,
  Comment,
  CreateCommentInput,
  SiteSettings,
  SubscribeInput,
  ArchiveYear,
} from '../types/api';

// Mock data
const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Elias Thorne',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaMLomqb_zR9AVBjxwFiCx-MIekBThBQFNHlI6tUf9jF3TojBNSOsGVzcfDJc6wcTeZ6mPhu2811qlR7qCKrv6hR8Bf3n77L4GxHEBW9PMeNzfZbyjaitcQLiyzE6uNU1XYjRfzWvYb3E8aggDIcNI4gCxCoaOITLGeybk1BZbT1IAp-MPAL6X2nWRx57guPbZ_0ubBbH39HuEz54sk5J_iRwVGYJ1uterEuIS-rub4mFG1S_fkX88MmYidvCq0yrGD2wSFspl6hDH',
    bio: 'Designer and writer focused on minimal aesthetics.',
    social: {
      twitter: '@eliasthorne',
      website: 'https://eliasthorne.com',
    },
  },
];

const mockCategories: Category[] = [
  { id: '1', slug: 'design', name: 'Design', description: 'Design thoughts and tutorials', postCount: 12 },
  { id: '2', slug: 'philosophy', name: 'Philosophy', description: 'Philosophical reflections', postCount: 8 },
  { id: '3', slug: 'technology', name: 'Technology', description: 'Tech insights', postCount: 6 },
  { id: '4', slug: 'photography', name: 'Photography', description: 'Visual storytelling', postCount: 4 },
];

const mockTags: Tag[] = [
  { id: '1', slug: 'minimalism', name: 'Minimalism', postCount: 10 },
  { id: '2', slug: 'ux-theory', name: 'UX Theory', postCount: 5 },
  { id: '3', slug: 'type-design', name: 'Type Design', postCount: 3 },
  { id: '4', slug: 'digital-wellbeing', name: 'Digital Wellbeing', postCount: 4 },
];

const mockPosts: Post[] = [
  {
    id: 1,
    slug: 'architecture-of-silence',
    title: 'The Architecture of Silence',
    excerpt: 'Exploring how negative space in digital interfaces can enhance user cognitive performance and emotional well-being.',
    content: 'Full article content here...',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiXhVcucyPsaXuVbFrQlGNKohN2cNTa6PJynarWSuRDcYxNK0T7F_-YKPYOO70R1EN-bfhWkH5x_R3M_mMU7TJInDuBleohDcsge7D35vez1xpwq4Sz6-ACvZmuvz4daGgj5HMxvyw_KvN2aT3YabaiKWrcWF6tMpudp3en9RigERXnJSwtuyi1w-pCZs8CzoakoZvdyxAkwn0mlvZkVxdbHu02fddbIqwW5b69enQbN9wfAdoVgKfA--sh1sdpRc2I9JsOmJo_DQB',
    author: mockAuthors[0],
    category: 'Design',
    tags: ['Design', 'Philosophy'],
    publishedAt: '2024-03-12T00:00:00Z',
    createdAt: '2024-03-12T00:00:00Z',
    updatedAt: '2024-03-12T00:00:00Z',
    readTime: 8,
    status: 'published',
  },
  {
    id: 2,
    slug: 'ink-of-intention',
    title: 'The Ink of Intention',
    excerpt: 'A practical framework for reclaiming your focus and curating your digital consumption.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZGTQs9BPqhcJrDd-HV3RXHSZJtCE0lzHnkPJphyahPsbl3W-kCB5-LAGrfcF64-toFzqAjyHdbYMt1b6tUh1dy6vml1wu_XAR2Af43Wgg_K6LHNqnZit5uB3V1iXBnrANRRT9_dLt1dmk6na8Be6sYBGJ4vQvFa_LDS6DyoMBwWpuJda3YeT7PhXNe0zlrgZuTcNYqEmTf-LlFen424qdW_D0zLmMJbTqh-d2DM6o1m-zPMrrdlS0eTFfVv3ejeKBDbhAudgP0tDa',
    author: mockAuthors[0],
    category: 'Design',
    tags: ['Design', 'Philosophy'],
    publishedAt: '2024-10-24T00:00:00Z',
    createdAt: '2024-10-24T00:00:00Z',
    updatedAt: '2024-10-24T00:00:00Z',
    readTime: 6,
    status: 'published',
  },
  {
    id: 3,
    slug: 'shadow-and-light',
    title: 'Shadow & Light',
    excerpt: 'Understanding the delicate balance between light and shadow in visual storytelling.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDIa4Rlz0DAFKNyPoOS5U1AhUusJAaBZ_AitL40Az0oD4AA1P9Y0VxFhzPsedC1esmm0ftks6xvX1Mz6_Pt6WD72Bzlu2INPtw6Q4wuhXcTcimk--zMi8XKOdtJ8LdlEbuZKrUiVxp3xN56N6Xj1kEAqQ14ETr11P5XsO3JrxobYZHhx4y-2lTAh59R1APh_Uw8IU77_TdbkLNysxLyEOmRigXUR6tPmSy5kkjqeR59kQugMXqMdLB6mWVrzyUHD-Aw9jkdKytCaaz',
    author: mockAuthors[0],
    category: 'Photography',
    tags: ['Photography', 'Art'],
    publishedAt: '2024-10-18T00:00:00Z',
    createdAt: '2024-10-18T00:00:00Z',
    updatedAt: '2024-10-18T00:00:00Z',
    readTime: 5,
    status: 'published',
  },
  {
    id: 4,
    slug: 'digital-minimalism',
    title: 'Digital Minimalism',
    excerpt: 'A practical framework for reclaiming your focus and curating your digital consumption.',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB52QORQ4DZqackM5_O2kT2NOAAJNmtFDESO-R2S0Vi2sHVNrG2mXEojB-k0hXLIDEzKqiSAum6163sUezoMJ0y9F3aeAPlea6_r8A0KcI54TGhyE3DEg0Zg15sfrlI48Ou2raLzrdLagnWjnjeuQ_joObIn0wsifYzM_JSJd28NMlZlXZ9gtdzURPSM_DWwZ0G7jMntmzDFQriralyUZ9F28OzTSkmzCSDNq1VQkqnanirmqH6DYeSqHjhP9JKR9P8XGVix9KoQEBt',
    author: mockAuthors[0],
    category: 'Technology',
    tags: ['Technology', 'Lifestyle'],
    publishedAt: '2024-10-05T00:00:00Z',
    createdAt: '2024-10-05T00:00:00Z',
    updatedAt: '2024-10-05T00:00:00Z',
    readTime: 7,
    status: 'published',
  },
];

const mockSiteSettings: SiteSettings = {
  title: 'The Silent Curator',
  description: 'An editorial exploration of design, architecture, and the intentional lifestyle.',
  social: {
    twitter: '@silentcurator',
    rss: '/rss.xml',
  },
  footer: {
    copyright: '© 2024 The Silent Curator. Built with intentionality.',
    links: [
      { label: 'Archive', href: '/archive' },
      { label: 'Newsletter', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
};

const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: { name: 'Jane Doe', avatar: '' },
    content: 'Great article! Really made me think about design differently.',
    createdAt: '2024-03-13T10:00:00Z',
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service (for development)
export const mockApiService: ApiService = {
  async getPosts(params?: GetPostsParams): Promise<PaginatedResponse<Post>> {
    await delay(300);
    
    let filtered = [...mockPosts];
    
    if (params?.category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.tag) {
      filtered = filtered.filter(p => p.tags.some(t => t.toLowerCase().includes(params.tag!.toLowerCase())));
    }
    if (params?.year) {
      filtered = filtered.filter(p => new Date(p.publishedAt).getFullYear() === params.year);
    }
    if (params?.search) {
      const query = params.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.excerpt?.toLowerCase().includes(query)
      );
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      items: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  async getPostBySlug(id: number): Promise<Post> {
    return this.getPostById(id);
  },

  async getPostById(id: number): Promise<Post> {
    await delay(200);
    const post = mockPosts.find(p => p.id === id);
    if (!post) throw new Error('Post not found');
    return post;
  },

  async getRelatedPosts(postId: number, limit: number = 3): Promise<Post[]> {
    await delay(200);
    return mockPosts.filter(p => p.id !== postId).slice(0, limit);
  },

  async getCategories(): Promise<Category[]> {
    await delay(100);
    return mockCategories;
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    await delay(100);
    const category = mockCategories.find(c => c.slug === slug);
    if (!category) throw new Error('Category not found');
    return category;
  },

  async getTags(): Promise<Tag[]> {
    await delay(100);
    return mockTags;
  },

  async getAuthors(): Promise<Author[]> {
    await delay(100);
    return mockAuthors;
  },

  async getAuthorById(id: string): Promise<Author> {
    await delay(100);
    const author = mockAuthors.find(a => a.id === id);
    if (!author) throw new Error('Author not found');
    return author;
  },

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    await delay(100);
    return mockComments.filter(c => c.postId === postId);
  },

  async createComment(input: CreateCommentInput): Promise<Comment> {
    await delay(200);
    const newComment: Comment = {
      id: String(Date.now()),
      postId: input.postId,
      author: {
        name: input.authorName,
        email: input.authorEmail,
      },
      content: input.content,
      createdAt: new Date().toISOString(),
    };
    mockComments.push(newComment);
    return newComment;
  },

  async getSiteSettings(): Promise<SiteSettings> {
    await delay(100);
    return mockSiteSettings;
  },

  async subscribe(input: SubscribeInput): Promise<void> {
    await delay(300);
    console.log('Mock subscription:', input.email);
  },

  async searchPosts(query: string, params?: GetPostsParams): Promise<PaginatedResponse<Post>> {
    return this.getPosts({ ...params, search: query });
  },

  async getArchive(): Promise<ArchiveYear[]> {
    await delay(200);
    const postsByYear = mockPosts.reduce((acc, post) => {
      const year = new Date(post.publishedAt).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    }, {} as Record<number, Post[]>);

    return Object.entries(postsByYear)
      .map(([year, posts]) => ({
        year: Number(year),
        posts,
        count: posts.length,
      }))
      .sort((a, b) => b.year - a.year);
  },
};
