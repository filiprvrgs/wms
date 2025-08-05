import React from 'react';
import { ShelfItem } from '../types';
import { Package, PackageX } from 'lucide-react';

interface ShelfGridProps {
  shelves: ShelfItem[];
  onShelfClick: (shelf: ShelfItem) => void;
  selectedShelf: ShelfItem | null;
}

const ShelfGrid: React.FC<ShelfGridProps> = ({ shelves, onShelfClick, selectedShelf }) => {
  return (
    <div className="shelf-grid">
      {shelves.map((shelf) => (
        <div
          key={shelf.id}
          className={`shelf-item ${shelf.status} ${
            selectedShelf?.id === shelf.id ? 'selected' : ''
          }`}
          onClick={() => onShelfClick(shelf)}
          title={`${shelf.position} - ${shelf.status === 'available' ? 'Disponível' : 'Ocupado'}${
            shelf.product ? ` - ${shelf.product.name}` : ''
          }`}
        >
          {shelf.status === 'available' ? (
            <PackageX size={16} />
          ) : (
            <Package size={16} />
          )}
          <span style={{ fontSize: '0.7rem', marginLeft: '4px' }}>
            {shelf.position}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ShelfGrid; 