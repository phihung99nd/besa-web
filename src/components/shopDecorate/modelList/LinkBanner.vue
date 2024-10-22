<template>
  <div class="link-banner">
    <div class="title">{{ data.options.title }}</div>
    <div class="slider-container" :style="{'--color': data.options.borderColor}">
      <swiper ref="mySwiper" :options="swiperOptions" class="swiper">
        <swiper-slide
          v-for="(item, index) in data.options.list"
          :key="index"
        >
          <a class="content" :href="item.url" target="_blank">
            <img :src="item.img"/>
            <span>{{item.title}}</span>
          </a>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import {swiper, swiperSlide} from "vue-awesome-swiper";

export default {
  name: "LinkBanner",
  props: ['data'],
  components: {swiper, swiperSlide},
  data() {
    return {
      defaulSwiperOptions: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        speed: 400,
        spaceBetween: 20,
      }
    }
  },
  computed: {
    swiperOptions() {
      return {
        ...this.defaulSwiperOptions,
        autoplay: this.data.options.swiper.auto ? {
          delay: this.data.options.swiper.speed
        } : false,
        loop: this.data.options.swiper.loop
      }
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.link-banner {
  width: 1200px;
  background: #fff;
  padding-top: 20px;

  .title {
    width: 100%;
    font-size: 26px;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 20px;
  }

  .slider-container {
    width: 100%;
    height: 300px;
    border: solid 10px var(--color);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .swiper {
      width: calc(100% - 100px);

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        img {
          width: 100%;
          aspect-ratio: 2/1;
          object-fit: cover;
        }
        span {
          font-weight: 600;
          font-size: 14px;
        }
      }
    }
  }

}
</style>
