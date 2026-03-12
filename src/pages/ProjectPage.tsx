import { Component, createSignal, createEffect, createMemo, onMount, onCleanup, Show, For, batch } from 'solid-js';
import { useParams, A, useNavigate } from '@solidjs/router';
import { Title, Meta } from '@solidjs/meta';
import { getProjectBySlug, projects, type Project } from '../data/projects';

const ProjectPage: Component = () => {
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = createSignal<Project | undefined>();
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [scrollY, setScrollY] = createSignal(0);
  const [scrollProgress, setScrollProgress] = createSignal(0);

  createEffect(() => {
    const p = getProjectBySlug(params.slug);
    if (p) {
      batch(() => { setProject(p); setImageLoaded(false); });
      window.scrollTo(0, 0);
    } else {
      navigate('/', { replace: true });
    }
  });

  onMount(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      batch(() => {
        setScrollY(y);
        setScrollProgress(maxScroll > 0 ? y / maxScroll : 0);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    onCleanup(() => window.removeEventListener('scroll', handleScroll));
  });

  // Reveal observer — re-runs when project() changes so <Show> has rendered
  createEffect(() => {
    if (!project()) return;

    // Two rAFs: first lets Solid flush the DOM, second ensures layout is complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
        );
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        onCleanup(() => revealObserver.disconnect());
      });
    });
  });

  const heroParallax = createMemo(() => `translateY(${scrollY() * 0.25}px)`);
  const heroOpacity = createMemo(() => Math.max(0, 1 - scrollY() / 700));
  const prevProject = createMemo(() => projects.find(p => p.slug === project()?.prevProject));
  const nextProject = createMemo(() => projects.find(p => p.slug === project()?.nextProject));

  return (
    <Show when={project()} fallback={<div class="min-h-screen bg-[#f0ede8]" />}>
      {(proj) => (
        <div class="min-h-screen bg-[#f0ede8] text-[#1a1a1a]">
          <Title>{proj().client} — Bureau</Title>
          <Meta name="description" content={proj().description} />
          <Meta property="og:site_name" content="Bureau" />
          <Meta property="og:title" content={`${proj().client} — Bureau`} />
          <Meta property="og:description" content={proj().description} />
          <Meta property="og:type" content="article" />
          <Meta property="og:url" content={`https://solid-studio-zeta.vercel.app/project/${proj().slug}`} />
          <Meta property="og:image" content={proj().heroImage} />
          <Meta property="og:image:alt" content={`${proj().client} — Bureau project`} />
          <Meta name="twitter:card" content="summary_large_image" />
          <Meta name="twitter:title" content={`${proj().client} — Bureau`} />
          <Meta name="twitter:description" content={proj().description} />
          <Meta name="twitter:image" content={proj().heroImage} />

          {/* Scroll progress */}
          <div class="fixed top-0 left-0 h-[1px] bg-[#1a1a1a] z-[200]" style={`width: ${scrollProgress() * 100}%`} />

          {/* Header */}
          <header class="fixed top-0 left-0 right-0 z-40 bg-[#f0ede8]/80 backdrop-blur-sm border-b border-[#1a1a1a]/5">
            <nav class="flex justify-between items-center px-6 md:px-12 py-5">
              <A href="/" class="font-medium tracking-tight text-lg">Bureau</A>
              <A href="/" class="text-sm opacity-40 hover:opacity-100 transition-opacity py-1">← Work</A>
            </nav>
          </header>

          {/* Hero */}
          <section class="relative h-[100svh] overflow-hidden">
            <div
              class="absolute inset-0"
              style={{ transform: heroParallax(), opacity: heroOpacity() }}
            >
              {/* Image zooms in on load via animate-scale-in */}
              <img
                src={proj().heroImage}
                alt={proj().client}
                classList={{
                  'w-full h-[115%] object-cover transition-opacity duration-1000': true,
                  'opacity-100 animate-scale-in': imageLoaded(),
                  'opacity-0': !imageLoaded(),
                }}
                onLoad={() => setImageLoaded(true)}
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
            </div>

            <div class="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-10 md:pb-14">
              <div
                class="flex items-center gap-3 mb-4 text-xs text-white/50 font-mono uppercase tracking-widest"
                style="animation: fadeIn 0.6s ease-out 0.3s both"
              >
                <span>{proj().type}</span>
                <span>·</span>
                <span>{proj().year}</span>
              </div>
              {/* Headline — clip reveal, each word staggered */}
              <h1 class="text-[clamp(2.8rem,10vw,8rem)] font-light leading-[0.88] tracking-[-0.04em] text-white mb-4 md:mb-0 overflow-hidden">
                <span class="block animate-clip-reveal" style="animation-delay: 0.1s">
                  {proj().client}
                </span>
              </h1>
              <p
                class="text-sm leading-relaxed text-white/60 max-w-sm mt-4 md:mt-5"
                style="animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both"
              >
                {proj().description}
              </p>
            </div>
          </section>

          {/* Project brief */}
          <section class="px-6 md:px-12 py-16 md:py-28 border-b border-[#1a1a1a]/8">
            <div class="flex flex-wrap gap-x-4 gap-y-1 mb-10 md:hidden">
              <For each={proj().tags}>
                {(tag) => <span class="text-[11px] uppercase tracking-widest opacity-30 font-mono">{tag}</span>}
              </For>
            </div>

            <div class="grid md:grid-cols-12 gap-10 md:gap-8">
              <div class="hidden md:block md:col-span-1">
                <div class="flex flex-col gap-2">
                  <For each={proj().tags}>
                    {(tag) => <span class="text-[11px] uppercase tracking-widest opacity-30 font-mono">{tag}</span>}
                  </For>
                </div>
              </div>

              <div class="md:col-span-5 md:col-start-3 reveal">
                <p class="text-xs uppercase tracking-[0.2em] opacity-30 mb-5 md:mb-6">The situation</p>
                <p class="text-lg md:text-2xl font-light leading-[1.5] opacity-80">{proj().challenge}</p>
              </div>

              <div class="md:col-span-4 md:col-start-9 md:pt-10 reveal" style="transition-delay: 0.1s">
                <p class="text-xs uppercase tracking-[0.2em] opacity-30 mb-5 md:mb-6">What we did</p>
                <p class="text-sm leading-relaxed opacity-50">{proj().solution}</p>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section class="px-6 md:px-12 py-12 md:py-16">
            <div class="flex flex-col gap-3 md:hidden">
              <For each={proj().gallery}>
                {(image, index) => (
                  <img
                    src={image}
                    alt={`${proj().client} ${String(index() + 1).padStart(2, '0')}`}
                    class="w-full h-auto object-cover reveal"
                    loading="lazy"
                  />
                )}
              </For>
            </div>

            <div class="hidden md:grid md:grid-cols-12 gap-4">
              <div class="md:col-span-12 overflow-hidden reveal">
                <img
                  src={proj().gallery[0]}
                  alt={`${proj().client} 01`}
                  class="w-full h-[60vh] object-cover gallery-img"
                  loading="lazy"
                />
              </div>
              <Show when={proj().gallery[1]}>
                <div class="md:col-span-7 overflow-hidden reveal" style="transition-delay: 0.07s">
                  <img
                    src={proj().gallery[1]}
                    alt={`${proj().client} 02`}
                    class="w-full h-[50vh] object-cover gallery-img"
                    loading="lazy"
                  />
                </div>
              </Show>
              <Show when={proj().gallery[2]}>
                <div class="md:col-span-5 overflow-hidden mt-16 reveal" style="transition-delay: 0.14s">
                  <img
                    src={proj().gallery[2]}
                    alt={`${proj().client} 03`}
                    class="w-full h-[40vh] object-cover gallery-img"
                    loading="lazy"
                  />
                </div>
              </Show>
            </div>
          </section>

          {/* Results */}
          <section class="px-6 md:px-12 py-16 md:py-28 bg-[#1a1a1a] text-[#f0ede8]">
            <div class="grid md:grid-cols-12 gap-8">
              <div class="md:col-span-2 md:col-start-2">
                <p class="text-xs uppercase tracking-[0.2em] opacity-30 mb-6 md:mb-0">Outcomes</p>
              </div>
              <div class="md:col-span-8 md:col-start-4 reveal-group">
                <For each={proj().results}>
                  {(result, index) => (
                    <div class="reveal flex gap-5 md:gap-10 items-baseline border-t border-[#f0ede8]/10 py-6 md:py-7">
                      <span class="text-xs font-mono opacity-20 shrink-0">{String(index() + 1).padStart(2, '0')}</span>
                      <p class="text-base md:text-xl font-light leading-snug opacity-80">{result}</p>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </section>

          {/* Prev / Next nav */}
          <section class="px-6 md:px-12 py-12 md:py-16">
            <div class="grid grid-cols-2 gap-3 md:gap-4">
              <Show when={prevProject()}>
                {(prev) => (
                  <A
                    href={`/project/${prev().slug}`}
                    class="group flex flex-col gap-2 md:gap-3 p-4 md:p-6 border border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 transition-colors duration-300"
                  >
                    <span class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-30">← Previous</span>
                    <span class="text-base md:text-2xl font-light tracking-tight group-hover:translate-x-1 transition-transform duration-300 leading-tight">{prev().client}</span>
                    <span class="text-[10px] md:text-xs opacity-30 hidden sm:block">{prev().type}</span>
                  </A>
                )}
              </Show>
              <Show when={nextProject()}>
                {(next) => (
                  <A
                    href={`/project/${next().slug}`}
                    class="group flex flex-col gap-2 md:gap-3 p-4 md:p-6 border border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 transition-colors duration-300 items-end text-right"
                  >
                    <span class="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-30">Next →</span>
                    <span class="text-base md:text-2xl font-light tracking-tight group-hover:translate-x-1 transition-transform duration-300 leading-tight">{next().client}</span>
                    <span class="text-[10px] md:text-xs opacity-30 hidden sm:block">{next().type}</span>
                  </A>
                )}
              </Show>
            </div>
          </section>

          {/* Footer */}
          <footer class="px-6 md:px-12 py-6 border-t border-[#1a1a1a]/10">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
              <div class="text-xs opacity-25">© {new Date().getFullYear()} Bureau, Berlin</div>
              <div class="text-xs opacity-25 font-mono hidden md:block">Brand & Digital for Climate & Deep Tech</div>
              <div class="text-xs opacity-25">Jonas Ek · Mara Voss</div>
            </div>
          </footer>
        </div>
      )}
    </Show>
  );
};

export default ProjectPage;
