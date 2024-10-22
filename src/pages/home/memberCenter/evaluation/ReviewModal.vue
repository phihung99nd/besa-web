<template v-if="isShow">
  <Modal
    v-model="isShow"
    :mask-closable="false"
    scrollable
    @on-ok="handleOnOkModal"
    :styles="{top: '20px', width: '50%', minWidth: '500px'}"
    @on-visible-change="handleChangeVisible"
    :ok-text="$t('Review')"
  >
    <div style="height: 600px; max-height: 600px">
      <h2 class="mb-4">{{ $t('Review') }}</h2>
      <div class="note mb-4">
        <Icon type="ios-warning-outline" size="24"/>
        <p>Chia sẻ về cảm nhận của bạn về sản phẩm trong đơn hàng với tối thiểu 50 kí tự và ít nhất 1 hình ảnh để nhận
          100 BonoCoin. <strong>Lưu ý:</strong> Nếu đánh giá có nội dung không phù hợp, BonoCoin có thể bị thu hồi.</p>
      </div>
      <div style="height: 490px; overflow: auto; display: flex; flex-direction: column; gap: 20px">
        <template v-if="isShow && order.orderType == 'SERVICE'">
          <ReviewItem @change-img="handleChangeImg" @showVideo="showPreviewVideo" :orderItem="order"></ReviewItem>
          <Card style="margin-bottom: 10px;">
            <div class="extra-review">
              <div class="extra-item">
                <div class="label">Đánh giá chuyên gia</div>
                <div class="rating">
                  <Rate v-model="staffReview" style="font-size: 18px"/>
                </div>
              </div>
            </div>
          </Card>
        </template>
        <template v-else-if="isShow && order.orderType == 'NORMAL'">
          <ReviewItem @change-img="handleChangeImg" v-for="(item, index) in order.orderItems" :key="index"
                      :orderItem="item"></ReviewItem>
        </template>
      </div>
      <div class="mt-2">
        <Checkbox v-model="form.anonymous">Đánh giá ẩn danh</Checkbox>
        <div class="anonymous mt-1">
          <div class="helper-text">Tên tài khoản của bạn sẽ hiển thị là
            {{ form.anonymous ? anonymousFilter(userInfo.username) : userInfo.username }}
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="isShowImage" title="View Image" mask-closable :styles="{top: '20px', height: '95vh'}">
      <img
        v-if="isShowImage"
        :src="previewPic"
        style="width: 100%; height: 100%; object-fit: cover"
        alt=""/>
      <div slot="footer">
        <Button type="default" @click="isShowImage=false">OK</Button>
      </div>
    </Modal>
    <Modal v-model="isShowVideo" title="View Video" mask-closable :styles="{top: '20px', height: '95vh'}">
      <video
        v-if="isShowVideo"
        controls
        :src="video"
      />
      <div slot="footer">
        <Button type="default" @click="isShowVideo=false">OK</Button>
      </div>
    </Modal>
  </Modal>
</template>

<script>
import {commonUrl} from "@/plugins/request";
import Storage from "../../../../plugins/storage";
import storage from "@/plugins/storage";
import ReviewItem from "@/pages/home/memberCenter/evaluation/ReviewItem.vue";
import {createReview, editReview} from "@/api/review";

export default {
  name: "ReviewModal",
  components: {ReviewItem},
  props: {
    order: {
      type: Object,
      default: {}
    },
  },
  data() {
    return {
      isShow: false,
      isShowImage: false,
      isShowVideo: false,
      video: null,
      previewPic: null,
      maxPicSize: 1024, // in kB
      maxVidSize: 61440, // in kB
      picFormat: ['jpg', 'jpeg', 'png'],
      vidFormat: ['mp4', 'mov'],
      accessToken: "",
      uploadUrl: commonUrl + "/buyer/common/file",
      userInfo: {},
      form: {
        storeId: this.order.storeId,
        orderId: this.order.sn,
        anonymous: false,
        ratingItems: []
      },
      staffReview: 5
    }
  },
  mounted() {
    this.accessToken = {
      accessToken: Storage.getItem('buyer_accessToken'),
    };
    this.userInfo = JSON.parse(storage.getItem('buyer_userInfo'))
  },
  watch: {
    order: {
      handler(val) {
        this.form.storeId = this.order.storeId
        this.form.orderId = this.order.sn
        if (this.order.orderType == 'SERVICE') {
          this.form.orderId = this.order.orderSn
        }
      }
    }
  },

  methods: {
    // reset nội dung modal khi đóng
    handleChangeVisible(e) {
      if (!e) {
        this.isShowImage = false
        this.isShowVideo = false
        this.rating = 5
        this.comment = ""
        this.anonymous = false
        this.picList = []
        this.video = null
        this.previewPic = null
      }
    },

    handleChangeImg(val) {
      this.previewPic = val.url
      this.isShowImage = val.isShow
    },
    // biến đổi chuỗi tên người dùng thành dạng ẩn danh
    anonymousFilter(str) {
      const first = str.substring(0, 2)
      const last = str[str.length - 1]
      const middle = str.substring(1, str.length - 1).replace(/./g, '*')
      return first + middle + last
    },

    // Gửi form đánh giá
    handleOnOkModal() {
      let data = {
        ...this.form,
        ratingItems: this.form.ratingItems.map(e => ({
          ...e,
          images: e.images.map(i => i.split("/tmp/")[1]),
          videos: e.videos ? [e.videos.split("/tmp/")[1]] : []

        }))
      }
      if(this.order.orderType == 'SERVICE') {
        this.order.clerkIds.split(",").forEach(item => {
          data.ratingItems.push({
            subjectId: item,
            subjectType: "STAFF",
            subjectRating: this.staffReview,
          })
        })
      }
      // let param = {
      //   userId: this.userInfo.id,
      //   username: this.userInfo.username
      // }
      // console.log(data)
      createReview(data).then(res => {
        this.$Message.success(this.$t('Success review'))
        this.$parent.getList()
      })
    },
    showPreviewVideo(e) {
      this.video = e
      this.isShowVideo = true
    }
  }
}
</script>

<style scoped lang="scss">
@import "./review.scss";

.extra-review {
  width: 100%;
  display: flex;
  flex-direction: column;
  .extra-item {
    display: flex;
    align-items: center;
    .label {
      width: 150px;
    }
  }
}
</style>
