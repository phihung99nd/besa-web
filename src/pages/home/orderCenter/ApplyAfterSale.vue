<template>
  <div class="apply-after-sale">
    <card :_Title="$t('Apply for after sales')"></card>
    <Table
      border
      :columns="columns"
      :data="goodsData"
    >
    <template slot-scope="{ row }" slot="name">
      <div style="padding:5px;display:flex;">
        <img :src="row.image" style="vertical-align: top;" width="60" height="60" alt=""> <span class="ml_10">{{row.name}}</span>
      </div>
    </template>
    <template slot-scope="{ row }" slot="goodsPrice">
      <div>{{row.applyRefundPrice | unitPrice("₫",  "before")}}</div>
    </template>
    </Table>
    <div>
      <Form :model="form" ref="form" class="mt_10" :rules="rules" :label-width="80">
        <FormItem :label="$t('Category')">
          <RadioGroup v-model="form.serviceType" @on-change="changeReason" type="button" button-style="solid">
            <Radio v-if="info.returnGoods" label="RETURN_GOODS">{{ $t('Return goods') }}</Radio>
            <Radio v-if="info.returnMoney" label="RETURN_MONEY">{{$t('Return money')}}</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem :label="$t('Quantity')" prop="num">
          <Input type="number" v-model="form.num" style="width:260px" />
        </FormItem>
        <FormItem :label="$t('Reason')" prop="reason">
          <Select v-model="form.reason" style="width:260px">
            <Option v-for="item in reasonList" :value="item.id" :key="item.id">{{ item.reason }}</Option>
          </Select>
        </FormItem>
        <FormItem :label="$t('Description')" prop="problemDesc">
          <Input type="textarea" :rows="4" maxlength="500" style="width:260px" show-word-limit v-model="form.problemDesc" />
        </FormItem>
        <FormItem :label="$t('Image')">
          <div style="display:flex;align-items:center;">
            <div class="demo-upload-list" v-for="(img, index) in uploadList" :key="index">
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
                  <Icon type="md-add" size="20"></Icon>
                </div>
            </Upload>
          </div>
        </FormItem>
        <FormItem :label="$t('Refund method')">
          <div>{{info.refundWay === 'ORIGINAL' ? $t('Return goods') : $t('Return money')}}</div>
        </FormItem>
        <template v-if="info.accountType === 'BANK_TRANSFER' && info.applyRefundPrice !== 0">
          <FormItem :label="$t('Bank')" prop="bankDepositName">
            <Input v-model="form.bankDepositName" type="text" style="width:260px" />
          </FormItem>
          <FormItem :label="$t('Account name')" prop="bankAccountName">
            <Input v-model="form.bankAccountName" type="text" style="width:260px" />
          </FormItem>
          <FormItem :label="$t('Account number')" prop="bankAccountNumber">
            <Input v-model="form.bankAccountNumber" type="text" style="width:260px" />
          </FormItem>
        </template>
        <FormItem :label="$t('Refund method')" v-if="form.serviceType === 'RETURN_GOODS'">
          <div>{{ $t('Express delivery to third-party') }}</div>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="apply">{{$t('Submit')}}</Button>
        </FormItem>
      </Form>
      <Modal title="View Image" v-model="visible">
        <img :src="previewImage" v-if="visible" style="width: 100%">
      </Modal>
    </div>
  </div>
</template>
<script>
import { afterSaleReason, afterSaleInfo, applyAfterSale } from '@/api/member.js'
import { commonUrl } from '@/plugins/request.js';
import storage from '@/plugins/storage';
import * as RegExp from '@/plugins/RegExp'
export default {
  data () {
    const checkNum = (rule, value, callback) => {
      if (value === '') {
        console.log(RegExp);
        callback(new Error(this.$t('Please fill in the sending quantity')));
      } else if (value > this.info.num) {
        callback(new Error(this.$t('The sending quantity cannot be greater than the purchased quantity')));
      } else if (!RegExp.integer.test(value)) {
        callback(new Error(this.$t('Sending quantity must be a positive integer')));
      } else {
        callback();
      }
    };
    return {
      columns: [
        {title: this.$t('Product name'), slot: 'name'},
        {title: this.$t('Price'), slot: 'goodsPrice'},
        {title: this.$t('Quantity'), key: 'num'}
      ],
      goodsData: [],
      reasonList: [],
      info: {},
      form: {
        serviceType: 'RETURN_GOODS',
        num: 1
      },
      uploadList: [], // 上传列表
      action: commonUrl + '/common/common/upload/file', // 上传地址
      accessToken: {}, // 验证token
      visible: false, // 图片预览
      previewImage: '', // 预览图片url
      rules: { // 验证规则
        num: [{ validator: checkNum }],
        reason: [{ required: true, message: this.$t('Select sending reason') }],
        problemDesc: [{ required: true, message: this.$t('Select problem reason') }],
        bankAccountNumber: [
          { required: true, message: this.$t('Enter bank card number') },
          {
            type: 'string',
            pattern: /^[0-9]\d*$/,
            message: this.$t('Enter correct bank number')
          }
        ],
        bankAccountName: [{ required: true, message: this.$t('Enter the bank account name') }],
        bankDepositName: [{ required: true, message: this.$t('Enter bank deposit name') }]
      }
    }
  },
  methods: {
    getInfo () { // 获取售后信息
      afterSaleInfo(this.$route.query.sn).then(res => {
        if (res.success) {
          this.info = res.result
          this.goodsData.push(res.result)
          if (!this.info.returnGoods && this.info.returnMoney) {
            this.form.serviceType = 'RETURN_MONEY'
          }
          this.getReason(this.form.serviceType)
        }
      })
    },
    getReason (type) { // 获取售后原因
      afterSaleReason(type).then(res => {
        if (res.success) this.reasonList = res.result
      })
    },
    changeReason (type) { // 改变售后原因列表
      this.getReason(type)
    },
    apply () { // 售后申请提交
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign(this.info, this.form)
          params.images = this.uploadList.toString()
          params.orderItemSn = this.$route.query.sn
          params.reason = this.reasonList.find(item => item.id === params.reason).reason
          applyAfterSale(params).then(res => {
            if (res.success) {
              this.$Message.success(this.$t('The after-sales application has been successfully submitted, please go to the after-sales order to check!'))
              this.$router.push({name: 'AfterSale'})
            }
          })
        }
      })
    },
    handleView (name) { // 预览图片
      this.previewImage = name;
      this.visible = true;
    },
    handleRemove (index) { // 移除图片
      this.uploadList.splice(index, 1)
      this.$forceUpdate()
    },
    handleSuccess (res, file) { // 上传成功回调
      this.uploadList.push(res.result)
      this.$forceUpdate()
    },
    handleBeforeUpload () { // 上传之前钩子函数
      const check = this.uploadList.length < 6;
      if (!check) {
        this.$Notice.warning({
          title: this.$t('Up to 5 pictures can be uploaded')
        });
        return check;
      }
    }
  },
  mounted () {
    this.accessToken.accessToken = storage.getItem('buyer_accessToken');
    this.getInfo()
  }
}
</script>
<style lang="scss" scoped>

/** 商品信息 */
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
  .actrual-price {
    color: $theme_color;
    font-weight: bold;
    font-size: 20px;
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
