<template>
  <div class="pay-order">
    <Divider/>
    <div class="content width_1200">
      <div class="goods-content">
        <div class="card-head mt_20 mb_20">
          <span>{{ $t('Booking information') }}</span>
        </div>
        <div class="goods-msg">
          <div>
            <div class="shop-name">
              <span class="hover-color" @click="goShopPage(serviceDetail[0].storeId)">
                <span>{{ serviceDetail[0].storeName }}</span>
                <span v-if="bookDetail.address"> - {{ bookDetail.address }}</span>
              </span>
            </div>
            <div v-for="(item, index) in serviceDetail" :key="index" class="goods-list">
              <div class="service-header">
                <span>{{ $t('Service') }}</span>
                <span>{{ $t('Service price') }}</span>
                <span>{{ $t('Clerks') }}</span>
                <span>{{ $t('Flow price') }}</span>
              </div>
              <div class="goods-item">
                <span>
                  <img :src="item.product.thumbnail" alt=""/>
                  <div class="service-title" style="vertical-align: top">
                    <span class="hover-title">{{ item.product.name }}</span>
                    <span>{{ bookDetail.bookDateTime.split("T").join(" ") }}</span>
                  </div>
                </span>
                <span class="goods-price">{{ item.priceDetailDTO.productPrice | unitPrice("₫",  "before") }}</span>
                <div class="clerk-list">
                  <span>{{ item.clerkName }}</span>
                </div>
                <span class="goods-price">{{ item.priceDetailDTO.flowPrice | unitPrice("₫",  "before") }}</span>
              </div>
            </div>
            <div class="order-mark">
              <Input
                v-model="remark"
                :placeholder="$t('Note')"
                maxlength="60"
                show-word-limit
                type="textarea"
              />
              <span style="font-size: 14px; color: #999">
                {{ $t('Tip: Please do not fill in the information about payment, receipt, invoice') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="invoice">
        <div class="card-head mt_20 mb_20">
          <span class="relative"
          >{{ $t('Invoice Information') }}</span>
          <span style="font-size: 14px; color: #999">
              <Icon type="ios-alert-outline"/>
              {{
              $t('The taxpayer identification number must be filled in when issuing the enterprise invoice, so as not to affect the reimbursement')
            }}
            </span>
        </div>
        <div class="inovice-content">
          <span>{{ invoiceData.receiptTitle }}</span>
          <span>{{ invoiceData.receiptContent }}</span>
          <span @click="editInvoice">{{ $t('Edit') }}</span>
        </div>
      </div>
      <div class="invoice">
        <div class="card-head mt_20 mb_20">
          <span class="relative">{{ $t('Coupons') }}</span>
        </div>
        <div v-if="couponList.length === 0">{{ $t('No coupon available') }}</div>
        <ul v-else class="coupon-list">
          <li
            v-for="(item, index) in couponList"
            :key="index"
            class="coupon-item"
          >
            <div class="c-left">
              <div>
                <span
                  v-if="item.couponType === 'PRICE'"
                  class="fontsize_12 global_color"
                ><span class="price">{{
                    item.price | unitPrice("₫",  "before")
                  }}</span></span
                >
                <span
                  v-if="item.couponType === 'DISCOUNT'"
                  class="fontsize_12 global_color"
                ><span class="price">{{ item.discount }}</span
                > </span
                >
                <span class="describe"
                >{{ $t('{0} available', [item.consumeThreshold]) }}</span
                >
              </div>
              <p>{{ $t('Scope of use') }}：{{ useScope(item.scopeType) }}</p>
              <p>{{ $t('Validity period') }}：{{ item.endTime }}</p>
            </div>
            <img
              v-if="usedCouponId.includes(item.id)"
              alt=""
              class="used"
              src="../../assets/images/geted.png"
            />
            <a class="c-right" @click="useCoupon(item.id, true)">{{ $t('Use now') }}</a>
            <a
              v-if="usedCouponId.includes(item.id)"
              class="c-right"
              @click="useCoupon(item.id, false)"
            >{{ $t('Give up discount') }}</a>
            <i class="circle-top"></i>
            <i class="circle-bottom"></i>
          </li>
        </ul>
      </div>
      <div class="payment-method">
        <div class="card-head mt_20 mb_20">
          <span class="relative">{{ $t('Payment Method') }}</span>
        </div>
        <div class="method-manage">
          <div v-for="(item, index) in paymentList" :key="index"
               :class="paymentMethod == item ? 'selected' : ''"
               class="method-item"
               @click="selectMethod(item)"
          >
            <div>
              {{ item }}
            </div>
            <div v-show="paymentMethod == item" class="corner-icon">
              <div class="checkmark"></div>
              <Icon type="md-checkmark"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-footer width_1200">
      <div class="order-price">
        <span>{{ $t('Amount to be paid') }}：</span>
        <span class="actrual-price">
        {{ priceDetail.flowPrice | unitPrice("₫",  "before") }}
        </span>
      </div>
      <div class="pay ml_20" @click="book">{{ $t('Submit') }}</div>
    </div>
    <BaseFooter></BaseFooter>
    <invoice-modal
      ref="invModal"
      :invoiceData="invoiceData"
      @change="getInvMsg"
    />
  </div>
</template>

<script>
import invoiceModal from "../../components/invoiceModal";
import {checkServiceBook, createTrade, getPaymentMethod} from "@/api/cart";
import NavigationBar from "@/pages/index/NavigationBar.vue";

export default {
  name: "Book",
  components: {
    NavigationBar,
    invoiceModal
  },
  data() {
    return {
      invoiceData: {
        receiptTitle: this.$t('Title'),
        receiptContent: this.$t('Content'),
      },
      serviceDetail: [
        {
          clerkName: '',
          product: {
            thumbnail: '',
          },
          priceDetailDTO: {
            productPrice: 0,
            flowPrice: 0,
          }
        }
      ],
      bookDetail: {
        bookDateTime: '',
      },
      couponList: [],
      priceDetail: {},
      paymentList: [],
      paymentMethod: '',
      remark: "",
      usedCouponId: "",
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$Spin.show()
      getPaymentMethod({clientType: 'PC'})
        .then(res => {
          this.paymentList = res.result
          this.paymentMethod = res.result[0]
        })
      checkServiceBook({way: "SERVICE"})
        .then(res => {
          this.$Spin.hide()
          this.bookDetail = res.result
          this.serviceDetail = res.result.cartProducts
          this.priceDetail = res.result.priceDetailDTO
        })
        .catch(err => {
          this.$Spin.hide()
          this.$Message.error(this.$t('API check booking error'))
        })
    },
    editInvoice() {
      this.$refs.invModal.invoiceAvailable = true;
    },
    useScope() {

    },
    useCoupon() {

    },
    selectMethod(item) {
      this.paymentMethod = item
    },
    book() {
      const params = {
        client: "PC",
        remark: [{
          storeId: this.serviceDetail.storeId,
          remark: this.remark
        }],
        way: 'SERVICE',
        paymentMethod: this.paymentMethod
      };
      this.$Spin.show();
      createTrade(params)
        .then((res) => {
          this.$Spin.hide();
          if (res.success) {
            // if (params.way === "POINTS") {
            //   this.$router.push("/payDone");
            // } else {
            //   this.$router.push({
            //     path: "/payment",
            //     query: {orderType: "TRADE", sn: res.result.sn},
            //   });
            // }
            this.$router.push("/payDone");
          }
        }).finally(() => {
        this.$Spin.hide();
      })
    },
    getInvMsg() {

    },
    goShopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: {id: id},
      });
      window.open(routeUrl.href, "_blank");
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/coupon.scss";

.goods-msg {
  overflow: hidden;
}

.logo {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto 0;

  div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      width: 150px;
      height: auto;
      cursor: pointer;
    }

    div:nth-child(2) {
      width: 200px;
      color: #999;
      font-size: 16px;
      margin: 0 20px;

      span {
        color: $accent_color;
      }
    }
  }
}

.address-detail {
  font-size: 14px;
  margin: 6px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cart-steps {
  height: 30px;
  display: flex;
  align-items: center;

  span {
    @include content_color($light_content_color);
    height: 30px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    padding: 0 15px;
  }

  .ivu-icon {
    @include content_color($light_content_color);
    font-size: 20px;
    margin: 0 15px;
  }

  .active {
    border-radius: 50px;
    background-color: #ff8f23;
    color: #fff;
  }

  .active-arrow {
    color: #ff8f23;
  }
}

/** logo end */
/** content start */
.content {
  margin: 20px auto;
  background-color: #fff;
  min-height: 200px;
  padding: 15px 25px;
}


/** 购买商品列表 start */
.shop-name {
  display: flex;
  justify-content: space-between;

  > span:nth-child(1) {
    font-weight: bold;

    .ivu-icon {
      color: #ff8f23;

      &:hover {
        color: $accent_color;
      }
    }
  }

  > span:nth-child(2) {
    color: #999;
    position: relative;
    display: flex;
    width: 200px;
  }

  .delivery-list {
    position: absolute;
    right: 0;
    top: 20px;
    background-color: #f3fafe;
    box-shadow: 0px 0px 5px #b9b2b2;
    display: flex;
    flex-wrap: wrap;
    width: 200px;
    min-height: 100px;
    padding: 10px;

    li {
      width: 90px;
      height: 30px;
      text-align: center;

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.goods-list {
  width: 1150px;
  background-color: #f8f8f8;
  margin: 10px 0 20px 0;

  .goods-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px 0;
    margin: 0 20px;
    border-bottom: 1px dotted #999;

    &:last-child {
      border: none;
    }

    img {
      width: 48px;
      height: 48px;
    }

    > span {
      text-align: center;
      width: 150px;
    }

    > span:nth-child(1) {
      font-size: 14px;

      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: row;

      > div {
        width: 500px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;

        span:nth-of-type(1) {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }

    > span:last-child {
      color: $accent_color;
      font-weight: bold;
    }

    .clerk-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      width: 150px;
    }

    .goods-price {
      font-size: 16px;
    }
  }
}

.order-mark {
  width: 500px;
}

/** 购买商品列表 end */
/** 发票信息 start */
.invoice {
  .inv-tips {
    position: absolute;
    border: 1px solid #ddd;
    width: 310px;
    padding: 3px;
    margin: 0 0 0 10px;
    font-size: 14px !important;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);

    &::before {
      content: "";
      display: inline-block;
      width: 12px;
      height: 17px;
      background: url(../../assets/images/arrow-left.png) 0 0 no-repeat;
      background-color: #fff;
      position: absolute;
      left: -9px;
    }

    .ivu-icon {
      color: #ff8f23;
      margin-right: 3px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .inovice-content {
    > span {
      margin-right: 10px;
    }

    > span:last-child {
      color: $accent_color;
      cursor: pointer;

      &:hover {
        border-bottom: 1px solid $accent_color;
      }
    }
  }
}

/** 发票信息 end */

/** 订单价格 */
.order-price {
  text-align: right;
  font-size: 16px;
  color: #999;

  > div > span:nth-child(2) {
    width: 130px;
    text-align: right;
    display: inline-block;
    margin-top: 10px;
  }

  .actrual-price {
    color: $accent_color;
    font-weight: bold;
    font-size: 20px;
  }
}

/** content end */
/** 底部支付栏 */
.order-footer {
  z-index: 20;
  height: 50px;
  @include background_color($light_white_background_color);
  @include title_color($title_color);
  display: flex;
  align-items: center;
  justify-content: end;
  border-top: 1px solid #ddd;
  margin: 10px auto;

  .pay-address {
    text-align: left !important;
  }

  div {
    text-align: center;
  }

  position: sticky;
  bottom: 0;

  .pay {
    background-color: $accent_color;
    width: 150px;
    font-size: 20px;
    color: #fff;
    height: 100%;
    line-height: 50px;
    cursor: pointer;
  }
}

/** 公共表头 */
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dddddd;
  height: 40px;

  span:nth-child(1) {
    font-size: 18px;
  }

  span:nth-child(2) {
    font-size: 14px;
    color: #438cde;
    cursor: pointer;

    &:hover {
      color: $accent_color;
    }
  }
}

.ivu-divider {
  background: $accent_color;
  height: 2px;
}

.pay-address {
  font-size: 14px;
}

.more-addr {
  cursor: pointer;
  margin-top: 10px;
  display: inline-block;
}

.coupon-item {
  width: 260px;
  height: 125px;
  margin-right: 10px;
  margin-bottom: 10px;

  .c-right {
    width: 30px;
    padding: 10px 7px;
  }

  b {
    background: url("../../assets/images/small-circle.png") top left repeat-y;
    right: 28px;
  }

  .circle-top,
  .circle-bottom {
    right: 22px;
  }

  .used {
    position: absolute;
    top: 60px;
    right: 40px;
    width: 50px;
    height: 50px;
  }
}

.coupon-list {
  max-height: 260px;
  overflow: scroll;
}

.service-header {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px 0px 0px 0px;
  margin: 0 20px;
  font-size: 14px;
  font-weight: 700;

  span:nth-of-type(1) {
    flex: 1;
    text-align: left !important;
  }

  > span {
    width: 150px;
    text-align: center;
  }
}

.method-manage {
  display: flex;
  flex-wrap: wrap;

  > div {
    border: 1px solid #949494;
    border-radius: 8px;
    width: 100px;
    height: 40px;
    margin: 20px 20px 0 0;
    padding: 10px;
    cursor: pointer;
    color: #999;

    &:hover {
      border-color: $accent_color_tint;
      color: $accent_color_tint;
    }

    &.selected {
      border-color: $accent_color !important;
      color: $accent_color !important;
    }
  }

  .method-item {
    position: relative;
    font-size: 14px;

    .corner-icon {
      position: absolute;
      right: -1px;
      bottom: -1px;

      .checkmark {
        width: 0;
        border-bottom-right-radius: 8px;
        border-top: 25px solid transparent;
        border-right: 25px solid $accent_color;
      }

      .ivu-icon {
        font-size: 18px;
        position: absolute;
        bottom: 0;
        right: -1px;
        transform: rotate(-15deg);
        color: #fff;
      }
    }
  }
}
</style>
