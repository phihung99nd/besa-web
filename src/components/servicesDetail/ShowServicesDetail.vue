<template>
  <div class="flex item-intro-show" style="height:auto;">
    <div style="flex: 1">
      <Card dis-hover>
        <h2>{{ $t('Service information') }}</h2>
        <template v-if="detail.goodsParamsDTOList && detail.goodsParamsDTOList.length">
          <div class="goods-params" style="height:inherit;" v-for="item in detail.goodsParamsDTOList"
               :key="item.groupId">
            <span class="ml_10">{{ item.groupName }}</span>
            <table class="mb_10" cellpadding='0' cellspacing="0">
              <tr v-for="param in item.goodsParamsItemDTOList" :key="param.paramId">
                <td style="text-align: center">{{ param.paramName }}</td>
                <td>{{ param.paramValue }}</td>
              </tr>
            </table>
          </div>
        </template>
        <div v-else>{{ $t('Have not information') }}</div>
        <br>
        <div class="expand" :class="{ open: isExpand}" :style="{ maxHeight: !isExpand ? '200px' : '10000px'}">
          <h2>{{ $t('Description') }}</h2>
          <div class="item-intro-img" ref="itemIntroGoods">
            <div class="item-intro" v-html="detail.intro" v-if="detail.intro"></div>
            <div v-else style="margin:20px;">{{ $t('Not found description') }}</div>
          </div>
          <div class="expand-btn" @click="expandInfo">
            <Icon v-if="isExpand" type="ios-arrow-up" size="25"/>
            <Icon v-else type="ios-arrow-down" size="25"/>
          </div>
        </div>
      </Card>
      <Card dis-hover class="mt_20">
        <h2>{{ $t('Service review') }}</h2>
        <div id="comment-list" ref="itemGoodsComment" class="remarks-container">
          <div class="flex">
            <div>
              <p class="global_color" style="text-align: center; font-size: 36px;font-weight: 500;">
                {{ `${commentRating}/5` }}</p>
              <Rate allow-half :value="+commentRating" disabled/>
            </div>
            <div class="flex ml_20 align-item-center">
              <RadioGroup class="flex" style="gap: 10px" @on-change="handleChangeTagReview" type="button"
                          v-model="commentTag">
                <Radio :key="index" v-for="(item, index) in commentTagList" :label="item.value"
                       border>{{ `${item.name} (${item.num})` }}
                </Radio>
              </RadioGroup>
            </div>
          </div>
          <Divider/>
          <div v-if="commentList.length == 0" style="text-align: center;margin-top: 20px;">
            {{ $t('Have not any review') }}
          </div>
          <div v-for="(item,index) in commentList" v-else :key="index">
            <CommentItem @update="getList" :comment-detail="item"></CommentItem>
          </div>
          <div class="remarks-page">
            <Page :total="+commentTotal"
                  size="small"
                  :page-size="+commentParams.limit"
                  show-total
                  @on-change="changePageNum"
                  @on-page-size-change="changePageSize"
            ></Page>
          </div>
        </div>
      </Card>
    </div>
    <div style="width: 250px">

    </div>
  </div>
</template>

<script>
import {getReportReason, getReview, reportReview, updateLikeReview} from "@/api/review";
import Storage from "@/plugins/storage";
import CommentItem from "@/pages/home/memberCenter/evaluation/CommentItem";

export default {
  name: 'ShowServicesDetail',
  components: {
    CommentItem
  },
  props: {
    detail: {
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
      showPreviewImg: false,
      selectedPic: '',
      reportContentList: [],
      isShowModalReport: false,
      commentTag: '5 star',
      commentTagList: [
        {
          name: this.$t('All'),
          value: '',
          num: 10
        },
        {
          name: this.$t('5 star'),
          value: 5,
          num: 10
        },
        {
          name: this.$t('4 star'),
          value: 4,
          num: 9
        },
        {
          name: this.$t('3 star'),
          value: 3,
          num: 1
        },
        {
          name: this.$t('2 star'),
          value: 2,
          num: 1
        },
        {
          name: this.$t('1 star'),
          value: 1,
          num: 1
        },
        //TODO
        // {
        //   name: this.$t('Exist picture/video'),
        //   num: 1
        // },
        // {
        //   name: this.$t('Exist comment'),
        //   num: 1
        // },
      ],
      commentList: [], // 评论列表
      commentParams: { // 评论传参
        page: 1,
        limit: 6,
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
      subjectId: '',
      commentTypeNum: {}, // 评论数量，包括好中差分别的数量
      commentTotal: 0, // 评论总数
      onceFlag: true, // 只调用一次
      isExpand: false

    };
  },
  computed: {
    commentRating() {
      if (this.ratingDetail.avgRating) return this.ratingDetail.avgRating.toFixed(1)
      return 0
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   // Manually set the height of the details to solve the problem of not being able to open
    //   setTimeout(this.changeHeight('itemIntroGoods'), 2000);
    // });
    window.addEventListener('scroll', this.handleScroll)
  },
  watch: {
    detail: function (newVal, oldVal) {
      this.getList();
    }
  },

  methods: {
    getList() { // Get a list of comments
      this.commentParams.subjectType = 'SERVICE'
      this.commentParams.subjectId = this.detail.id
      getReview(this.commentParams).then(res => {
        this.commentList = res.items
        this.commentTotal = res.meta.totalItems
      })
    },
    // lọc comment theo sao đánh giá
    handleChangeTagReview(val) {
      this.commentParams.subjectRating = val
      this.commentList = []
      this.getList()
    },
    changePageNum(val) { // Modify the comment page number
      this.commentParams.page = val;
      this.getList();
      document.getElementById('comment-list').scrollIntoView({behavior: 'smooth'});
    },
    changePageSize(val) { // Modify the number of comment pages
      this.commentParams.page = 1;
      this.commentParams.size = val;
      this.getList();
    },

    viewByGrade(grade) { // Switch between good, medium and bad reviews
      this.$set(this.commentParams, 'grade', grade);
      this.commentParams.page = 1;
      this.getList();
    },

    handleScroll() { //listen to page scrolling
      if (this.onceFlag) {
        this.$nextTick(() => {
          // this.changeHeight('itemIntroGoods')
        });
        this.onceFlag = false
      }
    },
    expandInfo() {
      this.isExpand = !this.isExpand
    }
  },


};
</script>

<style scoped lang="scss">
.item-intro {
  > img {
    display: block;
  }
}

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
}

.remarks-sub {
  margin-top: 5px;
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

.shop-reply {
  background-color: $light_background_color;
}
// Expand
.expand {
  overflow: hidden;
  transition: all 0.5s ease;

  &.open .expand-btn {
    bottom: -10px;
  }
  &-btn {
    position: absolute;
    bottom: 15px;
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
</style>
