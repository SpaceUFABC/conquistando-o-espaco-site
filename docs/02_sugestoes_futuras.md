# 🔮 Sugestões de Mudanças Futuras — Conquistando o Espaço

Roadmap pessoal com ideias de melhoria pro projeto **Conquistando o Espaço** (UFABC).

Organizado por esforço vs. impacto, pra você priorizar com a equipe quando voltar ao projeto.

---

## 🎯 Prioridade 1 — Alto impacto, esforço pequeno/médio

### 1. ✨ Implementar o Voo 360 de verdade (o "cubo vermelho")

**Branch sugerida:** `feature/main-js-animacoes`
**Esforço estimado:** ~2 horas
**Arquivo principal:** `javascript/main.js`

**Problema atual:** o `main.js` é literalmente um "hello world" do Three.js. Cria um cubo vermelho e renderiza. Os 3 botões (`Arfagem`, `Rolamento`, `Guinada`) na página `voo360/voo360_1.html` não fazem nada.

**O que precisa ser feito:**
- Importar `GLTFLoader` e `OrbitControls` do Three.js (já instalado como dependência)
- Carregar o modelo `modelos/voo360/controle_aviao.glb` (ou `aviao_anima.glb`)
- Configurar iluminação (ambient + directional)
- Setar câmera em posição adequada pra ver o avião
- Criar um `AnimationMixer` com as animações embutidas no GLB
- Ler o atributo `nome-anim` dos botões HTML e acionar a animação correspondente:
  - `Profundor_Arfagem`
  - `AileronDireito_Rolamento`
  - `Leme_Guinada`
- Loop de renderização com `requestAnimationFrame`

**Esqueleto do código:**
```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.threejs');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(/* ... */);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

// Luzes
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1);
scene.add(light);

// Controles de órbita
const controls = new OrbitControls(camera, canvas);

// Carrega o modelo
const loader = new GLTFLoader();
let mixer, actions = {};
loader.load('../modelos/voo360/controle_aviao.glb', (gltf) => {
    scene.add(gltf.scene);
    mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(clip => {
        actions[clip.name] = mixer.clipAction(clip);
    });
});

// Liga os botões às animações
document.querySelectorAll('.botao_animacao').forEach(btn => {
    btn.addEventListener('click', () => {
        const animName = btn.getAttribute('nome-anim');
        if (actions[animName]) {
            actions[animName].reset().play();
        }
    });
});

// Loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    renderer.render(scene, camera);
}
animate();
```

**Por que é Prioridade 1:** é a **funcionalidade principal não implementada** do projeto. Literalmente tem um cubo vermelho aparecendo no site em produção. Alto impacto pedagógico (todo o conceito de "voo 360 / AR" depende disso).

---

### 2. 🚀 Deploy automático no GitHub Pages

**Branch sugerida:** `feat/deploy-github-pages`
**Esforço estimado:** ~30 minutos

**Problema atual:** o site existe só como código no GitHub. Não tem URL pública onde a equipe ou público possa visitar.

**Solução:** GitHub Actions que faz deploy automático toda vez que `main` receber merge.

**Arquivo a criar:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - uses: actions/deploy-pages@v4
```

Depois ativar em **Settings → Pages → Source: GitHub Actions**.

**Resultado:** site fica publicado em `https://spaceufabc.github.io/conquistando-o-espaco-site/` a cada push.

**Custo:** zero (gratuito pra repos públicos).

---

### 3. 📉 Comprimir os modelos `.glb`

**Branch sugerida:** `perf/compress-glb-models`
**Esforço estimado:** ~30 minutos

**Problema atual:** alguns modelos são gigantes:
- `juno.glb` → **9.2 MB**
- `atlantis.glb` → **3.3 MB**
- `nasa_orion.glb` → **2.7 MB**
- `14bis.glb` → **658 KB**

Em 3G/4G (muito comum no Brasil), isso é a diferença entre carregar e não carregar.

**Solução:** usar `@gltf-transform/cli` com compressão Draco:

```bash
npm install -g @gltf-transform/cli

# Comprime mantendo qualidade visual aceitável
cd modelos
for file in *.glb; do
    gltf-transform draco "$file" "$file" \
        --quantize-position 14 \
        --quantize-normal 10 \
        --quantize-texcoord 12
done
```

**Redução esperada:** 50-80%. `juno.glb` vira ~1.5 MB, `atlantis.glb` vira ~600 KB.

**Cuidado:** testar cada modelo depois da compressão pra garantir que visualmente ainda está bom. Se algum ficar feio, ajustar os parâmetros de quantização (valores maiores = mais qualidade, menos compressão).

---

## 🎨 Prioridade 2 — Impacto médio, manutenibilidade

### 4. 🔁 Dedupe das páginas `modelos_3d_*.html`

**Branch sugerida:** `refactor/dedupe-modelos-3d`
**Esforço estimado:** ~1 hora

**Problema atual:** 8 arquivos HTML praticamente idênticos (só mudam nome do modelo, imagem, descrição e navegação). Se precisar mudar qualquer coisa na estrutura (ex: atualizar versão do model-viewer, adicionar um botão), tem que editar 8 arquivos.

**Solução:** 1 arquivo dinâmico + 1 JSON com dados dos modelos.

**Arquivos:**

`modelos_3d/modelo.html` (genérico):
```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <!-- ... -->
</head>
<body>
    <script type="module" src="https://.../model-viewer.min.js"></script>
    <div id="tela">
        <div id="bloco-texto">
            <h1 class="titulo" id="titulo"></h1>
            <div id="bloco-modelo">
                <model-viewer id="viewer" auto-rotate camera-controls></model-viewer>
            </div>
            <p class="texto" id="descricao"></p>
        </div>
        <div class="menu_navegacao">
            <a id="btn-anterior"><button class="botao_menu_navegacao">VOLTAR</button></a>
            <a id="btn-proximo"><button class="botao_menu_navegacao">PROSSEGUIR</button></a>
        </div>
    </div>
    <script type="module" src="modelo.js"></script>
</body>
</html>
```

`modelos_3d/modelos.json`:
```json
[
    { "id": "14bis", "titulo": "14-BIS", "descricao": "Em 23 de outubro...", "glb": "14bis.glb", "usdz": "14bis.usdz", "camera-orbit": "180deg 75deg" },
    { "id": "fokker", "titulo": "BARÃO VERMELHO", "descricao": "O avião Fokker...", ... },
    ...
]
```

`modelos_3d/modelo.js`:
```js
const params = new URLSearchParams(window.location.search);
const modelId = params.get('id') || '14bis';
fetch('modelos.json').then(r => r.json()).then(models => {
    const idx = models.findIndex(m => m.id === modelId);
    const current = models[idx];
    document.getElementById('titulo').textContent = current.titulo;
    // ... etc
});
```

URLs ficam: `modelos_3d/modelo.html?id=sputnik`

**Benefício:** pra adicionar um novo modelo, basta adicionar uma linha no JSON e o .glb/.usdz em `modelos/`. Sem tocar em HTML.

---

### 5. ♿ Acessibilidade

**Branch sugerida:** `a11y/alt-aria-labels`
**Esforço estimado:** ~20 minutos

**Problemas atuais:**
- Várias imagens com `alt="Logo SPACE"` repetido (pouco descritivo)
- Botões de animação sem `aria-label` explicando o que fazem
- `<button>` dentro de `<a>` é semanticamente estranho (já que o `<a>` que navega)
- Foco do teclado pouco visível nos botões

**Correções:**
- Trocar `<a><button>` por `<a class="botao">` estilizado como botão (usar `role="button"` se quiser)
- Adicionar `aria-label="Ativar animação de arfagem (movimento de subida/descida)"` nos botões
- `alt` descritivo: `alt="Logo SPACE UFABC"`, `alt="Ícone da seção Modelos 3D"`, etc.
- Adicionar `:focus-visible` no CSS com outline claro

**Por que importa:** projeto universitário educacional geralmente tem obrigação de acessibilidade (WCAG). Uns 15% dos usuários se beneficiam.

---

### 6. 📦 `model-viewer` via npm (offline-friendly)

**Branch sugerida:** `refactor/model-viewer-local`
**Esforço estimado:** ~15 minutos

**Problema atual:** 8 páginas carregam `model-viewer` do CDN do Google (`ajax.googleapis.com`). Se o CDN ficar fora do ar ou for bloqueado (acontece em algumas redes corporativas), as páginas de modelos 3D quebram.

**Solução:**
```bash
npm install @google/model-viewer
```

Trocar em todas as páginas:
```html
<!-- ANTES -->
<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"></script>

<!-- DEPOIS -->
<script type="module" src="/node_modules/@google/model-viewer/dist/model-viewer.min.js"></script>
```

Ou, se for junto com o refactor #4, importar no `modelo.js`.

**Benefício:** funciona offline + versão travada (não muda se Google atualizar o CDN).

---

## 🎁 Prioridade 3 — Nice to have

### 7. 🌗 Loading state / skeleton nos modelos 3D

Mostrar algo enquanto o `.glb` carrega (hoje fica tela branca no `bloco-modelo`). O `model-viewer` já tem slot `poster` + `loading` pra isso.

### 8. 📱 Prefetch dos modelos da próxima página

Usando `<link rel="prefetch" href="../modelos/fokker.glb">` no `<head>`, o próximo modelo começa a baixar em background enquanto o usuário lê a descrição do atual. UX muito mais suave.

### 9. 🔍 Testes de E2E (opcional)

Playwright pra testar:
- Menu inicial abre todas as 4 seções
- Navegação VOLTAR/PROSSEGUIR funciona em todas as páginas
- Modelos 3D carregam sem erro no console
- Funciona em mobile (viewport 375x667)

### 10. 🏷️ Adicionar Open Graph tags

Pra quando compartilhar o link no WhatsApp/Twitter/LinkedIn aparecer preview bonito:
```html
<meta property="og:title" content="Conquistando o Espaço - SPACE UFABC">
<meta property="og:description" content="Exposição virtual sobre a história do setor aeroespacial">
<meta property="og:image" content="/imagens/logo-space-600.png">
```

---

## 🧩 Decisões pendentes (conversar com a equipe UFABC)

Essas não são bugs, são **dúvidas de produto** que precisam de quem conhece a intenção do projeto:

### A. Linha do Tempo — deve aparecer no menu inicial?

Hoje a página `linha_do_tempo/linha_do_tempo.html` existe mas **não tem botão em lugar nenhum**. Fica órfã — ninguém acessa. Opções:
1. Adicionar botão no menu inicial com visual "coming soon / presencial"
2. Deletar a página (se não vai usar)
3. Linkar de outro lugar (ex: `comece_aqui_4.html` que fala dela)

### B. `voo360_2.html` — tem conteúdo planejado?

A página existia mas era só navegação quebrada. Consertei o HTML, mas **a página continua vazia** (só tem VOLTAR e MENU INICIAL). Parece que seria pra ter uma segunda animação. Tem 3 modelos GLB em `modelos/voo360/` — talvez seja pra ter:
- `voo360_1.html` — "Controle de um avião" (usa `controle_aviao.glb`)
- `voo360_2.html` — "Animação em voo" (usaria `aviao_anima.glb`)?

Confirmar intenção com equipe.

### C. Fluxo de branches — PR vai pra `main` ou `develop`?

O remote tem as duas branches (`main` e `develop`). Descobrir qual é o fluxo:
- Trabalho em feature branch → PR pra `develop` → `develop` → `main` em releases?
- Ou PR direto pra `main`?

### D. Consertar o git config global

Seu `user.name` global está como `,,,` (bugado). Afeta todos os outros repos do PC. Quando tiver tempo:
```bash
git config --global user.name "Leonardo Jordao"
```

### E. Deploy existente?

Descobrir se já tem alguém fazendo deploy manual do site. Se sim, onde? Se não, implementar a Sugestão #2.

---

## 🗺️ Ordem sugerida de execução

Pensando em valor rápido pro projeto:

1. 🟢 **Fechar o PR atual** (layout + bugs + README) — merge em `main`
2. 🟢 **Deploy GitHub Pages** (#2) — põe o site no ar, todos os próximos PRs já aparecem live
3. 🔥 **main.js animações** (#1) — o trabalho principal do projeto
4. 🟡 **Comprimir GLBs** (#3) — ganho de performance alto, esforço baixo
5. 🟡 **Dedupe modelos_3d** (#4) — facilita manutenção futura
6. ⚪ Acessibilidade, prefetch, loading states (#5, #7, #8)

Com #1 + #2 + #3 feitos, o site já é **funcional, performático e publicado**. O resto é polimento.

---

## 📚 Referências úteis

- Three.js docs: https://threejs.org/docs/
- Three.js examples (GLTFLoader + AnimationMixer): https://threejs.org/examples/?q=animation
- model-viewer docs: https://modelviewer.dev/
- gltf-transform CLI: https://gltf-transform.dev/cli
- GitHub Pages com Vite: https://vite.dev/guide/static-deploy#github-pages
