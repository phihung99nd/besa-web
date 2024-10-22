<template>
  <div class="item-intro-show">
    <div style="flex: 1">
      <Card dis-hover>
        <h2>{{ $t('Goods information') }}</h2>
        <template v-if="detail.goodsParamsDTOList && detail.goodsParamsDTOList.length">
          <div v-for="item in detail.goodsParamsDTOList" :key="item.groupId" class="goods-params"
               style="height:inherit;">
            <span class="ml_10">{{ item.groupName }}</span>
            <table cellpadding='0' cellspacing="0" class="mb_10">
              <tr v-for="param in item.goodsParamsItemDTOList" :key="param.paramId">
                <td style="text-align: center">{{ param.paramName }}</td>
                <td>{{ param.paramValue }}</td>
              </tr>
            </table>
          </div>
        </template>
        <div v-else>{{ $t('Have not information') }}</div>
<!--  Expand      -->
        <div class="expand" :class="{ open: isExpand}" :style="{ maxHeight: !isExpand ? '200px' : '10000px'}">
          <h2>{{ $t('Description') }}</h2>
          <div ref="itemIntroGoods" class="item-intro-img">
            <div v-if="skuDetail.intro" class="item-intro" v-html="skuDetail.intro"></div>
            <div v-else style="margin:20px;">{{ $t('Not found description') }}</div>
          </div>
          <div class="expand-btn" @click="expandInfo">
            <Icon v-if="isExpand" type="ios-arrow-up" size="25"/>
            <Icon v-else type="ios-arrow-down" size="25"/>
          </div>
        </div>
<!--  Expand      -->
      </Card>
      <div id="comment-list" ref="itemGoodsComment" class="remarks-container">
        <Card class="mt_20" dis-hover>
          <h2>{{ $t('Review') }}</h2>
          <div class="flex">
            <div>
              <p class="global_color" style="text-align: center; font-size: 36px;font-weight: 500;">
                {{ commentRating }}/5</p>
              <Rate :value="commentRating" allow-half disabled/>
            </div>
            <div class="flex ml_20 align-item-center">
              <RadioGroup class="flex"  @on-change="handleChangeTagReview" type="button"
                          v-model="commentTag">
                <Radio :key="index" v-for="(item, index) in commentTagList" :label="item.value"
                       border>{{ item.name }}
                </Radio>
              </RadioGroup>
            </div>
          </div>
          <div v-if="commentList.length === 0" style="text-align: center;margin-top: 20px;">
            {{ $t('Have not any review') }}
          </div>
          <div v-for="(item,index) in commentList" v-else :key="index">
            <CommentItem @update="getList" :comment-detail="item"></CommentItem>
          </div>
          <div class="remarks-page">
            <Page :total="+commentTotal"
                  show-total
                  :page-size="+commentParams.limit"
                  size="small"
                  @on-change="changePageNum"
                  @on-page-size-change="changePageSize"
            ></Page>
          </div>
        </Card>
      </div>
    </div>
    <div style="width: 250px"></div>
  </div>
</template>

<script>
import {getReportReason, getReview, getReviewStat, reportReview, updateLikeReview} from "@/api/review";
import Storage from "@/plugins/storage";
import CommentItem from "@/pages/home/memberCenter/evaluation/CommentItem";

export default {
  name: 'ShowGoodsDetail',
  components: {
    CommentItem
  },
  props: {
    detail: { // 商品详情
      type: Object,
      default: null
    },
    ratingDetail: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      currentIndexImg: null,
      selectedReviewId: '',
      isShowModalReport: false,
      commentTag: '5 star',
      commentTagList: [
        {
          name: this.$t('All'),
          value: '',
        },
        {
          name: this.$t('5 star'),
          value: 5,
        },
        {
          name: this.$t('4 star'),
          value: 4,
        },
        {
          name: this.$t('3 star'),
          value: 3,
        },
        {
          name: this.$t('2 star'),
          value: 2,
        },
        {
          name: this.$t('1 star'),
          value: 1,
        },
        //  TODO
        // {
        //   name: this.$t('Exist picture/video'),
        //   num: 1
        // },
        // {
        //   name: this.$t('Exist comment'),
        //   num: 1
        // },
      ],
      OtherReportContent: '',
      reportContent: '',
      reportContentList: [],
      commentList: [], // 评论列表
      commentParams: { // 评论传参
        page: 1,
        limit: 5,
        subjectId: '',
        subjectType: '',
        subjectRating: '',
      },
      reportParams: {
        id: "",
        reason: "",
        reasonCode: "",
        createdAt: ""
      },
      reportCode: '',
      commentTotal: 0, // 评论总数
      onceFlag: true, // 只调用一次
      isExpand: false
    };
  },
  computed: {
    skuDetail() {
      return this.detail.data;
    },
    commentRating() {
      return +(this.ratingDetail.avgRating ? this.ratingDetail.avgRating : 0).toFixed(1)
    }

  },
  methods: {
    changePageNum(val) { // 修改评论页码
      this.commentParams.page = val;
      this.getList();
      document.getElementById('comment-list').scrollIntoView({behavior: 'smooth'});
    },
    changePageSize(val) {
      this.commentParams.page = 1;
      this.commentParams.size = val;
      this.getList();
    },
    getList() {
      this.commentParams.subjectType = 'GOODS'
      this.commentParams.subjectId = this.skuDetail.id
      getReview(this.commentParams).then(res => {
        this.commentList = res.items
        this.commentTotal = res.meta.totalItems
      })
    },
    viewByGrade(grade) { // 好中差评切换
      this.$set(this.commentParams, 'grade', grade);
      this.commentParams.page = 1;
      this.getList();
    },
    handlePreviewImg(i) {
      if (this.currentIndexImg === i) {
        this.currentIndexImg = null
      } else {
        this.currentIndexImg = i
      }
    },
    rotatePreviewImg(type, item) { // 图片旋转
      if (type) {
        if (item.deg) {
          this.$set(item, 'deg', item.deg + 90);
        } else {
          this.$set(item, 'deg', 90);
        }
      } else {
        if (item.deg) {
          this.$set(item, 'deg', item.deg - 90);
        } else {
          this.$set(item, 'deg', -90);
        }
      }
    },

    // lọc comment theo sao đánh giá
    handleChangeTagReview(val) {
      this.commentParams.subjectRating = val
      this.commentParams.page = 1
      this.getList()
    },

    expandInfo(){
      this.isExpand = !this.isExpand
    }
  },
  mounted() {
    this.getList();
    if (this.skuDetail.grade === null || this.skuDetail.grade === undefined) {
      this.skuDetail.grade = 100
    }
  }
};
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
  overflow: hidden;
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
  white-space: pre-wrap;
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

// Expand
.expand {
  overflow: hidden;
  transition: all 0.5s ease;

  &-btn {
    position: absolute;
    bottom: 0px;
    left: 4px;
    right: 4px;
    text-align: center;
    cursor: pointer;
    padding: 5px 0;

    &::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      box-shadow: inset 0 -15px 30px #fff;
    }
  }
}

.ivu-radio-group-button .ivu-radio-wrapper {
  margin-right: 5px;
  width: 90px;
  border-radius: 4px;
  border: solid 1px #cbcbcb;
  display: flex;
  justify-content: center;
}

.ivu-radio-group-button .ivu-radio-wrapper:hover {
  color: $accent_color
}

.ivu-radio-group-button .ivu-radio-wrapper:before, .ivu-radio-group-button .ivu-radio-wrapper:after {
  display: none;
}

.ivu-radio-group-button .ivu-radio-wrapper-disabled:hover {
  color: #ccc
}

.ivu-radio-group-button .ivu-radio-wrapper-checked {
  background-color: $accent_color;
  color: #fff;
  box-shadow: none;
}

.ivu-radio-group-button .ivu-radio-wrapper-checked:hover {
  color: #fff;
}

.ivu-radio-group-button .ivu-radio-wrapper-checked.ivu-radio-focus {
  box-shadow: 0 0 0 2px rgba(10, 88, 202, 0.2);
}
</style>
