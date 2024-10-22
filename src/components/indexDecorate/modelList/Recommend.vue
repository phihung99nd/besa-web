<template>
  <div class="recommend">
    <div class="recommend-left">
      <div class="head-recommend" :style="{ background: msgLeft.bgColor }">
        <span>{{ $t(msgLeft.title) }}</span>
        <span class="hover-pointer" @click="linkTo(msgLeft.url)">{{ $t(msgLeft.secondTitle) }}&gt;</span>
      </div>
      <div class="content-left">
        <div>
          <img class="hover-pointer"  @click="linkTo(msgLeft.list[0].url)" :src="msgLeft.list[0].img" width="160" height="160" alt="" />
          <div class="margin-left item_name">{{ msgLeft.list[0].name }}</div>
          <div class="margin-left">{{ msgLeft.list[0].price | unitPrice("₫",  "before") }}</div>
          <Button
            size="small"
            :style="{ background: msgLeft.bgColor }"
            @click="linkTo(msgLeft.list[0].url)"
            class="fz_12 view-btn"
            >{{$t('Click to view')}}</Button
          >
        </div>
        <div>
          <template v-for="(item, index) in msgLeft.list">
            <div v-if="index != 0" :key="index" @click="linkTo(item.url)" class="hover-pointer">
              <img :src="item.img" width="80" height="80" alt="" />
              <div>
                <div class="item_name" :title="item.name">{{ item.name }}</div>
                <div>{{ item.price | unitPrice("₫",  "before")}}</div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="recommend-right">
      <div class="head-recommend" :style="{ background: msgRight.bgColor }">
        <span>{{ $t(msgRight.title) }}</span>
        <span @click="linkTo(msgRight.url)" class="hover-pointer"
          >{{ $t(msgRight.secondTitle) }}&gt;</span
        >
      </div>
      <div class="content-right">
        <div
          v-for="(item, index) in msgRight.list"
          :key="index"
          @click="linkTo(item.url)" class="hover-pointer"
        >
          <div class="right-item" :style="{'border': index===2 || index===3 ?'none': ''}">
            <div>
              <div class="item_name" :title="item.name">{{item.name}}</div>
              <div class="item_describe">{{item.describe}}</div>
              <div>{{ item.price | unitPrice("₫",  "before")}}</div>
            </div>
            <div class="right-img">
              <img :src="item.img" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      msgLeft: this.data.options.contentLeft, // 左侧数据
      msgRight: this.data.options.contentRight, // 右侧数据
    };
  },
};
</script>
<style lang="scss" scoped>
.item_name {
  width: 100px;
  font-size: 14px;
  font-weight: 600;
  word-wrap: break-word;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.item_describe {
  font-size: 14px;
  color: #888;
  width: 150px;
  line-height: 14px;
  word-wrap: break-word;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.recommend {
  display: flex;
  justify-content: space-between;
  .recommend-left {
    width: 595px;
    .content-left {
      display: flex;
      padding-top: 10px;
      font-size: 14px;
      > div:nth-child(1) {
        width: 189px;
        border-right: 1px solid #eee;
        height: 360px;
        img {
          margin: 40px 0 0 15px;
        }
        .margin-left {
          margin-left: 15px;
          width: 145px;
        }
        div:nth-of-type(1) {
          font-weight: bold;
          border-top: 1px solid #eee;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        div:nth-of-type(2) {
          color: $accent_color;
          font-size: 14px;
        }
        .view-btn {
          margin-left: 15px;
          margin-top: 10px;
          color: #fff;
        }
      }
      > div:nth-child(2) {
        width: 405px;
        display: flex;
        flex-wrap: wrap;
        > div {
          display: flex;
          align-items: center;
          width: 200px;
          height: 120px;
          img {
            margin: 0 10px;
          }
          > div:nth-child(2) {
            :nth-child(2) {
              color: $accent_color;
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .recommend-right {
    width: 595px;
    height: 360px;
    .head-recommend {
      background: $accent_color;
    }
    .content-right {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding-top: 10px;
      > div {
        width: 50%;
        text-align: left;
        height: 180px;
        padding-top: 10px;
        .right-item {
          border-bottom: 1px solid #eee;
          display: flex;
          margin-top: 30px;
          margin-left: 5px;
          margin-right: 5px;
          height: 150px;
          padding: 0 10px;
          font-size: 14px;
          div:nth-of-type(2){
            font-size: 14px;
            color: #888;
            width: 150px;
          }

          div:nth-of-type(3) {
            font-size: 14px;
            color: $accent_color;
          }

          .right-img {
            width: 100px;
            height: 100px;
            text-align: center;
            margin: 0 auto;
            img{
                height: 100px;
                width: 100px;
            }
          }
        }
      }
      > div:nth-child(n + 1) {
        border-right: 1px solid #eee;
      }
    }
  }

  .head-recommend {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 10px;
    color: #fff;
    span:nth-child(1) {
      font-size: 20px;
    }
    span:nth-child(2) {
      font-size: 14px;
    }
  }
}
</style>
