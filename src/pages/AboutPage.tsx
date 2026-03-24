import { useAuthors } from '../hooks/useApi';

// Static data for now (could also come from API)
const interests = [
  { category: 'Design', items: ['Editorial Layouts', 'Type Specimen'] },
  { category: 'Technology', items: ['Creative Coding', 'Digital Privacy'] },
  { category: 'Culture', items: ['Film Photography', 'Slow Living'] },
];

const currentlyReading = {
  title: 'The Architecture of Happiness',
  author: 'Alain de Botton',
  description: 'How our surroundings influence our moods and how architecture speaks to our inner lives.',
};

export function AboutPage() {
  const { data: authors } = useAuthors();
  const author = authors?.[0];

  return (
    <main className="pt-40 pb-20">
      <section className="max-w-7xl mx-auto px-8">
        <div className="editorial-grid gap-12 lg:gap-24 items-start">
          <div className="col-span-12 lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-surface-container-high overflow-hidden rounded-sm">
              <img loading="lazy"
                alt="Portrait"
                className="w-full h-full object-cover mix-blend-multiply opacity-90 grayscale"
                src={author?.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBADWqG908aXB6l1UcBaYJlBEwn-J5rrY5xdYfb5-FcVBaBA5P10BPbUptZpKlYAMA18aaZ9NMhC8P6zPbB-3DC7Xlz_R2k1iS3WaHLF-g_AHhsxnlSQX4zHpSMZPqHxgkpg6O7jXDigfF7-IWjEEp2s4vSmu8vxm625Q3PRdUXCNB3OX7WX2lqOiAD2iW0eHB300HbreUEd1xSP96WHGKm0zsl6KIcyQs8K0VNifGQc3Cpl6vyN3pk6KupDNeAzTeWLHqX9t68znBE'}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-container/5 -z-10"></div>
          </div>
          
          <div className="col-span-12 lg:col-span-7 pt-4">
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.2em] text-primary-container mb-6 block font-label">
              The Person Behind the Pen
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-primary leading-[1.1] tracking-tighter mb-10 font-headline">
              Crafting narratives in the space between <span className="italic font-normal">words</span>.
            </h1>
            
            <div className="space-y-8 text-lg leading-relaxed text-on-surface-variant font-body max-w-2xl">
              <p>
                {author?.bio || 'I am a designer and writer currently based in the quiet corners of the Pacific Northwest. My work is defined by a pursuit of "The Silent Curator"—the idea that the most impactful experiences are those that don\'t shout for attention, but rather provide a calm, intentional space for discovery.'}
              </p>
              <p>
                With a background in architectural philosophy and digital product design, I bridge the gap between physical permanence and digital fluidity. I believe that every interface should feel as tactile as heavy-stock paper and as intuitive as a well-worn path.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8 mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Interests Card */}
          <div className="col-span-1 md:col-span-2 bg-surface-container-low p-10 rounded-lg">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary">interests</span>
              <h2 className="text-2xl font-bold font-headline text-primary">Interests</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {interests.map((interest) => (
                <div key={interest.category} className="space-y-2">
                  <p className="font-bold font-label text-xs uppercase tracking-widest text-primary-container/60">
                    {interest.category}
                  </p>
                  {interest.items.map((item) => (
                    <p key={item} className="text-on-surface font-body">
                      {item}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Currently Reading Card */}
          <div className="col-span-1 bg-primary text-on-primary p-10 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-on-primary-container">menu_book</span>
                <h2 className="text-2xl font-bold font-headline">Currently Reading</h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-headline italic">{currentlyReading.title}</h3>
                  <p className="text-on-primary-container text-sm font-label mt-1">
                    {currentlyReading.author}
                  </p>
                </div>
                <div className="h-px bg-white/10 w-full"></div>
                <p className="text-on-primary/80 font-body text-sm leading-relaxed">
                  {currentlyReading.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
