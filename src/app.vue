<template>
  <div class="app">
    <!-- 启动router-view-->
    <router-view class="view" id="view" keep-alive :transition="effect" transition-mode="out-in"></router-view>
    <hello></hello>
    <p>{{vvv}}</p>
    <div class="u-loading" v-if="loading"><em class="icn-loading"></em><p>正在加载...</p></div>
  </div>
</template>
<script>
  module.exports = {
    data: function () {
      return {
        effect: 'fade',
        loading: false,
        toast: {content: '正在加载...'},
        vvv: 'hello vue'
      };
    },
    components: {
      hello: require('./components/Hello.vue'),

    },
    created: require('./js/created.js'),
    methods: require('./js/methods.js'),
    events: {},
    ready: function () {
     /* console.log("app start");
      var $this = this;
      $this.$am.ajax({
        url: $ApiConf.api_list,
        success: function (data) {
          //已经使用该优惠券
            console.log(data);
          }
      });*/
    }
  };
</script>
