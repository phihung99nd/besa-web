<template>
  <div style="background: #fff">
    <BaseHeader></BaseHeader>
    <Search></Search>
    <div class="shop-item-path">
      <div class="shop-nav-container">
        <Breadcrumb>
          <BreadcrumbItem to="/">{{ $t('Home') }}</BreadcrumbItem>
          <BreadcrumbItem
            v-for="(item, index) in categoryBar"
            :key="index"
            :to="goServiceList(index)"
            target="_blank"
          >
            {{ item.name }}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </div>
    <ShowServices
      :rating-detail="ratingDetail"
      :detail="serviceMsg"
      :store="storeMsg"
      @on-loaded="isLoading=false"
    ></ShowServices>
<!--    <ShopHeader :detail="storeMsg" :fav="storeCollected" @on-fav-change="collect"></ShopHeader>-->
    <ShowServicesDetail :rating-detail="ratingDetail" :detail="serviceMsg"></ShowServicesDetail>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import ShowServices from "../components/servicesDetail/ShowServices";
import ShopHeader from "../components/header/ShopHeader";
import ShowServicesDetail from "@/components/servicesDetail/ShowServicesDetail";
import {getServiceDetail} from "@/api/services";
import {getStoreDetailById, getStoreReviewStat} from "@/api/shopentry";
import {cancelCollectService, collectService, isCollectionService} from "@/api/member";
import {getReviewStat} from "@/api/review";

export default {
  name: "ServiceDetail",
  components: {
    ShowServicesDetail,
    ShowServices,
    ShopHeader,
  },
  data() {
    return {
      serviceMsg: {},
      isLoading: false,
      categoryBar: [],
      storeCollected: false,
      storeMsg: {
        storeLogo: "",
        storeName: "",
        collectionNum: 0
      },
      IMLink: "",
      ratingDetail: {},
    };
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail(val) {
      const params = val || this.$route.query.id;
      let statParams = {
        subjectId: params,
        subjectType: "SERVICE",
      }
      getReviewStat(statParams).then(res => {
        if (res != "") this.ratingDetail = res
        else this.ratingDetail = {}
      })
      getServiceDetail(params)
        .then(res => {
          this.serviceMsg = res.result
          const cateName = res.result.categoryName;
          const cateId = res.result.categoryPath.split(",");
          const cateArr = [];
          cateId.forEach((e, index) => {
            cateArr.push({
              id: e,
              name: cateName[index],
            });
          });
          this.categoryBar = cateArr;
          if (this.Cookies.getItem("buyer_userInfo")) {
            isCollectionService(res.result.storeId)
              .then(res => {
                this.storeCollected = res.result
              })
          }
          getStoreDetailById(res.result.storeId)
            .then(res => {
              this.storeMsg = {
                ...this.storeMsg,
                ...res.result}
            })
          getStoreReviewStat({storeId: this.serviceMsg.storeId}).then(res => {
            this.storeMsg = {
              ...this.storeMsg,
              numberOfRatings: res.numberOfRatings || 0,
              avgRating: `${res.avgRating.toFixed(1)}`
            }
          })
        })
    },

    goServiceList(currIndex) {
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
        let cancel = await cancelCollectService(this.serviceMsg.storeId);
        if (cancel.success) {
          this.$Message.success(this.$t('Unfollow successfully'));
          this.storeCollected = false;
        }
      } else {
        let collect = await collectService(this.serviceMsg.storeId);
        if (collect.code === 200) {
          this.storeCollected = true;
          this.$Message.success(this.$t('The shop is followed successfully'));
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
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
</style>
