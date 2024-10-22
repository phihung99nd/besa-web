<template>
  <div class="featured-expert">
    <div class="section-header">
      <h2>{{data.options.title}}</h2>
      <span @click="$router.push({name: 'Professor'})">{{$t('Show more')}}</span>
    </div>
    <div class="section-body">
      <div class="expert-card" v-for="(item,index) in data.options.list" :key="index" @click="$router.push({name: 'Professor detail', query: {id: item.id}})">
<!--        <div class="card&#45;&#45;map">-->
<!--          <Icon type="md-calendar"/>-->
<!--          &nbsp;-->
<!--          <span>214 lượt đặt</span>-->
<!--        </div>-->
        <div class="card--rate" v-if="item.grade">
          <Icon type="md-star" color="#ff9e00"/>
          <span>{{item.grade.toFixed(1)}}</span>
        </div>
        <img v-lazy="item.avatar" alt=""/>
        <div class="meta-info">
          <div class="name">{{item.name}}</div>
          <div class="field">{{item.position}}</div>
          <div class="desc" v-html="item.intro"/>
        </div>
        <div class="flex justify-content-center align-items-center cover">
          <button>{{$t('Book Now')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomClerkList",
  props: ['data'],

}
</script>

<style scoped lang="scss">
.featured-expert {
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
    justify-content: flex-start;
    --gap: 20px;
    --quantity: 5;

    .expert-card {
      width: calc((1200px - var(--gap)*(var(--quantity) - 1))/var(--quantity));
      height: 280px;
      background: #f8f8f8;
      position: relative;
      border-radius: 12px;
      overflow: clip;
      cursor: pointer;
      margin-right: var(--gap);
      &:last-child {
        margin-right: 0;
      }

      .card--map {
        position: absolute;
        top: 11px;
        left: 11px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        z-index: 2;
        color: #fff
      }

      .card--rate {
        position: absolute;
        top: 11px;
        right: 11px;
        color: #fff;
        z-index: 2;
      }

      &::before {
        content: "";
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 20%;
        top: 0;
        left: 0;
        background-image: linear-gradient(0deg,transparent,rgba(0,0,0,.2),rgba(0,0,0,.4));
      }

      &::after {
        content: "";
        z-index: 1;
        position: absolute;
        width: 100%;
        height: 50%;
        bottom: 0;
        left: 0;
        background-image: linear-gradient(180deg,transparent,rgba(0,0,0,.2),rgba(0,0,0,.4));
      }

      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .meta-info {
        position: absolute;
        width: 100%;
        height: 50%;
        bottom: 0;
        left: 0;
        padding: 12px;
        display: flex;
        flex-direction: column;
        justify-content: end;
        z-index: 2;

        > .name {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        > .field {
          font-size: 16px;
          color: #fff;
        }

        > .desc {
          font-size: 14px;
          color: #fff;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

      }

      .cover {
        opacity: 0;
        transition: opacity $common_transition_duration ease;
        z-index: 3;

        > button {
          height: 44px;
          width: fit-content;
          border-radius: 100px;
          padding: 0 16px;
          border: none;
          font-size: 20px;
          font-weight: 600;
          color: #f8f8f8;
          background: rgba($accent_color, 0.9);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      &:hover {
        .cover {
          opacity: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
        }
      }
    }
  }
}
</style>
