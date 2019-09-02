<template>
<div class="checkbox">
  <label>
    <input :id="id" :type="type" :name="name" :value="value" :disabled="disabled">
    <span class="lbl"><slot></slot></span>
  </label>
</div>
</template>

<script>
export default {
  props: {
    model: {
      twoWay: true
    },
    type: {
      type: String,
      default: 'checkbox'
    },
    id: {
      type: String
    },
    name: {
      type: String
    },
    value: {},
    disabled: {}
  }
};
</script>

<style lang="stylus">
@import "../styles/variables"
@import "../styles/mixins"

.checkbox
  margin: $padding-base-vertical 0
  > label
    padding-left: 0
    user-select: none
    > input
      visibility: hidden
      margin-left: -20px

      + .lbl
        &:before
          display: inline-block
          content: $fa-var-square-o
          font-family: FontAwesome
          font-size: 1.2em
          color: $text-muted
          line-height: 1em
          size: @line-height
          margin-right: 5px
          vertical-align: middle

      &:hover
      &:checked
        + .lbl
          &:before
            content: $fa-var-check-square

      &:checked
        + .lbl
          &:before
            color: $state-warning-text

      &:disabled
        + .lbl
          cursor: not-allowed

    > input[type=radio]
      + .lbl
        &:before
          content: $fa-var-circle-o

      &:hover
      &:checked
        + .lbl
          &:before
            content: $fa-var-check-circle

  &.check
    margin: 0
    &.form-control
      border-color: transparent
      box-shadow: none
      padding-left: 0
      padding-right: 0

    > label > input
      +.lbl
        padding-right: 18px

      &,
      &:hover
      &:checked
        + .lbl
          &:before
            content: $fa-var-check
            color: transparent

      &:checked
        + .lbl
          color: $brand-warning
          &:before
            color: $brand-warning

</style>
