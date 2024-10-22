<template>
  <div class="coupon-center">
    <BaseHeader></BaseHeader>
    <div class="content">
      <div>
        <div class="coupon-title">
          <router-link to="/">
            <img src="../assets/images/logo/logo.png" width="120" alt="">
          </router-link>
          <p>{{ $t('Coupon center') }}</p>
          <Input search style="width:400px" @on-search='search' :enter-button="$t('Search')"/>
        </div>

        <div class="fontsize_18 recommend">{{$t('Recommend coupons')}}</div>

        <empty v-if="list.length===0" />
        <ul class="coupon-list" v-else>
          <li v-for="(item, index) in list" class="coupon-item" :key="index">
            <div class="c-left">
              <div>
                <span v-if="item.couponType === 'PRICE'" class="fontsize_12 global_color">đ<span class="price">{{item.price | unitPrice}}</span></span>
                <span v-if="item.couponType === 'DISCOUNT'" class="fontsize_12 global_color"><span class="price">{{item.couponDiscount}}</span></span>
                <span class="describe">{{ $t('{0} available', [item.consumeThreshold]) }}</span>
              </div>
              <p>{{ $t('Scope of use') }}：{{useScope(item.scopeType, item.storeName)}}</p>
              <p>{{ $t('Validity period') }}：{{item.endTime}}</p>
            </div>
            <b></b>
            <a class="c-right" @click="receive(item)">{{$t('Get now')}}</a>
            <i class="circle-top"></i>
            <i class="circle-bottom"></i>
          </li>
        </ul>
        <Page :total="+total" @on-change="changePageNum"
          class="pageration"
          @on-page-size-change="changePageSize"
          :page-size="params.size"
          show-total
          show-sizer>
        </Page>
      </div>
    </div>
    <BaseFooter></BaseFooter>
  </div>
</template>
<script>
import {couponList, receiveCoupon} from '@/api/member.js'
export default {
  data () {
    return {
      list: [], // 优惠券列表
      total: 0, // 优惠券总数
      params: { // 请求参数
        getType: 'FREE',
        page: 1,
        size: 20
      }
    }
  },
  methods: {
    // 搜索优惠券
    search (item) {
      this.params.couponName = item
      this.params.page = 1
      this.getList()
    },
    // 获取优惠券列表
    getList () {
      this.$Spin.show()
      couponList(this.params).then(res => {
        this.$Spin.hide()
        this.loading = false
        if (res.success) {
          this.list = res.result.records
          this.total = res.result.total
        }
      }).catch(() => { this.$Spin.hide() })
    },
    // 分页 改变页码
    changePageNum (val) {
      this.params.page = val;
      this.getList()
    },
    // 分页 改变每页数
    changePageSize (val) {
      this.params.page = 1;
      this.params.size = val;
      this.getList()
    },
    // 领取优惠券
    receive (item) {
      receiveCoupon(item.id).then(res => {
        if (res.success) {
          this.$Modal.confirm({
            title: this.$t('Receive coupon'),
            content: `<p>${this.$t('The coupon has been received successfully, you can check it on my coupon page')}</p>`,
            okText: this.$t('Coupons'),
            cancelText: this.$t('Use now'),
            closable: true,
            onOk: () => {
              this.$router.push('/home/Coupons')
            },
            onCancel: () => {
              if (item.storeId !== '0') {
                this.$router.push({path: '/merchant', query: {id: item.storeId}})
              } else {
                if (item.scopeType === 'PORTION_GOODS_CATEGORY') {
                  this.$router.push({path: '/goodsList', query: {categoryId: item.scopeId}})
                } else {
                  this.$router.push({path: '/goodsList'})
                }
              }
            }
          });
        }
      })
    },
    // 优惠券可用范围
    useScope (type, storeName) {
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
  mounted () {
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
  @import '../assets/styles/coupon.scss';
  .content{
    width: 100%;
    background-color: #fff;

    > div {
      margin: 10px auto;
      width: 1200px;
    }
  }
  .coupon-title {
    display: flex;
    align-items: center;

    p{
      font-size: 18px;
      margin-right: 500px;
    }
    border-bottom: 2px solid $theme_color;
  }
  .recommend {
    margin: 20px auto;
    font-weight: bold;
    width: 200px;
    text-align: center;
  }
  .coupon-item {
    b{
      background: url('../assets/images/small-circle.png') top left repeat-y;
    }
  }
  .pageration {
    text-align: right;
    padding-bottom: 10px;
  }
</style>
