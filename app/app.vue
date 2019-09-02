<template>
  <div>
    <router-view
      id="container"
      class="container-fluid">
    </router-view>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus">
  @import "styles/index"
  $space-padding = 10px

  #container
    padding: $space-padding
    &.v
      &-transition
        transition: all .3s
        transform-origin: 50% 100%
        z-index: 1
      &-enter
      &-leave
        absolute: top 0 left 0
        width: 100%
        transform: scale3d(.9, .9, .9)
        opacity: 0

  .glyphicon
    @extend .fa
    &-ok
      &:before
        content: $fa-var-check
        color: $brand-primary

  // 修复safari浏览器中使用iframe嵌入服务界面显示异常：不显示滚动条、不支持fixed定位
  html,body
    height: 100%

  .container-fluid
    position: absolute
    top: 90px
    bottom: 0
    left: 0
    width: 100%
    overflow-y: auto
    -webkit-overflow-scrolling: touch
    padding-top: 5px !important

  .modal-dialog
    position: absolute
    left: 0
    right: 0
    top: 50%
    transform: translate(0, -50%) !important
</style>
