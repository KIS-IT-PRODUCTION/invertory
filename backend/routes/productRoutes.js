// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { getDB } = require('../db'); 

// 1. Отримати всі товари (GET /api/products)
const getProducts = async (req, res) => {
    const db = getDB();
    try {
        const products = await db.all('SELECT * FROM Products ORDER BY id DESC');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Створити товар (POST /api/products)
const createProduct = async (req, res) => {
    const db = getDB();
    const { name, quantity } = req.body;

    // Валідація
    if (!name || quantity === undefined) {
        return res.status(400).json({ message: 'Будь ласка, додайте назву та кількість товару' });
    }
    if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Кількість має бути невід\'ємним числом' });
    }

    try {
        const result = await db.run(
            'INSERT INTO Products (name, quantity) VALUES (?, ?)',
            [name, quantity]
        );
        const newProduct = await db.get('SELECT * FROM Products WHERE id = ?', result.lastID);
        res.status(201).json(newProduct);
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ message: `Товар з назвою "${name}" вже існує.` });
        }
        res.status(500).json({ message: error.message });
    }
};

// 3. Оновити товар (PUT /api/products/:id)
const updateProduct = async (req, res) => {
    const db = getDB();
    const id = req.params.id;
    const { name, quantity } = req.body;

    if (!name && quantity === undefined) {
         return res.status(400).json({ message: 'Немає даних для оновлення' });
    }

    try {
        const existingProduct = await db.get('SELECT * FROM Products WHERE id = ?', id);
        if (!existingProduct) {
            return res.status(404).json({ message: `Товар з ID ${id} не знайдено` });
        }

        // Використовуємо існуючі значення, якщо нові не надані
        const newName = name !== undefined ? name : existingProduct.name;
        const newQuantity = quantity !== undefined ? quantity : existingProduct.quantity;

        // Повторна валідація кількості
        if (typeof newQuantity !== 'number' || newQuantity < 0) {
            return res.status(400).json({ message: 'Кількість має бути невід\'ємним числом' });
        }
        
        await db.run(
            'UPDATE Products SET name = ?, quantity = ? WHERE id = ?',
            [newName, newQuantity, id]
        );

        const updatedProduct = await db.get('SELECT * FROM Products WHERE id = ?', id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Видалити товар (DELETE /api/products/:id)
const deleteProduct = async (req, res) => {
    const db = getDB();
    const id = req.params.id;

    try {
        const result = await db.run('DELETE FROM Products WHERE id = ?', id);
        
        if (result.changes === 0) {
            return res.status(404).json({ message: `Товар з ID ${id} не знайдено` });
        }
        
        res.status(200).json({ id: id, message: `Товар з ID ${id} видалено успішно` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Визначення Ендпойнтів ---
router.route('/').get(getProducts).post(createProduct);
router.route('/:id').put(updateProduct).delete(deleteProduct);

module.exports = router;