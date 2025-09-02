<template>
  <div class="multi-select-wrapper">
    <div
      class="multi-select-control form-control"
      @click="toggleDropdown"
      :class="{ 'show': isOpen }"
    >
      <div class="d-flex flex-wrap align-items-center gap-1 flex-grow-1">
        <span v-if="modelValue.length === 0" class="text-muted">{{ placeholder }}</span>
        <div
          v-for="value in modelValue"
          :key="value"
          class="chip"
          @click.stop
        >
          <span>{{ getOptionLabel(value) }}</span>
          <button
            type="button"
            class="chip-remove"
            @click="removeChip(value)"
            aria-label="Remover"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
      <i class="bi ms-2 flex-shrink-0" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
    </div>

    <div v-if="isOpen" class="multi-select-dropdown">
      <div class="dropdown-header p-2">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="modelValue.length === options.length"
            @change="toggleAll"
            id="select-all"
          >
          <label class="form-check-label fw-semibold" for="select-all">
            Seleccionar todos
          </label>
        </div>
      </div>
      <div class="dropdown-body">
        <div v-for="option in options" :key="option.value" class="form-check px-2 py-1">
          <input
            class="form-check-input"
            type="checkbox"
            :value="option.value"
            :checked="modelValue.includes(option.value)"
            @change="toggleOption(option.value)"
            :id="`option-${option.value}`"
          >
          <label class="form-check-label" :for="`option-${option.value}`">
            {{ option.label }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Seleccionar opciones...'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const toggleAll = () => {
  if (props.modelValue.length === props.options.length) {
    emit('update:modelValue', [])
  } else {
    emit('update:modelValue', props.options.map(opt => opt.value))
  }
}

const toggleOption = (value) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(value)

  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(value)
  }

  emit('update:modelValue', newValue)
}

const removeChip = (value) => {
  const newValue = props.modelValue.filter(v => v !== value)
  emit('update:modelValue', newValue)
}

const getOptionLabel = (value) => {
  const option = props.options.find(opt => opt.value === value)
  return option ? option.label : value
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.multi-select-wrapper')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.multi-select-wrapper {
  position: relative;
}

.multi-select-control {
  cursor: pointer;
  min-height: 38px;
  display: flex !important;
  align-items: center;
  padding: 0.375rem 0.75rem;
}

.multi-select-control:hover {
  border-color: var(--bs-primary);
}

.multi-select-control.show {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.chip {
  display: inline-flex;
  align-items: center;
  background-color: var(--bs-primary);
  color: white;
  border-radius: 1rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  max-width: 150px;
}

.chip span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.25rem;
}

.chip-remove {
  background: none;
  border: none;
  color: white;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transition: background-color 0.15s ease;
}

.chip-remove:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chip-remove i {
  font-size: 0.75rem;
}

.multi-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-header {
  background-color: var(--bs-light);
  border-bottom: 1px solid var(--bs-border-color);
}

.dropdown-body {
  max-height: 150px;
  overflow-y: auto;
}

.form-check {
  margin-bottom: 0;
}

.form-check-label {
  cursor: pointer;
  width: 100%;
}
</style>
