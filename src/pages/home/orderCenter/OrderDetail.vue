<template>
  <div v-if="order.order" class="order-detail">
    <card :_Size="16" :_Title="`${$t('Order detail')} #${order.order.sn}`" style="margin-bottom: 10px">
    </card>

    <!--    <Card-->
    <!--      class="mb_10"-->
    <!--      v-if="-->
    <!--        order.allowOperationVO.pay ||-->
    <!--        order.allowOperationVO.rog ||-->
    <!--        order.allowOperationVO.cancel-->
    <!--      "-->
    <!--    >-->

    <!--      <Button-->
    <!--        type="success"-->
    <!--        @click="received(order.order.sn)"-->
    <!--        size="small"-->
    <!--        v-if="order.allowOperationVO.rog"-->
    <!--        >{{ $t('Received') }}</Button-->
    <!--      >-->
    <!--    </Card>-->
    <p v-if="order.order.verificationCode" class="verificationCode">
      {{ $t('Verification code') }}：<span>{{ order.order.verificationCode }}</span>
    </p>
    <div class="order-card flex order-title">
      <div>
        <p> {{ $t('Created time') }}：
          <span>
        {{ order.order.createdTime | formatDate(order.order.createdTime) }}
        </span>
        </p>
        <div class="order-status flex">
          <p> {{ $t('Order status') }}: &nbsp; &nbsp;</p>
          <Tag v-if="order.order.orderStatus === 'CONFIRMED'" color="green">
            {{ $t('Confirmed') }}
          </Tag>
          <Tag v-if="order.order.orderStatus === 'PENDING'" color="blue">
            {{ $t('Pending') }}
          </Tag>
          <Tag v-if="order.order.orderStatus === 'CANCELLED'" color="red">
            {{ $t('Cancelled') }}
          </Tag>
          <Tag v-if="order.order.orderStatus === 'REJECTED'" color="red">
            {{ $t('Rejected') }}
          </Tag>
          <Tag v-if="order.order.orderStatus === 'COMPLETED'" color="success">
            {{ $t('Completed') }}
          </Tag>
        </div>
        <div class="order-status flex">
          <p> {{ $t('Payment Status') }}: &nbsp; &nbsp;</p>
          <Tag v-if="order.order.payStatus === 'PAID'" color="green">
            {{ $t('Paid') }}
          </Tag>
          <Tag v-if="order.order.payStatus === 'UNPAID'" color="red">
            {{ $t('Unpaid') }}
          </Tag>

        </div>
      </div>
      <div class="order-title">
        <Button
          v-if="order.order.payStatus === 'PAID' && order.order.orderStatus == 'CONFIRMED' "
          size="small"
          style="margin-left: 1em"
          type="success"
          @click="handleCompleteOrder(order.order.sn)"
        >
          {{ $t('Completed') }}
        </Button>
        <Button
          v-if="order.order.orderStatus === 'PENDING'"
          size="small"
          style="margin-left: 1em"
          type="error"
          @click="handleCancelOrder(order.order.sn)"
        >
          {{ $t('Cancel Order') }}
        </Button>
      </div>
    </div>
    <div class="order-log">
      <h3 class="mb_10">{{ $t('Notification') }}</h3>
      <Card dis-hover>
        <Scroll class="css-scroll" height="150">
          <Timeline :pending="order.status !== 'CANCELLED' && order.status !== 'REJECTED'">
            <TimelineItem v-for="(item,index) in orderLog" :key="index" color="green">
              <Icon slot="dot" type="ios-checkmark-circle"></Icon>
              <p class="time" style="font-size: 12px; font-weight: 600;margin-bottom: 4px">
                {{ item.createdTime | formatDate(item.createdTime) }}</p>
              <div class="content">
                <Tag v-if="item.operatorType === 'Admin'" color="magenta">{{ item.operatorName }}</Tag>
                <Tag v-if="item.operatorType === 'Merchant'" color="green">{{ item.operatorName }}</Tag>
                <Tag v-if="item.operatorType === 'Member'" color="blue">{{ item.operatorName }}</Tag>
                <Tag v-if="item.operatorType === 'system'" color="volcano">{{ item.operatorName }}</Tag>
                {{ item.message }}
              </div>
            </TimelineItem>
          </Timeline>
        </Scroll>
      </Card>
    </div>
    <Row>
      <Col span="8">
        <div class="order-card">
          <h3>{{ $t('Receiver Information') }}</h3>
          <Card dis-hover style="height: 150px">
            <p>{{ $t('Receiver') }}：<span style="font-weight: bold; color: black">{{ order.order.consigneeName }}</span>
            </p>
            <p>{{ $t('Phone') }}：<span>{{ order.order.consigneeMobile | secrecyMobile }}</span></p>
            <p>
              {{ $t('Address') }}：<span>{{ order.order.consigneeAddressPath | unitAddress }}</span>
            </p>
          </Card>
        </div>
      </Col>
      <Col span="8">
        <div class="order-card">
          <h3>{{ $t('Payment info') }}</h3>
          <!--          // TODO-->
          <!--          <Card v-if="order.order.payStatus === 'PAID'">-->
          <!--            <div class="order-card">-->
          <!--              <template v-if="order.order.needReceipt">-->
          <!--                <p>{{ $t('Invoice') }}：<span>{{ order.receipt.receiptTitle }}</span></p>-->
          <!--                <p>{{ $t('Invoice content') }}：<span>{{ order.receipt.receiptContent }}</span></p>-->
          <!--                <p v-if="order.receipt.taxpayerId">-->
          <!--                  {{ $t('Taxpayer Identification Number') }}：<span>{{ order.receipt.taxpayerId }}</span>-->
          <!--                </p>-->
          <!--              </template>-->
          <!--              <div v-else style="color: #999; margin-left: 5px">{{ $t('Uninvoiced') }}</div>-->
          <!--            </div>-->
          <!--          </Card>-->
          <Card dis-hover style="height: 150px">
            <p>{{ $t('Payment Method') }}：
              <span>{{ $t(order.order.paymentMethod) }}</span>
            </p>
            <p>{{ $t('Payment Status') }}：
              <span>{{ $t(order.order.payStatus) }}</span>
            </p>
          </Card>
        </div>
      </Col>
      <Col span="8">
        <div v-if="!order.order.verificationCode" class="order-card">
          <h3>{{ $t('Delivery Information') }}</h3>
          <Card dis-hover style="height: 150px">
            <p>{{ $t('Delivery Method') }}：<span>{{ $t(order.order.deliveryMethod) }}</span></p>
            <p>{{ $t('Delivery Status') }}：<span>{{ $t(order.order.deliverStatus) }}</span></p>
            <p v-if="logistics">
              {{ $t('Logistics information') }}：<span>{{ logistics.shipper || "No logistics information" }}</span>
            </p>
            <p v-if="logistics">
              {{ $t('shipment number') }}：<span>{{ logistics.logisticCode || "No tracking number" }}</span>
            </p>
            <div v-if="logistics" class="div-express-log">
              <div class="express-log">
                <p>{{ $t('order log') }}：</p>
                <div v-for="(item, index) in logistics.traces" :key="index">
                  <span class="time">{{ item.AcceptTime }}</span>
                  <span class="detail">{{ item.AcceptStation }}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Col>
    </Row>
    <div class="goods">
      <div class="shop-name">
        <span @click="shopPage(order.order.storeId)">
           <Iconify icon="ic:twotone-store-mall-directory"></Iconify>
          {{ order.order.storeName }}
        </span>
      </div>
      <table>
        <thead>
        <tr class="row_header">
          <th style="text-align: center" width="40%">{{ $t('Product') }}</th>
          <th width="10%">{{ $t('Price') }}</th>
          <th width="10%">{{ $t('Quantity') }}</th>
          <th width="10%">{{ $t('Amount') }}</th>
          <th v-if="false"
              width="10%">{{ $t('Action') }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(goods, goodsIndex) in order.orderItems" :key="goodsIndex">
          <td>
            <img
              :src="goods.image"
              alt=""
              @click="goodsDetail(goods.productId)"
            />
            <div>
              <p
                class="hover-color global_color"
                @click="goodsDetail(goods.productId)"
              >
                {{ goods.name }}
              </p>
            </div>
          </td>
          <td>{{ goods.unitPrice | unitPrice("₫",  "before") }}</td>
          <td>{{ goods.num }}</td>
          <td class="global_color">{{ (goods.flowPrice) | unitPrice("₫",  "before") }}</td>
          <td v-if="false">
            <Button
              v-if="
                  goods.afterSaleStatus.includes('NOT_APPLIED') ||
                  goods.afterSaleStatus.includes('PART_AFTER_SALE')
                "
              class="mb_5"
              size="small"
              type="info"
              @click="applyAfterSale(goods.sn)"
            >{{ $t('Apply for after sales') }}
            </Button
            >
            <Button
              v-if="goods.commentStatus === 'UNFINISHED'"
              class="fontsize_12 mb_5"
              size="small"
              type="success"
              @click="comment(order.order.sn, goodsIndex)">{{ $t('Rating') }}
            </Button>
            <Button
              v-if="goods.complainStatus == 'NO_APPLY'"
              class="fontsize_12"
              size="small"
              type="warning"
              @click="complain(order.order.sn, goodsIndex)">{{ $t('Complaint') }}
            </Button>
          </td>
        </tr>
        </tbody>
      </table>
      <!-- 订单价格 -->
      <div class="order-price">
        <div>
          <span>{{ $t('Number of products') }}：</span>
          <span>{{ order.order.productNum }}</span>
        </div>
        <div>
          <span>{{ $t('Total price') }}：</span>
          <span>{{ order.order.flowPrice | unitPrice("₫",  "before") }}</span
          ><br/>
        </div>
        <div>
          <span>{{ $t('Freight') }}：</span>
          <span>{{ order.order.freightPrice | unitPrice("₫",  "before") }}</span>
          <br/>
        </div>
        <div v-if="order.order.priceDetail.couponPrice">
          <span>{{ $t('Coupons') }}：</span>
          <span>
            -{{ order.order.priceDetail.couponPrice || 0 | unitPrice("₫",  "before") }}
          </span
          >
        </div>
        <div v-if="order.order.discountPrice">
          <span>{{ $t('Promotions') }}：</span
          ><span>-{{ order.order.discountPrice | unitPrice("₫",  "before") }}</span>
        </div>
        <div>
          <span>{{ $t('Amount to be paid') }}：</span>
          <span class="actrual-price">{{
              order.order.flowPrice | unitPrice("₫",  "before")
            }}</span>
        </div>
        <div class="btn_pay mt_10">
          <Button
            v-if="order.order.orderStatus !== 'CANCELLED'
             && order.order.orderStatus !== 'REJECTED'
             && order.payStatusValue === 'UNPAID'"
            size="large"
            style="margin-left: 6px"
            type="info"
            @click="goPay(order.order.sn)"
          >{{ $t('Pay') }}
          </Button>
        </div>
      </div>
    </div>
    <CancelOrder ref="modalCancel" @sureCancel="sureCancel"/>
  </div>
</template>
<script>
import {cancelOrder, getTraces, orderDetail, ReceiveOrder, sureReceived,} from "@/api/order.js";
import CancelOrder from "@/components/Modal/CancelOrder";

export default {
  name: "order-detail",
  components: {
    CancelOrder
  },
  data() {
    return {
      orderLog: {},
      order: {}, // 订单详情数据
      progressList: [], // 订单流程
      logistics: "", // 物流数据
      cancelParams: {
        orderSn: "",
        reason: "",
      },
    };
  },
  methods: {
    goodsDetail(skuId) {
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: {skuId},
      });
      window.open(routeUrl.href, "_self");
    },
    shopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: {id: id},
      });
      window.open(routeUrl.href, "_self");
    },
    getDetail() {
      orderDetail(this.$route.query.sn)
        .then((res) => {
          if (res.success) {
            this.order = res.result;
            this.orderLog = res.result.orderLogs.reverse();
          }
        })
        .finally(() => {

        })
    },
    traces() {
      getTraces(this.$route.query.sn)
        .then((res) => {
          if (res.success) {
            this.logistics = res.result;
          }
        })
        .catch((err) => {
          this.$Message.error(this.$t('API get order trace error'))
        })
        .finally(() => {

        })
    },
    received(sn) {
      sureReceived(sn).then((res) => {
        if (res.success) {
          this.$Message.success(this.$t('Success'));
          this.getDetail();
        }
      });
    },
    goPay(sn) {
      // 去支付
      this.$router.push({
        path: "/payment",
        query: {orderType: "ORDER", sn},
      });
    },
    applyAfterSale(sn) {
      // 申请售后
      this.$router.push({name: "ApplyAfterSale", query: {sn: sn}});
    },
    comment(sn, goodsIndex) {
      // 评价
      this.$router.push({
        path: "/home/addEval",
        query: {sn, index: goodsIndex},
      });
    },
    complain(sn, goodsIndex) {
      // 投诉
      this.$router.push({name: "Complain", query: {sn, index: goodsIndex}});
    },
    handleCancelOrder(sn) {
      this.cancelParams.orderSn = sn;
      this.$refs.modalCancel.isShow = true
    },
    handleCompleteOrder(sn) {
      this.$Modal.confirm({
        title: this.$t('Confirm'),
        content: this.$t('Are you sure that you has received the product?'),
        onOk: () => {
          ReceiveOrder(sn)
            .then((res) => {
              if (res.success) {
                this.loading = false
                this.$Message.success(this.$t('Confirmed'))
              } else {
                this.$Message.error(res.message)
              }
            })
            .finally(() => {
              this.getDetail();
            })
        }
      })
    },
    sureCancel(e) {
      cancelOrder(this.cancelParams.orderSn, {reason: e.reason}).then((res) => {
        if (res.success) {
          this.$Message.success(this.$t('Order canceled successfully'));
          this.getDetail();
        }
      })
    },
  },
  mounted() {
    this.getDetail();
    this.traces();
  },
};
</script>
<style lang="scss" scoped>
.mb_10 {
  Button:nth-of-type(2) {
    margin-left: 10px;
  }
}

.mb_5 {
  margin-bottom: 5px;
}

.order-card {
  padding: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e8eaec;
  position: relative;

  > .order-title {
    display: flex;
    align-items: center;
  }

  p {
    color: #000;
    margin: 3px;
    margin-left: 5px;

    span {
      color: #888;
    }
  }

  h3 {
    font-weight: normal;
    font-size: 16px;
    margin: 12px 0;
    text-transform: uppercase;
  }

  .operation-time {
    position: absolute;
    right: 20px;
    top: 40px;
  }
}

/** 店铺名称 */
.shop-name {
  margin: 15px 0;

  span {
    color: black;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      color: $accent_color;
    }
  }

  .ivu-icon {
    color: #ff8f23;
    cursor: pointer;

    &:hover {
      color: $accent_color;
    }
  }
}

/** 商品列表 */
table {
  border: 1px solid #ddd;
  color: #999;
  border-collapse: collapse;
  width: 100%;

  .row_header {
    text-align: center;
  }

  tr {
    border-top: 1px solid #ddd;
  }

  thead > tr {
    height: 40px;
    background: #eee;
  }

  td {
    padding: 5px;
    text-align: center;

    &:first-child {
      text-align: left;
      display: flex;

      img {
        width: 70px;
        height: 70px;
        margin-right: 10px;
        margin-left: 10px;
        cursor: pointer;
      }
    }

    &:last-child {
      color: $accent_color;
    }
  }
}

/** 订单价格 */
.order-price {
  text-align: right;
  margin-top: 30px;
  font-size: 16px;
  color: #999;

  > div {
    span:nth-of-type(1) {
      color: #000;
    }
  }

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

.verificationCode {
  font-size: 20px;
  margin-bottom: 20px;
  color: rgb(65, 63, 63);
  font-weight: bold;
  text-align: center;

  span {
    color: $accent_color;
  }
}

/** 订单进度条 */
.progress {
  margin: 15px 0;
}

.order-title {
  justify-content: space-between;
}

.css-scroll {
  overflow: scroll;
  overflow-y: scroll
}

/deep/ .custom-tag {
  span {
    color: $accent_color !important;
  }
}
</style>
