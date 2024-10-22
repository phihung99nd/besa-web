<template>
  <div>
    <swiper ref="mySwiper" :options="swiperOptions">
<!--      <swiper-slide>-->
<!--        <div @click="handleSelectClerk('random')" @mouseover="handleShowDetailClerk(null)"-->
<!--             class="hover-pointer clerk-content flex flex-column align-item-center">-->
<!--          <Avatar :class="{'isSelected': selectedClerks.length === 0}" class="clerk-avatar"-->
<!--                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV12C1vYylF-r-JU4BxODpFs0EmjEQZbHUnJJ7tktYxTawt90AJzym8jqGUBuIEj55gQU&usqp=CAU"/>-->
<!--          <Iconify v-if=" selectedClerks.length === 0" class="checked" icon="icon-park-solid:check-one"/>-->
<!--          <h5 class="clerk-name">{{ $t('BESA chọn') }}</h5>-->
<!--        </div>-->
<!--      </swiper-slide>-->
      <swiper-slide
        v-for="(item,index) in clerkList" :key="item.clerkId"
      >
        <div @click="handleSelectClerk(item)" @mouseover="handleShowDetailClerk(item)"
             class="hover-pointer clerk-content flex flex-column align-item-center">
          <Avatar :class="{'isSelected': selectedClerks.map(i=>i.clerkId).includes(item.clerkId)}" class="clerk-avatar"
                  :src="item.avatar || require('@/assets/images/default_avatar.jpg')"/>
          <Iconify v-if="selectedClerks.map(i=>i.clerkId).includes(item.clerkId)" class="checked" icon="icon-park-solid:check-one"/>
          <h5 class="clerk-name">{{ item.clerkName }}</h5>
        </div>
      </swiper-slide>
    </swiper>
<!--    <Card class="mt_10 clerk-detail" dis-hover v-if="!clerkDetail">-->
<!--      <div slot="title" class="flex justify-content-between align-item-center">-->
<!--        <h4>{{ $t('Nhân viên ngẫu nhiên') }}</h4>-->
<!--      </div>-->
<!--      <div class="flex align-item-center">-->
<!--        <Avatar style="width: 100px; height: 100px" shape="square"-->
<!--                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV12C1vYylF-r-JU4BxODpFs0EmjEQZbHUnJJ7tktYxTawt90AJzym8jqGUBuIEj55gQU&usqp=CAU"/>-->
<!--        <div class="clerk-detail-desc">-->
<!--          <span>-->
<!--            {{ $t('BESA sẽ chọn cho bạn nhân viên tốt nhất. Yên tâm bạn nhé!') }}-->
<!--          </span>-->
<!--        </div>-->
<!--      </div>-->
<!--    </Card>-->
    <Card class="mt_10 clerk-detail" dis-hover v-if="clerkDetail">
      <div slot="title" class="flex justify-content-between align-item-center">
        <div class="flex flex-column">
          <h4>{{ clerkDetail.clerkName }}</h4>
<!--          <Rate :value="clerkDetail.rating" disabled/>-->
        </div>
        <span class="fontsize_18 global_color fw-bold">
<!--            {{ clerkDetail.price | unitPrice("₫",  "before") }}-->
          </span>
      </div>
      <div class="flex">
        <Avatar style="width: 100px; height: 100px" shape="square" :src="clerkDetail.avatar || require('@/assets/images/default_avatar.jpg')"/>
        <div class="clerk-detail-desc flex-column flex">
          <span>
            {{ clerkDetail.description }}
          </span>
          <a style="text-align: end" target="_blank" :href="`/expert/detail?id=${clerkDetail.clerkId}`">{{ $t('Xem chi tiết') }}</a>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import {swiper, swiperSlide} from "vue-awesome-swiper";

export default {
  name: "SelectClerk",
  components: {
    swiper,
    swiperSlide
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    clerkList: {
      type: Array,
      default: []
    },
    max: {
      type: Number,
    }
  },
  data() {
    return {
      isShowSelectClerk: false,
      currentState: 0,
      clerkDetail: null,
      swiperOptions: {
        grabCursor: true,
        slidesPerView: 4,
        autoplay: false,
        loop: false,
        freeMode: true,
        // navigation: {
        //   nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev',
        // }
      },
      isSelected: false,
      selectedClerks: this.value,
    }
  },
  methods: {
    handleShowDetailClerk(val) {
      this.clerkDetail = val
    },
    //click chọn clerk
    // TODO sửa name thành id
    handleSelectClerk(val) {
      // if (val === 'random') {
      //   this.selectedClerks = []
      //   this.clerkDetail = null
      //   this.$emit('input', this.selectedClerks)
      //   this.$emit('on-change', this.selectedClerks)
      //   return
      // }
      if (this.selectedClerks.map(i => i.clerkId).includes(val.clerkId)) {
        this.selectedClerks = this.selectedClerks.filter(obj => obj.clerkId !== val.clerkId);
      } else {
        if(this.selectedClerks.length == this.max) {
          this.selectedClerks.pop()
          this.selectedClerks.push(val)
        } else {
          this.selectedClerks.push(val)
        }
      }
      this.$emit('input', this.selectedClerks)
      this.$emit('on-change', this.selectedClerks)

    },
  }
}
</script>

<style lang="scss" scoped>
.clerk-detail {
  /deep/ .ivu-card-head {
    padding: 12px 16px;
  }

  .clerk-detail-desc {
    flex: 1;
    margin-left: 12px;

    span {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      line-clamp: 4;
      -webkit-box-orient: vertical;
    }

  }
}

.clerk-content {
  width: 100px;
  flex: 0 0 25%;

  .clerk-avatar {
    width: 60px;
    height: 60px;
    object-fit: cover;
  }

  .clerk-name {
    width: 90px;
    margin-top: 4px;
    text-align: center;
    line-clamp: 2;
    overflow: hidden;
  }
}

.isSelected {
  border: 3px solid $accent_color;
  position: relative;
}

.checked {
  position: absolute;
  right: 1px;
  color: $accent_color;
}

//}
</style>
