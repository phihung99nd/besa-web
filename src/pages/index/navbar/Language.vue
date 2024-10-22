<template>
  <v-dropdown mode="click">
    <template #trigger>
      <button class="btn" style="padding-left: 0">
        <img :src="currentLang.flag" alt="" />
        {{ currentLang.name }}
      </button>
    </template>
    <template #body>
      <div class="dropdown-menu">
        <div class="dropdown-menu__option" v-for="(item, index) in option" @click="chooseLanguage(index)">
          <img :src="item.flag" alt=""/> <span>{{ item.name }}</span>
        </div>
      </div>
    </template>
  </v-dropdown>
</template>

<script>
export default {
  name: "Language",
  data(){
    return {
      option: [
        {name: 'Tiếng Việt', value: 'vi-VN', flag: 'https://cdn-icons-png.flaticon.com/512/555/555515.png'},
        {name: 'Tiếng Anh', value: 'en-US', flag: 'https://cdn-icons-png.flaticon.com/512/555/555417.png'},
      ],
      currentLang: {}
    }
  },
  created() {
    this.currentLang = this.option.find(i => i.value == this.$i18n.locale)
  },
  methods: {
    chooseLanguage(index){
      this.currentLang = this.option[index]
      this.$root.$i18n.locale = this.option[index].value
      window.localStorage.setItem('lang', this.option[index].value)
      this.$router.go(0)
    }
  }
}
</script>

<style scoped lang="scss">
@import 'navbar';

.btn {
  font-size: 12px;
  padding: 0 15px;
  border-right: 1px solid #dddee1;
  > img {
    width: 25px;
    height: 15px;
    object-fit: cover;
    border-radius: 4px;
  }
}

.dropdown-menu__option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px!important;
  > img {
    width: 25px;
    height: 15px;
    object-fit: cover;
    border-radius: 4px;
  }
}
</style>
