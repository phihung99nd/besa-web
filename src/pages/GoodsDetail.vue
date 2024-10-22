<template>
  <div style="background: #fff">

    <div class="shop-item-path">
      <template v-if="categoryBar">
        <div class="shop-nav-container">
          <Breadcrumb>
            <BreadcrumbItem to="/">{{ $t('Home') }}</BreadcrumbItem>
            <BreadcrumbItem
              v-for="(item, index) in categoryBar"
              :to="goGoodsList(index)"
              target="_blank"
              :key="index"
            >
              {{ item.name }}
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </template>
      <template v-else>
        <bs-skeleton width="100%" height="100px" border-radius="6px"/>
      </template>
    </div>
    <template v-if="goodsType">
      <ShowGoods
        @handleClickSku="targetClickSku"
        :detail="goodsMsg"
        :store="storeMsg"
        @on-loaded="isLoading=false"
        :rating-detail="ratingDetail"
      />
    </template>
    <template v-else>
      <div class="flex gap-2 width_1200" style="margin: 15px auto">
        <div class="flex flex-column gap-1">
          <bs-skeleton width="360px" height="360px" border-radius="6px"/>
          <bs-skeleton width="360px" height="60px" border-radius="6px"/>
          <bs-skeleton width="300px" height="20px" border-radius="6px"/>

        </div>
        <div class="flex flex-column gap-3 mt_20">
          <bs-skeleton width="560px" height="60px" border-radius="6px"/>
          <bs-skeleton width="230px" height="30px" border-radius="6px"/>
          <bs-skeleton width="560px" height="60px" border-radius="6px"/>
          <div class="flex gap-1">
            <bs-skeleton width="70px" height="50px" border-radius="6px"/>
            <bs-skeleton width="80" height="50px" border-radius="6px"/>
          </div>
          <div class="flex gap-1">
            <bs-skeleton width="400px" height="50px" border-radius="6px"/>

          </div>
          <div class="flex gap-1">
            <bs-skeleton width="100px" height="50px" border-radius="6px"/>
            <bs-skeleton width="90" height="50px" border-radius="6px"/>
          </div>
        </div>
        <bs-skeleton width="228px" height="360px" border-radius="6px"/>
      </div>
    </template>
    <!--    todo thay doi goodsType -->
    <template v-if="goodsType">
      <ShowGoodsDetail :rating-detail="ratingDetail" :detail="goodsMsg"/>
    </template>
    <template v-else>
      <div class="flex flex-column gap-2 margin-auto">
        <bs-skeleton width="240px" height="50px" border-radius="6px"/>
        <bs-skeleton width="1200px" height="200px" border-radius="6px"/>
        <bs-skeleton width="240px" height="50px" border-radius="6px"/>
        <bs-skeleton width="1200px" height="200px" border-radius="6px"/>
      </div>
    </template>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import Search from "@/components/Search";
import ShopHeader from "@/components/header/ShopHeader";
import ShowGoods from "@/components/goodsDetail/ShowGoods";
import ShowGoodsDetail from "@/components/goodsDetail/ShowGoodsDetail";
import {goodsSkuDetail} from "@/api/goods";
import {
  getGoodsDistribution,
} from "@/api/member";
import {getStoreDetailById, getStoreReviewStat} from "@/api/shopentry";
import {cancelCollectShop, collectShop, isCollectionShop} from "@/api/member";
import {getReviewStat} from "@/api/review";
import NavigationBar from "@/pages/index/NavigationBar.vue";
import BsSkeleton from "@/components/skeleton";


export default {
  name: "GoodsDetail",
  components: {
    NavigationBar,
    Search,
    ShopHeader,
    ShowGoods,
    ShowGoodsDetail,
    BsSkeleton
  },
  beforeRouteEnter(to, from, next) {
    next();
  },

  data() {
    return {
      goodsMsg: {},
      isLoading: false,
      categoryBar: [],
      storeMsg: {
        storeLogo: "",
        storeName: "",
        collectionNum: 0
      },
      IMLink: "",
      ratingDetail: {}
    };
  },
  computed: {
    goodsType() {
      if (this.goodsMsg.data !== undefined) return this.goodsMsg.data.goodsType
      return false
    }
  },
  created() {
    this.getGoodsDetail();
  },
  methods: {
    targetClickSku(val) {
      this.getGoodsDetail(val);
    },

    getGoodsDetail(val) {
      this.isLoading = true;
      const params = val || this.$route.query;

      goodsSkuDetail({goodsId: params.goodsId || '', skuId: params.skuId || ''})
        .then((res) => {
          if (res.success) {
            const result = res.result;
            const cateName = result.categoryName;
            const cateId = result.data.categoryPath.split(",");
            const cateArr = [];
            cateId.forEach((e, index) => {
              cateArr.push({
                id: e,
                name: cateName[index],
              });
            });
            let statParams = {
              subjectId: params.goodsId,
              subjectType: "GOODS",
            }
            getReviewStat(statParams).then(res => {
              this.ratingDetail = res || {}
            })
            this.categoryBar = cateArr;
            this.$set(this, "goodsMsg", result);
            getStoreDetailById(this.goodsMsg.data.storeId)
              .then((res) => {
                if (res.success) {
                  this.storeMsg = {
                    ...this.storeMsg,
                    ...res.result
                  };
                }
              })
            getStoreReviewStat({storeId: this.goodsMsg.data.storeId}).then(res => {
              this.storeMsg = {
                ...this.storeMsg,
                numberOfRatings: res.numberOfRatings,
                avgRating: `${res.avgRating.toFixed(1)}`
              }
            })
          } else {
            this.$Message.error(res.message);
          }
        })
        .catch((e) => {
          this.isLoading = false;
          this.$Message.error('Product does not exist')
        });
    },

    goGoodsList(currIndex) {
      const arr = [];
      this.categoryBar.forEach((e, index) => {
        if (index <= currIndex) {
          arr.push(e.id);
        }
      });
      return location.origin + "/goodsList?categoryPath=" + arr.toString();
    },

    async collect() {
      if (this.storeCollected) {
        let cancel = await cancelCollectShop(this.goodsMsg.data.storeId);
        if (cancel.success) {
          this.$Message.success(this.$t('Unfollow successfully'));
          this.storeCollected = false;
        }
      } else {
        let collect = await collectShop(this.goodsMsg.data.storeId);
        if (collect.code === 200) {
          this.storeCollected = true;
          this.$Message.success(this.$t('The shop is followed successfully'));
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.shop-item-path {
  height: 38px;
  @include background_color($light_background_color);
  line-height: 38px;
  color: #2c2c2c;
}

.shop-nav-container {
  width: 1200px;
  margin: 0 auto;
  position: relative;

  .store-collect {
    position: absolute;
    right: 20px;
    top: 0;
    color: #999;

    span {
      &:hover {
        cursor: pointer;
        color: $theme_color;
      }
    }
  }
}

.margin-auto {
  margin: 15px auto;
  width: 1200px;
}
</style>
