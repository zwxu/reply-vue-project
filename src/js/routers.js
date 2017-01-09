module.exports = function (router) {
    router.map({

        '/': {
            name: 'home',
            component: function (reslove) {
                return require(['./../views/home.vue'], reslove)
            }
        },
        '/student/index': {
            name: "student_index",
            menuName: "学生",
            component: function (reslove) {
                return require(['./../views/student/studentList.vue'], reslove)
            }
        },
        '/teacher/index': {
            name: "teacher_index",
            menuName: "老师",
            component: function (reslove) {
                return require(['./../views/teacher/teacherList.vue'], reslove)
            }
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