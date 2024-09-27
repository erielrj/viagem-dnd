let vehicles = [];

// Função para carregar os veículos do localStorage
function loadVehicles() {
    const storedVehicles = localStorage.getItem('vehicles');
    if (storedVehicles) {
        vehicles = JSON.parse(storedVehicles);
    } else {
        vehicles = [
            { name: 'A Pé (Lento)', speed: 3 },
            { name: 'A Pé (Normal)', speed: 5 },
            { name: 'A Pé (Marcha Rápida)', speed: 6.5 },
            { name: 'Cavalo (Tropeada)', speed: 9.6 },
            { name: 'Cavalo (Galope)', speed: 14.4 },
            { name: 'Carruagem', speed: 8 }
        ];
        saveVehicles();
    }
    renderVehicleList();
    populateVehicleSelect();
}

// Função para salvar os veículos no localStorage
function saveVehicles() {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
}

// Função para calcular o tempo de viagem
function calculateTime() {
    const distance = parseFloat(document.getElementById('distance').value);
    const vehicleSelect = document.getElementById('vehicle');
    const selectedVehicle = vehicleSelect.value;
    const vehicle = vehicles.find(v => v.name === selectedVehicle);
    
    if (!distance || !vehicle) {
        document.getElementById('result').textContent = 'Por favor, insira uma distância válida e selecione um veículo.';
        return;
    }

    const timeInHours = distance / vehicle.speed;
    const days = Math.floor(timeInHours / 24);
    const hours = Math.round(timeInHours % 24);

    document.getElementById('result').textContent = `Tempo de viagem: ${days} dia(s) e ${hours} hora(s).`;
}

// Função para adicionar ou editar um veículo
function addVehicle() {
    const vehicleName = document.getElementById('vehicleName').value;
    const vehicleSpeed = parseFloat(document.getElementById('vehicleSpeed').value);

    if (!vehicleName || !vehicleSpeed) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const existingVehicle = vehicles.find(v => v.name === vehicleName);
    if (existingVehicle) {
        existingVehicle.speed = vehicleSpeed;
        alert('Veículo atualizado com sucesso!');
    } else {
        vehicles.push({ name: vehicleName, speed: vehicleSpeed });
        alert('Veículo adicionado com sucesso!');
    }

    saveVehicles();
    renderVehicleList();
    populateVehicleSelect();
}

// Função para deletar um veículo
function deleteVehicle(vehicleName) {
    vehicles = vehicles.filter(v => v.name !== vehicleName);
    saveVehicles();
    renderVehicleList();
    populateVehicleSelect();
}

// Função para renderizar a lista de veículos
function renderVehicleList() {
    const vehicleList = document.getElementById('vehicleList');
    vehicleList.innerHTML = '';
    vehicles.forEach(vehicle => {
        const li = document.createElement('li');
        li.textContent = `${vehicle.name} - ${vehicle.speed} km/h`;
        
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = () => deleteVehicle(vehicle.name);
        
        li.appendChild(deleteButton);
        vehicleList.appendChild(li);
    });
}

// Função para popular o dropdown de veículos
function populateVehicleSelect() {
    const vehicleSelect = document.getElementById('vehicle');
    vehicleSelect.innerHTML = '';
    vehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.name;
        option.textContent = vehicle.name;
        vehicleSelect.appendChild(option);
    });
}

// Função para exportar os veículos como arquivo JSON
function exportVehicles() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vehicles));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "veiculos_dd.json");
    document.body.appendChild(downloadAnchorNode); // necessário para Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Função para importar os veículos de um arquivo JSON
function importVehicles() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const importedVehicles = JSON.parse(event.target.result);
            if (Array.isArray(importedVehicles)) {
                vehicles = importedVehicles;
                saveVehicles();
                renderVehicleList();
                populateVehicleSelect();
                alert('Veículos importados com sucesso!');
            } else {
                alert('Arquivo JSON inválido.');
            }
        } catch (error) {
            alert('Erro ao ler o arquivo. Certifique-se de que o arquivo está no formato correto.');
        }
    };

    if (file) {
        reader.readAsText(file);
    }
}

loadVehicles();
