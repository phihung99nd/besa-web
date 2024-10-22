<template>
  <div class="shop-entry">
    <div class="content">
      <h1>{{ $t('Signup as BESA seller') }}</h1>
      <div class="seller-type">
        <Card class="seller-type-item" v-if="false">
          <div class="logo">
            <img src="@/assets/images/bono_mall.png" alt=""/>
          </div>
          <div class="title">{{ $t('Besa Seller') }}</div>
          <p class="subtitle">Kênh bán hàng dành cho các thương hiệu nội địa và quốc tế với cam kết hàng chính hãng 100% cùng trải nghiệm mua sắm và dịch vụ cao cấp.</p>
          <div style="width: 100%;">
            <ul>
              <li>Bạn là chủ sở hữu thương hiệu hoặc nhà phân phối được ủy quyền</li>
              <li>Được tham gia các chương trình khuyến mãi độc quyền của BonoSeller</li>
              <li>Ưu tiên hiển thị tìm kiếm</li>
              <li>Chỉ trả phí hoa hồng khi bán được hàng</li>
            </ul>
          </div>
          <div class="button" @click="routeTo('/shopEntry/bono')"><span>{{$t('Register')}}</span></div>
        </Card>
        <Card class="seller-type-item">
          <div class="logo">
            <img src="@/assets/images/vn_flag.png" alt=""/>
          </div>
          <div class="title">{{ $t('Domestic Seller') }}</div>
          <p class="subtitle">Dành cho tất cả các doanh nghiệp, hộ kinh doanh và công dân Việt Nam trên 18 tuổi</p>
          <div style="width: 100%;">
            <ul>
              <li>Bạn là người bán hàng trong nước</li>
<!--              <li>Miễn phí hoa hồng</li>-->
              <li>Được sử dụng các công cụ chuyên biệt</li>
            </ul>
          </div>
          <div class="button" @click="routeTo('/shopEntry/domestic')"><span>{{$t('Register')}}</span></div>
        </Card>
        <Card class="seller-type-item" v-if="false">
          <div class="logo">
            <img src="@/assets/images/worldwide.png" alt=""/>
          </div>
          <div class="title">{{ $t('Global Seller') }}</div>
          <p class="subtitle">Bán ra quốc tế</p>
          <div style="width: 100%;">
            <ul>
              <li>Bạn là người bán hàng ra quốc tế</li>
              <li>Ưu tiên hiển thị tìm kiếm</li>
              <li>Hưởng các ưu đãi chuyên biệt cho xác thực và thanh toán quốc tế</li>
            </ul>
          </div>
          <div class="button" @click="routeTo('/shopEntry/global')"><span>{{$t('Register')}}</span></div>
        </Card>
      </div>
    </div>
    <BaseFooter/>
  </div>
</template>

<script>
import NavigationBar from "@/pages/index/NavigationBar.vue";

export default {
  name: "ShopEntry",
  components: {NavigationBar},
  methods: {
    routeTo(url) {
      this.$router.push({path: url})
    }
  }
}
</script>

<style lang="scss" scoped>
.shop-entry {
  min-height: 100vh;
}

.content {
  width: 1200px;
  margin: 0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-height: 500px;
  border-radius: 20px;
  background: #fff;
  padding: 10px 20px;

  h1 {
    margin-top: 20px;
  }

  .seller-type {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-evenly;
    margin-top: 30px;

    &-item {
      width: 30%;
      height: 550px;
      padding: 10px 20px 20px 20px;
      border-radius: 20px;

      /deep/ .ivu-card-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        .logo {
          img {
            border-radius: 50%;
            object-fit: cover;
            width: 110px;
            height: 110px;
          }
        }
        .title {
          font-size: 24px;
          font-weight: 700;
        }

        .subtitle {
          min-height: 100px;
          color: #9a9a9a;
        }
        div ul {
          text-align: left;
          li {
            color: #9a9a9a;
            letter-spacing: 0;
            line-height: 20px;
            margin-bottom: 16px;
            &:before {
              content: "";
              clear: both;
              display: inline-block;
              width: 6px;
              height: 6px;
              background-color: $accent_color;
              border-radius: 50%;
              margin-right: 5px;
              vertical-align: middle;
            }
          }
        }

        .button {
          cursor: pointer;
          position: absolute;
          bottom: 21px;
          width: 213px;
          height: 50px;
          line-height: 50px;
          border-radius: 25px;
          background: linear-gradient(119deg, rgba(230,72,221,1) 13%, rgba(179,0,255,1) 100%);
          font-size: 16px;
          text-align: center;
          color: #fff;
          &::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border-radius: 25px;
            background-image: linear-gradient(270deg, rgba(230,72,221,1) 13%, rgba(201,0,255,1) 100%);
            opacity: 0;
            transition: opacity 0.7s;
          }
          &:hover::before {
            opacity: 1;
          }
          & > * {
            position: relative;
          }
        }
      }
    }
  }
}
</style>
