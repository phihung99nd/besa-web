<template>
  <div>
    <Cascader
      :data="data"
      :load-data="loadData"
      v-model="addr"
      @on-change="change"
      filterable
    ></Cascader>
  </div>
</template>
<script>
import {getRegion} from '@/api/common.js';

export default {
  data() {
    return {
      data: [], // 地区数据
      addr: [] // 已选数据
    };
  },
  props: ['addressId'],
  mounted() {
  },
  methods: {
    change(val, selectedData) {
      /**
       * @returns [regionId,region]
       */
      this.$emit('selected', [
        val,
        selectedData[selectedData.length - 1].__label.split('/')
      ]);
    },
    loadData(item, callback) {
      item.loading = true;
      if (item.__label.split('/').length == 1) {
        getRegion(item.value).then((res) => {
          res.result.forEach((child) => {
            item.loading = false;

            let data = {
              value: child.id,
              label: child.name,
              loading: false,
              children: []
            };
            item.children.push(data);
          });
          callback();
        });
      }
      if (item.__label.split('/').length == 2) {
        getRegion(item.value).then(res => {
          if (res.result.length > 0) {
            res.result.forEach(child => {
              item.children.push({
                value: child.id,
                label: child.name,
              })
              item.loading = false
            })
            callback()
          }
        })
      }
    },
    async init() {
      let data = await getRegion(0);
      let arr = [];
      data.result.forEach((item) => {
        let obj;
        obj = {
          value: item.id,
          label: item.name,
          loading: false,
          children: []
        };
        arr.push(obj);
      });
      this.data = arr;
    },
    reviewData() {
      let addr = JSON.parse(JSON.stringify(this.addressId.split(',')));
      let length = addr.length;
      let arr0 = [], arr1 = [], arr2 = [];
      getRegion(0).then( res => {
        res.result.forEach((item) => {
          let obj;
          obj = {
            value: item.id,
            label: item.name,
            loading: false,
            children: []
          };
          arr0.push(obj);
        });
        if (length > 0) {
          getRegion(addr[0]).then( res => {
            let children = this.handleData(res.result, 0);
            arr0.forEach((e) => {
              if (e.value === addr[0]) {
                e.children = arr1 = children;
              }
            });
          })
        }
        if (length > 1) {
          getRegion(addr[1]).then( res => {
            let children = this.handleData(res.result, 1);
            arr1.forEach((e) => {
              if (e.value === addr[1]) {
                e.children = arr2 = children;
              }
            });
          })
        }
      })
      this.data = arr0;
      this.addr = addr;
    },
    handleData(data, level) {
      let item = [];
      if(level == 1){
        data.forEach((child) => {
          let obj = {
            value: child.id,
            label: child.name,
          };

          item.push(obj);
        });
      }else {
        data.forEach((child) => {
          let obj = {
            value: child.id,
            label: child.name,
            loading: false,
            children: []
          };

          item.push(obj);
        });
      }
      return item;
    }
  },
  watch: {
    addressId: {
      handler: function (v) {
        if (v) {
          this.reviewData();
        } else {
          this.init();
        }
      },
      immediate: true
    }
  }
};
</script>
<style scoped lang="scss">
</style>
