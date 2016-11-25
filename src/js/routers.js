module.exports = function (router) {
    router.map({

        '/': {
            name: 'home',
            component: function (reslove) {
                return require(['./../views/home.vue'], reslove)
            }
        },
        '/user/list': {
            component: require('./../views/user/userList.vue')
        },

        // not found handler
        '*': {
            component: require('./../views/not_found.vue')
        }
    });


    router.beforeEach(function (transition) {
        transition.next();
    });


    //可以记录访问路径
    router.afterEach(function (transition) {
    });

}