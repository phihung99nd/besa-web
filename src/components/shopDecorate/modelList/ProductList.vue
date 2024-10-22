<template>
  <div :id="id" class="product-list">
    <div class="promotion-decorate">{{ productType == 'service' ? $t('Service') : $t('Goods') }}</div>
    <div class="content">
      <div class="menu">
        <Menu active-name="all" theme="light" width="200" @on-select="changeMenu">
          <MenuItem name="all">
            {{ $t('All') }}
          </MenuItem>
          <MenuItem v-for="(menu, index) in menuList" :key="menu.id"
                    :name="menu.id"
          >
            {{ menu.labelName }}
          </MenuItem>
        </Menu>
      </div>
      <div class="left">
        <div class="filter">
          <Button :class="{selected: productType === 'service'}" icon="ios-bookmarks" shape="circle" size="large"
                  @click="changeProductType('service')">{{ $t('Service') }}
          </Button>
          <Button :class="{selected: productType === 'goods'}" icon="ios-archive" shape="circle" size="large"
                  @click="changeProductType('goods')">{{ $t('Goods') }}
          </Button>
        </div>
        <div class="goods-list">
          <product-card v-for="(item, index) in goodsList" :key="item.id" :item="item"
                        @click="goDetail(item)"/>
        </div>
      </div>
    </div>
    <div class="goods-page">
      <Page
        :page-size="params.size"
        :total="+total"
        show-sizer
        @on-change="changePageNum"
        @on-page-size-change="changePageSize"
      ></Page>
    </div>

  </div>
</template>

<script>
import ProductCard from "@/components/productCard";
import {getGoodsList, getShopGoodsLabelList} from "@/api/goods";
import {getServicesList} from "@/api/services";
import {searchGoods, searchService} from "../../../api/search";

export default {
  name: "ProductList",
  components: {
    ProductCard
  },
  props: ['id'],
  data() {
    return {
      goodsList: [],
      menuList: [],
      currentMenu: '',
      productType: 'service',
      params: {
        page: 1,
        size: 20,
        storeId: this.$route.query.id,
      },
      total: 0,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      Promise.allSettled([this.getProductList(), this.getMenuList()])
    },
    getProductList() {
      const params = {
        ...this.params,
        page: this.params.page - 1,
        storeId: this.$route.query.id,
        // storeAddressId: this.$route.query.addressId,
        storeCategoryId: this.currentMenu
      }
      if (this.productType === 'goods') {
        searchGoods(params)
          .then(res => {
            this.goodsList = res.content
            this.total = res.totalElements
          })
      } else if (this.productType === 'service') {
        searchService(params)
          .then(res => {
            this.goodsList = res.content
            this.total = res.totalElements
          })
          .catch(err => {
            this.$Message.error(err)
          })
      }
    },
    getMenuList() {
      const shopId = this.$route.query.id
      getShopGoodsLabelList(shopId).then(res => {
        this.menuList = res.result
      })
    },
    goDetail(item) {
      let routeUrl
      if (item.type === 'goods') {
        routeUrl = this.$router.resolve({
          path: "/goodsDetail",
          query: {goodsId: item.goodsId, skuId: item.id},
        });
      } else if (item.type === 'service') {
        routeUrl = this.$router.resolve({
          path: "/service",
          query: {id: item.id},
        });
      }
      window.open(routeUrl.href, "_self");
    },
    changeMenu(menu) {
      if (menu == 'all') this.currentMenu = ""
      else this.currentMenu = menu;
      this.params.page = 1;
      this.params.size = 20;
      this.getProductList()
    },
    changeProductType(type) {
      if (this.productType === type) {
        this.productType = ''
      } else {
        this.productType = type
      }
      this.getProductList()
    },

    changePageNum(val) {
      this.params.page = val;
      this.getProductList();
    },
    changePageSize(val) {
      this.params.page = 1;
      this.params.size = val;
      this.getProductList();
    },
  }
}
</script>

<style lang="scss" scoped>
.text-danger {
  color: $theme_color;
}

.seckill-price {
  margin-right: 5px;
  font-size: 20px;
  font-weight: bold;
}

.goods-list {
  display: flex;
  flex-wrap: wrap;
  width: 1000px;
  margin: 0 auto;
}

.product-list {
  background: #fff;
  padding-top: 30px;

  .promotion-decorate {
    width: 100%;
    text-align: center;
    font-weight: 700;
    font-size: 24px;
    margin: 0;
  }

  .content {
    display: flex;
    flex-direction: row;

    .menu {
      width: 200px;

      /deep/ .ivu-menu {
        height: 100%;
        z-index: 1;
      }

      /deep/ .ivu-menu-light {
        background-color: transparent;
      }
    }

    .left {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .filter {
        width: 100%;
        height: 50px;
        padding: 10px 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;

        button {
          margin-right: 5px;

          &:hover {
            color: $accent_color;
            border-color: $accent_color;
          }

          &.selected.ivu-btn {
            color: $accent_color;
            border-color: $accent_color;

            &:focus {
              box-shadow: 0 0 0 2px rgba(247, 101, 163, 0.2);
            }
          }
        }
      }
    }
  }
}
</style>
