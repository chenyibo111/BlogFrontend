import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { getImageUrl } from '../utils/imageHelper';

export function HomePage() {
  const { data: postsData, loading, error } = usePosts({ limit: 3 });
  const { isAuthenticated } = useAuth();

  if (loading) {
    return (
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-on-surface-variant">Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-error">Error loading posts: {error.message}</p>
        </div>
      </main>
    );
  }

  const recentPosts = postsData?.items || [];
  const featuredPost = recentPosts[0];

  return (
    <main className="pt-32 pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 mb-32">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-start-3 md:col-span-8">
            <h1 className="text-5xl md:text-7xl font-black text-primary leading-[1.1] tracking-tight mb-8">
              Hello, I'm a writer and designer focused on minimal aesthetics.
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              Through the lens of intentional design and editorial curation, I explore the quiet spaces where form meets function. Welcome to my digital gallery of thoughts.
            </p>
            
            {/* Write Button - Prominent CTA */}
            <div className="mt-8 flex items-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/write"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined">edit</span>
                  Start Writing
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                >
                  <span className="material-symbols-outlined">login</span>
                  Sign In to Write
                </Link>
              )}
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-container-high transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 aspect-[4/3] bg-surface-container overflow-hidden group relative">
              {featuredPost.coverImage ? (
                <img
                  alt="Featured article"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={getImageUrl(featuredPost.coverImage)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="material-symbols-outlined text-9xl text-on-surface-variant absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">image</span>';
                  }}
                />
              ) : (
                <span className="material-symbols-outlined text-9xl text-on-surface-variant absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">image</span>
              )}
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 font-label">
                Feature Story
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-body">
                {featuredPost.excerpt}
              </p>
              <div>
                <Link
                  to={`/post/${featuredPost.id}`}
                  className="inline-flex items-center text-primary font-semibold border-b-2 border-primary pb-1 group"
                >
                  Read the article
                  <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12">
          <h3 className="text-3xl font-bold text-primary">Recent Musings</h3>
          <Link
            to="/archive"
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold tracking-wide"
          >
            View Archive
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="bg-surface-container-lowest p-8 flex flex-col transition-all duration-300 hover:bg-surface-bright shadow-[0_20px_40px_rgba(0,25,21,0.02)]"
            >
              <div className="aspect-square bg-surface-container-low mb-6 overflow-hidden">
                {post.coverImage ? (
                  <img
                    alt="Post visual"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    src={getImageUrl(post.coverImage)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="material-symbols-outlined text-6xl text-on-surface-variant">image</span>';
                    }}
                  />
                ) : (
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant">image</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <time className="text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
                  {post.publishedAt 
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : new Date(post.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                  }
                </time>
                {post.status === 'DRAFT' && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-bold rounded">
                    Draft
                  </span>
                )}
              </div>
              <h4 className="text-xl font-bold text-primary mb-4 leading-snug">
                {post.title}
              </h4>
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-6">
                {post.excerpt}
              </p>
              <Link
                to={`/post/${post.id}`}
                className="mt-auto text-primary text-xs font-bold tracking-widest uppercase flex items-center group"
              >
                Read More
                <span className="material-symbols-outlined text-sm ml-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                  chevron_right
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
