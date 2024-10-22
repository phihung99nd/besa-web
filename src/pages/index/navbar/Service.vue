<template>
  <v-dropdown mode="hover">
    <template #trigger>
      <button class="btn">
        {{$t('Service')}}
      </button>
    </template>
    <template #body>
      <div class="dropdown-menu">
        <div class="dropdown-menu__option" v-for="(item, index) in cateList" @click="chooseServiceCategory(index)">
          {{ item.name }}
        </div>
      </div>
    </template>
  </v-dropdown>
</template>

<script>
import {getCategory} from "@/api/goods";

export default {
  name: "Service",
  data(){
    return {
      cateList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      getCategory(0).then(res => {
        this.cateList = res.result
      })
    },
    chooseServiceCategory(index){
      alert(`Choosing ${this.cateList[index].name}`)
    }
  }
}
</script>

<style scoped lang="scss">
@import 'navbar';
</style>
