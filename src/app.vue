<template>
  <div class="app">
    <menu></menu>
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
        vvv: '参数'
      };
    },
    components: {
//            toast: require('./components/toast.vue'),
      menu: require('./views/menu.vue'),
    },
    created: require('./js/created.js'),
    methods: require('./js/methods.js'),
    events: {},
    ready: function () {
    }
  };
</script>
