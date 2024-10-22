<template>
  <div class="banner-container flex">
    <Carousel :autoplay-speed="5000" :height="300" class="banner-list" autoplay loop>
      <CarouselItem v-for="item in bannerImg">
        <div>
          <img :src="item" alt="">
        </div>
      </CarouselItem>
    </Carousel>
    <div class="small-banner flex flex-column justify-content-between">
      <img src="https://minio-api.micro-tech.com.vn/bono/20230810/480e52dc38db4b76bd09932552ebf082.jpg"
           alt="">
      <!--      <img src="https://cf.shopee.vn/file/vn-50009109-81f8cf3f88ebbaa35f5c7c567746a16d_xhdpi" alt="">-->
    </div>
    <!--    <div class="banner-title">-->
    <!--      <div class="search-form">-->
    <!--        <Iconify class="search-icon" icon="zondicons:search"/>-->
    <!--        <div style="flex: 1; position: relative">-->
    <!--          <swiper v-show="searchForm.key === ''" :options="swiperOptions"-->
    <!--                  class="hot-search">-->
    <!--            <swiper-slide v-for="(item, index) in hotSearch" :key="index">-->
    <!--              {{ item }}-->
    <!--            </swiper-slide>-->
    <!--          </swiper>-->
    <!--          <input id="search-input" v-model="searchForm.key"-->
    <!--                 @on-change="handleChangeInputSearch" class="search-input"-->
    <!--                 type="text">-->
    <!--        </div>-->
    <!--        <Button class="search-button" size="large" type="primary">{{ $t('Search') }}</Button>-->
    <!--        <div id="myModal">-->
    <!--          <SearchBox v-show="isShow"/>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>
<script>
import {swiper, swiperSlide} from "vue-awesome-swiper";
import SearchBox from "@/pages/index/search/SearchBox.vue";

export default {
  name: "TopBanner",
  components: {
    SearchBox,
    swiper,
    swiperSlide
  },
  mounted() {
    // this.initSearchBox()
  },
  data() {
    return {
      // isShow: false,
      // searchForm: {
      //   key: "",
      // },
      // swiperOptions: {
      //   direction: "vertical",
      //   loop: false,
      //   freeMode: true,
      //   autoplay: {
      //     delay: 3000,
      //   },
      // },
      bannerImg: [
        "https://minio-api.micro-tech.com.vn/bono/20230810/5a096f607335410a9e2b7bc7c87b7b32.jpg",
        "https://minio-api.micro-tech.com.vn/bono/74d0022fd9524fdbb1a260be2c059295.png",

      ],
      // hotSearch: ["Đà Nẵng với người yêu 2 ngày 1 đêm", "Đà Lạt thành phố sương mù", "Hà Nội thủ đô ngàn năm"],

    }
  },
  methods: {
    // handleChangeInputSearch() {
    //
    // },
    initSearchBox() {
      const inputElement = document.getElementById("search-input");

      inputElement.addEventListener("focus", () => {
        this.isShow = true
      });

      inputElement.addEventListener("blur", () => {
        this.isShow = false
      });
    },
  },

}
</script>

<style lang="scss" scoped>
/deep/ .ivu-carousel {
  border-radius: 12px !important;
  overflow: hidden;
}

.display-none {
  display: none;
}

.banner-container {
  width: 1200px;
  position: relative;
  margin-bottom: 30px;

  .banner-list {
    width: 900px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

  }

  .small-banner {
    width: 300px;
    height: 300px;
    margin-left: 8px;

    img {
      border-radius: 12px;
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  }

  .banner-title {
    position: absolute;
    color: #fff;
    //left: 18%;
    transform: translate(275px, -55%);
    z-index: 800;

    .search-form {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
      position: relative;
      display: flex;
      border-radius: 99px;
      box-sizing: border-box;
      color: #212121;
      border: 1px solid transparent;
      width: 650px;
      z-index: 5;
      align-items: center;
      background: #fff;
      height: 56px;
      padding: 0 3px 0 16px;

      &:hover, &:has( .search-input:focus) {
        border: 1px solid $accent_color !important;

      }


      .search-icon {
        flex: 0 0 24px;
        width: 26px;
        height: 26px;
        margin-right: 8px;
      }

      .hot-search {
        color: #8a8a8a;
        overflow: hidden;
        position: absolute;
        width: 100%;
        font-size: 18px;
        height: 22px;
        line-height: 22px;
        top: 16px;
      }

      .search-input {
        outline-style: none;
        background-color: transparent;
        border: 1px solid transparent;
        border-radius: 6px;
        box-sizing: border-box;
        caret-color: $accent_color;
        color: #212121;
        font-size: 20px;
        font-weight: 400;
        height: 54px;
        line-height: 1.5;
        overflow: hidden;
        padding: 15px 0;
        position: relative;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        z-index: 400;
      }

      .search-button {
        padding: 0 24px;
        margin-left: 18px;
        border: 1px solid transparent;
        border-radius: 99px !important;
        font-weight: 500;
        height: 48px;
        line-height: 1.5;
      }
    }
  }
}
</style>
