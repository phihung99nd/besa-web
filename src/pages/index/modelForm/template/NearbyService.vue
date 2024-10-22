<template>
  <div class="nearby-service">
    <div class="section-header">
      <h2>Dịch vụ gần bạn</h2>
    </div>
    <div class="section-body">
      <div class="service-card" v-for="(i, index) in serviceList" :key="index"
           @click="$router.push({name: 'service', query: {id: i.id}})">
        <div class="card--top">
          <img :src="parseMinioURL(i.thumbnail)" alt=""/>
          <!--          <div class="card&#45;&#45;discount">-->
          <!--            -30%-->
          <!--          </div>-->
          <div class="card--wish">
            <Iconify :icon="i.liked ? 'ph:heart-fill' : 'ph:heart'" :class="{active: i.liked}"/>
            <!--            <Iconify icon="ph:heart-fill" class="active"/>-->
          </div>
        </div>
        <div class="card--content">
          <div class="meta-info">
            <h3>{{ i.name }}</h3>
            <ul class="flex review">
              <li class="rating">
                <span>{{ i.grade ? i.grade.toFixed(1) : 5 }}</span>
                <Rate allow-half disabled :value="i.grade ? i.grade : 5"/>
              </li>
              <li class="booking-num">
                <span>{{ i.buyCount }}</span>
                lượt đặt
              </li>
            </ul>
            <!--            <div class="tag-list">-->
            <!--              <span>Đặt nhiều</span>-->
            <!--              <span>Có bảo hành</span>-->
            <!--            </div>-->
          </div>
          <div class="location">
            <Icon type="md-pin" color="#888888"/>
            <span>{{ i.distance ? i.distance.toFixed(2) + 'km' : '' }}</span>
          </div>
          <div class="bottom">
            <!--            <span class="original-price"></span>-->
            <span class="final-price">{{ i.price | unitPrice('₫', 'before') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {searchService} from "../../../../api/search";
import {defaultLocation} from "../../../../config";

export default {
  name: "NearbyService",
  data() {
    return {
      serviceList: []
    }
  },
  computed: {
    ...mapState(['currentLocation', 'favoriteServiceList']),
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      let params = {
        ['storeAddress.center']: `${(this.currentLocation.center||defaultLocation)[1]},${(this.currentLocation.center||defaultLocation)[0]}`
      }
      searchService(params).then(res => {
        this.serviceList = res.content.slice(0, 5).map(i => ({
            ...i,
            liked: this.favoriteServiceList ? this.favoriteServiceList.includes(i.id) : false
          })
        )
      })
    }
  }
}
</script>

<style scoped lang="scss">
.nearby-service {
  margin-bottom: 50px;

  .section-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: end;

    > h2 {
      font-size: 22px;
      font-weight: 600;
      color: #333;
    }

    > span {
      cursor: pointer;

      &:hover {
        color: $accent_color;
      }
    }
  }

  .section-body {
    display: flex;
    justify-content: space-between;
    --gap: 15px;
    --quantity: 5;

    .service-card {
      width: calc((1200px - var(--gap) * (var(--quantity) - 1)) / var(--quantity));
      height: 350px;
      padding: 10px;
      border-radius: 14px;
      background: #fff;
      transition: all $common_transition_duration ease-in-out;

      &:hover {
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;
      }

      .card--top {
        width: 100%;
        height: 170px;
        border-radius: 4px;
        background: #f7f7f7;
        overflow: clip;
        position: relative;
        cursor: pointer;

        &::before {
          content: "";
          z-index: 1;
          position: absolute;
          width: 100%;
          height: 25%;
          top: 0;
          left: 0;
          background-image: linear-gradient(0deg, transparent, rgba(0, 0, 0, .2), rgba(0, 0, 0, .4));
        }

        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card--discount {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          z-index: 2;
          color: #fff;
          font-weight: 600;
          border-radius: 6px;
          padding: 0 6px;
          background: $red_color;
        }

        .card--wish {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 1.8rem;
          line-height: 1;
          color: #fff;
          z-index: 2;

          .active {
            color: $accent_color;
          }
        }
      }

      .card--content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 10px;
        height: 160px;
        cursor: pointer;
        position: relative;

        .meta-info {
          > h3 {
            max-height: 52px;
            color: #333;
            margin: 0;
            font-size: 14px;
            line-height: 24px;
            font-weight: 500;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
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

          .tag-list {
            display: flex;
            gap: 4px;
            width: 100%;
            margin-top: 4px;
            overflow: clip;

            > span {
              padding: 4px 8px;
              border-radius: 4px;
              background: $accent_color_transparent;
              color: $accent_color;
              font-size: 10px;
              white-space: nowrap;
            }
          }
        }

        .location {
          position: absolute;
          bottom: 4px;
          right: 0;
          margin-top: 4px;

          > span {
            font-size: 13px;
            color: #888888;
          }
        }

        .bottom {
          display: flex;
          flex-direction: column;

          .original-price {
            text-decoration: line-through;
            color: #888;
          }

          .final-price {
            font-weight: 600;
            color: $red_color;
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
