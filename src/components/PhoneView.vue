<template>
  <div
    class="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px]">
    <div class="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
    <div class="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
    <div class="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
    <div class="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
    <div class="h-full w-full rounded-xl flex flex-col">
      <div class="h-[60px] bg-green-200 rounded-t-xl flex p-2 justify-between items-center">
        <img src="../assets/lpo-logo.png" class="h-10 w-10">
        <h1 class="text-green-800 text-lg font-bold">Etape {{ etape }}</h1>
        <img src="../assets/sem-logo.png" class="h-8">
      </div>
      <div class="bg-white h-[560px] overflow-y-auto no-scrollbar p-2">
        <slot></slot>
      </div>

      <div class="h-[80px] bg-green-200 rounded-b-xl">
        <div class="z-50 w-full h-16 max-w-lg rounded-full bottom-4 left-1/2">
          <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
            <button data-tooltip-target="tooltip-home" type="button"
              class="inline-flex flex-col items-center justify-center px-5  group">
              <svg class="w-5 h-5 mb-1 text-green-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
              </svg>
              <span class="text-[8px] text-green-800">Credits</span>
            </button>
            <button data-tooltip-target="tooltip-wallet" type="button"
              class="inline-flex flex-col items-center justify-center px-5 group">
              <svg class="w-5 h-5 mb-1 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                viewBox="0 0 24 24">
                <title>file-document-outline</title>
                <path
                  d="M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z" />
              </svg>
              <span class="text-[8px] text-green-800">CGU</span>
            </button>
            <div class="flex items-center justify-center">
              <button data-tooltip-target="tooltip-new" type="button"
                class="inline-flex flex-col items-center justify-center w-14 h-14 font-medium bg-green-800 rounded-full">
                <svg class="w-5 h-5 mb-1 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                <span class="text-[8px] text-white">Accueil</span>

              </button>
            </div>
            <button data-tooltip-target="tooltip-settings" type="button"
              class="inline-flex flex-col items-center justify-center px-5  group">
              <svg class="w-5 h-5 mb-1 text-green-800" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <title>download</title>
                <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
              </svg>
              <span class="text-[8px] text-green-800">Parcours</span>
            </button>
            <button data-tooltip-target="tooltip-profile" type="button"
              class="inline-flex flex-col items-center justify-center px-5 rounded-e-full  group">
              <svg class="w-5 h-5 mb-1 text-green-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              <span class="text-[8px] text-green-800">Profil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['etape'],
  name: "PhoneView",
  data() {
    return {};
  },
  components: {},
  mounted() { },
  methods: {},
};
</script>
