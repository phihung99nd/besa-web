<template>
  <div class="goods-wrapper">
    <div class="item-detail-show">
      <!--region Image-->
      <div class="item-detail-left">
        <div class="item-detail-big-img">
          <pic-zoom :scale="3" :url="imgList[imgIndex]" @click="showImg = true"/>
<!--          <img :src="imgList[imgIndex]" @click="showImg = true"/>-->
          <span v-if="currentSelectedSku.quantity == 0" class="sold-out">{{$t('Sold out')}}</span>
        </div>
        <div
          v-if="skuDetail.goodsType === 'VIRTUAL_GOODS'"
          style="margin-top:10px;rgb(153, 149, 149);"
        >
          {{ $t('Digital Product') }}
        </div>
        <!--        <div class="item-detail-img-row">-->
        <!--          <div-->
        <!--            v-for="(item, index) in imgList"-->
        <!--            :key="index"-->
        <!--            class="item-detail-img-small"-->
        <!--            @mouseover="imgIndex = index"-->
        <!--          >-->
        <!--            <img :src="item"/>-->
        <!--          </div>-->
        <!--        </div>-->
        <swiper ref="mySwiper" :options="swiperOptions" class="item-detail-img-row">
          <swiper-slide
            v-for="(item, index) in imgList"
            :key="index"
            class="item-detail-img-small" @mouseover.native="imgIndex = index"
          >
            <img :src="item" alt=""/>
          </swiper-slide>
        </swiper>
        <div class="goodsConfig mt_10">
          <div class="share">
            <span>{{ $t('Share') }}: </span>
            <Button icon="logo-facebook" shape="circle" size="small"></Button>&nbsp;
            <Button icon="logo-twitter" shape="circle" size="small"></Button>&nbsp;
            <Button icon="logo-googleplus" shape="circle" size="small"></Button>&nbsp;
            <Button icon="logo-tumblr" shape="circle" size="small"></Button>
          </div>
          <div class="favorite">
            <div @click="collect">
              <Icon
                :color="isCollected ? '#23caa1' : '#666'"
                size="20"
                type="ios-heart"
              />
              &nbsp;{{ isCollected ? $t('Added to favorites') : $t('Add to favorites') }}
            </div>
          </div>
        </div>
      </div>
      <!--endregion-->
      <!--region Detail-->
      <div class="item-detail-right">
        <div class="item-detail-title">
          <p>
            {{ skuDetail.name }}
          </p>
        </div>
        <div class="item-detail-info">
          <div class="item-remarks-sum flex" style="align-items: center">
            <Rate style="font-size: 16px; vertical-align: baseline" :value="+rating" allow-half disabled
                  icon="md-star"/>
            <p>
              {{ $t('{0} reviews', [ratingDetail.numberOfRatings]) }}
            </p>
          </div>
          <div class="booked-number">
            <div>{{ $t('Booked') }}</div>
            <div>{{ skuDetail.buyCount || 0 }}</div>
          </div>
        </div>
        <Promotion
          v-if="promotionMap['SECKILL']"
          :time="promotionMap['SECKILL'].endTime"
        ></Promotion>
        <div class="item-detail-price-row">
          <div class="item-price-left">
            <div
              v-if="skuDetail.promotionPrice && promotionMap['SECKILL']"
              class="item-price-row"
            >
              <p>
                <span v-if="promotionMap['SECKILL']" class="item-price-title"
                >{{ $t('Seckill Price') }}</span>
                <span class="item-price">
                  {{ currentSelectedSku.promotionPrice | unitPrice("₫",  "before") }}
                </span>
                <span class="item-price-old">
                  {{ currentSelectedSku.price | unitPrice("₫",  "before") }}
                </span>
              </p>
            </div>
            <div v-else class="item-price-row">
              <span class="item-price-title">
                {{ $t('Price') }}
              </span>
              <span class="item-price">
                {{ currentSelectedSku.price | unitPrice("₫",  "before") }}
              </span>
              <!--              </div>-->
            </div>
            <div v-if="promotionMap['COUPON'].length" class="item-price-coupon-row">
              <p class="Ellipsis">
                <span class="item-price-title">{{ $t('Coupons') }}</span>
                <span>
                  <span
                    v-for="(item, index) in promotionMap['COUPON'].slice(0, 6)"
                    :key="index"
                    class="item-coupon"
                    @click="receiveCoupon(item.id)"
                  >
                    <span v-if="item.couponType === 'PRICE'">
                      {{ $t('Buy minimum {0} get discount {1}', [item.consumeThreshold, item.price]) }}
                    </span>
                    <span v-if="item.couponType === 'DISCOUNT'">
                      {{ $t('Buy minimum {0} get discount {1}', [item.consumeThreshold, item.couponDiscount]) }}
                    </span>
                  </span>
                </span>
              </p>
              <div v-if="promotionMap['COUPON'].length > 6" class="dropdown">
                <span>{{ $t('More') }}</span>
                <div class="dropdown-content">
                        <span
                          v-for="(item, index) in promotionMap['COUPON'].slice(6, promotionMap['COUPON'].length)"
                          :key="index"
                          class="item-coupon"
                          @click="receiveCoupon(item.id)">
                          <span v-if="item.couponType === 'PRICE'">
                            {{ $t('Buy minimum {0} get discount {1}', [item.consumeThreshold, item.price]) }}
                          </span>
                          <span v-if="item.couponType === 'DISCOUNT'">
                            {{ $t('Buy minimum {0} get discount {1}', [item.consumeThreshold, item.couponDiscount]) }}
                          </span>
                        </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="(sku, index) in formatList"
          :key="sku.name"
          class="item-select"
        >
          <div class="item-select-title">
            <p>{{ sku.name }}</p>
          </div>
          <div class="item-select-column">
            <div
              v-for="(item, idx) in sku.values"
              :key="idx"
              class="item-select-row"
            >
              <div
                :class="{
                  'item-select-box-active':
                    item.value === currentSelected[index],
                }"
                class="item-select-box"
                @click="select(index, item.value)"
              >
                <div class="item-select-intro">
                  <p>{{ item.value }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <div class="add-buy-car-box">
          <div class="item-select">
            <div class="item-select-title">
              <p>{{ $t('Quantity') }}</p>
            </div>
            <div class="item-select-row">
              <InputNumber
                v-model="count"
                :disabled="currentSelectedSku.quantity === 0"
                :max="currentSelectedSku.quantity"
                :min="1"
                :precision="0.1"
                @on-blur="changeCount"
              ></InputNumber>
              <!--              <span class="inventory"> {{ $t('In Stock: {0}', [skuDetail.quantity]) }}</span>-->
            </div>
            <span style="line-height: 32px; margin-left: 16px; color: #888888">
              {{ $t('{0} products are available', [currentSelectedSku.quantity]) }}
            </span>
          </div>
          <!--          <div-->
          <!--            v-if="-->
          <!--              skuDetail.goodsType !== 'VIRTUAL_GOODS' && skuDetail.weight !== 0-->
          <!--            "-->
          <!--            class="item-select"-->
          <!--          >-->
          <!--            <div class="item-select-title">-->
          <!--              <p>{{ $t('Weight') }}</p>-->
          <!--            </div>-->
          <!--            <div class="item-select-row">-->
          <!--              <span class="inventory"> {{ skuDetail.weight }}kg</span>-->
          <!--            </div>-->
          <!--          </div>-->
          <div
            v-if="$route.query.way === 'POINT' && skuDetail.authFlag === 'PASS'"
            class="add-buy-car"
          >
            <Button
              :disabled="skuDetail.quantity === 0"
              :loading="loading"
              type="error"
              @click="pointPay"
            >{{ $t('Point Pay') }}
            </Button
            >
          </div>
          <div
            v-if="$route.query.way !== 'POINT' && skuDetail.authFlag === 'PASS'"
            class="add-buy-car"
          >
            <Button
              v-if="skuDetail.goodsType !== 'VIRTUAL_GOODS'"
              :loading="loading"
              type="error"
              :disabled="currentSelectedSku.quantity == 0"
              @click="addShoppingCartBtn"
            >
              {{ $t('Add to Cart') }}
            </Button>

            <Button
              :loading="loading1"
              type="warning"
              @click="buyNow"
              :disabled="currentSelectedSku.quantity == 0"
            >
              {{ $t('Buy now') }}
            </Button>
          </div>
        </div>
      </div>
      <!--endregion-->
      <!--region Policy-->
      <div class="item-detail-policy">
        <div class="store">
          <div class="store-info">
            <img v-if="store.storeLogo" :src="store.storeLogo" alt=""/>
            <div>
              <span>{{ store.storeName }}</span>
              <img
                src="https://lzd-img-global.slatic.net/g/tps/imgextra/i3/O1CN01Ir7cAE1tWpT1x30qx_!!6000000005910-2-tps-187-52.png"
                alt=""/>
            </div>
          </div>
          <div class="store-detail">
            <div class="store-rating">
              <span>{{ store.avgRating || 0 }} / 5 <Icon type="md-star" color="#f5a623"/></span>
              <span class="description-text">{{ store.numberOfRatings | roundedToThousand }} đánh giá</span>
            </div>
            <div class="store-favorite">
              <span>{{ store.collectionNum | roundedToThousand }}</span>
              <span class="description-text">Yêu thích</span>
            </div>
            <div class="store-feedback">
              <span>99%</span>
              <span class="description-text">Phản hồi tin nhắn</span>
            </div>
          </div>
          <div class="store-action">
            <Button size="small" long v-if="storeCollected" icon="ios-heart" type="primary" @click="storeCollect">
              {{ $t('Followed') }}
            </Button>
            <Button size="small" long v-else icon="ios-heart" type="default" @click="storeCollect">{{
                $t('Follow')
              }}
            </Button>
            <Button size="small" long type="default" @click="linkTo(`/merchant?id=${store.id}`)">{{
                $t('View shop')
              }}
            </Button>
          </div>
        </div>
        <div>
          <div class="header">{{ $t('Policy') }}</div>
          <div class="policy-item" v-for="(policy, index) in policyList" :key="index">
            <img v-if="policy.image == 'auth'" class="policy-image" :src="visualList[0].url" alt=""/>
            <img v-if="policy.image == '7daysRefund'" class="policy-image" :src="visualList[1].url" alt=""/>
            <img v-if="policy.image == 'shield'" class="policy-image" :src="visualList[2].url" alt=""/>
            <a target="_blank" :href="`/article/policy?id=${policy.id}`">{{ policy.name }}</a>
          </div>
        </div>
      </div>
      <!--endregion-->
    </div>
    <div v-if="showImg" id="myModal" class="modal">
      <div class="modal-content">
        <img :src="imgList[imgIndex]"/>
        <span class="close" @click="showImg=false">&times;</span>
      </div>
    </div>
  </div>
</template>

<script>
import Promotion from "./Promotion.vue";
import PicZoom from "vue-piczoom"; // 图片放大
import {cancelCollectShop, collectShop, isCollectionShop, receiveCoupon,} from "@/api/member.js";
import {addCartGoodsRequestBody} from "@/api/cart.js";
import {cancelCollectGoods, collectGoods, isCollectionGoods} from "@/api/member";
import {visualList} from "@/components/goodsDetail/visualConfig";
import {roundedToThousand} from "@/plugins/filters";
import {swiper, swiperSlide} from "vue-awesome-swiper";

export default {
  name: "ShowGoods",
  props: {
    detail: {
      type: Object,
      default: null,
    },
    store: {
      type: Object,
      default: () => ({
        storeLogo: "",
        storeName: "",
        collectionNum: 0
      })
    },
    ratingDetail: {
      type: Object,
      default: {}
    }
  },
  watch: {
    detail: {
      handler(val) {
        this.skuDetail = val.data;
        this.wholesaleList = val.wholesaleList;
        this.policyList = val.policies
        // if (this.wholesaleList && this.wholesaleList.length > 0) {
        //   this.count = this.wholesaleList[0].num;
        // }
        this.swiperGoodsImg();
      },
      deep: true,
      immediate: true,
    },
    store: {
      handler(val) {
        if (this.Cookies.getItem("buyer_userInfo") && val.id) {
          isCollectionShop(val.id)
            .then((res) => {
              if (res.success && res.result) {
                this.storeCollected = true;
              }
            })
        }
      },
      deep: true
    }
  },
  data() {
    return {
      visualList,
      wholesaleList: [],
      count: 1, // Number of Products
      imgIndex: 0, // Index của ảnh đang hiển thị
      currentSelected: [], // List các thông số đang chọn
      currentSelectedSku: {}, // Thông tin sku đang chọn
      imgList: [], // 商品图片列表
      showImg: false,
      skuDetail: {
        specList: [],
      }, // sku详情
      goodsSpecList: this.detail.specs, // 商品spec
      promotionMap: {
        // 活动状态
        SECKILL: true,
        FULL_DISCOUNT: true,
        COUPON: [],
      }, // 促销活动
      formatList: [], // 选择商品品类的数组
      loading: false, // 立即购买loading
      loading1: false, // 加入购物车loading
      isCollected: false, // 是否收藏
      storeCollected: false,
      policyList: [],
      swiperOptions: {
        direction: "horizontal",
        slidesPerView: 5,
        autoplay: false,
        loop: false,
        freeMode: true,
        // navigation: {nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',}
      },
    };
  },
  components: {
    PicZoom, Promotion, swiper,
    swiperSlide
  },
  computed: {
    rating() {
      return +(this.ratingDetail.avgRating ? this.ratingDetail.avgRating : 0).toFixed(1)
    },
    wholesalePrice(key) {
      return this.wholesaleList.length
        ? this.wholesaleList.map((item) => {
          return item.price;
        })
        : [];
    },
    wholesaleNum(key) {
      return this.wholesaleList.length
        ? this.wholesaleList.map((item) => {
          return {num: item.num, price: item.price};
        })
        : [];
    },
  },
  mounted() {
    if (this.Cookies.getItem("buyer_userInfo")) {
      isCollectionGoods(this.skuDetail.id).then((res) => {
        if (res.success && res.result) {
          this.isCollected = true;
        }
      });
    }
    this.formatSku(this.goodsSpecList);
    this.promotion();
    document.title = this.skuDetail.name;
    setTimeout(() => this.$emit("on-loaded"), 500)
  },
  updated() {
    setTimeout(() => this.$emit("on-loaded"), 500)
  },
  methods: {
    roundedToThousand,
    changeCount(val) {
      if (this.wholesaleList && this.wholesaleList.length > 0) {
        if (this.count <= this.wholesaleList[0].num) {
          this.$Message.warning(this.$t('The purchase quantity of wholesale products cannot be less than the initial quantity'));
          this.count = this.wholesaleList[0].num;
        }
      }
    },
    select(index, value) {
      this.$set(this.currentSelected, index, value);
      let selectedSkuId = this.goodsSpecList.find((i) => {
        let matched = true;
        let specValues = i.specValues.filter((j) => j.specName !== "images");
        for (let n = 0; n < specValues.length; n++) {
          if (specValues[n].specValue !== this.currentSelected[n]) {
            matched = false;
            return;
          }
        }
        if (matched) {
          return i;
        }
      });
      // this.currentSelectedSku = selectedSkuId
      this.currentSelectedSku = this.skuDetail.skuList.find((i) => i.id == selectedSkuId.skuId) || {}
      if(this.currentSelectedSku.thumbnail) {
        this.imgIndex = this.imgList.indexOf(this.imgList.find(i => new URL(i).pathname == new URL(this.currentSelectedSku.thumbnail).pathname))
      }
      this.$emit("handleClickSku", {
        skuId: selectedSkuId.skuId,
        goodsId: this.skuDetail.id,
      });
    },

    addShoppingCartBtn() {
      // 添加购物车
      const params = {
        skuId: this.currentSelectedSku.id,
        num: this.count,
        cartType: 'CART',
        cover: false,
        bookDateTime: new Date().toISOString(),
        serviceId: '',
        clerkId: [],
        storeAddressId: '',
      };
      this.loading = true;
      addCartGoodsRequestBody(params)
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.$Message.success(this.$t('The product has been successfully added to the cart'))
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(() => {
          // this.$Message.error(this.$t('API add to cart error'))
          this.loading = false;
        });
    },

    buyNow() {
      const params = {
        skuId: this.currentSelectedSku.id,
        num: this.count,
        cartType: 'BUY_NOW',
        cover: false,
        bookDateTime: new Date().toISOString(),
        serviceId: '',
        clerkAny: '',
        clerkIds: [],
        storeAddressId: '',
      };

      if (this.skuDetail.goodsType === "VIRTUAL_GOODS") {
        params.cartType = "VIRTUAL";
      }
      this.loading1 = true;
      addCartGoodsRequestBody(params)
        .then((res) => {
          this.loading1 = false;
          if (res.success) {
            this.$router.push({
              path: "/pay",
              query: {way: params.cartType},
            });
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(() => {
          this.$Message.error(this.$t('API buy now error'))
          this.loading1 = false;
        });
    },
    async collect() {
      if (this.isCollected) {
        let cancel = await cancelCollectGoods(this.skuDetail.id);
        if (cancel.success) {
          this.$Message.success(this.$t('Cancellation successful'));
          this.isCollected = false;
        }
      } else {
        let collect = await collectGoods(this.skuDetail.id);
        if (collect.success) {
          this.isCollected = true;
          this.$Message.success(this.$t('Product added to favorite successfully'));
        }
      }
    },

    formatSku(list) {
      try {
        let arr = [{}];
        list.forEach((item, index) => {
          item.specValues.forEach((spec, specIndex) => {
            let name = spec.specName;
            let values = {
              value: spec.specValue,
              quantity: item.quantity,
            };
            if (name === "images") {
              return;
            }

            arr.forEach((arrItem, arrIndex) => {
              if (
                arrItem.name === name &&
                arrItem.values &&
                !arrItem.values.find((i) => i.value === values.value)
              ) {
                arrItem.values.push(values);
              }

              let keys = arr.map((key) => {
                return key.name;
              });
              if (!keys.includes(name)) {
                arr.push({
                  name: name,
                  values: [values],
                });
              }
            });
          });
        });
        arr.shift();
        this.formatList = arr;
        let cur = list.filter((i) => i.skuId === this.$route.query.skuId)[0];
        if (cur) {
          cur.specValues
            .filter((i) => i.specName !== "images")
            .forEach((value, _index) => {
              this.currentSelected[_index] = value.specValue;
            });
        }
        if (this.currentSelected.length == 0) this.currentSelected.push(arr[0].values[0].value)
        this.skuList = list;

      } catch (e) {
        console.log("Error")
      }
      if (this.$route.query.skuId != 'undefined') {
        this.currentSelectedSku = this.skuDetail.skuList.find((i) => i.id == this.$route.query.skuId) || {}
        if(this.currentSelectedSku.thumbnail) {
          this.imgIndex = this.imgList.indexOf(this.imgList.find(i => new URL(i).pathname == new URL(this.currentSelectedSku.thumbnail).pathname))
        }
      } else {
        this.currentSelectedSku = this.skuDetail.skuList[0]
        if(this.currentSelectedSku.thumbnail) {
          this.imgIndex = this.imgList.indexOf(this.imgList.find(i => new URL(i).pathname == new URL(this.currentSelectedSku.thumbnail).pathname))
        }
        this.currentSelected = this.skuDetail.skuList[0].specList.filter((i) => {
          if (i.specValue && i.specName != 'images') return i.specValue
        })
        this.currentSelected = this.currentSelected.map(i => i.specValue)
      }
    },

    receiveCoupon(id) {
      // 领取优惠券
      receiveCoupon(id).then((res) => {
        if (res.success) {
          this.$Message.success(this.$t('Coupon received successfully'));
        } else {
          this.$Message.warning(res.message);
        }
      });
    },

    promotion() {
      // 格式化促销活动，返回当前促销的对象
      if (!this.detail.promotionMap) return false;
      let keysArr = Object.keys(this.detail.promotionMap);
      if (keysArr.length === 0) return false;

      for (let i = 0; i < keysArr.length; i++) {
        let key = keysArr[i].split("-")[0];
        if (key === "COUPON") {
          this.promotionMap[key].push(this.detail.promotionMap[keysArr[i]]);
        } else {
          this.promotionMap[key] = this.detail.promotionMap[keysArr[i]];
        }
      }
    },
    swiperGoodsImg() {
      let set = []
      set.push(...this.skuDetail.goodsGalleryList) // todo
      this.detail.specs.forEach(e => {
        e.specValues.forEach(i => {
          if (i.specName == 'images' && i.specValue) {
            set.push(...(i.specValue.split(',')).map(x => x.split(/[?#]/)[0]))
          }
        })
      })
      this.imgList = Array.from(new Set(set))
    },
    async storeCollect() {
      if (this.storeCollected) {
        let cancel = await cancelCollectShop(this.store.id);
        if (cancel.success) {
          this.$Message.success(this.$t('Unfollow successfully'));
          this.storeCollected = false;
        }
      } else {
        let collect = await collectShop(this.store.id);
        if (collect.success) {
          this.$Message.success(this.$t('The shop is followed successfully'));
          this.storeCollected = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.item-detail-see {
  width: 175px;
  margin-left: 30px;
}

.flex {
  display: flex;
}

.inventory {
  padding-left: 4px;
}

.goods-wrapper {
  @include white_background_color();
}

.item-num {
  text-align: center;
  width: 100px;
}

.item-price-num {
  font-size: 16px;
  color: #666;
}

.item-detail-show {
  width: 1200px;
  max-width: 100vw;
  margin: 0 auto;
  padding: 30px 0;
  display: flex;
  flex-direction: row;
}

.item-detail-left {
  width: 350px;
  margin-right: 30px;
}

.item-detail-big-img {
  width: 350px;
  height: 350px;
  display: flex;
  //position: relative;
  align-items: center;
  box-shadow: 0px 0px 8px $border_color;
  cursor: pointer;
}

.item-detail-big-img img {
  width: 100%;
}

.item-detail-img-row {
  margin-top: 15px;
  overflow-x: scroll;
  display: flex;
}

.item-detail-img-small {
  width: 68px;
  height: 68px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
}

.item-detail-img-small img {
  height: 68px;
  width: 68px;
}

.item-detail-right {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-detail-title p {
  @include content_color($light_content_color);
  font-weight: bold;
  font-size: 20px;
  padding: 8px 0;
}

.item-detail-express {
  font-size: 14px;
  padding: 2px 3px;
  border-radius: 3px;
  background-color: $accent_color;
  color: #fff;
}

.item-detail-tag {
  padding: 8px 0;
  font-size: 14px;
  color: $accent_color;
}

/*价格详情等*/
.item-detail-price-row {
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: url("../../assets/images/goodsDetail/price-bg.png");
}

.item-price-left {
  display: flex;
  flex-direction: column;
}

.item-price-title {
  color: #999999;
  font-size: 14px;
  margin-right: 15px;
}

.item-price-row {
  margin: 5px 0px;
}

.item-price {
  color: $accent_color;
  font-size: 20px;
  cursor: pointer;
}

.item-price-old {
  color: gray;
  text-decoration: line-through;
  font-size: 14px;
  margin-left: 5px;
}

.item-price-coupon-row {
  display: flex;
  align-items: center;
  margin: 5px 0px;
}

.Ellipsis {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; //控制显示几行
  -webkit-box-orient: vertical; //webbox方向
}

.favorite {
  width: 160px;

  div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
  }
}

.dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;
  z-index: 999;
}

.dropdown .item-coupon {
  display: flex;
  align-content: center;
  align-items: center;
  color: $accent_color;
  margin: 5px 0;
  font-size: 14px;
  background-color: #ffdedf;
  border: 1px dotted $accent_color;
  cursor: pointer;

  span {
    padding: 3px;
  }
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.item-coupon {
  margin-right: 5px;
  padding: 0 5px;
  color: $accent_color;
  font-size: 14px;
  background-color: #ffdedf;
  border: 1px dotted $accent_color;
  cursor: pointer;

  span {
    padding: 3px;
  }
}

.item-promotion {
  margin-right: 5px;
  padding: 3px;
  color: $accent_color;
  font-size: 14px;
  border: 1px solid $accent_color;
}

.item-price-right {
  display: flex;
  align-content: center;
  align-items: center;
}

.item-remarks-sum {
  text-align: center;
  padding: 0 10px;
  border-right: 1px solid $border_color;
}

.item-remarks-sum p {
  color: #999999;
  font-size: 14px;
  line-height: 10px;
  text-align: center;
}

.item-remarks-num {
  line-height: 18px;
  color: #005eb7;
}

.item-select {
  display: flex;
  flex-direction: row;
  margin-top: 15px;
}

.item-select-title {
  @include content_color($light_content_color);
  font-size: 14px;
  margin-right: 15px;
  width: 60px;
}

.item-select-column {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}

.item-select-row {
  margin-bottom: 8px;
}

.item-select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-select-box {
  padding: 5px;
  margin-right: 8px;
  @include background_color($light_background_color);
  border: 0.5px solid $border_color;
  cursor: pointer;
  @include content_color($light_content_color);
}

.item-select-box:hover {
  border: 0.5px solid $accent_color;
}

.item-select-box-active {
  border: 0.5px solid $accent_color;
}

.item-select-intro p {
  margin: 0px;
  padding: 5px;
}

.add-buy-car-box {
  width: 100%;
  margin-top: 15px;
  border-top: 1px dotted $border_color;
}

.add-buy-car {
  margin-top: 15px;

  > * {
    margin: 0 4px;
  }
}

.goodsConfig {
  display: flex;
  justify-content: space-between;
  text-align: center;

  > span {
    padding-right: 10px;

    &:hover {
      cursor: pointer;
      color: $accent_color;
    }
  }
}

.item-detail-info {
  font-size: 14px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .booked-number {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 4px;

    div:nth-of-type(1) {
      color: #767676;
      margin-right: 5px;
    }

    div:nth-of-type(2) {
      font-size: 16px;
    }
  }
}

.item-detail-policy {
  width: 250px;
  margin-left: 10px;
  border: 1px solid #eee;
  padding: 10px;

  .store {
    width: 100%;
    padding: 0px 0px 8px 0px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
    font-weight: 600;

    .store-info {
      display: flex;
      flex-flow: row nowrap;
      gap: 10px;
      margin-bottom: 8px;

      > img {
        width: 44px;
        height: 44px;
        object-fit: cover;
        border-radius: 50%;
      }

      > div {
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-around;
        align-items: start;

        > img {
          height: 16px;
          object-fit: contain;
        }
      }
    }

    .store-detail {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;

      > * {
        padding: 4px;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        .description-text {
          font-size: 12px !important;
          font-weight: 100 !important;
          color: #9c9c9c !important;
        }
      }
    }

    .store-action {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-evenly;
      gap: 10px;
    }
  }

  .header {
    font-size: 12px;
    font-weight: 600;
    color: #757575;
  }

  .policy-item {
    display: flex;
    padding: 10px 16px;

    > a {
      text-decoration: none;
      cursor: pointer;
      color: #000;

      &:hover {
        text-decoration: underline;
      }
    }

    .policy-image {
      width: 40px;
      height: 20px;
      object-fit: contain;
    }
  }
}

/******************商品图片及购买详情结束******************/
.modal {
  display: block; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 10000; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: hidden; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  position: absolute;
  background-color: #fefefe;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: fit-content;
  height: 700px;
}

.modal-content img {
  height: 700px;
}

/* The Close Button */
.close {
  color: black;
  position: absolute;
  top: 0px;
  right: 10px;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #aaa;
  text-decoration: none;
  cursor: pointer;
}

/* Select Slot */
.ivu-radio-group-button .ivu-radio-wrapper {
  margin-right: 5px;
  width: 60px;
  border-radius: 4px;
  border: solid 1px #cbcbcb;
}

.ivu-radio-group-button .ivu-radio-wrapper:hover {
  color: $accent_color
}

.ivu-radio-group-button .ivu-radio-wrapper:before, .ivu-radio-group-button .ivu-radio-wrapper:after {
  display: none;
}

.ivu-radio-group-button .ivu-radio-wrapper-disabled:hover {
  color: #ccc
}

.ivu-radio-group-button .ivu-radio-wrapper-checked {
  background-color: $accent_color;
  color: #fff;
  box-shadow: none;
}

.ivu-radio-group-button .ivu-radio-wrapper-checked:hover {
  color: #fff;
}

.ivu-radio-group-button .ivu-radio-wrapper-checked.ivu-radio-focus {
  box-shadow: 0 0 0 2px rgba(10, 88, 202, 0.2);
}

/deep/ .ivu-icon-md-star {
  vertical-align: baseline;
}
</style>
