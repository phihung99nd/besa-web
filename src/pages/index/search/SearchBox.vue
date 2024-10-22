<template>
  <div id="search-box_popup" ref="popup">
    <div style="min-height: 100px; height: fit-content; max-height: 500px; overflow-y: scroll; padding: 10px;" id="empty-key" v-if="!searchKey">
      <div style="overflow: visible">
        <div class="search-box_top flex flex-column gap-2">
          <div v-if="historySearchList.length">
            <div class="flex justify-content-between align-item-center">
              <p class="select-title">{{ $t('Lịch sử tìm kiếm') }}</p>
              <Tooltip :content="$t('Clear history')" class="hover-pointer">
                <div @click="handleRemoveHistorySearch">
                  <Iconify icon="bi:trash"/>
                </div>
              </Tooltip>
            </div>
            <!--PROB: tại sao lại flex với chỉ 1 child duy nhất -->
            <div class="select-main flex">
              <div class="select-content">
              <span v-for="(item, index) in historySearchList" class="select-btn" :key="index"
                    @click="handleClickHotSearch(item)">{{ item }}</span>
              </div>
            </div>
          </div>
          <div class="mb_20" v-if="hotWordsList.length > 0">
            <p class="select-title">{{ $t('Hot search') }}</p>
            <div class="select-main flex">
              <div class="select-content">
                <span v-for="(item, index) in hotWordsList" :key="index" class="select-btn"
                      @click="handleClickHotSearch(item)">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="search-box-bottom flex justify-content-between">
          <div class="search-hot-service" v-if="hotService.length > 0">
            <h4 class="mb_10">{{ $t('Hot service') }}</h4>
            <div v-for="(item, index ) in hotService" :key="index" class="hot-search-item flex"
                 @click="handleServiceSearch(item)">
              <div class="item-left">
                <img :src="parseMinioURL(item.thumbnail)" alt="">
              </div>
              <div class="item-right ml_10">
                <p class="item-title"> {{ item.name }}</p>
                <div class="flex justify-content-between">
                  <ul class="flex review">
                    <li class="rating">
                      <span>{{ item.grade ? item.grade.toFixed(1) : "" }}</span>
                      <Rate allow-half disabled :value="item.grade" style="font-size: 10px"/>
                    </li>
                    <li class="booking-num">
                      <span>{{ item.buyCount || 0 }}</span>
                      lượt đặt
                    </li>
                  </ul>
                  <!--                <b class="global_color item-price">{{ item.price | unitPrice("₫",  "before") }}</b>-->
                </div>
              </div>
            </div>
          </div>
          <div class="search-hot-professor" v-if="hotProfessor.length > 0">
            <h4 class="mb_10">{{ $t('Hot professor') }}</h4>
            <div v-for="(item, index ) in hotProfessor" :key="index" class="hot-search-item flex"
                 @click="handleProfSearch(item)">
              <div class="item-left">
                <img :src="item.avatar" alt="">
              </div>
              <div class="item-right ml_10">
                <p class="item-title"> {{ item.name }}</p>
                <div class="flex justify-content-between">
                  <ul class="flex review">
                    <li class="rating">
                      <span>{{ item.grade ? item.grade.toFixed(1) : "" }}</span>
                      <Rate allow-half disabled :value="item.grade" style="font-size: 10px"/>
                    </li>
                    <li class="booking-num">
                      <span>{{ item.commentNum || 0 }}</span>
                      đánh giá
                    </li>
                  </ul>
                  <!--                <b class="global_color item-price">{{ item.price | unitPrice("₫",  "before") }}</b>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt_10" v-if="hotGoods.length > 0">
          <p class="search-title">{{ $t('Sản phẩm') }}</p>
          <div class="search-goods flex">
            <div class="goods-item" v-for="(item , index ) in hotGoods" :key="index"
                 @click="handleGoodsSearch(item.id)">
              <img :src="parseMinioURL(item.thumbnail)" alt="">
              <div>
                <span class="goods-des">{{ item.name }}</span>
                <span class="red_color fontsize_12">{{ item.price | unitPrice("₫",  "before") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="max-height: 500px; overflow-y: scroll;" id="have-key" v-else>
      <template v-if="phraseSearch.length > 0">
        <div class="phrase-item autocomplete-item" v-for="(item, index) in phraseSearch" :key="index"
             @click="handlePhraseSearch(item)">
          <div class="search-icon">
            <Icon type="md-search" size="28"/>
          </div>
          <span>{{ item }}</span>
        </div>
      </template>
      <template v-if="clerkSearch.length > 0">
        <div class="group-title">Chuyên gia</div>
        <div class="clerk-item autocomplete-item" v-for="(item, index) in clerkSearch" :key="index"
             @click="handleProfSearch(item)">
          <div class="search-icon">
            <Icon type="md-search" size="28"/>
          </div>
          <span>{{ item.name }}</span>
        </div>
      </template>
      <template v-if="storeSearch.length > 0">
        <div class="group-title">Cửa hàng</div>
        <div class="store-item autocomplete-item" v-for="(item, index) in storeSearch" :key="index+phraseSearch.length"
             @click="handleStoreSearch(item)">
          <div class="search-icon">
            <img :src="item.logo"/>
          </div>
          <span>{{ item.name }}</span>
        </div>
      </template>
      <template v-if="serviceSearch.length > 0">
        <div class="group-title">Dịch vụ</div>
        <div class="service-item autocomplete-item" v-for="(item, index) in serviceSearch"
             :key="index+phraseSearch.length+storeSearch.length"
             @click="handleServiceSearch(item)">
          <div class="search-icon">
            <img :src="item.thumbnail"/>
          </div>
          <span>{{ item.name }}</span>
        </div>
      </template>
      <template v-if="goodsSearch.length > 0">
        <div class="group-title">Sản phẩm</div>
        <div class="goods-item autocomplete-item" v-for="(item, index) in goodsSearch"
             :key="index+phraseSearch.length+storeSearch.length+serviceSearch.length"
             @click="handleGoodsSearch('', item.id)">
          <div class="search-icon">
            <img :src="item.thumbnail"/>
          </div>
          <span>{{ item.name }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {hotWords} from "@/api/goods";
import {mapMutations, mapState} from "vuex";
import {getRecommendedClerk, getRecommendedGoods, getRecommendedService} from "@/api/recommended";
import {autocompleteSearch} from "@/api";

export default {
  name: "SearchBox",
  props: ['searchKey', 'shopId'],
  data() {
    return {
      hotService: [],
      hotProfessor: [],
      hotGoods: [],
      searchResult: [],
      debounce: null
    }
  },
  created() {
    const reloadTime = localStorage.getItem('hotSearchReloadTime')
    const time = new Date().getTime() - 0.5 * 60 * 1000 // m(phút) * s(giây) * 1000: số mili giây chu kì gọi API lấy hot search mới
    if (!reloadTime || (reloadTime && reloadTime < time)) {
      this.handleGetHotSearch()
      localStorage.setItem('hotSearchReloadTime', new Date().getTime())
    }
    this.initRecommendedItem()
    if (this.searchKey) {
      autocompleteSearch({keyword: this.searchKey, storeId: this.shopId}).then(res => {
        this.searchResult = res
      })
    }
    this.$forceUpdate()
  },
  watch: {
    searchKey: {
      handler(val) {
        if (val == "") return
        clearTimeout(this.debounce)
        this.debounce = setTimeout(() => {
          autocompleteSearch({keyword: val, storeId: this.shopId}).then(res => {
            this.searchResult = res
          })
        }, 300)
      }
    }
  },
  computed: {
    ...mapState(['hotWordsList', 'historySearchList']),
    historySearch() {
      return JSON.parse(localStorage.getItem('historySearch')) ? JSON.parse(localStorage.getItem('historySearch')).reverse() : []
    },
    storeSearch() {
      return this.searchResult.store || []
    },
    serviceSearch() {
      return this.searchResult.service || []
    },
    goodsSearch() {
      return this.searchResult.goods || []
    },
    phraseSearch() {
      return this.searchResult.phrase || []
    },
    clerkSearch() {
      return this.searchResult.clerk || []
    },
  },
  methods: {
    ...mapMutations(['SET_HOTWORDS','SET_HISTORY_SEARCH_LIST']),
    initRecommendedItem() {
      Promise.all([
        this.handleInitRecommendedClerkList(),
        this.handleInitRecommendedGoodsList(),
        this.handleInitRecommendedServiceList()
      ]).then(res => {
        let [clerkRes, goodsRes, serviceRes] = res
        this.hotProfessor = clerkRes.result.slice(0, 6)
        this.hotGoods = goodsRes.result.slice(0, 6)
        this.hotService = serviceRes.result.slice(0, 6)
      })
    },
    handleInitRecommendedServiceList() {
      return getRecommendedService()
    },
    handleInitRecommendedClerkList() {
      return getRecommendedClerk()
    },
    handleInitRecommendedGoodsList() {
      return getRecommendedGoods()
    },
    handleRemoveHistorySearch() {
      this.SET_HISTORY_SEARCH_LIST([])
      // localStorage.setItem('historySearch', JSON.stringify([]))
    },
    handleGetHotSearch() {
      hotWords({limit: 5}).then(res => {
        this.SET_HOTWORDS(res)
      })
    },
    handleClickHotSearch(keyword) {
      this.$parent.isShow = false
      this.$parent.searchKey = keyword
      this.$emit('hot-search')
    },
    handlePhraseSearch(keyword) {
      this.$parent.isShow = false
      this.$parent.searchKey = keyword
      // this.$router.push({name: 'Search result', query: {keyword}})
    },
    handleServiceSearch(item) {
      this.$router.push({name: 'service', query: {id: item.id}})
      this.$parent.isShow = false
    },
    handleProfSearch(item) {
      this.$router.push({name: 'Professor detail', query: {id: item.id}})
      this.$parent.isShow = false
    },
    handleGoodsSearch(goodsId, skuId) {
      this.$router.push({name: 'GoodsDetail', query: {goodsId, skuId}})
      this.$parent.isShow = false
    },
    handleStoreSearch(item) {
      this.$router.push(
        {name: 'Merchant', query: {id: item.storeId,
            addressId: item.storeAddress.storeAddressId
        }})
      this.$parent.isShow = false
    },
  },
}
</script>

<style lang="scss" scoped>
#search-box_popup {
  background-color: #fff;
  border-radius: 12px;
  -webkit-box-shadow: 0 6px 20px rgba(0, 0, 0, .08);
  box-shadow: 0 6px 20px rgba(0, 0, 0, .08);
  left: 0;
  position: absolute;
  top: 50px;
  padding: 10px;
  width: 720px;

  .search-box_top {
    max-height: 540px;
    min-height: 100px;
    overflow-y: auto;
    overscroll-behavior: contain;
    position: relative;

    .select-main {

      .select-content {
        font-size: 0;
        overflow: hidden;
        -webkit-transition: max-height .3s;
        transition: max-height .3s;
        width: 728px;

        .select-btn {
          max-height: 46px;
          background: #f5f5f5;
          border-radius: 99rem;
          display: inline-block;
          font-size: 14px;
          font-weight: 400;
          //height: 36px;
          //line-height: 1.5;
          margin: 5px 10px 5px 0;
          max-width: 310px;
          overflow: hidden;
          padding: 4px 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;

          &:hover {
            background: #eee;
            cursor: pointer;
          }
        }


      }
    }

    .select-title {
      color: $light_title_color;
      font-size: 16px;
      font-weight: 600;
      line-height: 1.5;
    }
  }
}

.search-title {
  color: $light_title_color;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
}

.search-hot-service, .search-hot-professor {
  display: flex;
  flex-direction: column;
  border: 1px solid $border_color;
  border-radius: 12px;
  height: 100%;
  padding: 20px 12px;
  width: 320px;
  background-size: contain;
  background: linear-gradient(0deg, rgba(2, 0, 36, 0) 0%, rgba(230, 138, 4, 0) 90%, rgba(255, 153, 0, 0.303046218487395) 105%) no-repeat;

  .hot-search-item {
    margin-bottom: 6px;
    cursor: pointer;

    .item-left {
      img {
        width: 56px;
        height: 56px;
        object-fit: cover;
        border-radius: 6px;
      }
    }

    .item-right {
      flex: 1;

      .item-title {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        color: $light_title_color;
        display: -webkit-box;
        font-size: 13px;
        font-weight: 500;
        line-height: 1.5;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }

      .review {
        list-style: none;
        align-items: center;

        .rating {
          padding-right: 10px;
          margin-right: 10px;
          border-right: 1px solid $border_color;

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

        .booking-num {
          font-size: 12px;

          > span {
            margin-right: 4px;
            text-decoration: underline;
            color: $accent_color_shade;
          }
        }
      }

      .item-price {
        text-align: end;
      }
    }
  }
}

.search-goods {
  gap: 10px;

  .goods-item {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid $border_color;
    padding: 6px;
    width: 200px;
    cursor: pointer;
    transition: all $common_transition_duration ease-in-out;

    &:hover {
      box-shadow: rgba(0, 0, 0, 0.1) 0 3px 8px;
    }

    img {
      border-radius: 4px;
      width: 90px;
      height: 90px;
      object-fit: cover;
    }

    .goods-des {
      font-size: 10px;
      line-height: 16px;
      line-clamp: 2;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

@mixin search-icon() {
  .search-icon {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    i, svg {
      color: $accent_color;
    }

    img {
      width: 30px;
      height: 30px;
      object-fit: cover;
      border-radius: 4px;
    }
  }
}

.group-title {
  font-weight: 600;
  font-size: 16px;
  color: #888888;
  margin-top: 10px;
}

.autocomplete-item {
  width: 100%;
  height: 40px;
  border-radius: 6px;
  transition: background $common_transition_duration ease-in-out;
  cursor: pointer;

  &:hover {
    background: #eee;
  }

  &.phrase-item {
    display: flex;
    align-items: center;
    @include search-icon;
  }

  &.clerk-item {
    display: flex;
    align-items: center;
    @include search-icon;
  }

  &.store-item {
    display: flex;
    align-items: center;
    @include search-icon;
  }

  &.service-item {
    display: flex;
    align-items: center;
    @include search-icon;
  }

  &.goods-item {
    display: flex;
    align-items: center;
    @include search-icon;
  }
}
</style>
