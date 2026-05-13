// src/composables/useTodos.js
import { ref, watch } from 'vue'

export function useTodos() {
    const todos = ref(JSON.parse(localStorage.getItem('my-todos') || '[]'))

    const addTodo = (text) => {
        todos.value.unshift({
            id: Date.now(),
            text,
            completed: false,
            priority: 'medium'
        })
    }

    const removeTodo = (id) => {
        todos.value = todos.value.filter(t => t.id !== id)
    }

    // Theo dõi sự thay đổi để lưu vào LocalStorage
    watch(todos, (newVal) => {
        localStorage.setItem('my-todos', JSON.stringify(newVal))
    }, { deep: true })

    return { todos, addTodo, removeTodo }
}
