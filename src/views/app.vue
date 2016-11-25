<template>
  <div id="app">
    <img src="./images/logo.png">
    <hello></hello>
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
        hello: require('./components/Hello.vue'),
    },
    created: require('./js/created.js'),
    methods: require('./js/methods.js'),
    events: {},
    ready: function () {
    }
  };
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
