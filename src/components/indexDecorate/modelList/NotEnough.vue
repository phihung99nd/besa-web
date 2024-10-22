<template>
  <div class="not-enough" ref="obtain" id="demo">
    <Affix :offset-top="90" @on-change="change">
      <ul class="nav-bar" v-show="topSearchShow">
        <li
          v-for="(item, index) in conData.options.navList"
          :class="currentIndex === index ? 'curr' : ''"
          @click="changeCurr(index)"
          :key="index"
        >
          <p @click="gotoDemo">{{ item.title }}</p>
          <p @click="gotoDemo">{{ item.desc }}</p>
        </li>
      </ul>
    </Affix>
    <div class="content" v-if="showContent">
      <div
        v-for="(item, index) in conData.options.list[currentIndex]"
        :key="index"
        class="hover-pointer"
        @click="linkTo(item.url)"
      >
        <img :src="item.img" width="210" height="210" :alt="item.name"/>
        <p :title="item.name">{{ item.name }}</p>
        <p>
          <span>{{ Number(item.price) | unitPrice("₫",  "before") }}</span>
          <span> {{ $t('Booked') }} {{ item.buyCount || 0 }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    window.addEventListener('scroll', this.handleScrollx, true)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScrollx, true)
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      screenHeight: document.body.clientHeight,
      scrollHieght: 0,
      topSearchShow: true,
      topIndex: 0,
      scrollTops: 0,
      open: '',
      currentIndex: 0,
      conData: this.data,
      showContent: true,
    };
  },
  watch: {
    data: function (val) {
      this.conData = val;
    },
    conData: function (val) {
      this.$emit("content", val);
    },
  },
  methods: {
    handleScrollx() {
      this.scrollHieght = Number(window.pageYOffset);
      this.scrollTops = Number(this.$refs.obtain.getBoundingClientRect().top);
      this.topSearchShow = this.scrollTops >= -660;
    },
    toguid(path, id) {
      var path = path;
      var Id = id;
      localStorage.setItem('toId', Id);
      this.$router.push(path);
    },
    change(status) {
      this.open = status
    },
    gotoDemo() {
      if (this.open) {
        document.querySelector("#demo").scrollIntoView(true);
      }
    },
    changeCurr(index) {
      this.currentIndex = index;
    },
  },
};
</script>
<style lang="scss" scoped>
.nav-bar {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
  background-color: #f8f8f8;
  height: 60px;
  align-items: center;
  position: relative;
  position: sticky;
  position: -webkit-sticky;
  top: 0;

  li {
    padding: 0 30px;
    text-align: center;

    p:nth-child(1) {
      font-size: 16px;
      border-radius: 50px;
      padding: 0 7px;
    }

    p:nth-child(2) {
      font-size: 14px;
      color: #999;
    }

    &:hover {
      p {
        color: $accent_color;
      }

      cursor: pointer;
    }

    border-right: 1px solid #eee;
  }

  li:last-of-type {
    border: none;
  }

  .curr {
    p:nth-child(1) {
      background-color: $accent_color;
      color: #fff;
    }

    p:nth-child(2) {
      color: $accent_color;
    }
  }
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #eee;
    margin-bottom: 10px;

    &:hover {
      border-color: $accent_color;
      color: $accent_color;
    }

    p:nth-of-type(1) {
      overflow: hidden;
      width: 210px;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 10px 0 5px 0;
    }

    p:nth-of-type(2) {
      color: $accent_color;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      span:nth-child(2) {
        font-size: 14px;
        color: #999;
      }
    }
  }

}
</style>
