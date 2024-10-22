<template>
  <div class="flex flex-column" style="gap: 10px">
    <template v-if="service&&rating">
      <div class="flex">
        <h1>{{ service.name }}</h1>
      </div>
      <div class="desc flex justify-content-between" style="width: 800px">
        <div class="flex">
          <div class="flex align-baseline" v-if="rating.numberOfRatings">
            <Iconify icon="twemoji:star"/>
            <p class="hover-pointer" @click="handleScrollToReview"> {{ rating.avgRating.toFixed(1) }}
              ({{ rating.numberOfRatings | roundedToThousand }} {{ $t('reviews') }})</p>
          </div>
          <div v-else>{{ $t('No review') }}</div>
          <div class="ml_20">
            <p>{{ service.buyCount | roundedToThousand }} lượt đã được đặt</p>
          </div>
        </div>
        <div class="flex liked" :class="{active: liked}" @click="collect">
          <Iconify class="fontsize_18 icon" :icon="liked ? 'ph:heart-fill' : 'ph:heart-light'"/>
          <p>{{ liked ? 'Đã thích' : 'Yêu thích' }}</p>
        </div>
      </div>
      <div class="banner flex">
        <div class="banner-left" id="banner-left">
          <img
            @click="showGallery(currentState)"
            :src="allRelatedImage[currentState]"
            alt="">
          <div class="img-list">
            <swiper style="height: 90px; width: 800px" :options="swiperOptions">
              <swiper-slide
                v-for="(item, index) in allRelatedImage" :key="index">
                <img :class="currentState == index ? 'selected' : 'img-item'" @click="handleSelectImage(item)"
                     :src="item"/>
              </swiper-slide>
            </swiper>
          </div>
          <div class="flex align-items-end" style="gap: 12px">
            <div class="share">
              <span>{{ $t('Share') }}: </span>
              <Button icon="logo-facebook" shape="circle" size="small"></Button>&nbsp;
              <Button icon="logo-twitter" shape="circle" size="small"></Button>&nbsp;
              <Button icon="logo-googleplus" shape="circle" size="small"></Button>&nbsp;
              <Button icon="logo-tumblr" shape="circle" size="small"></Button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-column gap-2">
        <bs-skeleton width="500px" height="36px" border-radius="8px"/>
        <div class="flex justify-content-between">
          <bs-skeleton width="200px" height="20px" border-radius="6px"/>
          <bs-skeleton width="100px" height="20px" border-radius="6px"/>
        </div>
        <bs-skeleton width="800px" height="400px" border-radius="12px"/>
        <div class="flex gap-2">
          <bs-skeleton width="80px" height="80px" border-radius="8px"/>
          <bs-skeleton width="80px" height="80px" border-radius="8px"/>
          <bs-skeleton width="80px" height="80px" border-radius="8px"/>
        </div>
      </div>
    </template>
  </div>

</template>

<script>

import {swiper, swiperSlide} from "vue-awesome-swiper";
import Dropdown from "@/components/dropdown/Dropdown";
import {roundedToThousand} from "@/plugins/filters";
import {cancelCollectService, collectService, isCollectionService} from "@/api/member";
import BsSkeleton from "../skeleton/index.vue";

export default {
  name: "ServiceOverView",
  components: {
    BsSkeleton,
    Dropdown,
    swiper,
    swiperSlide
  },
  props: ['service', 'rating'],
  data() {
    return {
      currentState: 0,
      swiperOptions: {
        slidesPerView: 9,
        autoplay: false,
        loop: false,
        freeMode: true,
      },
      slotList: [
        "12:00", "13:00", "14:00", "15:00"
      ],
      liked: false
    }
  },
  created() {
    if (this.Cookies.getItem("buyer_userInfo")) {
      isCollectionService(this.$route.query.id)
        .then(res => {
          this.liked = res.result
        })
    }
  },
  computed: {
    allRelatedImage() {
      let list = []
      list.push(...this.service.serviceGalleryList)
      this.service.skus.forEach(i => {
        if (i.thumbnail) {
          list.push(i.thumbnail.split(/[?#]/)[0])
        }
      })
      list = Array.from(new Set(list))
      return list
    }
  },
  methods: {
    showGallery(index) {
      this.$viewerApi({
        images: [...this.allRelatedImage],
        options: {
          initialViewIndex: index
        }
      })
    },
    handleSelectImage(val) {
      this.currentState = this.allRelatedImage.indexOf(new URL(val).origin+new URL(val).pathname)
    },
    handleScrollToReview() {
      this.$parent.$refs.serviceDescription.scrollToReview()
    },
    collect() {
      if (this.liked) {
        cancelCollectService(this.service.id).then(res => {
          if (res.success) {
            this.liked = false;
          }
        })
      } else {
        collectService(this.service.id).then(res => {
          if (res.success) {
            this.liked = true;
          }
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.banner {
  width: 800px;
}

.banner-left {
  margin-right: 6px;
  position: relative;
  width: 800px;

  > img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 10px;
    box-shadow: rgba(100, 100, 111, 0.1) 0px 6px 20px 0px;
  }

  .img-item {
    width: 80px;
    height: 80px;
    object-fit: cover;
    cursor: pointer;
    margin-right: 8px;
    border: 2px solid #d1d5db;
    border-radius: 6px;
  }

}


.selected {
  padding: 2px;
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  margin-right: 8px;
  border-radius: 6px;
  border: 2px solid $accent_color !important;
}

.desc {
  .liked {
    cursor: pointer;
    width: 80px;
    justify-content: space-between;

    &.active {
      color: $accent_color;

      .icon {
        animation: pulse 1.5s;
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  20% {
    transform: scale(1.4);
  }
  50% {
    transform: scale(.9);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
