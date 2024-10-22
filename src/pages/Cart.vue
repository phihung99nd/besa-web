<template>
  <div class="cart" @click="couponAvailable = false">
    <div class="cart-content width_1200 center">
      <div class="available-area">
        <div class="cart-steps">
          <span :class="stepIndex === 0 ? 'active' : ''">1. {{ $t('My Cart') }}</span>
          <Icon
            :class="stepIndex === 0 ? 'active-arrow' : ''"
            custom="icomoon icon-next"
          ></Icon>
          <span :class="stepIndex === 1 ? 'active' : ''">2. {{ $t('Fill in the order information') }}</span>
          <Icon
            :class="stepIndex === 1 ? 'active-arrow' : ''"
            custom="icomoon icon-next"
          ></Icon>
          <span :class="stepIndex === 2 ? 'active' : ''">3. {{ $t('Submit the order') }}</span>
        </div>
      </div>
      <div class="cart-goods">
        <div class="cart-goods-title">
          <div>
            <Checkbox
              v-model="allChecked"
              @on-change="changeChecked(allChecked, 'all')"
            >{{ $t('Select all') }}
            </Checkbox
            >
          </div>
          <div class="goods-title">{{ $t('Product') }}</div>
          <div class="width_150">{{ $t('Unit price (VND)') }}</div>
          <div class="width_100">{{ $t('Quantity') }}</div>
          <div class="width_150">{{ $t('Amount') }}</div>
          <div class="width_100">{{ $t('Action') }}</div>
        </div>
        <div v-if="cartList.length === 0" class="cart-empty">
          <p>{{ $t('The cart is empty') }}</p>
          <router-link to="/">{{ $t('Go shopping') }}</router-link>
        </div>
        <div
          v-for="(shop, index) in cartList"
          v-else
          :key="index"
          class="cart-goods-items"
        >
          <div class="shop-name">
            <div>
              <Checkbox
                v-model="shop.checked"
                @on-change="changeChecked(shop.checked, 'shop', shop.storeId)"
              ></Checkbox>
              <span class="go-shop-page" @click="goShopPage(shop.storeId)">
                {{ shop.storeName }}
              </span>
            </div>
            <!--            todo: thêm lại sau khi con promotion sửa xong-->
            <!--            <span-->
            <!--              v-if="shop.couponList.length"-->
            <!--              :class="couponAvailable === index ? 'shop-coupon-show' : ''"-->
            <!--              class="shop-coupon"-->
            <!--              @click.stop="showCoupon(shop.id, index)"-->
            <!--            >-->
            <div v-if="couponAvailable === index">
              <div
                v-for="(item, index) in shop.couponList"
                :key="index"
                class="coupon-item"
              >
                <span v-if="item.couponType === 'PRICE'">{{ item.price }} đ</span>
                <span v-if="item.couponType === 'DISCOUNT'">{{ item.couponDiscount }}</span>
                <span>{{ $t('{0} available', [item.consumeThreshold]) }}</span>
                <Button
                  :disabled="item.disabled"
                  class="coupon-btn"
                  size="small"
                  type="primary"
                  @click="receiveShopCoupon(item)"
                >{{ item.disabled ? $t('Received') : $t('Receive') }}
                </Button
                >
              </div>
            </div>
            <div class="promotion-notice">{{ shop.promotionNotice }}</div>
          </div>
          <template v-for="(goods, goodsIndex) in shop.productList">
            <div :key="goodsIndex" class="goods-item">
              <div class="width_60">
                <Checkbox
                  v-model="goods.checked"
                  @on-change="
                    changeChecked(goods.checked, 'goods', goods.product.id)
                  "
                  :disabled="goods.errorMessage ? true : false"
                ></Checkbox>
              </div>
              <div
                class="goods-title"
                @click="
                  () => goods.errorMessage ? '' : goGoodsDetail(goods.product.id, goods.product.goodsId)
                "
              >
                <img
                  :src="
                    goods.product.thumbnail ||
                    '../assets/images/goodsDetail/item-detail-1.jpg'
                  "
                />
                <div>
                  <p class="line-clamp">{{ goods.product.name }}</p>
                  <p>
                    <Tag
                      v-if="goods.product.salesModel === 'WHOLESALE'"
                      class="goods-show-tag"
                      color="purple"
                    >
                      {{ $t('Wholesale products') }}
                    </Tag>
                  </p>
                  <template v-for="(promotion, promotionIndex) in goods.promotions">
                    <div
                      v-if="promotion.promotionType === 'SECKILL'"
                      :key="promotionIndex"
                      class="promotion"
                    >
                      <span>{{ $t('SecKill') }}</span>
                      <promotion
                        :time="promotion.endTime"
                        type="cart"
                      ></promotion>
                    </div>
                  </template>
                  <template v-for="(promotion, promotionIndex) in goods.promotions">
                    <div
                      v-if="promotion.promotionType === 'FULL_DISCOUNT'"
                      :key="promotionIndex"
                      class="promotion"
                    >
                      <span>{{ $t('Full discount') }}</span>
                      <promotion
                        :time="promotion.endTime"
                        type="cart"
                      ></promotion>
                    </div>
                  </template>
                </div>
              </div>
              <div class="width_150">
                {{ goods.purchasePrice | unitPrice("₫",  "before") }}
              </div>
              <div class="width_100">
                <InputNumber
                  v-model="goods.num"
                  :min="1"
                  :max="goods.product.quantity"
                  size="small"
                  @on-change="changeNum(goods.num, goods.product.id)"
                  :disabled="goods.errorMessage ? true : false"
                ></InputNumber>
                <div class="fontsize_12">
                  {{ goods.product.quantity > 0 ? $t('In Stock') : $t('Out Stock') }}
                </div>
              </div>
              <div class="width_150">
                {{ goods.subTotal | unitPrice("₫",  "before") }}
              </div>
              <div class="width_100">
                <Button
                  v-if="!goods.errorMessage"
                  size="small"
                  type="primary"
                  @click="delGoods(goods.product.id)"
                >{{ $t('Delete') }}
                </Button>
              </div>
              <div v-if="goods.errorMessage" class="error-goods">
                <div class="error-msg">{{ goods.errorMessage }}</div>
                <div class="width_100">
                  <Button type="primary" size="small" @click="delGoods(goods.product.id)">{{ $t('Delete') }}</Button>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="cart-goods-footer">
          <div>
            <Checkbox v-model="allChecked"
                      class="mr_10"
                      @on-change="changeChecked(allChecked, 'all')">{{ $t('Select all') }}
            </Checkbox>
            <div class="handle-btn mr_10" @click="delGoods()">
              {{ $t('Delete Selected') }}
            </div>
            <div class="handle-btn mr_10" @click="clearCart">
              {{ $t('Empty cart') }}
            </div>
          </div>
          <div>
            <div class="selected-count">
              {{ $t('Chosen') }} <span> {{ checkedNum }}</span>
            </div>
            <div class="ml_20 save-price">
              {{ $t('Saving') }} <span>{{
                priceDetailDTO.discountPrice | unitPrice("₫",  "before")
              }}</span>
            </div>
            <div class="ml_20 total-price">
              {{ $t('Total price (excluding shipping)') }}:
              <div> {{ priceDetailDTO.flowPrice | unitPrice("₫",  "before") }}</div>
            </div>
            <div class="pay ml_20" @click="pay">{{ $t('Pay') }}</div>
          </div>
        </div>
      </div>
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import * as APICart from "@/api/cart";
import * as APIMember from "@/api/member";
import Promotion from "@/components/goodsDetail/Promotion";
import Search from "@/components/Search";

export default {
  name: "Cart",
  components: {
    Search,
    Promotion,
  },
  beforeRouteEnter(to, from, next) {
    next();
  },

  data() {
    return {
      couponAvailable: false,
      stepIndex: 0,
      goodsTotal: 0,
      checkedNum: 0,
      allChecked: false,
      loading: false,
      cartList: [],
      couponList: [],
      priceDetailDTO: {},
      skuList: [],
    };
  },
  async mounted() {
    await this.getCartList();
    console.log(this.cartList)
    APICart.cartCount()
      .then((res) => {
        if (res.success) this.goodsTotal = res.result;
      });
  },
  methods: {
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
        query: {id},
      });
      window.open(routeUrl.href, "_blank");
    },

    collectGoods(id) {
      APIMember.collectGoods("GOODS", id).then((res) => {
        if (res.success) {
          this.$Message.success(this.$t('The product added to Favorite successfully'));
          this.getCartList();
        }
      });
    },

    delGoods(id) {
      const idArr = [];
      if (!id) {
        const list = this.cartList;
        list.forEach((shop) => {
          shop.checkedProductList.forEach((goods) => {
            if (goods.checked) {
              idArr.push(goods.product.id);
            }
          });
        });
      } else {
        idArr.push(id);
      }
      this.$Modal.confirm({
        title: this.$t('Delete'),
        content: `<p>${this.$t('Are you sure you want to delete this item?')}</p>`,
        onOk: () => {
          APICart.delCartGoods({skuIds: idArr.toString()}).then((res) => {
            if (res.success) {
              this.$Message.success(this.$t('Successfully Deleted'));
              this.getCartList();
            } else {
              this.$Message.error(res.message);
            }
          });
        },
      });
    },

    clearCart() {
      this.$Modal.confirm({
        title: this.$t('Warning'),
        content: this.$t('Are you sure you want to empty your cart?'),
        onOk: () => {
          APICart.clearCart().then((res) => {
            if (res.success) {
              this.$Message.success(this.$t('Empty shopping cart successfully'));
              this.getCartList();
            } else {
              this.$Message.error(res.message);
            }
          });
        },
      });
    },

    pay() {
      if (this.checkedNum) {
        this.$router.push({path: "/pay", query: {way: "CART"}});
      } else {
        this.$Message.warning(this.$t('Please select at least 1 item'));
      }
    },
    showCoupon(storeId, index) {
      this.couponAvailable = index;
    },

    changeNum(val, id) {
      if (val) {
        APICart.setCartGoodsNum({skuId: id, num: val, cover: true, cartType: 'GOODS'}).then((res) => {
          if (res.success) {
            this.getCartList();
          }
        });
      }
    },

    async changeChecked(status, type, id) {
      const check = status ? 1 : 0;
      if (type === "all") {
        await APICart.setCheckedAll({checked: check});
      } else if (type === "shop") {
        await APICart.setCheckedSeller({checked: check, storeId: id});
      } else {
        await APICart.setCheckedGoods({checked: check, skuId: id});
      }

      await this.getCartList();
    },

    async receiveShopCoupon(item) {
      let res = await APIMember.receiveCoupon(item.id);
      if (res.success) {
        this.$set(item, "disabled", true);
        this.$Message.success(this.$t('Receive success'));
      } else {
        this.$Message.error(res.message);
      }
    },

    async getCartList() {
      this.loading = true;
      try {
        let res = await APICart.cartGoodsAll();
        this.loading = false;
        if (res.success) {
          this.cartList = res.result.carts;
          this.priceDetailDTO = res.result.priceDetailDTO;
          this.skuList = res.result.cartProducts;
          this.goodsTotal = res.result.cartProducts.length;
          this.checkedNum = 0;
          let allChecked = true;
          for (let k = 0; k < this.cartList.length; k++) {
            let shop = this.cartList[k];
            // let list = await APIMember.couponList({storeId: shop.storeId});
            // shop.couponList.push(...list.result.records);
          }

          for (let i = 0; i < this.skuList.length; i++) {
            if (this.skuList[i].checked) {
              this.checkedNum += this.skuList[i].num;
            } else {
              allChecked = false;
            }
          }

          this.$forceUpdate();
          this.allChecked = allChecked;
        }
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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

.cart-content {
  margin: 0 auto;
  width: 1200px;
  position: relative;
}

.cart-steps {
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

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

.available-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.cart-goods {
  &-title {
    height: 50px;
    @include background_color($light_white_background_color);
    @include title_color($title_color);
    display: flex;
    align-items: center;
    padding: 0 20px;

    div {
      text-align: center;
    }

    .goods-title {
      flex: 1;
    }
  }

  .cart-empty {
    width: 100%;
    text-align: center;
    height: 300px;
    padding-top: 100px;
  }

  &-items {
    .shop-name {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      position: relative;
      @include title_color($light_title_color);

      > * {
        width: 50%;
      }

      .go-shop-page:hover {
        color: $accent_color;
        cursor: pointer;
      }

      .customer-service {
        margin-left: 5px;
        color: #fcc217;
        cursor: pointer;

        &:hover {
          color: $accent_color;
        }
      }

      .shop-coupon {
        width: 80px;
        height: 24px;
        position: relative;
        background: url(../assets/images/cart-coupon-icons02.png) 0 0 no-repeat;

        > div {
          position: absolute;
          top: 35px;
          left: 0;
          width: 300px;
          height: 300px;
          background-color: #fff;
          border: 1px solid $accent_color;
          // border-radius: 3px;
          z-index: 1;
          padding: 10px 20px;

          &::before {
            content: "";
            display: block;
            background: url(../assets/images/cart-coupon-icons02.png) 0 -58px no-repeat;
            width: 80px;
            height: 12px;
            position: absolute;
            top: -12px;
            left: 0;
          }

          .coupon-item {
            margin-bottom: 10px;

            span:nth-child(1) {
              border: 1px solid #e33937;
              display: inline-block;
              padding: 3px 10px;
              color: $accent_color;
              border-radius: 3px;
            }

            span:nth-child(2) {
              font-size: 14px;
              margin-left: 5px;
              color: #999;
            }

            .coupon-btn {
              height: 26px;
              float: right;
              font-size: 14px;
            }

            &::after {
              display: block;
              content: "";
              clear: right;
            }
          }
        }
      }

      .promotion-notice {
        text-align: right;
        font-size: 14px;
      }

      .shop-coupon-show {
        background-position-y: -34px;
      }
    }

    .goods-item {
      position: relative;
      @extend .cart-goods-title;
      @include background_color($light_white_background_color);
      padding: 10px 20px;
      height: auto;

      > div:nth-child(1) {
        padding-left: 15px;
        width: 30px;
      }

      > div:nth-child(2) {
        cursor: pointer;
        display: flex;
        box-sizing: border-box;
        padding-left: 20px;
        position: relative;

        img {
          width: 70px;
          height: 70px;
        }

        > div > p {
          @include content_color($light_content_color);
          font-size: 13px;
          text-align: left;
          margin-left: 10px;

          &:hover {
            color: $accent_color;
          }
        }
      }

      > div:nth-child(5) {
        font-weight: bold;
      }

      .num-input {
        width: 60px;
        border: 1px solid #999;
        border-radius: 5px;
        padding: 0 5px;

        &:focus {
          outline-color: $accent_color;
        }
      }
    }

    .error-goods {
      position: absolute;
      width: 100%;
      height: 100%;
      margin-left: -20px;
      background-color: rgba($color: #999, $alpha: 0.3);
      backdrop-filter: grayscale(50%);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #000;
      padding: 10px 20px 10px 150px;

      .error-msg {
        align-self: end;
      }
    }
  }

  &-footer {
    @extend .cart-goods-title;
    position: sticky;
    bottom: 0;
    border-top: 1px solid #ddd;
    margin-top: 10px;
    padding: 0 0 0 20px;
    line-height: 50px;
    justify-content: space-between;

    > div {
      display: flex;
    }

    .selected-count {
      span {
        color: $accent_color;
      }
    }

    .save-price span {
      color: #000;
    }

    .total-price div {
      color: $accent_color;
      font-size: 20px;
    }

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

  .handle-btn {
    font-size: 14px;
    color: $handle-btn-color;
    cursor: pointer;

    &:hover {
      color: $accent_color;
    }
  }
}

.like {
  width: 1200px;
  margin: 10px auto;
  // padding: 20px 0;
  @include white_background_color();
}

.likeGoods,
.shop-nav-container {
  width: 1200px;
  margin: 0 auto;
}

.ivu-divider {
  background: $accent_color;
  height: 2px;
}

.width_150 {
  width: 150px;
}

.width_60 {
  width: 60px;
}

.promotion {
  display: flex;
  margin-top: 5px;
  margin-left: 5px;

  > span {
    border: 1px solid $accent_color;
    color: $accent_color;
    font-size: 14px;
    border-radius: 2px;
    padding: 0 2px;
  }

  > p {
    font-size: 14px;
    margin-left: 10px;
    color: #999;
  }
}

.cart-goods-footer > div {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.total-price {
  display: flex;
  align-items: center;
}

.line-clamp {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
<style>
.ivu-input-number-input {
  text-align: center;
}
</style>
