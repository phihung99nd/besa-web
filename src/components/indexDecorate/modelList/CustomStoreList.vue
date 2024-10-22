<template>
  <div :class="$style['store-list']" :layout="data.options.layout">
    <div :class="$style['section-header']">
      <h2>{{ data.options.title }}</h2>
    </div>
    <div :class="$style['section-body']">
      <template v-if="data.options.layout=='emphasize'">
        <div :class="{[$style['store-card']]: true, [$style['active']]: active == index}"
             :style="{ 'background-image': `url('${item.storeLogo}')`}" v-for="(item, index) in data.options.list"
             :key="index"
             @click="$router.push({name: 'Merchant', query: {id: item.id}})"
             @mouseenter="active = index">
          <div :class="$style['meta-info']">
            <div :class="$style['name']">{{ item.storeName }}</div>
            <ul class="flex" :class="$style['review']">
              <li :class="$style['rating']">
                <span>{{ item.grade ? item.grade.toFixed(1) : 0 }}</span>
                <Rate allow-half disabled :value="item.grade"/>
              </li>
              <li :class="$style['rating-num']">
                <span>{{item.collectionNum}}</span>
                {{$t('follows')}}
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template v-if="data.options.layout=='fullrow'">
        <div :class="$style['store-card']" v-for="(item, index) in data.options.list" :key="index" @click="$router.push({name: 'Merchant', query: {id: item.id}})">
          <div :class="$style['card--top']">
            <img v-lazy="item.storeLogo" alt=""/>
          </div>
          <div :class="$style['card--content']">
            <div :class="$style['meta-info']">
              <div :class="$style['name']">
                {{ item.storeName }}
              </div>
              <div :class="$style['bottom-info']">
                <div :class="$style['card--rating']">
                  <Icon type="md-star" color="#ff9e00"/>
                  <span>{{ item.grade ? item.grade.toFixed(1) : 0 }}</span>
                </div>
                <div :class="$style['card--distance']" v-if="item.distance">
                  <Icon type="md-pin"/>
                  <span>1.0km</span>
                </div>
              </div>
            </div>
          </div>
          <div :class="$style['card-btn']">
            {{$t('Discover Now')}}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomStoreList",
  props: ['data'],
  data(){
    return {
      active: 0
    }
  },
}
</script>

<style lang="scss" module>
.store-list {
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
  }

  &[layout='emphasize'] {
    .section-body {
      display: flex;
      justify-content: flex-start;
      --gap: 10px;
      --quantity: 5;

      .store-card {
        width: calc((1200px - var(--gap) * (var(--quantity) - 1)) / (var(--quantity) + 2));
        height: 270px;
        background-size: cover;
        background-position: 50%;
        transition: all 0.2s ease-in-out;
        transition-delay: 0.15s;
        border-radius: 12px;
        position: relative;
        overflow: clip;
        cursor: pointer;
        margin-right: var(--gap);
        &:last-child {
          margin-right: 0;
        }

        &.active {
          width: calc((1200px - var(--gap) * (var(--quantity) - 1)) / (var(--quantity) + 2) * 3);

          .meta-info {
            bottom: 0;
          }
        }

        .meta-info {
          background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .4), rgba(0, 0, 0, .6));
          z-index: 1;
          position: absolute;
          width: 100%;
          height: 120px;
          bottom: -150px;
          left: 0;
          transition: all 0.2s ease-in-out;
          transition-delay: 0.15s;
          padding: 12px;
          display: flex;
          flex-direction: column;
          justify-content: end;

          > .name {
            font-size: 20px;
            line-height: 20px;
            color: #fff;
            font-weight: 600;
            width: 300px;
          }

          > .review {
            list-style: none;
            align-items: center;

            .rating {
              padding-right: 10px;
              margin-right: 10px;
              border-right: 1px solid $border_color;

              > span {
                margin-right: 4px;
                text-decoration: underline;
                color: $accent_color_tint;
              }

              .ivu-rate {
                font-size: 14px;
              }

              /deep/ .ivu-rate-star {
                margin-right: 2px;
              }
            }

            .rating-num {
              color: #fff;

              > span {
                margin-right: 4px;
                text-decoration: underline;
                color: $accent_color_tint;
              }
            }
          }
        }
      }
    }
  }

  &[layout='fullrow'] {
    .section-body {
      display: flex;
      justify-content: space-between;
      --gap: 10px;
      --quantity: 6;

      .store-card {
        width: calc((1200px - var(--gap) * (var(--quantity) - 1)) / var(--quantity));
        height: 250px;
        padding: 6px;
        border-radius: 14px;
        background: #fff;
        transition: all $common_transition_duration ease-in-out;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;

        &:hover {
          box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 32px;

          .card--top {
            height: 130px;
          }

          .card-btn {
            transform: translateY(0);
            border-radius: 0 0 14px 14px;
          }
        }

        .card--top {
          width: 100%;
          height: 170px;
          border-radius: 8px;
          background: #f7f7f7;
          overflow: clip;
          position: relative;
          cursor: pointer;
          transition: all $common_transition_duration ease-in-out;

          > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .card--content {
          width: 100%;
          height: 80px;

          .meta-info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            padding-top: 10px;

            .name {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .bottom-info {
              display: flex;
              justify-content: space-between;

              .card--distance {
                color: #888888;
                font-size: 13px;
              }
            }
          }
        }

        .card-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 30px;
          background: $accent_color;
          transform: translateY(31px);
          transition: all $common_transition_duration ease-in-out;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
        }
      }
    }
  }
}

</style>
