<template>
  <div id="search-box" ref="searchbox" v-click-outside="onClickOutside">
    <div style="position:relative; flex: 1 1;">
      <swiper v-show="searchKey === '' && !shopId" :options="swiperOptions"
              class="hot-search">
        <swiper-slide v-for="(item, index) in hotSearch" :key="index">
          {{ item }}
        </swiper-slide>
      </swiper>
      <input id="search-box-input" ref="search-input" type="text" @click="handleOpenSearchBox" v-model="searchKey"
             autocomplete="off" @keydown.enter="handleSearch" :placeholder="shopId ? 'Tìm kiếm trong shop này' : ''"/>
    </div>
    <div class="inshop-btn" v-if="showInshopBtn">
      <v-dropdown mode="hover">
        <template #trigger>
          <button class="btn">
            {{ inshop.label }}
            <Icon type="ios-arrow-down"/>
          </button>
        </template>
        <template #body>
          <div class="dropdown-menu">
            <div class="dropdown-menu__option" v-for="(item, index) in inshopOption" :key="index"
                 @click="handleChangeInshop(item)">
              <div class="inshop-option" :class="{active: inshop.value == item.value}">
                <div>{{ item.label }}</div>
                <Icon v-if="inshop.value == item.value" type="md-checkmark"/>
              </div>
            </div>
          </div>
        </template>
      </v-dropdown>
    </div>
    <div class="search-btn" @click="handleSearch">
      <Iconify icon="ep:search" style="font-size: 16px;"/>
      <span>{{ $t('Search') }}</span>
    </div>
    <div id="myModal">
      <SearchBox v-if="isShow" :searchKey="searchKey" :shopId="shopId" @hot-search="handleSearch"/>
    </div>
  </div>
</template>

<script>
import SearchBox from "@/pages/index/search/SearchBox.vue";
import {swiper, swiperSlide} from "vue-awesome-swiper";
import {mapMutations, mapState} from "vuex";


export default {
  name: "Search",
  components: {
    SearchBox,
    swiper,
    swiperSlide
  },
  data() {
    return {
      isShow: false,
      swiperOptions: {
        direction: "vertical",
        loop: false,
        freeMode: true,
        autoplay: {
          delay: 3000,
        },
      },
      searchKey: '',
      hotSearch: ["Dịch vụ làm đẹp cao cấp", "Phòng khám nha khoa", "Combo nhuộm tóc ưu đãi"],
      inshopOption: [
        {value: 'IN_SHOP', label: this.$t('In shop')},
        {value: 'SYSTEM', label: this.$t('In platform')}
      ],
      inshop: {value: 'SYSTEM', label: this.$t('In platform')},
      showInshopBtn: false,
      shopId: ''
    }
  },
  watch: {
    '$route': {
      handler(to, from) {
        if (to.name != from.name) {
          this.searchKey = to.query.keyword || ''
        }
        if (!['Merchant', 'Search result'].includes(to.name)) {
          this.showInshopBtn = false
          this.inshop = {value: 'SYSTEM', label: this.$t('In platform')}
          this.shopId = ''
        }
        if (to.name == 'Merchant') {
          this.showInshopBtn = true
          this.inshop = {value: 'IN_SHOP', label: this.$t('In shop')}
          this.shopId = to.query.id
        }
        if (to.name == 'Search result') {
          if (to.query.shop) {
            this.showInshopBtn = true
            this.shopId = to.query.shop
            this.inshop = {value: 'IN_SHOP', label: this.$t('In shop')}
          }
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['historySearchList']),
  },
  methods: {
    ...mapMutations(['SET_HISTORY_SEARCH_LIST']),
    onClickOutside() {
      this.isShow = false
    },
    handleOpenSearchBox() {
      // if (this.shopId) {
      //   this.isShow = false
      // } else {
      this.isShow = true
      // }
    },
    handleSearch() {
      // let history = JSON.parse(localStorage.getItem('historySearch'))
      let history = this.historySearchList
      if (this.searchKey) {
        if (history) { //Nếu đã có lịch sử
          if (history.length < 5) { //Nếu lịch sử ít hơn 5 bản ghi thì đẩy thêm vào
            history.push(this.searchKey)
            this.SET_HISTORY_SEARCH_LIST(history)
            // localStorage.setItem('historySearch', JSON.stringify(history))
          } else { // Nếu lịch sử bằng hoặc hơn 5 bản ghi thì shift bản ghi cũ nhất và đẩy bản ghi mới vào
            history.shift()
            history.push(this.searchKey)
            this.SET_HISTORY_SEARCH_LIST(history)
            // localStorage.setItem('historySearch', JSON.stringify(history))
          }
        } else { // Nếu chưa có lịch sử thì ghi lịch sử vào localStorage
          this.SET_HISTORY_SEARCH_LIST(JSON.stringify([this.searchKey]))
          // localStorage.setItem('historySearch', JSON.stringify([this.searchKey]))
        }
      }
      this.isShow = false
      this.$router.push({
        name: 'Search result',
        query: {keyword: this.searchKey, shop: this.inshop.value == 'IN_SHOP' ? this.shopId : undefined},
      })
      this.showInshopBtn = this.inshop.value == 'IN_SHOP'
      this.$bus.$emit('on-search')
    },
    handleChangeInshop(i) {
      this.inshop = i
      if (i.value == 'SYSTEM') {
        this.shopId = ''
      } else {
        this.shopId = this.$route.query.id || this.$route.query.shop
      }
    }
  },
}
</script>

<style scoped lang="scss">
@import '../navbar/navbar';

#search-box {
  height: 100%;
  width: 100%;
  border-radius: 30px;
  background: #f0f0f0;
  border: 1px solid #f0f0f0;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 4px 0 20px;

  &:hover, &:has(#search-box-input:focus) {
    background: #fff;
    border: 1px solid $accent_color;
  }

  #search-box-input {
    outline: none !important;
    border: none !important;
    background: transparent;
    width: 100%;
    position: relative;
    caret-color: $accent_color;
    z-index: 2;
  }

  .hot-search {
    color: #8a8a8a;
    overflow: hidden;
    position: absolute;
    width: 100%;
    font-size: 14px;
    height: 22px;
    line-height: 22px;
    top: 0;
  }

  .inshop-btn {
    height: calc(100% - 8px);
    padding: 0 4px;
    display: flex;
    align-items: center;
    border-left: solid 1px #dddee1;

    .btn {
      width: 130px;
      padding: 0 12px;
      justify-content: space-between;
    }

    .inshop-option {
      display: flex;
      padding: 4px 12px;
      width: 100%;
      justify-content: space-between;

      &.active {
        color: $accent_color;
      }
    }
  }

  .search-btn {
    height: calc(100% - 8px);
    background: $accent_color;
    border-radius: 100px;
    display: flex;
    padding: 0 12px;
    align-items: center;
    gap: 4px;
    color: #fff;
    cursor: pointer;
  }
}
</style>
