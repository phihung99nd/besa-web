<template>
  <v-dropdown mode="hover">
    <template #trigger>
      <button class="btn">
        {{$t('Professor')}}
      </button>
    </template>
    <template #body>
      <div class="dropdown-menu">
        <div class="dropdown-menu__option" v-for="(item, index) in expertOption" @click="chooseOption(index)">
          {{ item.name }}
        </div>
      </div>
    </template>
  </v-dropdown>
</template>

<script>
export default {
  name: "Expert",
  data(){
    return {
      expertOption: [
        {name: 'Chuyên gia thẩm mỹ', link: ''},
        {name: 'Nhà tạo mẫu tóc', link: ''},
        {name: 'Bác sĩ nha khoa', link: ''},
      ]
    }
  },
  methods: {
    chooseOption(index){
      alert(`Choosing ${this.expertOption[index].name}`)
    }
  }
}
</script>

<style scoped lang="scss">
@import 'navbar';
</style>
