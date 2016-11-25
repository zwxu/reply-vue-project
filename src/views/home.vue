<template>
    <div>
    </div>
</template>
<script>
    module.exports = {
        data: function () {
            return {
            }
        },
        methods: {
        },
        route: {
            activate: function (transition) {
//                console.log("init");
//                var $this = this;
//                var init = function(){
//                    $this.$dispatch('init');
//                }
//                setTimeout(init,200)
                transition.next();
            }
        },
        components: {

        }
    };
</script>