<template>
  <div :class="$style['banner-container']" :layout="data.options.layout">
    <Carousel :autoplay-speed="5000" :height="300" :class="$style['banner-list']" autoplay loop>
      <CarouselItem v-for="(item, index) in data.options.list" :key="index">
        <router-link :to="item.url">
          <img :src="item.img" alt="">
        </router-link>
      </CarouselItem>
    </Carousel>
    <div :class="$style['small-banner']">
      <router-link :to="item.url" v-for="(item, index) in data.options.side" :key="index">
        <img :src="item.img" alt="">
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopCarousel",
  props: ['data']
}
</script>

<style module lang="scss">
.banner-container {
  width: 1200px;
  position: relative;
  margin-bottom: 30px;
  display: flex;

  &[layout='3-1'] {
    .banner-list {
      width: 900px;
      border-radius: 12px !important;
      overflow: hidden;

      img {
        width: 900px;
        height: 300px;
        object-fit: cover;
      }

    }

    .small-banner {
      width: 300px;
      height: 300px;
      margin-left: 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      img {
        border-radius: 12px;
        height: 300px;
        object-fit: cover;
        width: 300px;
      }
    }
  }

}
</style>
