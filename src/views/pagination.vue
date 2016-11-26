<template>
    <nav>
        <div class="m-page">
            <div class="u-page">
                <template v-if="query.start>1">
                    <a @click="jump(1)" class="pre" hidefocus="hidefocus">首页</a>
                    <a @click="jump(query.start-1)" class="pre" hidefocus="hidefocus">上一页</a>
                </template>
                <ul>
                    <template v-for="i in 7">
                        <template v-if="query.start-3+i>0 && query.start-3+i <= totalPage">
                            <li :class="{'crt': i===3 }"><a @click="jump(query.start-3+i)" hidefocus="hidefocus">{{query.start-3+i}}</a>
                            </li>
                        </template>
                    </template>
                    <template v-if="query.start+4<totalPage">
                        <li class="ellipsis">...</li>
                    </template>
                    <template v-if="query.start+3<totalPage">
                        <li><a @click="jump(totalPage)">{{totalPage}}</a></li>
                    </template>
                </ul>
                <template v-if="query.start<totalPage">
                    <a @click="jump(query.start+1)" class="next" hidefocus="hidefocus">下一页</a>
                </template>
            </div>
        </div>
    </nav>
</template>
<script>
    module.exports = {
        props:{
            query:{
                default:function(){
                    return {
                        start: -1,
                        limit: -1,
                        total: 1
                    };
                }
            }
        } ,
        data: function () {
            return {
            }
        },
        computed:{
            totalPage:function(){
                return Math.ceil(this.query.total / this.query.limit);
            }
        },
        methods: {
            jump: function (index) {
                if (index === this.query.start || index < 0 || index > this.totalPage) {
                    return;
                } else {
                    this.$dispatch("jump",index);
                }
            }

        },
    }
</script>