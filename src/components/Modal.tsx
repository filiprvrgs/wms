import React, { useState, useEffect } from 'react';
import { ShelfItem, Product } from '../types';
import { X, Save, Trash2, Package } from 'lucide-react';

interface ModalProps {
  type: 'add' | 'remove' | 'edit';
  selectedShelf?: ShelfItem;
  onAdd: (productData: Omit<Product, 'id'>) => void;
  onRemove: () => void;
  onEdit: (productData: Product) => void;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ 
  type, 
  selectedShelf, 
  onAdd, 
  onRemove, 
  onEdit, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 1,
    unit: 'un',
    category: '',
    description: ''
  });

  useEffect(() => {
    if (type === 'edit' && selectedShelf?.product) {
      setFormData({
        name: selectedShelf.product.name,
        sku: selectedShelf.product.sku,
        quantity: selectedShelf.product.quantity,
        unit: selectedShelf.product.unit,
        category: selectedShelf.product.category,
        description: selectedShelf.product.description || ''
      });
    }
  }, [type, selectedShelf]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'add') {
      onAdd(formData);
    } else if (type === 'edit' && selectedShelf?.product) {
      onEdit({
        ...selectedShelf.product,
        ...formData
      });
    }
  };

  const handleRemove = () => {
    if (window.confirm('Tem certeza que deseja remover este produto?')) {
      onRemove();
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'add':
        return 'Adicionar Produto';
      case 'remove':
        return 'Remover Produto';
      case 'edit':
        return 'Editar Produto';
      default:
        return '';
    }
  };

  const getModalContent = () => {
    switch (type) {
      case 'add':
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">SKU</label>
              <input
                type="text"
                className="form-input"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Quantidade</label>
              <input
                type="number"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Unidade</label>
              <select
                className="form-input"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="un">Unidade</option>
                <option value="kg">Quilograma</option>
                <option value="l">Litro</option>
                <option value="m">Metro</option>
                <option value="caixa">Caixa</option>
                <option value="pallet">Pallet</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <input
                type="text"
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Descrição (opcional)</label>
              <textarea
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn btn-danger" onClick={onClose}>
                <X size={20} />
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                <Save size={20} />
                Salvar
              </button>
            </div>
          </form>
        );

      case 'remove':
        return (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Package size={64} color="#ff6b6b" />
            </div>
            <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.1rem' }}>
              Tem certeza que deseja remover o produto <strong>{selectedShelf?.product?.name}</strong> 
              da prateleira <strong>{selectedShelf?.position}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={onClose}>
                <X size={20} />
                Cancelar
              </button>
              <button className="btn btn-success" onClick={handleRemove}>
                <Trash2 size={20} />
                Remover
              </button>
            </div>
          </div>
        );

      case 'edit':
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">SKU</label>
              <input
                type="text"
                className="form-input"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Quantidade</label>
              <input
                type="number"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Unidade</label>
              <select
                className="form-input"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="un">Unidade</option>
                <option value="kg">Quilograma</option>
                <option value="l">Litro</option>
                <option value="m">Metro</option>
                <option value="caixa">Caixa</option>
                <option value="pallet">Pallet</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <input
                type="text"
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Descrição (opcional)</label>
              <textarea
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="modal-actions">
              <button type="button" className="btn btn-danger" onClick={onClose}>
                <X size={20} />
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                <Save size={20} />
                Salvar
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{getModalTitle()}</h2>
        {getModalContent()}
      </div>
    </div>
  );
};

export default Modal; 