<!--菜单单项-->
<template>
    <!--{{$route.path.indexOf(menu.menuUrl)}}-->
    <li  :class="{'crt':$route.path.indexOf(menu.menuUrl)>=0}" :id="menu.menuCode" >
        <template v-if="menu.menuUrl.indexOf('http')>=0">
            <a target="_blank" href="{{menu.menuUrl}}" >{{menu.menuName}}</a>
        </template>
        <a  v-else  v-link="{path:menu.menuUrl}">
            {{menu.menuName}}
        </a>
    </li>
</template>
<script>
    module.exports = {
        props:["menu"],
        methods: {
        },
        ready:function(){
        }
    }
</script>