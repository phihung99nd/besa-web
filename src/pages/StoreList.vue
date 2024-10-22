<template>
  <div>
    <div class="store-container">
      <div class="section-header">
        Cửa hàng liên quan đến <span>"{{$route.query.keyword}}"</span>
      </div>
      <div class="store-list">
        <div class="result-container shop-result" v-for="i in 10" :key="i">
          <div class="section-body">
            <div class="left-info">
              <img
                src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/hair-salon-logo-design-template-cec2f4ebd3c26a13f805033c6b1e9776_screen.jpg?ts=1646827912"
                alt=""/>
              <div class="meta-info">
                <div class="name">BELLAS_OFFICIAL_SALON</div>
                <div class="tag">
                  <img src="https://salt.tikicdn.com/ts/upload/5d/4c/f7/a947733a6dc83eca57abd15ec1560d8e.png" alt=""/>
                  <img
                    src="https://lzd-img-global.slatic.net/g/tps/imgextra/i3/O1CN01Ir7cAE1tWpT1x30qx_!!6000000005910-2-tps-187-52.png"
                    alt=""/>
                </div>
              </div>
            </div>
            <div class="right-info">
              <div class="info-item">
                <div class="value">
                  <Iconify icon="material-symbols:spa"/>
                  <span>10</span>
                </div>
                <div class="title">Dịch vụ</div>
              </div>
              <div class="info-item">
                <div class="value">
                  <Iconify icon="teenyicons:bag-solid"/>
                  <span>10</span>
                </div>
                <div class="title">Sản phẩm</div>
              </div>
              <div class="info-item">
                <div class="value">
                  <Iconify icon="ph:star-fill"/>
                  <span>4.8</span>
                </div>
                <div class="title">Đánh giá</div>
              </div>
              <div class="info-item">
                <div class="value">
                  <Iconify icon="ph:heart-fill"/>
                  <span>4.8</span>
                </div>
                <div class="title">Yêu thích</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination"></div>
    </div>
    <BaseFooter/>
  </div>
</template>

<script>
import NavigationBar from "@/pages/index/NavigationBar.vue";
import {searchStore} from "@/api/search";

export default {
  name: "StoreList",
  components: {NavigationBar},
  data(){
    return {
      storeList: []
    }
  },
  methods: {
    init(){

    },
    getStoreList(){
      let params = {
        keyword: this.$route.query.keyword
      }
      searchStore(params).then(res => {

      })
    }
  }
}
</script>

<style scoped lang="scss">
.store-container {
  width: 1200px;
  margin: 0 auto;

  .section-header {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    padding: 10px 0 20px 0;
    > span {
      color: $accent_color;
    }
  }

  .store-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .result-container {

      &.shop-result > .section-body {
        width: 100%;
        height: 150px;
        background: #fff;
        border-radius: 14px;
        transition: all $common_transition_duration ease-in-out;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;

        &:hover {
          box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
        }

        .left-info {
          height: 100%;
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 10px;

          > img {
            height: 100%;
            aspect-ratio: 1;
            object-fit: cover;
            border-radius: 4px;
          }

          > .meta-info {
            display: flex;
            flex-flow: column nowrap;

            > .name {
              font-size: 18px;
            }

            > .tag {
              display: flex;
              flex-flow: row nowrap;
              gap: 4px;

              > img {
                height: 20px;
                border-radius: 4px;
              }
            }
          }
        }
      }

      .right-info {
        height: 60px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;

        > .info-item {
          border-left: 1px solid $border_color;
          height: 100%;
          padding: 0 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          > .value {
            color: $accent_color;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          > .title {
            color: #888;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
