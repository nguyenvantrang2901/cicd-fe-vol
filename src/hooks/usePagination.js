import { ref, computed } from 'vue'

export function usePagination(dataList, defaultPageSize = 10) {
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)

  // Tự động tính tổng số bản ghi (dựa trên mảng dữ liệu truyền vào)
  const total = computed(() => dataList.length)

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return dataList.slice(start, end)
  })

  // Hàm xử lý sự kiện
  const handlePagination = ({ page, limit }) => {
    currentPage.value = page
    pageSize.value = limit
  }

  return {
    currentPage,
    pageSize,
    total,
    paginatedData,
    handlePagination
  }
}
