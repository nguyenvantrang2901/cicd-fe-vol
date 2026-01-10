<template>
  <el-card shadow="hover" style="width: 100%;">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>User Management</span>
        <div>
          <el-input
            v-model="search"
            placeholder="Search by User name or Name"
            size="semi-large"
            clearable
            style="width: 250px; margin-right: 10px;"
          />
          <el-button
            type="primary"
            size="semi-large"
            @click="handleExportData"
          >
            <el-icon><Download /></el-icon>
            Export Data
          </el-button>
          </div>
      </div>
    </template>

    <el-table :data="filteredUsers" border style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="#" width="50" />
      <el-table-column prop="userName" label="User name" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="role" label="Role" />
      <el-table-column prop="gender" label="Gender" width="100" />
      <el-table-column label="Avatar" width="80">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="availability" label="Availability" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.availability === 'OK' ? 'success' : 'danger'">
            {{ scope.row.availability }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="Remark" />
      <el-table-column label="Action" width="150">
        <template #default="scope">
          <el-icon style="color: blue;" @click="handleUpdatePassword(scope.row)"><Lock /></el-icon>
          <el-icon style="color: green;" @click="() => handleEditUser(scope.row)"><Edit /></el-icon>
          <el-icon style="color: red;" @click="() => handleDeleteUser(scope.row.id)"><Delete /></el-icon>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!--Mở dialog Log-->
  <!-- Button ở giữa màn hình chính dùng "center" -->
  <el-dialog
    v-model="dialogLog"
    title="Change password"
    width="500px"
    :close-on-click-modal="false"  
    append-to-body
    destroy-on-close
    center 
    :fullscreen="isFullscreen"
  >
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>🔐 Change Password</span>
          <el-button
            link
            icon="FullScreen"
            @click="isFullscreen = !isFullscreen"
            :title="isFullscreen ? 'Exit fullscreen' : 'Fullscreen'"
          />
      </div>
    </template>

    <!-- Dialog content -->
    <div>
      <el-alert type="success" show-icon :closable="false" style="margin-bottom: 15px;">
        Account: {{ editUser.name }}
      </el-alert>
      <el-input v-model="editUser.password" placeholder="password" type="password" />
    </div>
    <!--Button Footer-->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogLog = false">Cancel</el-button>
        <el-button type="primary" @click="">Update</el-button>
      </div>
    </template>
  </el-dialog>
  <!--mở dialog user info-->
  <!-- Nếu muốn click bên ngoài đóng dialog thì bỏ :close-on-click-modal="false" -->
  <el-dialog
    v-model="dialogVisible"
    title="User Information"
    width="50%"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <el-divider border-style="double"/>
    <el-form
      :model="editUser"
      label-width="80px"
      label-position="right"
      class="user-form"
    >
      <el-row :gutter="20">

        <!--Name-->
        <el-col :span="12">
          <el-form-item label="Name" required >
            <el-input v-model="editUser.name" disabled />
          </el-form-item>
        </el-col>

        <!--User name-->
        <el-col :span="12">
          <el-form-item label="UserName" required >
            <el-input v-model="editUser.userName" placeholder="User name" />
          </el-form-item>
        </el-col>

        <!--Role-->
        <el-col :span="12">
          <el-form-item label="Role" required>
            <el-input v-model="editUser.role" placeholder="Role" />
          </el-form-item>
        </el-col>

        <!--Gender-->
        <el-col :span="12">
          <el-form-item label="Gender" required>
            <el-select v-model="editUser.gender" >
              <el-option label="Male" value="Male"/>
              <el-option label="Female" value="Female"/>
            </el-select>
          </el-form-item>
        </el-col>

        <!--Availability-->
        <el-col :span="12">
          <el-form-item label="Availability">
            <el-input v-model="editUser.availability" placeholder="Availability" />
          </el-form-item>
        </el-col>

        <!--Remark-->
        <el-col :span="24">
          <el-form-item label="Remark">
            <el-input type="textarea" v-model="editUser.remark" placeholder="Remark" />
          </el-form-item>
        </el-col>

        <!--Avatar-->
        <el-col :span="24">
          <el-form-item label="Avatar">
            <el-image
              :src="editUser.avatar"
              fit="cover"
              style="width: 100px; height: 100px; border: 1px solid #dcdfe6"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider border-style="double"/>
    <!--Button Footer-->
    <template #footer>
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSaveUser">Save</el-button>
    </template>
  </el-dialog>

</template>

<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import userInfo from '@/api/userInfo'
import { ElMessage, ElMessageBox } from 'element-plus'
import  * as XLSX from 'xlsx'

// State
const users = ref([])
const filteredUsers = ref([])
const loading = ref(false)
const search = ref('')
const isFullscreen = ref(false)
const dialogVisible = ref(false)
const dialogLog = ref(false)
const editUser = reactive({
  id: '',
  userName: '',
  password: '',
  name: '',
  role: '',
  gender: '',
  avatar: '',
  availability: '',
  remark: ''
})

// Fetch data
const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await userInfo.getAll()
    users.value = res.data.data
    filteredUsers.value = res.data.data
  } catch (error) {
    console.error("Error fetching users:", error)
  } finally {
    loading.value = false
  }
}

// Filter function
const filterUser = () => {
  const keyword = search.value.toLowerCase()
  filteredUsers.value = users.value.filter(u =>
    u.userName.toLowerCase().includes(keyword) ||
    u.name.toLowerCase().includes(keyword)
  )
}
watch(search, filterUser)

// Action handlers
const handleEditUser = (user) => {
  Object.assign(editUser, user)
  dialogVisible.value = true
}
const handleUpdatePassword = (user) => {
  Object.assign(editUser, user)
  // editUser.id = user.id
  // editUser.password = user.password
  dialogLog.value = true
}
// Save user changes
const handleSaveUser = async () => {
  try {
    const res = await userInfo.updateUser(editUser.id, editUser)
    if (res.data.success) {
      ElMessage.success('User updated successfully')
      dialogVisible.value = false
      fetchUsers()
    } else {
      ElMessage.error(res.data.message || 'Update failed')
    }
  } catch (error) {
    ElMessage.error('Failed to save user')
  }
}
  // Delete user
const handleDeleteUser = (id) => {
  if (!id) {
    ElMessage.error("User ID is invalid or empty.")
    return
  }
  ElMessageBox.confirm(
    'Are you sure you want to delete this user?',
    'Warning',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const res = await userInfo.deleteUser(id)
      if (res.data.success) {
        ElMessage.success('User deleted successfully')
        fetchUsers()
      } else {
        ElMessage.error(res.data.message || 'Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      ElMessage.error('Something went wrong while deleting the user')
    }
  }).catch(() => {
    console.log('Delete cancelled')
  })
}

const handleExportData = () => {
  //Kiểm tra xem có dữ liệu không
  if(filteredUsers.value.length === 0) {
    ElMessage.warning("No data to export");
    return;
  }
  try {
    //Chuyển đổi dữ liệu sang định dạng worksheet
    const dataToExport = filteredUsers.value.map((user, index) => ({
      'NO.': index + 1,
      'User Name': user.userName,
      'Name': user.name,
      'Role': user.role,
      'Gender': user.gender,
      'Availability': user.availability,
      'Remark': user.remark || ''
    }))
    //Tạo Worksheet từ dữ liệu JSON
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    //Tùy chỉnh độ rộng cột (Optional - giúp file Excel dễ nhìn hơn)
    const columnWidths = [
      { wch: 5 },  
      { wch: 20 }, 
      { wch: 25 }, 
      { wch: 15 }, 
      { wch: 10 }, 
      { wch: 15 }, 
      { wch: 30 }
    ]
    worksheet['!cols'] = columnWidths;

    //Tạo Workbook và thêm Worksheet vào
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User List");

    //Xuất file (Tên file kèm ngày giờ hiện tại)
    const date = new Date().toISOString().slice(0,10);
    XLSX.writeFile(workbook, `User_Management_${date}.xlsx`);
  } catch (error) {
    console.log("Export data failed", error)
    ElMessage.error("Error exporting data: " + error.message);
  }
}
// On mount
onMounted(fetchUsers)
</script>

<style>
.el-icon{
  cursor: pointer;
  margin-right: 15px;
}
</style>