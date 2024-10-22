<template>
  <div class="container">
    <div class="goods-list-container">
      <div class="section-header">
        <h2>Sản phẩm</h2>
        <div class="tool-box">
          <v-dropdown mode="click" style="position:relative;">
            <template #trigger>
              <span>{{ $t('Sort by: ') }}</span>{{ priceSort.label }}
            </template>
            <template #body>
              <div class="dropdown-menu">
                <div class="dropdown-menu__option" v-for="(item, index) in priceSortOption">
                  <span>{{ item.label }}</span>
                </div>
              </div>
            </template>
          </v-dropdown>
        </div>
      </div>
      <div class="section-body">
        <product-card
          v-for="(item, index) in goodsList"
          :key="index"
          :item="item"
        >
        </product-card>
      </div>
    </div>
    <div id="bottom-edge">
      <Spin v-if="loadingNewContent" size="large"/>
    </div>
    <Introduce></Introduce>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import NavigationBar from "@/pages/index/NavigationBar.vue";
import Introduce from "@/components/footer/Introduce.vue";
import GoodsClassNav from "@/components/nav/GoodsClassNav.vue";
import * as apiGoods from "@/api/goods";

export default {
  name: "GoodsIndexBk",
  components: {GoodsClassNav, Introduce, NavigationBar},
  data() {
    return {
      priceSort: '',
      priceSortOption: [
        {
          value: 'ASC',
          label: 'Giá tăng dần'
        },
        {
          value: 'DESC',
          label: 'Giá giảm dần'
        }
      ],
      params: {
        page: 1,
        size: 10
      },
      total: 1,
      debounce: null,
      goodsList: [],
      loadingNewContent: false
    }
  },
  created() {
    this.priceSort = this.priceSortOption[0]
    this.getGoodsList()
  },
  mounted() {
    window.addEventListener('scroll', this.isScrolledIntoView)
  },
  destroyed() {
    window.removeEventListener('scroll', this.isScrolledIntoView)
  },
  methods: {
    getGoodsList() {
      const params = {
        ...this.params,
        page: this.params.page - 1
      }
      apiGoods.goodsList(params)
        .then((res) => {
          if (res.success) {
            this.goodsList.push(...res.result.content);
            this.total = res.result.totalPages
            this.loadingNewContent = false
          }
        })
        .catch(() => {
          this.$Message.error(this.$t('API get goods list error'))
        });
    },
    isScrolledIntoView() {
      clearTimeout(this.debounce)
      if (this.loadingNewContent) return
      this.debounce = setTimeout(() => {
        let elem = document.getElementById('bottom-edge')
        let rect = elem.getBoundingClientRect();
        let elemTop = rect.top;
        if (elemTop < 600) {
          this.params.page++
          if(this.params.page > this.total) return
          this.loadingNewContent = true
          setTimeout(() => {
            this.getGoodsList()
          }, 1000)
        }
      }, 300)
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/pages/index/navbar/navbar';

.container {
  //@include sub_background_color($dominant_color);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.goods-list-container {
  width: 1200px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100px;
    border-radius: 14px;

    > h2 {
      color: #555;
      font-size: 40px;
      font-weight: 600;
    }

    .tool-box {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 20px;
      width: 400px;
    }
  }

  .section-body {
    width: 1200px;
    display: flex;
    flex-wrap: wrap;
  }
}

/deep/ .v-dropdown-menu__container {
  right: 0;
}

/deep/ .dropdown-menu__option {
  width: 100px;
}
</style>

