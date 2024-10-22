<template>
  <div class="model-item" v-if="element && element.key">
    <template v-if="element.type === 'voucher'">
      <voucher></voucher>
    </template>

    <template v-if="element.type === 'topSale'">
      <top-sale></top-sale>
    </template>

    <template v-if="element.type === 'intro_service'">
      <intro-service :data="element"></intro-service>
    </template>

    <template v-if="element.type === 'productList'">
      <product-list :id="element.id"></product-list>
    </template>

    <template v-if="element.type === 'serviceListCategory'">
      <service-list-by-store-category :id="element.id"></service-list-by-store-category>
    </template>

    <template v-if="element.type === 'carousel'">
      <model-carousel :data="element"></model-carousel>
    </template>

    <template v-if="element.type === 'goodsSlider'">
      <goods-slider :data="element"></goods-slider>
    </template>

    <template v-if="element.type === 'hotAdvert'">
      <ads-cluster :data="element"/>
    </template>

    <template v-if="element.type === 'linkBanner'">
      <link-banner :data="element"/>
    </template>

    <template v-if="element.type === 'clerkList'">
      <clerk-list :data="element"/>
    </template>

    <template v-if="element.type === 'bannerAdvert'">
      <div class="horizontal-advert">
        <img
          v-if="element.options.img"
          :src="element.options.img"
          alt=""
        />
      </div>
    </template>
  </div>
</template>

<script>
import Voucher from "./modelList/Voucher";
import TopSale from "./modelList/TopSale";
import ProductList from "./modelList/ProductList";
import Carousel from "./modelList/Carousel";
import GoodsSlider from "./modelList/GoodsSlider";
import ServiceListByStoreCategory from "@/components/shopDecorate/modelList/ServiceListByStoreCategory";
import IntroService from "@/components/shopDecorate/modelList/IntroService";
import AdsCluster from "./modelList/AdsCluster.vue";
import LinkBanner from "./modelList/LinkBanner.vue";
import ClerkList from "./modelList/ClerkList.vue";

export default {
  name: "ShopModelFormItem",
  components: {
    ClerkList,
    LinkBanner,
    AdsCluster,
    IntroService,
    ProductList,
    Voucher,
    TopSale,
    ModelCarousel: Carousel,
    GoodsSlider,
    ServiceListByStoreCategory
  },
  props: ["element", "select", "index", "data"],
}
</script>

<style lang="scss" scoped>
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

.horizontal-advert {
  width: 1200px;
  > img {
    width: 1200px;
  }
}
</style>
