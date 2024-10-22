<template>
<div class="nearby-store">
  <div class="section-header">
    <h2>Cửa hàng gần bạn</h2>
  </div>
  <div class="section-body">
    <div class="store-card" v-for="(item, index) in placeList" :key="index" @click="$router.push({name: 'Merchant', query: {id: item.storeId}})">
      <div class="card--top">
        <img :src="parseMinioURL(item.logo)" alt=""/>
      </div>
      <div class="card--content">
        <div class="meta-info">
          <div class="name">
            {{item.name}}
          </div>
          <div class="bottom-info">
            <div class="card--rating">
              <Icon type="md-star" color="#ff9e00"/>
              <span>{{item.grade ? item.grade.toFixed(1) : 5}}</span>
            </div>
            <div class="card--distance">
              <Icon type="md-pin"/>
              <span>{{item.distance ? item.distance.toFixed(2)+'km' : ''}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-btn">
        Khám phá ngay
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {mapState} from "vuex";
import {searchStore} from "@/api/search";
import {defaultLocation} from "../../../../config";

export default {
  name: "NearbyStore",
  data(){
    return {
      placeList: []
    }
  },
  computed: {
    ...mapState(['currentLocation']),
  },
  created() {
    this.getList()
  },
  methods: {
    getList(){
      let params = {
        ['storeAddress.center']: `${(this.currentLocation.center||defaultLocation)[1]},${(this.currentLocation.center||defaultLocation)[0]}`
      }
      searchStore(params).then(res => {
        this.placeList = res.content.slice(0,6)
      })
    }
  }
}
</script>

<style scoped lang="scss">
.nearby-store {
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
    justify-content: start;
    gap: var(--gap);
    --gap: 10px;
    --quantity: 6;

    .store-card {
      width: calc((1200px - var(--gap)*(var(--quantity) - 1))/var(--quantity));
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
</style>
