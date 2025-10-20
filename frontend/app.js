class PhoneBook {
    constructor() {
        this.contacts = [];
        this.init();
    }

    async init() {
        await this.loadContacts();
        this.setupEventListeners();
    }

    async loadContacts() {
        try {
            const response = await fetch('/api/contacts');
            this.contacts = await response.json();
            this.renderContacts();
        } catch (error) {
            console.error('Ошибка загрузки контактов:', error);
        }
    }

    renderContacts() {
        const contactsList = document.getElementById('contactsList');
        
        if (this.contacts.length === 0) {
            contactsList.innerHTML = '<p class="text-muted">Контактов пока нет</p>';
            return;
        }

        contactsList.innerHTML = this.contacts.map(contact => `
            <div class="contact-item p-3 mb-2 bg-white rounded shadow-sm">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="mb-1">${contact.name}</h6>
                        <p class="mb-1 text-muted">📞 ${contact.phone}</p>
                        ${contact.email ? `<p class="mb-0 text-muted">✉️ ${contact.email}</p>` : ''}
                    </div>
                    <div class="col-md-4 text-end">
                        <div class="btn-group">
                            <button class="btn btn-warning btn-sm" onclick="phoneBook.editContact('${contact._id}')">
                                ✏️
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="phoneBook.deleteContact('${contact._id}')">
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async addContact(event) {
        event.preventDefault();
        
        const contact = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        };

        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
            });

            if (response.ok) {
                document.getElementById('contactForm').reset();
                await this.loadContacts();
            }
        } catch (error) {
            console.error('Ошибка добавления:', error);
        }
    }

    async deleteContact(id) {
        if (confirm('Удалить контакт?')) {
            try {
                await fetch(`/api/contacts/${id}`, {
                    method: 'DELETE'
                });
                await this.loadContacts();
            } catch (error) {
                console.error('Ошибка удаления:', error);
            }
        }
    }

    async editContact(id) {
        const contact = this.contacts.find(c => c._id === id);
        const newName = prompt('Новое имя:', contact.name);
        const newPhone = prompt('Новый телефон:', contact.phone);
        const newEmail = prompt('Новый email:', contact.email);

        if (newName && newPhone) {
            try {
                await fetch(`/api/contacts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: newName,
                        phone: newPhone,
                        email: newEmail
                    })
                });
                await this.loadContacts();
            } catch (error) {
                console.error('Ошибка редактирования:', error);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('contactForm').addEventListener('submit', (e) => this.addContact(e));
    }
}

// Инициализация приложения
const phoneBook = new PhoneBook();