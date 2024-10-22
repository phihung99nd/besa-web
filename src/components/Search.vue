<template>
  <div class="box">
    <div class="container">
      <img
        v-if="showLogo"
        :src="$store.state.logoImg"
        alt=""
        class="logo-img"
        @click="$router.push('/')"
      />
      <div class="search-box">
        <Input ref="search"
               v-model="searchData"
               :placeholder="$t('Search anything here')"
               clearable
               size="large"
               @keyup.enter.native="searchPhrase(0)"
               @keyup.down.native="handleArrowKey('down')"
               @keyup.up.native="handleArrowKey('up')"
               @on-change="autocomplete"
               @on-focus="autoList.length > 0 ? showHint = true : showHint = false"
               @on-blur="showHint = false"
        >
          <template v-if="storeId" #prepend>
            <Select v-model="searchMode" style="width: 150px">
              <Option value="in_shop">{{ $t('Search in this shop') }}</Option>
              <Option value="all">{{ $t('Search all in Besa') }}</Option>
            </Select>
          </template>
          <template #append>
            <Button icon="ios-search" @click="searchPhrase(1)"></Button>
          </template>
        </Input>
        <div v-if="showHint" class="hint-box">
          <div class="hint-item-wrapper">
            <Option v-for="(item, index) in phraseSearch"
                    :key="index"
                    :isFocused="index === focusedIndex"
                    :label="item.data"
                    :value="item.data"
                    @on-select-selected="handleOptionSelect(item)"
            >
              {{ item.data }}
            </Option>
            <OptionGroup v-if="shopSearch.length > 0" :label="$t('Store')">
              <Option v-for="(item, index) in shopSearch"
                      :key="index+phraseSearch.length"
                      :isFocused="index+phraseSearch.length === focusedIndex"
                      :label="item.data" :value="item.data"
                      @on-select-selected="handleOptionSelect(item)"
              >
                {{ item.data }}
              </Option>
            </OptionGroup>
            <OptionGroup v-if="serviceSearch.length > 0" :label="$t('Services')">
              <Option v-for="(item, index) in serviceSearch"
                      :key="index+phraseSearch.length+shopSearch.length"
                      :isFocused="index+phraseSearch.length+shopSearch.length === focusedIndex"
                      :label="item.data" :value="item.data" @on-select-selected="handleOptionSelect(item)">
                {{ item.data }}
              </Option>
            </OptionGroup>
            <OptionGroup v-if="goodsSearch.length > 0" :label="$t('Goods')">
              <Option v-for="(item, index) in goodsSearch"
                      :key="index+phraseSearch.length+shopSearch.length+serviceSearch.length"
                      :isFocused="index+phraseSearch.length+shopSearch.length+serviceSearch.length === focusedIndex"
                      :label="item.data" :value="item.data" @on-select-selected="handleOptionSelect(item)">
                {{ item.data }}
              </Option>
            </OptionGroup>
          </div>
        </div>
        <template>
          <div v-if="promotionTags.length === 0" style="height:12px"></div>
          <div v-else class="row">
            <div
              v-for="(item, index) in promotionTags"
              :key="index"
              class="mr_10 hot-word"
            >
              <div :title="item" class="hover-color" @click="selectTags(item)">{{ item }}</div>
            </div>
          </div>
        </template>
      </div>

    </div>
  </div>
</template>

<script>
import storage from '@/plugins/storage.js'
import {hotWords} from '@/api/goods.js'
import {autocompleteSearch} from "@/api";

export default {
  name: 'search',
  props: {
    showTag: {
      type: Boolean,
      default: true
    },
    showLogo: {
      type: Boolean,
      default: true
    },
    storeId: {
      type: String,
      default: null
    },
    categoryId: {
      type: String,
      default: null
    },
    hover: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: this.storeId,
      searchData: '',
      searchMode: 'all',
      debounce: null,
      throttle: false,
      autoList: [],
      showHint: false,
      focusedIndex: null
    };
  },
  methods: {
    selectTags(item) {
      this.searchData = item;
      this.searchPhrase(0);
    },

    searchPhrase(click) {
      if (this.focusedIndex != null && click !== 1) {
        this.handleOptionSelect(this.autoList[this.focusedIndex])
        return
      }
      console.log(this.searchMode)

      if (this.searchMode === 'in_shop') {
        this.$emit('search', this.searchData)
      } else {
        this.$router.push({
          path: '/search',
          query: {
            keyword: this.searchData,
            categoryId: this.categoryId ? this.categoryId : '',
          }
        });
      }
    },

    handleOptionSelect(item) {
      if (item.type === 'serviceName' || item.type === 'goodsName' || item.type === 'phrase') {
        this.searchData = item.data
        this.showHint = false
        this.searchPhrase(1)
      }
      if (item.type === 'storeName') {
        this.$router.push(`/merchant?id=${item.storeId}`)
      }
    },

    handleArrowKey(type) {
      if (type === 'down') {
        if (this.focusedIndex === null) this.focusedIndex = 0
        else {
          this.focusedIndex = this.focusedIndex + 1 >= this.autoList.length ? 0 : this.focusedIndex + 1
        }
      }
      if (type === 'up') {
        if (this.focusedIndex === null) this.focusedIndex = this.autoList.length - 1
        else {
          this.focusedIndex = this.focusedIndex - 1 < 0 ? this.autoList.length - 1 : this.focusedIndex - 1
        }
      }
    },

    autocomplete() {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        autocompleteSearch({keyword: this.searchData}).then(res => {
          const phrase = res.length > 0 ? res.filter(i => i.type === 'phrase') : []
          const shop = res.length > 0 ? res.filter(i => i.type === 'storeName') : []
          const service = res.length > 0 ? res.filter(i => i.type === 'serviceName') : []
          const goods = res.length > 0 ? res.filter(i => i.type === 'goodsName') : []
          this.autoList = [...phrase, ...shop, ...service, ...goods]
          this.showHint = this.autoList.length > 0;
        })
      }, 300)

      // THROTTLE
      // if (this.throttle) return
      // autocompleteSearch({keyword: this.searchData}).then(res => {
      //   const phrase = res.length > 0 ? res.filter(i => i.type === 'phrase') : []
      //   const shop = res.length > 0 ? res.filter(i => i.type === 'storeName') : []
      //   const product = res.length > 0 ? res.filter(i => i.type === 'name') : []
      //   this.autoList = [...phrase, ...shop, ...product]
      //   if (this.autoList.length > 0) this.showHint = true
      //   else this.showHint = false
      // })
      // this.throttle = true
      // setTimeout(() => {
      //   this.throttle = false
      // }, 300)
    }
  },
  computed: {
    shopSearch() {
      return this.autoList.filter(i => i.type === 'storeName')
    },
    serviceSearch() {
      return this.autoList.filter(i => i.type === 'serviceName')
    },
    goodsSearch() {
      return this.autoList.filter(i => i.type === 'goodsName')
    },
    phraseSearch() {
      return this.autoList.filter(i => i.type === 'phrase')
    },
    promotionTags() {
      if (this.$store.state.hotWordsList) {
        return JSON.parse(this.$store.state.hotWordsList)
      } else {
        return []
      }
    }
  },

  watch: {
    searchData: {
      handler(newKey, oldKey) {
        if (newKey === "") this.autoList = []
      }
    },

    storeId: {
      handler(newKey, oldKey) {
        this.id = newKey;
      },
    }
  },

  created() {
    this.searchData = this.$route.query.keyword
    if (!this.hover) {
      const reloadTime = storage.getItem('hotWordsReloadTime')
      const time = new Date().getTime() - 30 * 1000
      if (!reloadTime) {
        hotWords({count: 5}).then(res => {
          if (res.success && res.result) storage.setItem('hotWordsList', res.result)
        })
        storage.setItem('hotWordsReloadTime', new Date().getTime())
      } else if (reloadTime && time > reloadTime) {
        hotWords({count: 5}).then(res => {
          if (res.success && res.result) storage.setItem('hotWordsList', res.result)
        })
        storage.setItem('hotWordsReloadTime', new Date().getTime())
      }
    }
  }
};
</script>
<style lang="scss" scoped>

.box {
  width: 100%;
  font-size: 14px !important;
  // height: 35px;
  @include background_color($accent_color_tint);
}

.container {
  display: flex;
  margin: 0 auto;
  padding: 5px 0;
  width: 1200px;
  position: relative;
}

.search {
  margin: 10px 0px 5px 0;

  /deep/ .ivu-input.ivu-input-large {
    font-size: 14px;
    height: 34px;

    &:focus {
      box-shadow: none;
    }
  }

  /deep/ .ivu-input-group-append {
    border-left: none;
    height: 30px;
    background-color: $secondary_color;
    color: #fff;

    button {
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
    }
  }
}

.logo-img {
  //position: absolute;
  //left: -360px;
  //top: -9px;
  max-width: 150px;
  cursor: pointer;
}

.store-search {
  padding: 0;
  border-radius: 3px;

  &:nth-child(2) {
    margin-left: -2px;
    border-radius: 3px;
  }
}

.btn-div {
  display: flex;
  align-items: center;
}

.row {
  display: flex;
  color: #fff;
}

.search-box {
  width: 100%;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;

  .hint-box {
    position: absolute;
    top: 45px;
    width: calc(100% - 562px);
    min-width: 300px;
    max-height: 300px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow-x: hidden;
    overflow-y: auto;

    /deep/ .hint-item-wrapper {
      height: 100%;
      width: 100%;
    }

    /deep/ .ivu-select-item {
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}

.hot-word {
  width: fit-content;
  max-width: 150px;

  div {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
