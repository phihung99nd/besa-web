<template>
  <div>
    <div class="page-container">
      <div class="bono-breadcrumb">
        <div class="breadcrumb-container">
          <Breadcrumb>
            <BreadcrumbItem to="/">{{ $t('Home') }}</BreadcrumbItem>
            <BreadcrumbItem>{{ $t('Search') }}</BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      <div class="flex" style="gap: 12px;">
        <Spin size="large" fix v-if="loading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
        <div class="content-left">
          <ColumnFilter ref="sider" :filter="filter" @reset="resetFilter"/>
        </div>
        <div class="content-right">
          <div class="filter-bar">
            <span>Sắp xếp theo</span>
            <Dropdown @on-click="handleChangeOrder">
              <Button style="width: 160px">
                {{ this.sort.price ? `${$t('Price')}: ${this.sort.price == 'DESC' ? $t('High to Low') : $t('Low to High')}` : $t('Price') }}
                <Icon type="md-arrow-dropdown"></Icon>
              </Button>
              <DropdownMenu slot="list" style="width: 160px;">
                <DropdownItem name="DESC">{{ $t('High to Low') }}</DropdownItem>
                <DropdownItem name="ASC">{{ $t('Low to High') }}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <!--region Store-->
          <div class="result-container shop-result"
               v-if="(filter.type == 'ALL' || filter.type == 'store') && !$route.query.shop">
            <div class="section-header">
              <h2>Shop liên quan</h2>
              <!--              <span v-if="searchResult.stores.length > 0"-->
              <!--                    @click="$router.push({name: 'Store list', query: {keyword: $route.query.keyword}})">Thêm kết quả ></span>-->
            </div>
            <template v-if="searchResult.stores.length > 0">
              <div class="section-body">
                <div class="item-card" v-for="(item, index) in searchResult.stores" :key="index"
                     @click="$router.push({name: 'Merchant', query: {id: item.storeId, addressId: item.storeAddress.storeAddressId}})">
                  <div class="card--top">
                    <img :src="parseMinioURL(item.logo)" alt=""/>
                  </div>
                  <div class="card--content">
                    <div class="name">{{ item.name }}</div>
                    <div class="bottom">
                      <div class="distance">
                        {{ item.distance ? `${item.distance.toFixed(1)}km` : '' }}
                      </div>
                      <div class="divider"/>
                      <div class="rating">
                        <span>{{ item.grade ? item.grade.toFixed(1) : 0 }}</span>
                        <Icon type="md-star" color="#fc0"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Page :total="storePaging.total" size="small" class="mt-2 mb-2 text-center"
                    @on-change="changePageNum($event,'store')"
                    :page-size="storePaging.size"
              />
            </template>
            <div v-else class="empty">Không có kết quả</div>
          </div>
          <!--endregion-->
          <!--region Clerk-->
          <div class="result-container clerk-result" v-if="filter.type == 'ALL' || filter.type == 'clerk'">
            <div class="section-header">
              <h2>Chuyên gia</h2>
            </div>
            <template v-if="searchResult.clerks.length > 0">
              <div class="section-body">
                <div class="expert-card" v-for="(item,index) in searchResult.clerks" :key="index"
                     @click="$router.push({name: 'Professor detail', query: {id: item.id}})">
                  <div class="card--rate" v-if="item.grade">
                    <Icon type="md-star" color="#ff9e00"/>
                    <span>{{ item.grade.toFixed(1) }}</span>
                  </div>
                  <img :src="item.avatar || require('@/assets/images/default_avatar.jpg')" alt=""/>
                  <div class="meta-info">
                    <div class="name">{{ item.name }}</div>
                    <div class="field">{{ item.position }}</div>
                    <div class="desc" v-html="item.intro"/>
                  </div>
                  <div class="cover">
                    <button>{{ $t('Book Now') }}</button>
                  </div>
                </div>
              </div>
              <Page :total="clerkPaging.total" size="small" class="mt-2 mb-2 text-center"
                    @on-change="changePageNum($event,'clerk')"
                    :page-size="clerkPaging.size"
              />
            </template>
            <div v-else class="empty">Không có kết quả</div>
          </div>
          <!--endregion-->
          <!--region Service-->
          <div class="result-container service-result" v-if="filter.type == 'ALL' || filter.type == 'service'">
            <div class="section-header">
              <h2>Dịch vụ</h2>
            </div>
            <template v-if="searchResult.services.length > 0">
              <div class="section-body">
                <div class="item-card" v-for="(item, index) in searchResult.services" :key="index"
                     @click="$router.push({name: 'service', query: {id: item.id}})">
                  <div class="card--top">
                    <img :src="parseMinioURL(item.thumbnail)" alt=""/>
                  </div>
                  <div class="card--content">
                    <div class="name">{{ item.name }}</div>
                    <div class="review">
                      <div class="rating">
                        <span>{{ item.grade.toFixed(1) }}</span>
                        <Rate allow-half disabled :value="item.grade"/>
                      </div>
                      <div class="divider"/>
                      <div class="buy-count"><span>{{ item.buyCount }}</span> lượt đặt</div>
                    </div>
                    <div class="price">{{ item.price | unitPrice('₫', 'before') }}</div>
                  </div>
                </div>
              </div>
              <Page :total="servicePaging.total" size="small" class="mt-2 mb-2 text-center"
                    @on-change="changePageNum($event,'service')"
                    :page-size="servicePaging.size"
              />
            </template>
            <div v-else class="empty">Không có kết quả</div>
          </div>
          <!--endregion-->
          <!--region Goods-->
          <div class="result-container goods-result" v-if="filter.type == 'ALL' || filter.type == 'goods'">
            <div class="section-header">
              <h2>Sản phẩm</h2>
            </div>
            <template v-if="searchResult.goods.length > 0">
              <div class="section-body">
                <div class="item-card" v-for="(item, index) in searchResult.goods" :key="index"
                     @click="$router.push({name: 'GoodsDetail', query: {goodsId: item.goodsId, skuId: item.id}})">
                  <div class="card--top">
                    <img :src="parseMinioURL(item.thumbnail)" alt=""/>
                  </div>
                  <div class="card--content">
                    <div class="name">{{ item.name }}</div>
                    <div class="review">
                      <span>{{ item.grade.toFixed(1) }}</span>
                      <Rate allow-half disabled :value="item.grade"/>
                    </div>
                    <div class="price">{{ item.price | unitPrice('₫', 'before') }}</div>
                    <div class="buy-count">Đã mua {{ item.buyCount || 0 }}</div>
                  </div>
                </div>
              </div>
              <Page :total="goodsPaging.total" size="small" class="mt-2 mb-2 text-center"
                    @on-change="changePageNum($event,'goods')"
                    :page-size="goodsPaging.size"
              />
            </template>
            <div v-else class="empty">Không có kết quả</div>
          </div>
          <!--endregion-->
        </div>
      </div>
    </div>
    <Introduce/>
    <BaseFooter/>
  </div>
</template>

<script>
import ColumnFilter from "@/components/nav/ColumnFilter.vue";
import Introduce from "@/components/footer/Introduce.vue";
import {searchStore, searchService, searchGoods, searchClerk} from "@/api/search";
import NavigationBar from "@/pages/index/NavigationBar.vue";
import {mapState} from "vuex";
import {Dropdown, DropdownItem, DropdownMenu} from "view-design";

export default {
  name: "ProductList",
  components: {NavigationBar, Introduce, ColumnFilter, DropdownItem, Dropdown, DropdownMenu},
  data() {
    return {
      searchResult: {
        clerks: [],
        goods: [],
        services: [],
        stores: [],
      },
      goodsPaging: {
        page: 1,
        size: 8,
        total: 0
      },
      servicePaging: {
        page: 1,
        size: 8,
        total: 0
      },
      storePaging: {
        page: 1,
        size: 10,
        total: 0
      },
      clerkPaging: {
        page: 1,
        size: 8,
        total: 0
      },
      filter: {
        type: 'ALL',
        category: [],
        grade: '',
        distance: 'ALL',
        price: ['', ''],
      },
      sort: {
        price: ''
      },
      debounce: null,
      loading: true
    }
  },
  mounted() {
    if (this.$route.query.categoryId) {
      this.filter.category = [this.$route.query.categoryId]
      this.$refs.sider.isExpand[0] = true
    } else {
      this.filter.category = []
    }
    this.$bus.$on('on-search', this.getSearchResult)
  },
  destroyed() {
    this.$bus.$off('on-search', this.getSearchResult)
  },
  watch: {
    filter: {
      handler(val, oldVal) {
        clearTimeout(this.debounce)
        this.debounce = setTimeout(() => {
          this.getSearchResult()
        }, 300)
      },
      deep: true
    },
    sort: {
      handler() {
        this.getSearchResult()
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['currentLocation']),
  },
  methods: {
    getSearchResult() {
      this.resetPaging()
      let handle = []
      this.loading = true
      switch (this.filter.type) {
        case 'ALL':
          handle.push(this.handleSearchClerk(),
            this.handleSearchStore(),
            this.handleSearchService(),
            this.handleSearchGoods())
          break
        case 'store':
          handle.push(this.handleSearchStore())
          break
        case 'clerk':
          handle.push(this.handleSearchClerk())
          break
        case 'service':
          handle.push(this.handleSearchService())
          break
        case 'goods':
          handle.push(this.handleSearchGoods())
          break
      }
      Promise.all(handle).then(() => {
        this.loading = false
      })
    },
    handleSearchClerk() {
      let params = {
        keyword: this.$route.query.keyword,
        categoryId: this.filter.category.join(","),
        page: this.clerkPaging.page - 1,
        size: this.clerkPaging.size,
        storeId: this.$route.query.shop,
      }
      if (this.filter.distance != 'ALL') {
        params['storeAddress.distance'] = this.filter.distance + 'km'
      }
      if (this.filter.grade != '') {
        params['grade.start'] = this.filter.grade
        params['grade.end'] = 5
      }
      params['storeAddress.center'] = `${this.currentLocation.center[1]},${this.currentLocation.center[0]}`
      searchClerk(params).then(res => {
        this.searchResult.clerks = res.content
        this.clerkPaging.total = res.totalElements
      })
    },
    handleSearchStore() {
      let params = {
        keyword: this.$route.query.keyword,
        categoryId: this.filter.category.join(","),
        page: this.storePaging.page - 1,
        size: this.storePaging.size
      }
      if (this.filter.distance != 'ALL') {
        params['storeAddress.distance'] = this.filter.distance + 'km'
      }
      if (this.filter.grade != '') {
        params['grade.start'] = this.filter.grade
        params['grade.end'] = 5
      }
      params['storeAddress.center'] = `${this.currentLocation.center[1]},${this.currentLocation.center[0]}`
      searchStore(params).then(res => {
        this.searchResult.stores = res.content
        this.storePaging.total = res.totalElements
      })
    },
    handleSearchService() {
      let params = {
        keyword: this.$route.query.keyword,
        categoryId: this.filter.category.join(","),
        page: this.servicePaging.page - 1,
        size: this.servicePaging.size,
        storeId: this.$route.query.shop,
        sort: Object.keys(this.sort).map(key => {
          if (this.sort[key]) {
            return `${key},${this.sort[key]}`
          } else return ''
        })
      }
      if (this.filter.distance != 'ALL') {
        params['storeAddress.distance'] = this.filter.distance + 'km'
        params['storeAddress.center'] = `${this.currentLocation.center[1]},${this.currentLocation.center[0]}`
      }
      if (this.filter.type == 'service') {
        params['price.start'] = this.filter.price[0]
        params['price.end'] = this.filter.price[1]
      }
      if (this.filter.grade != '') {
        params['grade.start'] = this.filter.grade
        params['grade.end'] = 5
      }
      searchService(params).then(res => {
        this.searchResult.services = res.content
        this.servicePaging.total = res.totalElements
      })
    },
    handleSearchGoods() {
      let params = {
        keyword: this.$route.query.keyword,
        categoryId: this.filter.category.join(","),
        page: this.goodsPaging.page - 1,
        size: this.goodsPaging.size,
        storeId: this.$route.query.shop,
        sort: Object.keys(this.sort).map(key => {
          if (this.sort[key]) {
            return `${key},${this.sort[key]}`
          } else return ''
        })
      }
      if (this.filter.distance != 'ALL') {
        params['storeAddress.distance'] = this.filter.distance + 'km'
        params['storeAddress.center'] = `${this.currentLocation.center[1]},${this.currentLocation.center[0]}`
      }
      if (this.filter.type == 'goods') {
        params['price.start'] = this.filter.price[0]
        params['price.end'] = this.filter.price[1]
      }
      if (this.filter.grade != '') {
        params['grade.start'] = this.filter.grade
        params['grade.end'] = 5
      }
      searchGoods(params).then(res => {
        this.searchResult.goods = res.content
        this.goodsPaging.total = res.totalElements
      })
    },
    resetPaging() {
      this.clerkPaging = {
        page: 1,
        size: 8,
        total: 0
      }
      this.storePaging = {
        page: 1,
        size: 10,
        total: 0
      }
      this.servicePaging = {
        page: 1,
        size: 8,
        total: 0
      }
      this.goodsPaging = {
        page: 1,
        size: 8,
        total: 0
      }
    },
    changePageNum(e, type) {
      switch (type) {
        case 'clerk':
          this.clerkPaging.page = e
          this.handleSearchClerk()
          break
        case 'store':
          this.storePaging.page = e
          this.handleSearchStore()
          break
        case 'service':
          this.servicePaging.page = e
          this.handleSearchService()
          break
        case 'goods':
          this.goodsPaging.page = e
          this.handleSearchGoods()
          break
      }
    },
    resetFilter() {
      this.filter = {
        type: 'ALL',
        category: [],
        grade: '',
        distance: 'ALL',
        price: ['', '']
      }
    },
    handleChangeOrder(e) {
      this.sort.price = e
    }
  }
}
</script>

<style scoped lang="scss">
.page-container {
  width: 1200px;
  min-width: 1000px;
  position: relative;
  margin: 0 auto 40px;

  .flex {
    margin-top: 10px;
    gap: 10px;
    position: relative;

    .demo-spin-icon-load {
      animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
      from {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .content {
      &-left {
        width: 228px;
        height: fit-content;
        background: #fff;
        border-radius: 12px;
      }

      &-right {
        flex: 1 1;

        .filter-bar {
          display: flex;
          justify-content: end;
          width: 100%;
          height: 52px;
          padding: 10px 20px;
          align-items: center;
          gap: 16px;
          background: #fff;
          border-radius: 12px;
          margin-bottom: 12px;

          > span {
            color: $text_color_black;
            font-size: 14px;
            line-height: 30px;
          }
        }

        .result-container {
          margin-bottom: 20px;

          > .section-header {
            display: flex;
            justify-content: space-between;
            align-items: end;

            > h2 {
              font-size: 20px;
              font-weight: 600;
              color: $text_color_black;
            }

            > span {
              cursor: pointer;

              &:hover {
                color: $accent_color;
              }
            }
          }

          &.clerk-result {
            display: flex;
            gap: 12px;
            flex-direction: column;

            > .section-body {
              width: 100%;
              display: flex;
              flex-flow: row wrap;
              gap: 12px;

              .expert-card {
                width: 231px;
                height: 259px;
                background: #f8f8f8;
                position: relative;
                border-radius: 12px;
                overflow: clip;
                cursor: pointer;

                .card--map {
                  position: absolute;
                  top: 11px;
                  left: 11px;
                  display: flex;
                  justify-content: flex-start;
                  align-items: center;
                  z-index: 2;
                  color: #fff
                }

                .card--rate {
                  position: absolute;
                  top: 11px;
                  right: 11px;
                  color: #fff;
                  z-index: 2;
                }

                &::before {
                  content: "";
                  z-index: 1;
                  position: absolute;
                  width: 100%;
                  height: 20%;
                  top: 0;
                  left: 0;
                  background-image: linear-gradient(0deg, transparent, rgba(0, 0, 0, .2), rgba(0, 0, 0, .4));
                }

                &::after {
                  content: "";
                  z-index: 1;
                  position: absolute;
                  width: 100%;
                  height: 50%;
                  bottom: 0;
                  left: 0;
                  background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .2), rgba(0, 0, 0, .4));
                }

                > img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }

                .meta-info {
                  position: absolute;
                  width: 100%;
                  height: 50%;
                  bottom: 0;
                  left: 0;
                  padding: 12px;
                  display: flex;
                  flex-direction: column;
                  justify-content: end;
                  z-index: 2;

                  > .name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #fff;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  }

                  > .field {
                    font-size: 16px;
                    color: #fff;
                  }

                  > .desc {
                    font-size: 14px;
                    color: #fff;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                  }

                }

                .cover {
                  opacity: 0;
                  transition: opacity $common_transition_duration ease;
                  z-index: 3;
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  > button {
                    height: 44px;
                    width: fit-content;
                    border-radius: 100px;
                    padding: 0 16px;
                    border: none;
                    font-size: 20px;
                    font-weight: 600;
                    color: #f8f8f8;
                    background: rgba($accent_color, 0.9);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                  }
                }

                &:hover {
                  .cover {
                    opacity: 1;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(6px);
                  }
                }
              }
            }
          }

          &.shop-result {
            display: flex;
            gap: 12px;
            padding: 20px;
            flex-direction: column;
            background: #fff;
            border-radius: 12px;

            > .section-header {
              font-size: 20px;
              font-weight: 600;
              color: $text_color_black;
            }

            > .section-body {
              width: 100%;
              display: flex;
              flex-flow: row wrap;
              gap: 12px;

              > .item-card {
                width: 174px;
                height: 250px;
                background: #fff;
                border-radius: 12px;
                border: 1px solid $border_color;
                transition: box-shadow $common_transition_duration ease-in-out;
                padding: 8px;
                display: flex;
                flex-direction: column;
                cursor: pointer;

                &:hover {
                  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
                }

                > .card--top {
                  width: 100%;
                  height: 164px;
                  border-radius: 4px;
                  overflow: clip;

                  > img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }

                > .card--content {
                  flex: 1 1;
                  padding-top: 8px;
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                  position: relative;

                  .name {
                    font-size: 14px;
                    line-height: 18px;
                    height: 36px;
                    white-space: normal;
                    overflow: hidden;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    font-weight: 500;
                    color: $text_color_black;
                  }

                  .bottom {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #666;

                    .rating {
                      font-size: 13px;
                    }

                    .divider {
                      width: 0;
                      height: 20px;
                      border-left: 1px solid $border_color;
                    }

                    .distance {
                      font-size: 13px;
                    }
                  }
                }
              }
            }
          }

          &.service-result {
            display: flex;
            gap: 12px;
            flex-direction: column;

            > .section-body {
              width: 100%;
              display: flex;
              flex-flow: row wrap;
              gap: 10px;

              > .item-card {
                width: 232px;
                height: 300px;
                background: #fff;
                border-radius: 8px;
                transition: box-shadow $common_transition_duration ease-in-out;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                overflow: clip;

                &:hover {
                  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
                }

                > .card--top {
                  width: 100%;
                  height: 50%;

                  > img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }

                > .card--content {
                  flex: 1 1;
                  padding: 8px;
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                  position: relative;

                  .name {
                    font-size: 16px;
                    font-weight: 400;
                    line-height: 24px;
                    height: 48px;
                    white-space: normal;
                    overflow: hidden;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                  }

                  .review {
                    display: flex;
                    gap: 10px;

                    .rating {
                      span {
                        margin-right: 4px;
                        text-decoration: underline;
                        color: $accent_color_shade;
                        font-size: 14px;
                      }

                      .ivu-rate {
                        font-size: 14px;
                      }

                      /deep/ .ivu-rate-star {
                        margin-right: 2px;
                      }
                    }

                    .divider {
                      width: 0;
                      height: 20px;
                      border-left: 1px solid $border_color;
                    }

                    .buy-count {
                      font-size: 14px;

                      > span {
                        color: $accent_color_shade;
                      }
                    }
                  }

                  .price {
                    font-size: 20px;
                    font-weight: 600;
                    color: $red_color;
                  }
                }
              }
            }
          }

          &.goods-result {
            display: flex;
            gap: 12px;
            flex-direction: column;

            > .section-body {
              width: 100%;
              display: flex;
              flex-flow: row wrap;
              gap: 10px;

              > .item-card {
                width: 184px;
                height: 250px;
                background: #fff;
                border-radius: 8px;
                transition: box-shadow $common_transition_duration ease-in-out;
                padding: 8px;
                display: flex;
                flex-direction: column;
                cursor: pointer;

                &:hover {
                  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
                }

                > .card--top {
                  width: 100%;
                  height: 50%;
                  border-radius: 4px;
                  overflow: clip;

                  > img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }

                > .card--content {
                  flex: 1 1;
                  padding-top: 6px;
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                  position: relative;

                  .name {
                    font-size: 12px;
                    line-height: 16px;
                    height: 32px;
                    white-space: normal;
                    overflow: hidden;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                  }

                  .tag {
                    display: flex;
                    gap: 4px;
                    height: 16px;

                    img {
                      height: 100%;
                    }
                  }

                  .review {

                    span {
                      margin-right: 4px;
                      text-decoration: underline;
                      color: $accent_color_shade;
                      font-size: 12px;
                    }

                    .ivu-rate {
                      font-size: 12px;
                    }

                    /deep/ .ivu-rate-star {
                      margin-right: 2px;
                    }
                  }

                  .price {
                    font-size: 18px;
                    font-weight: 600;
                    color: $accent_color;
                  }

                  .buy-count {
                    color: #888;
                    font-size: 12px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
