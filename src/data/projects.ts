export interface Project {
  id: number;
  slug: string;
  client: string;
  type: string;
  year: string;
  image: string;
  heroImage: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  gallery: string[];
  tags: string[];
  nextProject: string;
  prevProject: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'airframe',
    client: 'Airframe',
    type: 'Brand Identity',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=90',
    description: 'A complete brand overhaul for a next-generation aerospace startup revolutionizing sustainable air travel.',
    challenge: 'Airframe needed to stand out in a crowded aerospace market while communicating their commitment to sustainability and innovation. Their existing brand felt dated and failed to capture the excitement of their technology.',
    solution: 'We developed a dynamic visual identity system inspired by airflow patterns and aerodynamic forms. The logomark transforms based on context, representing the adaptability of their technology. A restrained color palette with bold accent colors conveys both professionalism and forward-thinking energy.',
    results: [
      '340% increase in brand recognition',
      'Successfully raised $50M Series B',
      'Featured in Fast Company\'s Innovation by Design awards',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339bbe3c35?w=1200&q=80',
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&q=80',
    ],
    tags: ['Branding', 'Visual Identity', 'Strategy', 'Guidelines'],
    nextProject: 'nomad',
    prevProject: 'wavelength',
  },
  {
    id: 2,
    slug: 'nomad',
    client: 'Nomad',
    type: 'Web Experience',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=90',
    description: 'An immersive digital platform for a travel company that curates extraordinary journeys for modern explorers.',
    challenge: 'Nomad\'s previous website was a standard booking platform that failed to convey the unique, transformative nature of their travel experiences. They needed a digital presence that felt as inspiring as the journeys themselves.',
    solution: 'We created an editorial-style experience that puts storytelling first. Full-bleed imagery, cinematic transitions, and thoughtful micro-interactions invite users to explore rather than simply browse. The booking flow was reimagined as a journey of discovery.',
    results: [
      '280% increase in time on site',
      '156% improvement in conversion rate',
      'Awwwards Site of the Day',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
    ],
    tags: ['Web Design', 'Development', 'UX Strategy', 'Motion'],
    nextProject: 'terraform',
    prevProject: 'airframe',
  },
  {
    id: 3,
    slug: 'terraform',
    client: 'Terraform',
    type: 'Digital Product',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1920&q=90',
    description: 'A comprehensive design system and product redesign for an enterprise infrastructure platform.',
    challenge: 'Terraform\'s product had grown organically over years, resulting in inconsistent interfaces and a steep learning curve. Enterprise customers needed a more intuitive experience without disrupting existing workflows.',
    solution: 'We conducted extensive user research to understand pain points, then designed a modular component system that brought consistency while improving usability. A new information architecture reduced cognitive load and surfaced key actions contextually.',
    results: [
      '45% reduction in support tickets',
      '60% faster onboarding for new users',
      'NPS score improved from 32 to 67',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    ],
    tags: ['Product Design', 'Design System', 'UX Research', 'Prototyping'],
    nextProject: 'wavelength',
    prevProject: 'nomad',
  },
  {
    id: 4,
    slug: 'wavelength',
    client: 'Wavelength',
    type: 'Art Direction',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80',
    heroImage: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=90',
    description: 'Visual direction and campaign identity for an independent music label pushing the boundaries of electronic sound.',
    challenge: 'Wavelength wanted to establish a distinct visual language that could flex across album artwork, merchandise, events, and digital content while maintaining a cohesive identity that resonated with their artist roster.',
    solution: 'We developed a generative visual system rooted in audio visualization. Custom software translates sound frequencies into abstract forms, ensuring each release has unique artwork while remaining unmistakably Wavelength. The system extends to live visuals and environmental design.',
    results: [
      'Social following grew 420% in 6 months',
      'Sold out 3 consecutive event series',
      'Featured in It\'s Nice That and Creative Review',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
    ],
    tags: ['Art Direction', 'Generative Design', 'Campaign', 'Motion'],
    nextProject: 'airframe',
    prevProject: 'terraform',
  },
];

export const getProjectBySlug = (slug: string): Project | undefined => {
  return projects.find(p => p.slug === slug);
};

export const getProjectIndex = (slug: string): number => {
  return projects.findIndex(p => p.slug === slug);
};
