<template>
  <Modal @on-visible-change="handleClose" :ok-text="$t('Complete')"
         v-model="isShowReviewDetail"
         :styles="{top: '20px', width: '50%', minWidth: '500px'}"
  >
    <template v-if="currentState==0">
      <div style="height: 600px">
        <h2 class="mb-4">{{ $t('Review') }}</h2>
        <Scroll :height="550">
          <Card class="mb_20" v-for="(item, index) in orderDetail.orderItems.filter(i => i.subjectType != 'STAFF')"
                :key="index">
            <div class="flex" style="justify-content: space-between">
              <div class="flex">
                <img width="80" height="80" :src="item.image" alt="">
                <div class="ml_10">
                  <p style="font-weight: bold">{{ item.name }}</p>
                  <p>{{ $t('Quantity') }}: {{ item.num }}</p>
                </div>
              </div>
              <div style="text-align: end" class="width_200">
                <Button v-if="!item.edited" @click="handleEditReview(item)" ghost type="primary">{{
                    $t('Edit')
                  }}
                </Button>
                <p class="global_color" v-if="item.edited">{{ $t('Edited') }}</p>
              </div>
            </div>
            <Divider/>
            <div class="flex">
              <div v-if="item.owner.username">
                <Avatar :size="40">{{ item.owner.username.slice(0, 1) }}</Avatar>
              </div>
              <div class="ml_20" style="flex: 1">
                <div class="createdAt">
                  <p>
                    {{ item.owner.username }}
                  </p>
                  <p>
                    {{ item.createdAt | formatDate(item.createdAt) }}
                  </p>
                </div>
                <Rate disabled :value="item.subjectRating"/>
                <p style="white-space: pre-wrap">{{ item.content }}</p>
                <!--              <div class="flex" style="margin: 6px 0">-->
                <!--                <img class="ml_10" width="60" height="60" v-for="(i) in item.images" :key="i" :src="i" :alt="i">-->
                <!--                <video style="object-fit: cover" v-if="item.videos" class="ml_10" height="60" width="60"-->
                <!--                       :src="item.videos[0]"></video>-->
                <!--              </div>-->
                <Alert v-if="item.storeReply" banner type="warning"><h5>{{ $t('Seller') }}</h5> {{ item.storeReply }}
                </Alert>
              </div>
            </div>
            <div class="flex" style="gap: 5px; margin-bottom: 5px;">
              <template v-for="(media, i) in item.videos.length+item.images.length">
                <div v-if="item.videos.length && i==0" class="comment-video" :key="i">
                  <video :src="item.videos[0]"
                         :class="i == currentIndexImg ? 'selected' :''"
                         @click="handlePreviewMedia(i)"
                  ></video>
                  <div class="video-cover">
                      <Icon
                        size="30"
                        type="md-play"
                        @click.native="handlePreviewMedia(i)"
                        color="#000"
                      ></Icon>
                  </div>
                </div>
                <div v-if="item.images.length && i >= item.videos.length" class="comment-img" :key="i">
                  <div class="hover-pointer"
                       :class="i == currentIndexImg ? 'selected' :''"
                       @click="handlePreviewMedia(i)">
                    <img :src="item.images[i- item.videos.length]" alt="">
                  </div>
                </div>
              </template>
            </div>
            <div class="media-view" v-if="currentIndexImg!=null">
              <div class="media-video" v-if="item.videos.length && currentIndexImg == 0">
                <video controls :src="item.videos[0]"/>
              </div>
              <div v-for="(item1, index1) in item.images" :key="index1"
                   class="media-img"
                   :class="{ show: currentIndexImg == index1 + item.videos.length}">
                <img :src="item1" :alt="item1">
              </div>
            </div>
          </Card>
          <Card style="margin: 10px 0;"
                v-for="(item, index) in orderDetail.orderItems.filter(i => i.subjectType == 'STAFF')"
                :key="index">
            <div>
              <strong>Đánh giá chuyên gia</strong>
              <div class="rating">
                <Rate disabled :value="item.subjectRating" style="font-size: 20px"/>
              </div>
            </div>
          </Card>
        </Scroll>

      </div>
    </template>
    <template v-if="currentState==1">
      <div style="height: 600px; max-height: 600px">
        <h2 class="mb-4">
          <Icon style="cursor:pointer;" type="ios-arrow-back" @click="handleBackReview"/>
          {{ $t('Edit Review') }}
        </h2>
        <Card>
          <div class="product-content">
            <div class="product-img">
              <img :src="currentReview.image" :alt="currentReview.name"/>
            </div>
            <div class="product-info">
              <p style="size: 18px; font-weight: bold">{{ currentReview.name }}</p>
              <p>{{ `${$t('Quantity')}: ${currentReview.num}` }}</p>
            </div>
          </div>
          <div class="review-content">
            <div class="rating">
              <Rate v-model="currentReview.subjectRating" style="font-size: 36px"/>
            </div>
            <div class="comment">
              <Input type="textarea"
                     :autosize="{minRows: 4, maxRows: 4}"
                     v-model="currentReview.content"
                     :maxlength="255"
                     show-word-limit
                     placeholder="Hãy chia sẻ ý kiến của bạn về sản phẩm này nhé..."
              />
              <span
                v-if="currentReview.content.length < 50 || currentReview.images.length < 1">Cần thêm {{
                  50 - currentReview.content.length > 0 ? 50 - currentReview.content.length : 0
                }} kí tự và {{ 1 - currentReview.images.length > 0 ? 1 - currentReview.images.length : 0 }} hình ảnh để nhận 100 BonoCoin</span>
              <span v-else>Gửi đánh giá để nhận 100 BonoCoin</span>
            </div>

            <div class="media mt-4">
              <div class="upload-list_video" v-if="currentReview.videos.length">
                <template>
                  <video :src="currentReview.videos"/>
                  <div class="upload-list-cover">
                    <div>
                      <Icon
                        size="15"
                        type="md-search"
                        @click.native="handleViewVideo(currentReview.videos[0])"
                      ></Icon>
                      <Icon
                        size="15"
                        type="md-trash"
                        @click.native="handleRemoveVideo()"
                      ></Icon>
                    </div>
                  </div>
                  <div class="upload-list-cover play">
                    <div>
                      <Icon
                        size="30"
                        type="md-play"
                      ></Icon>
                    </div>
                  </div>
                </template>
              </div>
              <div
                v-for="(item, index) in currentReview.images"
                :key="index"
                class="upload-list_image"
              >
                <template>
                  <img :src="item" alt=""/>
                  <div class="upload-list-cover">
                    <div>
                      <Icon
                        size="15"
                        type="md-search"
                        @click.native="handleViewPicture(item)"
                      ></Icon>
                      <Icon
                        size="15"
                        type="md-trash"
                        @click.native="handleRemovePicture(index)"
                      ></Icon>
                    </div>
                  </div>
                </template>
              </div>
              <Upload
                ref="upload"
                v-if="!currentReview.videos.length"
                title="Upload video"
                :action="uploadUrl"
                :data="{isTmp: true}"
                :before-upload="handleBeforeUploadVideo"
                accept=".mp4,.mov"
                :format="vidFormat"
                :on-progress="handleOnUploadProgress"
                :headers="{ Authorization: `Bearer ${accessToken.accessToken}` }"
                :max-size="maxVidSize"
                :on-exceeded-size="handleMaxVidSizeError"
                :on-format-error="handleVidFormatError"
                :on-success="handleUploadVidSuccess"
                :show-upload-list="false"
                multiple
                style="margin-left: 10px"
                type="drag"
              >
                <div style="width: 60px; height: 60px; line-height: 60px">
                  <Icon type="ios-film" size="20"/>
                </div>
              </Upload>
              <Upload
                v-if="currentReview.images.length < 5"
                title="Upload image"
                ref="upload"
                :action="uploadUrl"
                :data="{isTmp: true}"
                :before-upload="handleBeforeUploadImage"
                accept=".jpg,.jpeg,.png"
                :format="picFormat"
                :on-progress="handleOnUploadProgress"
                :headers="{ Authorization: `Bearer ${accessToken.accessToken}` }"
                :max-size="maxPicSize"
                :on-exceeded-size="handleMaxPicSizeError"
                :on-format-error="handlePicFormatError"
                :on-success="handleUploadPicSuccess"
                :show-upload-list="false"
                multiple
                style="margin-left: 10px"
                type="drag"
              >
                <div style="width: 60px; height: 60px; line-height: 60px">
                  <Icon type="ios-images" size="20"/>
                </div>
              </Upload>
            </div>
          </div>
        </Card>
        <Modal v-model="isShowImage" footer-hide :ok-text="$t('Ok')">
          <div class="preview-media-edit">
            <img :src="mediaSelectedURL" alt="">
          </div>
        </Modal>
        <Modal v-model="isShowVideo" footer-hide :ok-text="$t('Ok')">
          <div class="preview-media-edit">
            <video controls :src="mediaSelectedURL" alt=""/>
          </div>
        </Modal>
        <!--        <Card style="margin: 10px 0;">-->
        <!--          <div>-->
        <!--            <strong>Đánh giá chuyên gia</strong>-->
        <!--            <div class="rating">-->
        <!--              <Rate v-model="staffReview" style="font-size: 18px"/>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </Card>-->

      </div>
      <div slot="footer">
        <div>
          <Button @click="handleBackReview">{{ $t('Cancel') }}</Button>
          <Button type="primary" @click="handleSendEditReview">{{ $t('Edit') }}</Button>
        </div>
      </div>
    </template>
  </Modal>

</template>

<script>
import {commonUrl} from "@/plugins/request";
import Storage from "@/plugins/storage";
import {editReview} from "@/api/review";

export default {
  name: "ReviewDetail",
  props: {
    orderDetail: {
      type: Object,
      default: function () {
        return {orderItems: []}
      }
    }
  },
  watch: {},
  data() {
    return {
      isShowImage: false,// show edit modal preview image
      isShowVideo: false,// show edit modal preview video
      mediaSelectedURL: "https://minio-api.micro-tech.com.vn/bono/20230711/d4f840d9470b469eb1760d881ef3e15a.jpeg",
      currentIndexImg: null,
      isShowReviewDetail: false,
      previewPic: null,
      maxPicSize: 5120, // in kB
      maxVidSize: 61440, // in kB
      picFormat: ['jpg', 'jpeg', 'png'],
      vidFormat: ['mp4', 'mov'],
      accessToken: "",
      uploadUrl: commonUrl + "/buyer/common/file",
      currentState: 0, // form hiện tại người dùng
      currentReview: {},// sản phẩm đang chỉnh sửa
      userInfo: {},
      editForm: {
        subjectId: "",
        storeId: "",
        subjectType: "",
        staffId: "",
        content: "",
        images: [],
        videos: [],
        subjectRating: 5,
        oldImages: [],
        oldVideos: []
      }
    }
  },
  mounted() {
    this.accessToken = {
      accessToken: Storage.getItem('buyer_accessToken'),
    };
  },
  methods: {

    handleClose() {
      this.currentState = 0
      this.currentReview = {}
    },
    handleBackReview() {
      this.currentState = 0
      this.currentReview = {}
    },
    handleEditReview(item) {
      this.currentReview = JSON.parse(JSON.stringify(item))
      this.currentState = 1
      this.editForm = {
        subjectId: "",
        storeId: "",
        subjectType: "",
        staffId: "",
        content: "",
        images: [],
        videos: [],
        subjectRating: 5,
        oldImages: [],
        oldVideos: []
      }
      this.editForm.oldImages = JSON.parse(JSON.stringify(this.currentReview.images))
      this.editForm.oldVideos = JSON.parse(JSON.stringify(this.currentReview.videos))
    },
    handleSendEditReview() {
      this.$Modal.confirm({
        title: this.$t('Warning'),
        content: this.$t('Are you sure you want to edit this review?'),
        okText: this.$t('Edit'),
        cancelText: this.$t('Cancel'),
        onOk: () => {
          this.editForm.storeId = this.currentReview.storeId
          this.editForm.subjectId = this.currentReview.subjectId
          this.editForm.subjectRating = this.currentReview.subjectRating
          if (this.currentReview.subjectType === 'GOODS') {
            this.editForm.subjectType = 'GOODS'
          } else {
            this.editForm.subjectType = 'SERVICE'
          }
          this.editForm.content = this.currentReview.content
          let data = {
            ...this.editForm,
            images: this.currentReview.images.map(i => {
              if (i.includes('/bono/')) return i
              else return i.split("/tmp/")[1]
            }),
            videos: this.currentReview.videos.map(i => {
              if (i.includes("/bono")) return i
              else return i.split("/tmp/")[1]
            })
          };
          editReview(this.currentReview.id, data).then(res => {
            this.$Message.success(this.$t('Edit review successfully'));
            this.$emit('update')
            this.currentState = 0
            this.isShowReviewDetail = false
          })
        },
      })
    },

    // xử lý xem ở phần xem lại chi tiết review
    handlePreviewMedia(i) {
      if (this.currentIndexImg === i) {
        this.currentIndexImg = null
      } else {
        this.currentIndexImg = i
      }
    },

    // xử lý xem preview ảnh
    handleViewPicture(url) {
      this.mediaSelectedURL = url
      this.isShowImage = true
    },

    handleViewVideo(url) {
      this.isShowVideo = true
      this.mediaSelectedURL = url
    },

    // xử lý xóa ảnh
    handleRemovePicture(index) {
      this.currentReview.images.splice(index, 1)
    },

    // kiểm tra điều kiện trước khi upload file
    handleBeforeUploadImage(e) {
      let check = this.currentReview.images.length < 5
      if (!check) {
        this.$Message.warning('Maximum of 5 images')
        return false
      }
      return true
    },

    // báo lỗi file quá lớn
    handleMaxPicSizeError() {
      this.$Message.warning(this.$t('Image size cannot larger than {0}', [this.maxPicSize]));
    },

    // báo lỗi sai định dạng file
    handlePicFormatError() {
      this.$Message.warning(this.$t('Image format must be in {0}', [this.picFormat.join(", ")]));
    },

    // xử lý sau khi upload thành công
    handleUploadPicSuccess(res, file) {
      if (res.success) {
        this.$Spin.hide()
        this.currentReview.images.push(file.response.result)
      }
    },
    handleOnUploadProgress(e) {
      this.$Spin.show()
    },
    handleRemoveVideo() {
      this.currentReview.videos = []
    },
    // kiểm tra điều kiện trước khi upload file
    handleBeforeUploadVideo() {
      let check = this.currentReview.videos.length > 1
      if (check) {
        this.$Message.warning('Maximum of 1 video')
        return false
      }
      return true
    },
    handleMaxVidSizeError() {
      this.$Message.warning(this.$t('Video size cannot larger than {0}', [this.maxVidSize]));
    },
    handleVidFormatError() {
      this.$Message.warning(this.$t('Video format must be in {0}', [this.vidFormat.join(", ")]));
    },
    handleUploadVidSuccess(res, file) {
      if (res.success) {
        this.$Spin.hide()
        this.currentReview.videos.push(file.response.result)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./review.scss";

.createdAt {
  color: $light_content_color;
  display: flex;
  flex-direction: column;

  p:last-child {
    font-size: 12px;
    color: $title_color;
  }
}

.comment-video {
  position: relative;
  width: 50px;
  height: 50px;
  video {
    border: 1px solid #999;
    width: 50px;
    height: 50px;
  }

  .selected {
    border: 2px solid $primary_color !important;
    padding: 2px;
  }

  .video-cover {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
  }
}

.comment-img {
  display: flex;

  .selected {
    border: 2px solid $primary_color !important;
    padding: 2px;
  }

  .borderColor {
    border-color: $theme_color;
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

.preview-media-edit {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

</style>
