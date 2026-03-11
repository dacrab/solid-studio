import { createSignal, onMount, onCleanup } from 'solid-js';

export function useCursor() {
  const [pos, setPos] = createSignal({ x: 0, y: 0 });
  const [hovering, setHovering] = createSignal<string | null>(null);

  let rafId: number;

  onMount(() => {
    const handleMouse = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener('mousemove', handleMouse);
    onCleanup(() => {
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(rafId);
    });
  });

  const onEnter = (type: string) => setHovering(type);
  const onLeave = () => setHovering(null);

  // Cursor style — single source of truth.
  // mix-blend-mode: difference is applied via class in JSX,
  // so we just use white for everything — it inverts automatically:
  //   white on dark bg  → appears white (visible)
  //   white on light bg → inverts to dark (visible)
  const cursorStyle = () => {
    const h = hovering();
    return {
      left: `${pos().x}px`,
      top: `${pos().y}px`,
      width: h ? '44px' : '8px',
      height: h ? '44px' : '8px',
      transform: 'translate(-50%, -50%)',
      background: h ? 'transparent' : 'white',
      border: h ? '1.5px solid white' : 'none',
    };
  };

  return { hovering, onEnter, onLeave, cursorStyle };
}
