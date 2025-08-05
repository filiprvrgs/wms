import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));

// Dados do armazém em memória
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

// Gerar dados iniciais
function initializeWarehouse() {
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
                    warehouseData.products.set(`PROD-${Math.floor(Math.random() * 1000)}`, {
                        id: `PROD-${Math.floor(Math.random() * 1000)}`,
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
}

// Rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/warehouse', (req, res) => {
    const stats = {
        total: warehouseData.shelves.size,
        available: Array.from(warehouseData.shelves.values()).filter(s => s.status === 'available').length,
        occupied: Array.from(warehouseData.shelves.values()).filter(s => s.status === 'occupied').length,
        occupancyRate: ((Array.from(warehouseData.shelves.values()).filter(s => s.status === 'occupied').length / warehouseData.shelves.size) * 100).toFixed(1)
    };

    res.json({
        aisles: warehouseData.aisles,
        shelves: Array.from(warehouseData.shelves.values()),
        products: Array.from(warehouseData.products.values()),
        stats,
        transactions: warehouseData.transactions.slice(-50) // Últimas 50 transações
    });
});

app.post('/api/shelf/:position/occupy', (req, res) => {
    const { position } = req.params;
    const { name, sku, quantity, unit, category, description } = req.body;

    const shelf = warehouseData.shelves.get(position);
    if (!shelf) {
        return res.status(404).json({ error: 'Prateleira não encontrada' });
    }

    if (shelf.status === 'occupied') {
        return res.status(400).json({ error: 'Prateleira já está ocupada' });
    }

    const productId = `PROD-${Date.now()}`;
    const product = {
        id: productId,
        name,
        sku,
        quantity: parseInt(quantity),
        unit,
        category,
        description,
        position,
        createdAt: new Date().toISOString()
    };

    warehouseData.products.set(productId, product);
    warehouseData.shelves.set(position, {
        ...shelf,
        status: 'occupied',
        productId,
        lastUpdated: new Date().toISOString()
    });

    warehouseData.transactions.push({
        id: `TXN-${Date.now()}`,
        type: 'add',
        position,
        productId,
        timestamp: new Date().toISOString(),
        details: `Produto ${name} adicionado à prateleira ${position}`
    });

    res.json({ success: true, product, shelf: warehouseData.shelves.get(position) });
});

app.post('/api/shelf/:position/vacate', (req, res) => {
    const { position } = req.params;
    const shelf = warehouseData.shelves.get(position);

    if (!shelf) {
        return res.status(404).json({ error: 'Prateleira não encontrada' });
    }

    if (shelf.status === 'available') {
        return res.status(400).json({ error: 'Prateleira já está vazia' });
    }

    const product = warehouseData.products.get(shelf.productId);
    warehouseData.products.delete(shelf.productId);

    warehouseData.shelves.set(position, {
        ...shelf,
        status: 'available',
        productId: null,
        lastUpdated: new Date().toISOString()
    });

    warehouseData.transactions.push({
        id: `TXN-${Date.now()}`,
        type: 'remove',
        position,
        productId: shelf.productId,
        timestamp: new Date().toISOString(),
        details: `Produto removido da prateleira ${position}`
    });

    res.json({ success: true, shelf: warehouseData.shelves.get(position) });
});

app.put('/api/product/:id', (req, res) => {
    const { id } = req.params;
    const { name, sku, quantity, unit, category, description } = req.body;

    const product = warehouseData.products.get(id);
    if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const updatedProduct = {
        ...product,
        name,
        sku,
        quantity: parseInt(quantity),
        unit,
        category,
        description,
        updatedAt: new Date().toISOString()
    };

    warehouseData.products.set(id, updatedProduct);

    warehouseData.transactions.push({
        id: `TXN-${Date.now()}`,
        type: 'edit',
        position: product.position,
        productId: id,
        timestamp: new Date().toISOString(),
        details: `Produto ${name} editado na prateleira ${product.position}`
    });

    res.json({ success: true, product: updatedProduct });
});

app.get('/api/search', (req, res) => {
    const { q, filter } = req.query;
    let results = Array.from(warehouseData.shelves.values());

    if (q) {
        results = results.filter(shelf => 
            shelf.position.toLowerCase().includes(q.toLowerCase()) ||
            (shelf.productId && warehouseData.products.get(shelf.productId)?.name.toLowerCase().includes(q.toLowerCase()))
        );
    }

    if (filter && filter !== 'all') {
        results = results.filter(shelf => shelf.status === filter);
    }

    res.json(results);
});

// Inicializar dados
initializeWarehouse();

// Para Vercel
export default app; 