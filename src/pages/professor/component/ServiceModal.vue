<template>
  <v-modal name="service" transition="fade" :width="modalWidth" :focus-trap="true" :height="600">
    <div class="modal">
      <h3>Danh sách dịch vụ của chuyên gia</h3>
      <div class="flex main">
        <div class="navigation">
          <div class="flex gap-2 service-nav" v-for="i in 10" :key="i" :class="{ active: i-1 == currentSelected}"
               @click="currentSelected = i-1">
            <img
              src="https://images.unsplash.com/photo-1555820585-c5ae44394b79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=425&q=80"/>
            <div class="name">Tẩy tế bào chết mặt bằng công nghệ tắm nước khoáng LIQUIRO</div>
          </div>
        </div>
        <div class="detail">
          <template v-if="!isLoading">
            <div class="flex gap-4 header">
              <img
                src="https://images.unsplash.com/photo-1555820585-c5ae44394b79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=425&q=80"/>
              <div>
                <div class="name">Tẩy tế bào chết mặt bằng công nghệ tắm nước khoáng LIQUIRO</div>
                <ul class="flex review">
                  <li class="rating">
                    <span>4.8</span>
                    <Rate allow-half disabled :value="4.5"/>
                  </li>
                  <li class="book-count">
                    <span>20</span>
                    lượt đặt
                  </li>
                </ul>
              </div>
            </div>
            <div class="intro">
              <div>{{ $t('Introduction') }}</div>
              <div v-html="currentService.intro"/>
            </div>
          </template>
          <template v-else>
            <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center">
              <span class="loader"></span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </v-modal>
</template>
<script>
const MODAL_WIDTH = 1000

export default {
  name: 'ServiceModal',
  data() {
    return {
      modalWidth: MODAL_WIDTH,
      isLoading: false,
      currentSelected: 0,
      currentService: {
        intro: '<span><b>What is Lorem Ipsum?</b>\n' +
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n' +
          '\n' +
          '<b>Why do we use it?</b>\n' +
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</span>'
      }
    }
  },
  watch: {
    currentSelected: {
      handler(val) {
        this.isLoading = true
        setTimeout(() => {
          this.isLoading = false
        }, 2000)
      }
    }
  },
  created() {
    this.modalWidth =
      window.innerWidth < MODAL_WIDTH ? MODAL_WIDTH / 2 : MODAL_WIDTH
  },
  methods: {}
}
</script>
<style scoped lang="scss">
@import 'loader';

.modal {
  padding: 20px;
  width: 100%;
  height: 100%;
  background: #f8f8f8;

  .main {
    width: 100%;
    height: 100%;
    margin-top: 20px;

    .navigation {
      width: 300px;
      height: calc(100% - 40px);
      overflow: auto;

      .service-nav {
        width: 100%;
        height: 100px;
        background: #fcfcfc;
        transition: all $common_transition_duration ease-in-out;
        padding: 10px;

        &.active {
          position: relative;
          border-radius: 10px 0 0 10px;
          background: #fff;
          box-shadow: rgba(0, 0, 0, 0.04) 0 24px 32px,
          rgba(0, 0, 0, 0.04) 0 16px 24px,
          rgba(0, 0, 0, 0.04) 0 4px 8px,
          rgba(0, 0, 0, 0.04) 0 0 1px;

          .name {
            font-weight: 600;
          }
        }

        &:hover:not(.active) {
          background: #f8f8f8;
          cursor: pointer;
        }

        &:last-child.active {
          box-shadow: rgba(0, 0, 0, 0.04) 0px -10px 12px 4px;
        }

        > img {
          height: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 5px;
        }

        .name {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          line-height: 20px;
          height: 60px;
        }
      }
    }

    .detail {
      flex: 1 1;
      background: #fff;
      height: calc(100% - 40px);
      overflow: auto;
      padding: 16px;
      box-shadow: rgba(0, 0, 0, 0.04) -8px 0px 12px 0px;

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
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          line-height: 30px;
          max-height: 90px;
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
              color: $accent_color;
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
              color: $accent_color;
            }
          }
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
  }
}
</style>
