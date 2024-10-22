<template>
  <div class="payment-wrapper">
    <BaseHeader></BaseHeader>
    <Search></Search>
    <div class="wrapper-head">
      <div class="head-left">
        <div class="left-tips">{{ $t('Please pay') }}</div>
        <div class="left-tips-time">{{ $t('Please complete the payment, otherwise the request will be automatically canceled') }}</div>
        <div class="left-tips-count-down">
          <mv-count-down :startTime="startTime" class="count-down"
            :endTime="endTime"
            :endText="endText"
            :dayTxt="':'"
            :hourTxt="':'"
            :minutesTxt="':'"
            :secondsTxt="''"
            :isStart="isStart"></mv-count-down>

        </div>
      </div>
      <div class="head-right">
        <div>{{ $t('Amount to be paid') }} <span class="price">{{ payDetail.price | unitPrice }}</span>VNĐ</div>
      </div>
    </div>
    <div class="wrapper-box">
      <div class="-box-item" @click="handlePay('COD')">
        <img
          src="@/assets/images/pay-on-cash.png"
          alt="">
        <span>{{$t('Pay by cash')}}</span>
      </div>
      <div v-if="support.includes('VIETTELPAY')" class="-box-item" @click="handlePay('VIETTELPAY')">
        <img
          src="@/assets/images/viettelpay-logo.svg"
          alt="">
        <span>Viettel Pay</span>
      </div>
      <div v-if="support.includes('MOMO')" class="-box-item" @click="handlePay('MOMO')">
        <img
          src="@/assets/images/momo-logo.png"
          alt="">
        <span>Momo</span>
      </div>
      <div v-if="support.includes('WALLET')" class="-box-item" @click="handlePay('WALLET')">
        <img
          src="@/assets/images/Bono-wallet.svg"
          alt="">
        <span>{{ $t('Besa Wallet') }}</span>
        <span>{{ $t('Current remaining') }} ({{ walletValue | unitPrice("₫",  "before") }})</span>
      </div>
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>
<script>

import {tradeDetail, pay} from '@/api/pay.js';
import MvCountDown from 'mv-count-down'
import {Message} from 'view-design';

export default {
  components: {
    MvCountDown
  },
  data () {
    return {
      payDetail: {}, // 支付详情
      support: [], // 支持配送方式
      walletValue: 0, // 当前余额
      qrcode: '', // 支付二维码
      startTime: new Date().getTime(), // 开始时间（时间戳）
      endTime: 0, // 完成的时间（时间戳）
      endText: this.$t('The request has been canceled by timeout'), // 倒计时完成的提示文本
      isStart: false, // 控制倒计时开始的时机（异步请求完成开启）
      offlineModal: false
    };
  },
  methods: {
    // 获取订单详情
    getTradeDetail () {
      const params = this.$route.query;
      params.clientType = 'PC'
      tradeDetail(params).then(res => {
        if (res.success) {
          this.payDetail = res.result;
          this.endTime = this.payDetail.autoCancel
          this.isStart = true
          this.support = this.payDetail.support
          this.walletValue = this.payDetail.walletValue
        }
      });
    },
    // 支付
    handlePay (way) {
      // 余额支付则直接跳转
      if (way === 'WALLET') {
        // 如果待支付金额大于余额，则报错
        if (this.payDetail.price > this.walletValue) {
          Message.error(this.$t('The balance is not enough to pay'));
          return;
        }
      }

      const params = this.$route.query;
      params.paymentMethod = way;
      params.paymentClient = 'NATIVE';
      params.price = this.payDetail.price;
      if (way === 'COD') {
        this.$Modal.confirm({
          title: this.$t('Payment confirmation'),
          content: this.$t('By click \"Ok\" button, you confirm that you will pay by cash for this service'),
          onOk: () => {
                this.$router.push('/payDone');
              }
          });
        return;
      }
      if (way === 'WALLET') {
        this.$Modal.confirm({
          title: this.$t('Payment confirmation'),
          content: this.$t('Are you sure you want to pay with Besa wallet?'),
          onOk: () => {
            pay(params).then(res => {
              if (res.success) {
                this.$Message.warning(res.message)
                this.$router.push('/payDone');
              } else {
                this.$Message.warning(res.message)
              }
            })
          }
        });
      } else {
        this.$router.push({path: '/qrpay', query: params});
      }
    }
  },
  mounted () {
    this.getTradeDetail();
  }
};
</script>
<style scoped lang="scss">
.head-left {
  font-weight: bold;
}

.left-tips {
  font-size: 21px;

}
.-box-item {
  display: flex;
  font-size: 18px;
  font-weight: bold;
  align-items: center;
  margin: 20px 20px;
  cursor: pointer;
  @include content_color($light_content_color);

  &:hover {
    color: $accent_color;
  }

  > span {
    margin-left: 15px;
  }

  > img {
    border-radius: 10px;
    width: 60px;
    height: 60px;
  }
}

.left-tips-time {
  font-size: 16px;
}

.left-tips-count-down {
  font-size: 10px;
  color: red;
}

.wrapper-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.75;
}

.wrapper-head,
.wrapper-box {
  padding: 20px 40px;
  width: 1200px;
  margin: 20px auto;
}

.wrapper-box {
  @include white_background_color();
  height: auto;
}

.payment-wrapper {
  width: 100%;
  height: 100%;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color: $accent_color;
}

.head-right {
  font-weight: 400;
  font-size: 18px;
}
.count-down{
  font-size: 16px!important;
}
</style>
