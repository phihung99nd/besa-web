<template>
  <div class="model-item" v-if="element && element.key">
    <template v-if="element.type == 'carousel'">
      <model-carousel
        :data="element"
        class="mb_20 width_1200_auto"
      ></model-carousel>
    </template>
    <template v-if="element.type == 'carousel1'">
      <model-carousel1 :data="element" class="mb_20"></model-carousel1>
    </template>
    <template v-if="element.type == 'carousel2'">
      <model-carousel2
        :data="element"
        class="mb_20 width_1200_auto"
      ></model-carousel2>
    </template>
    <template v-if="element.type == 'hotAdvert'">
      <div class="mb_20 width_1200_auto">
        <img
          style="display: block"
          class="hover-pointer"
          :src="element.options.list[0].img"
          @click="linkTo(element.options.list[0].url)"
          width="1200"
          alt=""
        />
      </div>
      <ul class="advert-list width_1200_auto">
        <template v-for="(item, index) in element.options.list">
          <li
            v-if="index !== 0"
            @click="linkTo(item.url)"
            class="hover-pointer"
            :key="index"
          >
            <img :src="item.img" width="230" height="190" alt=""/>
          </li>
        </template>
      </ul>
    </template>
    <template v-if="element.type == 'seckill' && element.options.list.length">
      <seckill :data="element" class="mb_20 width_1200_auto"></seckill>
    </template>
    <template v-if="element.type == 'discountAdvert'">
      <div
        class="discountAdvert"
        :style="{
          backgroundImage:
            'url(' + require('@/assets/images/decorate.png') + ')',
        }"
      >
        <img
          @click="linkTo(item.url)"
          class="hover-pointer"
          v-for="(item, index) in element.options.classification"
          :key="index"
          :src="item.img"
          width="190"
          height="210"
          alt=""
        />
        <img
          @click="linkTo(item.url)"
          class="hover-pointer"
          v-for="(item, index) in element.options.brandList"
          :key="'discount' + index"
          :src="item.img"
          width="240"
          height="105"
          alt=""
        />
      </div>
    </template>
    <template v-if="element.type == 'recommend'">
      <recommend :data="element" class="mb_20 width_1200_auto"></recommend>
    </template>
    <template v-if="element.type == 'newGoodsSort'">
      <new-goods-sort
        :data="element"
        class="mb_20 width_1200_auto"
      ></new-goods-sort>
    </template>
    <template v-if="element.type == 'firstAdvert'">
      <first-page-advert
        :data="element"
        class="mb_20 width_1200_auto"
      ></first-page-advert>
    </template>
    <template v-if="element.type == 'bannerAdvert'">
      <long-banner :data="element"/>
    </template>
    <template v-if="element.type == 'notEnough'">
      <not-enough
        :data="element"
        class="mb_20 width_1200_auto"
      ></not-enough>
    </template>
    <template v-if="element.type == 'hot-services'">
      <hot-services class="mb_20 width_1200_auto"/>
    </template>
    <template v-if="element.type == 'flash-sale'">
      <flash-sale class="mb_20 width_1200_auto"/>
    </template>
    <template v-if="element.type == 'custom-flash-sale'">
      <custom-flash-sale :data="element"/>
    </template>
    <template v-if="element.type == 'shop'">
      <shop class="mb_20 width_1200_auto"/>
    </template>
    <template v-if="element.type == 'category'">
      <Category/>
    </template>
    <template v-if="isLogin && element.type == 'recent-booking'">
      <RecentBooking/>
    </template>
    <template v-if="element.type == 'nearby-store'">
      <NearbyStore/>
    </template>
    <template v-if="element.type == 'nearby-service'">
      <NearbyService/>
    </template>
    <template v-if="element.type == 'threeBanner'">
      <banner :data="element"/>
    </template>
    <template v-if="element.type == 'hot-place'">
      <HotPlace/>
    </template>
    <template v-if="element.type == 'featured-expert'">
      <FeaturedExpert/>
    </template>
    <template v-if="element.type == 'service-list'">
      <CustomServiceList :data="element"/>
    </template>
    <template v-if="element.type == 'store-list'">
      <CustomStoreList :data="element"/>
    </template>
    <template v-if="element.type == 'clerk-list'">
      <CustomClerkList :data="element"/>
    </template>
    <template v-if="element.type == 'top-carousel'">
      <TopCarousel :data="element"/>
    </template>
  </div>
</template>

<script>
import Storage from "@/plugins/storage";
import Skeleton from "../skeleton/index.vue";
import lazyLoadComponent from "../../plugins/lazy-load-component";

export default {
  name: "modelFormItem",
  props: ["element", "select", "index", "data"],
  components: {
    LongBanner: lazyLoadComponent({
      componentFactory: () => import('./modelList/LongBanner.vue'),
      loading: Skeleton
    }),
    CustomClerkList: lazyLoadComponent({
      componentFactory: () => import('@/components/indexDecorate/modelList/CustomClerkList.vue'),
      loading: Skeleton
    }),
    TopCarousel: lazyLoadComponent({
      componentFactory: () => import('@/components/indexDecorate/modelList/TopCarousel.vue'),
      loading: Skeleton
    }),
    CustomStoreList: lazyLoadComponent({
      componentFactory: () => import('@/components/indexDecorate/modelList/CustomStoreList.vue'),
      loading: Skeleton
    }),
    CustomServiceList: lazyLoadComponent({
      componentFactory: () => import('@/components/indexDecorate/modelList/CustomServiceList.vue'),
      loading: Skeleton
    }),
    HotPlace: lazyLoadComponent({
      componentFactory: () => import('@/pages/index/modelForm/template/HotPlace.vue'),
      loading: Skeleton
    }),
    NearbyService: lazyLoadComponent({
      componentFactory: () => import('@/pages/index/modelForm/template/NearbyService.vue'),
      loading: Skeleton
    }),
    RecentBooking: lazyLoadComponent({
      componentFactory: () => import('@/pages/index/modelForm/template/RecentBooking.vue'),
      loading: Skeleton
    }),
    FeaturedExpert: lazyLoadComponent({
      componentFactory: () => import('@/pages/index/modelForm/template/FeaturedExpert.vue'),
      loading: Skeleton
    }),
    NearbyStore: lazyLoadComponent({
      componentFactory: () => import('@/pages/index/modelForm/template/NearbyStore.vue'),
      loading: Skeleton
    }),
    HotServices: lazyLoadComponent({
      componentFactory: () => import('./modelList/HotGoods.vue'),
      loading: Skeleton
    }),
    Category: lazyLoadComponent({
      componentFactory: () => import('@/components/indexDecorate/modelList/Category'),
      loading: Skeleton
    }),
    ModelCarousel: lazyLoadComponent({
      componentFactory: () => import('./modelList/Carousel.vue'),
      loading: Skeleton
    }),
    Recommend: lazyLoadComponent({
      componentFactory: () => import('./modelList/Recommend.vue'),
      loading: Skeleton
    }),
    NewGoodsSort: lazyLoadComponent({
      componentFactory: () => import('./modelList/NewGoodsSort.vue'),
      loading: Skeleton
    }),
    Banner: lazyLoadComponent({
      componentFactory: () => import('./modelList/Banner'),
      loading: Skeleton
    }),
    FirstPageAdvert: lazyLoadComponent({
      componentFactory: () => import('./modelList/FirstPageAdvert.vue'),
      loading: Skeleton
    }),
    NotEnough: lazyLoadComponent({
      componentFactory: () => import('./modelList/NotEnough.vue'),
      loading: Skeleton
    }),
    Seckill: lazyLoadComponent({
      componentFactory: () => import('./modelList/Seckill.vue'),
      loading: Skeleton
    }),
    Shop: lazyLoadComponent({
      componentFactory: () => import('./modelList/Shop'),
      loading: Skeleton
    }),
    FlashSale: lazyLoadComponent({
      componentFactory: () => import('@/components/indexDecorate/modelList/FlashSale'),
      loading: Skeleton
    }),
    CustomFlashSale: lazyLoadComponent({
      componentFactory: () => import('@/components/indexDecorate/modelList/CustomFlashSale'),
      loading: Skeleton
    }),
  },
  data() {
    return {
      showModal: false,
      selected: {},
    };
  },
  computed: {
    isLogin(){
      return Storage.getItem('buyer_accessToken')
    }
  }
};
</script>
<style lang="scss" scoped>
.model-item {
  position: relative;
  margin-bottom: 10px;
}

.advert-list {
  background: $theme_color;
  height: 200px;
  display: flex;
  justify-content: space-around;
  padding: 3px 10px;

  > li {
    img {
      cursor: pointer;
      border-radius: 10px;
      transition: all 150ms ease-in-out;

      &:hover {
        transform: translateY(-3px);
        box-shadow: rgba(0, 0, 0, 0.4) 0px 5px 20px 0px;
      }
    }
  }
}

.discountAdvert {
  width: 1300px;
  height: 566px;
  margin: 0 auto;
  margin-bottom: 20px;
  background-repeat: no-repeat;
  position: relative;
  left: -47px;
  padding-left: 295px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

  img {
    margin-top: 10px;
    margin-right: 10px;
    transition: all 150ms ease-in-out;

    &:hover {
      box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
    }
  }
}

.width_1200_auto {
  width: 1200px;
  margin: 0 auto;
}
</style>
