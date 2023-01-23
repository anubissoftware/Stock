<template>
    <div>
        Hola!
    </div>
</template>


<script lang="ts" setup>
import { quotationDetail } from '@/services/accounting';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute()

onBeforeMount(async () => {
    const quotation_id = atob(route.query.v?.toString() ?? '')
    console.log('quotation', quotation_id)
    await quotationDetail({id: quotation_id})
})
</script>
