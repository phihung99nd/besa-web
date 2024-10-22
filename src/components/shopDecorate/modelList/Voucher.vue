<template>
  <div class="width_1200">
    <div class="voucher">
      <div class="title">{{$t('Shop\'s Vouchers')}}</div>
      <div class="swiper"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Voucher"
}
</script>

<style lang="scss" scoped>
.width_1200 {
  width: 1200px;
  overflow: auto;

  .voucher {
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
