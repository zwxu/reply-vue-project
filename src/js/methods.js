var zepto = require("webpack-zepto");
var format = require('string-format');
module.exports = {
    /*  mifi  */

    getApiPromise: function (url, menuCode) {
        console.log("api")
        var promise = new Promise(function (resolve, reject) {
            zepto.ajax({
                url: url,
                data: {
                    menuCode: menuCode
                },
                success: function (data) {
                    resolve(data);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("api请求失败，请刷新重试！")
                    reject(textStatus);
                }
            });
        });
        return promise;
    },


    getApis: function (url, menuCode, $data, hook) {
        console.log("api")
        zepto.ajax({
            url: url,
            data: {
                menuCode: menuCode
            },
            success: function (data) {
                $data.api = data;
                if (hook) {
                    console.log("hook");
                    hook();
                }
            }
        });
    },
    /*  mifi  */

    tracker: function (cat, extdata) {
        var trans_cat = '理财_' + cat;
        var getParam = function (name, source, flag) {
            var p = new RegExp(name + '=([^?&]*)');
            var m = window.location.search.match(p);
            if (m) {
                return m[1];
            }
        };
        var getHashParam = function (name) {
            var p = new RegExp(name + '=([^?&]*)');
            var m = window.location.hash.match(p);
            if (m) {
                return m[1];
            }
        };
        try {
            if (MiFiJsInternal && MiFiJsInternal.recordCountEvent) {
                var link = location.href.replace(location.search, '');
                MiFiJsInternal.recordCountEvent(trans_cat, link);
            }
        } catch (e) {
        }

        var getDeviceInfo = {};
        try {
            if (MiFiJsInternal && MiFiJsInternal.getDeviceInfo) {
                getDeviceInfo = JSON.parse(MiFiJsInternal.getDeviceInfo());
            }
        } catch (e) {
        }
        getDeviceInfo.pageTitle = encodeURIComponent(trans_cat);
        getDeviceInfo.productType = 'fund';
        getDeviceInfo.t = new Date().getTime();
        getDeviceInfo.from = getParam('from') || getHashParam("from") || 'local';
        getDeviceInfo.source = getParam('source') || getHashParam("source") || 'index';
        if (extdata) {
            for (var key in extdata) {
                getDeviceInfo[key] = extdata[key];
            }
        }
        var Img = new Image();
        var url = "https://api.jr.mi.com/images/stat.gif";
        Img.src = url + "?data=" + JSON.stringify(getDeviceInfo);
    },
    islogin: function () {
        var t = this;
        var userId = t.getCookie("userId");
        var serviceToken = t.getCookie("serviceToken");
        return userId && serviceToken;
    },
    registerLoginResult: function (cfg) {
        cfg = cfg || {};
        var activity_url = cfg.activity_url;
        var location_url = cfg.location_url;
        console.log("activity_url:" + activity_url);
        console.log("location_url:" + location_url);
        try {
            window.onLoginResult = function (suc, userId) {
                if (window.onLoginResult) {
                    delete window.onLoginResult;
                }
                if (suc) {
                    var url = activity_url.replace("nologin=true", "userId=" + userId);
                    try {
                        MiFiJsInternal.startActivity(url, "");
                    } catch (e) {
                        location.href = url;
                    }
                }
                location.href = location_url.replace("nologin=true", "userId=" + userId);
            }
        } catch (e) {
            console.log(e);
        }
    },
    ajax: function (conf) {
        var t = this;
        conf.params = conf.params || {};
        var userId = t.getCookie("userId");
        if (userId) {
            conf.params.userId = userId;
        }
        var serviceToken = t.getCookie("serviceToken");
        if (serviceToken && conf.type && conf.type.toLowerCase() == 'post') {
            conf.params.serviceToken = serviceToken;
        }
        if (conf.client) {
            var clientinfo = t.getClientInfo();
            t.extend(conf.params, clientinfo);
        }
        conf.data = conf.data || {};
        t.extend(conf.data, conf.params);
        zepto.ajax(conf);
    },
    nativeAjax: function (conf) {
        var t = this;
        var xhr = new XMLHttpRequest();
        var params = '';
        var url = conf.url;
        if (conf.cache !== undefined && !conf.cache) {
            conf.params = conf.params || {};
            t.extend(conf.params, {_t: new Date().getTime()});
        }
        //添加附加参数
        var userId = t.getCookie("userId");
        var serviceToken = t.getCookie("serviceToken");
        if (userId && serviceToken) {
            conf.params = conf.params || {};
            t.extend(conf.params, {userId: userId, serviceToken: serviceToken});
        }
        //
        var getParams = function (obj) {
            var pArr = []
            pArr.add = function (key, value) {
                if (value == null) value = ""
                this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
            }
            for (key in obj) {
                pArr.add(key, obj[key]);
            }
            params = '?' + pArr.join('&')
        }
        conf.params && getParams(conf.params);
        xhr.open(conf.method || 'GET', conf.url + params);
        xhr.onload = function () {
            if (this.status == 200) {
                conf.success(JSON.parse(xhr.responseText));
            } else {
                conf.error && conf.error(this.status);
            }
        }
        xhr.send()
    },
    extend: function (target, source) {
        var newObj = target;
        for (key in source) {
            if (source[key] !== undefined) newObj[key] = source[key]
        }
        return newObj
    },
    getParam: function (name, source, flag) {
        var sPageURL = window.location.search.substring(1);
        if (!!flag) {
            sPageURL = source;
        }
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == name) {
                return sParameterName[1];
            }
        }
    },
    getCookie: function (c_name) {
        if (document.cookie.length > 0) {
            var p = new RegExp(c_name + '="([^;]*)";?|' + c_name + '=([^;]+);?');
            var m = document.cookie.match(p);
            if (m) {
                if (m[1]) {
                    return m[1];
                } else if (m[2]) {
                    return m[2];
                }
            }
        }
        return ""
    },
    getClientInfo: function () {
        var client_info = {};
        client_info.cpPlugSupport = false;
        try {
            if (MiFiJsInternal.callChinaPay) {
                client_info.cpPlugSupport = true;
            }
        } catch (e) {
        }

        try {
            if (MiFiJsInternal.getDeviceId) {
                client_info.deviceId = MiFiJsInternal.getDeviceId();
            }
        } catch (e) {
        }

        client_info.simSupport = "N";
        try {
            if (MiFiJsInternal.getImsiMd5 && MiFiJsInternal.getImsiMd5()) {
                client_info.simSupport = "YY"
                client_info.simMD5 = MiFiJsInternal.getPhoneNumberMd5();
            } else {
                client_info.simSupport = "YN"
            }
        } catch (e) {

        }

        return client_info;
    },
    setTitle: function (title, appTitle) {
        if (appTitle) {
            try {
                if (MiFiJsInternal.getVersionCode() >= 31) {
                    document.title = appTitle;
                } else {
                    document.title = title;
                }
            } catch (e) {
                document.title = title;
            }
        } else {
            document.title = title;
        }
    },
    getAppTitle: function (title) {
        if (title) {
            title = title.replace("+", '<img src="android.resource://com.xiaomi.jr/drawable/alt_plus">');
        }
        return title;
    },
    formatUrl: function (pattern, obj) {
        var url = pattern;
        try {
            url = format(pattern, obj);
        } catch (e) {
            console.log("pattern:" + pattern + "," + e);
        }
        return url;
    },
    getATag: function (event) {
        var target = event.target;
        do {
            if (target.tagName != 'A') {
                continue
            }
            return target;
        } while (target = target.parentNode);
    }
};
