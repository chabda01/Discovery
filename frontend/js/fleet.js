// Données de la flotte (à ajouter dans data.js aussi)
const fleetData = {
    stats: {
        totalVehicles: 1240,
        activeNow: 1102,
        lowBattery: 14,
        totalChange: '+2.4%',
        activeChange: '+5.1%',
        batteryChange: '-3.2%'
    },
    
    vehicles: [
        {
            id: 'moto-001',
            name: 'Moto 001',
            vin: '4291-ZX-23',
            type: 'moped',
            status: 'online',
            battery: 85,
            firmware: 'v1.0.4-stable'
        },
        {
            id: 'bus-005',
            name: 'Bus 005',
            vin: '9812-AF-99',
            type: 'directions_bus',
            status: 'offline',
            battery: 12,
            firmware: 'v0.9.8-beta'
        },
        {
            id: 'car-088',
            name: 'Car 088',
            vin: '1104-BB-12',
            type: 'directions_car',
            status: 'online',
            battery: 65,
            firmware: 'v1.0.4-stable'
        },
        {
            id: 'moto-002',
            name: 'Moto 002',
            vin: '4291-ZX-24',
            type: 'moped',
            status: 'online',
            battery: 92,
            firmware: 'v1.1.0-deploying'
        },
        {
            id: 'car-045',
            name: 'Car 045',
            vin: '7721-CD-45',
            type: 'directions_car',
            status: 'online',
            battery: 78,
            firmware: 'v1.0.4-stable'
        },
        {
            id: 'bus-012',
            name: 'Bus 012',
            vin: '3321-BX-88',
            type: 'directions_bus',
            status: 'online',
            battery: 56,
            firmware: 'v1.0.3-stable'
        }
    ],
    
    filters: {
        all: true,
        motos: false,
        cars: false,
        buses: false,
        online: false
    }
};

// État courant des filtres
let currentFilter = 'all';
let currentPage = 1;
const itemsPerPage = 10;

// Charger le contenu de la page Fleet
function loadFleetContent() {
    renderFleetStats();
    renderFleetControls();
    renderFleetTable();
}

// Render stats cards
function renderFleetStats() {
    const container = document.getElementById('fleet-stats');
    const stats = fleetData.stats;
    
    container.innerHTML = `
        <div class="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-border-dark flex flex-col gap-1 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Vehicles</p>
            <div class="flex items-end justify-between">
                <h3 class="text-3xl font-bold">${stats.totalVehicles.toLocaleString()}</h3>
                <span class="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-lg">${stats.totalChange}</span>
            </div>
        </div>
        
        <div class="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-border-dark flex flex-col gap-1 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Now</p>
            <div class="flex items-end justify-between">
                <h3 class="text-3xl font-bold">${stats.activeNow.toLocaleString()}</h3>
                <span class="text-primary text-sm font-bold bg-primary/10 px-2 py-1 rounded-lg">${stats.activeChange}</span>
            </div>
        </div>
        
        <div class="bg-white dark:bg-card-dark p-6 rounded-2xl border border-slate-200 dark:border-border-dark flex flex-col gap-1 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">Low Battery Alerts</p>
            <div class="flex items-end justify-between">
                <h3 class="text-3xl font-bold">${stats.lowBattery}</h3>
                <span class="text-red-500 text-sm font-bold bg-red-500/10 px-2 py-1 rounded-lg">${stats.batteryChange}</span>
            </div>
        </div>
    `;
}

// Render filter controls
function renderFleetControls() {
    const container = document.getElementById('fleet-controls');
    
    container.innerHTML = `
        <div class="flex gap-2">
            <button onclick="filterVehicles('all')" class="filter-btn px-5 py-2 rounded-xl ${currentFilter === 'all' ? 'bg-primary text-background-dark' : 'bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark'} font-bold text-sm flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-lg">check_circle</span>
                All Vehicles
            </button>
            <button onclick="filterVehicles('motos')" class="filter-btn px-5 py-2 rounded-xl ${currentFilter === 'motos' ? 'bg-primary text-background-dark' : 'bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark'} font-semibold text-sm flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-lg">moped</span>
                Motos
            </button>
            <button onclick="filterVehicles('cars')" class="filter-btn px-5 py-2 rounded-xl ${currentFilter === 'cars' ? 'bg-primary text-background-dark' : 'bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark'} font-semibold text-sm flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-lg">directions_car</span>
                Cars
            </button>
            <button onclick="filterVehicles('buses')" class="filter-btn px-5 py-2 rounded-xl ${currentFilter === 'buses' ? 'bg-primary text-background-dark' : 'bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark'} font-semibold text-sm flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-lg">directions_bus</span>
                Buses
            </button>
            <div class="w-px h-8 bg-slate-200 dark:bg-border-dark mx-2"></div>
            <button onclick="filterVehicles('online')" class="filter-btn px-5 py-2 rounded-xl ${currentFilter === 'online' ? 'bg-primary text-background-dark' : 'bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark'} font-semibold text-sm flex items-center gap-2 transition-all">
                <span class="material-symbols-outlined text-lg">sensors</span>
                Online
            </button>
        </div>
        <div class="flex gap-3">
            <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card-dark rounded-xl text-sm font-semibold border border-slate-200 dark:border-border-dark hover:border-primary transition-all">
                <span class="material-symbols-outlined text-lg">filter_list</span>
                More Filters
            </button>
            <button class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card-dark rounded-xl text-sm font-semibold border border-slate-200 dark:border-border-dark hover:border-primary transition-all">
                <span class="material-symbols-outlined text-lg">download</span>
                Export
            </button>
        </div>
    `;
}

// Filter vehicles
function filterVehicles(filter) {
    currentFilter = filter;
    renderFleetControls();
    renderFleetTable();
}

// Get filtered vehicles
function getFilteredVehicles() {
    if (currentFilter === 'all') {
        return fleetData.vehicles;
    }
    
    if (currentFilter === 'online') {
        return fleetData.vehicles.filter(v => v.status === 'online');
    }
    
    if (currentFilter === 'motos') {
        return fleetData.vehicles.filter(v => v.type === 'moped');
    }
    
    if (currentFilter === 'cars') {
        return fleetData.vehicles.filter(v => v.type === 'directions_car');
    }
    
    if (currentFilter === 'buses') {
        return fleetData.vehicles.filter(v => v.type === 'directions_bus');
    }
    
    return fleetData.vehicles;
}

// Render fleet table
function renderFleetTable() {
    const container = document.getElementById('fleet-table');
    const vehicles = getFilteredVehicles();
    
    container.innerHTML = `
        <div class="bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-border-dark overflow-hidden">
            <table class="w-full text-left">
                <thead>
                    <tr class="bg-slate-50 dark:bg-[#1b2820] border-b border-slate-200 dark:border-border-dark">
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Vehicle</th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Battery</th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Firmware</th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-border-dark">
                    ${vehicles.map(vehicle => renderVehicleRow(vehicle)).join('')}
                </tbody>
            </table>
            <div class="px-6 py-4 bg-slate-50 dark:bg-[#1b2820] flex items-center justify-between border-t border-slate-200 dark:border-border-dark">
                <p class="text-sm text-slate-500 dark:text-slate-400">Showing ${vehicles.length} of ${fleetData.stats.totalVehicles.toLocaleString()} vehicles</p>
                <div class="flex gap-2">
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark">
                        <span class="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-background-dark font-bold text-sm">1</button>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-card-dark text-sm border border-slate-200 dark:border-border-dark">2</button>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-card-dark text-sm border border-slate-200 dark:border-border-dark">3</button>
                    <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark">
                        <span class="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render single vehicle row
function renderVehicleRow(vehicle) {
    const batteryColor = vehicle.battery < 20 ? 'red-500' : 'primary';
    const statusClass = vehicle.status === 'online' ? 'status-pulse' : 'status-pulse status-offline';
    
    return `
        <tr class="hover:bg-slate-50 dark:hover:bg-[#1b2820]/50 transition-colors">
            <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined">${vehicle.type}</span>
                    </div>
                    <div>
                        <p class="font-bold text-sm">${vehicle.name}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400">VIN: ${vehicle.vin}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-5">
                <span class="${statusClass} text-xs font-bold uppercase tracking-wide ml-4 ${vehicle.status === 'offline' ? 'text-slate-500' : ''}">${vehicle.status}</span>
            </td>
            <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                    <div class="flex-1 max-w-[120px] h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-${batteryColor}" style="width: ${vehicle.battery}%;"></div>
                    </div>
                    <p class="text-sm font-bold ${vehicle.battery < 20 ? 'text-red-500' : ''}">${vehicle.battery}%</p>
                </div>
            </td>
            <td class="px-6 py-5">
                <span class="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-mono text-slate-600 dark:text-slate-300">${vehicle.firmware}</span>
            </td>
            <td class="px-6 py-5 text-right">
                <button onclick="viewVehicleDetails('${vehicle.id}')" class="text-primary hover:text-primary/80 font-bold text-sm transition-colors uppercase tracking-wide">View Details</button>
            </td>
        </tr>
    `;
}

// View vehicle details
function viewVehicleDetails(vehicleId) {
    console.log('View details for:', vehicleId);
    // TODO: Implémenter la modal de détails
    alert(`Details for vehicle: ${vehicleId}`);
}

// Initialiser la page au chargement
document.addEventListener('DOMContentLoaded', () => {
    loadFleetContent();
});