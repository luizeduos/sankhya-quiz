import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `motion` fica FORA do optimizePackageImports de proposito: a reescrita de
  // imports que ele faz achatava o `import()` dinamico de
  // components/motion/features.ts, jogando o pacote de features do Motion
  // (layout projection + drag, ~32 kB gzip) no chunk compartilhado de todas as
  // rotas. Sem a otimizacao, o LazyMotion volta a funcionar: as features viram
  // um chunk proprio, buscado depois do primeiro paint.
  experimental: {
    optimizePackageImports: ["@dnd-kit/core", "@dnd-kit/sortable"],
  },
};

export default nextConfig;
