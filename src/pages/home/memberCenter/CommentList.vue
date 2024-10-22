<template>
  <div class="comment-wrapper">
    <card :_Title="$t('Comment List')" />

    <div class="order">
      <div class="order-title">
        <Row class="order-row title">
          <i-col span="12">{{$t('Order Details')}}</i-col>
          <i-col span="4">{{$t('Receiver')}}</i-col>
          <i-col span="4">{{$t('Rating')}}</i-col>
          <i-col span="6"></i-col>
        </Row>
      </div>
      <empty v-if="list.length === 0" />

      <div class="order-item" v-else v-for="(item, index) in list" :key="index">
        <div>
          <div class="title order-item-title">
            <span>{{$t('Order Number')}}:{{item.orderNo}}</span>
            <span class="color999 ml_10">{{item.createTime}}</span>
            <span class="hover-pointer fontsize_12 eval-detail" @click="evaluateDetail(item.id)">{{ $t('Rating detail') }}</span>
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
            <i-col span="4">{{item.createBy | secrecyMobile}}</i-col>
            <i-col span="4">
              {{item.grade==='GOOD'? $t('Good') : item.grade === 'WORSE'? $t('Worse') : $t('Moderate')}}
            </i-col>
            <i-col span="4">
              <Tooltip transfer>
                  <div class="content">{{item.content}}</div>
                  <div style="white-space: normal;word-break:break-all" slot="content">
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
import {evolutionList} from '@/api/order.js';
export default {
  name: 'CommentList',
  data () {
    return {
      commentWay: [`Evaluated`, `Pending`, `Rated`], // 评价分类
      loading: false, // 加载状态
      list: [], // 评价列表
      total: 0, // 评价总数
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
    getList () { // 获取评价列表
      evolutionList(this.params).then(res => {
        if (res.success) {
          const list = res.result.records;
          list.forEach(element => {
            element.descriptionScore = Number(element.descriptionScore)
          });
          this.list = list;
          this.total = res.result.total
        }
      })
    },
    changePageNum (val) { // 修改页码
      this.params.page = val;
      this.getList()
    },
    changePageSize (val) { // 修改页数
      this.params.page = 1;
      this.params.size = val;
      this.getList()
    },
    evaluateDetail (id) { // 跳转评价详情
      this.$router.push({path: '/home/evalDetail', query: { id }})
    }
  }
};
</script>

<style scoped lang="scss">
.page-size {
  display: flex;
  justify-content: flex-end;
}
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
  // word-wrap: break-word;
  display:-webkit-box;
  -webkit-box-orient:vertical;/*设置方向*/
  -webkit-line-clamp:3;/*设置超过为省略号的行数*/
  word-break:break-all;
}

.eval-detail {
  position: absolute;
  right: 20px;
  &:hover{
    color: $theme_color;
  }
}
</style>
