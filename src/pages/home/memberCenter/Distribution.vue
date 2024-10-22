<template>
  <div class="distribution-wrapper">
    <card :_Title="$t('My Distribution')" />
    <!-- 分销申请 -->

    <div v-if="status === 0">
      <Alert type="warning">{{$t('Distributor Application')}}</Alert>
      <Form ref="form" :model="applyForm" :rules="rules">
        <FormItem :label="$t('Name')" prop="name">
          <Input v-model="applyForm.name"></Input>
        </FormItem>
        <FormItem :label="$t('ID Number')" prop="idNumber">
          <Input v-model="applyForm.idNumber"></Input>
        </FormItem>
        <FormItem :label="$t('Bank')" prop="settlementBankBranchName">
          <Input v-model="applyForm.settlementBankBranchName"></Input>
        </FormItem>
        <FormItem :label="$t('Bank account name')" prop="settlementBankAccountName">
          <Input v-model="applyForm.settlementBankAccountName"></Input>
        </FormItem>
        <FormItem :label="$t('Bank Account')" prop="settlementBankAccountNum">
          <Input v-model="applyForm.settlementBankAccountNum"></Input>
        </FormItem>

        <FormItem>
          <Button type="primary" :loading="applyLoading" @click="apply"
            >{{$t('Submit')}}</Button
          >
        </FormItem>
      </Form>
    </div>
    <!-- 分销审核 -->
    <div v-if="status === 1">
      <Alert type="success">
        {{$t('The information you submitted is being reviewed')}}
        <template slot="desc"
          >{{$t('After submitting the certification application, the staff will check and complete the review within three working days')}}</template
        >
      </Alert>
    </div>
    <!-- 分销提现、商品、订单 -->
    <div v-if="status === 2">
      <div class="tips">

          <p>{{$t('A distribution order will be generated after the distribution offline payment')}}</p>
          <p>
            {{$t('Freeze Amount: The user\'s cash withdrawal amount is the frozen amount. After the approval is approved, the frozen amount will be deducted. After the approval is rejected, the frozen amount will be returned to the withdrawable amount.')}}
          </p>
          <p>{{$t('Amount that can be withdrawn: After the distribution order commission T+1 is unfrozen, it can become the amount that can be withdrawn')}}</p>

      </div>

      <div class="box">
        <div class="mb_20 account-price">
          <span class="subTips">{{$t('Amount that can be withdrawn')}}：</span>
          <span class="fontsize_48 global_color"
            >đ{{ result.canRebate | unitPrice }}</span
          >
          <span class="subTips">{{$t('Frozen amount')}}：</span>
          <span class="">đ{{ result.commissionFrozen | unitPrice }}</span>
          <span class="subTips">{{$t('Total rebate amount')}}：</span>
          <span class="">đ{{ result.rebateTotal | unitPrice }}</span>
          <Button
            type="primary"
            size="small"
            class="ml_20"
            @click="withdrawApplyModal = true"
            >{{$t('Apply for withdrawal')}}</Button
          >
        </div>
      </div>
      <Tabs :value="tabName" @on-click="tabPaneChange">
        <TabPane :label="$t('Selected product')" name="goodsChecked">
          <Table stripe :columns="goodsColumns" :data="goodsData.records">
            <template slot-scope="{ row }" slot="name">
              <div
                class="goods-msg"
                @click="
                  linkTo(
                    `/goodsDetail?skuId=${row.skuId}&goodsId=${row.goodsId}`
                  )
                "
              >
                <img
                  style="vertical-align: top"
                  :src="row.thumbnail"
                  width="60"
                  height="60"
                  alt=""
                />&nbsp; {{ row.name }}
              </div>
            </template>
            <template slot-scope="{ row }" slot="price">
              <span> đ{{ row.price | unitPrice }}</span>
            </template>
            <template slot-scope="{ row }" slot="commission">
              <span> đ{{ row.commission | unitPrice }}</span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button
                type="success"
                size="small"
                style="margin-right: 5px"
                @click="fenxiao(row)"
                >{{$t('Distributors')}}</Button
              >
              <Button
                type="error"
                size="small"
                @click="selectGoods(row.id, false)"
                >{{$t('Cancel Selection')}}</Button
              >
            </template>
          </Table>
          <div class="page-size">
            <Page
              :current="params.page"
              :total="+goodsData.total"
              :page-size="params.size"
              @on-change="changePage"
              size="small"
              show-total
              show-elevator
            ></Page>
          </div>
        </TabPane>
        <TabPane :label="$t('Unselected product')" name="goodsUncheck">
          <Table stripe :columns="goodsColumns" :data="goodsData.records">
            <template slot-scope="{ row }" slot="name">
              <div
                class="goods-msg"
                @click="
                  linkTo(
                    `/goodsDetail?skuId=${row.skuId}&goodsId=${row.goodsId}`
                  )
                "
              >
                <img
                  style="vertical-align: top"
                  :src="row.thumbnail"
                  width="60"
                  height="60"
                  alt=""
                />&nbsp; {{ row.name }}
              </div>
            </template>
            <template slot-scope="{ row }" slot="price">
              <span> {{ row.price | unitPrice }}đ</span>
            </template>
            <template slot-scope="{ row }" slot="commission">
              <span> {{ row.commission | unitPrice }}đ</span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <Button
                type="primary"
                size="small"
                style="margin-right: 5px"
                @click="selectGoods(row.id, true)"
                >{{$t('Select product')}}</Button
              >
            </template>
          </Table>
          <div class="page-size">
            <Page
              :current="params.page"
              :total="+goodsData.total"
              :page-size="params.size"
              @on-change="changePage"
              size="small"
              show-total
              show-elevator
            ></Page>
          </div>
        </TabPane>
        <TabPane :label="$t('Withdrawals History')" name="log">
          <Table stripe :columns="logColumns" :data="logData.records">
            <template slot-scope="{ row }" slot="sn">
              <span>{{ row.sn }}</span>
            </template>
            <template slot-scope="{ row }" slot="time">
              <span>{{ row.createTime }}</span>
            </template>
            <template slot-scope="{ row }" slot="price">
              <span
                v-if="row.distributionCashStatus == 'VIA_AUDITING'"
                style="color: green"
              >
                +{{ row.price | unitPrice }}đ</span
              >
              <span v-else style="color: red">
                -{{ row.price | unitPrice }}đ</span
              >
            </template>
            <template slot-scope="{ row }" slot="status">
              <span>
                {{
                  row.distributionCashStatus == "APPLY"
                    ? $t('Pending')
                    : row.distributionCashStatus == "VIA_AUDITING"
                    ? $t('OK')
                    : $t('Reject')
                }}</span
              >
            </template>
          </Table>
          <div class="page-size">
            <Page
              :current="logParams.page"
              :total="logData.total"
              :page-size="logParams.size"
              @on-change="changePageLog"
              size="small"
              show-total
              show-elevator
            ></Page>
          </div>
        </TabPane>
      </Tabs>
    </div>
    <!-- 未开放 -->
    <div v-if="status === 3">
      <Alert type="error">
        {{$t('The distribution function is not yet enabled')}}
        <template slot="desc"
          >{{$t('After submitting the certification application, the staff will check and complete the review within three working days')}}</template
        >
      </Alert>
    </div>

    <Modal v-model="withdrawApplyModal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>{{$t('Withdrawal Amount')}}</span>
      </p>
      <div>
        <Input v-model="withdrawPrice" size="large" number maxlength="9"
          ><span slot="append">VNĐ</span></Input
        >
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="primary" size="large" @click="withdraw">{{$t('Withdraw')}}</Button>
      </div>
    </Modal>
    <Modal v-model="qrcodeShow" :title="$t('Distributors')" width="800">
      <Alert type="warning"> {{$t('Download the QR code or copy the link to share the product')}} </Alert>
      <div style="width: 200px; height: 200px; border: 1px solid #eee">
        <vue-qr
          :text="qrcode"
          :callback="qrcodeData"
          :margin="0"
          colorDark="#000"
          colorLight="#fff"
          :size="200"
        ></vue-qr>
        <Button class="download-btn" type="success" @click="downloadQrcode"
          >{{$t('Download QR code')}}</Button
        >
      </div>
      <div class="mt_10">
        {{$t('Product link')}}：<Input style="width: 400px" v-model="qrcode"></Input>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  distribution,
  applyDistribution,
  distCash,
  distCashHistory,
  getDistGoodsList,
  selectDistGoods,
} from "@/api/member.js";
import { IDCard } from "@/plugins/RegExp.js";
import { checkBankno } from "@/plugins/Foundation";
import vueQr from "vue-qr";
export default {
  name: "Distribution",
  components: { vueQr },
  data() {
    return {
      status: 0, // 申请状态，0为未申请 1 申请中 2 申请完成 3 功能暂未开启
      applyForm: {}, // 申请表单
      rules: {
        // 验证规则
        name: [{ required: true, message: this.$t('Please enter your full name') }],
        idNumber: [
          { required: true, message: this.$t('Please enter the ID number') },
          { pattern: IDCard, message: this.$t('Please enter the correct ID number') },
        ],
        settlementBankBranchName: [
          {
            required: true,
            message: this.$t('Please enter the bank account'),
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
        ],
        settlementBankAccountName: [
          {
            required: true,
            message: this.$t('Please enter the bank account name'),
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
        ],
        //银行账号
        settlementBankAccountNum: [
          {
            required: true,
            message: this.$t('Incorrect bank account number'),
            // 可以单个或者同时写两个触发验证方式
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // this.$u.test.mobile()就是返回true或者false的
              return checkBankno(value);
            },
            message: this.$t('Incorrect bank account number'),
          },
        ],
      },
      tabName: "goodsChecked", // 当前所在tab
      result: {}, // 审核结果
      applyLoading: false, // 申请加载状态
      goodsLoading: false, // 列表加载状态
      withdrawApplyModal: false, // 提现表单显隐
      withdrawPrice: 0, // 提现金额
      goodsData: {}, // 商品数据
      logData: {}, // 日志数据
      goodsColumns: [
        // 商品表头
        { title: this.$t('Product name'), slot: "name", width: 400 },
        { title: this.$t('Price'), slot: "price" },
        { title: this.$t('Commission'), slot: "commission" },
        { title: this.$t('Action'), slot: "action", minWidth: 120 },
      ],
      logColumns: [
        // 日志表头
        { title: this.$t('Serial number'), slot: "sn" },
        { title: this.$t('Application time'), slot: "time" },
        { title: this.$t('Withdrawal Amount'), slot: "price" },
        { title: this.$t('Status'), slot: "status" },
      ],
      params: {
        // 商品请求参数
        page: 1,
        size: 20,
        checked: true,
      },
      orderParams: {
        // 订单商品请求参数
        page: 1,
        size: 20,
      },
      logParams: {
        // 日志参数
        page: 1,
        size: 20,
        sort: "createTime",
        order: "desc",
      },
      qrcode: "", // 二维码
      qrcodeShow: false, // 显示二维码
      base64Img: "", // base64编码
      nameCurr: "", // 当前分销商品名称
    };
  },
  mounted() {
    this.distribution();
  },
  methods: {
    apply() {
      // 申请成为分销商
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.applyLoading = true;
          applyDistribution(this.form).then((res) => {
            this.applyLoading = false;
            if (res.success) {
              this.$Message.success(this.$t('The Application has been submitted, please wait for review'));
              this.status = 1;
            }
          });
        }
      });
    },
    withdraw() {
      // 申请提现
      distCash({ price: this.withdrawPrice }).then((res) => {
        this.withdrawApplyModal = false;
        this.price = 0;
        if (res.success) {
          this.$Message.success(this.$t('The Application has been submitted, please wait for review'));
          this.distribution();
          this.getLog();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    qrcodeData(data64) {
      // 二维码base64地址
      this.base64Img = data64;
    },
    downloadQrcode() {
      // 下载二维码
      let a = document.createElement("a"); // 生成一个a元素
      let event = new MouseEvent("click"); // 创建一个单击事件
      a.download = this.nameCurr || "photo";
      a.href = this.base64Img; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    },
    tabPaneChange(tab) {
      // tab栏切换
      if (tab === "goodsChecked") {
        this.params.checked = true;
        this.params.pageNUmber = 1;
        this.getGoodsData();
      } else if (tab === "goodsUncheck") {
        this.params.checked = false;
        this.getGoodsData();
      } else if (tab === "log") {
        this.logParams.page = 1;
        this.getLog();
      }
    },
    changePage(val) {
      // 修改页码
      this.params.page = val;
      this.getGoodsData();
    },
    changePageLog(val) {
      // 修改页码 日志
      this.logParams.page = val;
      this.getLog();
    },
    selectGoods(id, checked) {
      // 选择商品
      let params = {
        distributionGoodsId: id,
        checked: checked,
      };
      selectDistGoods(params).then((res) => {
        if (res.success) {
          this.$Message.success(this.$t('Successful'));
          this.getGoodsData();
        }
      });
    },
    fenxiao(row) {
      // 分销商品
      this.qrcode = `${location.origin}/goodsDetail?skuId=${row.skuId}&goodsId=${row.goodsId}&distributionId=${this.result.id}`;
      this.nameCurr = row.name;
      this.qrcodeShow = true;
    },
    getGoodsData() {
      // 商品数据
      getDistGoodsList(this.params).then((res) => {
        if (res.success) this.goodsData = res.result;
      });
    },
    getLog() {
      // 提现历史
      distCashHistory(this.logParams).then((res) => {
        if (res.success) this.logData = res.result;
      });
    },
    distribution() {
      // 获取分销商信息
      distribution().then((res) => {
        if (res.result) {
          this.result = res.result;
          let type = res.result.distributionStatus;

          if (type === "PASS") {
            this.status = 2;
            this.getGoodsData();
          } else if (type === "RETREAT" || type === "REFUSE") {
            this.status = 0;
          } else {
            this.status = 1;
          }
        } else if (!res.data.success && res.data.code === 22000) {
          this.status = 3;
        } else {
          // 没有资格申请 先去实名认证
          this.status = 0;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.box {
  margin: 20px 0;
}
.page-size {
  margin: 15px 0px;
  text-align: right;
}
.account-price {
  font-weight: bold;
}
.subTips {
  margin-left: 10px;
}
.fontsize_48 {
  font-size: 48px;
}
.goods-msg {
  display: flex;
  align-items: center;
  padding: 3px;
  &:hover {
    color: $theme_color;
    cursor: pointer;
  }
}
.download-btn {
  position: relative;
  top: -200px;
  left: 200px;
}
/depp/ .ivu-alert-message {
  p {
    margin: 4px 0;
  }
}
.tips{
  background:#f7f7f7;
  padding: 16px;
  border-radius: .4em;
  >p{
    margin: 6px 0;
  }
}
</style>
