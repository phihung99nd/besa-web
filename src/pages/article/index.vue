<template>
  <div>
    <!--    <cateNav></cateNav>-->
    <div class="title-bg flex flex-column ">
      <span>
        {{ $t('Hi, How can Besa help you?') }}
      </span>
      <div class="article-search">
        <input v-model="params.title" @keyup.enter="getCateList" type="text"
               :placeholder="$t('What do you want to look for?')">
        <button @click="getCateList">{{ $t('Search') }}</button>
      </div>
    </div>
    <div class="container width_1200">
      <Layout class="layoutAll">
        <!--        <Sider class="side-bar" ref="side" :collapsed-width="78">-->
        <!--          <div class="article-cate">{{ $t('Article category') }}</div>-->
        <!--          <Menu-->
        <!--            class="side-menu"-->
        <!--            theme="light"-->
        <!--            width="auto"-->
        <!--            ref='menu'-->
        <!--            :active-name="activeName"-->
        <!--            :open-names="openName"-->
        <!--            @on-select="onSelect"-->
        <!--          >-->
        <!--            &lt;!&ndash; 循环导航栏  &ndash;&gt;-->
        <!--            <Submenu-->
        <!--              v-show="menu.children"-->
        <!--              v-for="(menu, index) in list"-->
        <!--              :key="index"-->
        <!--              :name="menu.articleCategoryName"-->
        <!--            >-->
        <!--              <template slot="title">-->
        <!--                <span>{{ menu.articleCategoryName }}</span>-->
        <!--              </template>-->
        <!--              <MenuItem-->
        <!--                v-for="(chlidren, i) in menu.children"-->
        <!--                :key="i"-->
        <!--                :name="chlidren.id"-->
        <!--              >{{ chlidren.articleCategoryName }}-->
        <!--              </MenuItem-->
        <!--              >-->
        <!--            </Submenu>-->
        <!--          </Menu>-->
        <!--        </Sider>-->
        <Layout class="layout ml_10">
          <Content class="content">
            <ul class="article-list" v-show="showList">
              <li v-for="(article, index) in articleList" :key="index" @click="getDetail(article.id)">
                {{ article.title }}
              </li>
            </ul>
            <transition mode="out-in">
              <div v-show="!showList">
                <a class="back-btn" @click="showList = true">&lt;{{ $t('Back to previous') }}</a>
                <h2 class="mt_10 mb_10">{{ detail.title }}</h2>
                <div class="mt_10 mb_10 html-content" v-html="detail.content"></div>
              </div>
            </transition>
          </Content>
        </Layout>
      </Layout>
    </div>
    <BaseFooter/>
  </div>
</template>

<script>
import {articleCateList, articleDetail, articleList} from '@/api/common.js'
import Introduce from "../../components/footer/Introduce.vue";

export default {
  name: 'Home',
  components: {Introduce},
  data() {
    return {
      list: [], // 分类列表
      detail: '', // 文章详情
      articleList: [], // 分类下的文章列表
      activeName: '1347456734864367616', // 左侧激活项
      openName: [], // 展开的名称
      params: { // 请求参数
        title: '',
        page: 1,
        size: 100,
        categoryId: '',
        sort: 'createdTime,DESC'
      },
      showList: true // 展示文章列表
    };
  },
  methods: {
    // 每次点击左侧bar的callback
    onSelect(id) {
      this.getList(id)
      this.detail = ''
      this.showList = true
    },
    getCateList() { // 文章分类列表
      // articleCateList().then(res => {
      //   if (res.success) {
      //     this.list = res.result
      //     if (this.$route.query.id) {
      //       this.activeName = this.detail.categoryId
      //       this.list.forEach(e => {
      //         if (e.children.length) {
      //           e.children.forEach(i => {
      //             if (i.id === this.detail.categoryId) {
      //               this.openName.push(e.articleCategoryName)
      //             }
      //           })
      //         } else {
      //           delete e.children
      //         }
      //       })
      //     } else {
      //       this.activeName = this.list[0].children[0].id
      //       this.openName.push(this.list[0].articleCategoryName)
      //     }
      //     this.$nextTick(() => {
      //       this.$refs.menu.updateOpened()
      //       this.$refs.menu.updateActiveName()
      //     })
      //   }
      // })
      this.getList()
    },
    getList(id) { // 文章列表
      // this.params.categoryId = id
      let params = {
        ...this.params,
        page: this.params.page - 1
      }
      articleList(params).then(res => {
        if (res.success) {
          this.articleList = res.result.content
        }
      })
    },
    async getDetail(id) { // 文章详情
      await articleDetail(id).then(res => {
        if (res.success) {
          this.detail = res.result
          this.showList = false
        }
      })
    }
  },
  async mounted() {
    const articleId = this.$route.query.id
    if (articleId) {
      await this.getDetail(articleId)
    }
    this.getCateList()
  }
};
</script>

<style scoped lang="scss">
.article-search {
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  width: 500px;
  display: flex;
  font-size: 16px;

  input {
    border-radius: 8px 0 0 8px;
    width: 100%;
    padding: 6px 8px;
    border: none;
    height: 50px;
    outline: none;
  }

  button {
    border: none;
    height: 50px;
    padding: 6px 8px;
    color: #fff;
    text-wrap: nowrap;
    background-color: $accent_color_shade;
    cursor: pointer;
    border-radius: 0 8px 8px 0;
  }
}

.content {
  padding: 15px 50px;
}

.header {
  @include background_color($light_background_color);
}

.side-menu,
.side-bar,
.content {
  @include white_background_color();
  @include title_color($light_title_color);
}

/deep/ .html-content {
  li {
    list-style: disc inside !important;
  }
}

.side-bar {
  min-height: 600px;
  height: auto;
}

.layoutAll {
  min-height: 1200px;
  @include background_color($light_background_color);
}

.container {
  margin: 0 auto;
  padding: 20px 0;
}

.side-bar a {
  @include title_color($light_title_color);
}

.layout-footer-center {
  padding: 0px 15px;

  padding-bottom: 15px;
  text-align: center;
}

.title-bg {
  width: 100%;
  padding: 30px 0;
  background-color: $accent_color;
  font-size: 40px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.article-cate {
  width: 200px;
  height: 30px;
  color: #fff;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  background-color: #666;
}

.article-list {
  li {
    margin: 10px 0;
    color: #2D8CF0;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
