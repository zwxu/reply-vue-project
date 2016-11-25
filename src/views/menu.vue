<!--菜单-->
<template>
    <!--{{menuList|json}}-->
    <div class="g-doc">
        <div class="g-mn">
            <header class="g-top">
                <div class="u-ttl1">
                    <h2 id="func-title">{{$route.menuName}}</h2>

                    <div class="act">
                        <span>{{userName}},您好！</span> <span class="u-sep">|</span> <a href="api/auth/signOut">退出</a>
                    </div>
                </div>
            </header>
            <router-view class="view" id="view" keep-alive :transition="effect" transition-mode="out-in"></router-view>
            <div class="g-ft">
                <p>开发支持：小米金融上海团队</p>

                <p>问题反馈：<a href="mailto:fangxiangqian@xiaomi.com">fangxiangqian@xiaomi.com</a></p>
                <!--<button @click="foo">foo</button>-->
            </div>
        </div>
        <div class="g-sd">
            <div class="m-logo">
                <h1>米金融理财后台</h1>
            </div>
            <nav class="m-nav">
                <ul>
                    <template v-for="menu in menuList">
                        <template v-if="menu.status">
                            <li v-if="menu.menuUrl === '#'">
                                <p>{{menu.menuName}}</p>
                                <ol>
                                    <template v-for="subMenu in menu.subMenu">
                                        <menu-item :menu="subMenu"></menu-item>
                                    </template>
                                </ol>
                            </li>
                            <template v-else>
                                <menu-item :menu="menu"></menu-item>
                            </template>
                        </template>
                    </template>
                </ul>
            </nav>
        </div>

    </div>
</template>
<script>
    module.exports = {
        props: {},
        data: function () {
            return {
                menuList: [],
                userName: "",
            }
        },
        computed: {},
        events: {
            "init": function () {
                console.log("init menu");
                var menuList = this.menuList;
                if (menuList && menuList.length > 0 && menuList[0].menuCode === "m-statistics" && menuList[0].status) {
                    console.log("go to m-statistics");
                    this.$router.go("/statistics/index");
                }
            }
        }
        ,
        methods: {
            foo: function () {
                console.log("foo");
                var ret = "";
                var pre = ",\"";
                var mid = "\": {name:\"";
                var mid1 = "\",menuName:\"";
                var suff = "\",component: require('./../views/modal.vue')}";
                var bar = function (menuList) {
                    for (var menu of
                    menuList
                    )
                    {
                        if (menu.menuUrl === "#") {
                            bar(menu.subMenu);
                        } else {
                            console.log(pre + menu.menuUrl + mid + menu.menuCode + suff);
                            ret += pre + menu.menuUrl + mid + menu.menuCode + mid1 + menu.menuName + suff;
                        }
                    }
                };
                bar(this.menuList);
                console.log("ret:" + ret)
            }
        },
        ready: function () {
            var $this = this;
            /** 获取 menuList 和 username */
            var promise = new Promise(function (resolve, reject) {
                var url = $ApiConf.api_auth_menuList;
                console.log("url:" + url)
                $this.$am.ajax({
                    url: url,
                    success: function (data) {
                        resolve(data);
                    }
                })
            });

            promise.then(function (data) {
                $this.menuList = data.menuList;
                $this.userName = data.userName;

                if ($this.$route.path === "/") {
                    $this.$dispatch('init');
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        components: {
            menuItem: require("./menuItem.vue")
        }
    }
</script>