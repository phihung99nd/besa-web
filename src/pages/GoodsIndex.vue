<template>
  <div class="container">

    <model-form ref="modelForm" :data="modelForm"></model-form>
    <div class="more-item" @click="linkTo('/goodsList')">{{$t('WATCH MORE')}}</div>
    <Introduce></Introduce>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import ModelForm from '@/components/indexDecorate/ModelForm';
import Introduce from "@/components/footer/Introduce.vue";
import storage from '@/plugins/storage';
import {indexData} from '@/api/index.js';
import {seckillByDay} from '@/api/promotion'
import HorizontalNavbar from "@/components/nav/HorizontalNavbar.vue";
import NavigationBar from "@/pages/index/NavigationBar.vue";

export default {
  name: 'Index',
  components: {
    NavigationBar,
    HorizontalNavbar,
    Introduce,
    ModelForm,
  },

  data () {
    return {
      modelForm: {
        list: []
      },
      topAdvert: {},
      showNav: false,
      topSearchShow: false,
      carouselLarge: false,
      carouselOpacity: false
    };
  },

  mounted () {
    this.getIndexData();
    let that = this;
    window.onscroll = function () {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      that.topSearchShow = top > 300;
    };
  },

  methods: {
    getIndexData () {
      let params = {
        pageClientType: 'PC',
        pageType: 'INDEX',
        pageShow: 'OPEN',
        url: this.$route.fullPath
      }
      indexData(params).then(async (res) => {
        if (res.success) {
          let dataJson = JSON.parse(res.result.pageData);
          for (let i = 0; i < dataJson.list.length; i++) {
            let type = dataJson.list[i].type
            if (type === 'carousel2') {
              this.carouselLarge = true;
            } else if (type === 'carousel1') {
              this.carouselLarge = true
              this.carouselOpacity = true
            } else if (type === 'seckill') {
              dataJson.list[i].options.list = await this.getListByDay()
            }
          }
          this.modelForm = dataJson;
          storage.setItem('navList', dataJson.list[1])
          this.showNav = true
          this.topAdvert = dataJson.list[0];
        }
      });
    },
    async getListByDay () {
      const res = await seckillByDay()
      if (res.success && res.result.length) {
        return res.result
      } else {
        return []
      }
    }
  },
};
</script>

<style scoped lang="scss">
.container {
  //@include sub_background_color($dominant_color);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.more-item {
  padding: 10px 28px;
  margin-bottom: 10px;
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  border: 1px solid $accent_color;

  &:hover {
    color: #fff;
    background-color: $accent_color;
    transition: ease-in-out 0.2s;
  }
}
</style>
<style>
.hover-search {
  width: 100%;
  height: 60px;
  transform: translateY(-200px);
  background-color: #fff;
  position: fixed;
  top: 0;
  z-index: 9999;
  box-shadow:0 0 10px 2px rgb(90 90 90 / 60%);
  transition: 0.35s;
}
.show {
  transform: translateY(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  top: 0;
}
</style>
