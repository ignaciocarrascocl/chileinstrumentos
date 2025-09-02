<template>
  <div class="range-slider-wrapper">
    <!-- Slider visual mejorado -->
    <div class="dual-range-container">
      <div class="range-track">
        <div
          class="range-fill"
          :style="fillStyle"
        ></div>
      </div>

      <!-- Sliders superpuestos -->
      <input
        type="range"
        class="range-input range-min"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue[0]"
        @input="updateMin"
      >
      <input
        type="range"
        class="range-input range-max"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue[1]"
        @input="updateMax"
      >
    </div>

    <!-- Valores dinámicos sin etiquetas -->
    <div class="range-values">
      <div class="value-item">
        <span class="value-number">{{ modelValue[0] }}</span>
      </div>
      <div class="value-separator">—</div>
      <div class="value-item">
        <span class="value-number">{{ modelValue[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [0, 100]
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue'])

// Computed para el estilo del relleno del slider
const fillStyle = computed(() => {
  const minPercent = ((props.modelValue[0] - props.min) / (props.max - props.min)) * 100
  const maxPercent = ((props.modelValue[1] - props.min) / (props.max - props.min)) * 100

  return {
    left: `${minPercent}%`,
    width: `${maxPercent - minPercent}%`
  }
})

const updateMin = (event) => {
  const newMin = parseFloat(event.target.value)
  const newMax = Math.max(newMin, props.modelValue[1])
  emit('update:modelValue', [newMin, newMax])
}

const updateMax = (event) => {
  const newMax = parseFloat(event.target.value)
  const newMin = Math.min(props.modelValue[0], newMax)
  emit('update:modelValue', [newMin, newMax])
}
</script>

<style scoped>
.range-slider-wrapper {
  width: 100%;
}

.dual-range-container {
  position: relative;
  height: 20px;
  margin: 10px 0 16px 0;
}

.range-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  transform: translateY(-50%);
}

.range-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, var(--medium-slate-blue), var(--bs-purple, #6f42c1));
  border-radius: 3px;
  transition: all 0.2s ease;
}

.range-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: transparent;
  pointer-events: none;
  appearance: none;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--medium-slate-blue);
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  pointer-events: all;
  transition: all 0.2s ease;
}

.range-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.range-input::-webkit-slider-thumb:active {
  transform: scale(1.2);
}

.range-input::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: var(--bs-primary);
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  pointer-events: all;
  transition: all 0.2s ease;
}

.range-input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.range-input::-moz-range-track {
  background: transparent;
  border: none;
}

.range-input:focus {
  outline: none;
}

.range-input:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.25);
}

.range-input:focus::-moz-range-thumb {
  box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.25);
}

/* Hacer que el segundo slider esté por encima */
.range-max {
  z-index: 2;
}

.range-min {
  z-index: 1;
}

.range-values {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.value-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.value-number {
  font-size: 0.875rem;
  color: #212529;
  font-weight: 600;
}

.value-separator {
  color: #adb5bd;
  font-weight: 300;
  margin: 0 8px;
}
</style>
