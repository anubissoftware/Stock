<template>
    <div>
        <Header2>
            <template v-slot:mainContainer>
                <div class=" min-h-[75vh] px-5">
                    <br>
                    <span class="text-3xl font-semibold">{{ string.estadistic[language] }}</span><br>
                    <canvas style="max-height: 400px; width: auto;" ref="BarChart"></canvas>
                </div>
            </template>
        </Header2>
    </div>
</template>

<script lang="ts" setup>
import { computed, type  ComputedRef, onMounted, ref, watch } from 'vue';
import type { historicTransactions } from '@/schemas'
import { Chart } from 'chart.js/auto'
import moment from 'moment';
import language from '@/services/language';
import Header2 from '@/components/Header2.vue';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/products';

const string = {
    estadistic: {
        Spanish: 'Estadísticas',
        English: 'Statistics'
    },
    sales: {
        Spanish: 'Ventas',
        English: 'Sales'
    },
    bought: {
        Spanish: 'Compras',
        English: 'Bought'
    },
    losses: {
        Spanish: 'Perdidas',
        English: 'Losses'
    }
}
const auth = useAuthStore()
const pdto = useProductStore()
const BarChart = ref(null)
const counter = ref(1)
var chart: Chart;

const user = computed(() => {
    return auth.getUser
})

const handleChart = () => {
    if (data.value.length > 0) {
        chart.config.data = {
            labels: data.value.map(item => moment(item.date).format('YYYY-MM-DD')),
            datasets: [
                {
                    data: data.value.map(item => item.sells),
                    label: string.sales[language.value]
                },
                {
                    data: data.value.map(item => item.boughts),
                    label: string.bought[language.value]
                },
                {
                    data: data.value.map(item => item.losses),
                    label: string.losses[language.value]
                }
            ]
        }
        chart.update("active")
    }
}

const data: ComputedRef<Array<historicTransactions>> = computed(() => {
    return pdto.listHistoric
})

watch(
    () => data,
    () => {
        if (data.value.length > 0 && chart != undefined) {
            handleChart()
        }
    },
    { deep: true }
)


onMounted(() => {
    BarChart
    chart = new Chart(
        BarChart.value ?? '',
        {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Ventas',
                    data: []
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
                    }
                }
            },
        }
    )
    handleChart()
})

</script>

<style>

</style>

