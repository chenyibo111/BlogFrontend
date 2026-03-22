import { Link } from 'react-router-dom';
import { useArchive } from '../hooks/useApi';

export function ArchivePage() {
  const { data: archiveData, loading, error } = useArchive();

  if (loading) {
    return (
      <main className="pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-on-surface-variant">Loading...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-error">Error loading archive: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-8 editorial-grid">
        <header className="col-start-1 col-span-12 md:col-start-3 md:col-span-8 mb-24">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-on-primary-container mb-4 block">
            Collection
          </span>
          <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-primary">
            Writing
          </h1>
          <p className="mt-8 font-body text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            An intentional repository of thoughts on design, philosophy, and the quiet pursuit of digital excellence.
          </p>
        </header>

        <div className="col-start-1 col-span-12 md:col-start-3 md:col-span-9 space-y-24">
          {archiveData?.map((section) => (
            <section key={section.year} className="flex flex-col md:flex-row gap-8 md:gap-24">
              <div className="md:w-32 shrink-0">
                <h2 className="font-headline text-4xl font-bold text-outline-variant/40 sticky top-32">
                  {section.year}
                </h2>
              </div>
              <div className="flex-1 space-y-12">
                {section.posts.map((post) => (
                  <article key={post.id} className="group">
                    <Link to={`/post/${post.id}`} className="block">
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-headline text-2xl font-bold text-primary group-hover:text-on-primary-container transition-colors duration-300">
                            {post.title}
                          </h3>
                          {post.status === 'DRAFT' && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-bold rounded">
                              Draft
                            </span>
                          )}
                        </div>
                        <time className="font-label text-xs tracking-widest text-on-surface-variant uppercase">
                          {post.publishedAt 
                            ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric' 
                              })
                            : new Date(post.createdAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric' 
                              })
                          }
                        </time>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
