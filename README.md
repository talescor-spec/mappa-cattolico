# 📿 Mappa del Cattolico - App Católico

Aplicativo web para acompanhamento espiritual católico com Rosário interativo, Evangelho do dia, orações e novenas.

## ✨ Funcionalidades

- **Rosário Diário Interativo**: 4 tipos de mistérios (Gozosos, Luminosos, Dolorosos, Gloriosos) com progresso salvo
- **Evangelho do Dia**: Leituras bíblicas diárias com reflexões
- **Orações Tradicionais**: Ave Maria, Pai Nosso, Glória ao Pai, Salve Rainha
- **Novenas**: Coleção de novenas católicas
- **Interface Elegante**: Design inspirado em textos litúrgicos com paleta dourada

## 🚀 Deploy no Vercel (Recomendado)

### Opção 1: Deploy Direto pelo Site (Mais Fácil)

1. **Acesse**: [vercel.com](https://vercel.com)
2. **Crie conta**: Use Google, GitHub ou email
3. **Clique em**: "Add New" → "Project"
4. **Importe do GitHub**:
   - Se já tem no GitHub: selecione o repositório
   - Se não tem: siga a "Opção 2" abaixo

### Opção 2: Upload Manual do Projeto

1. **Acesse**: [vercel.com](https://vercel.com) e faça login
2. **Instale o Vercel CLI** no seu computador:
   ```bash
   npm install -g vercel
   ```

3. **No terminal, navegue até a pasta do projeto**:
   ```bash
   cd caminho/para/mappa-cattolico-deploy
   ```

4. **Execute o deploy**:
   ```bash
   vercel
   ```

5. **Siga as instruções**:
   - Login na sua conta Vercel (vai abrir o navegador)
   - Confirme as configurações (aperte Enter em tudo)
   - Aguarde o deploy finalizar

6. **Pronto!** Você receberá uma URL tipo: `https://seu-projeto.vercel.app`

### Opção 3: Conectar com GitHub (Recomendado para atualizações automáticas)

1. **Crie um repositório no GitHub**:
   - Acesse [github.com](https://github.com) e crie um novo repositório
   - Faça upload dos arquivos do projeto

2. **No Vercel**:
   - Clique em "Add New" → "Project"
   - Selecione "Import Git Repository"
   - Escolha seu repositório
   - Clique em "Deploy"

3. **Atualizações Automáticas**:
   - Qualquer alteração que você fizer no GitHub será automaticamente deployada!

## 💻 Desenvolvimento Local

Se quiser testar localmente antes de fazer o deploy:

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# O app estará disponível em: http://localhost:5173
```

## 📦 Estrutura do Projeto

```
mappa-cattolico/
├── src/
│   ├── App.jsx          # Componente principal do aplicativo
│   └── main.jsx         # Entry point do React
├── index.html           # HTML principal
├── package.json         # Dependências do projeto
├── vite.config.js       # Configuração do Vite
└── README.md           # Este arquivo
```

## 🔧 Tecnologias Utilizadas

- **React 18**: Framework JavaScript
- **Vite**: Build tool rápido
- **Lucide React**: Ícones
- **LocalStorage**: Salvamento de progresso do rosário

## 🌐 Compartilhando com Alunos

Após o deploy no Vercel, você receberá uma URL permanente como:
```
https://mappa-cattolico.vercel.app
```

Compartilhe esta URL com seus alunos! O app funcionará em qualquer navegador (celular, tablet, desktop).

## 📱 Recursos

- ✅ Responsivo (funciona em qualquer dispositivo)
- ✅ PWA Ready (pode ser instalado como app)
- ✅ Offline First (progresso salvo localmente)
- ✅ Sem necessidade de login
- ✅ Gratuito e sem anúncios

## 🆘 Problemas Comuns

**"Command not found: npm"**
- Instale o Node.js: [nodejs.org](https://nodejs.org)

**Deploy falhou no Vercel**
- Verifique se todos os arquivos estão na pasta correta
- Tente fazer deploy novamente

**App não carrega**
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Tente em modo anônimo/privado

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para a comunidade católica**
