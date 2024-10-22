<template>
  <v-modal name="service" transition="fade" :width="modalWidth" :focus-trap="true" :scrollable="true" height="auto" @closed="emitClose">
    <div class="modal">
      <div class="flex gap-4 header">
        <img
          :src="service.thumbnail"/>
        <div style="flex: 1 1">
          <div class="name">{{service.name}}</div>
          <ul class="flex review">
            <li class="rating">
              <span>{{service.grade.toFixed(1)}}</span>
              <Rate allow-half disabled :value="service.grade"/>
            </li>
            <li class="book-count">
              <span>{{service.buyCount}}</span>
              lượt đặt
            </li>
          </ul>
          <div class="price">
            {{service.price | unitPrice("₫",  "before")}}
          </div>
          <Button type="warning" @click="book">Đặt ngay</Button>
        </div>
      </div>
      <div class="intro">
        <div>{{ $t('Introduction') }}</div>
        <div v-html="service.intro"/>
      </div>
    </div>
  </v-modal>
</template>

<script>
const MODAL_WIDTH = 800
export default {
  name: "ServiceItemModal",
  props: {
    service: {
      type: Object
    }
  },
  data() {
    return {
      modalWidth: MODAL_WIDTH,
      currentService: {
        intro: '<span><b>What is Lorem Ipsum?</b>\n' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n' +
          '\n' +
          '<b>Why do we use it?</b>\n' +
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>' +
          'It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>' +
          'It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>' +
          'It is a long-established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>'
      }
    }
  },
  methods: {
    emitClose(){
      this.$emit('closed')
    },
    book(){
      this.$emit('on-book')
    }
  }
}
</script>

<style scoped lang="scss">
.modal {
  padding: 20px;
  width: 100%;
  height: 100%;
  overflow: auto;
  .header {
    height: 200px;

    > img {
      height: 100%;
      aspect-ratio: 1;
      border-radius: 10px;
      object-fit: cover;
    }

    .name {
      font-size: 28px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 30px;
      max-height: 60px;
      margin-bottom: 10px;
    }

    .review {
      list-style: none;

      .rating {
        padding-right: 10px;
        margin-right: 10px;
        border-right: 1px solid $border_color;

        span {
          margin-right: 4px;
          text-decoration: underline;
          color: $accent_color_shade;
        }

        .ivu-rate {
          font-size: 12px;
        }

        /deep/ .ivu-rate-star {
          margin-right: 2px;
        }
      }

      .book-count {
        span {
          margin-right: 4px;
          text-decoration: underline;
          color: $accent_color_shade;
        }
      }
    }

    .price {
      color: $red_color;
      font-size: 28px;
      font-weight: 600;
      margin: 10px 0;
      padding: 5px 10px;
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: center;
      background: url("../../../assets/images/goodsDetail/price-bg.png");
    }
  }

  .intro {
    margin-top: 10px;

    > div:nth-of-type(1) {
      position: relative;
      font-size: 20px;
      font-weight: 600;
      width: fit-content;
      margin-bottom: 16px;

      &::after {
        content: "";
        height: 2px;
        width: 80%;
        background: $accent_color;
        position: absolute;
        bottom: -4px;
        left: 0;
      }
    }

    > div:nth-of-type(2) {
      white-space: pre-line;
    }
  }
}
</style>
