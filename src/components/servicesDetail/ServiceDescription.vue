<template>
  <div>
    <div class="service-slot">
      <div class="flex flex-column slot-left" style="gap: 12px">
        <div class="desc-item new-review" v-if="commentList.length > 0">
          <h2 class="service-detail-title">{{ $t('Recent review') }}</h2>
          <div class="flex align-item-center justify-content-between total-info">
            <div class="flex align-item-center">
              <div class="review-rating-text">
                <b>{{ rating.avgRating.toFixed(1) }}</b>/5
              </div>
              <div class="review-rating-star">
                <Rate allow-half disabled :value="rating.avgRating||0"/>
              </div>
              <div class="review-rating-count">
                {{ rating.numberOfRatings }} {{ $t('reviews') }}
              </div>
            </div>
            <div style="font-size: 12px; text-decoration: underline; cursor:pointer;" @click="scrollToReview">
              Xem tất cả
            </div>
          </div>
          <swiper ref="mySwiper" :options="swiperOptions" style="max-width: 800px">
            <swiper-slide
              v-for="(item, index) in commentList.slice(0, 4)"
              :key="index"
            >
              <Card style="margin: 10px 10px; height: 165px;">
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
                    <div class="flex justify-content-start gap-2">
                      <img :src="img" v-for="(img, index) in item.images" :key="index"/>
                    </div>
                  </div>
                </div>
              </Card>
            </swiper-slide>
          </swiper>
        </div>
        <h2 class="service-detail-title">Thông tin nhà cung cấp dịch vụ</h2>
        <div class="flex" style="gap: 12px">
          <ShopHeader @on-fav-change="storeCollect" :width="800" :detail="store" :fav="storeCollected"/>
        </div>
        <div>
          <h2 class="service-detail-title">Thông tin dịch vụ</h2>
          <div v-html="service.intro" class="overflow-auto intro-html"/>
        </div>
        <div>
          <h2 id="comment-list" class="service-detail-title">{{ $t('Service review') }}</h2>
          <div ref="itemGoodsComment" class="review-container">
            <div class="reviews-rating flex align-item-center">
              <div class="review-text">
                <b>{{ rating.avgRating.toFixed(1) }}</b>
                /5
              </div>
              <div class="review-star">
                <Rate :value="4" disabled/>
              </div>
              <span class="review-count">{{ rating.numberOfRatings }} {{ $t('reviews') }}</span>
            </div>
            <Divider/>
            <div v-if="commentList.length == 0" style="text-align: center;margin-top: 20px;">
              {{ $t('Have not any review') }}
            </div>
            <div v-for="(item,index) in commentList" v-else :key="index">
              <CommentItem @update="getList" :comment-detail="item" layout="column"></CommentItem>
            </div>
            <div class="remarks-page">
              <Page
                size="small"
                :total="commentTotal"
                :page-size="+commentParams.limit"
                @on-change="changePage"
                show-total
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from "@/components/dropdown/Dropdown";
import {getReview} from "@/api/review";
import CommentItem from "@/pages/home/memberCenter/evaluation/CommentItem";
import {swiper, swiperSlide} from "vue-awesome-swiper";
import ShopHeader from "@/components/header/ShopHeader";
import {cancelCollectShop, collectShop, isCollectionShop} from "@/api/member";
import mixins from "@/plugins/mixins";
import BsSkeleton from "@/components/skeleton";

export default {
  name: "ServiceDescription",
  components: {
    ShopHeader,
    Dropdown,
    CommentItem,
    swiper,
    swiperSlide,
    BsSkeleton,
  },
  props: ['service', 'store', 'rating'],
  mixins: [mixins],
  data() {
    return {
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
      storeCollected: false,
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
        }
      ],
      commentList: [],
      commentParams: {
        subjectType: "SERVICE",
        subjectId: this.service.id,
        page: 1,
        limit: 10
      },
      commentTotal: 0
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getStoreCollect()
  },
  computed: {
    randomBgColor() {
      return Math.floor(Math.random() * 16777215).toString(16);
    },
    randomTextColor() {
      return this.betterContrastColor(this.randomBgColor)
    }
  },
  methods: {
    getList() {
      getReview(this.commentParams).then(res => {
        this.commentList = res.items
        this.commentTotal = +res.meta.totalItems
      })

    },
    getStoreCollect() {
      if (this.Cookies.getItem("buyer_userInfo") && this.store.id) {
        isCollectionShop(this.store.id)
          .then((res) => {
            if (res.success && res.result) {
              this.storeCollected = true;
            }
          })

      }
    },
    async storeCollect() {
      if (this.storeCollected) {
        let cancel = await cancelCollectShop(this.store.id);
        if (cancel.success) {
          this.storeCollected = false;
        }
      } else {
        let collect = await collectShop(this.store.id);
        if (collect.success) {
          this.storeCollected = true;
        }
      }
    },
    scrollToReview() {
      document.getElementById('comment-list').scrollIntoView({behavior: 'smooth'});
    },
    changePage(v) {
      this.commentParams.page = v
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
.intro-html {
  width: 800px;

  /deep/ img {
    max-width: 800px !important;
    height: auto !important;
    object-fit: cover;
  }

  /deep/ li {
    list-style: disc inside !important;
  }
}

.slot-left {
  /deep/ .ivu-card-head {
    padding: 6px 14px;
  }
}

.service-detail-title {
  position: relative;
  padding-left: 10px;
  margin: 12px 0;

  &:before {
    content: "";
    position: absolute;
    display: block;
    background-color: $accent_color;
    left: 0;
    top: 3px;
    width: 3px;
    height: 24px;
    border-radius: 3px;
  }
}

.policy-header {
}

.shop-desc {
  text-align: justify;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 5;
}

.service-slot {
  position: relative;
}


.content {
  .avatar {
    width: 100px;
  }

  .description {
    flex: 1;
  }
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

.total-info {
  gap: 8px;
  margin-bottom: 0;

  .review-rating-text {
    font-size: 14px;

    > b {
      font-size: 40px;
    }
  }

  .review-rating-star {
    .ivu-rate {
      font-size: 28px;
    }
  }

  .review-rating-count {
    font-size: 14px;
  }
}

.review-container {
  .review {
    gap: 10px;

    .chip {
      padding: 4px 10px;
      border-radius: 15px;
      border: 1px solid $border_color;
      width: fit-content;
      overflow: hidden;
      position: relative;

      &:hover {
        cursor: pointer;
        background: #eee;
      }

      &:active {
        background: $accent_color;
        border: 1px solid $accent_color;
        color: #fff;
      }
    }
  }
}

.reviews-rating {
  .review-text {
    font-size: 16px;
    line-height: 1.5;
    font-weight: 400;
    color: #212121;

    b {
      font-size: 44px;
      line-height: 1.32;
      font-weight: 600;
    }
  }

  .review-star {
    .ivu-rate {
      font-size: 28px;
    }

    margin-left: 8px;
  }
}


</style>
