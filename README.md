# 🤖 Discord Boost Bot

Bot de Discord desenvolvido em **Node.js + discord.js v14** para automatizar o fluxo de solicitação e aprovação de serviços de boost.

O bot guia o usuário através de um wizard interativo, envia a cotação por DM e cria um painel de conclusão para a staff com reações.

---

## ✨ Funcionalidades

- Wizard interativo via Slash Command `/boost`
- Seleção de ranking atual e ranking desejado
- Opções extras (duo / reward)
- Cálculo automático do valor do boost
- Envio da cotação por DM
- Envio automático para canal da staff
- Sistema de conclusão/cancelamento via reações:
  - ✅ Concluir solicitação
  - ❌ Cancelar solicitação
- Sincronização entre DM do usuário e canal da staff
- Persistência simples usando JSON
- Limpeza automática das solicitações após conclusão

---

## 🧠 Fluxo do usuário

1. Usuário executa `/boost`
2. Bot abre wizard interativo
3. Usuário escolhe:
   - Rank atual
   - Rank desejado
   - Extras
4. Bot calcula o valor
5. Cotação enviada por DM
6. Staff recebe mensagem para concluir ou cancelar
7. Reação atualiza ambas as mensagens automaticamente

---

## 🛠️ Tecnologias

- Node.js
- discord.js v14
- JSON como armazenamento simples

---

## 📦 Instalação

Clone o projeto:

```bash
git clone https://github.com/JacksomGuilherme/rankup_bot.git
cd rankup_bot
