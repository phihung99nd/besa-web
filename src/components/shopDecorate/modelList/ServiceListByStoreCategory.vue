<template>
  <div :id="id" class="mb-3 mt-3">
    <card :_Title="$t('Service list')" :_Size="18" :_Tabs="categoryList.map(i=>i.labelName)" @_Change="change"/>
    <div v-if="serviceList.length > 0" class="service-list">
      <product-card v-for="(item, index) in serviceList" :key="index" :item="item"
                    @click="goDetail(item.id)"/>
    </div>
    <div class="no-data" v-else>
      {{ $t("No service for this category") }}
    </div>
    <div class="pagination">
    <Page :current="page" :total="+total"
          :page-size="size"
          @on-change="changePage"
          >
    </Page>
    </div>
  </div>
</template>

<script>
import productCard from "@/components/productCard";
import {getShopGoodsLabelList} from "@/api/goods";
import {getServicesList} from "@/api/services";

export default {
  name: "ServiceListByStoreCategory",
  components: {
    productCard
  },
  props: ['id'],
  data() {
    return {
      categoryList: [],
      serviceList: [],
      size: 10,
      page: 1,
      sort: 'createdTime,DESC',
      total: 1,
      currentTabIndex: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const shopId = this.$route.query.id
      getShopGoodsLabelList(shopId).then(res => {
        if (res.success) {
          this.categoryList = res.result
          const params = {
            size: this.size,
            page: this.page - 1,
            storeId: this.$route.query.id,
            storeCategoryPath: this.categoryList[0].id
          }
          getServicesList(params).then(res => {
            if (res.success) {
              this.serviceList = res.result.content
              this.total = +res.result.totalElements
            }
          })
        }
      })
    },
    changePage(v){
      this.page = v
      const params = {
        size: this.size,
        page: v - 1,
        storeId: this.$route.query.id,
        storeCategoryPath: this.categoryList[this.currentTabIndex].id
      }
      getServicesList(params).then(res => {
        if (res.success) {
          this.serviceList = res.result.content
          this.total = +res.result.totalElements
        }
      })
    },
    change(index) {
      this.currentTabIndex = index
      this.size = 10;
      this.page = 1;
      const params = {
        size: this.size,
        page: this.page - 1,
        storeId: this.$route.query.id,
        storeCategoryPath: this.categoryList[index].id
      }
      getServicesList(params).then(res => {
        if (res.success) {
          this.serviceList = res.result.content
          this.total = +res.result.totalElements
        }
      })
    },
    goDetail(id){
      let routeUrl = this.$router.resolve({
        path: "/service",
        query: {id: id},

      });
      window.open(routeUrl.href, "_self");
    }
  }
}
</script>

<style lang="scss" scoped>
.service-list {
  display: flex;
  flex-wrap: wrap;
  width: 1200px;
  margin: 0 auto;
}

/deep/ .ivu-card, .ivu-card-head, ._Card {
  margin-bottom: 0;
}

.no-data {
  width: 1200px;
  height: 380px;
  text-align: center;
  line-height: 380px;
  font-size: 40px;
  font-weight: 700;
  margin: 0 auto;
}

.pagination {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
