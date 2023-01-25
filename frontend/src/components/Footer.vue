
<script lang="ts" setup>
const getImageUrl = (name: string) => {
    return new URL(`../assets/logo/${name}`, import.meta.url).href
}
</script>

<template>
    <!-- Footer -->
    <footer class="bg-third w-full z-0 py-3">
        <div class="flex flex-row flex-wrap justify-center items-center">
            <div class="flex items-center justify-center tablet:w-1/3 tablet:px-10 phone:w-full phone:px-2 py-5">
                <a hrf="#" class="">
                    <img class="h-8 sm:mx-auto cursor-pointer" :src="getImageUrl('Recurso 6@2x.png')" alt="Logo" />

                </a>
            </div>
            <div v-if="false" class="flex flex-col w-1/3 justify-center items-center text-sm text-white">
                <div>
                    <a href="#" class="d-flex hover:underline">About</a>
                </div>
                <div>
                    <a href="#" class="d-flex hover:underline">Privacy policy</a>
                </div>
                <div>
                    <a href="#" class="d-flex hover:underline">About products</a>
                </div>
                <div>
                    <a href="#" class="d-flex hover:underline">Contact</a>
                </div>

            </div>
            <div v-if="false" class="flex flex-col w-1/3 items-center justify-end ">
                <a href="#" class="flex flex-row text-white">
                    <img class="w-5" :src="''" alt="Facebook" />
                    <span>Red Social</span>
                </a>
                <a href="#" class="flex flex-row text-white">
                    <img class="w-5" :src="''" alt="Instagram" />
                    <span>Red Social</span>
                </a>
                <a href="#" class="flex flex-row text-white">
                    <img class="w-5" :src="''" alt="Twitter" />
                    <span>Red Social</span>
                </a>
                <a href="#" class="flex flex-row text-white">
                    <img class="w-5" :src="''" alt="Linkedin" />
                    <span>Red Social</span>
                </a>
            </div>
        </div>
        <hr class="border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-4 mb-3 opacity-70" />
        <span class="block text-sm text-white sm:text-center opacity-90">
            ©2023
            <br> 
            Anubis Software S.A.S.
            <br>
            All Rights Reserved.
        </span>

    </footer>

    <!-- Footer -->
</template>