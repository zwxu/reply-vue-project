<template>
    <table class="u-table" border="1">
        <thead>
        <tr>
            <th class="col0">loginname</th>
            <th class="col1">password</th>
            <th class="col1">operation</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="item in userList">
            <tr>
                <td>{{ item.loginname}}</td>
                <td>{{item.password}}</td>
                <td>delete</td>
            </tr>
        </template>

        </tbody>
    </table>
</template>
<script>
    module.exports = {
        data: function () {
            var $this = this;
            return {
                title: "银行产品限额",
                appTitle: "银行产品限额",
                userList:{}
            };
        },
        watch: {},
        methods: {},
        route: {
            activate: function (transition) {
                console.log("app start");
                 var $this = this;
                 $this.$am.ajax({
                 url: $ApiConf.api_list,
                     success: function (data) {

                         $this.$set("userList",data.userList);
                     }
                 });
                transition.next();
            }
        },
        components: {},
        attached: function () {
        },
        detached: function () {
        }
    };
</script>
