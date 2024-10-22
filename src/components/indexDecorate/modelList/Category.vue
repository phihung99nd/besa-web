<template>
  <div>
    <h2 class="title">{{ $t('Bạn muốn trải nghiệm dịch vụ gì?') }}</h2>
    <div class="section">
      <div v-if="head" class="section-header">
        <h2>Bạn muốn trải nghiệm dịch vụ gì?</h2>
      </div>
      <swiper ref="mySwiper" :options="swiperOptions" @mouseenter.native="hover=true" @mouseleave.native="hover=false">
        <swiper-slide
          v-for="(item, index) in data"
          :key="index"
        >
          <div class="content" @click="linkTo(`/search?categoryId=${item.id}`)">
            <img :src="parseMinioURL(item.image)" width="60" height="60" :alt="item.name"/>
            <div style="height: 20px;">{{ item.name }}</div>
          </div>
        </swiper-slide>
        <div class="swiper-button-prev" :class="{hover}" slot="button-prev"></div>
        <div class="swiper-button-next" :class="{hover}" slot="button-next"></div>
      </swiper>
    </div>
  </div>
</template>

<script>
import {getCategory} from "@/api/goods";
import {swiper, swiperSlide} from "vue-awesome-swiper";

export default {
  components: {
    swiper,
    swiperSlide
  },
  name: "Category",
  props: ['head'],
  data() {
    return {
      swiperOptions: {
        direction: "horizontal",
        slidesPerView: 10,
        autoplay: false,
        loop: false,
        freeMode: true,
        // navigation: {nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',}
      },
      data: [],
      hover: false
    }
  },
  methods: {
    init() {
      getCategory(0).then(res => {
        this.data = res.result
      })
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.section {
  width: 1200px;
  margin: 0 auto 50px;
  background-color: #fff;
  border-radius: 12px;

  .section-header {
    margin-bottom: 20px;

    > h2 {
      font-size: 22px;
      font-weight: 600;
      color: #333;
    }
  }
}

.section .swiper-slide {
  height: 120px;
  cursor: pointer;
  padding: 10px;

  &:hover > .content {
    border-radius: 12px;
    background: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    transition: all 0.2s ease-in-out;
  }
}

.section .swiper-container {
  padding: 0 10px !important;
  //background-color: $dominant_color;
}

.section .swiper-slide .content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.section .swiper-slide .content::after {
  content: "";
  display: block;
  position: absolute;
  top: 50%;
  right: 0;
  width: 1px;
  height: 200px;
  transform: translateY(-50%);
  /*background: linear-gradient(180deg, white, #eee, white);*/
}

.section .swiper-slide .content img {
  margin-bottom: 6px;
  border-radius: 50%;
}

.section .swiper-slide .content > div {
  width: 80px;
  font-size: 12px;
  line-height: .875rem;
  text-align: center;
  position: relative;
}

.section .swiper-slide:hover .content > div {
  color: $accent_color;
  cursor: pointer;
}

/deep/ .swiper-button-prev, /deep/ .swiper-button-next {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGlkPSJhcnJvdyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNjYWQxZDgiPjwvc3RvcD48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNiYWJkYzEiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDE9IjkwLjAwMiIgeDI9IjEwMi4wMSIgeTE9IjExNTkuNjk2IiB5Mj0iMTE1OS42OTYiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCAxIDEgMCAtMTE1Mi4wMyA5NDguMzU2KSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHhsaW5rOmhyZWY9IiNhIj48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBzdHlsZT0ibGluZS1oZWlnaHQ6bm9ybWFsO3RleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDt0ZXh0LWRlY29yYXRpb24tbGluZTpub25lO3RleHQtZGVjb3JhdGlvbi1zdHlsZTpzb2xpZDt0ZXh0LWRlY29yYXRpb24tY29sb3I6IzAwMDt0ZXh0LXRyYW5zZm9ybTpub25lO2Jsb2NrLXByb2dyZXNzaW9uOnRiO3doaXRlLXNwYWNlOm5vcm1hbDtpc29sYXRpb246YXV0bzttaXgtYmxlbmQtbW9kZTpub3JtYWw7c29saWQtY29sb3I6IzAwMDtzb2xpZC1vcGFjaXR5OjEiIGZpbGw9InVybCgjYikiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTQuMDEzIDEwMzkuMzg3YTEgMSAwIDAgMSAxLjY5My0uNzVsNS4zMSA0Ljk5YTEgMSAwIDAgMSAwIDEuNDU4bC01LjMxIDQuOTlhMSAxIDAgMSAxLTEuMzY5LTEuNDU3bDQuNTM1LTQuMjYyLTQuNTM1LTQuMjYyYTEgMSAwIDAgMS0uMzI0LS43MDd6IiBjb2xvcj0iIzAwMCIgZW5hYmxlLWJhY2tncm91bmQ9ImFjY3VtdWxhdGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXdlaWdodD0iNDAwIiBvdmVyZmxvdz0idmlzaWJsZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAtMTAzNi4zNjIpIj48L3BhdGg+PC9zdmc+");
  opacity: 0;
  transition: opacity $common_transition_duration ease;
  &.hover {
    opacity: 1;
  }
}

/deep/ .swiper-button-prev {
  transform: rotate(180deg);
}
</style>
