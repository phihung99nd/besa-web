/**
 * Cấu hình hộp lọc tìm kiếm chuyên gia
 * @property title: Tên gọi của nhóm bộ lọc
 * @property type: Loại thành phần UI của bộ lọc (radio, checkbox, slider, rate, input)
 * @property key: Tên object key để v-model cho form tìm kiếm, là duy nhất
 * @property default: Giá trị mặc định của bộ lọc
 * @property option: Cấu hình cho thành phần UI
 */
export const filterConfig = [
  {
    title: 'Còn trống',
    type: 'radio-list',
    key: 'slot',
    default: '',
    option: [
      {label: 'Bất kì ngày nào', value: 'ANY'},
      {label: 'Hôm nay', value: 'TODAY'}
    ]
  },
  {
    title: 'Giờ đặc biệt',
    type: 'checkbox-list',
    key: 'specialTime',
    default: [],
    option: [
      {label: 'Đầu giờ', value: 0},
      {label: 'Cuối giờ', value: 1}
    ]
  },
  {
    title: 'Giới tính',
    type: 'checkbox-list',
    key: 'gender',
    default: [],
    option: [
      {label: 'Nam', value: 0},
      {label: 'Nữ', value: 1}
    ]
  },
  {
    title: 'Khoảng giá',
    type: 'slider',
    key: 'price',
    default: [0, 20000000],
    option: {
      min: 0,
      max: 20000000,
      step: 25000,
      tipFormat: (val) => {
        return `${val} VNĐ`
      }
    }
  },
  {
    title: 'Đánh giá',
    type: 'rate',
    key: 'rating',
    default: 5,
    option: {
      allowHalf: true,
      size: '24px'
    }
  }
]
