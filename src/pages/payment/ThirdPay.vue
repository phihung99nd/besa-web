<template>
  <div class="thirdpay-wrapper">
    <BaseHeader></BaseHeader>
    <div class="wrapper-head">
      <div class="head-left">
        <div class="left-tips">{{ $t('Please pay') }}</div>
        <div class="left-tips-time">{{ $t('Please complete the payment, otherwise the request will be automatically canceled') }}</div>
      </div>
      <div class="head-right">
        <div>{{ $t('Amount to be paid') }} <span class="price">{{$route.query.price | unitPrice}} </span>VNĐ</div>
      </div>
    </div>
    <div class="content">
      <div class="pay-way" v-if="params.paymentMethod === 'VIETTELPAY'">{{$t('Pay via Viettel Pay')}}</div>
      <div class="pay-way" v-if="params.paymentMethod === 'MOMO'">{{$t('Pay via MoMo')}}</div>
      <div class="qrcode">
        <div style="width:200px;height:200px;border:1px solid #eee;">
          <vue-qr :text="qrcode" :margin="0" colorDark="#000" colorLight="#fff" :size="200"></vue-qr>
        </div>
        <div class="intro">
          <Icon type="md-qr-scanner" /> {{ $t('Please use {0} to scan code to pay', [params.paymentMethod === 'VIETTELPAY' ? 'Viettel Pay' : 'Momo'])}}
        </div>
      </div>
      <div class="btn-div">
        <p class="mb_10">{{ $t('After the payment is successful, it will automatically redirect. If not, please click the button to redirect manually...') }}</p>
        <div>
          <Button @click="handlePay">{{ $t('Pay again') }}</Button>
          <Button type="success" @click="$router.push('/payDone')">{{ $t('Payment successful') }}</Button>
        </div>
      </div>
      <a @click="$router.back()">{{ $t('Choose another payment method') }}></a>
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>
<script>
import vueQr from 'vue-qr';
import { payCallback, pay } from '@/api/pay.js';
export default {
  components: { vueQr },
  data () {
    return {
      qrcode: 'http://103.157.218.86:10001/', // 二维码
      params: this.$route.query, // 参数
      interval: null, // 定时器
      num: 0 // 商品数
    };
  },
  methods: {
    // 获取支付二维码
    handlePay () {
      const params = this.$route.query;
      pay(params).then(res => {
        if (res.success) {
          this.qrcode = res.result;
          this.num = 0;
          this.interval = setInterval(this.callback, 5000);
        } else {
          this.$Message.error(res.message)
        }
      });
    },
    callback () { // 支付回调接口
      this.num++;
      if (this.num >= 7) {
        clearInterval(this.interval);
        this.interval = null;
      }
      let params = JSON.parse(JSON.stringify(this.$route.query));
      delete params.paymentMethod;
      delete params.paymentClient;
      payCallback(params).then(res => {
        if (res.result) {
          clearInterval(this.interval);
          this.interval = null;
          this.$router.push({path: '/payDone', query: {orderType: this.$route.query.orderType}});
        }
      });
    }
  },
  mounted () {
    this.handlePay();
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

.left-tips-time {
  font-size: 16px;
}
.wrapper-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.75;
}
.wrapper-head,
.content {
  padding: 20px 40px;
  width: 1000px;
  margin: 20px auto;
}
.thirdpay-wrapper {
  width: 100%;
  height: 100%;
}
.content {
  background-color: #fff;
  box-shadow: 0 6px 10px #ddd;
  position: relative;
  display: flex;
  .pay-way {
    font-weight: bold;
    font-size: 18px;
  }

  .qrcode {
    margin: 30px 0 0 70px;
  }

  .intro {
    background-color: #ff7674;
    height: 80px;
    line-height: 40px;
    margin-top: 10px;
    color: #fff;
    font-size: 16px;
    text-align: center;
  }

  .btn-div {
    margin:120px 0 0 30px;
  }

  a {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.price {
  font-size: 18px;
  font-weight: bold;
  color: $theme_color;
}
.head-right {
  font-weight: bold;
}
</style>
