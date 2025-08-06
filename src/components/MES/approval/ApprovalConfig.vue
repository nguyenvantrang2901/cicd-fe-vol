<template>
  <div>
    <el-card>
      <h2>My Approval</h2>
      <el-table :data="list">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="title" label="Title" />
        <el-table-column prop="status" label="State" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
const list = [
  { id: 1, title: 'Leave approval', status: 'Awaiting review' },
  { id: 2, title: 'Overtime approval', status: 'Passed' }
]
</script>