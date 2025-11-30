// frontend/script.js
const API_URL = 'http://192.168.2.100:5001/api/products';
const form = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const quantityInput = document.getElementById('quantity');
const productIdInput = document.getElementById('product-id');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');
const inventoryBody = document.querySelector('#inventory-list tbody');

// 1. Отримати та відобразити всі товари
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();
        
        inventoryBody.innerHTML = ''; // Очистити список
        products.forEach(product => {
            const row = inventoryBody.insertRow();
            
            row.insertCell().textContent = product.id;
            row.insertCell().textContent = product.name;
            row.insertCell().textContent = product.quantity;
            
            const actionsCell = row.insertCell();
            
            // Кнопка "Оновити"
            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'Оновити';
            updateBtn.onclick = () => loadProductForUpdate(product);
            
            // Кнопка "Видалити"
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Видалити';
            deleteBtn.onclick = () => deleteProduct(product.id, product.name);

            actionsCell.appendChild(updateBtn);
            actionsCell.appendChild(deleteBtn);
        });

    } catch (error) {
        console.error('Помилка завантаження товарів:', error);
        alert('Помилка завантаження товарів. Перевірте, чи запущено бекенд.');
    }
}

// 2. Додати або Оновити товар (обробник форми)
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = productIdInput.value;
    const name = nameInput.value;
    const quantity = parseInt(quantityInput.value); // Перетворюємо на число

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, quantity })
        });

        const result = await response.json();

        if (!response.ok) {
            // Обробка помилок (наприклад, товар вже існує)
            alert(`Помилка: ${result.message || response.statusText}`);
            return;
        }

        // Успішно створено/оновлено
        alert(`Товар успішно ${id ? 'оновлено' : 'додано'}!`);
        resetForm();
        fetchProducts(); // Перезавантажуємо список

    } catch (error) {
        console.error(`Помилка ${method}:`, error);
        alert('Сталася помилка при роботі з API.');
    }
});

// 3. Завантажити дані товару у форму для оновлення
function loadProductForUpdate(product) {
    productIdInput.value = product.id;
    nameInput.value = product.name;
    quantityInput.value = product.quantity;
    submitButton.textContent = 'Оновити Товар';
    cancelButton.style.display = 'inline';
}

// 4. Скасувати оновлення
cancelButton.addEventListener('click', resetForm);

function resetForm() {
    form.reset();
    productIdInput.value = '';
    submitButton.textContent = 'Додати Товар';
    cancelButton.style.display = 'none';
}

// 5. Видалити товар
async function deleteProduct(id, name) {
    if (!confirm(`Ви впевнені, що хочете видалити "${name}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
             alert(`Помилка видалення: ${result.message || response.statusText}`);
             return;
        }

        alert(`Товар "${name}" видалено.`);
        fetchProducts(); // Оновити список
        
    } catch (error) {
        console.error('Помилка видалення:', error);
        alert('Сталася помилка при видаленні товару.');
    }
}

// Завантажити товари при завантаженні сторінки
document.addEventListener('DOMContentLoaded', fetchProducts);