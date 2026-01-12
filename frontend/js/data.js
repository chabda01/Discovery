// Mock data pour le dashboard
const dashboardData = {
    stats: {
        totalVehicles: 15,
        onlineVehicles: 12,
        updatesAvailable: 2,
        activeAlerts: 1
    },
    
    vehicles: [
        {
            id: 'moto-001',
            name: 'Moto 001',
            status: 'alert',
            battery: 12,
            location: { lat: 5.6037, lon: -0.1870 },
            speed: 0,
            firmware: 'v2.0.1'
        },
        {
            id: 'moto-005',
            name: 'Moto 005',
            status: 'online',
            battery: 78,
            location: { lat: 5.6200, lon: -0.1650 },
            speed: 42,
            firmware: 'v2.1.3'
        },
        {
            id: 'moto-008',
            name: 'Moto 008',
            status: 'online',
            battery: 85,
            location: { lat: 5.5950, lon: -0.2100 },
            speed: 28,
            firmware: 'v2.1.3'
        },
        {
            id: 'moto-012',
            name: 'Moto 012',
            status: 'charging',
            battery: 54,
            location: { lat: 5.6100, lon: -0.1900 },
            speed: 0,
            firmware: 'v2.1.4'
        }
    ],
    
    alerts: [
        {
            type: 'critical',
            icon: 'battery_alert',
            title: 'Low Battery Level',
            description: 'Moto 001 - Energy critical (12%). System throttling engaged.',
            time: '2m ago',
            color: 'red'
        },
        {
            type: 'info',
            icon: 'update',
            title: 'FOTA Ready',
            description: 'Moto 008 - Firmware v2.1.4 successfully staged for install.',
            time: '1h ago',
            color: 'blue'
        },
        {
            type: 'success',
            icon: 'check_circle',
            title: 'Charging Started',
            description: 'Moto 012 - Connected to Grid Point #4 (Kumasi Central).',
            time: '3h ago',
            color: 'primary'
        }
    ],
    
    batteryHistory: [
        { time: '00:00', value: 80 },
        { time: '04:00', value: 65 },
        { time: '08:00', value: 75 },
        { time: '12:00', value: 70 },
        { time: '16:00', value: 85 },
        { time: '20:00', value: 78 },
        { time: '23:59', value: 78 }
    ]
};