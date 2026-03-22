import { Link, useParams, useNavigate } from 'react-router-dom';
import { usePostById, useRelatedPosts } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { getImageUrl } from '../utils/imageHelper';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Parse ID - could be numeric ID or slug
  const numericId = id && !isNaN(Number(id)) ? Number(id) : null;
  const slugId = id && isNaN(Number(id)) ? id : null;
  
  const { data: post, loading, error } = usePostById(id || '0');
  const { data: relatedPosts } = useRelatedPosts(post?.id || 0, 2);

  const isAuthor = user && post && user.id === post.author.id;

  if (loading) {
    return (
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-on-surface-variant">Loading article...</p>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-error">Article not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-32 pb-24">
      {/* Article Header */}
      <header className="max-w-7xl mx-auto px-8 mb-16">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-start-3 md:col-span-8">
            {/* Edit Button - Only shown to author */}
            {isAuthor && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => navigate(`/write/${post.id}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-colors text-sm font-medium"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit Post
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 mb-6">
              <span className="text-primary font-label text-xs uppercase tracking-[0.2em]">
                {post.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant/40"></span>
              <span className="text-primary font-label text-xs uppercase tracking-[0.2em]">
                {post.readTime} Min Read
              </span>
              {post.status === 'DRAFT' && (
                <>
                  <span className="w-1 h-1 rounded-full bg-outline-variant/40"></span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs uppercase tracking-wider font-bold rounded">
                    Draft
                  </span>
                </>
              )}
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-black text-primary leading-[1.1] tracking-tighter mb-8">
              {post.title}
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-4 text-on-surface-variant font-body">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                  <img
                    alt="Author"
                    className="w-full h-full object-cover"
                    src={post.author.avatar}
                  />
                </div>
                <span className="font-semibold text-on-surface">{post.author.name}</span>
              </div>
              <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-outline-variant/40"></span>
              <time dateTime={post.publishedAt || post.createdAt}>
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
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <section className="max-w-7xl mx-auto px-8 mb-24">
        <div className="aspect-[21/9] w-full rounded-lg overflow-hidden bg-surface-container-high relative">
          {post.coverImage ? (
            <img
              alt={post.title}
              className="w-full h-full object-cover"
              src={getImageUrl(post.coverImage)}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="material-symbols-outlined text-9xl text-on-surface-variant absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">image</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-start-3 md:col-span-8">
            {/* Render article content as HTML */}
            <div 
              className="prose prose-emerald max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="mt-32 bg-surface-container-low py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-label text-xs uppercase tracking-[0.3em] text-primary/60">
                Explore more
              </span>
              <h2 className="font-headline text-4xl font-black text-primary tracking-tighter mt-2">
                Continue Reading
              </h2>
            </div>
            <Link
              to="/archive"
              className="hidden md:flex items-center gap-2 font-label text-xs uppercase tracking-widest text-primary border-b-2 border-primary/20 hover:border-primary pb-1 transition-all"
            >
              View Archive
              <span className="material-symbols-outlined text-sm">north_east</span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {relatedPosts?.map((relatedPost) => (
              <div key={relatedPost.id} className="group cursor-pointer">
                <Link to={`/post/${relatedPost.id}`}>
                  <div className="aspect-[16/10] overflow-hidden rounded-lg bg-surface-container mb-6 relative">
                    {relatedPost.coverImage ? (
                      <img
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        src={getImageUrl(relatedPost.coverImage)}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = '<span class="material-symbols-outlined text-6xl text-on-surface-variant absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">image</span>';
                        }}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-6xl text-on-surface-variant absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">image</span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <span className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                      {relatedPost.category}
                    </span>
                    <h3 className="font-headline text-2xl font-bold text-primary">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
