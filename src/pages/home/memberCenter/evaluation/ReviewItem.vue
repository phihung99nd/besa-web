<template>
  <Card>
    <div class="product-content">
      <div class="product-img">
        <img v-if="orderItem.orderType == 'SERVICE'" :src="orderItem.orderItems[0].image"
             :alt="orderItem.orderItems[0].name"/>
        <img v-else :src="orderItem.image" :alt="orderItem.name"/>
      </div>
      <div class="product-info">
        <p v-if="orderItem.orderType == 'SERVICE'" style="size: 18px; font-weight: bold">
          {{ orderItem.orderItems[0].name }}</p>
        <p v-else style="size: 18px; font-weight: bold">{{ orderItem.name }}</p>
        <p>{{ `${$t('Quantity')}: ${orderItem.num}` }}</p>
      </div>
    </div>
    <div class="review-content">
      <div class="rating">
        <Rate v-model="form.subjectRating" style="font-size: 36px"/>
      </div>
      <div class="tag mb-4">
        <div class="chip" v-for="(item, index) in tagList" :key="index" @click="handleClickTag">{{
            item.content
          }}
        </div>
      </div>
      <div class="comment">
        <Input type="textarea"
               :autosize="{minRows: 4, maxRows: 4}"
               v-model="form.content"
               :maxlength="255"
               show-word-limit
               placeholder="Hãy chia sẻ ý kiến của bạn về sản phẩm này nhé..."
        />
<!--        <span-->
<!--          v-if="form.content.length < 50 || form.images.length < 1">Cần thêm {{-->
<!--            50 - form.content.length > 0 ? 50 - form.content.length : 0-->
<!--          }} kí tự và {{ 1 - form.images.length > 0 ? 1 - form.images.length : 0 }} hình ảnh để nhận 100 BonoCoin</span>-->
<!--        <span v-else>Gửi đánh giá để nhận 100 BonoCoin</span>-->
      </div>

      <div class="media mt-4">
        <div class="upload-list_video" v-if="form.videos">
          <template>
            <video :src="form.videos"/>
            <div class="upload-list-cover">
              <div>
                <Icon
                  size="15"
                  type="md-search"
                  @click.native="handleViewVideo()"
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
          v-for="(item, index) in form.images"
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
          v-if="!form.videos"
          title="Upload video"
          :action="uploadUrl"
          :data="{isTmp: true}"
          :before-upload="handleBeforeUploadVideo"
          accept=".mp4,.mov"
          :format="vidFormat"
          :headers="{ Authorization: `Bearer ${accessToken.accessToken}` }"
          :max-size="maxVidSize"
          :on-exceeded-size="handleMaxVidSizeError"
          :on-format-error="handleVidFormatError"
          :on-success="handleUploadVidSuccess"
          :show-upload-list="false"
          style="margin-left: 10px"
          type="drag"
        >
          <div style="width: 60px; height: 60px; line-height: 60px">
            <Icon type="ios-film" size="20"/>
          </div>
        </Upload>
        <Upload
          v-if="form.images.length < 5"
          title="Upload image"
          ref="upload"
          :action="uploadUrl"
          :data="{isTmp: true}"
          :before-upload="handleBeforeUploadImage"
          accept=".jpg,.jpeg,.png"
          :format="picFormat"
          :headers="{ Authorization: `Bearer ${accessToken.accessToken}` }"
          :max-size="maxPicSize"
          :on-exceeded-size="handleMaxPicSizeError"
          :on-format-error="handlePicFormatError"
          :on-success="handleUploadPicSuccess"
          :show-upload-list="false"
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
</template>

<script>
import {commonUrl} from "@/plugins/request";
import Storage from "@/plugins/storage";
import storage from "@/plugins/storage";
import {getTemplateReply} from "@/api/review";

export default {
  name: "ReviewItem",
  props: {
    orderItem: {
      type: Object,
    },
  },
  data() {
    return {
      rating: 5,
      comment: "",
      anonymous: false,
      picList: [],
      tagList: [],
      videos: [],
      previewPic: null,
      maxPicSize: 5120, // in kB
      maxVidSize: 61440, // in kB
      picFormat: ['jpg', 'jpeg', 'png'],
      vidFormat: ['mp4', 'mov'],
      accessToken: "",
      uploadUrl: commonUrl + "/buyer/common/file",
      userInfo: {},
      form: {
        subjectId: this.orderItem.goodsId,
        subjectType: "GOODS",
        content: "",
        images: [],
        videos: null,
        subjectRating: 5,
      },


    }

  },
  mounted() {
    this.accessToken = {
      accessToken: Storage.getItem('buyer_accessToken'),
    };
    getTemplateReply({lang: this.$root.$i18n.locale == 'vi-VN' ? 'VI' : 'EN'}).then(res => {
      if (res.success) {
        this.tagList = res.result.content
      }
    })
    this.userInfo = JSON.parse(storage.getItem('buyer_userInfo'))
    if(this.$parent.$parent._props.order.orderType == 'SERVICE'){
      this.form.subjectType = 'SERVICE'
      this.form.subjectId = this.$parent.$parent._props.order.serviceId
    }else {
      this.form.subjectType = 'GOODS'
    }
    this.$parent.$parent.form.ratingItems.push(this.form)
  },
  destroyed() {
    this.$parent.$parent.form.ratingItems.pop()
  },
  methods: {
    handleClickTag(e) {
      this.form.content = (this.form.content == "" ?
        this.form.content + e.target.innerHTML
        : this.form.content + "\n" + e.target.innerHTML).slice(0, 255)

    },


    // xử lý xem preview ảnh
    handleViewPicture(url) {
      //TODO emit event ra modal ở cha
      let val = {
        url: url,
        isShow: true,
      }
      this.$emit('change-img', val)
      this.previewPic = url
      this.isShowImage = true
    },

    // xử lý xóa ảnh
    handleRemovePicture(index) {
      this.form.images.splice(index, 1)
    },

    // kiểm tra điều kiện trước khi upload file
    handleBeforeUploadImage(e) {
      let check = this.picList.length < 5
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
        this.form.images.push(file.response.result)
      }
    },
    handleViewVideo() {
      //TODO: emit lên modal cha
      this.$emit('showVideo', this.form.videos)
    },
    handleRemoveVideo() {
      this.form.videos = null
    },
    // kiểm tra điều kiện trước khi upload file
    handleBeforeUploadVideo() {
      let check = this.form.videos == null
      if (!check) {
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
        this.form.videos = file.response.result
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "./review.scss";
</style>
