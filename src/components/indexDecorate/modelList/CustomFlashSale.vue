<template>
  <div class="flash-sale">
    <div class="section-header">
      <div class="flashsale-wrapper">
        <div class="wr-l" style="display: flex">
          <svg viewBox="0 0 108 21" height="40" width="140" class="badge flash-sale-logo flash-sale-logo--white">
            <g fill="currentColor" fill-rule="evenodd">
              <path
                d="M0 16.195h3.402v-5.233h4.237V8H3.402V5.037h5.112V2.075H0zm29.784 0l-.855-2.962h-4.335l-.836 2.962H20.26l4.723-14.12h3.576l4.724 14.12zM26.791 5.294h-.04s-.31 1.54-.563 2.43l-.797 2.744h2.74l-.777-2.745c-.252-.889-.563-2.43-.563-2.43zm7.017 9.124s1.807 2.014 5.073 2.014c3.13 0 4.898-2.034 4.898-4.384 0-4.463-6.259-4.147-6.259-5.925 0-.79.778-1.106 1.477-1.106 1.672 0 3.071 1.245 3.071 1.245l1.439-2.824s-1.477-1.6-4.47-1.6c-2.76 0-4.918 1.718-4.918 4.325 0 4.345 6.258 4.285 6.258 5.964 0 .85-.758 1.126-1.457 1.126-1.75 0-3.324-1.462-3.324-1.462zm12.303 1.777h3.402v-5.53h5.054v5.53h3.401V2.075h-3.401v5.648h-5.054V2.075h-3.402zm18.64-1.678s1.692 1.915 4.763 1.915c2.877 0 4.548-1.876 4.548-4.107 0-4.483-6.492-3.871-6.492-6.36 0-.987.914-1.678 2.08-1.678 1.73 0 3.052 1.224 3.052 1.224l1.088-2.073s-1.4-1.501-4.12-1.501c-2.644 0-4.627 1.738-4.627 4.068 0 4.305 6.512 3.87 6.512 6.379 0 1.145-.952 1.698-2.002 1.698-1.944 0-3.44-1.48-3.44-1.48zm19.846 1.678l-1.166-3.594h-4.84l-1.166 3.594H74.84L79.7 2.174h2.623l4.86 14.021zM81.04 4.603h-.039s-.31 1.382-.583 2.172l-1.224 3.752h3.615l-1.224-3.752c-.253-.79-.545-2.172-.545-2.172zm7.911 11.592h8.475v-2.192H91.46V2.173H88.95zm10.477 0H108v-2.192h-6.064v-3.772h4.645V8.04h-4.645V4.366h5.753V2.174h-8.26zM14.255.808l6.142.163-3.391 5.698 3.87 1.086-8.028 12.437.642-8.42-3.613-1.025z"></path>
            </g>
          </svg>
        </div>
        <div class="count-down">
          <span>{{ hours }}</span><span>{{ minutes }}</span><span>{{ seconds }}</span>
        </div>
        <div></div>
      </div>
    </div>
    <div class="section-body">
      <div class="service-card" v-for="(item, index) in data.options.list" :key="index" @click="goServiceDetail(item)">
        <div class="card--top">
          <img :src="item.thumbnail" alt=""/>
          <div class="card--discount">
            <Iconify icon="bi:lightning-fill"/>
            -30%
          </div>
          <div class="card--wish">
            <Iconify :icon="favoriteServiceList.includes(item.id) ? 'ph:heart-fill' : 'ph:heart'" :class="{active: favoriteServiceList.includes(item.id)}"/>
          </div>
        </div>
        <div class="card--content">
          <div class="meta-info">
            <h3>{{ item.name }}</h3>
            <ul class="flex review">
              <li class="rating">
                <span>{{ item.grade.toFixed(1) }}</span>
                <Rate allow-half disabled :value="item.grade"/>
              </li>
              <li class="booking-num">
                <span>{{ item.buyCount }}</span>
                lượt đặt
              </li>
            </ul>
<!--            <div class="tag-list">-->
<!--              <span>Đặt nhiều</span>-->
<!--              <span>Có bảo hành</span>-->
<!--            </div>-->
          </div>
          <div class="location" v-if="item.distance">
            <Icon type="md-pin" color="#888888"/>
            <span>{{ item.distance }}km</span>
          </div>
          <div class="bottom">
            <!--          <span class="original-price" v-if="item.discountPrice">{{ item.discountPrice | unitPrice('₫', 'before') }}</span>-->
            <span class="original-price">{{ item.price + item.price * 0.3 | unitPrice('₫', 'before') }}</span>
            <span class="final-price">{{ item.price | unitPrice('₫', 'before') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "CustomFlashSale",
  props: ['data'],
  data() {
    return {
      time: 1718977559428,
      selected: '',
      end: '',
      hours: '',
      minutes: '',
      seconds: '',
      interval: '',
    }
  },
  computed:{
    ...mapState(['favoriteServiceList'])
  },
  mounted() {
    this.init()
  },
  methods: {
    goServiceDetail(val) {
      this.$router.push({
        name: 'service',
        query: {
          id: val.id
        }
      })
    },
    countDown(val) {
      function addZero(i) {
        return i < 10 ? '0' + i : i + '';
      }

      const nowtime = new Date();
      const endtime = new Date(val);
      const lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
      let h = parseInt((lefttime / (60 * 60)) % 24);
      let m = parseInt((lefttime / 60) % 60);
      let s = parseInt(lefttime % 60);
      h = addZero(h);
      m = addZero(m);
      s = addZero(s);
      this.hours = h;
      this.minutes = m
      this.seconds = s;
      if (lefttime <= 0) {
        this.end = `The event is over`;
        clearInterval(this.interval)
      }
    },
    init() {
      this.interval = setInterval(() => {
        this.countDown(this.time);
      }, 1000);
    },
  }
}
</script>

<style lang="scss" scoped>
.flash-sale {
  margin-bottom: 50px;
}

.flashsale-wrapper {
  //background-image: linear-gradient(266deg, #ff0b33, #ff4257, #ff5f7c, #fa78a2);
  height: 40px;
  width: 450px;
  color: $red_color;
  line-height: 32px;
  font-size: 20px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  gap: 26px;
}

.wr-r {
  font-size: 13px;
}

.count-down {
  margin-right: -20px;

  p {
    float: left;
    line-height: 20px;
  }

  > span {
    position: relative;
    float: left;
    width: 32px;
    height: 25px;
    text-align: center;
    background-color: #2f3430;
    margin-right: 8px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    line-height: 25px;
    border-radius: 2px;

    &::after {
      content: ":";
      display: block;
      position: absolute;
      right: -20px;
      font-weight: bolder;
      font-size: 14px;
      width: 20px;
      height: 100%;
      top: 0;
    }
  }

  > span:last-child::after {
    content: "";
  }
}

.badge {
  padding: 0 4px;
  border-radius: 4px;
  color: $red_color;
  font-size: 8px;

  &:after {
    content: '';
    position: absolute;
    border: 1px solid rgba(255, 0, 0, .5);
    opacity: 0;
    border-radius: 4px;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}

.badge {
  animation: vibrate 1.8s infinite;
}

@keyframes vibrate {
  0%, 100% {
    transform: scale(1);
  }
  10%, 90% {
    transform: scale(1.14);
  }
  20%, 80% {
    transform: scale(1.18);
  }
  30%, 70% {
    transform: scale(1.14);
  }
  40%, 60% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1);
  }
}

.flash-sale {
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
          padding-right: 6px;
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
            color: $accent_color_light;
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

</style>
