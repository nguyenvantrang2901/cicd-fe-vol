<template>
  <el-row :gutter="20">
    <el-col :span="6" v-for="card in statCards" :key="card.label">
      <el-card shadow="hover">
        <div style="display: flex; justify-content: space-between; cursor: pointer;">
          <div>
            <div style="color: gray">{{ card.label }}</div>
            <div style="font-size: 24px; font-weight: bold; padding-top: 5px;">{{ card.count }}</div>
          </div>
          <el-icon :size="30" style="margin-right: 10px" :color="card.color">
            <component :is="card.icon" />
          </el-icon>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="20" style="margin-top: 20px">
    <el-col :span="16">
      <el-card shadow="hover" header="In and out quantity">
        <div style="height: 450px; width: 100%; display: flex; align-items: center; justify-content: center; color: gray">
          <div ref="chartRef" style="width: 100%; height: 450px;"></div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="hover" header="Production quantity statistics">
        <div style="height:100%; display: flex; color: gray">
          <div ref="pieChartRef" style="width: 100%; height: 450px;"></div>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row style="margin-top: 20px; height: 100%; overflow: auto;">
    <el-col style="text-align: center; ">
      <el-table :data="paginatedData" border height="450" style="width: 100%; cursor: pointer;" v-loading="loading" :default-sort="{ prop: 'income', order: 'ascending' }">
        <el-table-column type="selection" width="55"/>
        <el-table-column type="index" label="#" width="50" :index="indexMethod"/>
        <el-table-column prop="dept" label="Department" />
        <el-table-column prop="date" label="Date" sortable/>
        <el-table-column prop="income" label="Income" width="100" sortable/>
        <el-table-column prop="expenditure" label="Expenditure" sortable/>
        <el-table-column prop="consum" label="Consumption" sortable/>
        <el-table-column prop="balance" label="Balance" width="100" sortable/>
        <el-table-column prop="remark" label="Remark" />
      </el-table>
      <Pagination
        v-if="total > 0"
        v-model:page="currentPage"
        v-model:limit="pageSize"
        :total="total"
        @pagination="handlePagination"
      />
    </el-col>
  </el-row>
</template>

<script setup>
import { Document, Upload, Collection, ShoppingCart } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ref, onMounted, reactive } from 'vue'
import { inOutQuantity } from '@/fakeData/inOutQuantity'
import { productsQuantity } from '@/fakeData/productsQuantity'
import Pagination from '@/helper/Pagination/index.vue'
import { usePagination } from '@/hooks/usePagination'

const statCards = [
  { label: "This month's inventory quantity", count: 2200, icon: Document, color: '#409EFF' },
  { label: 'Quantity in stock this month', count: 800, icon: Upload, color: '#67C23A' },
  { label: 'Quantity received this month', count: 600, icon: Collection, color: '#E6A23C' },
  { label: 'Quantity shipped this month', count: 400, icon: ShoppingCart, color: '#F56C6C' }
];

const dataTable = reactive([
  { dept: 'Production', date: '2025-08-01', income: 5000, expenditure: 3000, consum: 2000, balance: 1000, remark: 'Monthly report' },
  { dept: 'Sales', date: '2025-08-01', income: 7000, expenditure: 4000, consum: 3000, balance: 2000, remark: 'Quarterly report' },
  { dept: 'Marketing', date: '2025-08-03', income: 6000, expenditure: 3500, consum: 2500, balance: 1500, remark: 'Annual report' },
  { dept: 'HR', date: '2025-08-05', income: 8000, expenditure: 4500, consum: 3500, balance: 2000, remark: 'Budget allocation' },
  { dept: 'Finance', date: '2025-08-07', income: 9000, expenditure: 5000, consum: 4000, balance: 2500, remark: 'Financial audit' },
  { dept: 'IT', date: '2025-08-09', income: 10000, expenditure: 5500, consum: 4500, balance: 3000, remark: 'System upgrade' },
  { dept: 'Logistics', date: '2025-08-11', income: 11000, expenditure: 6000, consum: 5000, balance: 3500, remark: 'Shipping costs' },
  { dept: 'Customer Service', date: '2025-08-13', income: 12000, expenditure: 6500, consum: 5500, balance: 4000, remark: 'Service improvements' },
  { dept: 'R&D', date: '2025-08-15', income: 13000, expenditure: 7000, consum: 6000, balance: 4500, remark: 'New product development' },
  { dept: 'Legal', date: '2025-08-17', income: 14000, expenditure: 7500, consum: 6500, balance: 5000, remark: 'Compliance review' },
  { dept: 'Administration', date: '2025-08-19', income: 15000, expenditure: 8000, consum: 7000, balance: 5500, remark: 'Office management' },
  { dept: 'Procurement', date: '2025-08-21', income: 16000, expenditure: 8500, consum: 7500, balance: 6000, remark: 'Supplier negotiations' },
])
const { currentPage, pageSize, total, paginatedData, handlePagination } = usePagination(dataTable, 10)
// Hàm tính số thứ tự liên tục
const indexMethod = (index) => {
  // Công thức: (Trang hiện tại - 1) * Số dòng mỗi trang + index dòng hiện tại + 1
  return (currentPage.value - 1) * pageSize.value + index + 1
}
const pieChartRef = ref(null)
const chartRef = ref(null)
const loading = ref(false)

onMounted(() => {
  // Initialize ECharts instance
  const barChart = echarts.init(chartRef.value)
  const pieChart = echarts.init(pieChartRef.value)

  //Lấy data từ dữ liệu fake
  const dates = inOutQuantity.map(item => item.date)
  const inboundData = inOutQuantity.map(item => item.inbound)
  const outboundData = inOutQuantity.map(item => item.outbound)
  const pieData = productsQuantity.map(item => ({
    name: item.name,
    value: item.quantity
  }))
  // Set chart options
  barChart.optionInOut = {
    title: {
      text: 'In and out quantity',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Inbound', 'Outbound'],
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Inbound',
        type: 'bar',
        data: inboundData,
        itemStyle: {
          color: '#5470C6'
        }
      },
      {
        name: 'Outbound',
        type: 'bar',
        data: outboundData,
        itemStyle: {
          color: '#91CC75'
        }
      }
    ]
  }
  pieChart.optionProducts = {
    title: {
      text: 'Production quantity statistics',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      icon: 'circle',
      itemWidth: 12,
      itemHeight: 12,
      orient: 'horizontal',
      data: pieData.map(item => item.name),
      bottom: 'bottom'
    },
    series: [
      {
        name: 'Product Quantity',
        type: 'pie',
        radius: '50%',
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  // Use the specified configuration item and data to show the chart
  barChart.setOption(barChart.optionInOut)
  pieChart.setOption(pieChart.optionProducts)
})
</script>

