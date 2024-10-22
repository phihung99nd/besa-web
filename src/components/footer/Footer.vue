<template>
  <div>
    <footer class="footer">
      <div class="line"></div>
      <div class="service-intro">
        <div class="service-type">
          <div>
            <div class="footer-header">{{ $t('Customer service') }}</div>
            <ul>
              <li v-for="(item, index) in customerServiceLinks" :key="index" @click="openUrl(item.url)">
                {{ $t(item.label) }}
              </li>
            </ul>
          </div>
          <div>
            <div class="footer-header">{{ $t('About Besa') }}</div>
            <ul>
              <li v-for="(item, index) in customerServiceLinks" :key="index" @click="openUrl(item.url)">
                {{ $t(item.label) }}
              </li>
            </ul>
          </div>
          <div>
            <div class="footer-header">{{ $t('Payment Method') }}</div>
            <ul class="logo-list">
              <li><img src="@/assets/images/momo-logo.png" alt="momo" class="footer-payment-icon"/></li>
              <li><img src="@/assets/images/viettelpay-logo.svg" alt="viettelpay" class="footer-payment-icon"/></li>
              <li><img src="@/assets/images/visa.svg" alt="visa-card" class="footer-payment-icon" style="width: 50px"/>
              </li>
              <li><img src="@/assets/images/master-card.svg" alt="master-card" class="footer-payment-icon"/></li>
            </ul>
          </div>
          <div>
            <div class="footer-header">{{ $t('Follow us') }}</div>
            <ul>
              <li class="footer-body" v-for="(item, index) in socialList" :key="index" @click="openUrl(item.url)">
                <Icon size="18" :type="item.icon"></Icon>
                {{ item.name }}
              </li>
            </ul>
          </div>
          <div>
            <div class="footer-header">{{ $t('Download Besa Apps') }}</div>
            <ul>
              <li class="footer-body" v-for="(item, index) in bonoApps" :key="index" @click="openUrl(item.url)">
                <Icon size="18" :type="item.icon"></Icon>
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="friend-link flex">
          <div class="friend-link-item">
            <ul>
              <li v-for="(link, index) in moreLink" :key="index" @click="goArticle(link)">
                <span class="link-item" :class="{'link-last-item': index === 3}">{{ $t(link.name) }}</span>
              </li>
            </ul>
          </div>

          <div class="information footer-bottmom" v-if="false">
            <a href="#">
              <img src="@/assets/images/vn-verified.png" style="height: 38px"/>
            </a>
            <a href="#">
              <img src="@/assets/images/register-0.png" style="width: 100px"/>
            </a>
            <a href="#">
              <img src="@/assets/images/register-1.png" style="width: 100px"/>
            </a>
          </div>
        </div>
        <div class="clearfix"></div>
        <div class="copyright">
          <p>{{ $t('Besa Contact') }}</p>
          <p>{{ $t('Besa Business Information') }}</p>
          <p>Copyright © {{ year }} {{ config.title }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>

export default {
  name: "Footer",
  data() {
    return {
      config: require('@/config'),
      paymentMethod: [
        {logoImg: '@/assets/images/momo-logo.png', alt: 'momo'}
      ],
      customerServiceLinks: [
        {label: 'FAQs', url: ''},
        {label: 'Besa Blog', url: ''},
        {label: 'How to booking', url: ''}
      ],
      aboutBonoLinks: [
        {label: 'Careers', url: ''},
        {label: 'Terms', url: ''},
        {label: 'Privacy', url: ''},
        {label: 'Seller Channel', url: ''}
      ],
      socialList: [
        {name: 'Facebook', 'icon': 'logo-facebook', url: 'https://facebook.com'},
        {name: 'Instagram', 'icon': 'logo-instagram', url: 'https://instagram.com'},
        {name: 'Linkedin', 'icon': 'logo-linkedin', url: 'https://linkedin.com'}
      ],
      bonoApps: [
        {name: 'Google Play', 'icon': 'logo-apple', url: 'https://besa.vn/'},
        {name: 'App Store', 'icon': 'logo-android', url: 'https://besa.vn/'}
      ],
      moreLink: [{
        name: "Terms",
        url: '/article?id=1'
      }, {
        name: "Privacy",
        url: '/article?id=2'
      }, {
        name: "Return & Refund",
        url: ''
      }, {
        name: "FAQs",
        url: ''
      }], // 更多链接
      year: new Date().getFullYear(), // 当前年份
    };
  },
  methods: {
    goArticle(link) {
      // 跳转文章页
      let routeUrl = this.$router.resolve({
        path: link.url,
      });
      window.open(routeUrl.href, "_blank");
    },
    openUrl(url) {
      window.open(url, "_blank")
    }
  },
};
</script>

<style scoped lang="scss">
/*****************************底 部 开 始*****************************/
.footer {
  width: 100%;
  padding-top: 30px;

  //@include background_color($dominant_color);
}

.icon-row {
  margin: 15px auto;
  padding-top: 8px;
  width: 1000px;
  height: 64px;
}

.footer-icon {
  margin-left: 17px;
  margin-right: 17px;
  float: left;
}

.footer-icon-child {
  margin-top: 10px;
  overflow: hidden;
  position: absolute;
  width: 36px;
  height: 42px;
  text-indent: -999px;
}

.footer-icon-child-2 {
  background-position: 0 -43px;
}

.footer-icon-child-3 {
  background-position: 0 -86px;
}

.footer-icon-child-4 {
  background-position: 0 -129px;
}

.icp {
  > * {
    margin: 0 4px;
  }

  flex-direction: column;
}

.flex {
  display: flex;
  align-items: center;

  > img {
    margin-right: 4px;
  }
}

.footer-icon-text {
  margin-left: 45px;
  font-size: 18px;
  font-weight: bold;
  line-height: 64px;
}

.service-intro {
  width: 100%;
}

.service-type {
  padding: 10px 0;
  margin: 15px auto;
  width: 1200px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 2.0;
}

.service-type-info ul {
  list-style: none;
}

.service-type-info li {
  font-size: 14px;
  cursor: pointer;
  line-height: 26px;
}

.service-type-info li:hover {
  color: $secondary_color;
}

.service-type-info li:first-child {
  font-size: 16px;
  line-height: 28px;
  font-weight: bold;
}

.service-type-info li:first-child:hover {
  // font-size:15px;
  // font-weight: bold;
  color: $secondary_color;
}

.friend-link {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 1100px;
  padding: 10px 0;
  margin: 0px auto;
  border-top: 1px solid $accent_color;
}

.information {
  display: flex;

  > * {
    margin: 2px 0;
  }
}

.zhizhao {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.friend-link-item ul {
  list-style: none;
}

.friend-link-item li {
  padding: 5px 0px;
  float: left;
}

.friend-link-item li:hover {
  color: $secondary_color;
  margin-top: -2px;
}

.footer-bottmom:hover {
  margin-top: 0 !important;
}

.footer-bottmom > a:hover {
  color: $secondary_color;
}

.link-item {
  padding: 0px 8px;
  cursor: pointer;
  border-right: 1px solid $accent_color;
}

.link-last-item {
  border: none;
}

.copyright {
  width: 100%;
  line-height: 30px;
  text-align: center;
}

.copyright a {
  color: #232323;
  font-size: 20px;
}

.footer-icon-text {
  @include title_color($light_title_color);
}

.copyright,
.friend-link,
.service-type-info {
  @include sub_color($light_sub_color);
}

.footer-payment-icon {
  height: 30px;
  padding-right: 5px;
}

.logo-list {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  align-items: center;
}

.footer-header {
  line-height: 28px;
  font-weight: bold;
  text-transform: uppercase;
  color: #80848f;
}

.footer-body {
  cursor: pointer;
  line-height: 26px;
  color: #80848f;
}

.line {
  border: 1px solid $accent_color;
}

/*****************************底 部 结 束*****************************/
</style>
