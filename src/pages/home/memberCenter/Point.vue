<template>
  <div class="point">
    <card :_Title="$t('Point')"/>
    <div class="point-content">
      <span>{{ $t('Remaining points') }}：<span>{{ pointObj.point || 0 }}</span></span>
      <span>{{ $t('Accumulated points') }}：<span>{{ pointObj.totalPoint || 0 }}</span></span>
    </div>
    <h3>{{ $t('Point History') }}</h3>
    <Table :columns="logColumns" :data="logData.records">
      <template slot="point" slot-scope="{ row }">
        <div :style="{color:row.pointType === 'INCREASE' ? 'green' : 'red'}">
          <span v-if="row.pointType === 'INCREASE'">+</span>{{ row.variablePoint }}
        </div>
      </template>
    </Table>
    <!-- 分页 -->
    <Page
      :current="params.page"
      :page-size="params.size"
      :page-size-opts="[10, 20, 50]"
      :total="+logData.totalElements"
      show-elevator
      show-total
      size="small"
      style="float:right;margin-top:10px"
      @on-change="changePage"
      @on-page-size-change="changePageSize"
    ></Page>
  </div>
</template>
<script>
import {memberPoint, memberPointHistory} from '@/api/member.js'

export default {
  name: 'Point',
  data() {
    return {
      logData: {}, // 积分日志
      pointObj: {}, // 积分明细
      loading: false, // 请求接口加载框
      params: { // 积分列表请求参数
        page: 1,
        size: 10
      },
      logColumns: [ // table展示数据
        {
          title: this.$t('Content'),
          key: 'content',
          align: 'center'
        },
        {
          title: this.$t('Time'),
          key: 'createTime',
          align: 'center'
        },
        {
          title: this.$t('Point'),
          slot: 'point',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.getHistory()
    this.getPoint()
  },
  methods: {
    getHistory() {
      memberPointHistory(this.params)
        .then(res => {
          this.logData = res.result;
        })
        .catch((err) => {
          this.$Message.error(this.$t('API member point history error'))
        })
        .finally(() => {

        })
    },

    getPoint() {
      memberPoint()
        .then(res => {
          if (res.success) this.pointObj = res.result
        })
        .catch((err) => {
          this.$Message.error(this.$t('API member point error'))
        })
        .finally(() => {

        })
    },

    changePage(val) {
      this.params.page = val
      this.getHistory()
    },
    changePageSize(val) {
      this.params.size = val
      this.params.page = 1
      this.getHistory()
    }
  }
}
</script>
<style lang="scss" scoped>
h3 {
  font-size: 16px;
  margin: 20px 10px;
}

.point-content {
  text-align: center;
  margin-bottom: 30px;

  > span {
    color: #999;
    margin-right: 100px;

    span {
      color: $accent_color;
      font-size: 24px;
    }
  }
}
</style>
