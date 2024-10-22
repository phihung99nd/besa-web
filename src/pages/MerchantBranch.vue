<template>
  <div class="merchant-branch">
    <div class="page-container">
      <div class="banner">
        <div class="text-holder">
          {{ storeDetail.name }}
        </div>
      </div>
      <div class="service-list">
        <div class="title">Dịch vụ tại chi nhánh này</div>
        <div class="service-container">
          <div class="service-card" v-for="(i, index) in serviceList" :key="index"
               @click="$router.push({name: 'service', query: {id: i.id}})">
            <div class="card--top">
              <img v-lazy="parseMinioURL(i.thumbnail)" alt=""/>
              <!--          <div class="card&#45;&#45;discount">-->
              <!--            -30%-->
              <!--          </div>-->
              <div class="card--wish">
                <Iconify :icon="i.liked ? 'ph:heart-fill' : 'ph:heart'" :class="{active: i.liked}"/>
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
              <div class="bottom">
                <!--                <span class="original-price">{{i.price | unitPrice('₫', 'before')}}</span>-->
                <span class="final-price">{{ i.price | unitPrice('₫', 'before') }}</span>
              </div>
            </div>
          </div>
        </div>
        <Page style="text-align: center" :total="totalService"
              :page-size="serviceParams.size"
              @on-change="changeServicePage"
        />
      </div>
    </div>
    <BaseFooter/>
  </div>
</template>

<script>
import NavigationBar from "@/pages/index/NavigationBar.vue";
import {getServicesList} from "@/api/services";
import {searchService, searchStore} from "../api/search";
import {mapState} from "vuex";

export default {
  name: "MerchantBranch",
  components: {NavigationBar},
  data() {
    return {
      storeDetail: {},
      serviceParams: {
        page: 1,
        size: 10,
      },
      serviceList: [],
      totalService: 0,
    }
  },
  computed: {
    ...mapState(['currentLocation']),
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.handleInitStore()
      this.handleInitService()
    },
    handleInitStore() {
      const params = {
        page: 0,
        size: 10,
        storeAddressId: this.$route.query.id,
      }
      searchStore(params).then(res => {
        this.storeDetail = res.content[0] || {}
      })
    },
    handleInitService() {
      const params = {
        ...this.serviceParams,
        page: this.serviceParams.page - 1,
        storeAddressId: this.$route.query.id
      }
      searchService(params).then(res => {
        this.serviceList = res.content
        this.totalService = +res.totalElements
      })
    },
    changeServicePage(v) {
      this.serviceParams.page = v
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
.page-container {
  margin: 0 auto;
  width: 1200px;
  min-width: 1000px;
  position: relative;

  .banner {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #99ffc7;
    background-image: radial-gradient(at 62% 19%, hsla(102, 62%, 68%, 1) 0px, transparent 50%),
    radial-gradient(at 33% 79%, hsla(271, 76%, 60%, 1) 0px, transparent 50%),
    radial-gradient(at 91% 50%, hsla(230, 95%, 79%, 1) 0px, transparent 50%),
    radial-gradient(at 92% 48%, hsla(125, 74%, 72%, 1) 0px, transparent 50%),
    radial-gradient(at 44% 95%, hsla(339, 99%, 63%, 1) 0px, transparent 50%),
    radial-gradient(at 2% 28%, hsla(227, 64%, 61%, 1) 0px, transparent 50%),
    radial-gradient(at 25% 45%, hsla(229, 93%, 70%, 1) 0px, transparent 50%);

    .text-holder {
      padding: 20px 40px;
      border-radius: 10px;
      background: #00000020;
      font-size: 40px;
      font-weight: 600;
      color: #333;
      box-shadow: inset 2px 2px 8px 0 #ffffff50,
      2px 2px 4px 0 #00000020;
    }
  }

  .service-list {
    width: 1200px;

    > .title {
      font-size: 18px;
      font-weight: 600;
      margin: 10px 0;
    }

    .service-container {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;
      gap: var(--gap);
      width: 100%;
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
            transition: all 0.8s ease;
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
              color: $red_color;
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
              font-weight: 400;
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
                  color: $accent_color;
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
                  color: $accent_color;
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
}
</style>
