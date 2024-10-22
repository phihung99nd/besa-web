<template>
  <div class="flex flex-column" id="prof-detail">
    <div class="width_1200" style="padding-top: 10px">
      <Breadcrumb>
        <BreadcrumbItem to="/">{{ $t('Home') }}</BreadcrumbItem>
        <BreadcrumbItem to="/expert">{{ $t('Professor') }}</BreadcrumbItem>
        <BreadcrumbItem>{{ clerkDetail.name }}</BreadcrumbItem>
      </Breadcrumb>
      <div class="flex flex-column mt-2 mb-2 professor-page" style="gap: 10px">
        <div class="flex flex-column">
          <div class="flex prof-header">
            <img
              :src="clerkDetail.avatar || require('@/assets/images/default_avatar.jpg')"
              alt=""/>
            <div class="meta-info">
              <div class="name">{{ clerkDetail.name }}</div>
              <div class="position" v-if="clerkDetail.position">{{ clerkDetail.position }}</div>
              <!--              <ul class="flex review">-->
              <!--                <li class="rating">-->
              <!--                  <span>4.8</span>-->
              <!--                  <Rate allow-half disabled :value="4.5"/>-->
              <!--                </li>-->
              <!--                <li class="rating-num">-->
              <!--                  <span>20</span>-->
              <!--                  đánh giá-->
              <!--                </li>-->
              <!--              </ul>-->
              <div class="store" v-if="clerkDetail.storeName">
                  <span>
                    <Icon type="md-home"/>
                    {{ clerkDetail.storeName }}
                  </span>
              </div>
              <div class="flex tag" v-if="clerkDetail.tag">
                <div class="chip" :type="index == 0 ? 'primary' : 'default'"
                     v-for="(tag, index) in clerkDetail.tag.split(',')" :key="index">{{ tag }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex prof-main">
            <div class="prof-desc">
              <div class="desc-item new-review">
                <div>{{ $t('Recent review') }}</div>
                <div class="flex align-item-center justify-content-between total-info">
                  <div class="flex align-item-center">
                    <div class="review-rating-text">
                      <b>{{ reviewStat.avgRating.toFixed(1) }}</b>/5
                    </div>
                    <div class="review-rating-star">
                      <Rate allow-half disabled :value="reviewStat.avgRating"/>
                    </div>
                    <div class="review-rating-count">
                      {{ reviewStat.numberOfRatings }} đánh giá
                    </div>
                  </div>
                  <div style="font-size: 12px; text-decoration: underline; cursor:pointer;" @click="navigateToReview">
                    Xem tất cả
                  </div>
                </div>
                <swiper ref="mySwiper" :options="swiperOptions" style="max-width: 700px">
                  <swiper-slide
                    v-for="(item, index) in commentList"
                    :key="index"
                  >
                    <Card style="margin: 10px 10px">
                      <div class="review-card">
                        <div class="flex meta-info">
                          <Avatar :style="{color: randomTextColor,backgroundColor: '#'+randomBgColor}">
                            {{ item.owner.username.slice(0, 1).toUpperCase() }}
                          </Avatar>
                          <div class="user">
                            <div>{{ item.owner.username }}</div>
                            <div>{{ item.createdAt.slice(0, 10) }}</div>
                          </div>
                          <div class="star">
                            {{ item.subjectRating }}
                            <Icon type="md-star" color="#f5a623"/>
                          </div>
                        </div>
                        <div class="content">
                          <div>
                            {{ item.content }}
                          </div>
                          <div class="flex justify-content-between">
                            <img :src="parseMinioURL(img)" v-for="(img, index) in item.images" :key="index"/>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </swiper-slide>
                </swiper>
              </div>
              <div v-if="clerkDetail.intro" class="desc-item intro">
                <div>{{ $t('Introduction') }}</div>
                <div class="content" v-html="clerkDetail.intro"/>
              </div>
              <div v-if="clerkDetail.certification" class="desc-item certification">
                <div>{{ $t('Certification') }}</div>
                <div class="content" v-html="clerkDetail.certification"/>
              </div>
              <div v-if="clerkDetail.education" class="desc-item education">
                <div>{{ $t('Education') }}</div>
                <div class="content" v-html="clerkDetail.education"/>
              </div>
              <div v-if="clerkDetail.experience" class="desc-item experience">
                <div>{{ $t('Experience') }}</div>
                <div class="content" v-html="clerkDetail.experience"/>
              </div>
              <div class="desc-item gallery" v-if="clerkDetail.galleries.length > 0">
                <div>{{ $t('Gallery') }}</div>
                <div class="gallery-grid">
                  <template v-for="(i, index) in clerkDetail.galleries">
                    <div class="grid-item" v-if="index<12" :key="index" style="position:relative; cursor:pointer;"
                         @click="showGallery(index)">
                      <img :src="parseMinioURL(i)"/>
                      <div v-if="index==11 && clerkDetail.galleries.length>12" class="count-cover">
                        +{{ clerkDetail.galleries.length - 12 }}
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              <div class="desc-item service" v-if="serviceList.length > 0">
                <div>{{ $t('Featured service') }}</div>
                <div class="flex flex-wrap gap-4">
                  <div class="flex service-card" v-for="(item, index) in serviceList" :key="index"
                       @click="showServiceModal(index)">
                    <img
                      :src="parseMinioURL(item.thumbnail)"/>
                    <div class="meta-info">
                      <div class="name">{{ item.name }}
                      </div>
                      <!--                      <div class="desc">{{item.intro}}-->
                      <!--                      </div>-->
                      <div class="more-btn">Chi tiết</div>
                      <div class="price">
                        <span>{{ item.price | unitPrice('₫', 'before') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="desc-item review" id="all-review">
                <div>{{ $t('Review') }}</div>
                <div class="flex align-item-center total-info">
                  <div class="review-rating-text">
                    <b>{{ reviewStat.avgRating.toFixed(1) }}</b>/5
                  </div>
                  <div class="review-rating-star">
                    <Rate allow-half disabled :value="reviewStat.avgRating"/>
                  </div>
                  <div class="review-rating-count">
                    {{ reviewStat.numberOfRatings }} đánh giá
                  </div>
                </div>
                <!--                TODO-->
                <!--                <div class="flex filter">-->
                <!--                  <RadioGroup size="small" v-model="filterCommentForm.subjectRating" type="button">-->
                <!--                    <Radio label="ALL">Tất cả</Radio>-->
                <!--                    <Radio label="4+">4.0+</Radio>-->
                <!--                    <Radio label="3+">3.0+</Radio>-->
                <!--                    <Radio label="3-"><3.0</Radio>-->
                <!--                  </RadioGroup>-->
                <!--                </div>-->
                <div v-for="(item,index) in commentList" :key="index">
                  <CommentItem :comment-detail="item" @update="handleReloadComment" layout="column"></CommentItem>
                </div>
                <Spin fix v-if="commentLoading"></Spin>
                <div class="text-center mt-2">
                  <Button size="large" @click="handleMoreComment" v-if="commentList.length < totalComment">
                    {{ $t('Show more') }}
                  </Button>
                </div>
              </div>
            </div>
            <!--region Bookform-->
            <div class="prof-calendar" :animate="addToForm">
              <div>{{ $t('Book now') }}</div>
              <div>Đặt lịch trực tiếp với chuyên gia <span>{{ clerkDetail.name }}</span></div>
              <Dropdown v-model="bookForm.serviceId" placeholder="Dịch vụ" :option="serviceList"
                        style="margin-bottom: 10px;"/>
              <Dropdown v-if="bookForm.serviceId" v-model="bookForm.branch" placeholder="Chi nhánh" :option="branchList"
                        style="margin-bottom: 10px;"/>
              <div v-if="bookForm.branch" style="display: flex; gap: 10px">
                <DatePicker
                  ref="date"
                  v-model="bookForm.date"
                  :clearable=true
                  :options="dateOption"
                  placeholder="Ngày"
                  format="yyyy-MM-dd"
                  type="date"
                  style="margin-bottom: 10px; flex: 1 1"
                />
                <Dropdown v-model="bookForm.slot" placeholder="Giờ hẹn" :option="slotList"
                          style="flex:1 1;"/>
              </div>
              <div v-if="bookForm.slot" style="margin-bottom: 10px;">
                <span class="fontsize_16 mb_10">{{ $t('Service sku') }}</span>
                <br>
                <div @click="handleClickServiceSku(item)" :class="{'chip-checked': bookForm.serviceSku == item.id}"
                     class="chip" v-for="(item, index) in skuList" :key="index">
                  <div class="chip-content">
                    {{ item.name }}
                  </div>
                </div>
              </div>
              <Button
                :disabled="!(bookForm.slot && bookForm.serviceId && bookForm.branch && bookForm.date && bookForm.serviceSku)"
                @click="bookNow" type="primary" size="large" style="margin-bottom: 10px;">Đặt lịch
              </Button>
            </div>
            <!--endregion-->
          </div>
        </div>
      </div>
    </div>
    <Introduce></Introduce>
    <BaseFooter></BaseFooter>
    <Transition>
      <div v-show="windowTop > 200" class="scroll-top">
        <img alt="" src="@/assets/images/scroll-up.png" width="80" @click="scrollTop"/>
      </div>
    </Transition>
    <ServiceItemModal v-if="currentSelectedService" :service="currentSelectedService" @on-book="handleBookService"/>
  </div>
</template>

<script>
import Dropdown from "@/components/dropdown/Dropdown.vue";
import Introduce from "@/components/footer/Introduce.vue";
import {swiper, swiperSlide} from "vue-awesome-swiper";
import CommentItem from "@/pages/home/memberCenter/evaluation/CommentItem.vue";
import ServiceModal from "@/pages/professor/component/ServiceModal.vue";
import ServiceItemModal from "@/pages/professor/component/ServiceItemModal.vue";
import NavigationBar from "@/pages/index/NavigationBar.vue";
import {getClerkDetail} from "@/api/member";
import {getReview, getReviewStat} from "@/api/review";
import {getServicesListNotPagination, getServicesSku, getServicesSlot} from "@/api/services";
import mixins from "@/plugins/mixins"
import {getBranch} from "@/api/shopentry";
import {addCartServices} from "@/api/cart";

export default {
  name: "ProfessorDetail",
  components: {
    NavigationBar,
    ServiceItemModal,
    ServiceModal,
    CommentItem,
    Introduce,
    Dropdown,
    swiper,
    swiperSlide
  },
  mixins: [mixins],
  data() {
    return {
      windowTop: 0,
      serviceList: [],
      currentSelectedService: "",
      addToForm: false,
      branchList: [],
      skuList: [],
      bookForm: {
        serviceId: '',
        branch: '',
        date: new Date(),
        slot: '',
        serviceSku: ''
      },
      //MOCK
      slotList: ['9:00', '10:00', '11:00'],
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      swiperOptions: {
        grabCursor: true,
        slidesPerView: 2,
        // slidesPerGroup: 2,
        autoplay: {
          delay: 10000,
          disableOnInteraction: false
        },
        loop: false,
      },
      commentList: [],
      reviewStat: {avgRating: 0, numberOfRatings: 0},
      totalComment: 0,
      filterCommentForm: {
        subjectRating: '',
        page: 1,
        limit: 5
      },
      commentLoading: false,
      clerkDetail: {
        galleries: []
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    window.addEventListener("scroll", () => {
      this.windowTop = window.scrollY;
    });
  },
  computed: {
    randomBgColor() {
      return Math.floor(Math.random() * 16777215).toString(16);
    },
    randomTextColor() {
      return this.betterContrastColor(this.randomBgColor)
    }
  },
  watch: {
    'bookForm.serviceId': {
      handler(val) {
        this.bookForm.branch = ""
        const params = {
          storeId: this.clerkDetail.storeId,
          serviceId: val.id,
          clerkId: this.$route.query.id,
        }
        getBranch(params).then(res => {
          this.branchList = res.result.map(i => ({...i, name: i.addressName}))
        })
        getServicesSku(val.id).then(res => {
          this.skuList = res.result
        })
      },
      deep: true
    },
    'bookForm.branch': {
      handler(val) {
        const paramsSlot = {
          serviceId: this.bookForm.serviceId.id,
          storeAddressId: val.id,
          storeId: this.clerkDetail.storeId,
          date: this.formatDate(this.bookForm.date),
        }
        getServicesSlot(paramsSlot).then(res => {
          this.slotList = res
          this.bookForm.slot = ""
        })
      },
      deep: true
    },
    "bookForm.date": {
      handler(val) {
        const paramsSlot = {
          serviceId: this.bookForm.serviceId.id,
          storeAddressId: this.bookForm.branch.id,
          storeId: this.clerkDetail.storeId,
          date: this.formatDate(val),
        }
        getServicesSlot(paramsSlot).then(res => {
          this.slotList = res
          this.bookForm.slot = ""
        })
      }
    },
  },
  methods: {
    init() {
      if (this.$route.query.id) {
        Promise.all([this.handleInitClerkDetail(), this.handleInitReviewList(), this.handleInitServiceList(), this.handleInitReviewStat()])
      } else {
        this.$router.push({name: 'Professor'})
      }
    },
    handleInitClerkDetail() {
      getClerkDetail(this.$route.query.id).then(res => {
        if (res.success) {
          this.clerkDetail = res.result
        }
      })
    },
    handleInitServiceList() {
      let params = {
        clerkId: this.$route.query.id,
        marketEnable: 'UPPER',
        authFlag: 'PASS'
      }
      getServicesListNotPagination(params).then(res => {
        this.serviceList = res.result
      })
    },
    handleInitReviewStat() {
      getReviewStat({subjectType: "STAFF", subjectId: this.$route.query.id}).then(res => {
        this.reviewStat = res || {avgRating: 0, numberOfRatings: 0}
      })
    },
    handleInitReviewList() {
      this.commentLoading = true
      let params = {
        ...this.filterCommentForm,
        subjectId: this.$route.query.id,
        subjectType: 'STAFF',
      }
      getReview(params).then(res => {
        this.commentList.push(...res.items)
        this.totalComment = +res.meta.totalItems
      }).finally(() => {
        this.commentLoading = false
      })
    },
    showGallery(index) {
      this.$viewerApi({
        images: [...this.clerkDetail.galleries],
        options: {
          initialViewIndex: index
        }
      })
    },
    navigateToReview() {
      const id = 'all-review';
      const yOffset = -110; // trừ đi phần header sticky trên top
      const element = document.getElementById(id);
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({top: y, behavior: 'smooth'});
    },
    formatDate(val) {
      return new Date(new Date(val).getTime() - (new Date(val).getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0]
    },
    handleClickServiceSku(val) {
      this.bookForm.serviceSku = val.id
    },
    scrollTop() {
      document.getElementById('prof-detail').scrollIntoView({behavior: 'smooth'});
    },
    handleReloadComment() {
      let params = {
        ...this.filterCommentForm,
        subjectId: this.$route.query.id,
        subjectType: 'STAFF',
      }
      getReview(params).then(res => {
        this.commentList = res.items
        this.totalComment = +res.meta.totalItems
      })
    },
    handleMoreComment() {
      this.commentLoading = true
      setTimeout(() => {
        this.filterCommentForm.page++
        this.handleInitReviewList()
      }, 1000)
    },
    showServiceModal(index) {
      this.currentSelectedService = this.serviceList[index]
      this.$modal.show('service')
    },
    handleBookService() {
      this.$modal.hide('service')
      this.bookForm.serviceId = this.currentSelectedService
      this.addToForm = true
      setTimeout(() => {
        this.addToForm = false
      }, 500)
    },
    bookNow() {
      // const formatDate = new Date(this.bookForm.date).toISOString().split('T')[0]
      const date = new Date(this.bookForm.date);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formatDate = `${year}-${month}-${day}`;

      const params = {
        num: 1,
        cartType: "SERVICE",
        storeAddressId: this.bookForm.branch.id,
        serviceId: this.bookForm.serviceId.id,
        skuId: this.bookForm.serviceSku,
        bookDateTime: [formatDate, [this.bookForm.slot]].join('T'),
        clerkIds: [this.clerkDetail.id]
      };
      addCartServices(params).then((res) => {
        if (res.success) {
          this.$router.push({
            path: "/checkout",
          });
        } else {
          this.$Message.warning(res.message);
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "professor";

/deep/ .ivu-input {
  height: 42px;
}

/deep/ .ivu-input-suffix i {
  line-height: 42px;
}

.review-card {
  .meta-info {
    gap: 10px;

    > img {
      width: 30px;
      height: 30px;
      object-fit: cover;
      border-radius: 50%;
    }

    > .user {
      flex: 1 1;

      div:nth-of-type(1) {
        font-size: 12px;
        font-weight: 600;
      }

      div:nth-of-type(2) {
        font-size: 9px;
        font-weight: 500;
      }
    }

    > .star {

    }
  }

  .content {
    margin-top: 4px;

    div:nth-of-type(1) {
      font-size: 12px;
      line-height: 14px;
      height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: pre-line;
    }

    div:nth-of-type(2) {
      margin-top: 4px;

      > img {
        width: 65px;
        height: 65px;
        object-fit: cover;
        border-radius: 4px;
      }
    }
  }
}

.chip {
  display: inline-flex;
  flex-direction: row;
  border: 1px solid $border_color;
  height: 36px;
  outline: none;
  font-size: 14px;
  align-items: center;
  border-radius: 14px;
  vertical-align: middle;
  text-decoration: none;
  justify-content: center;
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: $dominant_color_tone;
  }

  .chip-content {
    max-width: 320px;
    align-items: center;
    user-select: none;
    padding: 0 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;

  }
}

.chip-checked {
  border: 1px solid $accent_color;
  color: $accent_color;
  background-color: $dominant_color_tone;
}

.review /deep/ .filter {
  gap: 10px;
  margin: 10px 0;
}

.scroll-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  cursor: pointer;

  img {
    object-fit: cover;
  }
}

.ivu-radio-group-button /deep/ .ivu-radio-wrapper {
  margin-right: 5px;
  width: 60px;
  border-radius: 30px !important;
  border: solid 1px #cbcbcb;
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

.ivu-radio-group-button .ivu-radio-wrapper {
  padding: 0 10px;
  text-align: center;
  font-size: 12px;
}
</style>
