<template>
  <div>
    <Card dis-hover>
      <div class="flex">
        <div>
          <p class="global_color" style="text-align: center; font-size: 36px;font-weight: 500;">4.0/5</p>
          <Rate :value="4" disabled/>
        </div>
        <div class="flex ml_20 align-item-center">
          <RadioGroup type="button" v-model="commentTag">
            <Radio class="mr_20" :key="index" v-for="(item, index) in commentTagList" :label="item.name"
                   border>{{ `${item.name} (${item.num})` }}
            </Radio>
          </RadioGroup>
        </div>
      </div>
    </Card>
    <Scroll :height="600">
      <div v-if="commentList.length === 0" style="text-align: center;margin-top: 20px;">
        {{ $t('Have not any review') }}
      </div>
      <div v-for="(item,index) in commentList" v-else :key="index" class="remarks-box">
        <div class="remarks-user">
          <Avatar icon="ios-contact"/>
          <span class="remarks-user-name">{{ item.owner.username }}</span>
        </div>
        <div class="remarks-content-box">
          <p>
            <Rate :value="Number(item.subjectRating)" allow-half class="remarks-star" disabled></Rate>
          </p>
          <div class="remarks-sub flex" style="flex-direction: column">
            <span class="remarks-item">{{  }}</span>
            <span>{{ item.createdAt | formatDate(item.createdAt) }}</span>
          </div>
          <p class="remarks-content">{{ item.content }}</p>
          <div v-if="item.images" class="comment-img">
            <div v-for="(img, imgIndex) in item.images"
                 :key="imgIndex"
                 class="hover-pointer"
                 @click="handlePreviewImg(img)">
              <img :src="img" />
            </div>
          </div>
          <div v-if="" class="mt_10 flex" style="justify-content: space-between">
            <div :class="checkIsLike(item.likes) ? 'global_color': ''" class="hover-pointer"
                 @click="handleClickLike(item.id)">
              <Iconify icon="mdi:like"/>
              {{ item.likes ? item.likes.length : $t('Useful?') }}
            </div>
            <div @click="handleReport(item.id)" class="hover-pointer">
              <Iconify icon="octicon:report-24"/>
            </div>
          </div>
        </div>
      </div>§
    </Scroll>
  </div>
</template>

<script>
import {getReportReason, getReview, reportReview, updateLikeReview} from "@/api/review";
import Storage from "@/plugins/storage";

export default {
  name: "MerchantReview",
  data() {
    return {
      commentList: [],
      commentTag: '5 star',
      commentTagList: [
        {
          name: this.$t('5 star'),
          num: 10
        },
        {
          name: this.$t('4 star'),
          num: 9
        },
        {
          name: this.$t('3 star'),
          num: 1
        },
        {
          name: this.$t('2 star'),
          num: 1
        },
        {
          name: this.$t('1 star'),
          num: 1
        },
        {
          name: this.$t('Exist picture/video'),
          num: 1
        },
        {
          name: this.$t('Exist comment'),
          num: 1
        },
      ],
      commentParams: {
        page: 1,
        limit: 10,
        storeId: '1376433565247471616',
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getReview(this.commentParams).then(res => {
        this.commentList = res.items
      })
    },
    handleReport(id) {
      this.isShowModalReport = true
      getReportReason().then(res => {
        this.reportContentList = res
        this.selectedReviewId = id
      })
    },
    handleSendReportReview() {
      this.$Modal.confirm({
        title: this.$t('Report review'),
        content: this.$t('Are you sure want to report this review?'),
        okText: this.$t('Send'),
        cancelText: this.$t('Back'),
        onOk: () => {
          this.reportParams.createdAt = new Date().toISOString()
          this.reportParams.id = this.selectedReviewId
          reportReview(this.selectedReviewId, JSON.parse(JSON.stringify(this.reportParams))).then(res => {
            this.$Message.success(this.$t('Success report'))
            this.getList()
          })
        }
      });
    },
    handlePreviewImg(url) {
      this.selectedPic = "https://" + url
      this.showPreviewImg = true
    },
    checkIsLike(likeArr) {
      if (likeArr == null) return
      if (Storage.getItem('buyer_userInfo') == null) return
      let idUser = JSON.parse(Storage.getItem('buyer_userInfo')).id
      return likeArr.includes(idUser)
    },
    // Xử lý khi nhấn nút like
    handleClickLike(id) {
      updateLikeReview(id).then(res => {
        this.getList()
      })
    }
  },

}
</script>
<style lang="scss" scoped>
.item-intro {
  > img {
    display: block;
  }
}

/***************商品详情介绍和推荐侧边栏开始***************/
.item-intro-show {

  width: 1200px;
  margin: 15px auto;
  display: flex;
  overflow-x: hidden;
  flex-direction: row;

}

.item-intro-recommend {
  width: 200px;
  display: flex;
  flex-direction: column;
}

.item-intro-recommend-column {
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px #999;
}

.item-recommend-title {
  width: 100%;
  height: 38px;
  font-size: 16px;
  line-height: 38px;
  color: #fff;
  background-color: $theme_color;
  box-shadow: 0px 0px 5px $theme_color;
  text-align: center;
}

.item-recommend-column {
  margin-top: 15px;
}

.item-recommend-intro {
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
  color: #999;
  cursor: pointer;
}

.item-recommend-img {
  width: 80%;
  margin: 0px auto;
  cursor: pointer;
}

.item-recommend-img img {
  width: 100%;
}

.item-recommend-top-num {
  color: #fff;
  margin: 0px 2px;
  padding: 1px 5px;
  border-radius: 12px;
  background-color: $theme_color;
}

.item-recommend-price {
  color: $theme_color;
  font-weight: bolder;
}

.item-intro-detail {
  width: 100%;
}

.item-intro-nav {
  width: 100%;
  height: 38px;
  background-color: $light_header_background_color;
}

.item-intro-nav ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
}

.item-intro-nav li {
  float: left;
  height: 100%;
  width: 120px;
  line-height: 38px;
  text-align: center;
  color: $theme_color;
}

.item-intro-nav li:first-child {
  background-color: $theme_color;
  color: #fff;
}

.item-intro-img {
  width: 100%;
  min-height: 300px;

  /deep/ img {
    margin: 0 auto;
  }
}

.item-intro-img img {
  max-width: 1000px;
}

/************* 商品参数 *************/
.item-param-container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
}

.item-param-box {
  padding: 5px;
  padding-left: 30px;
  width: 240px;
  height: 36px;
  font-size: 14px;
}

.item-param-title {
  color: #232323;
}

.item-param-content {
  color: #999;
}

.remarks-title {
  padding-left: 15px;
  height: 36px;
  font-size: 16px;
  font-weight: bolder;
  line-height: 36px;
  color: #666666;
  background-color: #F7F7F7;
}

.remarks-analyse-box {
  padding: 15px;
  display: flex;
  align-items: center;
}

.remarks-analyse-goods {
  margin-left: 15px;
  margin-right: 15px;
}

.remarks-analyse-num {
  font-size: 26px;
}

.remarks-analyse-title {
  font-size: 14px;
  line-height: 20px;
}

.remarks-bar {
  padding-left: 15px;
  height: 36px;
  line-height: 36px;
  color: #666666;
  background-color: #F7F7F7;

  .selectedBar {
    color: $theme_color;
  }
}

.remarks-bar span {
  margin-right: 15px;

  &:hover {
    color: $theme_color;
    cursor: pointer;
  }
}

.remarks-box {
  padding: 15px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px #ccc dotted;
}

.remarks-user {
  width: 180px;
}

.remarks-user-name {
  padding-left: 15px;
}

.remarks-content-box {
  width: calc(100% - 180px);

  .comment-img {
    display: flex;

    .borderColor {
      border-color: $theme_color;
    }

    div {
      border: 1px solid #999;
      margin-right: 5px;
      width: 50px;
      height: 50px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .preview-img {
    position: relative;
    border: 1px solid #eee;
    margin: 10px 0;
    width: 200px;

    div {
      position: absolute;
      top: 3px;
      left: 3px;
      z-index: 3;

      span {
        display: inline-block;
        background-color: rgba(0, 0, 0, .5);
        padding: 3px 5px;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
      }

      span:nth-child(1) .ivu-icon {
        transform: rotateY(180deg);
      }
    }

  }
}

.remarks-content {
  font-size: 14px;
  color: #232323;
  line-height: 28px;
}

.remarks-sub {
  color: #ccc;
}

.remarks-time {
  margin-left: 15px;
}

.remarks-page {
  margin: 15px;
  display: flex;
  justify-content: flex-end;
}

/***************商品详情介绍和推荐侧边栏结束***************/
/* 改变便签页样式 */
.ivu-tabs-ink-bar {
  background-color: $theme_color !important;
}

/deep/ .ivu-tabs-bar {
  border: none;
}

.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab {
  border-radius: 0px;
  color: #999;
  height: 38px;
  // background: #F7F7F7;
}

.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab-active {
  color: #fff;
  background-color: $theme_color;
}

.item-tabs > .ivu-tabs > .ivu-tabs-bar .ivu-tabs-tab-active:before {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  color: #fff;
  background: #F7F7F7;
  position: absolute;
  top: 0;
  left: 0;
}

.ivu-rate-star-full:before, .ivu-rate-star-half .ivu-rate-star-content:before {
  color: $theme_color;
}

table {
  border-color: #efefef;
  color: #999;
  min-width: 30%;
  margin-left: 30px;
  font-size: 14px;

  tr {
    td:nth-child(1) {
      width: 100px;
    }

    td:nth-child(2) {
      padding-left: 20px;
    }
  }

  td {
    padding: 6px;
  }
}

.goods-params {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-left: 30px;

  span {
    color: #999
  }
}
</style>

