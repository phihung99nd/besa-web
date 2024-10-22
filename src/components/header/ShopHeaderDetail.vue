<template>
  <div class="shop-box">
    <div class="shop-container">
      <div class="shop-title-content">
        <div class="store-logo__holder">
          <img class="hover-pointer"
               @click="linkTo(`/merchant?id=${storeDetail.storeId}`)"
               src="https://play-lh.googleusercontent.com/DTzWtkxfnKwFO3ruybY1SKjJQnLYeuK3KmQmwV5OQ3dULr5iXxeEtzBLceultrKTIUTr"
               alt="">
        </div>
        <div class="store-name__holder">
          <p><router-link :to="`/merchant?id=${storeDetail.storeId}`">{{ storeDetail.storeName }}</router-link></p>
          <p class="mb_10">{{storeDetail.storeDesc}}</p>
          <div class="store-name__button">
            <Button v-if="fav" size="large" icon="ios-heart" type="error" @click="collect">{{$t('Follow')}}</Button>
            <Button v-else size="large" icon="ios-heart" type="primary" @click="collect" ghost>{{$t('Follow')}}</Button>
            <Button size="large" type="default">{{$t('Contact')}}</Button>
          </div>
        </div>
      </div>
      <div class="shop-detail-content">
        <div class="shop-detail__column">
          <div class="shop-detail__item bottom">{{$t('Rating')}}: <span>8k</span></div>
          <div class="shop-detail__item">{{$t('Product')}}: <span>12</span></div>
        </div>
        <div class="shop-detail__column">
          <div class="shop-detail__item bottom">{{$t('Response Rate')}}: <span>100%</span></div>
          <div class="shop-detail__item">{{$t('Response Time')}}: <span>{{$t('Within {hour} hour(s)', {hour: 5})}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopHeaderDetail',
  props: {
    detail: {
      type: Object,
      default: null
    },
    fav: {
      type: Boolean,
    }
  },
  computed: {
    storeDetail () { // 店铺详情
      return this.detail;
    }
  },
  methods: {
    collect(){
      this.$emit('on-fav-change')
    }
  }
};
</script>

<style lang="scss" scoped>
/* 店铺介绍 */
.shop-box {
  width: 890px;
  height: 130px;
  margin: 0px auto;
  background-color: $light_header_background_color;
}

.shop-container {
  width: 890px;
  height: 100%;
  padding: 0px 0px 0px 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #484848;
}

.shop-title-content {
  display: flex;
  align-items: flex-start;
  width: 400px;
  border-right: 1px solid $border_color;
}

.shop-detail-content {
  display: flex;
  align-items: center;
  width: calc(800px - 60px);
  height: 80px;
  justify-content: space-around;
}

.shop-detail__column {
  display: flex;
  flex-direction: column;
}

.shop-detail__item {
  font-size: 16px;
  color: #757575;
}

.shop-detail__item.bottom {
  margin-bottom: 20px;
}

.shop-detail__item span {
  color: $accent_color;
}

.store-logo__holder {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  margin-right: 20px;
}

.store-logo__holder img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.store-name__holder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.store-name__holder:nth-child(1) {
  color: $accent_color;
  font-weight: 400;
}

.store-name__holder a {
  font-size: 16px;
}

.store-name__holder:nth-child(2) {
  font-size: 14px;
  color: #757575;
}

.store-name__button {
  display: flex;
  flex-direction: row;
}

.store-name__button > button{
  margin-right: 10px;
}

</style>
