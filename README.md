# Conquistando o Espaço

Site da exposição virtual **Conquistando o Espaço**, um projeto do grupo **SPACE UFABC** sobre a história e evolução do setor aeroespacial no Brasil e no mundo.

O site apresenta modelos 3D interativos de aviões, foguetes e satélites históricos, além de animações em Realidade Aumentada sobre o funcionamento de aeronaves.

> 🔗 Instagram do projeto: [@spaceufabc](https://www.instagram.com/spaceufabc)

---

## 📋 Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como rodar localmente](#como-rodar-localmente)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Tecnologias](#tecnologias)
- [Build de produção](#build-de-produção)
- [Fluxo de contribuição](#fluxo-de-contribuição)

---

## Pré-requisitos

Antes de começar, você precisa ter instalado:

### 1. Node.js (versão 18 ou superior, recomendado 20+)

O Node.js traz o `npm` (gerenciador de pacotes) junto na instalação.

**Windows / macOS:** baixe o instalador LTS em <https://nodejs.org>

**Linux / WSL (Ubuntu):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verifique a instalação:
```bash
node --version    # deve mostrar v18+ ou superior
npm --version
```

### 2. Git

**Windows:** <https://git-scm.com/download/win>

**Linux / WSL:**
```bash
sudo apt-get install -y git
```

### 3. Editor de código (recomendado)

[VS Code](https://code.visualstudio.com/) com as extensões:
- **Live Server** (opcional — dá pra usar em vez do Vite pra testes rápidos)
- **Prettier** (formatação)

---

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SpaceUFABC/conquistando-o-espaco-site.git
   cd conquistando-o-espaco-site
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

   Esse comando lê o `package.json` e instala automaticamente:

   | Pacote | Versão | Tipo | Propósito |
   |---|---|---|---|
   | `vite` | ^7.1.0 | devDependency | Servidor de desenvolvimento com hot-reload + bundler para produção |
   | `three` | ^0.179.1 | dependency | Biblioteca 3D usada na seção Voo 360 (animações de avião) |

   As dependências ficam na pasta `node_modules/` (ignorada pelo git).

3. **Dependência carregada via CDN (não precisa instalar):**

   Nas páginas de `modelos_3d/`, o componente [`<model-viewer>`](https://modelviewer.dev/) é carregado direto do CDN do Google:
   ```html
   <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"></script>
   ```

   ⚠️ Isso significa que **você precisa de internet** pra carregar a visualização 3D dessas páginas. Se quiser funcionar offline, veja a seção [Tecnologias](#tecnologias).

---

## Como rodar localmente

### Modo de desenvolvimento (recomendado)

```bash
npm run dev
```

Abre o servidor em <http://localhost:5173> com **hot reload** — qualquer alteração em HTML / CSS / JS recarrega automaticamente no navegador.

Para também acessar pelo celular na mesma rede Wi-Fi:
```bash
npm run dev -- --host
```

O terminal vai mostrar um IP local (tipo `http://192.168.1.58:5173`) — abra no celular.

### Build de produção

```bash
npm run build
```

Gera os arquivos otimizados na pasta `dist/` (minificados, hash nos nomes, prontos pra publicar).

### Preview do build

```bash
npm run preview
```

Serve a pasta `dist/` localmente pra você testar como ficou o build antes de publicar.

---

## Estrutura de pastas

```
conquistando-o-espaco-site/
├── index.html                  ← Menu inicial (4 botões: COMECE AQUI, MODELOS 3D, VOO 360, SAIBA MAIS)
├── style.css                   ← Estilos globais (usado por todas as páginas)
├── package.json                ← Manifesto npm (dependências + scripts)
├── package-lock.json           ← Lock das versões exatas (gerado pelo npm)
├── .gitignore                  ← Arquivos ignorados pelo git (node_modules, dist, logs...)
├── .gitattributes              ← Configuração de line-endings do git
├── README.md                   ← Este arquivo
│
├── comece_aqui/                ← Tutorial de onboarding em 4 telas
│   ├── comece_aqui_1.html         Boas-vindas
│   ├── comece_aqui_2.html         Explica a seção Modelos 3D
│   ├── comece_aqui_3.html         Explica o Voo 360 (Realidade Aumentada)
│   └── comece_aqui_4.html         Explica a Linha do Tempo (atração presencial)
│
├── modelos_3d/                 ← 8 páginas, cada uma com um modelo 3D rotativo + descrição histórica
│   ├── modelos_3d_1.html          14-Bis (Santos Dumont, 1906)
│   ├── modelos_3d_2.html          Fokker "Barão Vermelho" (1ª Guerra, 1916)
│   ├── modelos_3d_3.html          Sputnik (URSS, 1957)
│   ├── modelos_3d_4.html          Sonda I (primeiro foguete brasileiro, 1967)
│   ├── modelos_3d_5.html          Columbia (primeiro ônibus espacial, 1981)
│   ├── modelos_3d_6.html          SCD-1 (primeiro satélite do INPE, 1993)
│   ├── modelos_3d_7.html          Sonda Juno (NASA, 2011)
│   └── modelos_3d_8.html          NASA Orion (2014)
│
├── voo360/                     ← Seção de Realidade Aumentada / animações 3D interativas
│   ├── voo360_1.html              Controle de um avião (botões: Arfagem, Rolamento, Guinada)
│   └── voo360_2.html              Página de navegação (retorno ao menu)
│
├── saiba_mais/                 ← Páginas institucionais (créditos + parceiros)
│   ├── saiba_mais_1.html          Sobre o projeto + link Instagram
│   ├── saiba_mais_2.html          UFABC (universidade)
│   ├── saiba_mais_3.html          Equipe de desenvolvimento
│   ├── saiba_mais_4.html          PROAC (programa de apoio)
│   ├── saiba_mais_5.html          INPE (Instituto Nacional de Pesquisas Espaciais)
│   └── saiba_mais_6.html          NASA (fonte de alguns modelos)
│
├── linha_do_tempo/             ← Atração presencial (painéis informativos físicos)
│   └── linha_do_tempo.html
│
├── modelos/                    ← Arquivos de geometria 3D
│   ├── *.glb                       Formato padrão (Android, Desktop, Web)
│   ├── IOS/                        Formato Quick Look para AR no iPhone/iPad
│   │   └── *.usdz
│   └── voo360/                     Modelos específicos do Voo 360
│       ├── aviao_anima.glb
│       ├── controle_aviao.glb
│       └── controle_aviao2.glb
│
├── imagens/                    ← Logos, ícones e imagens de fundo
│   ├── logo-space-*.png            Logos do grupo SPACE em várias resoluções
│   ├── logo-ufabc-*.png            Logos da UFABC
│   ├── logo-ministerio-*.png       Logos do Ministério (parceiro)
│   ├── logo-inpe-*.png             Logos do INPE
│   ├── logo-proac-*.png            Logos do PROAC
│   ├── icon_*.png                  Ícones das 3 atrações (modelos, voo360, linha do tempo)
│   ├── fundo*.png                  Imagens de fundo do site
│   └── background.jpg
│
├── fontes/                     ← Fontes Ubuntu (auto-hospedadas)
│   ├── Ubuntu-B.ttf                Bold (títulos e botões)
│   └── Ubuntu-M.ttf                Medium (corpo de texto)
│
└── javascript/                 ← Scripts JavaScript
    └── main.js                     Three.js para o Voo 360 (⚠️ em desenvolvimento)
```

---

## Tecnologias

| Tecnologia | Usada em | Como é carregada |
|---|---|---|
| HTML5 + CSS3 | Todas as páginas | Estática |
| **Vite** 7.x | Dev server + build | `npm install` |
| **Three.js** 0.179.x | `javascript/main.js` (Voo 360) | `npm install` |
| **[model-viewer](https://modelviewer.dev/)** 4.0 | Páginas `modelos_3d/` | CDN (`ajax.googleapis.com`) |
| **Fontes Ubuntu** (B + M) | Todo o site | Auto-hospedadas em `fontes/` |

### Sobre os formatos 3D

- **`.glb`** → formato universal para Android, desktop e web (usado pelo `model-viewer` e Three.js)
- **`.usdz`** → exclusivo do iOS, aciona automaticamente o **AR Quick Look** do Apple para visualização em Realidade Aumentada

O `model-viewer` escolhe o formato automaticamente com base no dispositivo do usuário:
```html
<model-viewer
    src="../modelos/14bis.glb"           ← Android/Desktop
    ios-src="../modelos/IOS/14bis.usdz"  ← iOS
    auto-rotate camera-controls>
</model-viewer>
```

---

## Build de produção

```bash
npm run build
```

O Vite gera a pasta `dist/` com:
- HTML minificado
- CSS otimizado
- JavaScript bundled
- Assets com hash no nome (cache-busting)

Para publicar, basta copiar o conteúdo de `dist/` para qualquer servidor estático (GitHub Pages, Netlify, Vercel, S3, etc.).

---

## Fluxo de contribuição

1. **Crie uma branch a partir de `main`:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/nome-da-sua-feature
   ```

2. **Faça suas alterações e teste localmente** com `npm run dev`.

3. **Commit com mensagens claras** (sugerido: [Conventional Commits](https://www.conventionalcommits.org/)):
   ```bash
   git add .
   git commit -m "feat: adiciona animação do avião no Voo 360"
   ```

4. **Suba a branch:**
   ```bash
   git push -u origin feature/nome-da-sua-feature
   ```

5. **Abra um Pull Request no GitHub** para revisão da equipe.

### Branches ativas no remote

- `main` — branch de produção
- `develop` — branch de integração (conforme fluxo da equipe)

---

## Créditos

**Desenvolvido por estudantes e professores da Universidade Federal do ABC (UFABC)**, com colaboração dos cursos de Engenharia Aeroespacial, Engenharia de Instrumentação/Automação/Robótica (IAR) e Ciência da Computação.

Modelos 3D parcialmente provenientes dos portais:
- [NASA 3D Resources](https://nasa3d.arc.nasa.gov)
- [NASA Solar System Exploration](https://solarsystem.nasa.gov)
