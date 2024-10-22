<template>
  <div class="add-eval">
    <div class="title">
      <card :_Title="$t('Order Review')" :_Size="16"></card>
      <p>
        <span class="color999">{{$t('Order Number')}}：</span><span>{{$route.query.sn}}</span>
        <span class="color999 ml_20" v-if="order.order">{{order.order.paymentTime}}</span>
      </p>
    </div>
    <!-- 物流评分、服务评分 -->
    <div class="delivery-rate">
      <div class="fontsize_16">{{$t('Logistics service review')}}：</div>
      <div class="color999">
        <span>{{$t('Logistics rating')}}：<Rate v-model="form.deliveryScore" /></span>
        <span>{{$t('Service rating')}}：<Rate v-model="form.serviceScore" /></span>
        <span>{{$t('Review')}}：<Rate v-model="form.descriptionScore" /></span>
      </div>
    </div>
    <!-- 添加订单评价  左侧商品详情  右侧评价框 -->
    <ul class="goods-eval">
      <li >
        <div class="goods-con">
          <img :src="orderGoods.image" class="hover-pointer" alt="" width="100" @click="goGoodsDetail(orderGoods.skuId, orderGoods.goodsId)">
          <p class="hover-pointer color999" @click="goGoodsDetail(orderGoods.skuId, orderGoods.goodsId)">{{orderGoods.name}}</p>
          <p>{{orderGoods.goodsPrice | unitPrice("₫",  "before")}}</p>
        </div>

        <div class="eval-con">
          <div>
            <span class="color999">{{$t('Product review')}}：</span>
            <RadioGroup style="margin-bottom:5px;color:#999" v-model="orderGoods.grade" type="button" button-style="solid">
              <Radio label="GOOD">{{$t('Good')}}</Radio>
              <Radio label="MODERATE">{{$t('Moderate')}}</Radio>
              <Radio label="WORSE">{{$t('Worse')}}</Radio>
            </RadioGroup>
            <Input type="textarea" maxlength="500" show-word-limit :rows="4" v-model="orderGoods.content" />
          </div>
          <div style="display:flex;align-items:center;">
            <div class="demo-upload-list" v-for="(img, index) in orderGoods.uploadList" :key="index">
              <img :src="img">
              <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(img)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
              </div>
            </div>
            <Upload
                :show-upload-list="false"
                :on-success="handleSuccess"
                :before-upload="handleBeforeUpload"
                accept=".jpg,.jpeg,.png"
                :format="['jpg','jpeg','png']"
                :action="action"
                :headers="accessToken"
                style="display: inline-block;width:58px;">
                <div class="hover-pointer icon-upload" style="">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
            </Upload>
          </div>
        </div>
      </li>
    </ul>
    <Button type="primary" class="mt_10" :loading="loading" @click="save">{{$t('Publish')}}</Button>
    <Modal title="View Image" v-model="visible">
        <img :src="previewImage" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import { orderDetail } from '@/api/order.js';
import { addEvaluation } from '@/api/member.js';
import { commonUrl } from '@/plugins/request.js';
import storage from '@/plugins/storage';
export default {
  data () {
    return {
      order: {}, // 订单详情
      orderGoods: {}, // 订单商品
      form: { // 评分展示
        deliveryScore: 5,
        serviceScore: 5,
        descriptionScore: 5
      }, // 表单
      visible: false, // 图片预览
      action: commonUrl + '/common/common/upload/file', // 上传地址
      accessToken: {}, // 验证token
      previewImage: '', // 预览图片地址
      loading: false // 提交加载状态
    }
  },
  methods: {
    getOrderDetail () { // 获取订单详情
      orderDetail(this.$route.query.sn).then(res => {
        this.order = res.result
        this.orderGoods = res.result.orderItems[this.$route.query.index]
        this.$set(this.orderGoods, 'grade', 'GOOD')
        this.orderGoods.uploadList = []
      })
    },
    save () { // 保存评价
      if (!this.form.serviceScore || !this.form.deliveryScore) {
        this.$Message.warning(this.$t('Logistics service rating cannot be empty'))
        return false;
      }

      if (!this.form.descriptionScore) {
        this.$Message.warning(this.$t('Comment cannot be empty'))
      }

      this.loading = true;
      let goods = this.orderGoods
      let params = {
        goodsId: goods.goodsId,
        orderItemSn: goods.sn,
        skuId: goods.skuId,
        descriptionScore: this.form.descriptionScore,
        serviceScore: this.form.serviceScore,
        deliveryScore: this.form.deliveryScore,
        grade: goods.grade,
        content: goods.content || '',
        images: goods.uploadList.toString()
      }
      addEvaluation(params).then(res => {
        this.loading = false
        if (res.success) {
          this.$Message.success(this.$t('Thank you for your review!'))
          this.$router.push('/home/CommentList')
        }
      }).catch(() => {
        this.loading = false;
      })
    },
    goGoodsDetail (skuId, goodsId) { // 跳转商品详情
      let routerUrl = this.$router.resolve({
        path: '/goodsDetail',
        query: {skuId, goodsId}
      })
      window.open(routerUrl.href, '_blank')
    },
    handleView (name) { // 预览图片
      this.previewImage = name;
      this.visible = true;
    },
    handleRemove (index) { // 移除图片
      this.orderGoods.uploadList.splice(index, 1)
      this.$forceUpdate()
    },
    handleSuccess (res, file) { // 上传成功回调
      this.orderGoods.uploadList.push(res.result)
      this.$forceUpdate()
    },
    handleBeforeUpload () { // 上传之前钩子
      const check = this.orderGoods.uploadList.length < 10;
      if (!check) {
        this.$Notice.warning({
          title: this.$t('You only can upload maximum 9 images')
        });
        return check;
      }
    }
  },
  mounted () {
    this.accessToken.accessToken = storage.getItem('buyer_accessToken');
    this.getOrderDetail()
  }
}
</script>
<style lang="scss" scoped>
.delivery-rate {
  display: flex;
  align-items: center;
  margin-top: 20px;
  height: 50px;
  border-bottom: 1px solid #eee;
  >div:nth-child(1) {
    width: 120px;
    font-weight: bold;
  }
}
.goods-eval li{
  display: flex;
  border-bottom: 1px solid #eee;

  .goods-con {
    width: 30%;
    padding: 20px;
    text-align: center;
    p {
      word-wrap: wrap;
      &:hover{ color: $theme_color; }
    }
  }
  .eval-con {
    width: 70%;
    padding: 20px;
  }
}

.demo-upload-list{
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-right: 4px;
  margin-top: 10px;
}
.demo-upload-list img{
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
.icon-upload {
  width: 58px;
  height:58px;
  line-height: 58px;
  text-align:center;
  display: inline-block;
  border:1px dashed #999;
  border-radius: 4px;
  margin-top: 10px;
  &:hover{
    cursor: pointer;
    border-color: $theme_color;
  }
}
</style>
