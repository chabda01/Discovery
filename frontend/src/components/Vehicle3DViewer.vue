<template>
  <div 
    ref="containerRef"
    class="vehicle-3d-container relative w-full h-full"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Animated Background Particles -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        v-for="i in 20" 
        :key="i"
        class="particle"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Glow Effect based on battery -->
    <div 
      class="absolute inset-0 glow-effect pointer-events-none"
      :style="getGlowStyle()"
    ></div>

    <!-- 3D Vehicle Container -->
    <div 
      ref="vehicleRef"
      class="vehicle-3d-wrapper"
      :style="vehicleTransform"
    >
      <img
        :src="vehicleImage"
        alt="Electric Vehicle"
        class="vehicle-image-3d"
        :style="imageTransform"
      />
      
      <!-- Reflection Effect -->
      <div class="vehicle-reflection" :style="reflectionStyle"></div>
    </div>

    <!-- Status Indicators -->
    <div class="absolute top-4 left-4 z-10">
      <div class="glass-effect-primary px-4 py-2 rounded-xl">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 bg-kemet-success rounded-full animate-pulse"></div>
          <span class="text-xs font-bold text-kemet-success uppercase tracking-wider">
            Live Connection
          </span>
        </div>
      </div>
    </div>

    <!-- Battery Indicator on Vehicle -->
    <div 
      v-if="battery"
      class="absolute bottom-4 right-4 z-10 glass-effect-primary px-4 py-2 rounded-xl"
    >
      <div class="flex items-center gap-2">
        <div class="relative w-12 h-12">
          <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              :class="getBatteryColorClass()"
              :stroke-dasharray="`${battery * 100.53 / 100} 100.53`"
              class="transition-all duration-1000"
            />
          </svg>
          <span class="absolute inset-0 flex items-center justify-center text-xs font-bold" :class="getBatteryColorClass()">
            {{ battery }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  vehicleImage: {
    type: String,
    required: true,
  },
  battery: {
    type: Number,
    default: 100,
  },
  isCharging: {
    type: Boolean,
    default: false,
  },
});

const containerRef = ref(null);
const vehicleRef = ref(null);

const mouseX = ref(0);
const mouseY = ref(0);
const rotationX = ref(0);
const rotationY = ref(0);
const targetRotationX = ref(0);
const targetRotationY = ref(0);

let animationFrame = null;

const vehicleTransform = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${rotationX.value}deg) rotateY(${rotationY.value}deg) scale(1.1)`,
    transition: 'transform 0.1s ease-out',
  };
});

const imageTransform = computed(() => {
  const translateX = rotationY.value * 0.1;
  const translateY = -rotationX.value * 0.1;
  return {
    transform: `translate(${translateX}px, ${translateY}px)`,
  };
});

const reflectionStyle = computed(() => {
  return {
    opacity: Math.abs(rotationY.value) / 20,
    transform: `translateX(${rotationY.value * 2}px)`,
  };
});

const getGlowStyle = () => {
  const intensity = props.battery / 100;
  const color = props.isCharging ? '#3b82f6' : '#2a4c41';
  return {
    background: `radial-gradient(circle at 50% 50%, ${color}${Math.floor(intensity * 30)} 0%, transparent 70%)`,
    opacity: intensity * 0.6,
  };
};

const getParticleStyle = (index) => {
  const delay = index * 0.1;
  const duration = 3 + (index % 3);
  const size = 2 + (index % 3);
  return {
    position: 'absolute',
    left: `${(index * 7) % 100}%`,
    top: `${(index * 11) % 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: 'rgba(42, 76, 65, 0.3)',
    borderRadius: '50%',
    animation: `float ${duration}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  };
};

const getBatteryColorClass = () => {
  if (props.battery < 20) return 'text-red-500';
  if (props.battery < 50) return 'text-yellow-500';
  return 'text-green-500';
};

const handleMouseMove = (e) => {
  if (!containerRef.value) return;
  
  const rect = containerRef.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  mouseX.value = e.clientX - centerX;
  mouseY.value = e.clientY - centerY;
  
  targetRotationY.value = (mouseX.value / rect.width) * 20;
  targetRotationX.value = -(mouseY.value / rect.height) * 20;
};

const handleMouseLeave = () => {
  targetRotationX.value = 0;
  targetRotationY.value = 0;
};

const animate = () => {
  // Smooth interpolation
  rotationX.value += (targetRotationX.value - rotationX.value) * 0.1;
  rotationY.value += (targetRotationY.value - rotationY.value) * 0.1;
  
  // Subtle continuous rotation when idle
  if (Math.abs(targetRotationX.value) < 0.1 && Math.abs(targetRotationY.value) < 0.1) {
    rotationY.value += 0.05;
  }
  
  animationFrame = requestAnimationFrame(animate);
};

onMounted(() => {
  animate();
});

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
.vehicle-3d-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.vehicle-3d-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.vehicle-image-3d {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  filter: drop-shadow(0 20px 40px rgba(42, 76, 65, 0.3));
  transition: filter 0.3s ease;
}

.vehicle-reflection {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(
    to top,
    rgba(42, 76, 65, 0.2) 0%,
    transparent 100%
  );
  transform-origin: bottom;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.glow-effect {
  border-radius: 50%;
  filter: blur(60px);
  transition: opacity 0.5s ease, background 0.5s ease;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.6;
  }
}

.particle {
  will-change: transform, opacity;
}

/* Smooth transitions */
.vehicle-3d-wrapper,
.vehicle-image-3d,
.vehicle-reflection {
  will-change: transform;
}

/* Dark mode adjustments */
.dark .vehicle-image-3d {
  filter: drop-shadow(0 20px 40px rgba(42, 76, 65, 0.5));
}

.dark .glow-effect {
  opacity: 0.8;
}
</style>
