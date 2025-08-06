// Estado global da aplicação
let appState = {
    warehouse: null,
    selectedShelf: null,
    currentSection: 'dashboard',
    modalType: null,
    searchTerm: '',
    filterType: 'all'
};

// Dados locais do armazém
let warehouseData = {
    aisles: [
        { name: 'Rua A', gondolas: 20 },
        { name: 'Rua B', gondolas: 20 },
        { name: 'Rua C', gondolas: 20 },
        { name: 'Rua D', gondolas: 20 },
        { name: 'Rua E', gondolas: 20 },
        { name: 'Rua F', gondolas: 20 }
    ],
    shelves: new Map(),
    products: new Map(),
    transactions: []
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadWarehouseData();
});

// Inicializar aplicação
function initializeApp() {
    console.log('🚀 Inicializando Sistema WMS...');
    initializeWarehouse();
    updatePageContent('dashboard');
}

// Inicializar dados do armazém
function initializeWarehouse() {
    // Carregar dados do localStorage se existirem
    const savedData = localStorage.getItem('wmsData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        warehouseData.aisles = parsed.aisles;
        warehouseData.shelves = new Map(parsed.shelves);
        warehouseData.products = new Map(parsed.products);
        warehouseData.transactions = parsed.transactions;
    } else {
        // Gerar dados iniciais
        warehouseData.aisles.forEach(aisle => {
            for (let gondola = 1; gondola <= aisle.gondolas; gondola++) {
                for (let level = 1; level <= 6; level++) {
                    const position = `${aisle.name}-${gondola.toString().padStart(2, '0')}-${level.toString().padStart(2, '0')}`;
                    const isOccupied = Math.random() < 0.25;
                    
                    warehouseData.shelves.set(position, {
                        position,
                        aisle: aisle.name,
                        gondola,
                        level,
                        status: isOccupied ? 'occupied' : 'available',
                        productId: isOccupied ? `PROD-${Math.floor(Math.random() * 1000)}` : null,
                        lastUpdated: new Date().toISOString()
                    });

                    if (isOccupied) {
                        const productId = `PROD-${Math.floor(Math.random() * 1000)}`;
                        warehouseData.products.set(productId, {
                            id: productId,
                            name: 'Produto Exemplo',
                            sku: `SKU-${Math.floor(Math.random() * 1000)}`,
                            quantity: Math.floor(Math.random() * 50) + 10,
                            unit: 'un',
                            category: 'Eletrônicos',
                            description: 'Produto de exemplo para demonstração',
                            position,
                            createdAt: new Date().toISOString()
                        });
                    }
                }
            }
        });
        saveData();
    }
}

// Salvar dados no localStorage
function saveData() {
    const data = {
        aisles: warehouseData.aisles,
        shelves: Array.from(warehouseData.shelves.entries()),
        products: Array.from(warehouseData.products.entries()),
        transactions: warehouseData.transactions
    };
    localStorage.setItem('wmsData', JSON.stringify(data));
}

// Configurar event listeners
function setupEventListeners() {
    // Navegação
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const page = link.dataset.page;
            switchPage(page);
        });
    });

    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter
    const filterSelect = document.getElementById('filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }

    // Modal
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Form
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
}

// Trocar página
function switchPage(page) {
    // Remover active de todos os links
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Adicionar active ao link clicado
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    document.getElementById(page).classList.add('active');
    
    // Carregar conteúdo da página
    loadPageContent(page);
}

// Carregar conteúdo da página
function loadPageContent(page) {
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'warehouse':
            loadWarehouse();
            break;
        case 'products':
            loadProducts();
            break;
        case 'transactions':
            loadTransactions();
            break;
        case 'reports':
            loadReports();
            break;
    }
}

// Carregar dashboard
function loadDashboard() {
    const stats = {
        total: warehouseData.shelves.size,
        available: Array.from(warehouseData.shelves.values()).filter(s => s.status === 'available').length,
        occupied: Array.from(warehouseData.shelves.values()).filter(s => s.status === 'occupied').length,
        occupancyRate: ((Array.from(warehouseData.shelves.values()).filter(s => s.status === 'occupied').length / warehouseData.shelves.size) * 100).toFixed(1)
    };

    document.getElementById('total-shelves').textContent = stats.total;
    document.getElementById('available-shelves').textContent = stats.available;
    document.getElementById('occupied-shelves').textContent = stats.occupied;
    document.getElementById('occupancy-rate').textContent = stats.occupancyRate + '%';

    // Carregar atividade recente
    const recentActivity = document.getElementById('recent-activity');
    if (recentActivity) {
        const recentTransactions = warehouseData.transactions.slice(-5).reverse();
        recentActivity.innerHTML = recentTransactions.map(txn => `
            <div class="activity-item">
                <i class="fas ${getTransactionIcon(txn.type)}"></i>
                <div class="activity-info">
                    <p>${txn.details}</p>
                    <small>${formatTime(txn.timestamp)}</small>
                </div>
            </div>
        `).join('') || '<p>Nenhuma atividade recente</p>';
    }
}

// Carregar layout do armazém
function loadWarehouse() {
    const layout = document.getElementById('warehouse-layout');
    if (!layout) return;

    layout.innerHTML = warehouseData.aisles.map(aisle => `
        <div class="aisle">
            <h3>${aisle.name}</h3>
            <div class="gondolas">
                ${Array.from({length: aisle.gondolas}, (_, i) => {
                    const gondolaNum = i + 1;
                    return `
                        <div class="gondola">
                            <div class="gondola-label">G${gondolaNum.toString().padStart(2, '0')}</div>
                            <div class="levels">
                                ${Array.from({length: 6}, (_, j) => {
                                    const levelNum = j + 1;
                                    const position = `${aisle.name}-${gondolaNum.toString().padStart(2, '0')}-${levelNum.toString().padStart(2, '0')}`;
                                    const shelf = warehouseData.shelves.get(position);
                                    const product = shelf?.productId ? warehouseData.products.get(shelf.productId) : null;
                                    
                                    return `
                                        <div class="shelf ${shelf?.status || 'available'}" 
                                             data-position="${position}"
                                             onclick="selectShelf(this, '${position}')">
                                            ${product ? `
                                                <div class="shelf-info">
                                                    <small>${product.name}</small>
                                                    <small>${product.quantity} ${product.unit}</small>
                                                </div>
                                            ` : ''}
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');
}

// Selecionar prateleira
function selectShelf(element, position) {
    // Remover seleção anterior
    document.querySelectorAll('.shelf.selected').forEach(s => s.classList.remove('selected'));
    
    // Selecionar nova prateleira
    element.classList.add('selected');
    
    const shelf = warehouseData.shelves.get(position);
    const product = shelf?.productId ? warehouseData.products.get(shelf.productId) : null;
    
    // Mostrar informações da prateleira
    showShelfInfo(position, shelf, product);
}

// Mostrar informações da prateleira
function showShelfInfo(position, shelf, product) {
    const info = `
        <div class="shelf-details">
            <h4>Prateleira ${position}</h4>
            <p>Status: ${shelf?.status === 'occupied' ? 'Ocupada' : 'Disponível'}</p>
            ${product ? `
                <p>Produto: ${product.name}</p>
                <p>Quantidade: ${product.quantity} ${product.unit}</p>
                <p>SKU: ${product.sku}</p>
            ` : ''}
            <div class="shelf-actions">
                ${shelf?.status === 'available' ? 
                    '<button onclick="showModal(\'add\')" class="btn btn-primary">Adicionar Produto</button>' :
                    '<button onclick="showModal(\'remove\')" class="btn btn-danger">Remover Produto</button>'
                }
            </div>
        </div>
    `;
    
    // Criar ou atualizar painel de informações
    let infoPanel = document.querySelector('.shelf-info-panel');
    if (!infoPanel) {
        infoPanel = document.createElement('div');
        infoPanel.className = 'shelf-info-panel';
        document.querySelector('.warehouse-layout').appendChild(infoPanel);
    }
    infoPanel.innerHTML = info;
}

// Carregar produtos
function loadProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const products = Array.from(warehouseData.products.values());
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-header">
                <h4>${product.name}</h4>
                <span class="product-sku">${product.sku}</span>
            </div>
            <div class="product-info">
                <p><strong>Quantidade:</strong> ${product.quantity} ${product.unit}</p>
                <p><strong>Categoria:</strong> ${product.category}</p>
                <p><strong>Posição:</strong> ${product.position}</p>
            </div>
            <div class="product-actions">
                <button onclick="editProduct('${product.id}')" class="btn btn-secondary">Editar</button>
            </div>
        </div>
    `).join('') || '<p>Nenhum produto cadastrado</p>';
}

// Carregar transações
function loadTransactions() {
    const list = document.getElementById('transactions-list');
    if (!list) return;

    const transactions = warehouseData.transactions.slice().reverse();
    list.innerHTML = transactions.map(txn => `
        <div class="transaction-item">
            <div class="transaction-icon ${getTransactionIconClass(txn.type)}">
                <i class="fas ${getTransactionIcon(txn.type)}"></i>
            </div>
            <div class="transaction-info">
                <p>${txn.details}</p>
                <small>${formatTime(txn.timestamp)}</small>
            </div>
        </div>
    `).join('') || '<p>Nenhuma transação encontrada</p>';
}

// Carregar relatórios
function loadReports() {
    // Implementar relatórios se necessário
}

// Mostrar modal
function showModal(type) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    if (type === 'add') {
        title.textContent = 'Adicionar Produto';
        form.reset();
    } else if (type === 'remove') {
        title.textContent = 'Remover Produto';
        // Implementar confirmação de remoção
        if (confirm('Tem certeza que deseja remover o produto desta prateleira?')) {
            removeProductFromShelf();
        }
        return;
    }
    
    modal.style.display = 'flex';
    appState.modalType = type;
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    appState.modalType = null;
}

// Manipular envio do formulário
function handleProductSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = {
        name: formData.get('product-name') || document.getElementById('product-name').value,
        sku: formData.get('product-sku') || document.getElementById('product-sku').value,
        quantity: parseInt(formData.get('product-quantity') || document.getElementById('product-quantity').value),
        unit: formData.get('product-unit') || document.getElementById('product-unit').value,
        category: formData.get('product-category') || document.getElementById('product-category').value,
        description: formData.get('product-description') || document.getElementById('product-description').value
    };
    
    if (appState.modalType === 'add') {
        addProductToShelf(productData);
    }
    
    closeModal();
}

// Adicionar produto à prateleira
function addProductToShelf(productData) {
    const selectedShelf = document.querySelector('.shelf.selected');
    if (!selectedShelf) {
        alert('Selecione uma prateleira primeiro!');
        return;
    }
    
    const position = selectedShelf.dataset.position;
    const shelf = warehouseData.shelves.get(position);
    
    if (shelf.status === 'occupied') {
        alert('Esta prateleira já está ocupada!');
        return;
    }
    
    const productId = `PROD-${Date.now()}`;
    const product = {
        id: productId,
        ...productData,
        position,
        createdAt: new Date().toISOString()
    };
    
    // Atualizar dados
    warehouseData.products.set(productId, product);
    warehouseData.shelves.set(position, {
        ...shelf,
        status: 'occupied',
        productId,
        lastUpdated: new Date().toISOString()
    });
    
    // Adicionar transação
    warehouseData.transactions.push({
        id: `TXN-${Date.now()}`,
        type: 'add',
        position,
        productId,
        timestamp: new Date().toISOString(),
        details: `Produto ${productData.name} adicionado à prateleira ${position}`
    });
    
    saveData();
    loadPageContent(appState.currentSection);
    alert('Produto adicionado com sucesso!');
}

// Remover produto da prateleira
function removeProductFromShelf() {
    const selectedShelf = document.querySelector('.shelf.selected');
    if (!selectedShelf) {
        alert('Selecione uma prateleira primeiro!');
        return;
    }
    
    const position = selectedShelf.dataset.position;
    const shelf = warehouseData.shelves.get(position);
    
    if (shelf.status === 'available') {
        alert('Esta prateleira já está vazia!');
        return;
    }
    
    const product = warehouseData.products.get(shelf.productId);
    
    // Remover produto
    warehouseData.products.delete(shelf.productId);
    warehouseData.shelves.set(position, {
        ...shelf,
        status: 'available',
        productId: null,
        lastUpdated: new Date().toISOString()
    });
    
    // Adicionar transação
    warehouseData.transactions.push({
        id: `TXN-${Date.now()}`,
        type: 'remove',
        position,
        productId: shelf.productId,
        timestamp: new Date().toISOString(),
        details: `Produto removido da prateleira ${position}`
    });
    
    saveData();
    loadPageContent(appState.currentSection);
    alert('Produto removido com sucesso!');
}

// Editar produto
function editProduct(productId) {
    const product = warehouseData.products.get(productId);
    if (!product) return;
    
    // Preencher formulário
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-sku').value = product.sku;
    document.getElementById('product-quantity').value = product.quantity;
    document.getElementById('product-unit').value = product.unit;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    
    showModal('edit');
}

// Manipular busca
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    // Implementar busca se necessário
}

// Manipular filtro
function handleFilter(e) {
    const filterType = e.target.value;
    // Implementar filtro se necessário
}

// Funções auxiliares
function getTransactionIcon(type) {
    switch(type) {
        case 'add': return 'fa-plus-circle';
        case 'remove': return 'fa-minus-circle';
        case 'edit': return 'fa-edit';
        default: return 'fa-info-circle';
    }
}

function getTransactionIconClass(type) {
    switch(type) {
        case 'add': return 'success';
        case 'remove': return 'danger';
        case 'edit': return 'warning';
        default: return 'info';
    }
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString('pt-BR');
}

// Carregar dados do armazém
function loadWarehouseData() {
    // Dados já são carregados na inicialização
    loadPageContent('dashboard');
} 