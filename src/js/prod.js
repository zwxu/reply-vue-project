try {
    if (Promise);
} catch (e) {
    Promise = require("promise");
}
var key_purchase_fail_change_bankcard = "purchase_fail_change_bankcard";
module.exports = {
    __product_info_init: function (cfg) {
        var $this = this;
        var prod = cfg.prod;
        if (!prod) {
            return;
        }
        var productInfoUrl = prod.productInfoUrl;
        if (!productInfoUrl) {
            return;
        }
        window.callback = function(data){
            //console.log(data);
        }
        var promise1 = new Promise(function (resolve, reject) {
            $this.$am.ajax({
                url: productInfoUrl,
                cache:true,
                dataType:"jsonp",
                jsonpCallback:"callback",
                success: function (data) {
                    resolve(data);
                },
                error: function (xhr, type) {
                },
                complete: function () {
                }
            });
        });

        Promise.all([promise1]).then(function (res) {
            var prodinfodata = res[0];
            var pc = prodinfodata.pc;
            if(pc && !(pc instanceof Array)){
                pc = [pc];
            }
            $this.$set("prod.info", prodinfodata);
            $this.$set("prod.info.pc", pc);
        }, function (err) {
            console.log(err);
        });
    },
    __purchase_common_init: function (cfg) {
        var $callback = cfg.$callback;
        var prodConfApi = cfg.prodConfApi;
        var userProdConfApi = cfg.userProdConfApi;
        var $this = this;
        var prodId = $this.$route.query.prodId;
        var prodCode = $this.$route.query.prodCode;
        var params = {
            prodId: prodId,
            prodCode: prodCode
        }
        var promise1 = new Promise(function (resolve, reject) {
            $this.$am.ajax({
                url: prodConfApi,
                type: "get",
                cache: false,
                params: params,
                success: function (data) {
                    resolve(data);
                }
            });
        });

        var promise2 = new Promise(function (resolve, reject) {
            $this.$am.ajax({
                url: userProdConfApi,
                type: "get",
                cache: false,
                params: params,
                success: function (data) {
                    resolve(data);
                }
            });
        });

        var promise3 = new Promise(function (resolve, reject) {
            $this.$am.ajax({
                url: $ApiConf.api_bankacct_getbankacctlist,
                type: "get",
                cache: false,
                params: params,
                success: function (data) {
                    resolve(data);
                }
            });
        });

        var promise4 = new Promise(function (resolve, reject) {
            $this.$am.ajax({
                url: $ApiConf.api_sys_getconf,
                cache: false,
                success: function (data) {
                    resolve(data);
                }
            });
        });

        var promise5 = new Promise(function (resolve, reject) {
            $this.$am.ajax({
                url: $ApiConf.api_coupon_list,
                cache: false,
                success: function (data) {
                    resolve(data);
                }
            });
        });


        Promise.all([promise1, promise2, promise3, promise4, promise5]).then(function (res) {
            //产品配置数据
            var prodconfdata = res[0];
            var prodconf = prodconfdata;
            var prod = prodconfdata.prod;
            var bankLimitList = prodconfdata.bankLimitList;
            $this.$set("prod", prod);
            {
                //产品信息初始化
                if (prod && prod.productInfoUrl) {
                    $this.$am.ajax({
                        url: prod.productInfoUrl,
                        cache: true,
                        dataType: "jsonp",
                        jsonpCallback: "callback",
                        success: function (data) {
                            var prodinfodata = data;
                            $this.$set("prod.info", prodinfodata);
                        },
                        error: function (xhr, type) {
                        },
                        complete: function () {
                        }
                    });
                }
            }
            $this.$set("prodconf", prodconf);
            $this.$set("risk.showType", prod.evaluationType);
            var title = "购买" + prod.prodName;
            $this.$set("title", title);
            $this.$set("appTitle", $this.$am.getAppTitle(title));
            $this.$am.tracker(prod.prodName + "购买");
            $this.$set("canPurchase", prodconfdata.prod.canPurchase);
            $this.$set("purchasePageNotPurchaseLabel", prodconfdata.prod.purchasePageNotPurchaseLabel);

            //用户产品配置数据
            var userprodconfdata = res[1];
            var risk = userprodconfdata.risk;
            var purchaseBankAcctMaintList;
            var purchaseBankAcct;
            $this.$set("userprodconf", userprodconfdata);
            $this.$set("risk.evaluation", risk.evaluation);
            $this.$set("risk.level", risk.evaluationLevel);
            $this.$set("canPurchase", userprodconfdata.prod.canPurchase);
            $this.$set("purchasePageNotPurchaseLabel", userprodconfdata.prod.purchasePageNotPurchaseLabel);
            //if (userprodconfdata.PURCHASE) {
            purchaseBankAcctMaintList = userprodconfdata.bankAcctMaintList;
            purchaseBankAcct = userprodconfdata.bankAcct;
            $this.$set("canPurchase", userprodconfdata.prod.canPurchase);
            $this.$set("purchasePageNotPurchaseLabel", userprodconfdata.prod.purchasePageNotPurchaseLabel);
            //}

            //生成购买银行卡维护Map
            var purchaseBankAcctMaintMap = {};
            if (purchaseBankAcctMaintList) {
                for (var i = 0; i < purchaseBankAcctMaintList.length; i++) {
                    var bankAcctMaint = purchaseBankAcctMaintList[i];
                    purchaseBankAcctMaintMap[bankAcctMaint.bankAcctId] = bankAcctMaint;
                }
            }


            //银行卡数据
            var bankacctdata = res[2];
            if (bankacctdata) {

                //配置银行限额MAP
                var bankLimitMap = {};
                if (bankLimitList) {
                    for (var i = 0; i < bankLimitList.length; i++) {
                        var bankLimit = bankLimitList[i];
                        var bankCode = bankLimit.bankCode;
                        if (!bankCode) {
                            continue;
                        }
                        bankLimitMap[bankCode] = bankLimit;
                    }
                }
                //

                //银行卡列表
                var bankAcctList = bankacctdata.bankAcctList;
                //基金卡列表
                var fundAcctList = bankacctdata.fundAcctList;
                //处理中卡列表
                var bankAcctProcList = bankacctdata.bankAcctProcList;

                var currentBankAcct;

                //装载银行卡维护信息
                if (bankAcctList) {
                    for (var i = 0; i < bankAcctList.length; i++) {
                        var bankAcct = bankAcctList[i];
                        var bankAcctId = bankAcct.bankAcctId;
                        var bankAcctMaint = purchaseBankAcctMaintMap[bankAcctId];
                        if (bankAcctMaint) {
                            $this.$am.extend(bankAcct, bankAcctMaint);
                        }
                    }
                }
                if (fundAcctList) {
                    for (var i = 0; i < fundAcctList.length; i++) {
                        var bankAcct = fundAcctList[i];
                        var bankAcctId = bankAcct.bankAcctId;
                        var bankAcctMaint = purchaseBankAcctMaintMap[bankAcctId];
                        if (bankAcctMaint) {
                            $this.$am.extend(bankAcct, bankAcctMaint);
                        }
                    }
                }


                //判断是否基金类产品
                if (prod.instCategory == 'Funds') {
                    if (fundAcctList.length > 0) {
                        currentBankAcct = fundAcctList[0];
                        if (currentBankAcct) {
                            var bankLimit = bankLimitMap[currentBankAcct.bankCode];
                            if (bankLimit) {
                                $this.$am.extend(currentBankAcct, bankLimit);
                            }
                        }
                    }
                }

                if (!(prod.instCategory == 'Funds') && !currentBankAcct) {
                    //最近一次购买的银行卡
                    var $purchaseBankAcct;
                    //最大限额的银行卡
                    var $maxLimitBankAcct;
                    for (var i = 0; i < bankAcctList.length; i++) {
                        var $currentBankAcct = bankAcctList[i];
                        var bankLimit = bankLimitMap[$currentBankAcct.bankCode];
                        if (!bankLimit) {
                            continue;
                        }
                        $this.$am.extend($currentBankAcct, bankLimit);

                        if (purchaseBankAcct && purchaseBankAcct.bankCode == $currentBankAcct.bankCode && purchaseBankAcct.bankAcct == $currentBankAcct.bankAcct) {
                            $purchaseBankAcct = $currentBankAcct;
                        }

                        if (!$maxLimitBankAcct) {
                            $maxLimitBankAcct = $currentBankAcct;
                        } else {
                            var $currentSingleLimitAmount = $currentBankAcct.singleLimitAmount;
                            var $maxSingleLimitAmount = $maxLimitBankAcct.singleLimitAmount;
                            if (!$currentSingleLimitAmount && $maxSingleLimitAmount) {
                                $maxLimitBankAcct = $currentBankAcct;
                            } else if ($currentSingleLimitAmount && $maxSingleLimitAmount) {
                                //获取最大限额银行卡
                                if ($currentSingleLimitAmount > $maxSingleLimitAmount) {
                                    $maxLimitBankAcct = $currentBankAcct;
                                }
                            }
                        }
                    }

                    //判断是否上一次购买银行卡(默认选中上一次购买的银行卡)
                    if ($purchaseBankAcct) {
                        currentBankAcct = $purchaseBankAcct;
                    } else {
                        currentBankAcct = $maxLimitBankAcct;
                    }
                }

                $this.$set("bankcard.bankAcctList", bankAcctList);
                $this.$set("bankcard.fundAcctList", fundAcctList);
                $this.$set("bankcard.bankAcctProcList", bankAcctProcList);
                $this.$set("bankcard.bankLimitMap", bankLimitMap);
                $this.$set("bankcard.current", currentBankAcct);

            }

            //系统全局配置
            var sysconfdata = res[3];
            if (sysconfdata) {
                var tgt_bc = $this.tgt_bc || {};
                var auth = sysconfdata.auth || {};
                $this.$am.extend(tgt_bc, auth);
            }

            //粮票列表
            var coupondata = res[4];
            $this.$set("coupon.couponList", coupondata);
            var couponId = $this.$route.query.couponId;
            try {
                if (coupondata) {
                    for (var i = 0; i < coupondata.length; i++) {
                        if (prod.prodCode == coupondata[i]['activeProdCode']) {
                            $this.$set("coupon.usable", true);
                            if (couponId == coupondata[i]['couponId']) {
                                $this.$set("coupon.current", coupondata[i]);
                            }
                        }

                    }
                }
            } catch (e) {
                console.log(e);
            }

            //换卡购买处理
            try {
                if (window.localStorage) {
                    var value = window.localStorage.getItem(key_purchase_fail_change_bankcard);
                    if (value) {
                        window.localStorage.removeItem(key_purchase_fail_change_bankcard);
                        if (prod.prodCode == JSON.parse(value).prodCode) {
                            $this.openbankcard();
                            $this.$am.tracker("换卡购买_"+prod.prodName);
                        }
                    }
                }
            } catch (e) {
            }
            //

            if ($callback) {
                $callback();
            }
        }, function (err) {
            console.log(err);
        });
    }
    ,
    __purchase_contact_init: function (cfg) {
        var $this = this;
        $this.$am.ajax({
            url: $ApiConf.api_userinfo_getcontactinfo,
            success: function (data) {
                if (data) {
                    var contact = {
                        exist: true
                    }
                    $this.$am.extend(contact, $this.contact);
                    var contactInfo = data.record;
                    if (data.success && contactInfo) {
                        $this.$am.extend(contact, contactInfo);
                        if (contactInfo.address != '' && contactInfo.address) {
                            contact.fullAddress = contactInfo.provinceName + " " + contactInfo.cityName + " " + contactInfo.address;
                            //contact.fullAddress = contactInfo.address;
                        }
                    }
                    $this.$set("contact", contact);
                }
            },
            complete: function () {
            }
        });
    }
    ,
    __purchase_success_cb: function (cfg) {
        var $this = this;
        var callbackId = cfg.callbackId;
        var errorCode = cfg.errorCode;
        var errorDesc = cfg.errorDesc;
        var responseData = cfg.responseData;
        var result = cfg.result;
        //
        var currentBankAcct = $this.tgt_bc.bankAcct;
        if (currentBankAcct) {
            $this.$set("bankcard.current", currentBankAcct);
        }
        //
        $this.purchase(callbackId, errorCode, errorDesc, responseData);
    }
    ,
    __purchase_error_cb: function (cfg) {
        var $this = this;
        var callbackId = cfg.callbackId;
        var errorCode = cfg.errorCode;
        var errorDesc = cfg.errorDesc;
        var responseData = cfg.responseData;
        var result = cfg.result;
        if (result) {
            result.show = true;
            $this.$set("result", result);
        }
    }
    ,
    __purchase_success_pp: function (cfg) {
        var $this = this;
        var callbackId = cfg.callbackId;
        var errorCode = cfg.errorCode;
        var errorDesc = cfg.errorDesc;
        var responseData = cfg.responseData;
        var result = cfg.result;
        $this.purchase(callbackId, errorCode, errorDesc, responseData);
    }
    ,
    __purchase_error_pp: function (cfg) {
        var $this = this;
        var callbackId = cfg.callbackId;
        var errorCode = cfg.errorCode;
        var errorDesc = cfg.errorDesc;
        var responseData = cfg.responseData;
        var result = cfg.result;
        if (result) {
            result.show = true;
            $this.$set("result", result);
        }
    }
    ,
    __purchase: function (cfg) {
        var $this = this;
        var callbackId = cfg.callbackId;
        var errorCode = cfg.errorCode;
        var errorDesc = cfg.errorDesc;
        var responseData = cfg.responseData;
        var purchaseApi = cfg.purchaseApi;


        $this.$set("purchasing", true);
        var prodId = $this.$route.query.prodId;
        var prodCode = $this.$route.query.prodCode;
        var amount = $this.amount;
        var params = {
            prodId: prodId,
            prodCode: prodCode,
            event: callbackId,
            responseData: responseData,
            amount: amount
        };

        //添加优惠券ID
        try {
            var coupon = $this.coupon.current;
            if (coupon) {
                params.couponId = coupon.couponId;
            }
        } catch (e) {
        }

        //当前选中银行卡
        try {
            var bankAcct = $this.bankcard.current;
            if (bankAcct) {
                params.bankAcctId = bankAcct.bankAcctId;
            }
        } catch (e) {
        }

        $this.$am.ajax({
            url: purchaseApi,
            cache: false,
            type: 'post',
            params: params,
            success: function (data) {
                if (data) {
                    var result = data;
                    result.show = true;
                    $this.$set("result", result);
                }
            },
            error: function (status) {
            },
            complete: function () {
                $this.$set("processing", false);
                $this.$set("purchasing", false);
            }
        });
    }
    ,
    __purchase_event_request: function (event) {
        var $this = this;
        if (!$this.enable) {
            return;
        }

        //check contact complete
        if ($this.cantactCheck && !$this.cantactCheck()) {
            return;
        }

        var prod = $this.prod;
        if (prod && prod.needEvaluation) {
            if (!$this.risk.evaluation) {
                $this.$set("risk.show", true);
                $this.$set("risk.compType", "evaluation");
            } else {
                $this.$set("risk.show", true);
                $this.$set("risk.compType", "tip");
            }
        } else {
            $this.riskConfirm();
        }
    }
    ,
    __purchase_event_confirm: function (event) {
        this.$set("risk.show", true);
    }
    ,
    __purchase_event_risk_confirm: function (event) {
        var $this = this;
        $this.$set("risk.show", false);
        var prod = $this.prod;
        var bankAcctList = $this.bankcard.bankAcctList;
        var fundAcctList = $this.bankcard.fundAcctList;
        var bankAcctProcList = $this.bankcard.bankAcctProcList;
        var currentBankAcct = $this.bankcard.current;


        //基金类产品
        if (prod.instCategory == 'Funds') {
            //开户处理中
            if (bankAcctProcList && bankAcctProcList.length > 0) {
                var result = {
                    success: false,
                    error_msg: "开户处理中"
                }
                $this.error_cb('', 0, '', '', result);
                return;
            }
            //

            //基金账户还未创建
            if (fundAcctList && fundAcctList.length == 0) {
                $this.$set("tgt_bc.show", true);
                $this.$set("tgt_bc.prod", prod);
                return;
            }
        }

        if (currentBankAcct) {
            $this.$set("tgt_pp.show", true);
            $this.$set("tgt_pp.prod", prod);
        } else {
            $this.$set("tgt_bc.show", true);
            $this.$set("tgt_bc.prod", prod);
        }
    }
    ,
    __purchase_event_open_bankcard: function (event) {
        var $this = this;
        var prod = $this.prod;
        if (prod && prod.instCategory == 'Funds') {
            return;
        }
        var bankAcctList = $this.bankcard.bankAcctList;
        if (bankAcctList && bankAcctList.length > 0) {
            $this.$set("bankcard.show", true);
        }
    }
    ,
    __purchase_event_open_coupon: function (event) {
        var $this = this;
        var couponList = $this.coupon.couponList;
        if (couponList && couponList.length > 0) {
            $this.$set("coupon.show", true);
        }
    }
    ,
    __purchase_event_open_contact: function (event) {
        var $this = this;
        $this.$set("contact.show", true);
    }
    ,
    __purchase_event_open_protocal: function (event) {
        var $this = this;
        $this.$set("protocal.show", true);
    },
    __purchase_result_event_chanage_bankcard: function (event) {
        var $this = this;
        var prod = $this.prod;
        if (prod) {
            if (window.localStorage) {
                window.localStorage.setItem(key_purchase_fail_change_bankcard, JSON.stringify(prod));
            }
        }
        location.reload();
    }

}
;
