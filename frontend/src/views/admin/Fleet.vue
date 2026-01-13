<template>
  <div class="flex h-screen overflow-hidden">
    <!-- SIDEBAR (inchangée) -->
    <aside class="w-64 border-r border-[#273a2f] bg-[#101814] flex flex-col p-6">
      <!-- ... TOUT ton HTML sidebar ici, inchangé ... -->
    </aside>

    <!-- MAIN -->
    <main class="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-[#0c120f]">

      <!-- HEADER -->
      <!-- ... ton header inchangé ... -->

      <!-- CONTENT -->
      <div class="p-8 max-w-7xl mx-auto flex flex-col gap-8 w-full">

        <!-- TABLE -->
        <div class="bg-card-dark rounded-2xl border border-border-dark overflow-hidden">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-[#1b2820] border-b border-border-dark">
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Vehicle</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Battery</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Firmware</th>
                <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-border-dark">
              <tr
                v-for="v in vehicles"
                :key="v.id"
                class="hover:bg-[#1b2820]/50 transition-colors"
              >
                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <span class="material-symbols-outlined">{{ v.type }}</span>
                    </div>
                    <div>
                      <p class="font-bold text-sm">{{ v.name }}</p>
                      <p class="text-xs text-slate-400">VIN: {{ v.vin }}</p>
                    </div>
                  </div>
                </td>

                <td class="px-6 py-5">
                  <span
                    class="status-pulse text-xs font-bold uppercase tracking-wide ml-4"
                    :class="v.status === 'offline' ? 'status-offline text-slate-500' : ''"
                  >
                    {{ v.status }}
                  </span>
                </td>

                <td class="px-6 py-5">
                  <div class="flex items-center gap-4">
                    <div class="flex-1 max-w-[120px] h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        class="h-full"
                        :class="v.battery < 20 ? 'bg-red-500' : 'bg-primary'"
                        :style="{ width: v.battery + '%' }"
                      ></div>
                    </div>
                    <p
                      class="text-sm font-bold"
                      :class="v.battery < 20 ? 'text-red-500' : ''"
                    >
                      {{ v.battery }}%
                    </p>
                  </div>
                </td>

                <td class="px-6 py-5">
                  <span class="px-2 py-1 rounded-md bg-slate-700 text-xs font-mono text-slate-300">
                    {{ v.firmware }}
                  </span>
                </td>

                <td class="px-6 py-5 text-right">
                  <button class="text-primary hover:text-primary/80 font-bold text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FOOTER (inchangé) -->
    </main>
  </div>
</template>

<script setup>
const vehicles = [
  { id: 'moto-001', name: 'Moto 001', vin: '4291-ZX-23', type: 'moped', status: 'online', battery: 85, firmware: 'v1.0.4-stable' },
  { id: 'bus-005', name: 'Bus 005', vin: '9812-AF-99', type: 'directions_bus', status: 'offline', battery: 12, firmware: 'v0.9.8-beta' },
  { id: 'car-088', name: 'Car 088', vin: '1104-BB-12', type: 'directions_car', status: 'online', battery: 65, firmware: 'v1.0.4-stable' },
  { id: 'moto-002', name: 'Moto 002', vin: '4291-ZX-24', type: 'moped', status: 'online', battery: 92, firmware: 'v1.1.0-deploying' },
  { id: 'car-045', name: 'Car 045', vin: '7721-CD-45', type: 'directions_car', status: 'online', battery: 78, firmware: 'v1.0.4-stable' },
  { id: 'bus-012', name: 'Bus 012', vin: '3321-BX-88', type: 'directions_bus', status: 'online', battery: 56, firmware: 'v1.0.3-stable' }
]
</script>
