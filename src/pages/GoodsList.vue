<template>
  <div>
    <div class="container">
<!--      <GoodsClassNav @getParams="getParams"></GoodsClassNav>-->
      <div class="goods-box">
        <div class="goods-list-box">
          <div class="goods-list-tool">
            <ul>
              <li
                v-for="(item, index) in goodsTool"
                :key="index"
                @click="orderBy(item.en, index)"
              >
                <span :class="{ 'goods-list-tool-active': index === sortIndex }"
                >{{ item.title }}<Icon type="ios-arrow-round-down"
                /></span>
              </li>
              <li class="price-sort" @click="orderBy('price', 5, 'up')">
                <span :class="{ 'goods-list-tool-active': 5 === sortIndex }">
                  {{ $t('price') }}
                    <Icon
                      v-if="sortPriceIndex === 'desc'"
                      :class="{ 'price-color': sortPriceIndex === 'desc' }"
                      type="md-arrow-dropup"
                    />
                    <Icon
                      v-if="sortPriceIndex === 'asc'"
                      :class="{ 'price-color': sortPriceIndex === 'asc' }"
                      type="md-arrow-dropdown"
                    />
                </span>
              </li>
            </ul>
          </div>
          <div class="goods-list">
            <empty v-if="goodsList.length === 0"/>
            <div v-else class="card">
              <product-card
                v-for="(item, index) in goodsList"
                :key="index"
                :item="item"
                @click="goGoodsDetail(item)"
              >
              </product-card>
            </div>
          </div>
        </div>
      </div>
      <div class="goods-page">
        <Page
          :page-size="params.size"
          :total="total"
          show-sizer
          show-total
          @on-change="changePageNum"
          @on-page-size-change="changePageSize"
        ></Page>
      </div>
    </div>
    <Spin v-if="loading" fix size="large"></Spin>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import * as apiGoods from "@/api/goods";
import GoodsClassNav from "@/components/nav/GoodsClassNav";
import ProductCard from "@/components/productCard";

export default {
  name: "GoodsList",
  components: {
    ProductCard,
    GoodsClassNav,
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  data() {
    return {
      sortIndex: 0,
      sortPriceIndex: false,
      goodsTool: [],
      goodsList: [],
      loading: false,
      goodsListType: "",
      total: 0,
      params: {
        goodsId: '',
        name: '',
        id: '',
        storeId: '',
        storeName: '',
        price: '',
        categoryPath: '',
        storeCategoryPath: '',
        selfOperated: '',
        marketEnable: '',
        authFlag: '',
        leQuantity: '',
        geQuantity: '',
        recommend: '',
        goodsType: '',
        salesModel: '',
        page: 1,
        size: 20,
        collapse: true
      },
    };
  },
  watch: {
    $route() {
      const name = this.$route.query.keyword;
      this.handleSearch(name);
      if (this.$route.query.categoryId) {
        let cateId = this.$route.query.categoryId.split(",");
        Object.assign(this.params, this.$route.query);
        this.params.categoryPath = cateId[cateId.length - 1];
        this.getGoodsList();
      }
    },
  },
  created() {
    if (this.$route.query.categoryId) {
      console.log(this.$route.query)
      let cateId = this.$route.query.categoryId.split(",");
      Object.assign(this.params, {name: this.$route.query.keyword});
      this.params.categoryPath = cateId[cateId.length - 1];
    } else {
      Object.assign(this.params, {name: this.$route.query.keyword});
    }
    this.getGoodsList();
  },
  methods: {
    handleSearch(key) {
      this.params.name = key;
      this.params.page = 0;
      this.getGoodsList();
    },
    orderBy(data, index) {
      this.sortIndex = index;
      this.params.sort = data;
      this.params.order = "desc";
      if (data === "price") {
        if (!this.sortPriceIndex) {
          this.sortPriceIndex = "asc";
        } else {
          this.sortPriceIndex === "desc"
            ? (this.sortPriceIndex = "asc")
            : (this.sortPriceIndex = "desc");
        }
        this.params.order = this.sortPriceIndex;
      } else {
        this.sortPriceIndex = false;
      }
      this.getGoodsList();
    },

    goGoodsDetail(goods) {
      console.log(goods, "gID")
      if (goods.goodsType === "PHYSICAL_GOODS") {
        this.$router.push({
          path: `/goodsDetail?skuId=${undefined}`,
          query: {
            goodsId: goods.id
          },

        });
      } else {
        let routeUrl = this.$router.resolve({
          path: "/service",
          query: {id: goods.id},
        });
        window.open(routeUrl.href, "_self");
      }
    },

    changePageNum(val) {
      this.params.page = val;
      this.getGoodsList();
    },

    changePageSize(val) {
      this.params.page = 1;
      this.params.size = val;
      this.getGoodsList();
    },

    getGoodsList() {
      this.loading = true;
      console.log(this.params)
      const params = {
        ...this.params,
        page: this.params.page - 1
      }
      apiGoods.goodsList(params)
        .then((res) => {
          this.loading = false;
          if (res.success) {
            this.goodsList = res.result.content;
            this.total = res.result.totalElements;
            for (let i = 0; i < this.goodsList.length; i++) {
              this.goodsListType = this.goodsList[i];
            }
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getParams(val) {
      Object.assign(this.params, val);
      this.getGoodsList();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/goodsList.scss";

.goods-show-info > .goods-show-seller > .goods-show-buyer {
  width: 35px;
  height: 17px;
  white-space: nowrap;
  line-height: 17px;
  text-align: center;
  align-content: center;
  padding: 0 3px;
  background-color: #e23a3a;
}

.goods-show-tag {
  height: 18px;
  width: fit-content;
  line-height: 14px;
  white-space: nowrap;
  text-align: center;
  align-items: center;
  padding: 0 3px;
}

.goods-show-seller {
  // padding:3px 0;
  vertical-align: middle;
}

.container {
  margin: 15px auto;
  width: 1200px;
  min-width: 1000px;
  position: relative;
}

.price-sort:hover {
  color: $accent_color;
}

.goods-box {
  display: flex;
}

/* ---------------侧边广告栏开始------------------- */
.as-box {
  width: 200px;
  border: 1px solid #ccc;
}

.goods-show-right {
  display: flex;
  flex-direction: row;
  margin-top: 5px;
}


.goods-show-self {
  float: left;
  height: 16px;
  line-height: 16px;
  padding: 0 3px;
  margin-right: 3px;
  overflow: hidden;
  text-align: center;
  font-style: normal;
  font-size: 14px;
  background: #e23a3a;
  color: #fff;
  border-radius: 2px;
}

.goods-show-middle {
  float: left;
  height: 16px;
  line-height: 16px;
  padding: 0 3px;
  margin-right: 3px;
  overflow: hidden;
  text-align: center;
  font-style: normal;
  font-size: 14px;
  border: 1px solid rgba(112, 123, 187, 0.8);
  color: rgba(112, 123, 187, 0.8);
}

// .goods-show-middle:hover {
//   color: rgba(2, 15, 88, 0.6);
//   border: 0.2px solid rgba(0, 13, 87, 0.6);
//   border-radius: 4px;
//   line-height: 18px;
// }

.item-as-title {
  width: 100%;
  height: 36px;
  color: $accent_color;
  line-height: 36px;
  font-size: 18px;
}

.item-as-title span:first-child {
  margin-left: 20px;
}

.item-as-title span:last-child {
  float: right;
  margin-right: 15px;
  font-size: 10px;
  color: rgb(204, 204, 204);
}

.item-as {
  width: 160px;
  margin: 18px auto;
}

.item-as-img {
  width: 160px;
  height: 160px;
  margin: 0px auto;
}

.item-as-price span {
  font-size: 18px;
}

.item-as-intro {
  margin-top: 5px;
  font-size: 14px;
}

.item-as-selled {
  margin-top: 5px;
  font-size: 14px;
}

.item-as-selled span {
  color: #005aa0;
}

/* ---------------侧边广告栏结束------------------- */

/* ---------------商品栏开始------------------- */
.goods-list-box {
  position: relative;
  width: 100%;
  // margin-left: 15px;
  // width: calc(100% - 215px);
}

.goods-list-tool {
  width: 100%;
  height: 38px;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}

.goods-list-tool ul {
  padding-left: 15px;
  font-size: 14px;
  margin-top: 10px;

  &::after {
    content: "";
    display: block;
    clear: left;
  }

  .price-sort {
    span {
      display: flex;
      align-items: center;
      width: 50px;
      height: 22px;
      position: relative;
      line-height: 15px;
      top: -2px;
      left: 0;
    }

    span > div {
      display: inline-block;

      .ivu-icon {
        font-size: 14px;
        position: absolute;

        &:nth-child(1) {
          top: 1px;
        }

        &:nth-child(2) {
          top: 7px;
        }
      }

      .price-color {
        color: #b3b3b3;
      }
    }
  }
}

.goods-list-tool li {
  cursor: pointer;
  float: left;
}

.goods-list-tool span {
  padding: 3px 5px;
  border: 1px solid #ccc;
  margin-left: -1px;
  background-color: #fff;
}

.goods-list-tool span:hover {
  border-color: $accent_color;
  position: relative;
  text-decoration: none;
  z-index: 1;
}

.goods-list-tool .ivu-icon {
  font-weight: bold;
  font-size: 16px;
}

.goods-list-tool-active {
  color: #fff;
  border-left: 1px solid #ccc;
  background-color: $accent_color !important;
}

.goods-list {
  .card {
    display: flex;
    flex-wrap: wrap;
    width: 1200px;
    margin: 0 auto;
  }
}
</style>
