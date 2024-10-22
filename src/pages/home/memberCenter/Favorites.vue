<template>
  <div class="favorite-wrapper">
    <card v-if="!homePage" :_Size="16" :_Tabs="favoriteWay" :_Title="$t('Favorites')" @_Change="change"/>
    <card v-else :_More="$t('View All')" :_Size="16" :_Tabs="favoriteWay" :_Title="$t('Favorites')"
          _Src="/home/Favorites" @_Change="change"></card>
    <div v-if="list.length">
      <template v-for="(item) in list">
        <div :key="item.skuId" class="goodsItem" v-if="item.marketEnable != 'DOWN'">
          <div v-if="type === 'GOODS'" class="goodsImg hover-pointer">
            <img :src="item.image"/>
          </div>
          <div v-else-if="type === 'SERVICE'" class="goodsImg hover-pointer">
            <img :src="item.image"/>
          </div>
          <div v-else class="goodsImg hover-pointer">
            <img :src="item.storeLogo"/>
          </div>
          <div v-if="type === 'GOODS'" class="goodsTitle hover-color" @click="buynow(item.goodsId)">
            {{ item.name }}
          </div>
          <div v-else-if="type === 'SERVICE'" class="goodsTitle hover-color" @click="bookNow(item.serviceId)">
            {{ item.name }}
          </div>
          <div v-else class="goodsTitle hover-pointer">
            {{ item.storeName }}
          </div>
          <div class="goodsPrice">
            <span v-if="type === 'GOODS'">{{ item.price | unitPrice("₫",  "before") }}</span>
            <!--            <Tag color="error" v-if="item.selfOperated">{{ $t('Seller self-operated') }}</Tag>-->
            <span v-else-if="type === 'SERVICE'">{{ item.price | unitPrice("₫",  "before") }}</span>
          </div>
          <div class="goodsBuy">
            <Button v-if="type === 'SERVICE'" size="small" type="primary" @click="bookNow(item.serviceId)">
              {{ $t('Book now') }}
            </Button>
            <Button v-else-if="type === 'GOODS'" size="small" type="primary"
                    @click="buynow(item.goodsId)">{{ $t('Buy now') }}
            </Button>
            <Button v-else size="small" type="primary" @click="goShop(item.storeId)">{{ $t('View shop') }}</Button>
            <Button v-if="type === 'GOODS'" size="small" @click="cancelGoods(item.goodsId, item.name)">
              {{ $t('Remove favorite') }}
            </Button>
            <Button v-else-if="type === 'SERVICE'" size="small" @click="cancelService(item.serviceId, item.name)">
              {{ $t('Remove favorite') }}
            </Button>
            <Button v-if="type === 'STORE'" size="small" @click="cancelStore(item.storeId, item.name)">
              {{ $t('Remove favorite') }}
            </Button>
          </div>
        </div>
      </template>
    </div>
    <empty :_Title="`Chưa có ${$t(type)} nào`" v-else/>
  </div>
</template>

<script>
import {
  cancelCollectGoods,
  cancelCollectService,
  cancelCollectShop,
  collectGoodsList,
  collectServiceList,
  collectStoreList
} from '@/api/member.js'

export default {
  name: 'Favorites',
  props: {
    homePage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      favoriteWay: [this.$t('Favorite Product'), this.$t('Favorite Service'), this.$t('Favorite Shop')], // 收藏分类
      list: [],
      total: 0,
      type: 'GOODS',
      params: {
        page: 0,
        size: 100,
        sort: [
          'id,DESC'
        ],
      },
    };
  },
  methods: {
    getList() {
      if (this.type === 'GOODS') {
        collectGoodsList(this.params).then(res => {
          if (res.success) this.list = res.result.content.filter(i => {
            return i.marketEnable != 'DOWN'
          });
        })
      }
      if (this.type === 'SERVICE') {
        collectServiceList(this.params).then(res => {
          if (res.success) this.list = res.result.content;
        })
      }
      if (this.type === 'STORE') {
        collectStoreList(this.params).then(res => {
          if (res.success) this.list = res.result.content;
        })
      }
    },
    change(index) {
      if (index === 0) {
        this.type = 'GOODS'
      }
      if (index === 1) {
        this.type = 'SERVICE'
      }
      if (index === 2) {
        this.type = 'STORE'
      }
      this.getList()
    },

    cancelGoods(id, name) {
      this.$Modal.confirm({
        title: this.$t('Confirm'),
        content: this.$t('Are you sure you want to remove this {0} from favorite?', [name]),
        onOk: () => {
          cancelCollectGoods(id)
            .then(res => {
              if (res.success) {
                this.$Message.success(this.$t('Unfavorite goods successfully'))
                this.getList();
              }
            })
        }
      });
    },

    cancelService(id, name) {
      this.$Modal.confirm({
        title: this.$t('Confirm'),
        content: this.$t('Are you sure you want to remove this {0} from favorite?', [name]),
        onOk: () => {
          cancelCollectService(id)
            .then(res => {
              if (res.success) {
                this.$Message.success(this.$t('Unfavorite service successfully'))
                this.getList();
              }
            })
            .catch(err => {
              this.$Message.error(this.$t(err.response.data.message))
            })
        }
      });
    },

    cancelStore(id, name) {
      this.$Modal.confirm({
        title: this.$t('Confirm'),
        content: this.$t('Are you sure you want to remove this {0} from favorite?', [name]),
        onOk: () => {
          cancelCollectShop(id)
            .then(res => {
              if (res.success) {
                this.$Message.success(this.$t('Unfavorite store successfully'))
                this.getList();
              }
            })
            .catch(err => {
              this.$Message.error(this.$t('API unfavorite store error'))
            })
        }
      });
    },

    buynow(goodsId) { // 跳转详情
      let url = this.$router.resolve({
        path: '/goodsDetail',
        query: {goodsId}
      })
      window.open(url.href, '_blank')
    },

    bookNow(id) {
      let url = this.$router.resolve({
        path: '/service',
        query: {id}
      })
      window.open(url.href, '_blank')
    },

    goShop(id) {
      let url = this.$router.resolve({
        path: '/merchant',
        query: {id}
      })
      window.open(url.href, '_blank')
    },
  },

  mounted() {
    if (this.homePage) this.params.size = 5;
    this.getList()
  }
};
</script>

<style lang="scss" scoped>
.goodsShop,
.goodsImg,
.goodsPrice,
.goodsShop,
.goodsTitle {
  margin: 0 6px;
}

.favorite-wrapper {
  margin-bottom: 40px;
}

.goodsItem {
  display: flex;
  height: 60px;
  line-height: 60px;
  margin-bottom: 10px;

  > .goodsImg {
    width: 60px;
    height: 60px;
    overflow: hidden;

    > img {
      width: 100%;
      height: 100%;
    }
  }

  > .goodsPrice,
  .goodsShop {
    width: 150px;
    text-align: center;
  }

  > .goodsTitle {
    width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.goodsBuy {
  display: flex;
  justify-content: center;
  align-items: center;

  > * {
    margin: 0 4px;
  }
}

.page-size {
  text-align: right;
}
</style>
