<template>
  <div class="remarks-box" :class="{'row-layout': layout == 'row', 'column-layout': layout == 'column'}">
    <div class="remarks-user">
      <Avatar :style="{color: randomTextColor,backgroundColor: '#'+randomBgColor}">
        {{ commentDetail.owner.username.slice(0, 1) }}
      </Avatar>
      <span class="remarks-user-name">{{ commentDetail.owner.username }}</span>
    </div>
    <div class="remarks-content-box">
      <p>
        <Rate :value="Number(commentDetail.subjectRating)" allow-half class="remarks-star" disabled></Rate>
      </p>
      <div class="remarks-sub flex" style="flex-direction: column">
        <span>{{ commentDetail.createdAt | formatDate(commentDetail.createdAt) }}</span>
      </div>
      <p class="remarks-content">{{ commentDetail.content }}</p>
      <div class="flex" style="gap: 5px">
        <div v-for="(item, index) in commentDetail.videos.length+commentDetail.images.length" :key="index">
          <div v-if="commentDetail.videos.length && index==0" class="comment-video">
            <video :src="commentDetail.videos[0]"
                   :class="index == currentIndexImg ? 'selected' :''"
                   @click="handlePreviewMedia(index)"
            ></video>
          </div>
          <div v-if="commentDetail.images.length && index >= commentDetail.videos.length" class="comment-img">
            <div :class="index == currentIndexImg ? 'selected' :''"
                 @click="handlePreviewMedia(index)">
              <img :src="commentDetail.images[index-commentDetail.videos.length]" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="media-view" v-if="currentIndexImg!=null">
        <div class="media-video" v-if="commentDetail.videos.length && currentIndexImg == 0">
          <video controls :src="commentDetail.videos[0]"/>
        </div>
        <div v-for="(item, index) in commentDetail.images" :key="index"
             class="media-img"
             :class="{ show: currentIndexImg == index + commentDetail.videos.length}">
          <img :src="item" :alt="item">
        </div>
      </div>
      <Alert class="mt_10 shop-reply" v-if="commentDetail.storeReply">
        <h5>{{ $t('Seller reply') }}</h5> {{ commentDetail.storeReply }}
      </Alert>
      <div v-if="" class="mt_10 flex" style="justify-content: space-between">
        <div :class="checkIsLike(commentDetail.likes) ? 'global_color': ''" class="hover-pointer"
             @click="handleClickLike(commentDetail.id)">
          <Iconify icon="mdi:like"/>
          {{ commentDetail.likes > 0 || commentDetail.likes ? commentDetail.likes.length : $t('Useful?') }}
        </div>
        <div @click="handleReport(commentDetail.id)" class="hover-pointer">
          <Iconify icon="octicon:report-24"/>
        </div>
      </div>
    </div>
    <Modal
      v-model="isShowModalReport"
      @on-ok="handleSendReportReview"
      :title="$t('Please select a reason for report review')">
      <div class="flex" style="flex-direction: column">
        <RadioGroup v-model="reportParams.reasonCode" vertical>
          <Radio v-for="(item, index) in reportContentList" :key="index" :label="item.code">
            {{ item.reason }}
          </Radio>
        </RadioGroup>
      </div>
    </Modal>
  </div>

</template>

<script>
import {getReportReason, reportReview, updateLikeReview} from "@/api/review";
import Storage from "@/plugins/storage";
import mixins from "@/plugins/mixins";

export default {
  name: "CommentItem",
  mixins: [mixins],
  props: {
    commentDetail: {
      type: Object,
      default: {}
    },
    layout: {
      type: String,
      default: 'row'
    }
  },
  computed: {
    randomBgColor() {
      return Math.floor(Math.random() * 16777215).toString(16);
    },
    randomTextColor() {
      return this.betterContrastColor(this.randomBgColor)
    }
  },
  data() {
    return {
      isShowModalReport: false,
      reportContentList: [],
      currentIndexImg: null,
      reportParams: {
        id: "",
        reason: "",
        reasonCode: "",
        createdAt: ""
      },
      reportCode: '',
    }
  },
  methods: {
    handleReport(id) {
      if (Storage.getItem('buyer_userInfo') == null) {
        this.$Modal.confirm({
          title: this.$t('Please sign in'),
          content: this.$t('Please login to perform this action'),
          okText: this.$t('Sign in'),
          cancelText: this.$t('Back'),
          onOk: () => {
            this.$router.push({
              path: '/login',
              query: {
                rePath: this.$router.history.current.path,
                query: JSON.stringify(this.$router.history.current.query)
              }
            });
          }
        });
      }else {
        this.isShowModalReport = true
        getReportReason().then(res => {
          this.reportContentList = res
          this.selectedReviewId = id
        })
      }
    },

// xử lý gửi form báo cáo
    handleSendReportReview() {
      this.$Modal.confirm({
        title: this.$t('Report review'),
        content: this.$t('Are you sure want to report this review?'),
        okText: this.$t('Send'),
        cancelText: this.$t('Back'),
        onOk: () => {
          this.reportParams.createdAt = new Date().toISOString()
          this.reportParams.id = this.selectedReviewId
          this.reportParams.reason = this.reportContentList.find(e => {
            return e.code === this.reportParams.reasonCode
          }).reason
          reportReview(this.selectedReviewId, this.reportParams).then(res => {
            this.$Message.success(this.$t('Success report'))
            this.$emit('update')
          })
        }
      });
    }
    ,
    checkIsLike(likeArr) { // kiểm tra xem người dùng đã like chưa
      if (likeArr == null) return
      if (Storage.getItem('buyer_userInfo') == null) return
      let idUser = JSON.parse(Storage.getItem('buyer_userInfo')).id
      return likeArr.includes(idUser)
    }
    ,
// Xử lý khi nhấn nút like
    handleClickLike(id) {
      if (Storage.getItem('buyer_userInfo') == null) {
        this.$Modal.confirm({
          title: this.$t('Please sign in'),
          content: this.$t('Please login to perform this action'),
          okText: this.$t('Sign in'),
          cancelText: this.$t('Back'),
          onOk: () => {
            this.$router.push({
              path: '/login',
              query: {
                rePath: this.$router.history.current.path,
                query: JSON.stringify(this.$router.history.current.query)
              }
            });
          }
        });
      } else {
        updateLikeReview(id).then(res => {
          this.$emit('update')
        })
      }
    }
    ,
    handlePreviewMedia(i) {
      if (this.currentIndexImg === i) {
        this.currentIndexImg = null
      } else {
        this.currentIndexImg = i
      }

    }
    ,
  }
}
</script>

<style lang="scss" scoped>
.remarks-box {
  padding: 15px;
  display: flex;
  border-bottom: 1px #ccc dotted;
  &.row-layout {
    flex-direction: row;
    .remarks-user {
      display: flex;
      width: 180px;
    }
  }
  &.column-layout {
    flex-direction: column;
    .remarks-user {
      display: flex;
      width: 220px;
    }
  }
}

.remarks-user-name {
  padding-left: 15px;
}

.remarks-content-box {
  flex: 1 1;

  .comment-video {
    video {
      border: 1px solid #999;
      width: 50px;
      height: 50px;
    }

    .selected {
      border: 2px solid $accent_color !important;
      padding: 2px;
    }

    &:hover {
      cursor: zoom-in;
    }
  }

  .comment-img {
    display: flex;

    .selected {
      border: 2px solid $accent_color !important;
      padding: 2px;
    }

    &:hover {
      cursor: zoom-in;
    }

    div {
      border: 1px solid #999;
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

.shop-reply {
  background-color: $light_background_color;
}

.media-view {
  width: 500px;
  height: 500px;

  > .media-img {
    display: none;
    width: 100%;
    height: 100%;
    animation: open 0.5s ease;
  }

  > .media-video {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: start;
    align-items: center;
    animation: open 0.5s ease;
  }

  @keyframes open {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .show {
    display: flex;
    justify-content: start;
    align-items: center;
  }

  img, video {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

}

/deep/ .ivu-avatar-string {
  position: unset !important;
}
</style>
