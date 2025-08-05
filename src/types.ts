export interface ShelfItem {
  id: string;
  position: string;
  status: 'available' | 'occupied';
  product?: Product;
  lastUpdated: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  category: string;
  description?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  shelves: ShelfItem[];
  totalShelves: number;
  availableShelves: number;
  occupiedShelves: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'add' | 'remove' | 'edit' | null;
  selectedShelf?: ShelfItem;
} 