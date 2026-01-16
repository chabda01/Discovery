<template>
  <div 
    class="animated-vehicles-background fixed inset-0 pointer-events-none overflow-hidden z-0"
  >
    <!-- Multiple animated vehicles -->
    <div
      v-for="(vehicle, index) in vehicles"
      :key="`vehicle-${index}`"
      class="animated-vehicle"
      :style="getVehicleStyle(vehicle, index)"
    >
      <div class="vehicle-icon-wrapper">
        <span class="material-symbols-outlined vehicle-icon">electric_car</span>
        <div class="vehicle-glow"></div>
      </div>
    </div>

    <!-- Floating particles -->
    <div
      v-for="i in 20"
      :key="`particle-${i}`"
      class="floating-particle"
      :style="getParticleStyle(i)"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const vehicles = ref([]);

// Initialize vehicles with random positions and speeds
// Increased count to ensure at least one vehicle is always visible
const initVehicles = () => {
  const vehicleCount = 50; // Increased to 50 vehicles for continuous visibility
  const baseDuration = 25; // Base animation duration in seconds
  
  vehicles.value = Array.from({ length: vehicleCount }, (_, i) => {
    // Distribute vehicles evenly across the screen height
    const yPosition = (i * (100 / vehicleCount)) + Math.random() * (100 / vehicleCount);
    
    // Stagger delays so vehicles appear continuously
    // Each vehicle starts at a different time to ensure continuous flow
    const delay = (i * (baseDuration / vehicleCount)) + Math.random() * 2;
    
    return {
      id: i,
      y: Math.max(5, Math.min(95, yPosition)), // Keep within visible bounds
      direction: -10 + Math.random() * 20, // Slight angle variation
      size: 50 + Math.random() * 30,
      opacity: 0.2 + Math.random() * 0.25,
      delay: delay,
      duration: baseDuration + Math.random() * 10, // Slight variation in speed
    };
  });
};

const getVehicleStyle = (vehicle, index) => {
  return {
    left: '50%',
    top: `${vehicle.y}%`,
    width: `${vehicle.size}px`,
    height: `${vehicle.size}px`,
    fontSize: `${vehicle.size * 0.8}px`,
    opacity: 0, // Start invisible
    transform: `translate(-15vw, 0) rotate(${vehicle.direction}deg)`, // Start off-screen to the left
    animation: `vehicleMove${index} ${vehicle.duration}s linear infinite`,
    animationDelay: `${vehicle.delay}s`,
  };
};

const getParticleStyle = (index) => {
  const delay = index * 0.4;
  const duration = 7 + (index % 6);
  const size = 3 + (index % 4);
  
  return {
    left: `${(index * 4) % 100}%`,
    top: `${(index * 6) % 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animation: `particleFloat ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  };
};

// Generate dynamic keyframes for each vehicle with smooth curved paths
const generateKeyframes = () => {
  // Remove existing style if present
  const existingStyle = document.getElementById('animated-vehicles-keyframes');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  if (!vehicles.value || vehicles.value.length === 0) {
    console.warn('No vehicles to animate');
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'animated-vehicles-keyframes';
  
  vehicles.value.forEach((vehicle, index) => {
    // Create smooth curved path from left to right
    const startY = vehicle.y;
    const midY1 = Math.max(5, Math.min(95, startY - 5 + Math.random() * 10));
    const midY2 = Math.max(5, Math.min(95, startY + 3 + Math.random() * 8));
    const midY3 = Math.max(5, Math.min(95, startY - 2 + Math.random() * 6));
    const endY = Math.max(5, Math.min(95, startY + Math.random() * 10 - 5));
    
    const rotation1 = vehicle.direction + 8;
    const rotation2 = vehicle.direction + 3;
    const rotation3 = vehicle.direction - 3;
    const rotation4 = vehicle.direction - 5;
    
    const keyframes = `
      @keyframes vehicleMove${index} {
        0% {
          transform: translate(-15vw, ${startY}vh) rotate(${vehicle.direction}deg);
          opacity: 0;
        }
        3% {
          opacity: ${vehicle.opacity};
        }
        25% {
          transform: translate(25vw, ${midY1}vh) rotate(${rotation1}deg);
          opacity: ${vehicle.opacity};
        }
        50% {
          transform: translate(50vw, ${midY2}vh) rotate(${rotation2}deg);
          opacity: ${vehicle.opacity * 0.98};
        }
        75% {
          transform: translate(75vw, ${midY3}vh) rotate(${rotation3}deg);
          opacity: ${vehicle.opacity * 0.95};
        }
        92% {
          opacity: ${vehicle.opacity * 0.6};
        }
        100% {
          transform: translate(115vw, ${endY}vh) rotate(${rotation4}deg);
          opacity: 0;
        }
      }
    `;
    style.textContent += keyframes;
  });
  
  document.head.appendChild(style);
};

onMounted(async () => {
  try {
    initVehicles();
    // Use nextTick to ensure reactive data is updated
    await nextTick();
    if (vehicles.value && vehicles.value.length > 0) {
      generateKeyframes();
    }
  } catch (error) {
    console.error('Error initializing animated background:', error);
  }
});

onBeforeUnmount(() => {
  const style = document.getElementById('animated-vehicles-keyframes');
  if (style) {
    style.remove();
  }
});
</script>

<style scoped>
.animated-vehicles-background {
  z-index: 0;
  mix-blend-mode: normal;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.animated-vehicle,
.floating-particle {
  pointer-events: none;
}

.dark .animated-vehicles-background {
  mix-blend-mode: screen;
}

.animated-vehicle {
  position: absolute;
  transform-origin: center;
  will-change: transform;
}

.vehicle-icon-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vehicle-icon {
  font-size: inherit;
  color: rgba(42, 76, 65, 0.6);
  filter: drop-shadow(0 0 10px rgba(42, 76, 65, 0.4));
  transition: all 0.3s ease;
  animation: vehiclePulse 2s ease-in-out infinite;
}

.dark .vehicle-icon {
  color: rgba(42, 76, 65, 0.7);
  filter: drop-shadow(0 0 15px rgba(42, 76, 65, 0.5));
}

@keyframes vehiclePulse {
  0%, 100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.vehicle-glow {
  position: absolute;
  inset: -15px;
  background: radial-gradient(circle, rgba(42, 76, 65, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulseGlow 3s ease-in-out infinite;
}

.floating-particle {
  position: absolute;
  background: rgba(42, 76, 65, 0.3);
  border-radius: 50%;
  pointer-events: none;
}

.dark .floating-particle {
  background: rgba(42, 76, 65, 0.4);
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-30px) translateX(20px);
    opacity: 0.6;
  }
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.4;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* Smooth transitions for theme changes */
.animated-vehicle,
.vehicle-icon,
.floating-particle {
  transition: opacity 0.5s ease, color 0.5s ease;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .animated-vehicle,
  .floating-particle {
    animation: none !important;
  }
}
</style>
