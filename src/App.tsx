import { 
  Component, 
  createSignal, 
  createEffect, 
  createMemo,
  onMount, 
  onCleanup,
  For, 
  Show,
  batch,
  on
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { A } from '@solidjs/router';
import { projects } from './data/projects';

// ============================================
// SOLID SHOWCASE: Fine-grained Reactivity Demo
// ============================================

const App: Component = () => {
  // ---- Basic Signals ----
  const [time, setTime] = createSignal('');
  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 });
  const [activeWork, setActiveWork] = createSignal<number | null>(null);
  const [menuOpen, setMenuOpen] = createSignal(false);
  
  // ---- SOLID FEATURE: Nested Store with fine-grained updates ----
  // Unlike React, updating one property doesn't re-render everything
  const [cursor, setCursor] = createStore({
    x: 0,
    y: 0,
    scale: 1,
    hovering: null as string | null,
    velocity: { x: 0, y: 0 }
  });

  // ---- SOLID FEATURE: Derived/Computed values with createMemo ----
  // Only recalculates when dependencies change - not on every render
  const cursorStyle = createMemo(() => {
    const scale = cursor.hovering ? 2.5 : 1;
    const bg = cursor.hovering ? 'rgba(255,255,255,0.1)' : 'white';
    return `
      left: ${cursor.x - 10 * scale}px; 
      top: ${cursor.y - 10 * scale}px;
      width: ${20 * scale}px;
      height: ${20 * scale}px;
      background: ${bg};
      border: ${cursor.hovering ? '1px solid white' : 'none'};
    `;
  });

  // ---- SOLID FEATURE: Scroll progress tracking with signal ----
  const [scrollY, setScrollY] = createSignal(0);
  const [scrollProgress, setScrollProgress] = createSignal(0);
  
  const scrollProgressPercent = createMemo(() => 
    `${Math.round(scrollProgress() * 100)}%`
  );

  // ---- SOLID FEATURE: Intersection Observer with signals ----
  const [visibleSections, setVisibleSections] = createStore<Record<string, boolean>>({
    work: false,
    about: false,
    services: false,
    contact: false
  });

  // ---- SOLID FEATURE: createEffect for side effects ----
  // Runs automatically when dependencies change, with automatic cleanup
  createEffect(() => {
    if (menuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // ---- SOLID FEATURE: on() for explicit dependency tracking ----
  // More control than React's useEffect dependency array
  createEffect(on(scrollY, (y, prevY) => {
    if (prevY !== undefined) {
      const direction = y > prevY ? 'down' : 'up';
      // Could use this for header hide/show behavior
    }
  }, { defer: true }));

  // ---- Smooth cursor with velocity tracking ----
  let lastX = 0, lastY = 0;
  let rafId: number;
  
  const updateCursor = (x: number, y: number) => {
    // Calculate velocity for potential trail effects
    const vx = x - lastX;
    const vy = y - lastY;
    lastX = x;
    lastY = y;
    
    // SOLID FEATURE: batch() groups multiple updates into one
    // Prevents unnecessary intermediate renders
    batch(() => {
      setCursor('x', x);
      setCursor('y', y);
      setCursor('velocity', { x: vx, y: vy });
    });
  };

  onMount(() => {
    // ---- Time updates ----
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Los_Angeles'
      }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // ---- Mouse tracking with RAF for smooth 60fps updates ----
    const handleMouse = (e: MouseEvent) => {
      // Using RAF prevents jank from too many state updates
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        updateCursor(e.clientX, e.clientY);
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    window.addEventListener('mousemove', handleMouse);

    // ---- Scroll tracking ----
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      batch(() => {
        setScrollY(y);
        setScrollProgress(maxScroll > 0 ? y / maxScroll : 0);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- SOLID FEATURE: Intersection Observer for section visibility ----
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const id = entry.target.id;
          if (id) {
            setVisibleSections(id, entry.isIntersecting);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    // ---- SOLID FEATURE: onCleanup runs automatically ----
    // No need for return function like React useEffect
    onCleanup(() => {
      clearInterval(timeInterval);
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    });
  });

  // ---- Cursor hover handlers ----
  const handleCursorEnter = (type: string) => setCursor('hovering', type);
  const handleCursorLeave = () => setCursor('hovering', null);

  // Use imported projects data
  const works = projects;

  return (
    <div class="min-h-screen bg-[#f8f7f4] text-[#1a1a1a] selection:bg-[#1a1a1a] selection:text-[#f8f7f4]">
      
      {/* ---- SCROLL PROGRESS BAR ---- */}
      <div 
        class="fixed top-0 left-0 h-[2px] bg-[#1a1a1a] z-[200] transition-none"
        style={`width: ${scrollProgress() * 100}%`}
      />

      {/* ---- CUSTOM CURSOR with reactive scaling ---- */}
      <div 
        class="fixed rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:flex items-center justify-center transition-[width,height,background,border] duration-200 ease-out"
        style={cursorStyle()}
      >
        <Show when={cursor.hovering}>
          <span class="text-[8px] uppercase tracking-widest text-white opacity-70">
            {cursor.hovering}
          </span>
        </Show>
      </div>

      {/* ---- MENU OVERLAY ---- */}
      <Show when={menuOpen()}>
        <div 
          class="fixed inset-0 bg-[#1a1a1a] z-50 flex flex-col justify-between p-6 md:p-12"
          style="animation: fadeIn 0.3s ease-out"
        >
          <div class="flex justify-between items-center">
            <a 
              href="#" 
              class="text-[#f8f7f4] font-medium tracking-tight text-lg" 
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => handleCursorEnter('home')}
              onMouseLeave={handleCursorLeave}
            >
              Outline°
            </a>
            <button 
              class="text-[#f8f7f4] text-sm hover:opacity-60 transition-opacity"
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => handleCursorEnter('close')}
              onMouseLeave={handleCursorLeave}
            >
              Close
            </button>
          </div>
          
          <nav class="flex flex-col gap-2 md:gap-4">
            <For each={[
              { name: 'Work', href: '#work' },
              { name: 'About', href: '#about' },
              { name: 'Services', href: '#services' },
              { name: 'Contact', href: '#contact' },
            ]}>
              {(item, i) => (
                <a 
                  href={item.href}
                  class="group text-[#f8f7f4] text-[clamp(2.5rem,10vw,6rem)] font-light leading-none tracking-tight transition-all duration-300 hover:pl-8"
                  onClick={() => setMenuOpen(false)}
                  onMouseEnter={() => handleCursorEnter('view')}
                  onMouseLeave={handleCursorLeave}
                  style={`animation: slideUp 0.4s ease-out ${i() * 0.05}s both`}
                >
                  <span class="inline-block transition-transform duration-300 group-hover:translate-x-4">{item.name}</span>
                  <span class="inline-block ml-4 opacity-0 group-hover:opacity-40 transition-opacity duration-300 text-[0.4em]">→</span>
                </a>
              )}
            </For>
          </nav>

          <div class="flex justify-between items-end text-[#f8f7f4]">
            <div class="text-sm opacity-40">hello@outline.studio</div>
            <div class="flex gap-6 text-sm">
              <For each={['Tw', 'Ig', 'Li']}>
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
          </div>
        </div>
      </Show>

      {/* ---- HEADER ---- */}
      <header class="fixed top-0 left-0 right-0 z-40 mix-blend-difference">
        <nav class="flex justify-between items-center px-6 md:px-12 py-6">
          <a 
            href="#" 
            class="text-[#f8f7f4] font-medium tracking-tight text-lg"
            onMouseEnter={() => handleCursorEnter('home')}
            onMouseLeave={handleCursorLeave}
          >
            Outline°
          </a>
          <div class="flex items-center gap-8">
            <span class="text-[#f8f7f4] text-sm font-mono opacity-60">
              SF {time()}
            </span>
            <button 
              class="text-[#f8f7f4] text-sm hover:opacity-60 transition-opacity"
              onClick={() => setMenuOpen(true)}
              onMouseEnter={() => handleCursorEnter('menu')}
              onMouseLeave={handleCursorLeave}
            >
              Menu
            </button>
          </div>
        </nav>
      </header>

      {/* ---- HERO ---- */}
      <section class="min-h-screen flex flex-col justify-end px-6 md:px-12 pb-12">
        <div class="grid md:grid-cols-12 gap-8 items-end">
          <div class="md:col-span-8">
            <h1 class="text-[clamp(3rem,12vw,10rem)] font-light leading-[0.85] tracking-[-0.04em]">
              Design
              <br />
              <span class="italic font-normal">studio</span>
            </h1>
          </div>
          <div class="md:col-span-4 pb-4">
            <p class="text-sm leading-relaxed max-w-xs opacity-60">
              We create brands, products, and experiences for companies 
              that refuse to blend in.
            </p>
          </div>
        </div>
        
        {/* Scroll indicator - shows current progress */}
        <div class="absolute bottom-12 right-12 hidden md:block">
          <div class="flex flex-col items-center gap-2 text-xs opacity-40">
            <span class="writing-vertical">Scroll</span>
            <div class="w-px h-12 bg-current relative overflow-hidden">
              <div 
                class="absolute bottom-0 left-0 w-full bg-[#1a1a1a] transition-none"
                style={`height: ${scrollProgress() * 100}%`}
              />
            </div>
            <span class="font-mono text-[10px]">{scrollProgressPercent()}</span>
          </div>
        </div>
      </section>

      {/* ---- WORK SECTION ---- */}
      <section 
        id="work" 
        class="px-6 md:px-12 py-24 md:py-32"
        classList={{ 'opacity-100': visibleSections.work, 'opacity-0': !visibleSections.work }}
        style="transition: opacity 0.6s ease-out"
      >
        <div class="flex justify-between items-baseline mb-16">
          <h2 class="text-xs uppercase tracking-[0.2em] opacity-40">Selected Work</h2>
          <span class="text-xs opacity-40">04 Projects</span>
        </div>

        <div class="space-y-1">
          <For each={works}>
            {(work, index) => (
              <A
                href={`/project/${work.slug}`}
                class="group block border-t border-[#1a1a1a]/10 py-6 md:py-8"
                onMouseEnter={() => {
                  setActiveWork(index());
                  handleCursorEnter('view');
                }}
                onMouseLeave={() => {
                  setActiveWork(null);
                  handleCursorLeave();
                }}
              >
                <div class="grid md:grid-cols-12 gap-4 items-center">
                  <span class="md:col-span-1 text-xs opacity-40 font-mono">
                    {String(index() + 1).padStart(2, '0')}
                  </span>
                  <h3 class="md:col-span-5 text-2xl md:text-4xl font-light tracking-tight group-hover:translate-x-4 transition-transform duration-500">
                    {work.client}
                  </h3>
                  <span class="md:col-span-3 text-sm opacity-40">{work.type}</span>
                  <span class="md:col-span-2 text-sm opacity-40">{work.year}</span>
                  <div class="md:col-span-1 flex justify-end">
                    <svg 
                      class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 -rotate-45 group-hover:rotate-0" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
                
                {/* Hover image preview - only updates when activeWork changes */}
                <div 
                  class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] pointer-events-none z-30 hidden md:block"
                  style={{
                    opacity: activeWork() === index() ? 0.9 : 0,
                    transform: `translate(-50%, -50%) scale(${activeWork() === index() ? 1 : 0.8})`,
                    transition: 'opacity 0.5s ease, transform 0.5s ease'
                  }}
                >
                  <img src={work.image} alt={work.client} class="w-full h-full object-cover" loading="lazy" />
                </div>
              </A>
            )}
          </For>
        </div>
      </section>

      {/* ---- ABOUT SECTION ---- */}
      <section 
        id="about" 
        class="px-6 md:px-12 py-24 md:py-32 bg-[#1a1a1a] text-[#f8f7f4]"
        classList={{ 'translate-y-0 opacity-100': visibleSections.about, 'translate-y-8 opacity-0': !visibleSections.about }}
        style="transition: transform 0.8s ease-out, opacity 0.8s ease-out"
      >
        <div class="grid md:grid-cols-12 gap-12 md:gap-8">
          <div class="md:col-span-4 md:col-start-2">
            <h2 class="text-xs uppercase tracking-[0.2em] opacity-40 mb-8">About</h2>
            <p class="text-2xl md:text-3xl font-light leading-snug">
              We're a small team obsessed with craft. No bloated processes, 
              no account managers, no bullshit.
            </p>
          </div>
          <div class="md:col-span-4 md:col-start-8 md:pt-32">
            <p class="text-sm leading-relaxed opacity-60 mb-8">
              Founded in 2019, Outline is an independent design studio working with 
              select clients on projects that matter. We believe in substance over style, 
              though we don't mind if both happen to coexist.
            </p>
            
            {/* ---- SOLID FEATURE: Animated counters ---- */}
            <div class="space-y-4 text-sm">
              <For each={[
                { label: 'Clients', value: 32 },
                { label: 'Projects', value: 78 },
                { label: 'Team', value: 6 },
              ]}>
                {(stat) => (
                  <div class="flex justify-between border-b border-[#f8f7f4]/10 pb-4">
                    <span class="opacity-40">{stat.label}</span>
                    <AnimatedNumber value={stat.value} active={visibleSections.about} />
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>

      {/* ---- SERVICES SECTION ---- */}
      <section 
        id="services" 
        class="px-6 md:px-12 py-24 md:py-32"
        classList={{ 'opacity-100': visibleSections.services, 'opacity-0': !visibleSections.services }}
        style="transition: opacity 0.6s ease-out"
      >
        <div class="grid md:grid-cols-12 gap-12">
          <div class="md:col-span-3">
            <h2 class="text-xs uppercase tracking-[0.2em] opacity-40 sticky top-24">Capabilities</h2>
          </div>
          <div class="md:col-span-6">
            <div class="space-y-12">
              <For each={[
                { title: 'Brand Strategy', desc: 'Positioning, naming, verbal identity, brand architecture' },
                { title: 'Visual Identity', desc: 'Logo systems, typography, color, iconography, guidelines' },
                { title: 'Digital Design', desc: 'Websites, apps, digital products, design systems' },
                { title: 'Art Direction', desc: 'Photography, motion, campaign development' },
              ]}>
                {(service) => (
                  <div 
                    class="group"
                    onMouseEnter={() => handleCursorEnter('explore')}
                    onMouseLeave={handleCursorLeave}
                  >
                    <h3 class="text-xl md:text-2xl font-light mb-2 group-hover:translate-x-2 transition-transform duration-300">
                      {service.title}
                    </h3>
                    <p class="text-sm opacity-40">{service.desc}</p>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </section>

      {/* ---- CONTACT SECTION ---- */}
      <section 
        id="contact" 
        class="px-6 md:px-12 py-24 md:py-32 border-t border-[#1a1a1a]/10"
        classList={{ 'opacity-100': visibleSections.contact, 'opacity-0': !visibleSections.contact }}
        style="transition: opacity 0.6s ease-out"
      >
        <div class="max-w-4xl">
          <p class="text-sm opacity-40 mb-4">Got a project?</p>
          <a 
            href="mailto:hello@outline.studio" 
            class="text-[clamp(2rem,8vw,6rem)] font-light leading-none tracking-tight hover:opacity-50 transition-opacity duration-300 block"
            onMouseEnter={() => handleCursorEnter('email')}
            onMouseLeave={handleCursorLeave}
          >
            Let's talk →
          </a>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer class="px-6 md:px-12 py-8 border-t border-[#1a1a1a]/10">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
  );
};

// ============================================
// SOLID FEATURE: Fine-grained component
// Only this number re-renders, not the whole list
// ============================================
const AnimatedNumber: Component<{ value: number; active: boolean }> = (props) => {
  const [current, setCurrent] = createSignal(0);
  
  createEffect(() => {
    if (props.active && current() < props.value) {
      const step = Math.ceil(props.value / 30);
      const interval = setInterval(() => {
        setCurrent(prev => {
          const next = prev + step;
          if (next >= props.value) {
            clearInterval(interval);
            return props.value;
          }
          return next;
        });
      }, 30);
      
      onCleanup(() => clearInterval(interval));
    }
  });

  return <span>{current()}</span>;
};

export default App;
