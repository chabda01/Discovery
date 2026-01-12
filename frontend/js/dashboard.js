// Charger et afficher le contenu du dashboard
function loadDashboardContent() {
    const container = document.getElementById('dashboard-content');
    
    container.innerHTML = `
        <div class="p-8 space-y-8">
            <!-- Stats Row -->
            ${renderStatsCards()}
            
            <!-- Dashboard Grid -->
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <!-- Map Column -->
                <div class="xl:col-span-2 space-y-6">
                    ${renderMapCard()}
                </div>
                
                <!-- Analytics & Alerts Column -->
                <div class="space-y-8">
                    ${renderBatteryChart()}
                    ${renderAlertsCard()}
                </div>
            </div>
        </div>
    `;
}

// Render stats cards
function renderStatsCards() {
    const stats = dashboardData.stats;
    
    return `
        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-card-dark p-6 rounded-2xl border border-border-dark relative overflow-hidden group">
                <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <span class="material-symbols-outlined text-8xl">commute</span>
                </div>
                <p class="text-slate-400 text-sm font-medium mb-1">Total Vehicles</p>
                <div class="flex items-baseline gap-2">
                    <p class="text-3xl font-bold text-white">${stats.totalVehicles}</p>
                    <span class="text-primary text-xs font-bold">Steady</span>
                </div>
            </div>
            
            <div class="bg-card-dark p-6 rounded-2xl border border-border-dark relative overflow-hidden group">
                <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-primary">
                    <span class="material-symbols-outlined text-8xl">sensors</span>
                </div>
                <p class="text-slate-400 text-sm font-medium mb-1">Online</p>
                <div class="flex items-baseline gap-2">
                    <p class="text-3xl font-bold text-white">${stats.onlineVehicles}</p>
                    <span class="text-primary text-xs font-bold">+${Math.round((stats.onlineVehicles/stats.totalVehicles)*100)}% active</span>
                </div>
                <div class="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-primary" style="width: ${(stats.onlineVehicles/stats.totalVehicles)*100}%"></div>
                </div>
            </div>
            
            <div class="bg-card-dark p-6 rounded-2xl border border-border-dark relative overflow-hidden group">
                <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-blue-400">
                    <span class="material-symbols-outlined text-8xl">system_update</span>
                </div>
                <p class="text-slate-400 text-sm font-medium mb-1">Updates Available</p>
                <div class="flex items-baseline gap-2">
                    <p class="text-3xl font-bold text-white">${stats.updatesAvailable}</p>
                    <span class="text-blue-400 text-xs font-bold">FOTA Ready</span>
                </div>
            </div>
            
            <div class="bg-card-dark p-6 rounded-2xl border border-border-dark relative overflow-hidden group">
                <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-red-500">
                    <span class="material-symbols-outlined text-8xl">warning</span>
                </div>
                <p class="text-slate-400 text-sm font-medium mb-1">Active Alerts</p>
                <div class="flex items-baseline gap-2">
                    <p class="text-3xl font-bold text-white">${stats.activeAlerts}</p>
                    <span class="text-red-500 text-xs font-bold">Action Req.</span>
                </div>
            </div>
        </section>
    `;
}

// Render map card
function renderMapCard() {
    return `
        <div class="bg-card-dark rounded-2xl border border-border-dark overflow-hidden flex flex-col min-h-[500px]">
            <div class="p-6 border-b border-border-dark flex items-center justify-between bg-white/5">
                <h3 class="font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">explore</span>
                    Fleet Live Tracking
                </h3>
                <div class="flex gap-2">
                    <span class="px-3 py-1 bg-background-dark border border-border-dark rounded-full text-xs font-bold text-primary flex items-center gap-1">
                        <span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                        Live
                    </span>
                </div>
            </div>
            <div class="flex-1 relative">
                <div class="absolute inset-0 grayscale opacity-40 bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBgfPHdg22JaHsHIPO4bLsFatupZopIPkfM7Vu-vZB0zSsEnvsyZBPwZAhTwHWTRF640uKzL7HgYebImu56nr2uQUnl3wWWvbBqkTmY5z1NR843B7BFd41WMBo4-vfd1fcZzZn2y_ieWH_ZVSEN12anFl9vuznIVgEz-mSjZgrGH0xeiriuhP9Hoccp2zVqbB4GD2lqyKxAU67m77HBwTk7aUOwsj2pyJeUtXJw57X4xfQqhQ1Zx4syLjWY1lranqLOAessY-OblXQ");'></div>
                
                ${renderVehicleMarkers()}
                
                <!-- Map Controls -->
                <div class="absolute bottom-6 right-6 flex flex-col gap-2">
                    <button class="w-10 h-10 bg-card-dark border border-border-dark rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all">
                        <span class="material-symbols-outlined">add</span>
                    </button>
                    <button class="w-10 h-10 bg-card-dark border border-border-dark rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all">
                        <span class="material-symbols-outlined">remove</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render vehicle markers
function renderVehicleMarkers() {
    return dashboardData.vehicles.map((vehicle, index) => {
        const positions = ['top-1/3 left-1/4', 'bottom-1/4 right-1/3', 'top-1/2 right-1/4', 'top-2/3 left-1/2'];
        const position = positions[index % positions.length];
        const color = vehicle.status === 'alert' ? 'red-500' : 'primary';
        const glow = vehicle.status !== 'alert' ? 'glow-green' : '';
        
        return `
            <div class="absolute ${position} group cursor-pointer">
                <div class="w-4 h-4 bg-${color} rounded-full border-2 border-background-dark ${glow}"></div>
                <div class="hidden group-hover:block absolute top-6 left-0 bg-background-dark border border-border-dark p-2 rounded-lg text-[10px] w-32 z-20">
                    <p class="font-bold ${vehicle.status === 'alert' ? 'text-red-500' : ''}">${vehicle.name}</p>
                    <p class="text-slate-400">${vehicle.status === 'alert' ? 'Stationary • Alert' : `Moving • ${vehicle.speed}km/h`}</p>
                    <p class="text-slate-400">Battery: ${vehicle.battery}%</p>
                </div>
            </div>
        `;
    }).join('');
}

// Render battery chart
function renderBatteryChart() {
    return `
        <div class="bg-card-dark rounded-2xl border border-border-dark p-6 overflow-hidden">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Health Performance</p>
                    <h3 class="text-xl font-bold">Average Battery</h3>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-primary">78%</p>
                    <p class="text-red-400 text-xs font-medium">-2% vs yesterday</p>
                </div>
            </div>
            <div class="h-32 w-full mt-4">
                <svg class="w-full h-full overflow-visible" viewBox="0 0 400 100">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="#00e663" stop-opacity="0.3"/>
                            <stop offset="100%" stop-color="#00e663" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                    <path d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20 L400,100 L0,100 Z" fill="url(#chartGradient)"/>
                    <path d="M0,80 Q50,40 100,60 T200,30 T300,50 T400,20" fill="none" stroke="#00e663" stroke-linecap="round" stroke-width="3"/>
                </svg>
            </div>
            <div class="flex justify-between mt-4 text-[10px] text-slate-500 font-bold uppercase">
                <span>00:00</span>
                <span>08:00</span>
                <span>16:00</span>
                <span>23:59</span>
            </div>
        </div>
    `;
}

// Render alerts card
function renderAlertsCard() {
    return `
        <div class="bg-card-dark rounded-2xl border border-border-dark overflow-hidden">
            <div class="p-6 border-b border-border-dark bg-white/5 flex items-center justify-between">
                <h3 class="font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-red-500">campaign</span>
                    Critical Alerts
                </h3>
                <button class="text-xs font-bold text-primary hover:underline">View All</button>
            </div>
            <div class="divide-y divide-border-dark">
                ${dashboardData.alerts.map(alert => renderAlertItem(alert)).join('')}
            </div>
        </div>
    `;
}

// Render single alert item
function renderAlertItem(alert) {
    return `
        <div class="p-4 hover:bg-white/5 transition-all flex gap-4">
            <div class="w-10 h-10 rounded-xl bg-${alert.color}-500/10 flex items-center justify-center text-${alert.color}-500 shrink-0">
                <span class="material-symbols-outlined text-lg">${alert.icon}</span>
            </div>
            <div class="flex-1">
                <div class="flex justify-between items-start mb-1">
                    <h4 class="text-sm font-bold">${alert.title}</h4>
                    <span class="text-[10px] font-medium text-slate-500">${alert.time}</span>
                </div>
                <p class="text-xs text-slate-400">${alert.description}</p>
            </div>
        </div>
    `;
}