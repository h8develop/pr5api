const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Тестовые данные в памяти
let contacts = [
  { id: 1, name: "Иван Иванов", phone: "+79161234567", email: "ivan@mail.ru" },
  { id: 2, name: "Петр Петров", phone: "+79169876543", email: "petr@gmail.com" },
  { id: 3, name: "Мария Сидорова", phone: "+79165554433", email: "maria@yandex.ru" }
];

let nextId = 4;

// API Routes

// GET все контакты
app.get('/api/contacts', (req, res) => {
  console.log('📞 Получен запрос контактов');
  res.json(contacts);
});

// POST новый контакт
app.post('/api/contacts', (req, res) => {
  const { name, phone, email } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }
  
  const newContact = { 
    id: nextId++, 
    name, 
    phone, 
    email: email || '',
    created_at: new Date().toISOString()
  };
  
  contacts.push(newContact);
  console.log('✅ Добавлен контакт:', name);
  res.status(201).json(newContact);
});

// PUT обновить контакт
app.put('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, phone, email } = req.body;
  
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({ error: 'Контакт не найден' });
  }
  
  contacts[contactIndex] = {
    ...contacts[contactIndex],
    name: name || contacts[contactIndex].name,
    phone: phone || contacts[contactIndex].phone,
    email: email || contacts[contactIndex].email
  };
  
  console.log('✏️ Обновлен контакт:', contacts[contactIndex].name);
  res.json(contacts[contactIndex]);
});

// DELETE контакт
app.delete('/api/contacts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const contactIndex = contacts.findIndex(c => c.id === id);
  
  if (contactIndex === -1) {
    return res.status(404).json({ error: 'Контакт не найден' });
  }
  
  const deletedContact = contacts.splice(contactIndex, 1)[0];
  console.log('🗑️ Удален контакт:', deletedContact.name);
  res.json({ message: 'Контакт удален', deleted: deletedContact });
});

// Тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Сервер работает!', 
    contactsCount: contacts.length,
    timestamp: new Date().toISOString()
  });
});

// Serve frontend for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📞 API доступен по http://localhost:${PORT}/api/contacts`);
  console.log(`🧪 Тестовый маршрут: http://localhost:${PORT}/api/test`);
  console.log(`📋 Загружено ${contacts.length} тестовых контактов`);
});