// Blog post interface
export interface BlogPost {
  title: string;
  date: string;
  tags: string[];
  img?: string;
  excerpt?: string;
}

// Year section for archive page
export interface YearSection {
  year: string;
  entries: BlogPost[];
}

// Author interface
export interface Author {
  name: string;
  avatar: string;
}

// Article metadata
export interface ArticleMeta {
  category: string;
  readTime: string;
  author: Author;
  publishDate: string;
  imageUrl?: string;
  caption?: string;
}

// Navigation link
export interface NavItem {
  label: string;
  path: string;
}

// Footer link section
export interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

// Recent post for homepage
export interface RecentPost extends BlogPost {
  img: string;
}

// Featured article
export interface FeaturedArticle {
  title: string;
  excerpt: string;
  image: string;
}

// Related post
export interface RelatedPost {
  category: string;
  title: string;
  image: string;
}

// Interest category
export interface InterestCategory {
  category: string;
  items: string[];
}

// Currently reading
export interface CurrentlyReading {
  title: string;
  author: string;
  description: string;
}

// Site info
export interface SiteInfo {
  name: string;
  description: string;
  copyright: string;
}
