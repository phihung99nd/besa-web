//  * icon  图标
//  * title 一级菜单
//  * display 是否显示菜单
//  * menus 菜单栏
//  * path路径  router 配置的

// 订单中心
const order = [{
  icon: 'solar:calendar-linear',
  iconColor: '#236bca',
  title: 'Order Management',
  menus: [{
    icon: '',
    title: 'Order',
    path: 'MyOrder'
  }, {
    icon: '',
    title: 'Booking',
    path: 'MyBooking'
  },
    //TODO
    // {
    //   icon: '',
    //   title: 'After Sale',
    //   path: 'AfterSale'
    // }
  ],
  display: true
}];

// 会员中心
const member = [{
  icon: 'solar:user-linear',
  iconColor: '#2ceea8',
  title: 'Account',
  menus: [{
    icon: '',
    title: 'Profile',
    path: 'Profile'
  },
    {
      icon: '',
      title: 'Address',
      path: 'MyAddress'
    },
    {
      icon: '',
      title: 'Account Safe',
      path: 'AccountSafe'
    },

    // {
    //   icon: '',
    //   title: 'Footprint',
    //   path: 'MyTracks'
    // },

    {
      icon: '',
      title: 'Favorites',
      path: 'Favorites'
    },
    // TODO
    // {
    //   icon: '',
    //   title: 'Distribution',
    //   path: 'Distribution'
    // },
    // {
    //   icon: '',
    //   title: 'Review',
    //   path: 'CommentList'
    // },
    //TODO
    // {
    //   icon: '',
    //   title: 'Complaints',
    //   path: 'ComplainList'
    // },
    // {
    //   icon: '',
    //   title: 'Point',
    //   path: 'Point'
    // },
    // {
    //   icon: '',
    //   title: 'Coupons',
    //   path: 'Coupons'
    // },
    //TODO
    // {
    //   icon: '',
    //   title: 'Money management',
    //   path: 'MoneyManagement'
    // }
  ],
  display: true
}];

const notification = [{
  icon: 'solar:bell-linear',
  iconColor: '#eed045',
  title: 'Notification',
  menus: [{
    icon: '',
    title: 'Order',
    path: 'OrderNotification'
  },
    {
      icon: '',
      title: 'Booking',
      path: 'BookingNotification'
    },
    {
      icon: '',
      title: 'Promotion',
      path: 'PromotionNotification'
    }],
  display: true
},]
// 活动中心
// const activity = [{
//   icon: '',
//   title: '活动中心',
//   menus: [
//     // {
//     //   icon: '',
//     //   title: '拍卖活动',
//     //   path: 'MyOrder',
//     // },
//     // {
//     //   icon: '',
//     //   title: '夺宝奇兵',
//     //   path: 'MyOrder',
//     // },
//   ],
//   display: true
// }]

// 批发中心
// const wholesale = [
//   {
//     icon: '',
//     title: '批发中心',
//     menus: [
//       {
//         icon: '',
//         title: '我的采购单',
//         path: 'MyOrder',
//       },
//       {
//         icon: '',
//         title: '采购退货单',
//         path: 'MyOrder',
//       },
//       {
//         icon: '',
//         title: '我的求购单',
//         path: 'MyOrder',
//       },
//
//     ],
//     display: true
//   }
// ]

// 店铺
// const shop = [
//   {
//     icon: '',
//     title: '店铺管理',
//     menus: [
//       {
//         icon: '',
//         title: '店铺后台',
//         path: 'MyOrder',
//       },
//       {
//         icon: '',
//         title: '商家等级',
//         path: 'MyOrder',
//       },
//     ],
//     display: true
//   }
// ]
// wholesale[0], shop[0]
let menuList = []
menuList.push(member[0], notification[0], order[0])

export default menuList
