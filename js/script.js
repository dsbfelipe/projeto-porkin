document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const createGroupForm = document.getElementById('create-group-form');
    const addTransactionForm = document.getElementById('add-transaction-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (createGroupForm) {
        loadContacts();
        createGroupForm.addEventListener('submit', handleCreateGroup);
    }

    if (addTransactionForm) {
        addTransactionForm.addEventListener('submit', handleAddTransaction);
    }

    if (document.getElementById('recent-transactions')) {
        loadRecentTransactions();
    }

    if (document.getElementById('groups-list')) {
        loadGroups();
    }

    if (document.getElementById('group-details')) {
        loadGroupDetails();
    }
});

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    localStorage.setItem('currentUser', username);
    window.location.href = 'dashboard.html';
}

function loadContacts() {
    const contacts = [
        'Alice', 'Bob', 'Carlos', 'Diana', 'Eduardo', 'Fernanda', 'Gabriel', 'Heloísa',
        'Igor', 'Juliana', 'Kleber', 'Larissa', 'Marcelo', 'Natália', 'Otávio', 'Paula',
        'Rafael', 'Sônia', 'Thiago', 'Vanessa', 'William', 'Yasmin', 'Zeca'
    ];

    const groupMembersSelect = document.getElementById('group-members');

    contacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact;
        option.textContent = contact;
        groupMembersSelect.appendChild(option);
    });
}


function handleCreateGroup(event) {
    event.preventDefault();
    const groupName = document.getElementById('group-name').value;
    const groupDescription = document.getElementById('group-description').value;
    const groupMembers = Array.from(document.getElementById('group-members').selectedOptions).map(option => option.value);

    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    groups.push({ name: groupName, description: groupDescription, members: groupMembers, transactions: [] });
    localStorage.setItem('groups', JSON.stringify(groups));

    window.location.href = 'list-groups.html';
}

function loadGroups() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const groupsList = document.getElementById('groups-list');

    groups.forEach(group => {
        const div = document.createElement('div');
        div.classList.add('group');
        div.innerHTML = `<h2>${group.name}</h2><p>${group.description}</p><a href="view-group.html" onclick="viewGroup('${group.name}')">Ver Grupo</a>`;
        groupsList.appendChild(div);
    });
}

function viewGroup(groupName) {
    localStorage.setItem('currentGroup', groupName);
}

function loadGroupDetails() {
    const groupName = localStorage.getItem('currentGroup');
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const group = groups.find(g => g.name === groupName);
    const currentUser = localStorage.getItem('currentUser');

    if (group) {
        document.getElementById('group-name').textContent = group.name;
        const membersList = document.getElementById('group-members-list');
        membersList.innerHTML = ''; // Limpa os membros existentes
        group.members.forEach(member => {
            const li = document.createElement('li');
            li.textContent = member;
            if (member === currentUser) {
                li.textContent += ' (você)';
            }
            membersList.appendChild(li);
        });

        const transactionsDiv = document.getElementById('group-transactions');
        transactionsDiv.innerHTML = ''; // Limpa as transações existentes
        group.transactions.slice(-5).forEach(transaction => {
            const div = document.createElement('div');
            div.classList.add('transaction');
            div.innerHTML = `<p>${transaction.name}: R$${transaction.value} - ${transaction.user}</p>`;
            transactionsDiv.appendChild(div);
        });
    }
}


function handleAddTransaction(event) {
    event.preventDefault();
    const transactionName = document.getElementById('transaction-name').value;
    const transactionValue = parseFloat(document.getElementById('transaction-value').value);
    const currentUser = localStorage.getItem('currentUser');
    const currentGroup = localStorage.getItem('currentGroup');

    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const group = groups.find(g => g.name === currentGroup);

    if (group) {
        group.transactions.push({ name: transactionName, value: transactionValue, user: currentUser });
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    window.location.href = 'view-group.html';
}
function loadRecentTransactions() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const recentTransactionsDiv = document.getElementById('recent-transactions');

    recentTransactionsDiv.innerHTML = ''; // Limpa as transações existentes

    groups.forEach(group => {
        group.transactions.slice(-1).forEach(transaction => {
            const div = document.createElement('div');
            div.classList.add('transaction');
            div.innerHTML = `<p>${transaction.user} em ${group.name}: ${transaction.name} - R$${transaction.value}</p>`;
            recentTransactionsDiv.appendChild(div);
        });
    });
}

// Carrega as últimas transações ao carregar a página
loadRecentTransactions();


function loadGroupDetails() {
    const groupName = localStorage.getItem('currentGroup');
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const group = groups.find(g => g.name === groupName);

    if (group) {
        document.getElementById('group-name').textContent = group.name;
        const membersList = document.getElementById('group-members-list');
        membersList.innerHTML = ''; // Limpa os membros existentes
        group.members.forEach(member => {
            const li = document.createElement('li');
            li.textContent = member;
            membersList.appendChild(li);
        });

        const transactionsDiv = document.getElementById('group-transactions');
        transactionsDiv.innerHTML = ''; // Limpa as transações existentes
        group.transactions.slice(-5).forEach(transaction => {
            const div = document.createElement('div');
            div.classList.add('transaction');
            div.innerHTML = `<p>${transaction.name}: R$${transaction.value} - ${transaction.user}</p>`;
            transactionsDiv.appendChild(div);
        });
    }
}

// Chama a função de carregamento regularmente para atualizar as transações
setInterval(() => {
    if (document.getElementById('recent-transactions')) {
        loadRecentTransactions();
    }

    if (document.getElementById('group-details')) {
        loadGroupDetails();
    }
}, 5000);


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomElement(array) {
    return array[getRandomInt(0, array.length)];
}

function generateRandomTransaction() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    if (groups.length === 0) return;

    const randomGroup = getRandomElement(groups);
    const randomUser = getRandomElement(randomGroup.members);
    const transactionNames = ['Compra de supermercado', 'Jantar', 'Cinema', 'Gasolina', 'Farmácia'];
    const transactionName = getRandomElement(transactionNames);
    const transactionValue = getRandomInt(10, 200);  // Valores aleatórios entre 10 e 200

    const newTransaction = {
        name: transactionName,
        value: transactionValue,
        user: randomUser
    };

    randomGroup.transactions.push(newTransaction);
    localStorage.setItem('groups', JSON.stringify(groups));

    console.log(`Transação aleatória gerada: ${randomUser} em ${randomGroup.name} - ${transactionName}: R$${transactionValue}`);
}

// Gera uma transação aleatória a cada 10 segundos
setInterval(generateRandomTransaction, 10000);
