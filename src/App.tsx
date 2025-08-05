import React, { useState, useEffect } from 'react';
import { Warehouse, ShelfItem, Product, ModalState } from './types';
import { Package, PackageX, Edit, Plus, Minus, Warehouse as WarehouseIcon, Search, Filter } from 'lucide-react';
import ShelfGrid from './components/ShelfGrid';
import Stats from './components/Stats';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedShelf, setSelectedShelf] = useState<ShelfItem | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'occupied'>('all');

  // Inicializar dados de exemplo
  useEffect(() => {
    const initialWarehouses: Warehouse[] = [
      {
        id: '1',
        name: 'Armazém Principal',
        shelves: generateShelves(100, 'A'),
        totalShelves: 100,
        availableShelves: 75,
        occupiedShelves: 25
      },
      {
        id: '2',
        name: 'Armazém Secundário',
        shelves: generateShelves(80, 'B'),
        totalShelves: 80,
        availableShelves: 60,
        occupiedShelves: 20
      }
    ];

    setWarehouses(initialWarehouses);
  }, []);

  function generateShelves(count: number, prefix: string): ShelfItem[] {
    const shelves: ShelfItem[] = [];
    for (let i = 1; i <= count; i++) {
      const isOccupied = Math.random() < 0.25; // 25% de ocupação inicial
      shelves.push({
        id: `${prefix}-${i.toString().padStart(3, '0')}`,
        position: `${prefix}-${i.toString().padStart(3, '0')}`,
        status: isOccupied ? 'occupied' : 'available',
        product: isOccupied ? generateRandomProduct() : undefined,
        lastUpdated: new Date()
      });
    }
    return shelves;
  }

  function generateRandomProduct(): Product {
    const products = [
      { name: 'Produto A', sku: 'SKU001', category: 'Eletrônicos' },
      { name: 'Produto B', sku: 'SKU002', category: 'Roupas' },
      { name: 'Produto C', sku: 'SKU003', category: 'Casa' },
      { name: 'Produto D', sku: 'SKU004', category: 'Esportes' },
      { name: 'Produto E', sku: 'SKU005', category: 'Livros' }
    ];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: randomProduct.name,
      sku: randomProduct.sku,
      quantity: Math.floor(Math.random() * 50) + 1,
      unit: 'un',
      category: randomProduct.category
    };
  }

  const handleShelfClick = (shelf: ShelfItem, warehouseId: string) => {
    setSelectedShelf(shelf);
    setModalState({
      isOpen: true,
      type: shelf.status === 'available' ? 'add' : 'remove',
      selectedShelf: shelf
    });
  };

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    if (!selectedShelf) return;

    const newProduct: Product = {
      ...productData,
      id: Math.random().toString(36).substr(2, 9)
    };

    setWarehouses(prevWarehouses => 
      prevWarehouses.map(warehouse => {
        const shelfIndex = warehouse.shelves.findIndex(shelf => shelf.id === selectedShelf.id);
        
        if (shelfIndex === -1) return warehouse; // Shelf not found in this warehouse
        
        const updatedShelves = [...warehouse.shelves];
        updatedShelves[shelfIndex] = {
          ...updatedShelves[shelfIndex],
          status: 'occupied' as const,
          product: newProduct,
          lastUpdated: new Date()
        };

        const availableShelves = updatedShelves.filter(s => s.status === 'available').length;
        const occupiedShelves = updatedShelves.filter(s => s.status === 'occupied').length;

        return {
          ...warehouse,
          shelves: updatedShelves,
          availableShelves,
          occupiedShelves
        };
      })
    );

    // Atualizar o selectedShelf com os novos dados
    setSelectedShelf(prev => prev ? {
      ...prev,
      status: 'occupied' as const,
      product: newProduct,
      lastUpdated: new Date()
    } : null);

    setModalState({ isOpen: false, type: null });
  };

  const handleRemoveProduct = () => {
    if (!selectedShelf) return;

    setWarehouses(prevWarehouses => 
      prevWarehouses.map(warehouse => {
        const shelfIndex = warehouse.shelves.findIndex(shelf => shelf.id === selectedShelf.id);
        
        if (shelfIndex === -1) return warehouse; // Shelf not found in this warehouse
        
        const updatedShelves = [...warehouse.shelves];
        updatedShelves[shelfIndex] = {
          ...updatedShelves[shelfIndex],
          status: 'available' as const,
          product: undefined,
          lastUpdated: new Date()
        };

        const availableShelves = updatedShelves.filter(s => s.status === 'available').length;
        const occupiedShelves = updatedShelves.filter(s => s.status === 'occupied').length;

        return {
          ...warehouse,
          shelves: updatedShelves,
          availableShelves,
          occupiedShelves
        };
      })
    );

    // Atualizar o selectedShelf com os novos dados
    setSelectedShelf(prev => prev ? {
      ...prev,
      status: 'available' as const,
      product: undefined,
      lastUpdated: new Date()
    } : null);

    setModalState({ isOpen: false, type: null });
  };

  const handleEditProduct = (productData: Product) => {
    if (!selectedShelf) return;

    setWarehouses(prevWarehouses => 
      prevWarehouses.map(warehouse => {
        const shelfIndex = warehouse.shelves.findIndex(shelf => shelf.id === selectedShelf.id);
        
        if (shelfIndex === -1) return warehouse; // Shelf not found in this warehouse
        
        const updatedShelves = [...warehouse.shelves];
        updatedShelves[shelfIndex] = {
          ...updatedShelves[shelfIndex],
          product: productData,
          lastUpdated: new Date()
        };

        return {
          ...warehouse,
          shelves: updatedShelves
        };
      })
    );

    // Atualizar o selectedShelf com os novos dados
    setSelectedShelf(prev => prev ? {
      ...prev,
      product: productData,
      lastUpdated: new Date()
    } : null);

    setModalState({ isOpen: false, type: null });
  };

  const handleControlButtonClick = (type: 'add' | 'remove' | 'edit') => {
    if (type === 'add' || type === 'edit') {
      // For add/edit, we need a selected shelf
      if (!selectedShelf) {
        alert('Por favor, selecione uma prateleira primeiro.');
        return;
      }
      
      if (type === 'add' && selectedShelf.status === 'occupied') {
        alert('Esta prateleira já está ocupada. Selecione uma prateleira disponível.');
        return;
      }
      
      if (type === 'edit' && selectedShelf.status === 'available') {
        alert('Esta prateleira está vazia. Selecione uma prateleira ocupada para editar.');
        return;
      }
    }

    if (type === 'remove') {
      if (!selectedShelf) {
        alert('Por favor, selecione uma prateleira primeiro.');
        return;
      }
      
      if (selectedShelf.status === 'available') {
        alert('Esta prateleira já está vazia.');
        return;
      }
    }

    setModalState({
      isOpen: true,
      type,
      selectedShelf
    });
  };

  const filteredWarehouses = warehouses.map(warehouse => ({
    ...warehouse,
    shelves: warehouse.shelves.filter(shelf => {
      const matchesSearch = searchTerm === '' || 
        shelf.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shelf.product && shelf.product.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterStatus === 'all' || shelf.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
  }));

  const totalStats = warehouses.reduce((acc, warehouse) => ({
    totalShelves: acc.totalShelves + warehouse.totalShelves,
    availableShelves: acc.availableShelves + warehouse.availableShelves,
    occupiedShelves: acc.occupiedShelves + warehouse.occupiedShelves
  }), { totalShelves: 0, availableShelves: 0, occupiedShelves: 0 });

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <div className="header-title">
            <WarehouseIcon size={40} className="header-icon" />
            <div>
              <h1>Sistema WMS - Gestão de Estoque</h1>
              <p>Sistema de gerenciamento de armazém com prateleiras tipo cinema</p>
            </div>
          </div>
        </div>
      </div>

      <Stats stats={totalStats} />

      <div className="search-filter-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar prateleiras ou produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Todas
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'available' ? 'active' : ''}`}
            onClick={() => setFilterStatus('available')}
          >
            Disponíveis
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'occupied' ? 'active' : ''}`}
            onClick={() => setFilterStatus('occupied')}
          >
            Ocupadas
          </button>
        </div>
      </div>

      <div className="controls">
        <button 
          className="btn btn-primary"
          onClick={() => handleControlButtonClick('add')}
        >
          <Plus size={20} />
          Adicionar Produto
        </button>
        <button 
          className="btn btn-danger"
          onClick={() => handleControlButtonClick('remove')}
        >
          <Minus size={20} />
          Remover Produto
        </button>
        <button 
          className="btn btn-success"
          onClick={() => handleControlButtonClick('edit')}
        >
          <Edit size={20} />
          Editar Produto
        </button>
      </div>

      {selectedShelf && (
        <div className="selected-shelf-info">
          <h3>Prateleira Selecionada: {selectedShelf.position}</h3>
          <p>Status: {selectedShelf.status === 'available' ? 'Disponível' : 'Ocupada'}</p>
          {selectedShelf.product && (
            <p>Produto: {selectedShelf.product.name} ({selectedShelf.product.quantity} {selectedShelf.product.unit})</p>
          )}
        </div>
      )}

      <div className="warehouse-grid">
        {filteredWarehouses.map(warehouse => (
          <div key={warehouse.id} className="warehouse-section">
            <h2 className="warehouse-title">{warehouse.name}</h2>
            <ShelfGrid 
              shelves={warehouse.shelves}
              onShelfClick={(shelf) => handleShelfClick(shelf, warehouse.id)}
              selectedShelf={selectedShelf}
            />
          </div>
        ))}
      </div>

      {modalState.isOpen && (
        <Modal
          type={modalState.type!}
          selectedShelf={modalState.selectedShelf}
          onAdd={handleAddProduct}
          onRemove={handleRemoveProduct}
          onEdit={handleEditProduct}
          onClose={() => setModalState({ isOpen: false, type: null })}
        />
      )}
    </div>
  );
};

export default App; 