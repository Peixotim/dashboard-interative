# 🌟 Dashboard Emocional (Frontend)

Este é o frontend do projeto de Análise Emocional. É uma aplicação web "premium" construída com [Next.js](https://nextjs.org/) e [Tailwind CSS](https://tailwindcss.com/), desenhada para interagir com uma API de backend dedicada.

A aplicação permite que os utilizadores concedam permissão de câmara, captura de vídeo em tempo real, e visualizem uma análise detalhada das suas emoções através de gráficos dinâmicos.

---

## ✨ Funcionalidades Principais

* **Design Premium:** Interface de utilizador moderna, responsiva, com *glassmorphism*, animações suaves e modo Dark/Light.
* **Captura de Vídeo:** Componente de câmara (`WebcamCapture`) que utiliza a API WebRTC (`getUserMedia`) para capturar frames de vídeo.
* **Visualização em Tempo Real:** Os dados da API atualizam um conjunto de gráficos (Heatmap, Gráfico de Linha, Gráfico de Rosca) em tempo real, construídos com [Recharts](https://recharts.org/).
* **Fluxo de Consentimento (LGPD):** Um ecrã inicial (`ConsentGate`) que gere o consentimento do utilizador, com um fluxo de recusa que leva a uma página de feedback.
* **Páginas Dedicadas:** Inclui uma página de Feedback (`/feedback`) e uma Política de Privacidade (`/privacidade`) com design profissional.
* **Camada de API Limpa:** Todas as chamadas ao backend são geridas através de uma camada de serviço dedicada (`lib/api.ts`).

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Propósito |
| :--- | :--- |
| ⚛️ **Next.js 14** (App Router) | Framework React |
| 🎨 **Tailwind CSS** | Estilização CSS |
| 🧩 **shadcn/ui** | Componentes de UI (Botões, etc.) |
| 🎬 **Framer Motion** | Animações complexas |
| 📈 **Recharts** | Gráficos e visualização de dados |
| 📷 **WebRTC API** | Captura de câmara (`getUserMedia`) |
| 🔒 **TypeScript** | Segurança de tipos |

---

## 🏎️ Como Iniciar (Guia Rápido)

Siga estes passos para ter o frontend a rodar localmente.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (v18 ou superior)
* [Yarn](https://yarnpkg.com/) (ou `npm`)
* **Importante:** O **[Backend (API de Análise Emocional)](#link-para-o-seu-repo-backend)** tem de estar a rodar! O frontend tentará conectar-se a `http://localhost:8000`.

### 1. Instalação

1.  Abra um terminal na pasta do projeto frontend.
2.  Instale todas as dependências:
    ```bash
    yarn install
    ```

### 2. Executar a Aplicação

1.  Certifique-se de que o backend (da pasta `emotion-api`) **já está a rodar** com o `docker-compose up`.
2.  Inicie o servidor de desenvolvimento do Next.js:
    ```bash
    yarn dev
    ```
3.  Abra o seu navegador e aceda a `http://localhost:3000`.

---