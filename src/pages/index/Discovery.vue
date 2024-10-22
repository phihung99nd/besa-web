<template>
  <div class="discovery">
    <div class="section-header">
      <h2>{{ $t('Discovery') }}</h2>
    </div>
    <div class="section-body">
      <div v-for="(item, index) in dataList"
           class="discovery-card"
           :key="item.id"
           @click="handleClickItem(item)"
      >
        <div class="card-top">
          <img :src="item.thumbnail" alt=""/>
        </div>
        <div class="card-content">
          <div class="name">{{ item.name }}</div>
          <div class="rating">
            <span>{{ item.grade.toFixed(1) }}</span>
            <Rate allow-half disabled :value="item.grade"/>
          </div>
          <div class="price">
            {{ item.price | unitPrice("₫","before") }}
          </div>
        </div>
      </div>
      <div id="discovery-bottom-edge">
        <div v-show="loadingNewContent" class="bottom-loader"/>
        <div class="more-item" v-if="dataList.length < total" @click="init">{{ $t('WATCH MORE') }}</div>
        <div v-else>{{ $t('Please use search bar to browse more item') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {getDiscoveryData} from "../../api/common";
import {mapState} from "vuex";

export default {
  name: "Discovery",
  data() {
    return {
      dataList: [],
      loadingNewContent: false,
      debounce: null,
      params: {
        page: 0,
        size: 24
      },
      total: 0,
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapState(['favoriteStoreList'])
  },
  // mounted() {
  //   window.addEventListener('scroll', this.isScrolledIntoView)
  // },
  // destroyed() {
  //   window.removeEventListener('scroll', this.isScrolledIntoView)
  // },
  methods: {
    init() {
      this.loadingNewContent = true
      this.params.page++
      const params = {
        ...this.params,
        page: this.params.page - 1,
        storeIds: this.favoriteStoreList.join(',')
      }
      setTimeout(()=>{
        getDiscoveryData(params).then(res => {
          if (res.length > 0) {
            this.dataList.push(...res)
          } else {
            this.params.page--
          }
          this.total = res.length
        }).finally(() => {
          this.loadingNewContent = false
        })
      }, 600)
    },
    // isScrolledIntoView() {
    //   clearTimeout(this.debounce)
    //   if (this.loadingNewContent) return
    //   this.debounce = setTimeout(() => {
    //     let elem = document.getElementById('discovery-bottom-edge')
    //     let rect = elem.getBoundingClientRect();
    //     let elemTop = rect.top;
    //     if (elemTop < 600) {
    //       this.params.page++
    //       this.loadingNewContent = true
    //       setTimeout(() => {
    //         this.init()
    //       }, 1000)
    //     }
    //   }, 300)
    // },
    handleClickItem(item) {
      this.$router.push({name: 'service', query: {id: item.id}})
    },
  }
}
</script>

<style scoped lang="scss">
.discovery {
  width: 1200px;

  .section-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1200px;
    padding: 10px 0;
    border-bottom: 4px solid $accent_color;

    > h2 {
      font-size: 40px;
      font-weight: 600;
      color: #333;
    }
  }

  .section-body {
    display: flex;
    flex-flow: row wrap;
    gap: 10px;

    .discovery-card {
      width: 191.5px;
      height: 280px;
      border-radius: 12px;
      background: #fff;
      padding: 8px;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: all $common_transition_duration ease-in-out;

      &:hover {
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
      }

      .card-top {
        border-radius: 4px;
        overflow: clip;
        width: 100%;
        aspect-ratio: 1;

        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .card-content {
        display: flex;
        flex-direction: column;
        padding-top: 4px;

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
          color: $text_color_black;
        }

        .rating {
          span {
            margin-right: 4px;
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

        .price {
          justify-self: end;
          font-size: 18px;
          font-weight: 600;
          color: $accent_color;
        }
      }
    }
  }
}

// Loader --------------------------------------------------------
#discovery-bottom-edge {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;


  .more-item {
    padding: 10px 28px;
    margin-bottom: 10px;
    border-radius: 12px;
    width: fit-content;
    height: fit-content;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    border: 1px solid $accent_color;

    &:hover {
      color: #fff;
      background-color: $accent_color;
      transition: ease-in-out 0.2s;
    }
  }

  .bottom-loader {
    width: 32px;
    height: 32px;
    position: relative;
    border-radius: 50%;
    color: $accent_color;
    animation: fill 0.5s ease-in infinite alternate;
    animation-delay: 0.3s;
  }

  .bottom-loader::before, .bottom-loader::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    left: 48px;
    top: 0;
    animation: fill 0.5s ease-in infinite alternate;
    animation-delay: 0.6s;
  }

  .bottom-loader::after {
    left: auto;
    right: 48px;
    animation-delay: 0s;
  }

  @keyframes fill {
    0% {
      box-shadow: 0 0 0 2px inset
    }
    100% {
      box-shadow: 0 0 0 10px inset
    }
  }
}

</style>
