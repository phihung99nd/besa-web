const config = {
  closable: true, // 是否显示右上角关闭按钮
  mask: true, // 是否显示遮罩层

  menuList: [{
    icon: 'md-person', // menu的icon
    title: 'Account', // menu的标题
    titleShow: false,
    path: '', // menu点击的路径
    display: false // 是否显示此menu
  },
  {
    icon: 'ios-cart', // menu的icon
    title: 'Cart', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: 12,
    titleShow: true
  },
  {
    icon: 'md-clipboard', // menu的icon
    title: 'Order', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: '',
    titleShow: false
  },
  {
    icon: 'md-pricetag', // menu的icon
    title: 'Coupon', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: '',
    titleShow: false
  },
  {
    icon: 'logo-usd', // menu的icon
    title: 'Assets', // menu的标题
    path: '', // menu点击的路径
    display: false, // 是否显示此menu
    badge: '',
    titleShow: false
  },
  {
    icon: 'ios-eye', // menu的icon
    title: 'Footprint', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: '',
    titleShow: false
  },
  {
    icon: 'md-star', // menu的icon
    title: 'Favorites', // menu的标题
    path: '', // menu点击的路径
    display: true, // 是否显示此menu
    badge: '',
    titleShow: false
  }
  ]
}

export default config
