<template>
  <div class="width_1200">
    <div class="top-sale">
      <div class="title">
        {{$t('Hot sale goods')}}
      </div>
      <div class="list"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopSale",
  data(){
    return {
      data: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      // TODO: gọi API lấy danh sách các hàng hóa có số lượng bán ra cao nhất của shop
    }
  }
}
</script>

<style lang="scss" scoped>
.width_1200 {
  width: 1200px;
  overflow: hidden;

  .top-sale {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px 10px;

    .title {
      margin-bottom: 10px;
      font-size: 16px;
    }
  }
}
</style>
