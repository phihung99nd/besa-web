<template>
  <div class="shop-box" :style="{width: `${width}px`}">
    <div class="shop-container">
      <div class="shop-title-content">
        <div class="store-logo__holder">
          <img class="hover-pointer"
               @click="linkTo(`/merchant?id=${storeDetail.id}`)"
               :src="storeDetail.storeLogo"
               alt="">
        </div>
        <div class="store-name__holder">
          <p>
            <router-link :to="`/merchant?id=${storeDetail.id}`">{{ storeDetail.storeName }}</router-link>
          </p>
          <p style="margin-bottom: .5rem">{{ storeDetail.storeDesc }} </p>
          <div class="store-name__button">
            <Button v-if="fav" size="small" icon="md-checkmark" type="primary" @click="collect">{{ $t('Following') }}
            </Button>
            <Button v-else size="small" icon="ios-heart" type="primary" @click="collect" ghost>{{
                $t('Follow')
              }}
            </Button>
            <Button size="small" type="default" @click="openContact">{{ $t('Contact') }}
            </Button>
          </div>
        </div>
      </div>
      <div class="shop-detail-content">
        <div class="shop-detail__column">
          <div class="shop-detail__item bottom">{{ $t('Goods') }}: <span>{{ storeDetail.goodsNum || 0 }}</span></div>
          <div class="shop-detail__item">{{ $t('Service') }}: <span>{{ storeDetail.servicesNum || 0 }}</span></div>
        </div>
        <div class="shop-detail__column">
          <div class="shop-detail__item bottom">{{ $t('Response Rate') }}:
            <span>{{ storeDetail.responseRate || 0 }}</span></div>
          <div class="shop-detail__item">{{ $t('Followers') }}: <span>{{ storeDetail.collectionNum || 0 }}</span></div>
        </div>
        <div class="shop-detail__column">
          <div class="shop-detail__item bottom">{{ $t('Number of evaluation') }}:
            <span>{{ storeDetail.memberEvaluationNum || 0 }}</span></div>
          <div class="shop-detail__item">{{ $t('Store rating') }}: <span>{{ storeDetail.rating || 0 }}</span></div>
        </div>
      </div>
    </div>
    <v-modal name="shop-contact" transition="fade" :width="400" :focus-trap="true" :scrollable="true" height="auto"
             @closed="closeContact">
      <div class="modal">
        <span class="main-phone">{{ storeDetail.linkPhone }}</span>
        <div class="contact-method">
          <div class="contact-item" v-for="(item,index) in contactList" :key="index" @click="handleContact(item)">
            <img :src="require(`@/assets/images/${item}.png`)"/>
            <span>{{ $t('Contact via {0}', [item]) }}</span>
          </div>
        </div>
      </div>
    </v-modal>
  </div>
</template>

<script>
export default {
  name: 'ShopHeader',
  props: {
    detail: {
      type: Object,
      default: null
    },
    fav: {
      type: Boolean,
    },
    width: {
      type: Number,
      default: 1200
    }
  },
  data() {
    return {
      contactList: ['Zalo', 'Viber']
    }
  },
  computed: {
    storeDetail() {
      return this.detail || {id: ""};
    }
  },
  methods: {
    collect() {
      this.$emit('on-fav-change')
    },
    openContact() {
      this.$modal.show('shop-contact')
    },
    closeContact() {
      this.$modal.hide('shop-contact')
    },
    handleContact(type) {
      switch (type) {
        case 'Zalo':
          window.open(`zalo://conversation?phone=${this.storeDetail.linkPhone}`, '_self')
          break;
        case 'Viber':
          window.open(`viber://contact?number=${this.storeDetail.linkPhone}`, '_self')
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/* 店铺介绍 */
.shop-box {
  height: 130px;
  margin: 0px auto;
  border-radius: 16px;
  background-color: $light_white_background_color;
}

.shop-container {
  width: 100%;
  height: 100%;
  padding: 0px 0px 0px 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #484848;
}

.shop-title-content {
  display: flex;
  align-items: flex-start;
  width: 400px;
  border-right: 1px solid $border_color;
}

.shop-detail-content {
  display: flex;
  align-items: center;
  width: calc(800px - 60px);
  height: 80px;
  justify-content: space-around;
}

.shop-detail__column {
  display: flex;
  flex-direction: column;
}

.shop-detail__item {
  font-size: 16px;
  color: #757575;
}

.shop-detail__item.bottom {
  margin-bottom: 20px;
}

.shop-detail__item span {
  color: $accent_color_shade;
}

.store-logo__holder {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  margin-right: 20px;
}

.store-logo__holder img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.store-name__holder {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.store-name__holder:nth-child(1) {
  color: $accent_color;
  font-weight: 400;
}

.store-name__holder a {
  font-size: 16px;
}

.store-name__holder:nth-child(2) {
  font-size: 14px;
  color: $light_sub_color;
}

.store-name__button {
  display: flex;
  flex-direction: row;
}

.store-name__button > button {
  margin-right: 10px;
}

.modal {
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: auto;

  .main-phone {
    font-size: 24px;
    font-weight: 600;
  }

  .contact-method {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;

    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 5px;
      transition: background-color $common_transition_duration ease;

      &:hover {
        background-color: $accent_color_transparent;
      }

      > img {
        width: 24px;
        height: 24px;
        object-fit: cover;
      }
    }
  }
}
</style>
