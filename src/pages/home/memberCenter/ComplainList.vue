<template>
  <div class="complain-wrapper">
    <card :_Title="$t('Complaints')"  />

    <div class="order">
      <div class="order-title">
        <Row class="order-row title">
          <i-col span="12">{{$t('Product information')}}</i-col>
          <i-col span="4">{{$t('Status')}}</i-col>
          <i-col span="4">{{$t('Title')}}</i-col>
          <i-col span="6"></i-col>
        </Row>
      </div>
      <empty v-if="list.length === 0" />

      <div class="order-item" v-else v-for="(item, index) in list" :key="index">
        <div>
          <div class="title order-item-title">
            <span>{{$t('No.')}}:{{item.id}}</span>
            <span class="color999 ml_10">{{item.createTime}}</span>
            <span class="hover-pointer fontsize_12 eval-detail" @click="goDetail(item.id)">{{$t('Details')}}</span>
            <span class="hover-pointer fontsize_12 eval-detail" style="right: 90px" v-if="item.complainStatus === 'APPLYING' || item.complainStatus === 'NEW'" @click="cancel(item.id)">{{$t('Cancel')}}</span>
          </div>
          <Row class="order-item-view">
            <i-col span="12" class="item-view-name">
              <div class="order-img hover-color" @click="linkTo(`/goodsDetail?goodsId=${item.goodsId}&skuId=${item.skuId}`)">
                <img :src="item.goodsImage" alt="" />
              </div>
              <div class="order-name hover-color" @click="linkTo(`/goodsDetail?goodsId=${item.goodsId}&skuId=${item.skuId}`)">
                {{item.name}}
              </div>
            </i-col>
            <i-col span="4">{{statusLabel[item.complainStatus]}}</i-col>
            <i-col span="4">
              <div class="content">{{item.complainTopic}}</div>
            </i-col>
            <i-col span="4">
              <Tooltip >
                <div class="content">{{item.content}}</div>
                <div style="white-space: normal;" slot="content">
                  {{item.content}}
                </div>
              </Tooltip>
            </i-col>
          </Row>
        </div>
      </div>
      <Spin v-if="loading"></Spin>
    </div>
    <!-- 分页 -->
    <div class="page-size">
      <Page :total="+total" @on-change="changePageNum"
        @on-page-size-change="changePageSize"
        :page-size="params.size"
        show-total
        show-sizer>
      </Page>
    </div>
  </div>
</template>

<script>
import {complainList, clearComplain} from '@/api/member.js';
export default {
  name: 'ComplainList',
  data () {
    return {
      loading: false, // 加载状态
      list: [], // 投诉列表
      statusLabel: { // 投诉状态
        NO_APPLY: this.$t('Not applied'),
        APPLYING: this.$t('Apply'),
        COMPLETE: this.$t('Completed'),
        EXPIRED: this.$t('Expired'),
        CANCEL: this.$t('Cancelled'),
        NEW: this.$t('New')
      },
      total: 0, // 投诉总数
      params: { // 请求参数
        page: 1,
        size: 10
      }
    };
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () { // 获取投诉列表
      complainList(this.params).then(res => {
        if (res.success) {
          const list = res.result.records;
          this.list = list;
          this.total = res.result.total
        }
      })
    },
    changePageNum (val) { // 改变页码
      this.params.page = val;
      this.getList()
    },
    changePageSize (val) { // 改变页数
      this.params.page = 1;
      this.params.size = val;
      this.getList()
    },
    cancel (id) { // 取消投诉
      this.$Modal.confirm({
        title: this.$t('Cancel'),
        content: this.$t('Are you sure to cancel the complaint?'),
        onOk: () => {
          clearComplain(id).then((res) => {
            if (res.success) {
              this.$Message.success(this.$t('Canceled successfully'));
              this.getCartList();
            }
          });
        },
        onCancel: () => { }
      });
    },
    goDetail (id) { // 跳转投诉详情
      this.$router.push({path: '/home/complainDetail', query: { id }})
    }
  }
};
</script>

<style scoped lang="scss">
.order-img {
  > img {
    width: 60px;
    height: 60px;
    border: 1px solid $border_color;
    box-sizing: border-box;
  }
}
.title {
  @include background_color($light_background_color);
}
.item-view-name {
  display: flex;
}
.order-name {
  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 2;

  overflow: hidden;
  text-align: left;
  padding: 0 10px;
  font-size: 13px;
  @include content_color($light_content_color);
}
.order-item-title {
  padding: 5px 20px;
  text-align: left;
  font-size: 13px;
  position: relative;
}
.order-item-view {
  padding: 10px 20px;
}
.order-item {
  text-align: center;
  border: 1px solid $border_color;
  margin: 10px 0;
}
.order-row {
  padding: 10px 0;
  text-align: center;
}
.content {
  color: #999;
  max-height: 60px;
  overflow: hidden;
  word-wrap: break-word;
}

.eval-detail {
  position: absolute;
  right: 20px;
  &:hover{
    color: $theme_color;
  }
}
.page-size{
  text-align: right;
}
</style>
