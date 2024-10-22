<template>
  <div class="service-wrapper">
    <div class="item-detail-show">
      <!--region Image-->
      <div class="item-detail-left">
        <div class="item-detail-big-img">
          <img v-if="imgList" :src="imgList[imgIndex] || detail.thumbnail" @click="showImg = true"/>
        </div>
        <div class="item-detail-img-row">
          <div
            v-for="(item, index) in imgList"
            :key="index"
            class="item-detail-img-small"
            @mouseover="imgIndex = index"
          >
            <img :src="item"/>
          </div>
        </div>

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
                :color="isCollected ? '#ed3f14' : '#666'"
                size="20"
                type="ios-heart"
              />&nbsp;{{ isCollected ? $t('Added to favorites') : $t('Add to favorites') }}
            </div>
          </div>
        </div>
      </div>
      <!--endregion-->
      <!--region Detail-->
      <div class="item-detail-right">
        <div class="item-detail-title">
          <p>
            {{ serviceDetail.name }}
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
            <div>{{ serviceDetail.buyCount || 0 }}</div>
          </div>
        </div>
        <Promotion
          v-if="promotionMap['SECKILL']"
          :time="promotionMap['SECKILL'].endTime"
        ></Promotion>
        <div class="item-detail-price-row">
          <div class="item-price-left">
            <div
              v-if="serviceDetail.promotionPrice && promotionMap['SECKILL']"
              class="item-price-row"
            >
              <p>
                <span v-if="promotionMap['SECKILL']" class="item-price-title"
                >{{ $t('Seckill Price') }}</span
                >
                <span class="item-price">{{
                    serviceDetail.promotionPrice | unitPrice("₫",  "before")
                  }}</span>
                <span class="item-price-old">{{
                    serviceDetail.price | unitPrice("₫",  "before")
                  }}</span>
              </p>
            </div>
            <div v-else class="item-price-row">
                <span class="item-price-title"
                >{{ $t('Price') }}</span
                >
              <span v-if="serviceDetail.minPrice == serviceDetail.maxPrice" class="item-price">{{
                  serviceDetail.price | unitPrice("₫",  "before")
                }}</span>

              <span v-else class="item-price">
                {{ serviceDetail.minPrice | unitPrice("₫",  "before") }} -
                {{ serviceDetail.maxPrice | unitPrice("₫",  "before") }}
              </span>
            </div>
            <div v-if="promotionMap['COUPON'].length" class="item-price-coupon-row">
              <p class="Ellipsis"/>
              <span class="item-price-title">{{ $t('Coupons') }}</span>
              <span>
                  <span
                    v-for="(item, index) in promotionMap['COUPON'].slice(0, 6)"
                    :key="index"
                    class="item-coupon"
                    @click="receiveCoupon(item.id)"
                  >
                    <span v-if="item.couponType == 'PRICE'">
                      {{ $t('Buy minimum {0} get discount {1}', [item.consumeThreshold, item.price]) }}
                    </span>
                    <span v-if="item.couponType == 'DISCOUNT'">
                      {{ $t('Buy minimum {0} get discount {1}', [item.consumeThreshold, item.couponDiscount]) }}
                    </span>
                  </span>
                </span>
              <div v-if="promotionMap['COUPON'].length > 6" class="dropdown">
                <span>{{ $t('More') }}</span>
                <div class="dropdown-content">
                        <span
                          v-for="(item, index) in promotionMap['COUPON'].slice(6, promotionMap['COUPON'].length)"
                          :key="index"
                          class="item-coupon"
                          @click="receiveCoupon(item.id)">
                          <span v-if="item.couponType == 'PRICE'">
                            {{ $t('Buy minimum {0} get discount {1}', [item.consumeThreshold, item.price]) }}
                          </span>
                          <span v-if="item.couponType == 'DISCOUNT'">
                            {{ $t('Buy minimum {0} get discount {1}', [item.consumeThreshold, item.couponDiscount]) }}
                          </span>
                        </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="item-select">
          <div class="item-select-title">
            <p>{{ $t('Branch') }}</p>
          </div>
          <div class="item-select-row">
            <Select v-model="selectedBranch" style="width: 200px" @on-change="handleChangeSlot">
              <Tooltip v-for="(item, index) in branchList"
                       :key="index"
                       :content="item.address"
                       placement="right"
                       transfer
              >
                <template #content>
                  <div style="white-space: normal">{{ item.address }}</div>
                </template>
                <Option :value="item">{{ item.addressName }}</Option>
              </Tooltip>
            </Select>

            <!--            <multiselect v-model="selectedBranch" label="addressName" track-by="id" :options="branchList"-->
            <!--                         :show-labels="false" :close-on-select="true" :searchable="false"-->
            <!--                         @input="handleChangeSlot" placeholder="">-->
            <!--              <template #singleLabel="props"><span class="option__desc"><span-->
            <!--                class="option__title">{{ props.option.addressName }}</span></span></template>-->
            <!--              <template #option="props">-->
            <!--                <div class="option__desc"><span class="option__title">{{ props.option.addressName }}, {{props.option.address}}</span></div>-->
            <!--              </template>-->
            <!--            </multiselect>-->
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
            <div class="item-select-row">
              <div
                v-for="item in sku.values"
                :key="item.value"
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
        </div>
        <div class="item-select">
          <div class="item-select-title">
            <p>{{ $t('Time') }}</p>
          </div>
          <div class="item-select-row">
            <DatePicker
              ref="date"
              v-model="selectedTime"
              :clearable=false
              :options="dateOption"
              format="yyyy-MM-dd"
              type="date"
              @on-change="handleChangeSlot"
            ></DatePicker>
          </div>
        </div>
        <!--  SLOT      -->
        <div v-if="slotList.length >0" class="item-select">
          <div class="item-select-title">
            <p>{{ $t('Select time') }}</p>
          </div>
          <div class="item-select-column">
            <div class="item-select-row">
              <RadioGroup v-model="selectedSlot" type="button">
                <div v-for="(index) in Math.ceil(slotList.length/6)" :key="index" style="margin-bottom: 5px">
                  <Radio v-for="(item, index) in slotList.slice((index-1)*6,(index-1)*6+6)"
                         :key="index" :disabled="handleDisableSlot(item)"
                         :label="item"></Radio>
                </div>
              </RadioGroup>
            </div>
            <span v-if="error.slot" class="error-text"><Iconify
              icon="bi:exclamation-circle"
              style="color: red"
            /> {{ $t('Please pick a slot before booking') }}</span>
          </div>
        </div>

        <!--        QUANTITY-->
        <div v-if="selectedSlot && slotList.length >0">
          <div class="item-select">
            <div class="item-select-title">
              <p>{{ $t('Quantity') }}</p>
            </div>
            <div class="item-select-row align-item-center">
              <InputNumber
                v-model="count"
                :max="clerkList.length"
                :min="1"
                :precision="0.1"
                @on-change="checkCount(count)"
              ></InputNumber>
              <Icon size="12" style="margin-left: 1rem" type="ios-alert-outline"/>
              <span
                class="helper-text"> &nbsp;{{
                  $t('The number of employee can be selected depends on the number of people')
                }}
            </span>
            </div>
          </div>
          <div v-if="selectedSlot && slotList.length >0" class="item-select">
            <div class="item-select-title">
              <p>{{ $t('Clerk') }}</p>
            </div>
            <div class="item-select-row clerk-choose">
              <!--              <Select v-model="selectedClerkList" multiple :max-tag-count="2" @on-change="limitter">-->
              <!--                <Option v-for="(item,index) in clerkList" :value="item.clerkId" :key="index">-->
              <!--                  {{ item.clerkName }}-->
              <!--                </Option>-->
              <!--              </Select>-->
              <multiselect v-model="selectedClerkList"
                           :close-on-select="selectedClerkList.length == count-1" :custom-label="customLabel"
                           :max="count" :multiple="true"
                           :options="clerkList" :searchable="false" :show-labels="false" label="clerkName"
                           placeholder=""
                           track-by="clerkId"
              >
                <template #singleLabel="props"><span class="option__desc"><span
                  class="option__title">{{ props.option.clerkName }}</span></span></template>
                <template #option="props">
                  <div class="option__desc"><span class="option__title">{{
                      props.option.clerkName
                    }} ({{ props.option.price | unitPrice("₫",  "before") }})</span></div>
                </template>
                <template #maxElements="props">
                  <div></div>
                </template>
              </multiselect>
            </div>
          </div>
        </div>
        <br/>
        <div class="add-buy-car-box">
          <div class="add-buy-car">
            <Button
              :loading="addToCartLoading"
              type="warning"
              @click="bookNow"
            >{{ $t('Book now') }}
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
              <span>{{ store.collectionNum | roundedToThousand}}</span>
              <span class="description-text">{{$t('Follow')}}</span>
            </div>
            <div class="store-feedback">
              <span>99%</span>
              <span class="description-text">Phản hồi tin nhắn</span>
            </div>
          </div>
          <div class="store-action">
            <Button size="default" v-if="storeCollected" icon="ios-heart" type="primary" @click="storeCollect">
              {{ $t('Followed') }}
            </Button>
            <Button size="default" v-else icon="ios-heart" type="default" @click="storeCollect">{{
                $t('Follow')
              }}
            </Button>
            <Button size="default" type="default" @click="linkTo(`/merchant?id=${store.id}`)">{{
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
      <!--      <div class="item-detail-policy">-->
      <!--        <div class="header">{{ $t('Policy') }}</div>-->
      <!--        <div class="policy-item" v-for="(policy, index) in policyList" :key="index">-->
      <!--          <img v-if="policy.image == 'auth'" class="policy-image" :src="visualList[0].url" alt=""/>-->
      <!--          <img v-if="policy.image == '7daysRefund'" class="policy-image" :src="visualList[1].url" alt=""/>-->
      <!--          <img v-if="policy.image == 'shield'" class="policy-image" :src="visualList[2].url" alt=""/>-->
      <!--          <a target="_blank" :href="`/article/policy?id=${policy.id}`">{{policy.name}}</a>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--endregion-->
    </div>
    <div v-if="showImg" id="myModal" class="modal" @click="showImg=false">
      <div class="modal-content">
        <img :src="imgList[imgIndex]"/>
      </div>

    </div>
  </div>
</template>

<script>
import Promotion from "../goodsDetail/Promotion.vue";
import Multiselect from 'vue-multiselect'

import {
  cancelCollectService,
  cancelCollectShop,
  collectService,
  collectShop,
  isCollectionService,
  isCollectionShop,
  receiveCoupon,
} from "@/api/member.js";
import {addCartServices} from "@/api/cart.js";
import {getBranch} from "@/api/shopentry";
import {getServicesSlot} from "@/api/services";
import {getClerkListForSlot} from "@/api/goods";
import {unitPrice} from "@/plugins/filters";
import {visualList} from "@/components/goodsDetail/visualConfig";

export default {
  name: "ShowServices",
  components: {Promotion, Multiselect},
  props: {
    detail: {
      type: Object,
      default: {},
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

  data() {
    return {
      visualList,
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      wholesaleList: [],
      imgIndex: 0,
      currentSelected: [],
      imgList: [''],
      showImg: false,
      serviceDetail: {
        name: '',
        sellingPoint: '',
        buyCount: '',
        promotionPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        specList: [],
      },

      // Thay count bang clerkChoose.length
      count: 1,
      selectedClerkList: [],
      clerkList: [],
      policyList: [],
      // goodsSpecList: this.detail.specs,
      promotionMap: {
        SECKILL: true,
        FULL_DISCOUNT: true,
        COUPON: [],
      },
      formatList: [],
      selectedTime: '',
      branchList: [],
      slotList: [],
      selectedSlot: '',
      error: {
        slot: false,
      },
      selectedBranch: {
        id: '',
      },
      loading: false, // BUY NOWLOADING
      addToCartLoading: false, // ADD TO CARTLOADING
      isCollected: false, // Whether to favorite
      storeCollected: false,
    };
  },
  watch: {
    selectedSlot: {
      handler(val) {
        if (val) this.error.slot = false
        let offset = new Date(this.selectedTime).getTimezoneOffset()
        const formattedTime = new Date(new Date(this.selectedTime).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0]
        const params = {
          serviceId: this.serviceDetail.id,
          storeId: this.serviceDetail.storeId,
          storeAddressId: this.selectedBranch.id,
          'time.start': [formattedTime, [val]].join('T')
        }
        this.updateClerkList(params);
      }
    },
    detail: {
      handler(val) {
        this.serviceDetail = val;
        this.policyList = val.policies
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
    },
    serviceDetail: {
      handler(val) {
        document.title = this.serviceDetail.name
        if (this.Cookies.getItem("buyer_userInfo")) {
          isCollectionService(this.serviceDetail.id).then((res) => {
            if (res.success) {
              this.isCollected = res.result;
            }
          });
        }
        this.getBranchServices()
      },
      deep: true,

    },
  },
  computed: {
    rating() {
      if (this.ratingDetail.avgRating) return this.ratingDetail.avgRating.toFixed(1)
      return 0
    },
  },

  created() {
    this.selectedTime = this.today()
  },

  mounted() {
    setTimeout(() => this.$emit("on-loaded"), 500)
  },
  updated() {
    setTimeout(() => this.$emit("on-loaded"), 500)
  },
  methods: {
    customLabel({clerkName, price}) {
      return `${clerkName} (${unitPrice(price, "₫",  "before")})`
    },
    today() {
      let today = new Date()
      return today.toISOString().split('T')[0]
    },
    getBranchServices() {
      const params = {
        storeId: this.serviceDetail.storeId,
        serviceId: this.serviceDetail.id
      }
      getBranch(params)
        .then(branch => {
          this.branchList = branch.result
          this.selectedBranch = branch.result[0]
          const paramsSlot = {
            serviceId: this.serviceDetail.id,
            storeAddressId: this.selectedBranch.id,
            clerkId: '',
            storeId: this.serviceDetail.storeId,
            date: this.selectedTime,
          }
          getServicesSlot(paramsSlot)
            .then(slot => {
              this.selectedSlot = ""
              this.slotList = slot
              if (slot.length === 0) {
                // this.$Message.info(this.$t('This service is not scheduled in the chosen date'))
              }
            })
            .catch(err => {
              this.$Message.error(err.response.data.message)
              this.slotList = []
            })
        })
    },
    isInThePast(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(date) < today;
    },
    handleDisableSlot(slot) {
      // Nếu Ngày chọn nhỏ hơn Ngày hiện tại thì disable=true
      if (this.isInThePast(this.selectedTime)) return true

      // Nếu Ngày chọn là ngày hiện tại
      if (new Date(this.selectedTime).getDate() === new Date().getDate()) {
        // Nếu giờ chọn nhỏ hơn giờ hiện tại thì disable=true
        if (parseInt(slot.split(':')[0]) < new Date().getHours()) {
          return true
        }
        // Nếu giờ chọn bằng giờ hiện tại và phút nhỏ hơn bằng phút hiện tại thì disable=true
        if (parseInt(slot.split(':')[0]) == new Date().getHours() &&
          parseInt(slot.split(':')[1]) <= new Date().getMinutes()) {
          return true
        }
      }
      return false
    },
    handleChangeSlot() {
      const paramsSlot = {
        storeId: this.serviceDetail.storeId,
        serviceId: this.serviceDetail.id,
        storeAddressId: this.selectedBranch.id,
        date: this.formatSelectedDate(this.selectedTime),
      }
      getServicesSlot(paramsSlot).then(res => {
        this.selectedSlot = "";
          this.slotList = res
        if (res.length == 0) {
          this.$Message.info(this.$t('This service is not scheduled in the chosen date'))
        }
      }).catch((err) => {
        this.slotList = []
      })
    },
    formatSelectedDate(date) {
      let offset = new Date(date).getTimezoneOffset()
      return new Date(new Date(date).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0]
    },

    updateClerkList(params) {
      getClerkListForSlot(params).then(res => {
        this.selectedClerkList = []
        this.clerkList = res.result
      })
    },
    select(index, value) {
      this.$set(this.currentSelected, index, value);
      let selectedSkuId = this.goodsSpecList.find((i) => {
        let matched = true;
        let specValues = i.specValues.filter((j) => j.specName !== "images" && j.specName !== "clerkId");
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
      this.$emit("handleClickSku", {
        skuId: selectedSkuId.skuId,
        goodsId: this.skuDetail.goodsId,
      });
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
        if (collect.code === 200) {
          this.storeCollected = true;
          this.$Message.success(this.$t('The shop is followed successfully'));
        }
      }
    },
    bookNow() {
      if (this.selectedSlot === "") {
        this.error.slot = true
      }
      if (Object.values(this.error).some(i => i == true)) {
        return
      }
      const offset = new Date(this.selectedTime).getTimezoneOffset()
      const formattedTime = new Date(new Date(this.selectedTime).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0]

      const params = {
        num: this.count,
        cartType: "SERVICE",
        storeAddressId: this.selectedBranch.id,
        serviceId: this.serviceDetail.id,
        bookDateTime: [formattedTime, [this.selectedSlot]].join('T'),
        clerkIds: this.selectedClerkList.map(i => i.clerkId)
      };
      this.addToCartLoading = true;
      addCartServices(params)
        .then((res) => {
          if (res.success) {
            this.$router.push({
              path: "/book",
            });
          } else {
            this.$Message.warning(res.message);
          }
        })
        .finally(() => {
          this.addToCartLoading = false;
        })
    },

    async collect() {
      if (this.isCollected) {
        let cancel = await cancelCollectService(this.serviceDetail.id);
        if (cancel.success) {
          this.$Message.success(this.$t('Cancellation successful'));
          this.isCollected = false;
        }
      } else {
        let collect = await collectService(this.serviceDetail.id);

        if (collect.code === 200) {
          this.isCollected = true;
          this.$Message.success(this.$t('Product added to favorite successfully'));
        }
      }
    },

    //TODO
    checkCount(count) {
      const tmp = this.selectedClerkList.length - count
      if (count < this.selectedClerkList.length && this.selectedClerkList.length > 0 && count != null) {
        this.selectedClerkList.splice(0, tmp)
      }

    },

    // limitter(e) {
    //   if (e.length > this.count) {
    //     this.count = e.length
    //   }
    //
    // },
    receiveCoupon(id) {
      receiveCoupon(id).then((res) => {
        if (res.success) {
          this.$Message.success(this.$t('Coupon received successfully'));
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    promotion() {
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
      this.imgList = this.serviceDetail.serviceGalleryList;
    },
  },
};
</script>

<style lang="scss" scoped>

.helper-text {
  font-size: 14px;
  color: #888;

}

.clerk-choose {
  min-width: 320px;

}

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

.service-wrapper {
  @include white_background_color();
}

.error-text {
  color: $error_color;

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
  align-items: center;
  box-shadow: 0px 0px 8px $border_color;
  cursor: pointer;
  justify-content: center;
}

.item-detail-big-img img {
  max-width: 100%;
  max-height: 100%;
}

.item-detail-img-row {
  margin-top: 15px;
  display: flex;
}

.item-detail-img-small {
  width: 68px;
  height: 68px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
  margin-left: 5px;
}

.item-detail-img-small img {
  height: 100%;
  width: 100%;
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
  width: 100px;
}

.item-select-column {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  flex: 1;
}

.item-select-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  width: 100%;

  /deep/ .ivu-tooltip {
    display: block;
  }
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
  align-items: center;

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

  > span {
    padding-right: 10px;

    &:hover {
      cursor: pointer;
      color: $secondary_color;
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

.ivu-radio-group-button .ivu-radio-wrapper {
  padding: 0;
  text-align: center;
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
</style>
