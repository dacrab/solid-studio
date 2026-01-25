import { Component, createSignal, createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import { useParams, A, useNavigate } from '@solidjs/router';
import { createStore } from 'solid-js/store';
import { getProjectBySlug, type Project } from '../data/projects';

const ProjectPage: Component = () => {
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [project, setProject] = createSignal<Project | undefined>();
  const [imageLoaded, setImageLoaded] = createSignal(false);
  const [scrollY, setScrollY] = createSignal(0);
  
  // Cursor state
  const [cursor, setCursor] = createStore({
    x: 0,
    y: 0,
    hovering: null as string | null
  });

  // Load project when slug changes
  createEffect(() => {
    const p = getProjectBySlug(params.slug);
    if (p) {
      setProject(p);
      setImageLoaded(false);
      window.scrollTo(0, 0);
    } else {
      navigate('/', { replace: true });
    }
  });

  let rafId: number;
  
  onMount(() => {
    const handleMouse = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setCursor('x', e.clientX);
        setCursor('y', e.clientY);
      });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    onCleanup(() => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    });
  });

  const handleCursorEnter = (type: string) => setCursor('hovering', type);
  const handleCursorLeave = () => setCursor('hovering', null);

  // Parallax for hero image
  const heroTransform = () => `translateY(${scrollY() * 0.3}px)`;
  const heroOpacity = () => Math.max(0, 1 - scrollY() / 600);

  return (
    <Show when={project()} fallback={<div class="min-h-screen bg-[#f8f7f4]" />}>
      {(proj) => (
        <div class="min-h-screen bg-[#f8f7f4] text-[#1a1a1a]">
          
          {/* Custom cursor */}
          <div 
            class="fixed rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:flex items-center justify-center transition-[width,height,background,border] duration-200 ease-out"
            style={{
              left: `${cursor.x - (cursor.hovering ? 25 : 10)}px`,
              top: `${cursor.y - (cursor.hovering ? 25 : 10)}px`,
              width: cursor.hovering ? '50px' : '20px',
              height: cursor.hovering ? '50px' : '20px',
              background: cursor.hovering ? 'rgba(255,255,255,0.1)' : 'white',
              border: cursor.hovering ? '1px solid white' : 'none',
            }}
          >
            <Show when={cursor.hovering}>
              <span class="text-[8px] uppercase tracking-widest text-white opacity-70">
                {cursor.hovering}
              </span>
            </Show>
          </div>

          {/* Header */}
          <header class="fixed top-0 left-0 right-0 z-40 mix-blend-difference">
            <nav class="flex justify-between items-center px-6 md:px-12 py-6">
              <A 
                href="/" 
                class="text-[#f8f7f4] font-medium tracking-tight text-lg"
                onMouseEnter={() => handleCursorEnter('home')}
                onMouseLeave={handleCursorLeave}
              >
                Outline°
              </A>
              <A 
                href="/#work" 
                class="text-[#f8f7f4] text-sm hover:opacity-60 transition-opacity"
                onMouseEnter={() => handleCursorEnter('back')}
                onMouseLeave={handleCursorLeave}
              >
                ← All Work
              </A>
            </nav>
          </header>

          {/* Hero */}
          <section class="relative h-screen overflow-hidden">
            <div 
              class="absolute inset-0 transition-opacity duration-700"
              style={{ 
                transform: heroTransform(),
                opacity: heroOpacity()
              }}
            >
              <img 
                src={proj().heroImage} 
                alt={proj().client}
                class={`w-full h-full object-cover transition-opacity duration-1000 ${imageLoaded() ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
              <div class="absolute inset-0 bg-black/30" />
            </div>
            
            <div class="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-16 text-white">
              <div class="max-w-4xl">
                <div class="flex items-center gap-4 mb-6 text-sm opacity-60">
                  <span>{proj().type}</span>
                  <span>—</span>
                  <span>{proj().year}</span>
                </div>
                <h1 
                  class="text-[clamp(3rem,10vw,8rem)] font-light leading-[0.9] tracking-[-0.03em] mb-6"
                  style="animation: slideUp 0.8s ease-out 0.2s both"
                >
                  {proj().client}
                </h1>
                <p 
                  class="text-lg md:text-xl max-w-2xl opacity-80 font-light"
                  style="animation: slideUp 0.8s ease-out 0.4s both"
                >
                  {proj().description}
                </p>
              </div>
            </div>

            {/* Scroll indicator */}
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-60 animate-bounce">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </section>

          {/* Project Info */}
          <section class="px-6 md:px-12 py-24 md:py-32">
            <div class="grid md:grid-cols-12 gap-12 md:gap-8 max-w-7xl mx-auto">
              {/* Tags */}
              <div class="md:col-span-3">
                <h2 class="text-xs uppercase tracking-[0.2em] opacity-40 mb-4">Services</h2>
                <div class="flex flex-wrap gap-2">
                  <For each={proj().tags}>
                    {(tag) => (
                      <span class="text-sm px-3 py-1 border border-[#1a1a1a]/20 rounded-full">
                        {tag}
                      </span>
                    )}
                  </For>
                </div>
              </div>

              {/* Challenge */}
              <div class="md:col-span-4">
                <h2 class="text-xs uppercase tracking-[0.2em] opacity-40 mb-4">The Challenge</h2>
                <p class="text-lg leading-relaxed opacity-70">
                  {proj().challenge}
                </p>
              </div>

              {/* Solution */}
              <div class="md:col-span-5">
                <h2 class="text-xs uppercase tracking-[0.2em] opacity-40 mb-4">Our Approach</h2>
                <p class="text-lg leading-relaxed opacity-70">
                  {proj().solution}
                </p>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section class="px-6 md:px-12 py-12">
            <div class="max-w-7xl mx-auto space-y-4">
              <For each={proj().gallery}>
                {(image, index) => (
                  <div 
                    class="overflow-hidden rounded-lg"
                    onMouseEnter={() => handleCursorEnter('view')}
                    onMouseLeave={handleCursorLeave}
                  >
                    <img 
                      src={image} 
                      alt={`${proj().client} - Image ${index() + 1}`}
                      class="w-full h-auto hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                )}
              </For>
            </div>
          </section>

          {/* Results */}
          <section class="px-6 md:px-12 py-24 md:py-32 bg-[#1a1a1a] text-[#f8f7f4]">
            <div class="max-w-7xl mx-auto">
              <h2 class="text-xs uppercase tracking-[0.2em] opacity-40 mb-12">Results</h2>
              <div class="grid md:grid-cols-3 gap-8">
                <For each={proj().results}>
                  {(result, index) => (
                    <div 
                      class="border-l border-[#f8f7f4]/20 pl-6"
                      style={`animation: slideUp 0.6s ease-out ${index() * 0.1}s both`}
                    >
                      <p class="text-xl md:text-2xl font-light">{result}</p>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section class="px-6 md:px-12 py-16 border-t border-[#1a1a1a]/10">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
              <A 
                href={`/project/${proj().prevProject}`}
                class="group flex items-center gap-4 text-sm hover:opacity-60 transition-opacity"
                onMouseEnter={() => handleCursorEnter('prev')}
                onMouseLeave={handleCursorLeave}
              >
                <svg class="w-5 h-5 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span class="hidden md:inline">Previous Project</span>
              </A>

              <A 
                href="/#work"
                class="text-xs uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity"
                onMouseEnter={() => handleCursorEnter('all')}
                onMouseLeave={handleCursorLeave}
              >
                All Projects
              </A>

              <A 
                href={`/project/${proj().nextProject}`}
                class="group flex items-center gap-4 text-sm hover:opacity-60 transition-opacity"
                onMouseEnter={() => handleCursorEnter('next')}
                onMouseLeave={handleCursorLeave}
              >
                <span class="hidden md:inline">Next Project</span>
                <svg class="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </A>
            </div>
          </section>

          {/* Footer */}
          <footer class="px-6 md:px-12 py-8 border-t border-[#1a1a1a]/10">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div class="text-xs opacity-40">© 2024 Outline Studio</div>
              <div class="flex gap-8 text-sm">
                <For each={['Twitter', 'Instagram', 'LinkedIn']}>
                  {(social) => (
                    <a 
                      href="#" 
                      class="hover:opacity-50 transition-opacity"
                      onMouseEnter={() => handleCursorEnter('link')}
                      onMouseLeave={handleCursorLeave}
                    >
                      {social}
                    </a>
                  )}
                </For>
              </div>
              <div class="text-xs opacity-40">San Francisco, CA</div>
            </div>
          </footer>
        </div>
      )}
    </Show>
  );
};

export default ProjectPage;
