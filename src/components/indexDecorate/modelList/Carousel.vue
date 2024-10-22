<template>
  <div class="model-carousel">
    <div class="nav-body clearfix">
      <div class="nav-content">
        <Carousel autoplay loop easing="ease" :autoplay-speed="5000">
          <CarouselItem v-for="(item, index) in data.options.list" :key="index">
            <div style="overflow: hidden">
              <img
                :src="item.img"
                @click="linkTo(item.url)"
                class="hover-pointer"
              />
            </div>
          </CarouselItem>
        </Carousel>
      </div>
      <div class="nav-right">
        <div class="top-right">
          <img
            v-if="ads0.img"
            :src="ads0.img"
            width="790"
            @click="linkTo(ads0.url)"
            height="340"
            class="hover-pointer"
          />
        </div>
        <div class="bottom-right">
          <img
            v-if="ads1.img"
            :src="ads1.img"
            width="790"
            @click="linkTo(ads1.url)"
            height="340"
            class="hover-pointer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {articleList} from "@/api/common.js";
import storage from "@/plugins/storage";

export default {
  name: "modelCarousel",
  props: ["data"],
  data() {
    return {
      config: require("@/config"),
      userInfo: {}, // 用户信息
      articleList: [], // 常见问题
      params: {
        // 请求常见问题参数
        page: 1,
        size: 5,
        type: "ANNOUNCEMENT",
        sort: "sort",
      },
    };
  },
  computed: {
    ads0(){
      if(this.data.options.ads!==undefined) return this.data.options.ads[0]
      return false
    },
    ads1(){
      if(this.data.options.ads!==undefined) return this.data.options.ads[1]
      return false
    }
  },
  methods: {
    getArticleList() {
      // 获取常见问题列表
      articleList(this.params).then((res) => {
        if (res.success) {
          this.articleList = res.result.records;
        }
      });
    },
    goArticle(id) {
      // 跳转文章详情
      let routeUrl = this.$router.resolve({
        path: "/article",
        query: {id},
      });
      window.open(routeUrl.href, "_blank");
    },
  },
  mounted() {
    if (storage.getItem("buyer_accessToken") && storage.getItem("buyer_userInfo"))
      this.userInfo = JSON.parse(storage.getItem("buyer_userInfo"));
    this.getArticleList();
  },
};
</script>

<style scoped lang="scss">


.model-carousel {
  width: 1200px;
  height: 300px;
  overflow: hidden;
}

.btns {
  background-color: #363634;
  line-height: 30px;
  color: white !important;
}

.btns:hover {
  background-color: #363634;
  line-height: 32px !important;
  color: #e5d790 !important;
}

/* 导航主体 */
.nav-body {
  width: 1200px;
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin: 0px auto;
}

.nav-side {
  height: 100%;
  width: 200px;
  float: left;
  padding: 0px;
  color: #fff;
  background-color: #6e6568;
}

/*导航内容*/
.nav-content {
  width: calc(100% * 2 / 3 - 5px);
  overflow: hidden;
  border-radius: 12px;
  margin-right: 5px;
}

.nav-content img {
  width: 100%;
  height: 300px;
}

.nav-right {
  width: calc(100% * 1 / 3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  img{
    border-radius: 12px;
  }
}

.nav-right .top-right, .nav-right .bottom-right {
  height: calc(295px / 2);
}

.nav-right .top-right {
  margin-bottom: 4px;
}

.nav-right img {
  width: 100%;
  height: calc(295px / 2);
}
</style>
