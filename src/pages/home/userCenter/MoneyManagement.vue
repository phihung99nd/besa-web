<template>
  <div class="money-wrapper">
    <card :_Title="$t('Money management')" />

    <div class="box">
      <div class="mb_20 account-price">
        <span class="subTips">{{ $t('Account Balance') }}：</span>
        <span class="global_color mr_10" style="font-size:26px">{{ memberDeposit | unitPrice }} đ</span>
        <span class="subTips">{{$t('Frozen amount')}}：</span>
        <span class="">{{ frozenDeposit | unitPrice}} đ</span>
      </div>
      <div class="account-btns">
        <Button type="primary" @click="recharge">{{ $t('Recharge online') }}</Button>
        <Button @click="withdrawalApply">{{$t('Apply for withdrawal')}}</Button>
      </div>
    </div>
    <Modal v-model="modal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>{{ $t('Recharge amount') }}</span>
      </p>
      <div>
        <Form
          ref="formData"
          :model="formData"
          label-position="left"
          :label-width="100"
          :rules="formValidate"
        >
          <FormItem :label="$t('Recharge amount')" prop="price">
            <Input v-model="formData.price" size="large" number maxlength="9"
              ><span slot="append">VNĐ</span></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="success" size="large" @click="rechargePrice">{{ $t('Recharge') }}</Button>
      </div>
    </Modal>
    <!-- 提现申请 -->
    <Modal v-model="withdrawApplyModal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>{{ $t('Withdrawal Amount') }}</span>
      </p>
      <div>
        <Form
          ref="withdrawApplyFormData"
          :model="withdrawApplyFormData"
          label-position="left"
          :label-width="100"
          :rules="withdrawApplyFormValidate"
        >
          <FormItem :label="$t('Withdrawal Amount')" prop="price">
            <Input
              v-model="withdrawApplyFormData.price"
              size="large"
              number
              maxlength="9"
              ><span slot="append">VNĐ</span></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: center">
        <Button type="success" size="large" @click="withdrawal">{{$t('Withdraw')}}</Button>
      </div>
    </Modal>
    <!-- 余额日志 -->
    <Tabs value="log" @on-click="tabPaneChange">
      <TabPane :label="$t('Balance Logs')" name="log">
        <Table :columns="logColumns" :data="logColumnsData.records"></Table>
        <!-- 分页 -->
        <div class="page-size">
          <Page
            :current="walletForm.page"
            :total="logColumnsData.total"
            :page-size="walletForm.size"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            :page-size-opts="[10, 20, 50]"
            size="small"
            show-total
            show-sizer
            transfer
          ></Page>
        </div>
      </TabPane>
      <!-- 充值记录 -->
      <TabPane :label="$t('Recharge Logs')" name="recharge">
        <Table
          :columns="rechargeListColumns"
          :data="rechargeListData.records"
        ></Table>
        <!-- 分页 -->
        <div class="page-size">
          <Page
            :current="rechargeForm.page"
            :total="rechargeListData.total"
            :page-size="rechargeForm.size"
            @on-change="rechargeChangePage"
            @on-page-size-change="rechargeChangePageSize"
            :page-size-opts="[10, 20, 50]"
            size="small"
            show-total
            show-sizer
            transfer
          ></Page>
        </div>
      </TabPane>

      <TabPane :label="$t('Withdrawals History')" name="withdrawApply">
        <Table
          :columns="withdrawApplyColumns"
          :data="withdrawApplyColumnsListData.records"
        ></Table>
        <!-- 分页 -->
        <div class="page-size">
          <Page
            :current="withdrawApplyForm.page"
            :total="withdrawApplyColumnsListData.total"
            :page-size="withdrawApplyForm.size"
            @on-change="withdrawChangePage"
            @on-page-size-change="withdrawChangePageSize"
            :page-size-opts="[10, 20, 50]"
            size="small"
            show-total
            show-sizer
            transfer
          ></Page>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {
  getMembersWallet,
  getDepositLog,
  getRecharge,
  getWithdrawApply,
  recharge,
  withdrawalApply
} from '@/api/member';
export default {
  name: 'MoneyManagement',
  data () {
    return {
      frozenDeposit: 0, // 冻结余额
      memberDeposit: 0, // 余额

      modal: false, // 余额充值
      withdrawApplyModal: false, // 提现申请
      formData: {
        // 充值金额
        price: 1
      },
      // 提现金额
      withdrawApplyFormData: {
        price: 1
      },
      // 余额日志
      walletForm: {
        // 搜索框初始化对象
        page: 1,
        size: 10
      },
      // 充值记录
      rechargeForm: {
        // 搜索框初始化对象
        page: 1, // 当前页数
        size: 10 // 页面大小
      },
      // 提现记录
      withdrawApplyForm: {
        // 搜索框初始化对象
        page: 1, // 当前页数
        size: 10 // 页面大小
      },
      // 提现申请校验
      withdrawApplyFormValidate: {
        price: [
          { required: true, message: this.$t('Please enter withdrawal amount greater than 10 000 and less than 10 000 000') },
          {
            pattern: /^[1-9]\d{4,8}$/,
            message: this.$t('Please enter withdrawal amount greater than 10 000 and less than 10 000 000'),
            trigger: 'change'
          }
        ]
      },
      formValidate: {
        price: [
          { required: true, message: this.$t('Please enter recharge amount greater than or equal to 10 000 and less than 10 000 000') },
          {
            pattern: /^[1-9]\d{4,8}?$/,
            message: this.$t('Please enter recharge amount greater than or equal to 10 000 and less than 10 000 000'),
            trigger: 'change'
          }
        ]
      },
      // 余额日志
      logColumns: [
        {
          title: this.$t('Time'),
          width: 190,
          key: 'createTime'
        },
        {
          title: this.$t('Money Amount'),
          key: 'money',
          width: 180,
          render: (h, params) => {
            if (params.row.money > 0) {
              return h('div', [
                h(
                  'span',
                  {
                    style: {
                      color: 'green'
                    }
                  },
                  this.$options.filters.unitPrice(params.row.money, '+ đ')
                )
              ]);
            } else if (params.row.money < 0) {
              return h('div', [
                h(
                  'span',
                  {
                    style: {
                      color: 'red'
                    }
                  },
                  this.$options.filters.unitPrice(0 - params.row.money, '- đ')
                )
              ]);
            }
          }
        },
        {
          title: this.$t('Change log'),
          key: 'detail'
        }
      ],
      logColumnsData: {}, // 余额日志
      // 充值记录
      rechargeListColumns: [
        {
          title: this.$t('Time'),
          key: 'createTime',
          width: 168
        },
        {
          title: this.$t('Transaction ID'),
          key: 'rechargeSn',
          width: 200
        },
        {
          title: this.$t('Money Amount'),
          key: 'rechargeMoney',
          render: (h, params) => {
            if (params.row.payStatus === 'PAID') {
              return h('div', [h('span', {
                style: {
                  color: 'green'
                }
              }, this.$options.filters.unitPrice(params.row.rechargeMoney, '+ đ'))]);
            } else {
              return h('div', [h('span', this.$options.filters.unitPrice(params.row.rechargeMoney, "₫",  "before"))]);
            }
          }
        },
        {
          title: this.$t('Payment Status'),
          key: 'payStatus',
          render: (h, params) => {
            if (params.row.payStatus === 'PAID') {
              return h('div', [h('span', {}, this.$t('Paid'))]);
            } else if (params.row.payStatus === 'UNPAID') {
              return h('div', [h('span', {}, this.$t('Unpaid'))]);
            } else if (params.row.payStatus === 'CANCEL') {
              return h('div', [h('span', {}, this.$t('Cancelled'))]);
            }
          }
        },
        {
          title: this.$t('Payment Method'),
          key: 'rechargeWay',
          render: (h, params) => {
            if (params.row.rechargeWay === 'BANK_TRANSFER') {
              return h('div', [h('span', {}, this.$t('Bank Transfer'))]);
            } else {
              return h('div', [h('span', {}, '')]);
            }
          }
        },
        {
          title: this.$t('Payment Time'),
          key: 'payTime',
          width: 180
        }
      ],
      rechargeListData: {}, // 充值记录数据
      // 提现记录
      withdrawApplyColumns: [
        {
          title: this.$t('Time'),
          key: 'createTime',
          width: 168
        },
        {
          title: this.$t('Transaction ID'),
          key: 'sn',
          width: 200
        },
        {
          title: this.$t('Withdrawal Amount'),
          key: 'applyMoney',
          width: 110,
          render: (h, params) => {
            if (params.row.applyStatus === 'VIA_AUDITING') {
              return h('div', [h('span', {
                style: {
                  color: 'green'
                }
              }, this.$options.filters.unitPrice(params.row.applyMoney, '+ đ'))]);
            } else {
              return h('div', [h('span', this.$options.filters.unitPrice(params.row.applyMoney, "₫",  "before"))]);
            }
          }
        },
        {
          title: this.$t('Status'),
          key: 'applyStatus',
          width: 95,
          render: (h, params) => {
            if (params.row.applyStatus === 'APPLY') {
              return h('div', [h('span', {}, this.$t('Apply'))]);
            } else if (params.row.applyStatus === 'VIA_AUDITING') {
              return h('div', [h('span', {}, this.$t('Successful withdrawal'))]);
            } else {
              return h('div', [h('span', {}, this.$t('Audit Rejected'))]);
            }
          }
        },
        {
          title: this.$t('Checking Time'),
          key: 'inspectTime',
          width: 168
        },
        {
          title: this.$t('Checking Note'),
          key: 'inspectRemark',
          tooltip: true

        }
      ],
      withdrawApplyColumnsListData: {} // 提现记录
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    // 初始化数据
    init () {
      getMembersWallet().then((res) => {
        this.frozenDeposit = res.result.memberFrozenWallet;
        this.memberDeposit = res.result.memberWallet;
      });
      getDepositLog(this.walletForm).then((res) => {
        if (res.message === 'success') {
          this.logColumnsData = res.result;
        }
      });
    },
    tabPaneChange (v) {
      // 如果查询充值记录
      if (v === 'recharge') {
        this.getRechargeData();
      }
      // 如果是余额日志
      if (v === 'log') {
        this.init();
      }
      // 如果是提现记录
      if (v === 'withdrawApply') {
        this.getWithdrawApplyData();
      }
    },
    // 充值记录
    getRechargeData () {
      getRecharge(this.rechargeForm).then((res) => {
        if (res.message === 'success') {
          this.rechargeListData = res.result;
        }
      });
    },
    // 提现记录
    getWithdrawApplyData () {
      getWithdrawApply(this.withdrawApplyForm).then((res) => {
        if (res.message === 'success') {
          this.withdrawApplyColumnsListData = res.result;
        }
      });
    },
    // 余额日志
    changePage (v) {
      this.walletForm.page = v;
      this.init();
    },
    changePageSize (v) {
      this.walletForm.page = 1;
      this.walletForm.size = v;
      this.init();
    },
    // 充值记录
    rechargeChangePage (v) {
      this.rechargeForm.page = v;
      this.getRechargeData();
    },
    rechargeChangePageSize (v) {
      this.rechargeForm.page = 1;
      this.rechargeForm.size = v;
      this.getRechargeData();
    },
    // 提现记录
    withdrawChangePage (v) {
      this.withdrawApplyForm.page = v;
      this.getWithdrawApplyData();
    },
    withdrawChangePageSize (v) {
      this.withdrawApplyForm.page = 1;
      this.withdrawApplyForm.size = v;
      this.getWithdrawApplyData();
    },
    // 弹出在线充值框
    recharge () {
      this.formData.price = 1;
      this.modal = true;
    },
    // 在线充值
    rechargePrice () {
      this.$refs['formData'].validate((valid) => {
        if (valid) {
          recharge(this.formData).then((res) => {
            if (res.message === 'success') {
              this.$router.push({
                path: '/payment',
                query: { orderType: 'RECHARGE', sn: res.result.rechargeSn }
              });
            }
          });
        }
      });
    },
    // 申请提现弹出框
    withdrawalApply () {
      this.withdrawApplyFormData.price = 1;
      this.withdrawApplyModal = true;
    },
    // 提现
    withdrawal () {
      this.$refs['withdrawApplyFormData'].validate((valid) => {
        if (valid) {
          withdrawalApply(this.withdrawApplyFormData).then((res) => {
            if (res && res.success) {
              this.$Message.success(this.$t('The withdrawal Request sent successfully, pay attention to the withdrawal status'));
              this.withdrawApplyModal = false;
              this.init(); // 余额查询
              this.getWithdrawApplyData(); // 提现记录
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.box {
  margin: 20px 0;
}
.page-size {
  margin: 15px 0px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.account-price {
  font-weight: bold;
}
.subTips {
  margin-left: 10px;
}
.account-btns {
  margin: 10px 0;
}
.ivu-btn {
  margin: 0 4px;
}

</style>
