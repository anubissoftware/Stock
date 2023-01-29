<template>
    <div class="flex flex-col transition-all duration-300 ease-in-out w-full pt-3">
        <div class="flex text-black w-full">
            <div class="flex w-full border font-bold rounded-2xl bg-gray-100 px-2 py-4">
                <div v-for="(head) in props.header" :key="head.accesor"
                    class="flex items-center justify-start select-none" :class="[
                        head.sort ? 'cursor-pointer' : '',
                        head.width,
                        props.configTable.color ? `bg-[${props.configTable.color}]` : 'bg-blue-500',
                    ]">
                    {{ head.title }}
                </div>
            </div>
        </div>
        <template v-if="props.data.length > 0">
            <div v-for="(item, index) in props.data" :key="index" @mouseleave="item.showAction = false" class="flex flex-wrap flex-row w-full px-2 py-4 cursor-pointer select-none my-1 border border-black
            rounded-2xl shadow" :class="!item.showAction ? 'hover:bg-gray-50' : ''"
                @contextmenu.prevent="openOptionContext($event, item)" @click="handleTouch(item)">
                <div v-for="(head, index) in props.header" :key="index" class=" items-center" :class="head.width">
                    <span v-if="head.accesor">
                        {{
                            head.config?.money ? currencyFormat(item[head.accesor]) :
                                head.config?.timeformat ? moment(item[head.accesor]).format('YYYY-MM-DD') :
                                    head.config?.dateTimeFormat ? moment(item[head.accesor]).format('YYYY-MM-DDTHH:mm:ss').replace('T','  ') :
                                        head.config?.hex ? formatSerial(item[head.accesor]) :
                                            item[head.accesor]
                        }}
                    </span>
                    <template v-else>
                        <Icon v-if="editPer" icon="more_vert" class="icon_hover"
                            @click="openOptionContext($event, item)" />
                    </template>
                </div>
                <div class="w-full  flex flex-wrap flex-row justify-start items-start text-left border-t-2 border-gray-400 mt-2 pt-2"
                    v-if="item.showAction && (props.configTable.dropdown ?? true)">
                    Actions!
                </div>
            </div>
        </template>
        <template v-else>
            <div class="italic">
                {{ strings.noData[language as "Spanish" | "English"] }}
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { editPer } from '@/composables/permissions'
import { formatSerial } from '@/services/accounting';
import language from '@/services/language';
import moment from 'moment';
import { defineProps, defineEmits } from 'vue';
import { Icon } from '../Generics/generics';
import { currencyFormat } from '@/composables/utils'

export interface dataTableProps {
    header: {
        title: string,
        accesor: string,
        sort: boolean,
        sortDirection: string
        width: string,
        config?: {
            money?: boolean
            timeformat?: boolean
            dateTimeFormat?: boolean
            hex?: boolean
        }
    }[],
    data: Array<any>,
    configTable: {
        color: string,
        dropdown?: boolean,
    }
}

const strings = {
    noData: {
        Spanish: "No hay registros con estos parámetros",
        English: "There aren't registers"
    }
}

const props = defineProps<dataTableProps>()
const emit = defineEmits(["openContext"])

const openOptionContext = (event: any, item: any) => {
    emit("openContext", {
        item, event
    })
}

const handleTouch = (item: any) => {
    item.showAction = item.showAction ? false : true
}

</script>

<style>
.icon_hover {
    border-radius: 99%;
    transition: 200ms;
    padding: 3px;
}

.icon_hover:hover {
    background-color: #dbdbdb;
    transition: 200ms;
}
</style>
