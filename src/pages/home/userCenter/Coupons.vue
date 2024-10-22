<template>
  <div class="coupon-wrapper">
    <card :_Tabs="statusNameList" :_Title="$t('Coupon List')" @_Change="change"/>
    <empty v-if="list.length === 0"/>
    <ul v-else class="coupon-list">
      <li v-for="(item, index) in list" :key="index" class="coupon-item">
        <div class="c-left">
          <div>
            <span v-if="item.couponType === 'PRICE'" class="fontsize_12 global_color">đ<span
              class="price">{{ item.price | unitPrice }}</span></span>
            <span v-if="item.couponType === 'DISCOUNT'" class="fontsize_12 global_color"><span
              class="price">{{ item.discount }}</span>{{ $t('percent') }}</span>
            <span class="describe">{{ $t('{0} available', [item.consumeThreshold]) }}</span>
          </div>
          <p>{{ $t('Scope of use') }}：{{ useScope(item.scopeType, item.storeName) }}</p>
          <p>{{ $t('Validity period') }}：{{ item.endTime }}</p>
        </div>
        <b></b>
        <a :class="{'canot-use':params.memberCouponStatus !== 'NEW'}" class="c-right" @click="go(item)">
          {{$t('Use now') }}
        </a>
        <i class="circle-top"></i>
        <i class="circle-bottom"></i>
      </li>
    </ul>
    <Page :page-size="params.size" :total="+total"
          class="pageration"
          show-sizer
          show-total
          @on-change="changePageNum"
          @on-page-size-change="changePageSize">
    </Page>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>
import {memberCouponList} from '@/api/member.js';

export default {
  name: 'Coupons',
  data() {
    return {
      statusNameList: [
        this.$t('Unused'),
        this.$t('Used'),
        this.$t('Expired')
      ],
      statusList: ['NEW', 'USED', 'EXPIRE'],
      loading: false,
      params: {
        page: 1,
        size: 10,
        memberCouponStatus: 'NEW'
      },
      total: 0,
      list: []
    };
  },
  methods: {
    getList() {
      this.loading = true
      memberCouponList(this.params)
        .then(res => {
          this.loading = false
          if (res.success) {
            this.list = res.result.records
            this.total = res.result.total
          }
        })
        .finally(() => {

        })
    },

    change(index) {
      this.params.memberCouponStatus = this.statusList[index]
      this.params.page = 1;
      this.getList()
    },

    go(item) {
      if (this.params.memberCouponStatus !== 'NEW') return;

      if (item.storeId !== '0') {
        this.$router.push({path: '/merchant', query: {id: item.storeId}})
      } else {
        if (item.scopeType === 'PORTION_GOODS_CATEGORY') {
          this.$router.push({path: '/goodsList', query: {categoryId: item.scopeId}})
        } else {
          this.$router.push({path: '/goodsList'})
        }
      }
    },

    changePageNum(val) {
      this.params.page = val;
      this.getList()
    },

    changePageSize(val) {
      this.params.page = 1;
      this.params.size = val;
      this.getList()
    },

    useScope(type, storeName) {
      let shop = this.$t('Platform');
      let goods = this.$t('All Products')
      if (storeName !== 'platform') shop = storeName
      switch (type) {
        case 'ALL':
          goods = this.$t('All Products')
          break;
        case 'PORTION_GOODS':
          goods = this.$t('Some products')
          break;
        case 'PORTION_GOODS_CATEGORY':
          goods = this.$t('Partially categorized products')
          break;
      }
      return this.$t('{0} {1} are available', [shop, goods])
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/coupon.scss';

.coupon-item {
  height: 125px;

  .c-left {
    padding: 16px;
  }

  .c-right {
    padding: 20px 16px;
    width: 43px;
    font-size: 14px;
  }

  .canot-use {
    color: #999;
    background-color: #eee;
  }

  i {
    right: 34px;
  }
}

.pageration {
  text-align: right;
}
</style>
