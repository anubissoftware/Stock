<template>
    <div>
        <Header2 >
            <template v-slot:mainContainer>
                <Table />
            </template>
        </Header2>
    </div>
</template>

<script lang="ts" setup>
import Table from '@/components/Table.vue';
import Header2 from '@/components/Header2.vue';

</script>

<style scoped>
</style>
