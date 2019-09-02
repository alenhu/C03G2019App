<!--suppress ALL -->
<template>
   <div>
    <div id="login">
      <div id="login-modal">
        <div class="dialog modal zoom in">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-body">
                <div id="login-logo"></div>
                <form class="login-form" name="form" @submit.prevent="login" v-form>
                  <div class="form-group">
                    <label for="name" class="control-label">
                      用户名
                      <div class="form-notice">
                        <i class="fa fa-warning"></i>
                      </div>
                    </label>
                    <div class="login-input">
                      <input type="text" name="name" id="name"
                             class="form-control input-lg"
                             v-model="model.name" >
                      <i class="fa fa-fw fa-user"></i>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="password" class="control-label">
                      密&emsp;码
                      <div class="form-notice">
                        <i class="fa fa-warning"></i>
                      </div>
                    </label>
                    <div class="login-input">
                      <input type="password" name="password" id="password"
                             class="form-control input-lg"
                             v-model="model.password" >
                      <i class="fa fa-fw fa-key"></i>
                    </div>
                  </div>
                  <div class="form-group row">
                    <br>
                    <div class="col-xs-12 col-sm-7">
                      <button type="submit" class="btn btn-block btn-success btn-lg">
                        登录
                      </button>
                    </div>
                    <div class="col-xs-12 col-sm-5">
                      <checkbox :model.sync="remember">记住用户名</checkbox>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <p class="footer text-center">&copy; 福建星网锐捷通讯股份有限公司</p>
          </div>
        </div>
      </div>
    </div>
   </div>
</template>

<script>
import Checkbox from '../../components/checkbox';

export default {
  data: () => ({
    title: process.env.PKG_NAME || '登录',
    form: {},
    model: {
      name: '',
      password: ''
    },
    remember: true
  }),
  components: {
    Checkbox
  }
};
</script>

<style lang="stylus">
@import "../../styles/variables"
@import "../../styles/mixins"
#login
  .modal
    &.in
      display: block
      background: $white
      background-size: cover
    &-dialog
      width: 500px

      @media (min-width: $grid-float-breakpoint)
        .login-form
          margin: 10px 50px

    &-content
      box-shadow: 0 8px 10px rgba($black, .2)
      background: $white

  &-logo
    background: $white url('../../assets/logo.png') no-repeat 50%
    height: 70px
    background-size: contain
    margin-bottom: 20px

  .header
  .footer
    color: #a5a5a5
    margin: 10px 0

  .login
    &-input
      position: relative

      .form-control
        padding-left: 30px

      .fa
        absolute: top $padding-large-vertical left 6px
        color: #a5a5a5
        font-size: $font-size-large
        line-height: $line-height-base

  .control-label
    display: block

  .form-notice
    display: none

  .has-warning
    .form-notice
      display: block
      float: right
      color: $state-warning-text

  .checkbox
    margin: ($padding-large-vertical + ($font-size-large - $font-size-base) / 2) 0
</style>
