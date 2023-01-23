<template>
  <div class="home">
    <Header2>
      <template v-slot:mainContainer>
        <div class="min-h-[80vh] flex flex-col w-full pt-5">
          <h1 class="font-bold text-2xl">
            {{ strings.wellcome[language] }}
          </h1>
          <div class="flex flex-row flex-wrap justify-center w-full gap-5 phone:px-10">
            <div class="h-[300px] phone:w-full laptop:w-2/5">
              <canvas ref="todayChartCanvas"></canvas>
            </div>
            <!-- <div class="h-[300px] phone:w-full laptop:w-2/5">
              <canvas class="phone:!w-full laptop:!w-2/5" ref=""></canvas>
            </div> -->
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
import { useProductStore } from '@/stores/products';

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

const pdto = useProductStore()
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
    labels: ['ytday', 'today'],
    datasets: [{
      label: strings.sales[language.value],
      data: [
        0,
        0,
      ]
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

  todayChartConfig.data.labels![0] = (historicLenght.value > 1 ? basicFormatter(moment(historic.value[historicLenght.value - 2].date), 0, 'd') == yesterday ? 'ytday' : basicFormatter(moment(historic.value[historicLenght.value - 2].date), 0, 'day') : 'ytday')
  todayChartConfig.data.labels![1] = (historicLenght.value > 1 ? basicFormatter(moment(historic.value[historicLenght.value - 1].date), 0, 'd') == today ? 'today' : basicFormatter(moment(historic.value[historicLenght.value - 1].date), 0, 'day') : 'today')

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
  handleTodayChart()
})

</script>
