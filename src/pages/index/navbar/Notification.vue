<template>
<span>
    <Notification
      :count="+unseenTotal"
      :badge-props="badgeProps"
      :locale="{ loadedAll: $t('No more data'), loading: $t('Loading...'), loadMore: $t('Load more')}"
      show-clear="false"
      tab="unread"
      ref="notification"
      @on-visible-change="handleResetUnseenCount"
      :key="key"
    >
    <button class="btn noti-btn" slot="icon" style="padding-left: 0;border-right: 1px solid #dddee1;">
      <Icon type="ios-notifications-outline" size="20"/>
      <div>{{ $t('Notification') }}</div>
    </button>
    <NotificationTab
      :title="$t('Unread')"
      name="unread"
      :empty-text="$t('No unread messages')"
      :count="+unreadTotal"
      :loading="unreadLoading"
      :show-clear="true"
    >
      <div slot="loaded-all"></div>
      <div slot="loading"
           style="width: 100%; height: 100px; display: flex; justify-content: center; align-items: center">
        <span class="loader"></span>
      </div>
      <div slot="clear" @click="handleSeeAll">
        {{ $t('See all') }}
      </div>
      <template v-if="isLogin">
        <NotificationItem
          v-for="(item, index) in notificationList"
          :key="index"
          :title="item.title"
          :avatar="item.thumbnail || require('@/assets/images/default-noti-logo.png')"
          :time="item.createdTime"
          :read="+item.status"
          @click.native="handleClickNoti(item)"
        >
          <div slot="content" class="noti-content">
            {{ item.content }}
          </div>
        </NotificationItem>
      </template>
      <template v-else>
        <div slot="empty">{{ $t('Please log in to receive notifications') }}</div>
      </template>
    </NotificationTab>
  </Notification>
  <web-socket ref="socket" @ORDER="handleNewMessageCome" @BOOKING="handleNewMessageCome"
              @PROMOTION="handleNewMessageCome" @OTHER="handleNewMessageCome"/>
  <v-notify group="notify" position="top right">
      <template #body="{item, close}">
        <div @click="handleClickNoti(item.data)" class="notify-container">
          <div class="icon">
            <img :src="require('@/assets/images/notify.png')" alt=""/>
          </div>
          <div class="content">
            <a>
              {{ item.data.title }}
            </a>
            <div v-html="item.data.content"/>
          </div>
          <div class="close" @click.stop="close">
            <Icon type="ios-close" size="20"/>
          </div>
        </div>
      </template>
    </v-notify>
</span>
</template>

<script>
import {getNotiDetail, getNotiList} from "../../../api/notify";
import WebSocket from "../../../components/socket/WebSocket.vue";
import {mapMutations, mapState} from "vuex";

export default {
  name: "Header-notification",
  components: {WebSocket},
  data() {
    return {
      badgeProps: {
        offset: [0, 0]
      },
      // readTotal: 0,
      unreadTotal: 0,
      unseenTotal: 0,
      unreadMessages: [],
      // readMessages: [],
      unreadLoading: false,
      // readLoading: false,
      searchParams: {
        page: 1,
        size: 10,
        sort: 'createdTime,DESC'
      },
      key: 1
    }
  },
  computed: {
    ...mapState(['unseenMessageCount', 'notificationList']),
    isLogin() {
      return !!(this.$cookies.get('buyer_accessToken') && this.$cookies.get('buyer_userInfo'))
    }
  },
  created() {
    this.getList()
  },
  watch: {
    isLogin(val){
      if(val) this.getList()
    },
    '$route': {
      handler(val) {
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['SET_UNSEEN_MESSAGE_COUNT', 'SET_NOTIFICATION_LIST']),
    getList() {
      if (this.isLogin) {
        this.unreadLoading = true
        let params = {
          ...this.searchParams,
          page: this.searchParams.page - 1
        }
        getNotiList(params).then(res => {
          this.SET_NOTIFICATION_LIST(res.result.content)
          this.unseenTotal = res.result.totalUnread
          this.SET_UNSEEN_MESSAGE_COUNT(res.result.totalUnread)
        }).finally(() => {
          this.unreadLoading = false
        })
      }
    },
    handleSeeAll() {
      this.$router.push({name: 'Notification'})
      this.key++
    },
    handleClickNoti(e) {
      getNotiDetail(e.id).then(res => {
        if (res.success) {
          if(e.actionUrl == this.$route.fullPath) {
            this.$bus.$emit('on-same-route')
          } else {
          this.$router.push(e.actionUrl)
          }
          e.status = '1'
          this.key++
        }
      })
    },
    handleNewMessageCome(e) {
      this.$notify({
        group: 'notify',
        data: e,
        duration: 3000
      })
      if (this.isLogin) {
        this.unreadLoading = true
        let params = {
          ...this.searchParams,
          page: this.searchParams.page - 1
        }
        getNotiList(params).then(res => {
          this.SET_NOTIFICATION_LIST(res.result.content)
          this.unseenTotal = res.result.totalUnread
          this.SET_UNSEEN_MESSAGE_COUNT(res.result.totalUnread)
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          this.unreadLoading = false
        })
      }
    },
    handleResetUnseenCount(e) {
      if (e) {
        this.unseenTotal = 0
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import 'navbar';

.noti-btn {
  position: relative;

  > i {
    position: absolute;
    top: 0;
    left: -22px;
  }
}

/deep/ sup {
  height: 16px;
  font-size: 9px;
  line-height: 13px;
  position: absolute;
  margin: 0 !important;
  transform: unset;
  top: -5px;
  right: unset;
  left: -20px;
}

.noti-content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

/deep/ .ivu-notifications-item-unread {
  background: #f0faff;
}

/deep/ .ivu-notifications-item-title {
  > h4 {
    color: $accent_color_shade;
  }
}

/deep/ .ivu-time {
  color: #333;
}

/deep/ .ivu-tabs-nav-scroll {
  display: none;
}

.loader {
  position: relative;
  width: 40px;
  height: 40px;
  background-color: transparent;
  transform: rotate(45deg);
  overflow: hidden;
}

.loader:after {
  content: '';
  position: absolute;
  inset: 4px;
  margin: auto;
  background: #fff;
}

.loader:before {
  content: '';
  position: absolute;
  inset: -15px;
  margin: auto;
  background: #23caa1;
  animation: diamondLoader 2s linear infinite;
}

@keyframes diamondLoader {
  0%, 10%, 90%, 100% {
    transform: translate(64px, 64px) rotate(-45deg)
  }
  40%, 60% {
    transform: translate(0px, 0px) rotate(-45deg)
  }
}

//----------------------------
.notify-container {
  background: #fff;
  padding: 10px;
  margin: 10px;
  box-shadow: rgba(17, 17, 26, 0.1) 4px 4px 4px, rgba(17, 17, 26, 0.1) -2px 4px 8px 0px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: clip;
  display: flex;
  gap: 8px;
  align-items: start;

  &::before {
    content: '';
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 0;
    background-color: $accent_color_transparent;
    animation: background-progress 3s linear;
    animation-iteration-count: 1;
  }

  @keyframes background-progress {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(0);
    }
  }

  .icon {
    padding: 10px;
    z-index: 1;

    img {
      width: 28px;
      height: 28px;
      object-fit: cover;
    }
  }

  .content {
    z-index: 1;
  }

  .close {
    z-index: 1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all $common_transition_duration ease-in-out;

    &:hover {
      background-color: $border_color;
    }
  }
}
</style>
