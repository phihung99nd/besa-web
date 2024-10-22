import Vue from "vue";
import Router from "vue-router";
import GoodsIndex from "@/pages/GoodsIndex.vue";
import GoodsIndexBk from "@/pages/GoodsIndexBk.vue";
import Index from "@/pages/Index.vue";
import DynamicPage from "@/pages/DynamicPage.vue";
import i18n from "@/locale";

const Login = (resolve) => require(["@/pages/Login"], resolve);
const SignUp = (resolve) => require(["@/pages/SignUp"], resolve);
const ForgetPassword = (resolve) =>
  require(["@/pages/ForgetPassword"], resolve);
const GoodsList = (resolve) => require(["@/pages/GoodsList"], resolve);
const GoodsDetail = (resolve) => require(["@/pages/GoodsDetail"], resolve);
const SearchResult = (resolve) => require(["@/pages/SearchResult"], resolve)
const StoreList = (resolve) => require(["@/pages/StoreList"], resolve)
const Professor = (resolve) => require(["@/pages/professor/Professor.vue"], resolve);
const ProfessorDetail = (resolve) => require(["@/pages/professor/ProfessorDetail.vue"], resolve);
const Service = (resolve) => require(["@/pages/Service"], resolve);
const ServiceDetail = (resolve) => require(["@/pages/ServiceDetail"], resolve);
const PointGoodsDetail = (resolve) =>
  require(["@/pages/promotion/PointGoodsDetail"], resolve);
const Cart = (resolve) => require(["@/pages/Cart"], resolve);
const Pay = (resolve) => require(["@/pages/payment/Pay"], resolve);
const Book = (resolve) => require(["@/pages/payment/Book"], resolve);
const Checkout = (resolve) => require(["@/pages/payment/Checkout"], resolve);
const PayDone = (resolve) => require(["@/pages/payment/PayDone"], resolve);
const PayMent = (resolve) => require(["@/pages/payment/PayMent"], resolve);
const ThirdPay = (resolve) => require(["@/pages/payment/ThirdPay"], resolve);
const Coupon = (resolve) => require(["@/pages/CouponCenter"], resolve);
const seckill = (resolve) => require(["@/pages/promotion/seckill"], resolve);
const article = (resolve) => require(["@/pages/article/index"], resolve);
const articleDetail = (resolve) => require(["@/pages/article/detail"], resolve);
const PointMall = (resolve) =>
  require(["@/pages/promotion/PointMall"], resolve);

const MyBooking = (resolve) =>
  require([`@/pages/home/bookingCenter/MyBooking`], resolve);
const BookingDetail = (resolve) =>
  require([`@/pages/home/bookingCenter/BookingDetail`], resolve);
const MyOrder = (resolve) =>
  require([`@/pages/home/orderCenter/MyOrder`], resolve);
const OrderDetail = (resolve) =>
  require([`@/pages/home/orderCenter/OrderDetail`], resolve);
const MyAddress = (resolve) =>
  require(["@/pages/home/orderCenter/MyAddress"], resolve);
const AddAddress = (resolve) =>
  require(["@/pages/home/orderCenter/AddAddress"], resolve);
const Complain = (resolve) =>
  require(["@/pages/home/orderCenter/Complain"], resolve);
const AfterSale = (resolve) =>
  require(["@/pages/home/orderCenter/AfterSale"], resolve);
const AfterSaleDetail = (resolve) =>
  require(["@/pages/home/orderCenter/AfterSaleDetail"], resolve);
const ApplyAfterSale = (resolve) =>
  require(["@/pages/home/orderCenter/ApplyAfterSale"], resolve);

const Profile = (resolve) =>
  require(["@/pages/home/memberCenter/Profile"], resolve);
const AccountSafe = (resolve) =>
  require(["@/pages/home/memberCenter/AccountSafe"], resolve);
const ModifyPwd = (resolve) =>
  require(["@/pages/home/memberCenter/ModifyPwd"], resolve);
const Favorites = (resolve) =>
  require(["@/pages/home/memberCenter/Favorites"], resolve);
const Distribution = (resolve) =>
  require(["@/pages/home/memberCenter/Distribution"], resolve);
const CommentList = (resolve) =>
  require(["@/pages/home/memberCenter/CommentList"], resolve); // 评价列表
const AddEval = (resolve) =>
  require(["@/pages/home/memberCenter/evaluation/AddEval"], resolve); // 添加评价
const EvalDetail = (resolve) =>
  require(["@/pages/home/memberCenter/evaluation/EvalDetail"], resolve);
const ComplainList = (resolve) =>
  require(["@/pages/home/memberCenter/ComplainList"], resolve);
const ComplainDetail = (resolve) =>
  require(["@/pages/home/memberCenter/ComplainDetail"], resolve);
const Point = (resolve) =>
  require(["@/pages/home/memberCenter/Point"], resolve);
const MsgList = (resolve) =>
  require(["@/pages/home/memberCenter/memberMsg/MsgList"], resolve);
const MsgDetail = (resolve) =>
  require(["@/pages/home/memberCenter/memberMsg/MsgDetail"], resolve);

const Coupons = (resolve) =>
  require(["@/pages/home/userCenter/Coupons"], resolve);
const MyTracks = (resolve) =>
  require(["@/pages/home/userCenter/MyTracks"], resolve);
const MoneyManagement = (resolve) =>
  require(["@/pages/home/userCenter/MoneyManagement"], resolve);

const Home = (resolve) => require(["@/pages/user/Home"], resolve);

const Merchant = (resolve) => require(["@/pages/Merchant"], resolve);
const MerchantBranch = (resolve) => require(["@/pages/MerchantBranch"], resolve);
const UserMain = (resolve) => require(["@/pages/home/Main"], resolve);
const NotificationList = (resolve) => require(["@/pages/home/memberCenter/NotificationList"], resolve)

const ShopEntry = (resolve) =>
  require(["@/pages/shopEntry/StoreRegisterForm.vue"], resolve);
const DomesticEntry = (resolve) => require(["@/pages/shopEntry/domesticEntry"], resolve)
const BonoEntry = (resolve) => require(["@/pages/shopEntry/domesticEntry"], resolve)
const GlobalEntry = (resolve) => require(["@/pages/shopEntry/domesticEntry"], resolve)
const PolicyDetail = (resolve) => require(["@/pages/article/PolicyDetail.vue"], resolve)
const Nearby = (resolve) => require(["@/pages/Nearby.vue"], resolve)

Vue.use(Router);

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

export default new Router({
  mode: "history",
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 })
      }, 300)
    })
  },
  routes: [
    {
      path: "/",
      name: "Index",
      component: Index,
      meta: {
        title: "BESA - Booking Now"
      }
    },
    {
      path: "*",
      name: "Dynamic page",
      component: DynamicPage,
      meta: {
        title: "BESA - Booking Now"
      }
    },
    {
      path: "/goods/index",
      name: "Goods Index",
      component: GoodsIndex,
      meta: {
        title: "BESA - Booking Now"
      }
    },
    {
      path: "/nearby",
      name: "Nearby",
      component: Nearby,
      meta: {
        title: "Nearby"
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        title: "Đăng nhập",
      },
    },
    {
      path: "/SignUp",
      name: "SignUp",
      component: SignUp,
      meta: {
        title: "Đăng ký",
      },
    },
    {
      path: "/forgetPassword",
      name: "forgetPassword",
      component: ForgetPassword,
      meta: {
        title: "Quên mật khẩu",
      },
    },
    {
      path: "/goodsList",
      name: "GoodsList",
      component: GoodsList,
    },
    {
      path: "/goodsDetail",
      name: "GoodsDetail",
      component: GoodsDetail,
      meta: {title: "Thông tin sản phẩm"},
    },
    {
      path: "/service",
      name: "service",
      component: Service,
      props: true,
      meta: {title: "Thông tin dich vu"},
    },
    {
      path: "/expert",
      name: "Professor",
      component: Professor,
      meta: {title: "Chuyên gia"},
    },
    {
      path: "/expert/detail",
      name: "Professor detail",
      component: ProfessorDetail,
      meta: {title: "Chuyên gia"},
    },
    {
      path: "/search",
      name: "Search result",
      component: SearchResult,
      meta: {title: "Tìm kiếm"},
    },
    {
      path: "/search_store",
      name: "Store list",
      component: StoreList,
      meta: {title: "Tìm kiếm"},
    },
    {
      path: "/serviceDetail",
      name: "ServiceDetail",
      component: ServiceDetail,
      meta: {title: "Thông tin dịch vụ"},
    },
    {
      path: "/pointGoodsDetail",
      name: "PointGoodsDetail",
      component: PointGoodsDetail,
      meta: {title: "Rating"},
    },
    {
      path: "/cart",
      name: "Cart",
      component: Cart,
      meta: {title: "Cart"},
    },
    {
      path: "/pay",
      name: "Pay",
      component: Pay,
      meta: {title: "Payment"},
    },
    {
      path: "/book",
      name: "Book",
      component: Book,
      meta: {title: "Booking"},
    },
    {
      path: "/checkout",
      name: "Checkout",
      component: Checkout,
      meta: {title: "Booking"},
    },
    {
      path: "/payMent",
      name: "PayMent",
      component: PayMent,
    },
    {
      path: "/PointMall",
      name: "PointMall",
      component: PointMall,
      meta: {title: "PointMall"},
    },
    {
      path: "/qrpay",
      name: "qrpay",
      component: ThirdPay,
    },
    {
      path: "/payDone",
      name: "PayDone",
      props: true,
      component: PayDone,
    },
    {
      path: "/article",
      name: "article",
      component: article,
      meta: {
        title: "Article",
      },
    },
    {
      path: "/article/detail",
      name: "articleDetail",
      component: articleDetail,
      meta: {
        title: i18n.t('Help center'),
      },
    },
    {
      path: "/article/policy",
      name: "policyDetail",
      component: PolicyDetail,
      meta: {
        title: i18n.t('Policy Detail'),
      },
    },
    {
      path: "/shopEntry",
      name: "shopEntry",
      component: ShopEntry,
      meta: {
        title: "Shop Entry",
      },
    },
    // {
    //   path: "/shopEntry/domestic",
    //   name: "shopEntryDomestic",
    //   component: DomesticEntry,
    //   meta: {
    //     title: "Domestic Entry",
    //     needLogin: true
    //   }
    // },
    // {
    //   path: "/shopEntry/bono",
    //   name: "shopEntryBono",
    //   component: BonoEntry,
    //   meta: {
    //     title: "Besa Entry",
    //     needLogin: true
    //   }
    // },
    // {
    //   path: "/shopEntry/global",
    //   name: "shopEntryGlobal",
    //   component: GlobalEntry,
    //   meta: {
    //     title: "Global Entry",
    //     needLogin: true
    //   }
    // },
    {
      path: "/coupon",
      name: "coupon",
      component: Coupon,
      meta: {
        title: "Coupon",
      },
    },
    {
      path: "/seckill",
      name: "seckill",
      component: seckill,
      meta: {
        title: "Time-kill",
      },
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/",
          name: "Home",
          component: UserMain,
          meta: {
            title: "Quản lý tài khoản",
            needLogin: true
          },
        },
        {
          path: "MyTracks",
          name: "MyTracks",
          component: MyTracks,
          meta: {
            title: "Footprint",
            needLogin: true
          },
        },
        {
          path: "MoneyManagement",
          name: "MoneyManagement",
          component: MoneyManagement,
          meta: {
            needLogin: true
          }
        },
        {
          path: "Complain",
          name: "Complain",
          component: Complain,
          meta: {
            needLogin: true
          }
        },
        {
          path: "Coupons",
          name: "Coupons",
          component: Coupons,
          meta: {
            needLogin: true
          }
        },
        {
          path: "CommentList",
          name: "CommentList",
          component: CommentList,
          mate: {
            title: "Evaluation list",
            needLogin: true

          },
        },
        {
          path: "ComplainList",
          name: "ComplainList",
          component: ComplainList,
          meta: {
            needLogin: true
          }
        },
        {
          path: "ComplainDetail",
          name: "ComplainDetail",
          component: ComplainDetail,
          meta: {
            needLogin: true
          }
        },
        {
          path: "AccountSafe",
          name: "AccountSafe",
          component: AccountSafe,
          meta: {
            needLogin: true
          }
        },
        {
          path: "ModifyPwd",
          name: "ModifyPwd",
          component: ModifyPwd,
          meta: {
            needLogin: true
          }
        },
        {
          path: "Favorites",
          name: "Favorites",
          component: Favorites,
          meta: {
            title: "Favorites",
            needLogin: true
          },
        },
        {
          path: "Distribution",
          name: "Distribution",
          component: Distribution,
          meta: {
            title: "Distribution recommendation",
            needLogin: true
          },
        },
        {
          path: "Point",
          name: "Point",
          component: Point,
          meta: {
            title: "Point",
            needLogin: true
          },
        },
        {
          path: "Profile",
          name: "Profile",
          component: Profile,
          meta: {
            needLogin: true
          }
        },
        {
          path: "AfterSale",
          name: "AfterSale",
          component: AfterSale,
          meta: {
            title: "After sales",
            needLogin: true
          },
        },
        {
          path: "ApplyAfterSale",
          name: "ApplyAfterSale",
          component: ApplyAfterSale,
          meta: {
            title: 'Apply for after sales',
            needLogin: true
          },
        },
        {
          path: "MyAddress",
          name: "MyAddress",
          component: MyAddress,
          meta: {
            title: "Address",
            needLogin: true
          },
        },
        {
          path: "MsgList",
          name: "MsgList",
          component: MsgList,
          meta: {title: "Messages"},
        },
        {
          path: "MsgDetail",
          name: "MsgDetail",
          component: MsgDetail,
          meta: {title: "Messages"},
        },
        {
          path: "MyOrder",
          name: "MyOrder",
          component: MyOrder,
          meta: {
            title: "Quản lý đơn hàng",
            needLogin: true
          },
        },
        {
          path: "MyBooking",
          name: "MyBooking",
          component: MyBooking,
          meta: {
            title: "Dịch vụ của tôi ",
            needLogin: true
          },
        },
        {
          path: "bookingDetail",
          name: "bookingDetail",
          component: BookingDetail,
          meta: {
            title: "Chi tiết dịch vụ",
            needLogin: true
          },
        },
        {
          path: "OrderDetail",
          name: "OrderDetail",
          component: OrderDetail,
          meta: {
            title: "Chi tiết Đơn hàng",
            needLogin: true
          },
        },
        {
          path: "AfterSaleDetail",
          name: "AfterSaleDetail",
          component: AfterSaleDetail,
          meta: {
            title: "After sales details",
            needLogin: true
          },
        },
        {
          path: "notification",
          name: "Notification",
          component: NotificationList,
          redirect: {
            name: 'OrderNotification'
          },
          children: [
            {
              path: "order",
              name: "OrderNotification",
              meta: {
                needLogin: true,
                notiType: 'order'
              }
            },
            {
              path: "booking",
              name: "BookingNotification",
              meta: {
                needLogin: true,
                notiType: 'booking'
              }
            }, {
              path: "promotion",
              name: "PromotionNotification",
              meta: {
                needLogin: true,
                notiType: 'promotion'
              }
            }
          ],
          meta: {
            needLogin: true,
          }
        },
      ],
    },
    {
      path: "/merchant",
      name: "Merchant",
      component: Merchant,
      meta: {title: i18n.t('Merchant')},
    },
    {
      path: "/merchant/branch",
      name: "Merchant branch",
      component: MerchantBranch,
      props: true,
      meta: {title: i18n.t('Merchant branch')},
    },
  ],
});
