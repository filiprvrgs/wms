// Estado global da aplicação
let appState = {
    warehouse: null,
    selectedShelf: null,
    currentSection: 'dashboard',
    modalType: null,
    searchTerm: '',
    filterType: 'all'
};

// Elementos DOM
const elements = {
    // Navegação
    navItems: document.querySelectorAll('.nav-item'),
    contentSections: document.querySelectorAll('.content-section'),
    pageTitle: document.getElementById('page-title'),
    pageDescription: document.getElementById('page-description'),
    
    // Dashboard
    totalShelves: document.getElementById('total-shelves'),
    availableShelves: document.getElementById('available-shelves'),
    occupiedShelves: document.getElementById('occupied-shelves'),
    occupancyRate: document.getElementById('occupancy-rate'),
    recentActivity: document.getElementById('recent-activity'),
    alertsList: document.getElementById('alerts-list'),
    
    // Warehouse
    warehouseLayout: document.getElementById('warehouse-layout'),
    addProductBtn: document.getElementById('add-product-btn'),
    removeProductBtn: document.getElementById('remove-product-btn'),
    editProductBtn: document.getElementById('edit-product-btn'),
    
    // Products
    productsGrid: document.getElementById('products-grid'),
    addNewProductBtn: document.getElementById('add-new-product-btn'),
    
    // Transactions
    transactionsList: document.getElementById('transactions-list'),
    transactionFilter: document.getElementById('transaction-filter'),
    
    // Search
    searchInput: document.getElementById('search-input'),
    
    // Modals
    productModal: document.getElementById('product-modal'),
    confirmModal: document.getElementById('confirm-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalClose: document.getElementById('modal-close'),
    confirmTitle: document.getElementById('confirm-title'),
    confirmMessage: document.getElementById('confirm-message'),
    confirmClose: document.getElementById('confirm-close'),
    confirmCancel: document.getElementById('confirm-cancel'),
    confirmOk: document.getElementById('confirm-ok'),
    
    // Forms
    productForm: document.getElementById('product-form'),
    modalCancel: document.getElementById('modal-cancel'),
    modalSave: document.getElementById('modal-save')
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
    updatePageContent('dashboard');
}

// Configurar event listeners
function setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Fechar sidebar ao clicar em um item (mobile)
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchSection(section);
            
            // Fechar sidebar no mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
    
    // Warehouse controls
    elements.addProductBtn.addEventListener('click', () => openProductModal('add'));
    elements.removeProductBtn.addEventListener('click', () => openProductModal('remove'));
    elements.editProductBtn.addEventListener('click', () => openProductModal('edit'));
    elements.addNewProductBtn.addEventListener('click', () => openProductModal('add'));
    
    // Search
    elements.searchInput.addEventListener('input', handleSearch);
    
    // Transaction filter
    elements.transactionFilter.addEventListener('change', handleTransactionFilter);
    
    // Modal events
    elements.modalClose.addEventListener('click', closeProductModal);
    elements.confirmClose.addEventListener('click', closeConfirmModal);
    elements.confirmCancel.addEventListener('click', closeConfirmModal);
    elements.modalCancel.addEventListener('click', closeProductModal);
    elements.productForm.addEventListener('submit', handleProductFormSubmit);
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeProductModal();
            closeConfirmModal();
        }
    });
}

// Carregar dados do armazém
async function loadWarehouseData() {
    try {
        const response = await fetch('/api/warehouse');
        const data = await response.json();
        
        appState.warehouse = data;
        updateDashboardStats(data.stats);
        updateRecentActivity(data.transactions);
        renderWarehouseLayout(data);
        renderProductsGrid(data.products);
        renderTransactionsList(data.transactions);
        
        console.log('✅ Dados do armazém carregados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        showAlert('Erro ao carregar dados do armazém', 'error');
    }
}

// Trocar seção
function switchSection(section) {
    // Atualizar navegação
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });
    
    // Atualizar conteúdo
    elements.contentSections.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${section}-section`) {
            content.classList.add('active');
        }
    });
    
    // Atualizar página
    updatePageContent(section);
    appState.currentSection = section;
}

// Atualizar conteúdo da página
function updatePageContent(section) {
    const pageConfig = {
        dashboard: {
            title: 'Dashboard',
            description: 'Visão geral do sistema de gestão de estoque'
        },
        warehouse: {
            title: 'Layout do Armazém',
            description: 'Visualize e gerencie as prateleiras do armazém'
        },
        products: {
            title: 'Gerenciamento de Produtos',
            description: 'Gerencie produtos e estoques'
        },
        transactions: {
            title: 'Histórico de Transações',
            description: 'Acompanhe todas as movimentações do armazém'
        },
        reports: {
            title: 'Relatórios e Analytics',
            description: 'Analise dados e gere relatórios'
        }
    };
    
    const config = pageConfig[section];
    if (config) {
        elements.pageTitle.textContent = config.title;
        elements.pageDescription.textContent = config.description;
    }
}

// Atualizar estatísticas do dashboard
function updateDashboardStats(stats) {
    elements.totalShelves.textContent = stats.total;
    elements.availableShelves.textContent = stats.available;
    elements.occupiedShelves.textContent = stats.occupied;
    elements.occupancyRate.textContent = `${stats.occupancyRate}%`;
}

// Atualizar atividade recente
function updateRecentActivity(transactions) {
    const recentTransactions = transactions.slice(-5).reverse();
    
    elements.recentActivity.innerHTML = recentTransactions.map(transaction => {
        const iconClass = getTransactionIconClass(transaction.type);
        const time = formatTime(transaction.timestamp);
        
        return `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}">
                    <i class="fas ${getTransactionIcon(transaction.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${transaction.details}</div>
                    <div class="activity-time">${time}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar layout do armazém
function renderWarehouseLayout(data) {
    elements.warehouseLayout.innerHTML = '';
    
    data.aisles.forEach(aisle => {
        const aisleElement = document.createElement('div');
        aisleElement.className = 'aisle';
        
        const aisleLabel = document.createElement('div');
        aisleLabel.className = 'aisle-label';
        aisleLabel.textContent = aisle.name;
        
        const shelfRow = document.createElement('div');
        shelfRow.className = 'shelf-row';
        
        // Criar gôndolas
        for (let gondola = 1; gondola <= aisle.gondolas; gondola++) {
            const shelfColumn = document.createElement('div');
            shelfColumn.className = 'shelf-column';
            
            const gondolaLabel = document.createElement('div');
            gondolaLabel.className = 'gondola-label';
            gondolaLabel.textContent = `G${gondola}`;
            shelfColumn.appendChild(gondolaLabel);
            
            // Criar níveis
            for (let level = 1; level <= 6; level++) {
                const position = `${aisle.name}-${gondola.toString().padStart(2, '0')}-${level.toString().padStart(2, '0')}`;
                const shelf = data.shelves.find(s => s.position === position);
                
                const shelfElement = document.createElement('div');
                shelfElement.className = `shelf-item ${shelf ? shelf.status : 'available'}`;
                shelfElement.textContent = `${aisle.name.charAt(4)}-${gondola.toString().padStart(2, '0')}-${level.toString().padStart(2, '0')}`;
                shelfElement.dataset.position = position;
                shelfElement.title = `${aisle.name} - Gôndola ${gondola} - Nível ${level}`;
                
                shelfElement.addEventListener('click', () => selectShelf(shelfElement, shelf));
                shelfColumn.appendChild(shelfElement);
            }
            
            shelfRow.appendChild(shelfColumn);
        }
        
        aisleElement.appendChild(aisleLabel);
        aisleElement.appendChild(shelfRow);
        elements.warehouseLayout.appendChild(aisleElement);
    });
}

// Selecionar prateleira
function selectShelf(element, shelfData) {
    // Remover seleção anterior
    document.querySelectorAll('.shelf-item.selected').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Selecionar nova prateleira
    element.classList.add('selected');
    appState.selectedShelf = { element, data: shelfData };
    
    console.log('Prateleira selecionada:', shelfData);
}

// Renderizar grid de produtos
function renderProductsGrid(products) {
    elements.productsGrid.innerHTML = products.map(product => {
        const statusClass = product.position ? 'occupied' : 'available';
        const statusText = product.position ? 'Ocupado' : 'Disponível';
        
        return `
            <div class="product-card">
                <div class="product-header">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-sku">${product.sku}</div>
                    </div>
                    <div class="product-status ${statusClass}">${statusText}</div>
                </div>
                <div class="product-details">
                    <div class="product-detail">
                        <span>Quantidade:</span>
                        <span>${product.quantity} ${product.unit}</span>
                    </div>
                    <div class="product-detail">
                        <span>Categoria:</span>
                        <span>${product.category}</span>
                    </div>
                    <div class="product-detail">
                        <span>Posição:</span>
                        <span>${product.position || 'N/A'}</span>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-success" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    ${product.position ? `
                        <button class="btn btn-danger" onclick="removeProduct('${product.id}')">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Renderizar lista de transações
function renderTransactionsList(transactions) {
    elements.transactionsList.innerHTML = transactions.map(transaction => {
        const iconClass = getTransactionIconClass(transaction.type);
        const time = formatTime(transaction.timestamp);
        
        return `
            <div class="transaction-item">
                <div class="transaction-icon ${iconClass}">
                    <i class="fas ${getTransactionIcon(transaction.type)}"></i>
                </div>
                <div class="transaction-content">
                    <div class="transaction-title">${transaction.details}</div>
                    <div class="transaction-details">Prateleira: ${transaction.position}</div>
                </div>
                <div class="transaction-time">${time}</div>
            </div>
        `;
    }).join('');
}

// Abrir modal de produto
function openProductModal(type) {
    if (type === 'add' && !appState.selectedShelf) {
        showAlert('Selecione uma prateleira primeiro', 'warning');
        return;
    }
    
    if (type === 'remove' && (!appState.selectedShelf || appState.selectedShelf.data.status === 'available')) {
        showAlert('Selecione uma prateleira ocupada para remover', 'warning');
        return;
    }
    
    if (type === 'edit' && (!appState.selectedShelf || appState.selectedShelf.data.status === 'available')) {
        showAlert('Selecione uma prateleira ocupada para editar', 'warning');
        return;
    }
    
    appState.modalType = type;
    
    switch (type) {
        case 'add':
            elements.modalTitle.textContent = 'Adicionar Produto';
            elements.productForm.reset();
            break;
        case 'remove':
            showConfirmModal(
                'Remover Produto',
                `Tem certeza que deseja remover o produto da prateleira ${appState.selectedShelf.data.position}?`,
                () => removeProductFromShelf()
            );
            return;
        case 'edit':
            elements.modalTitle.textContent = 'Editar Produto';
            fillProductForm(appState.selectedShelf.data.productId);
            break;
    }
    
    elements.productModal.classList.add('show');
}

// Fechar modal de produto
function closeProductModal() {
    elements.productModal.classList.remove('show');
    appState.modalType = null;
}

// Mostrar modal de confirmação
function showConfirmModal(title, message, onConfirm) {
    elements.confirmTitle.textContent = title;
    elements.confirmMessage.textContent = message;
    elements.confirmOk.onclick = onConfirm;
    elements.confirmModal.classList.add('show');
}

// Fechar modal de confirmação
function closeConfirmModal() {
    elements.confirmModal.classList.remove('show');
}

// Preencher formulário de produto
function fillProductForm(productId) {
    const product = appState.warehouse.products.find(p => p.id === productId);
    if (product) {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-sku').value = product.sku;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-unit').value = product.unit;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description || '';
    }
}

// Manipular envio do formulário
async function handleProductFormSubmit(e) {
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
    
    try {
        if (appState.modalType === 'add') {
            await addProductToShelf(productData);
        } else if (appState.modalType === 'edit') {
            await editProductInShelf(productData);
        }
        
        closeProductModal();
        await loadWarehouseData();
        showAlert('Operação realizada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro na operação:', error);
        showAlert('Erro ao realizar operação', 'error');
    }
}

// Adicionar produto à prateleira
async function addProductToShelf(productData) {
    const position = appState.selectedShelf.data.position;
    
    const response = await fetch(`/api/shelf/${position}/occupy`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
        throw new Error('Erro ao adicionar produto');
    }
    
    return response.json();
}

// Remover produto da prateleira
async function removeProductFromShelf() {
    const position = appState.selectedShelf.data.position;
    
    const response = await fetch(`/api/shelf/${position}/vacate`, {
        method: 'POST'
    });
    
    if (!response.ok) {
        throw new Error('Erro ao remover produto');
    }
    
    closeConfirmModal();
    await loadWarehouseData();
    showAlert('Produto removido com sucesso!', 'success');
    
    return response.json();
}

// Editar produto na prateleira
async function editProductInShelf(productData) {
    const productId = appState.selectedShelf.data.productId;
    
    const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
        throw new Error('Erro ao editar produto');
    }
    
    return response.json();
}

// Manipular busca
function handleSearch(e) {
    appState.searchTerm = e.target.value.toLowerCase();
    // Implementar busca em tempo real
    console.log('Busca:', appState.searchTerm);
}

// Manipular filtro de transações
function handleTransactionFilter(e) {
    appState.filterType = e.target.value;
    // Implementar filtro de transações
    console.log('Filtro:', appState.filterType);
}

// Funções auxiliares
function getTransactionIcon(type) {
    const icons = {
        add: 'fa-plus',
        remove: 'fa-minus',
        edit: 'fa-edit'
    };
    return icons[type] || 'fa-info';
}

function getTransactionIconClass(type) {
    return type;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR');
}

function showAlert(message, type = 'info') {
    // Implementar sistema de alertas
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Criar alerta visual
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    // Cores por tipo
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    alert.style.background = colors[type] || colors.info;
    
    document.body.appendChild(alert);
    
    // Remover após 3 segundos
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Funções globais para uso nos botões
window.editProduct = function(productId) {
    const product = appState.warehouse.products.find(p => p.id === productId);
    if (product) {
        appState.selectedShelf = {
            element: null,
            data: { productId, status: 'occupied' }
        };
        openProductModal('edit');
    }
};

window.removeProduct = function(productId) {
    const product = appState.warehouse.products.find(p => p.id === productId);
    if (product) {
        appState.selectedShelf = {
            element: null,
            data: { productId, status: 'occupied' }
        };
        showConfirmModal(
            'Remover Produto',
            `Tem certeza que deseja remover o produto "${product.name}"?`,
            () => removeProductFromShelf()
        );
    }
};

// Atualizar dados periodicamente
setInterval(() => {
    if (appState.currentSection === 'dashboard') {
        loadWarehouseData();
    }
}, 30000); // Atualizar a cada 30 segundos 