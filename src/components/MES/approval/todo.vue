<script setup>
import { ref, computed } from 'vue'
import { Check, Delete, Plus } from '@element-plus/icons-vue'
import { useTodos } from './composables/useTodos'

const { todos, addTodo, removeTodo } = useTodos()
const inputTodo = ref('')
const filterStatus = ref('all')

// Hàm xử lý thêm công việc
const handleAdd = () => {
  if (!inputTodo.value.trim()) return
  addTodo(inputTodo.value)
  inputTodo.value = ''
}

// Logic lọc dữ liệu để hiển thị trên Table
const filteredTableData = computed(() => {
  if (filterStatus.value === 'active') return todos.value.filter(t => !t.completed)
  if (filterStatus.value === 'completed') return todos.value.filter(t => t.completed)
  return todos.value
})
</script>

<template>
  <div class="todo-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>Quản lý Công việc</h2>
          <el-radio-group v-model="filterStatus" size="small">
            <el-radio-button label="all">Tất cả</el-radio-button>
            <el-radio-button label="active">Đang làm</el-radio-button>
            <el-radio-button label="completed">Hoàn thành</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div class="input-section">
        <el-input
            v-model="inputTodo"
            placeholder="Nhập công việc mới..."
            @keyup.enter="handleAdd"
        >
          <template #append>
            <el-button :icon="Plus" @click="handleAdd">Thêm</el-button>
          </template>
        </el-input>
      </div>

      <el-table :data="filteredTableData" style="width: 100%" empty-text="Không có công việc nào">
        <el-table-column width="50">
          <template #default="scope">
            <el-checkbox v-model="scope.row.completed" />
          </template>
        </el-table-column>

        <el-table-column label="Nội dung công việc">
          <template #default="scope">
            <span :class="{ 'completed-text': scope.row.completed }">
              {{ scope.row.text }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Trạng thái" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.completed ? 'success' : 'warning'">
              {{ scope.row.completed ? 'Xong' : 'Chờ' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="100" align="right">
          <template #default="scope">
            <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="removeTodo(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.todo-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.input-section {
  margin-bottom: 20px;
}
.completed-text {
  text-decoration: line-through;
  color: #909399;
}
</style>