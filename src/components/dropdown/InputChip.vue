<template>
<div class="chip">
  <div class="content">
    {{label}}
  </div>
  <div class="close" @click.stop="close">
    <Icon type="md-close-circle"/>
  </div>
</div>
</template>

<script>
/**
 * Custom Input chip component
 * @param {String} [label=''] - Nội dung văn bản bên trong chip
 * @event on-close - Trigger sự kiện xóa bỏ chip đã chọn
 */
export default {
  name: "InputChip",
  props: {
    label: {
      type: String
    },
  },
  methods: {
    close(){
      this.$emit('on-close')
    }
  }
}
</script>

<style scoped lang="scss">
.chip {
  height: 28px;
  max-width: 200px;
  border: 1px solid $border_color;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  transition: background $common_transition_duration ease;
  pointer-events: none;

  &:hover {
    background: #eee;
  }

  .content {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .close {
    pointer-events: auto;
  }
}
</style>
