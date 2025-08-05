# Instalação do Sistema WMS

## Pré-requisitos

Para executar o sistema WMS, você precisa ter o Node.js e npm instalados no seu computador.

### 1. Instalar Node.js

1. **Acesse o site oficial**: https://nodejs.org/
2. **Baixe a versão LTS** (recomendada para a maioria dos usuários)
3. **Execute o instalador** e siga as instruções
4. **Verifique a instalação** abrindo o terminal e digitando:
   ```bash
   node --version
   npm --version
   ```

### 2. Executar o Sistema

Após instalar o Node.js e npm, execute os seguintes comandos no terminal:

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

### 3. Acessar o Sistema

Após executar `npm run dev`, o sistema estará disponível em:
```
http://localhost:3000
```

## Alternativas de Instalação

### Windows
- **Chocolatey**: `choco install nodejs`
- **Scoop**: `scoop install nodejs`

### macOS
- **Homebrew**: `brew install node`

### Linux
- **Ubuntu/Debian**: `sudo apt install nodejs npm`
- **CentOS/RHEL**: `sudo yum install nodejs npm`

## Verificação da Instalação

Para verificar se tudo está funcionando:

```bash
# Verificar versão do Node.js
node --version

# Verificar versão do npm
npm --version

# Verificar se o projeto está funcionando
npm run dev
```

## Solução de Problemas

### Erro: "npm não é reconhecido"
- Reinstale o Node.js
- Reinicie o terminal
- Verifique se o Node.js foi adicionado ao PATH

### Erro: "Porta 3000 já está em uso"
- Use `npm run dev -- --port 3001` para usar outra porta
- Ou feche outros aplicativos que possam estar usando a porta 3000

### Erro: "Dependências não encontradas"
- Delete a pasta `node_modules` e o arquivo `package-lock.json`
- Execute `npm install` novamente

## Suporte

Se você encontrar problemas durante a instalação, consulte:
- Documentação oficial do Node.js: https://nodejs.org/docs/
- Documentação do npm: https://docs.npmjs.com/
- Issues do projeto no GitHub (se disponível)

---

**Sistema WMS - Gestão de Estoque**
*Desenvolvido com React, TypeScript e Vite* 