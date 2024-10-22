<template>
  <div class="noti-wrapper">
    <card :_Title="`${$t('Notification')} ${$t($route.meta.notiType)}`" :_More="$t('Mark all as read')" :disableExtra="readAll"
          @callback="handleCheckReadAll"/>
    <div class="noti-list">
      <div class="noti-item" v-for="(noti, index) in notiList" :key="index"
           @click.stop="handleNotiClick(noti)">
        <div class="main-noti" :class="{unread: !+noti.status, expanding: expand[index]}">
          <div class="thumbnail">
            <img v-lazy="noti.thumbnail || require('@/assets/images/default-noti-logo.png')" alt=""/>
          </div>
          <div class="info">
            <h1 class="title">{{ noti.title }}</h1>
            <div class="content">
              {{ noti.content }}
            </div>
            <div class="time">
              <span>{{ noti.createdTime | formatDate }}</span>
              <Icon :type="expand[index] ? 'ios-arrow-up' : 'ios-arrow-down'"
                    v-if="noti.groups && noti.groups.length > 0" @click.native.stop="toggleGroupNoti(index)"/>
            </div>
          </div>
        </div>
        <div class="expand-noti" :class="{expanding: expand[index]}">
          <div class="expand-item" :class="{unread: !+child.status}" v-for="(child, idx) in noti.groups" :key="idx" @click.stop="handleNotiClick(child)">
            <div class="thumbnail">
              <img v-lazy="child.thumbnail || require('@/assets/images/default-noti-logo.png')" alt=""/>
            </div>
            <div class="info">
              <h1 class="title">{{ child.title }}</h1>
              <div class="content">
                {{ child.content }}
              </div>
              <div class="time">
                <span>{{ child.createdTime | formatDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {confirmNotiRead, getNotiDetail, getNotiListByType} from "../../../api/notify";
import {mapMutations, mapState} from "vuex";

export default {
  name: "NotificationList",
  data() {
    return {
      notiList: [],
      searchParams: {
        page: 1,
        size: 20,
        sort: 'createdTime,DESC'
      },
      expand: [],
      readAll: false
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapState(['unseenMessageCount', 'notificationList'])
  },
  methods: {
    ...mapMutations(['SET_UNSEEN_MESSAGE_COUNT', 'SET_NOTIFICATION_LIST']),
    getList() {
      let params = {
        ...this.searchParams,
        page: this.searchParams.page - 1
      }
      getNotiListByType(this.$route.meta.notiType || 'order', params).then(res => {
        if (res.success) {
          this.notiList = res.result.content
          this.readAll = !this.flattenNotiList(res.result.content).some(i => i.status == '0')
        }
      })
    },
    flattenNotiList(arr){
      let result = []
      arr.forEach(item => {
        let temp = {...item}
        delete temp.groups
        result.push(temp)
        if(item.groups && item.groups.length > 0) {
          result.push(...this.flattenNotiList(item.groups))
        }
      })
      return result
    },
    handleCheckReadAll() {
      confirmNotiRead().then(res => {
        if (res.success) {
          this.getList()
          this.SET_UNSEEN_MESSAGE_COUNT(0)
          this.SET_NOTIFICATION_LIST(this.notificationList.map(i=>({
            ...i,
            status: '1'
          })))
        }
      })
    },
    handleNotiClick(e) {
      getNotiDetail(e.id).then(res => {
        if (res.success) {
          this.$router.push(e.actionUrl)
        }
      })
    },
    toggleGroupNoti(index) {
      this.$set(this.expand, index, !this.expand[index])
    }
  }
}
</script>


<style scoped lang="scss">
.noti-list {
  display: flex;
  flex-direction: column;

  .noti-item {
    .main-noti {
      display: flex;
      padding: 20px;
      cursor: pointer;
      background: #fff;
      gap: 20px;

      &.unread {
        background: $accent_color_hover;
      }

      &.expanding {
        background: #e1ffce !important;
      }

      &:hover {
        background: #fafafa;
      }

      .thumbnail {
        width: 80px;
        height: 80px;
        flex-shrink: 0;

        > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .info {
        overflow-wrap: break-word;

        .title {
          font-size: 16px;
          font-weight: 400;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .content {
          font-size: 14px;
          margin-bottom: 4px;
          color: #888;
        }

        .time {
          font-size: 14px;
          color: #888;
          display: flex;
          gap: 10px;
          align-items: center;
        }
      }
    }

    .expand-noti {
      background: #fff;
      display: none;

      &.expanding {
        display: block;
      }

      .expand-item {
        display: flex;
        padding: 10px 10px 10px 40px;
        cursor: pointer;
        background: #fff;
        gap: 20px;

        &.unread {
          background: $accent_color_hover;
        }

        &:hover {
          background: #fafafa;
        }

        .thumbnail {
          width: 60px;
          height: 60px;
          flex-shrink: 0;

          > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .info {
          overflow-wrap: break-word;

          .title {
            font-size: 14px;
            font-weight: 400;
            text-transform: uppercase;
            margin-bottom: 6px;
          }

          .content {
            font-size: 12px;
            margin-bottom: 2px;
            color: #888;
          }

          .time {
            font-size: 12px;
            color: #888;
            display: flex;
            gap: 10px;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
