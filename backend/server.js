const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Для CORS
const { connectDB } = require('./db'); 
const productRoutes = require('./routes/productRoutes'); 

dotenv.config();

const app = express();
const PORT = 5001;
const HOST = '0.0.0.0';
// Підключення до БД
connectDB(); 

// 2. Проміжне ПЗ (Middleware)
app.use(cors(
    {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
    }
)); // Дозволяємо доступ з фронтенду
app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

app.get('/', (req, res) => {
    res.send('Сервер працює!');
});

// 3. Підключення маршрутів
app.use('/api/products', productRoutes);

// 4. Запускаємо сервер
app.listen(PORT, HOST, () => {
    console.log(`Сервер запущено на ${HOST}:${PORT}`);
});