# 🏭 Sistema WMS - Gestão de Estoque

Um sistema completo de Warehouse Management System (WMS) desenvolvido com Node.js, Express e interface moderna responsiva.

## ✨ Características

### 🎯 Funcionalidades Principais
- **Dashboard Interativo** com estatísticas em tempo real
- **Layout do Armazém** por ruas e gondolas (6 níveis cada)
- **Gestão de Produtos** com sistema FIFO
- **Histórico de Transações** completo
- **Interface Responsiva** para desktop, tablet e mobile
- **Sistema de Busca** avançado
- **Modais Intuitivos** para adicionar/editar/remover produtos

### 🎨 Design Moderno
- Interface profissional com cores azul escuro
- Layout de dashboard com sidebar
- Animações suaves e transições
- Design responsivo para todos os dispositivos
- Ícones Font Awesome
- Tipografia Inter

### 📱 Responsividade
- **Desktop**: Layout completo com sidebar fixa
- **Tablet**: Sidebar colapsável, layout adaptado
- **Mobile**: Menu hambúrguer, layout otimizado para touch
- **Telas pequenas**: Elementos redimensionados automaticamente

## 🚀 Tecnologias

- **Backend**: Node.js + Express.js
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Estilização**: CSS Grid, Flexbox, Media Queries
- **Ícones**: Font Awesome 6
- **Tipografia**: Inter (Google Fonts)
- **Deploy**: Vercel (preparado)

## 📦 Estrutura do Projeto

```
wms-sistema/
├── server.js              # Servidor Express
├── package.json           # Dependências e scripts
├── public/                # Arquivos estáticos
│   ├── index.html        # Interface principal
│   ├── styles.css        # Estilos responsivos
│   └── app.js           # Lógica do cliente
├── .gitignore            # Arquivos ignorados
└── README.md            # Documentação
```

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone https://github.com/filiprvrgs/wms.git
cd wms

# Instale as dependências
npm install

# Inicie o servidor
npm start
```

### Acesso
- **Local**: http://localhost:3000
- **Produção**: [URL do Vercel após deploy]

## 📊 Funcionalidades Detalhadas

### Dashboard
- Estatísticas em tempo real
- Total de prateleiras (720)
- Prateleiras disponíveis/ocupadas
- Taxa de ocupação
- Atividade recente
- Alertas do sistema

### Layout do Armazém
- **6 Ruas** (A, B, C, D, E, F)
- **20 Gondolas** por rua
- **6 Níveis** por gondola
- **Total**: 720 prateleiras
- **Cores**: Vermelho (disponível) / Verde (ocupado)
- **Sistema FIFO** para entrada/saída

### Gestão de Produtos
- Adicionar produtos a prateleiras
- Remover produtos (FIFO)
- Editar informações de produtos
- Busca por nome, SKU ou posição
- Filtros por status

### Transações
- Histórico completo de movimentações
- Tipos: Adicionar, Remover, Editar
- Timestamps precisos
- Detalhes de cada operação
- Filtros por tipo e data

## 🎯 API Endpoints

### GET `/api/warehouse`
Retorna todos os dados do armazém

### POST `/api/shelf/:position/occupy`
Adiciona produto a uma prateleira

### POST `/api/shelf/:position/vacate`
Remove produto de uma prateleira

### PUT `/api/product/:id`
Edita informações de um produto

### GET `/api/search`
Busca prateleiras e produtos

## 📱 Responsividade

### Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px  
- **Mobile**: 480px - 768px
- **Mobile pequeno**: < 480px
- **Mobile muito pequeno**: < 360px

### Adaptações Mobile
- Menu hambúrguer para sidebar
- Layout em coluna única
- Botões maiores para touch
- Modais otimizados
- Scroll horizontal para layout do armazém
- Prateleiras redimensionadas

## 🚀 Deploy

### Vercel
O projeto está configurado para deploy automático no Vercel:

1. Conecte o repositório GitHub ao Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

### Configuração Vercel
- **Framework Preset**: Node.js
- **Build Command**: `npm install`
- **Output Directory**: `public`
- **Install Command**: `npm install`

## 🔧 Desenvolvimento

### Scripts Disponíveis
```bash
npm start          # Inicia o servidor
npm run dev        # Modo desenvolvimento
npm run build      # Build para produção
```

### Estrutura de Dados
```javascript
// Prateleira
{
  position: "Rua A-01-01",
  aisle: "Rua A", 
  gondola: 1,
  level: 1,
  status: "available|occupied",
  productId: "PROD-123",
  lastUpdated: "2024-01-01T00:00:00Z"
}

// Produto
{
  id: "PROD-123",
  name: "Produto Exemplo",
  sku: "SKU-123",
  quantity: 50,
  unit: "un",
  category: "Eletrônicos",
  description: "Descrição...",
  position: "Rua A-01-01",
  createdAt: "2024-01-01T00:00:00Z"
}
```

## 🎨 Personalização

### Cores
- **Primária**: #1e3c72 (Azul escuro)
- **Secundária**: #2a5298 (Azul médio)
- **Acento**: #60a5fa (Azul claro)
- **Sucesso**: #10b981 (Verde)
- **Perigo**: #ef4444 (Vermelho)

### Fontes
- **Principal**: Inter (Google Fonts)
- **Tamanhos**: 0.875rem - 1.875rem
- **Pesos**: 300, 400, 500, 600, 700

## 📈 Próximas Funcionalidades

- [ ] Autenticação de usuários
- [ ] Relatórios avançados com gráficos
- [ ] Notificações em tempo real
- [ ] Integração com códigos de barras
- [ ] Backup automático de dados
- [ ] Múltiplos armazéns
- [ ] API REST completa
- [ ] PWA (Progressive Web App)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Filipe Vargas**
- GitHub: [@filiprvrgs](https://github.com/filiprvrgs)
- LinkedIn: [Filipe Vargas](https://linkedin.com/in/filiprvrgs)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório! 