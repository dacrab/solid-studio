import { Component } from 'solid-js';
import { A } from '@solidjs/router';
import { Title } from '@solidjs/meta';

const NotFound: Component = () => (
  <div class="min-h-screen bg-[#f0ede8] text-[#1a1a1a] flex flex-col justify-between px-6 md:px-12 py-6">
    <Title>404 — Bureau</Title>

    <header>
      <A href="/" class="font-medium tracking-tight text-lg">Bureau</A>
    </header>

    <div>
      <p class="text-xs uppercase tracking-[0.2em] opacity-30 mb-6 font-mono">404</p>
      <h1 class="text-[clamp(2.6rem,9vw,8rem)] font-light leading-[0.88] tracking-[-0.04em] mb-8">
        Page not<br /><span class="italic">found.</span>
      </h1>
      <A
        href="/"
        class="text-sm opacity-40 hover:opacity-100 transition-opacity duration-300"
      >
        ← Back to Bureau
      </A>
    </div>

    <footer>
      <div class="text-xs opacity-25">© {new Date().getFullYear()} Bureau, Berlin</div>
    </footer>
  </div>
);

export default NotFound;
