const home = [{
  icon: 'ios-home',
  title: 'Home',
  path: '/',
  menus: [],
}]

const service = [{
  icon: 'ios-book',
  title: 'Service',
  menus: [{
    icon: '',
    title: 'Service 1',
    path: ''
  }]
}]

const professor = [{
  icon: 'ios-person',
  title: 'Professor',
  path: 'professor',
  menus: []

}]

let navList = []
navList.push(home[0], service[0], professor[0])
export default navList
