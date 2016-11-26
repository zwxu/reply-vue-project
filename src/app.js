require('./css/style.css');//加载公共样式
// require('./css/style-new.css');


window.$PathConf = require('pathconf');//添加全局路径配置
window.$ApiConf = require('apiconf');//添加全局API配置


var Vue = require('vue');
var VueTouch = require('./js/vtouch');
var VueRouter = require('vue-router');
var AppMethods = require('./js/methods');

AppMethods.install = function (Vue, options) {
    Vue.prototype.$am = this;
};
Vue.use(AppMethods);
Vue.use(VueTouch);
Vue.use(VueRouter);

// register filters 自定义过滤器  金额格式化，
var filters = require('./js/filters');
Object.keys(filters).forEach(function (k) {
    Vue.filter(k, filters[k]);
});

var App = Vue.extend(require('./app.vue'));


//注册全局组件
var pagination = Vue.extend(require("./views/pagination.vue"));
Vue.component("pagination",pagination);

/*var calendar = Vue.extend(require("./plugins/calendar.vue"));
Vue.component("calendar",calendar);*/


//eventBus，全局事件，比如 toast
/*
 要放在 Vue.use(VueRouter); 之前
 因为当使用了 Vue.use(VueRouter)后，改写了 Vue 的实例化方法。
 */

var router = new VueRouter(
    {
        hashbang: false,  //为true的时候 example.com/#!/foo/bar ， false的时候 example.com/#/foo/bar
        //abstract:true,  //地址栏不会有变化
        //以下设置需要服务端设置
        //history: false,   //当使用 HTML5 history 模式时，服务器需要被正确配置 以防用户在直接访问链接时会遇到404页面。
        //saveScrollPosition: false
        linkActiveClass: 'custom-active-class' //全局设置连接匹配时的类名 参考http://vuejs.github.io/vue-router/en/link.html
    }
);

require('./js/routers')(router);

router.start(App, '#app');


