<template>
  <div class="recommend-shop">
    <div class="recommend-carousel">
      <Carousel autoplay>
        <CarouselItem v-for="(item, index) in carousels" :key="index">
          <div style="overflow: hidden">
            <img :src="item.img" @click="linkTo(item.url)"/>
          </div>
        </CarouselItem>
      </Carousel>
    </div>

    <div class="recommend-list">
      <template v-for="item in shops">
        <div class="shops" @click="linkTo(item.url)">
          <img :src="item.img" alt="" height="120" style="margin-bottom: 5px" width="120"/>
          <img :src="item.logo" alt="" height="50" width="50"/>
          <div>
            <div class="shop-title">{{ item.title }}</div>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>


export default {
  name: "shop",

  props: {
    data: {
      type: Object,
      default: {}
    },
  },


  data() {
    return {
      carousels: [],
      shops: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.carousels = this.data.options.carousels
      this.shops = this.data.options.shops
    },
  }
}
</script>

<style lang="scss" scoped>

.recommend-shop {
  height: 450px;
  display: flex;
}

.recommend-carousel {
  width: 400px;
}

.recommend-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.shops {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin: 0;
  width: 25%;
}

.shop-title {
  font-size: 20px;
  color: red;
}
</style>
