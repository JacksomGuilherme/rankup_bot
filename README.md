# 🤖 Rankup Bot

Bot de Discord desenvolvido em **Node.js + discord.js v14** para automatizar o fluxo de solicitação e análise de partidas ranqueadas de Rocket League.

O usuário envia os dados da sua partida (junto com o replay ou um link de vídeo) direto pelo Slash Command, o bot valida o material enviado e encaminha para a staff analisar em um canal dedicado.

---

## ✨ Funcionalidades

- Solicitação de análise via Slash Command `/analise`
- Seleção de rank, modo de jogo e mapa da partida
- Envio do replay (`.replay`) anexado ou de um link de vídeo da partida
- Validação do arquivo de replay (extensão, tamanho e assinatura do conteúdo)
- Validação do link de vídeo (protocolo, domínio permitido e redirecionamentos)
- Envio automático da solicitação para o canal da staff
- Confirmação ephemeral para o usuário que solicitou
- Comando `/help-analise`, restrito à staff, para publicar as instruções do `/analise` no canal de comandos

---

## 🧠 Fluxo do usuário

1. Usuário executa `/analise` no canal de comandos
2. Preenche nick, rank, modo e mapa da partida
3. Anexa o replay **ou** informa o link do vídeo
4. Bot valida o material enviado
5. Solicitação é enviada para o canal da staff
6. Staff analisa a partida e responde no canal
7. Usuário recebe a confirmação de que a solicitação foi enviada

---

## 🛠️ Tecnologias

- Node.js
- discord.js v14
- dotenv

---

## 📦 Instalação

Clone o projeto:

```bash
git clone https://github.com/JacksomGuilherme/rankup_bot.git
cd rankup_bot
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
TOKEN=token_do_bot
CLIENT_ID=id_da_aplicacao_no_discord
GUILD_ID=id_do_servidor
COMMAND_CHANNEL=id_do_canal_onde_os_usuarios_executam_os_comandos
STAFF_CHANNEL=id_do_canal_onde_a_staff_recebe_as_solicitacoes
PORT=porta_do_servidor_http
```

Inicie o bot:

```bash
npm start
```

Ou em modo desenvolvimento (com reinício automático):

```bash
npm run dev
```

---

## 🎮 Comandos

| Comando | Quem pode usar | Descrição |
| --- | --- | --- |
| `/analise` | Todos | Envia uma partida (replay ou link de vídeo) para a staff analisar |
| `/help-analise` | Staff | Publica no canal de comandos as instruções de como usar o `/analise` |
