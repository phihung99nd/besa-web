<template>
  <div id="merchant" class="merchant">
    <div class="store-info">
      <div style="display: flex; flex-direction: row">
        <div class="store-left">
          <Card>
            <div class="wrap" style="display: flex; flex-direction: column">
              <div class="container-cardShop">
                <Avatar :src="storeMsg.storeLogo" class="avatar"/>
                <div class="store-description">
                  <div>
                    <p>{{ storeMsg.storeName }}</p>
                  </div>
                  <p>{{ storeMsg.storeDesc }}</p>
                </div>
              </div>
              <div class="Store-action">
                <Button v-if="!storeCollected" class="action-folow" ghost type="primary" @click="collect">
                  {{ $t('Follow') }}
                </Button>
                <Button v-if="storeCollected" class="action-folow" type="primary" @click="collect">
                  {{ $t('Followed') }}
                </Button>
                <Button class="action-message" ghost type="primary" @click="openContact"> {{ $t('Contact') }}</Button>
              </div>
            </div>
          </Card>
        </div>
        <div class="store-right">
          <div class="right-col1">
            <div>
              <Iconify icon="twemoji:smiling-face-with-heart-eyes"/>
              {{ $t('Response rate') }}: &nbsp;<p>{{ storeMsg.responseRate || 0 }}</p></div>
            <div>
              <Iconify icon="dashicons:products"/>
              {{ $t('Number of goods') }}: &nbsp;<p>{{ storeMsg.goodsNum || 0 }}</p></div>
            <div>
              <Iconify icon="mdi:message-processing-outline"/>
              {{ $t('Number of services') }}:&nbsp;<p>{{ storeMsg.servicesNum || 0 }}</p></div>
          </div>
          <div class="right-col2">
            <div>
              <Iconify icon="ic:round-people-alt"/>
              {{ $t('Followers') }}:&nbsp;<p>{{ storeMsg.collectionNum || 0 }}</p></div>
            <div>
              <Iconify icon="ooui:user-avatar-outline"/>
              {{ $t('Number of evaluation') }}: &nbsp;<p class="hover-pointer" @click="isShowReview = true">
              {{ storeMsg.numberOfRatings || 0 }}
              {{ $t('people evaluated') }} </p></div>
            <div>
              <Iconify icon="ic:baseline-star-border"/>
              {{ $t('Store rating') }}:&nbsp;<p>{{ storeMsg.avgRating || 0 }} </p></div>
          </div>
        </div>
      </div>
      <Modal footer-hide :width="1200" v-model="isShowReview">
        <MerchantReview/>
      </Modal>
      <div class="store-navigation-tab">
        <Tabs value="" @on-click="handleClickTab">
          <TabPane label="Lướt" name="merchant">

          </TabPane>
          <template v-for="(item, index) in modelForm.list">
            <TabPane v-if="checkAllowModule(item.type)" :key="index" :label="$t(item.type)" :name="item.id"></TabPane>
          </template>
        </Tabs>
      </div>
    </div>
    <shop-model-form ref="modelForm" :data="modelForm"></shop-model-form>
    <BaseFooter/>
    <div class="scroll-top" :class="{'is-show': windowTop > 40}" @click="scrollTop">
      <span><Iconify icon="bxs:up-arrow" style="color: #fff"/></span>
    </div>
    <v-modal name="shop-contact" transition="fade" :width="400" :focus-trap="true" :scrollable="true" height="auto"
             @closed="closeContact">
      <div class="modal">
        <span class="main-phone">{{ storeMsg.linkPhone }}</span>
        <div class="contact-method">
          <div class="contact-item" v-for="(item,index) in contactList" :key="index" @click="handleContact(item)">
            <img :src="require(`@/assets/images/${item}.png`)"/>
            <span>{{ $t('Contact via {0}', [item]) }}</span>
          </div>
        </div>
      </div>
    </v-modal>
  </div>
</template>

<script>
import Search from "@/components/Search";
import ShopModelForm from "@/components/shopDecorate/ShopModelForm";
import {getCateById, getStoreDetailById, getStoreReviewStat} from "@/api/shopentry";
import {cancelCollectShop, collectShop, isCollectionShop} from "@/api/member";
import {getFloorStoreData} from "@/api/index.js";
import {v4 as uuidv4} from 'uuid';
import MerchantReview from "@/components/shopDecorate/MerchantReview";
import NavigationBar from "@/pages/index/NavigationBar.vue";

export default {
  name: "Merchant",
  components: {
    NavigationBar,
    MerchantReview,
    Search,
    ShopModelForm,
  },
  data() {
    return {
      isShowReview: false,
      modelForm: {list: []},
      topAdvert: {},
      showNav: false,
      topSearchShow: false,
      carouselLarge: false,
      carouselOpacity: false,
      enablePageData: false,
      basePageData: false,
      storeMsg: {
        id: '',
      },
      cateList: [],
      goodsList: [],
      total: 0,
      IMLink: "",
      params: {
        keyword: "",
        storeId: this.$route.query.id,
        storeCatId: "",
      },
      cateName: this.$t('Recommended products'),
      storeCollected: false,
      windowTop: 0,
      allowModule: ['intro_service', 'productList', 'serviceListCategory',],
      contactList: ['Zalo', 'Viber']
    };
  },

  created() {
    this.getStoreMsg();
    this.getStoreFavoriteStatus()
  },

  mounted() {
    window.addEventListener("scroll", () => {
      this.windowTop = window.scrollY;
    });
  },

  methods: {
    checkAllowModule(item) {
      return this.allowModule.includes(item)
    },

    handleClickTab(id) {
      const yOffset = -90; // trừ đi phần header sticky trên top
      const element = document.getElementById(id);
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({top: y, behavior: 'smooth'});
    },

    scrollTop() {
      document.getElementById('merchant').scrollIntoView({behavior: 'smooth'});
    },

    getIndexData() {
      getFloorStoreData({pageClientType: "PC", storeId: this.$route.query.id, pageType: 'STORE', pageShow: 'OPEN'})
        .then((res) => {
            if (res.success) {
              let dataJson = JSON.parse(res.result.pageData);
              dataJson.list = dataJson.list.map(i => ({...i, id: uuidv4()}))
              this.modelForm = dataJson
              this.showNav = true;
            }
          }
        )
        .finally(() => {

        })
    },


    getStoreMsg() {
      getStoreDetailById(this.$route.query.id)
        .then((res) => {
          if (res.success) {
            this.storeMsg = res.result;
            this.getIndexData();
            let that = this;
            window.onscroll = function () {
              let top =
                document.documentElement.scrollTop || document.body.scrollTop;
              that.topSearchShow = top > 300;
            };
          }
        })
        .catch((err) => {
          this.$Message.error(this.$t('API get store detail error'))
        })
        .finally(() => {

        })

      getStoreReviewStat({storeId: this.$route.query.id}).then(res => {
        this.storeMsg = {
          ...this.storeMsg,
          numberOfRatings: res.numberOfRatings,
          avgRating: res.avgRating ? `${(Math.round(res.avgRating * 2) / 2).toFixed(1)} sao` : 0
        }
      })
    },

    getStoreFavoriteStatus() {
      if (this.Cookies.getItem("buyer_userInfo")) {
        isCollectionShop(this.$route.query.id)
          .then(res => {
            this.storeCollected = res.result
          })
          .finally(() => {

          })
      }
    },

    getCateList() {
      getCateById(this.$route.query.id)
        .then((res) => {
          if (res.success) {
            this.cateList = res.result;
          }
        })
        .catch((err) => {
          this.$Message.error(this.$t('API get store category error'))
        })
        .finally(() => {

        })
    },

    goGoodsDetail(skuId, goodsId) {
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: {skuId, goodsId},
      });
      window.open(routeUrl.href, "_blank");
    },

    search(val) {
      console.log(val)
      this.params.keyword = val;
    },

    // searchByCate(cate) {
    //   this.params.storeCatId = cate.id;
    //   this.cateName = cate.labelName;
    // },

    async collect() {
      if (this.storeCollected) {
        let cancel = await cancelCollectShop(this.storeMsg.id);
        if (cancel.success) {
          this.$Message.success(this.$t('Unfollow successfully'));
          this.storeCollected = false;
        }
      } else {
        let collect = await collectShop(this.storeMsg.id);
        if (collect.success) {
          this.storeCollected = true;
          this.$Message.success(this.$t('The shop is followed successfully'));
        }
      }
    },
    openContact() {
      this.$modal.show('shop-contact')
    },
    closeContact() {
      this.$modal.hide('shop-contact')
    },
    handleContact(type) {
      switch (type) {
        case 'Zalo':
          window.open(`zalo://conversation?phone=${this.storeMsg.linkPhone}`, '_self')
          break;
        case 'Viber':
          window.open(`viber://contact?number=${this.storeMsg.linkPhone}`, '_self')
          break;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/goodsList.scss";

.merchant {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}

.store-info {
  width: 1200px;
  padding: 20px 0;
  background: $light_white_background_color;
  display: flex;
  flex-direction: column;
}

.store-left {
  width: 400px;

  .container-cardShop {
    width: 100%;
    height: 85px;
    display: flex;

    .avatar {
      width: 80px;
      height: 80px;
    }

    .store-description {
      margin-left: 16px;
      height: 80px;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: center;

      div:first-child {
        display: flex;
        height: 24px;
        align-content: center;
        color: $dark_background_color;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}

.item-img-tag {
  position: absolute;
  left: 0;
  top: 0.625rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 1;
  max-width: 70%;

  .tag-favorite {
    color: #fff;
    padding: 0 0.25rem;
    height: auto;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    border-top-right-radius: 0.125rem;
    border-bottom-right-radius: 0.125rem;
    background-color: $favourite_color;

    &:before {
      content: "";
      display: inline-block;
      position: absolute;
      left: 0;
      bottom: -4px;
      border-top: 4px solid $accent_color_tint;
      border-left: 7px solid transparent;
      filter: brightness(60%);
    }
  }
}

.goods-show-bottom {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .price {
    font-size: 14px;
    color: rgba(0, 0, 0, .54);
  }
}

.Store-action {
  margin-top: 6px;
  display: flex;
  justify-content: space-around;

  .action-folow {
    flex: 0.45;
  }

  .action-message {
    flex: 0.45;
  }

}

.store-right {
  flex: 1;
  display: flex;

  .right-col1, .right-col2 {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    font-size: 16px;
    margin-left: 2em;
    width: 340px;

    div {
      display: flex;
      align-items: center;

      svg {
        margin-right: .5rem;
      }

      p {
        color: $accent_color_shade;
      }
    }
  }
}

.promotion-decorate {
  color: $accent_color;
}

.store-navigation-tab {
  margin-top: 20px;

  /deep/ .ivu-tabs-nav {
    font-size: 18px;
  }
}

.scroll-top {
  position: fixed;
  opacity: 1;
  visibility: hidden;
  overflow: hidden;
  text-align: center;
  z-index: 1001;
  background-color: rgba(0,0,0,.4);
  color: #fff;
  width: 40px;
  height: 40px;
  line-height: 40px;
  right: 20px;
  bottom: -50px;
  padding-top: 2px;
  border-radius: 50%;
  border: none;
  -webkit-box-shadow: 0 0 4px 0 rgba(0,0,0,.1);
  box-shadow: 0 0 4px 0 rgba(0,0,0,.1);
  -webkit-transition: all .25s ease-in-out;
  transition: all .25s ease-in-out;

  &.is-show {
    opacity: 0.8;
    visibility: visible;
    cursor: pointer;
    bottom: 20px;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.modal {
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: auto;

  .main-phone {
    font-size: 24px;
    font-weight: 600;
  }

  .contact-method {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;

    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 5px;
      transition: background-color $common_transition_duration ease;

      &:hover {
        background-color: $accent_color_transparent;
      }

      > img {
        width: 24px;
        height: 24px;
        object-fit: cover;
      }
    }
  }
}
</style>
