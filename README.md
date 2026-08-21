# Sankhya Quiz

Quiz gamificado, estilo Duolingo, para treinar conhecimento no **ERP Sankhya**.
Ao errar, o app não apenas marca a resposta como errada: ele explica **o
equívoco daquela alternativa específica**, mostra a resposta correta, explica
**por que ela está certa** e cita a **aula real do EAD Sankhya** de onde o
conteúdo saiu.

**Desenvolvido por [Luiz Eduardo](https://luizeduos.web.app).**

---

## O que tem dentro

- **119 questões** em português do Brasil, em **8 módulos** e **32 lições**,
  com conteúdo real de Sankhya: parâmetros, TOP, CFOP, NF-e, DANFE, rejeições
  SEFAZ, eventos 18/44, estoque/Kardex, conciliação bancária, tabelas de preço,
  custo de reposição, requisição interna, boleto híbrido com PIX.
- **6 tipos de questão**: múltipla escolha, verdadeiro/falso, completar lacuna
  (arrastar), ordenar passos (arrastar), associar colunas (arrastar) e resposta
  digitada curta.
- **Fonte verificável**: cada questão aponta para a aula correspondente em
  `ead.sankhya.com.br`. Os módulos são as trilhas reais do EAD, extraídas do
  catálogo em `src/data/ead/catalog.json` (387 aulas, 23 trilhas).
- **Ranking real, para todos**: placar compartilhado com três critérios — XP
  da semana (zera toda segunda), XP total e ofensiva — com pódio, sua posição
  fixada na tela quando você está fora do top e opt-out em Configurações.
- **Gamificação**: XP, níveis, ofensiva (streak) diária e meta diária.
  **Sem sistema de vidas** — errar nunca bloqueia o estudo: o app existe para
  explicar o erro, e interromper quem errou trabalharia contra isso. O único
  custo de errar é a questão voltar na fila de revisão.
- **Revisar erros** com repetição espaçada: a questão errada volta até você
  acertá-la duas vezes seguidas.
- **Camada de animação** com Framer Motion: trilha serpenteante que se desenha,
  transição de elemento compartilhado do nó da trilha para a lição, `+XP` que
  voa para o contador do HUD, shake amortecido no erro, confete no acerto,
  mascote SVG reagindo ao contexto.
- **Dark mode**, responsivo de 390 px a 1440 px+, e `prefers-reduced-motion`
  respeitado em todo o app.

---

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript strict |
| Estilo | Tailwind CSS v4 (CSS-first, tokens em `src/app/globals.css`) |
| Animação | [`motion`](https://motion.dev) (Framer Motion) via `LazyMotion` + `m.*` |
| Estado | Zustand + `persist` (localStorage) |
| Placar | Redis via API REST (Vercel KV / Upstash) com `fetch` — sem SDK; fallback em memória |
| Arrastar | `@dnd-kit` (com sensor de teclado) |
| Autenticação | NextAuth v5 (Auth.js) — **Google como único provedor**, sessão JWT em cookie httpOnly |
| Tema | next-themes |
| Celebração | canvas-confetti (import dinâmico) |
| Primitivos | Radix UI (apenas Switch) |

### Desvios deliberados do stack originalmente pedido

| Pedido | Implementado | Motivo |
|---|---|---|
| `lottie-react` | Mascote em **SVG inline** animado com Motion (`src/components/mascot/mascot.tsx`) | ~50 kB gzip economizados; o protótipo só trazia um placeholder "mascote", sem arte definida; o SVG herda os tokens e acompanha o dark mode sem um segundo arquivo |
| `recharts` | Gráficos em **SVG próprio** (`src/components/perfil/graficos.tsx`) | Recharts pesa ~100 kB gzip. O design pede barras, um anel e um heatmap — triviais em SVG e animáveis só em `transform` |
| `shadcn/ui` completo | Apenas os primitivos usados | Regra do briefing: nenhuma biblioteca que não seja usada de fato |
| `sonner` | Toast próprio de ~1 kB (`src/components/ui/toast.tsx`) | O `<Toaster />` vive no layout, então o sonner custava ~15 kB gzip em **todas** as rotas do app, para dois toasts |
| `react-hook-form` + `zodResolver` | Removidos | Existiam só para os formulários de senha. Com Google como único provedor não há formulário nenhum — a única entrada de texto do app é a questão de resposta curta |

---

## Rodando localmente

```bash
npm install
cp .env.example .env.local     # preencha AUTH_SECRET e as 2 do Google
npm run dev                    # http://localhost:3000
```

### Autenticação

**Google é o único método de entrada.** Não existe login por senha, cadastro,
recuperação de senha nem usuário de demonstração — e isso é uma decisão de
arquitetura, não uma lacuna:

- senha exigiria tabela de usuários, hash, fluxo de recuperação e um serviço de
  e-mail;
- delegando a identidade ao Google, **o app não guarda credencial nenhuma** e
  não precisa de banco para autenticar.

Ou seja: preencha `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` no `.env.local` antes
de rodar. Sem eles a tela de login explica o que falta em vez de mostrar um
botão que quebra.

Para adicionar outro provedor (Microsoft/Entra ID, por exemplo, que faz sentido
num contexto corporativo), basta acrescentá-lo ao array `providers` em
`src/lib/auth/index.ts` — nenhuma outra parte do app conhece o provedor usado.

---

## Variáveis de ambiente

Todas estão documentadas em [`.env.example`](./.env.example). Resumo:

| Variável | Obrigatória | O que é |
|---|---|---|
| `AUTH_SECRET` | **Sim** | Segredo que assina/criptografa o JWT de sessão. Gere com `openssl rand -base64 32`. Sem ela o NextAuth v5 não sobe em produção. |
| `AUTH_GOOGLE_ID` | **Sim** | Client ID do OAuth do Google — é o único método de entrada. |
| `AUTH_GOOGLE_SECRET` | **Sim** | Client secret do OAuth do Google. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Não (recomendada) | Redis REST que guarda o placar do ranking. Sem elas o ranking funciona em memória do servidor: reinicia a cada deploy e não é compartilhado entre instâncias serverless. Na Vercel, *Storage → Upstash for Redis → Connect to Project* injeta as duas. `UPSTASH_REDIS_REST_URL`/`_TOKEN` são aceitas como alternativa. |
| `NEXTAUTH_URL` | Não | Só se usar domínio próprio e quiser forçá-lo como canônico. Com `trustHost: true` a origem é inferida pelo host da requisição, então preview deploys funcionam sozinhos. |

Sem as variáveis do Google o app sobe, mas ninguém entra: a tela de login
mostra um aviso dizendo exatamente o que falta, em vez de um botão que quebra
(`GOOGLE_CONFIGURADO` em `src/lib/auth/index.ts`).

`.env.local` está no `.gitignore`. **Nenhum segredo é comitado** — o
`.env.example` é template com valores vazios.

---

## Deploy na Vercel

1. **Suba o repositório** para o GitHub/GitLab/Bitbucket.
2. Na Vercel, **Add New → Project** e importe o repositório. O projeto está na
   raiz e não precisa de nenhuma configuração extra: a Vercel detecta Next.js,
   e `next.config.ts` é mínimo.
3. **Cadastre as variáveis de ambiente** em
   *Project → Settings → Environment Variables*:
   - `AUTH_SECRET` — obrigatória. Gere um valor **novo**, não reutilize o local.
     Marque para *Production*, *Preview* e *Development*.
   - `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET` — obrigatórias: sem elas ninguém
     consegue entrar.
   - `NEXTAUTH_URL` — dispensável (ver tabela acima).
4. **Ranking (opcional, mas recomendado).** Em *Storage → Create Database →
   Upstash for Redis → Connect to Project*, a Vercel injeta
   `KV_REST_API_URL` e `KV_REST_API_TOKEN` sozinha. Sem isso o placar roda em
   memória: funciona, mas reinicia a cada deploy e não é compartilhado entre
   instâncias serverless.
5. **Deploy.** O build roda `npm run validate:data` antes de `next build`
   (script `prebuild`), então conteúdo de questão malformado derruba o deploy em
   vez de chegar em produção.

### Callback do Google OAuth

No [Google Cloud Console](https://console.cloud.google.com/apis/credentials),
em *Credentials → OAuth client ID → Web application*, cadastre em
**Authorized redirect URIs**:

```
http://localhost:3000/api/auth/callback/google
https://SEU-PROJETO.vercel.app/api/auth/callback/google
https://SEU-DOMINIO-PROPRIO/api/auth/callback/google
```

O caminho `/api/auth/callback/google` é fixo — é a rota que o Auth.js expõe em
`src/app/api/auth/[...nextauth]/route.ts`.

---

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Valida o banco de questões e faz o build de produção |
| `npm start` | Serve o build de produção |
| `npm run lint` | ESLint (0 erros, 0 warnings) |
| `npm run typecheck` | `tsc --noEmit` (0 erros) |
| `npm run validate:data` | Valida as 119 questões com Zod e regenera `src/data/contagens.ts` |
| `npm run bundle:report` | Sobe o build de produção e mede o First Load JS real de cada rota |

---

## Estrutura

```
src/
  app/
    (auth)/            login — única rota pública
    (app)/             área autenticada: trilha, lição, resumo, revisar,
                       ranking, conteúdo, perfil, configurações, onboarding
    api/auth/          handler do NextAuth
    api/ranking/       GET placar + POST publicação do próprio resumo
    globals.css        design tokens (light/dark), profundidade, animações
  components/
    chrome/            Sidebar, BottomTabBar, HUD, Credits, ThemeToggle
    home/              Trilha (SVG serpenteante), ContinueHero, ModuloCard, Rail
    quiz/              motor de quiz, os 6 tipos de questão, feedback, resumo
    mascot/            mascote SVG animado (4 humores)
    motion/            LazyMotion, PageTransition, Reveal, CircleWipe, springs
    perfil/            gráficos SVG
    ui/                Button pressável, Card, Chip, Input, ProgressBar, Toast
  data/
    schema.zod.ts      schemas Zod — fonte de verdade dos tipos
    schema.ts          re-export só de TIPOS (mantém o Zod fora do bundle)
    modulos.ts         8 módulos mapeados nas trilhas reais do EAD
    questoes/*.ts      banco de questões, um arquivo por módulo
    contagens.ts       GERADO — contagem por lição, para o cliente
    ead/               catálogo real do EAD (JSON + CSVs) e montagem de URL
  lib/
    auth/              config edge-safe (middleware) + provider do Google
    quiz/              engine (correção), progresso (estados da trilha)
    ead/catalog.ts     leitura do catálogo (server-only)
    ranking/           contrato, ordenação e persistência do placar
  store/               progress, errors, session, ranking, xp-flight, hydration
middleware.ts          protege as rotas do app
```

---

## Arquitetura: pronto para plugar um backend

Hoje o progresso individual vive no `localStorage` e a identidade vem do Google
(não há tabela de usuários). O único estado compartilhado é o placar do
ranking. Os pontos de troca estão isolados e comentados:

- **Usuários** — não há tabela de usuários: a identidade vem do Google e a
  sessão é um JWT. Se um dia precisar persistir perfis (cargo real, empresa,
  turma), plugue um adapter do Auth.js em `src/lib/auth/index.ts` — é o único
  arquivo que muda.
- **Progresso** — toda escrita passa por ações dos stores em `src/store/`.
  Substituir `persist(localStorage)` por chamadas de API não exige tocar em
  nenhum componente.
- **Questões** — `src/app/(app)/revisar/actions.ts` já tem a assinatura de uma
  API (`(ids) => Promise<Questao[]>`); trocar a leitura local por HTTP é uma
  linha.
- **Ranking** — já é servidor. `src/lib/ranking/storage.ts` isola a
  persistência atrás de três métodos (`ler`/`gravar`/`remover`), então trocar
  Redis por Postgres é implementar uma interface, sem tocar na API nem na tela.
**Não há dado fictício em nenhuma tela.** A tela de Liga do protótipo vinha com
concorrentes inventados; em vez de manter o mock, ela virou o **/ranking** —
descrito na seção seguinte —, que só mostra quem realmente estudou.

---

## Ranking

O placar é a única parte do app com **estado compartilhado**. O resto do
progresso continua sendo do navegador, e essa mistura é deliberada:

```
navegador (localStorage)          servidor
progresso completo  ──publica──▶  resumo: XP total, XP da semana,
(histórico por dia,               ofensiva, lições, minutos
erros, sessão ativa)   ◀──lê───   placar de todos, já ordenado
```

**Três critérios, um registro.** Semana, geral e ofensiva saem do *mesmo*
registro publicado por cada pessoa, apenas reordenado na leitura
(`src/lib/ranking/service.ts`). Não existem três placares para manter em
sincronia, e a virada de semana não precisa de job nenhum: quem tem semana
antiga gravada simplesmente vale 0 no critério semanal.

**Empates dividem a posição** (1, 2, 2, 4), como em placar esportivo. Quem
está fora do top 50 vê a própria linha fixada no rodapé da tela.

**O que sai do seu navegador.** Nome, foto e cargo vêm da sessão do Google;
XP, ofensiva e número de lições vêm do resumo. Nada de histórico por dia,
respostas ou erros. Em *Configurações › Ranking* o opt-out **remove o
registro do servidor** — não é só esconder da lista.

**Publicação.** `src/store/ranking-sync.tsx` publica quando o app abre, quando
o progresso muda (com debounce de 1,5 s — um acerto não vira uma requisição) e
quando a aba volta ao foco (ofensiva e XP da semana dependem da data, e quem
deixou a aba aberta na virada da meia-noite tem números diferentes sem ter
feito nada).

**Honestidade sobre os números.** Como o progresso é calculado no cliente, os
valores do placar são **autodeclarados** — dá para inflá-los pelo console. A
tela diz isso com essas palavras. Auditar exigiria mover a correção e o XP para
o servidor, o que é possível (as questões e a correção já vivem lá) mas muda o
modelo de dados do app inteiro; enquanto isso, o placar existe para estimular,
não para avaliar.

**Persistência.** Com `KV_REST_API_URL`/`KV_REST_API_TOKEN` o placar vive num
hash do Redis, falado por HTTP puro com `fetch` — **sem SDK e sem dependência
nova**, e compatível com o runtime Edge. Sem as variáveis, cai para memória do
servidor: continua funcionando, mas reinicia a cada deploy e não é compartilhado
entre instâncias serverless — e a tela avisa, com um selo "placar temporário",
em vez de fingir que persistiu.

**Segurança.** A identidade (id, nome, foto, cargo) sai *sempre* da sessão,
nunca do corpo da requisição — caso contrário qualquer pessoa logada poderia
escrever no registro de outra ou inventar um participante. `/api` fica fora do
matcher do middleware, então a checagem de sessão dentro da rota não é
redundante: é a única que existe.

---

## Performance: números reais e uma ressalva honesta

Rode `npm run bundle:report` para reproduzir. O script sobe o build de
produção, autentica com o usuário demo e soma o **gzip real** dos chunks que
cada rota referencia no HTML (ignorando o bundle `nomodule`, que navegadores
modernos não baixam).

O que foi feito, com efeito medido:

| Otimização | Ganho |
|---|---|
| Zod fora dos bundles de cliente (`schema.ts` só re-exporta tipos) | −74 kB |
| Banco de questões só no servidor (props e server action em vez de import) | −89 kB |
| `zod/mini` nas rotas de autenticação | −40 kB nessas rotas |
| `sonner` → toast próprio | −15 kB em todas as rotas do app |
| `SessionProvider` removido (nada usava `useSession`) | −8 kB |
| Google como único provedor: `react-hook-form` + `zodResolver` fora | −28 kB em `/login` |
| `next/font` self-hosted, `canvas-confetti` e features do Motion sob demanda | — |

Resultado (`npm run bundle:report`):

```
Rota                        First Load JS       CSS   próprio JS  chunks
------------------------------------------------------------------------
/revisar                         238.9 kB    8.9 kB      49.9 kB      15
/licao/[licaoId]                 234.9 kB    8.9 kB      45.9 kB      15
/                                223.8 kB    8.9 kB      34.8 kB      15
/modulo/[moduloId]               221.6 kB    8.9 kB      32.6 kB      14
/configuracoes                   219.6 kB    8.9 kB      30.6 kB      14
/perfil                          218.0 kB    8.9 kB      29.0 kB      14
/licao/[licaoId]/resumo          216.5 kB    8.9 kB      27.5 kB      14
/onboarding                      215.8 kB    8.9 kB      26.8 kB      14
/conteudo                        209.1 kB    8.9 kB      20.1 kB      13
/login                           201.4 kB    8.9 kB      12.4 kB      12
------------------------------------------------------------------------
compartilhado por todas          189.0 kB (10 chunks)
```

Da pior rota: **399 kB → 239 kB** (−40%). O código próprio de cada rota ficou
entre **12 e 50 kB**.

### Por que a meta de 150 kB não foi atingida

**Ela não é alcançável nesta stack, e o número que falta não está no app.**

Medindo uma página trivial (um único `<p>`) dentro deste mesmo projeto, o First
Load JS é **146,6 kB**. Os chunks puramente de framework — react-dom, react,
runtime do App Router, scheduler, `next/link` — somam **~128 kB gzip**. A meta
de 150 kB deixaria ~4 kB para *tudo*: providers, tema, animação, stores,
navegação e a tela em si.

Das rotas atuais, **189 kB são compartilhados** (framework + shell) e apenas
12–50 kB são código da rota. Os caminhos para reduzir mais são:

1. **Abrir mão da camada de animação** (Motion ≈ 44 kB entre núcleo e engine) —
   levaria as rotas a ~170 kB, ainda acima da meta, e custaria o diferenciador
   declarado do produto (transições de elemento compartilhado, `+XP` voando
   para o HUD, trilha que se desenha).
2. **Trocar a versão do framework** — o runtime do App Router do Next 16 com
   React 19 é maior que o do Next 15. Precisa ser medido, e mexe na base do
   projeto.

Demais metas de performance: animações restritas a `transform`/`opacity`
(verificado no navegador), CLS ~0 (`next/font` self-hosted +
`scrollbar-gutter: stable`), CSS total de 8,9 kB gzip, zero warnings de
hidratação e zero mensagens de console em produção.

Demais metas: animações restritas a `transform`/`opacity`, CLS ~0
(`next/font` + `scrollbar-gutter: stable`), CSS total de 8,9 kB gzip.
