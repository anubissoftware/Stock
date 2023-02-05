<template>
  <div class="home">
    <Header2>
      <template v-slot:mainContainer>
        <div class="min-h-[80vh] flex flex-col w-full pt-5">
          <h1 class="font-bold text-2xl px-10 py-2">
            {{ strings.wellcome[language] }}
          </h1>
          <WelcomeDashboard :name="store.getUser.name" />
          <div class="flex flex-col flex-wrap w-full px-10 py-2">
            <div class="flex gap-4 py-2 phone:flex-wrap laptop:flex-nowrap w-full">
              <div class="flex flex-row w-full min-w-[350px] justify-center gap-5 phone:px-4 
              shadow-lg border rounded-xl">
                <div class="h-[300px] phone:w-full laptop:w-2/5">
                  <canvas ref="todayChartCanvas"></canvas>
                </div>
                <!-- <div class="h-[300px] phone:w-full laptop:w-2/5">
                  <canvas class="phone:!w-full laptop:!w-2/5" ref=""></canvas>
                </div> -->
              </div>
              <ListsDashboard class="h-[300px] shadow-lg" title="Clients" :data="[]" />
            </div>
            <ListsDashboard class="h-[300px] shadow-lg" title="Cotizaciones" :data="[]" />
            <div class="flex gap-4 py-2 phone:flex-wrap laptop:flex-nowrap flex-wrap w-full">
              <ListsDashboard class="h-[300px] shadow-lg" title="User" :data="[]" />
              <ListsDashboard class="h-[300px] shadow-lg" title="Clients" :data="[]" />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:helperContainer>

      </template>
    </Header2>

  </div>
</template>

<script setup lang="ts">
import language from '@/services/language';
import { ref, type Ref, onMounted, computed, type ComputedRef, watch } from 'vue';
import { Chart, type ChartConfiguration } from 'chart.js/auto';
import type { historicTransactions } from '@/schemas';
import moment from 'moment';
import { basicFormatter } from '@/composables/dateFunctions'
import Header2 from '@/components/Header2.vue';
import WelcomeDashboard from '@/components/Dashboard/WelcomeDashboard.vue';
import ListsDashboard from '@/components/Dashboard/ListsDashboard.vue';
import { useProductStore } from '@/stores/products';
import type { clientEnterpriseSchema, token } from '@/schemas';
import { getClients } from '@/services/clients'
import { useAuthStore } from '@/stores/auth'

const strings = {
  wellcome: {
    Spanish: '¡Bienvenido a OurStock!',
    English: 'Wellcome to OurStock!'
  },
  sales: {
    Spanish: 'Ventas',
    English: 'Sales'
  },
}
const store = useAuthStore()
const pdto = useProductStore()
const clients: Ref<Array<clientEnterpriseSchema>> = ref([])
const historicLenght: ComputedRef<number> = computed(() => {
  return historic.value.length ?? 0
})

const historic: ComputedRef<Array<historicTransactions>> = computed(() => {
  return pdto.listHistoric
})

watch(
  () => [historicLenght, historic],
  () => {
    if (historicLenght.value > 0) {
      handleTodayChart()
    }
  },
  {
    deep: true
  }
)

const todayChartCanvas: Ref<HTMLCanvasElement | undefined> = ref(undefined)
var todayChart: Chart;
var todayChartConfig: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: ['Yesterday', 'Today'],
    datasets: [{
      label: strings.sales[language.value],
      data: [
        0,
        0,
      ],
      borderRadius: 5,
      borderColor:'#c2c2c2',
      backgroundColor: 'blue',
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90
        }
      },
      y: {
        min: 0,
        max: 1000000,
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Nearer Incomings'
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  },
}

const handleTodayChart = () => {
  const arr: Array<number> = historic.value.map((hist) => {
    return hist.sells
  })
  const max = Math.max(...arr)
  setMaxValue(max)
  todayChartConfig.data.datasets[0].data[0] = (historicLenght.value > 1 ? historic.value[historicLenght.value - 2].sells : 0)
  todayChartConfig.data.datasets[0].data[1] = (historicLenght.value > 0 ? historic.value[historicLenght.value - 1].sells : 0)

  const today = moment().format('YYYY-MM-DD')
  const yesterday = moment().add(-1, 'd').format('YYYY-MM-DD')

  todayChartConfig.data.labels![0] = (historicLenght.value > 1 ? basicFormatter(moment(historic.value[historicLenght.value - 2].date), 0, 'd') == yesterday ? 'Yesterday' : basicFormatter(moment(historic.value[historicLenght.value - 2].date), 0, 'day') : 'Yesterday')
  todayChartConfig.data.labels![1] = (historicLenght.value > 1 ? basicFormatter(moment(historic.value[historicLenght.value - 1].date), 0, 'd') == today ? 'Today' : basicFormatter(moment(historic.value[historicLenght.value - 1].date), 0, 'day') : 'Today')

  todayChart.update("active")
}

const setMaxValue = (value: number, index: number | undefined = undefined) => {
  const data = todayChart.data.datasets[0].data
  // data[data.length - 1] = value
  if (value > (todayChart.options.scales?.y?.max ?? 0)) {
    const len = value.toString().length
    var zeros = '1'
    for (let i = 0; i < len - 1; i++) {
      zeros += '0'
    }
    var top = Math.ceil(value / parseInt(zeros))
    const res = top * parseInt(zeros)
    todayChart.options.scales!.y!.max = res

  }
  todayChart.update("active")
}

onMounted(() => {
  todayChart = new Chart(
    todayChartCanvas.value ?? '',
    todayChartConfig
  )
  setClients()
  handleTodayChart()
})

const setClients = async () => {

  let cancelToken = new AbortController();
  let { data } = await getClients((store.getUser.token as token).value, '', cancelToken.signal)
  if (!data) return
    clients.value = data
}

</script>
