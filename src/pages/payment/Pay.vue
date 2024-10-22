<template>
  <div class="pay-order">
    <AddressModal ref="addModal" v-if="addressModal" :address="currentEditAddress" @close="handleCloseModal"/>
    <div class="content width_1200">
      <div class="address">
        <div class="card-head">
          <span>{{ $t('Receiver Information') }}</span>
          <span @click="goAddressManage">{{ $t('Address Management') }}</span>
        </div>
        <div class="address-manage">
          <div
            v-for="(item, index) in addressList"
            v-show="moreAddr ? true : index < 3"
            :key="index"
            :class="selectedAddress.id === item.id ? 'border-red' : ''"
            class="address-item"
            @click="selectAddress(item)"
            @mouseenter="showEditBtn = index"
            @mouseleave="showEditBtn = ''"
          >
            <div style="display: flex; align-items: center;">
              <span>{{ item.name }}</span>
              <Tag v-if="item.isDefault" color="red">{{ $t('Default') }}</Tag>
              <Tag v-if="item.alias" color="warning">{{ item.alias }}</Tag>
            </div>
            <div>{{ item.mobile }}</div>
            <div class="address-detail">
              {{ item.consigneeAddressPath | unitAddress }}
            </div>
            <div v-show="showEditBtn === index" class="edit-btn">
              <span @click.stop="editAddress(item)">{{ $t('Edit') }}</span>
              <span
                v-if="!item.isDefault && selectedAddress.id != item.id"
                class="ml_10"
                @click.stop="delAddress(item)"
              >
                {{ $t('Delete') }}
              </span>
            </div>
            <div v-show="selectedAddress.id == item.id" class="corner-icon">
              <Icon type="md-checkmark"/>
            </div>
          </div>
          <div class="add-address" @click="editAddress({})">
            <Icon type="ios-add-circle-outline"/>
            <div>{{ $t('Add new address') }}</div>
          </div>
        </div>
        <div
          v-if="addressList.length > 3"
          class="more-addr"
          @click="moreAddr = !moreAddr"
        >
          {{ moreAddr ? $t('Less') : $t('More') }}
          <Icon v-show="!moreAddr" type="md-arrow-dropdown"/>
          <Icon v-show="moreAddr" type="md-arrow-dropup"/>
        </div>
      </div>
      <div class="goods-content">
        <div class="card-head mt_20 mb_20">
          <span>{{ $t('Product information') }}</span>
          <span @click="$router.push('/cart')">{{ $t('Go to the cart') }}</span>
        </div>
        <div
          v-for="(shop, shopIndex) in goodsList"
          :key="shopIndex"
          class="goods-msg"
        >
          <div v-if="shop.checked">
            <div class="shop-name">
              <span>
                <span class="hover-color" @click="goShopPage(shop.storeId)">
                  <Iconify icon="ic:round-store">
                  </Iconify> {{ shop.storeName }}</span>&nbsp;&nbsp;
              </span>
            </div>
            <div class="goods-list">
              <div
                v-for="(goods, goodsIndex) in shop.checkedProductList"
                :key="goodsIndex"
                class="goods-item"
              >
                <span
                  class="hover-title"
                  @click="goGoodsDetail(goods.product.id, goods.product.goodsId)"
                >
                  <img :src="goods.product.thumbnail" alt=""/>
                  <span style="vertical-align: top">{{ goods.product.name }}</span>
                </span>
                <span class="goods-price">{{ goods.priceDetailDTO.productPrice | unitPrice("₫",  "before") }}</span>
                <span>x{{ goods.num }}</span>
                <span>{{ goods.product.quantity > 0 ? $t('In Stock') : $t('Out Stock') }}</span>
                <span class="goods-price">{{ goods.priceDetailDTO.originalPrice | unitPrice("₫",  "before") }}</span>
              </div>
            </div>
            <div class="order-mark">
              <Input
                v-model="shop.remark"
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
          <span class="relative">
            {{ $t('Invoice Information') }}
          </span>
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
        <div v-if="!couponList.length">{{ $t('No coupon available') }}</div>
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
                >
                  đ
                  <span class="price">
                    {{ item.price | unitPrice }}
                  </span>
                </span>
                <span
                  v-if="item.couponType === 'DISCOUNT'"
                  class="fontsize_12 global_color"
                >
                  <span class="price">{{ item.discount }}</span>
                </span>
                <span class="describe">
                  {{ $t('{0} available', [item.consumeThreshold]) }}
                </span>
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
            <b></b>
            <a class="c-right" @click="useCoupon(item.id, true)">{{ $t('Use now') }}</a>
            <a
              v-if="usedCouponId.includes(item.id)"
              class="c-right"
              @click="useCoupon(item.id, false)"
            >
              {{ $t('Give up discount') }}
            </a>
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
               :class="paymentMethod === item ? 'selected' : ''"
               class="method-item"
               @click="selectMethod(item)"
          >
            <div>
              {{ item }}
            </div>
            <div v-show="paymentMethod === item" class="corner-icon">
              <div class="checkmark"></div>
              <Icon type="md-checkmark"/>
            </div>
          </div>
        </div>
      </div>
      <div class="order-price">
        <div v-if="way!=='SERVICE'">
          <span>{{ $t('{0} items, total value: ', [totalNum]) }}：</span>
          <span>{{ priceDetailDTO.originalPrice | unitPrice("₫",  "before") }}</span>
        </div>
        <div v-if="priceDetailDTO.freightPrice > 0">
          <span>{{ $t('Freight') }}：</span>
          <span>{{ priceDetailDTO.freightPrice | unitPrice("₫",  "before") }}</span>
        </div>
        <div v-if="priceDetailDTO.discountPrice > 0">
          <span>{{ $t('Discounted price') }}：</span>
          <span>-{{ priceDetailDTO.discountPrice | unitPrice("₫",  "before") }}</span>
        </div>
        <div v-if="priceDetailDTO.couponPrice > 0">
          <span>{{ $t('Coupon amount') }}：</span>
          <span>-{{ priceDetailDTO.couponPrice | unitPrice("₫",  "before") }}</span>
        </div>

        <div v-if="$route.query.way === 'POINTS'">
          <span>{{ $t('Payable points') }}：</span>
          <span class="actual-price">{{ priceDetailDTO.payPoint }}</span>
        </div>
        <div v-else>
          <span>{{ $t('Amount to be paid') }}：</span>
          <span class="actual-price">
            {{ priceDetailDTO.flowPrice | unitPrice("₫",  "before") }}
          </span>
        </div>
      </div>
    </div>
    <div class="order-footer width_1200">
      <div class="pay ml_20" @click="pay">{{ $t('Submit') }}</div>
      <div v-if="addressList.length" class="pay-address">
        <span style="color: #e4393c">
          {{ $t('Delivery to') }}
        </span>
        ：{{ selectedAddress.consigneeAddressPath | unitAddress }}
        &nbsp;&nbsp;<br/>
        <span style="color: #e4393c">
          {{ $t('Receiver') }}
        </span>
        ：{{ selectedAddress.name }}&nbsp;&nbsp;{{ selectedAddress.mobile }}
      </div>
    </div>
    <BaseFooter></BaseFooter>
    <invoice-modal
      ref="invModal"
      :invoiceData="invoiceData"
      @change="getInvMsg"
    />
<!--    <address-manage-->
<!--      :id="addrId"-->
<!--      ref="address"-->
<!--      @change="addrChange"-->
<!--    ></address-manage>-->
  </div>
</template>

<script>
import invoiceModal from "@/components/invoiceModal";
import addressManage from "@/components/addressManage";
import {delMemberAddress, memberAddress} from "@/api/address";
import {cartGoodsPay, couponNum, createTrade, getPaymentMethod, selectAddr, selectCoupon} from "@/api/cart";
import {canUseCouponList} from "@/api/member.js";
import AddressModal from "../home/orderCenter/AddressModal.vue";

export default {
  name: "Pay",
  components: {AddressModal, invoiceModal, addressManage},
  data() {
    return {
      stepIndex: 1,
      invoiceAvailable: false,
      showEditBtn: "",
      orderMark: "",
      invoiceData: {
        receiptTitle: this.$t('Title'),
        receiptContent: this.$t('Content'),
      },
      addressList: [],
      selectedAddress: {},
      currentEditAddress: {},
      addressModal: false,
      goodsList: [],
      priceDetailDTO: {},
      totalNum: 0,
      addrId: "",
      moreAddr: false,
      canUseCouponNum: 0,
      couponList: [],
      usedCouponId: [],
      selectedCoupon: {},
      way: this.$route.query.way,
      paymentList: [],
      paymentMethod: ''
    };
  },
  mounted() {
    this.init();
  },
  methods: {

    init() {
      this.getAddress();
      this.getGoodsDetail();
      getPaymentMethod({clientType: 'PC'})
        .then(res => {
          this.paymentList = res.result
          this.paymentMethod = res.result[0]
        })
    },

    goAddressManage() {
      this.$router.push("/home/MyAddress");
    },

    getAddress() {
      memberAddress()
        .then((res) => {
          if (res.success) {
            this.addressList = res.result.content;
            this.addressList.forEach((e, index) => {
              if (e.id === this.selectedAddress.id && index > 2) {
                this.moreAddr = true;
              }
            });
            if(this.addressList.length == 0) {
              this.selectedAddress = {}
              this.addressModal = true
            }
          }
        })
        .catch((err) => {
          this.$Message.error(this.$t('API get member address error'))
        })
    },

    selectMethod(item) {
      this.paymentMethod = item
    },

    getGoodsDetail() {
      this.$Spin.show();

      cartGoodsPay({way: this.way})
        .then((res) => {
          this.$Spin.hide();
          if (res.success) {
            if (
              !res.result.checkedSkuList ||
              res.result.checkedSkuList.length === 0
            ) {
              if (res.result.cartProducts && res.result.cartProducts[0]) {
                this.$Modal.warning({
                  title: this.$t('Invalid item in cart'),
                  content:
                    "[" +
                    res.result.cartProducts[0].goodsSku.name +
                    "]" +
                    res.result.cartProducts[0].errorMessage,
                });
              }
              this.$router.push({
                path: "/cart",
                replace: true,
              });
            }
            this.goodsList = res.result.carts;
            this.priceDetailDTO = res.result.priceDetailDTO;
            this.skuList = res.result.cartProducts;

            if (res.result.receiptVO) {
              this.invoiceData = res.result.receiptVO;
            }
            let notSupArea = res.result.notSupportFreight;
            this.selectedCoupon = {};
            if (res.result.platformCoupon)
              this.selectedCoupon[res.result.platformCoupon.memberCoupon.id] =
                res.result.platformCoupon;
            if (
              res.result.storeCoupons &&
              Object.keys(res.result.storeCoupons)[0]
            ) {
              let storeMemberCouponsId = Object.keys(
                res.result.storeCoupons
              )[0];
              let storeCouponId =
                res.result.storeCoupons[storeMemberCouponsId].memberCoupon.id;
              this.selectedCoupon[storeCouponId] =
                res.result.storeCoupons[storeMemberCouponsId];
            }
            if (notSupArea) {
              let content = [];
              let title = "";
              notSupArea.forEach((e) => {
                title = e.errorMessage;
                content.push(e.goodsSku.name);
              });
              this.$Modal.warning({
                title: this.$t('The following items are outside the delivery area') || title,
                content: content.toString(),
              });
            }
            if (res.result.memberAddress) {
              this.selectedAddress = res.result.memberAddress;
            }

            this.totalNum = 0;
            for (let i = 0; i < this.skuList.length; i++) {
              this.totalNum += this.skuList[i].num;
            }
            this.usedCouponId = [];
            this.couponList = res.result.canUseCoupons || [];
            const couponKeys = Object.keys(this.selectedCoupon);
            if (couponKeys.length) {
              this.couponList.forEach((e) => {
                if (
                  this.selectedCoupon[e.id] &&
                  e.id === this.selectedCoupon[e.id].memberCoupon.id
                ) {
                  this.usedCouponId.push(e.id);
                }
              });
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          }
        })
        .catch(() => {
          this.$Spin.hide();
        });
    },

    getCouponNum() {
      couponNum({way: this.way}).then((res) => {
        this.canUseCouponNum = res.result;
        if (res.result) {
          let storeArr = [];
          let skuArr = [];
          this.goodsList.forEach((e) => {
            storeArr.push(e.storeId);
            e.skuList.forEach((i) => {
              skuArr.push(i.goodsSku.id);
            });
          });
          let params = {
            page: 1,
            size: 100,
            memberCouponStatus: "NEW",
            scopeId: skuArr.toString(),
            storeId: storeArr.toString(),
            totalPrice: this.priceDetailDTO.goodsPrice,
          };
          canUseCouponList(params).then((res) => {
            if (res.success) this.couponList = res.result.records;
            const couponKeys = Object.keys(this.selectedCoupon);
            this.usedCouponId = [];
            if (couponKeys.length) {
              this.couponList.forEach((e) => {
                if (e.id === this.selectedCoupon[couponKeys].memberCoupon.id) {
                  this.usedCouponId.push(e.id);
                }
              });
              this.$nextTick(() => {
                this.$forceUpdate();
              });
            }
          });
        }
      });
    },

    selectAddress(item) {
      let params = {
        way: this.way,
        shippingAddressId: item.id,
      };
      selectAddr(params)
        .then((res) => {
          if (res.success) {
            this.selectedAddress = item;
            this.getGoodsDetail();
          }
        })
    },

    editAddress(item) {
      this.currentEditAddress = item;
      this.addressModal = true
    },
    delAddress(item) {
      this.$Modal.confirm({
        title: this.$t('Hint'),
        content: this.$t('Are you sure to delete this address'),
        onOk: () => {
          delMemberAddress(item.id)
            .then((res) => {
              if (res.success) {
                this.$Message.success(this.$t('Successfully Deleted'));
                this.getAddress();
              }
            })
            .catch((err) => {
              this.$Message.error(this.$t('API delete address error'))
            })
        },
        onCancel: () => {
        },
      });
    },

    goGoodsDetail(skuId, goodsId) {
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: {skuId, goodsId},
      });
      window.open(routeUrl.href, "_blank");
    },

    goShopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: {id: id},
      });
      window.open(routeUrl.href, "_blank");
    },

    useCoupon(id, used) {
      let params = {
        way: this.way,
        memberCouponId: id,
        used: used,
      };
      selectCoupon(params).then((res) => {
        if (res.success) this.init();
      });
    },

    editInvoice() {
      this.$refs.invModal.invoiceAvailable = true;
    },

    getInvMsg(item) {
      if (item) {
        this.init();
        this.$refs.invModal.invoiceAvailable = false;
      }
    },

    handleCloseModal(){
      this.getAddress()
      this.addressModal = false
    },

    pay() {
      const params = {
        client: "PC",
        remark: [],
        way: this.way,
        paymentMethod: this.paymentMethod
      };
      this.goodsList.forEach((e) => {
        if (e.remark) {
          params.remark.push({
            remark: e.remark,
            storeId: e.storeId,
          });
        }
      });

      if (!params.remark.length) delete params.remark;

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
            //     query: { orderType: "TRADE", sn: res.result.sn },
            //   });
            // }
            this.$router.push("/payDone");
          }
        })
        .catch(() => {
          this.$Spin.hide();
        });
    },

    useScope(type) {
      let goods = this.$t('All Products');
      switch (type) {
        case "ALL":
          goods = this.$t('All Products');
          break;
        case "PORTION_GOODS":
          goods = this.$t('Some products');
          break;
        case "PORTION_GOODS_CATEGORY":
          goods = this.$t('Partially categorized products');
          break;
      }
      return `${goods} ${this.$t('available')}`;
    },
  },
};
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

/** 地址管理 */
.address-manage {
  display: flex;
  flex-wrap: wrap;

  > div {
    border: 1px dotted #949494;
    width: 265px;
    height: 120px;
    margin: 20px 20px 0 0;
    padding: 10px;
    cursor: pointer;
    color: #999;
  }

  .add-address {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .ivu-icon {
      font-size: 24px;
    }
  }

  .address-item {
    position: relative;
    font-size: 14px;

    > div:nth-child(1) {
      margin-bottom: 10px;

      span {
        margin-right: 10px;
      }

      > span:nth-child(1) {
        color: #000000;
        font-size: 14px;
      }
    }

    .edit-btn {
      font-size: 14px;
      position: absolute;
      top: 6px;
      right: 4px;
      color: $accent_color;

      span:hover {
        border-bottom: 1px solid $accent_color;
      }
    }

    .corner-icon {
      position: absolute;
      right: -1px;
      bottom: -1px;

      div {
        width: 0;
        border-top: 20px solid transparent;
        border-right: 20px solid $accent_color;
      }

      .ivu-icon {
        font-size: 14px;
        position: absolute;
        bottom: 0;
        right: 1px;
        transform: rotate(-15deg);
        color: #fff;
      }
    }
  }

  .border-red {
    border: 2px solid $accent_color;
  }
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
    width: 100%;
    align-items: center;
    justify-content: space-between;
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
      width: 100px;
    }

    > span:nth-child(1) {
      font-size: 14px;

      flex: 1;
      text-align: left;

      > span {
        margin-left: 10px;
      }
    }

    > span:last-child {
      color: $accent_color;
      font-weight: bold;
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
  margin-top: 30px;
  font-size: 16px;
  color: #999;

  > div > span:nth-child(2) {
    width: 130px;
    text-align: right;
    display: inline-block;
    margin-top: 10px;
  }

  .actual-price {
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
  flex-direction: row-reverse;
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
