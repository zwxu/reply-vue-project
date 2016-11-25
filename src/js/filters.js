module.exports = {
    abs: function (value) {
        if (typeof(value) == 'number') {
            return Math.abs(value);
        }
        return value;
    },
    amount: function (value) {
        if (typeof(value) == 'number') {
            return value.toFixed(2);
        }
        return value;
    },
    share_gold: function (value, goldValue) {
        if (typeof(value) == 'number') {
            if(goldValue && goldValue > 0){
                return (value / goldValue).toFixed(2);
            }else{
                return (value).toFixed(2);
            }
        }
        return value;
    },
    net_gold: function (value, goldValue) {
        if (typeof(value) == 'number') {
            if(goldValue && goldValue > 0){
                return (value * goldValue).toFixed(2);
            }else{
                return (value).toFixed(2);
            }
        }
        return value;
    },
    int: function (value) {
        if (typeof(value) == 'number') {
            return value.toFixed(0);
        }
        return value;
    },
    decimal1: function (value) {
        if (typeof(value) == 'number') {
            return value.toFixed(1);
        }
        return value;
    },
    decimal2: function (value) {
        if (typeof(value) == 'number') {
            return value.toFixed(2);
        }
        return value;
    },
    digit3: function (value) {
        if (typeof(value) == 'number') {
            var $value = Math.abs(value);
            if($value < 10){
                return $value.toFixed(2);
            }else if($value >= 10 && $value < 100){
                return $value.toFixed(1);
            }else if($value >= 100){
                return $value.toFixed(0);
            }
        }
        return value;
    },
    gold_digit3: function (value, goldValue) {
        if (typeof(value) == 'number') {
            var $value = value;
            if(goldValue && goldValue > 0){
                $value = Math.abs(value) * goldValue;
            }

            if($value < 10){
                return $value.toFixed(2);
            }else if($value >= 10 && $value < 100){
                return $value.toFixed(1);
            }else if($value >= 100){
                return $value.toFixed(0);
            }
        }
        return value;
    },
    amount_unit: function (value) {
        if (typeof(value) == 'number') {
            if (value / 10000 > 1) {
                return (value / 10000) + "万";
            } else {
                return value;
            }
        }
        return value;
    },
    net: function (value) {
        if (typeof(value) == 'number') {
            return value.toFixed(4);
        }
        return value;
    },
    wf: function (value) {
        if (typeof(value) == 'number') {
            return (value / 100 * 10000 / 365).toFixed(4);
        }
        return value
    },
    wff: function (value) {
        if (typeof(value) == 'number') {
            return (10000 * (Math.pow(1 + (value / 100), 1 / 365) - 1)).toFixed(4);
        }
        return value
    },
    exurl: function (url) {
        if (url) {
            if (url.indexOf("?") == -1) {
                url = url + "?mifi_download=true";
            } else {
                url = url + "&mifi_download=true";
            }
        }
        return url;
    },
    prodname: function (value, prodNameMap, prodType) {
        var $value = value;
        /*if ("DAY7" == value || "7" == value) {
         $value = "弘康7天理财";
         } else if ("DAY15" == value) {
         $value = "前海半月盈";
         } else if ("DAY15A" == value) {
         $value = "渤海半月盈";
         } else if ("15" == value) {
         $value = "渤海半月盈";
         if (("15" == value && prodType == 'FP')) {
         $value = "渤海半月盈";
         }
         }
         else if ("DAY30A" == value) {
         $value = "国华月月盈";
         }
         else if ("DAY30" == value) {
         $value = "弘康30天理财";
         }
         else if ("30" == value) {
         $value = "弘康30天理财";
         if (("30" == value && prodType == 'FP')) {
         $value = "国华月月盈";
         }
         }
         else if ("DAY90" == value || "90" == value) {
         $value = "弘康90天理财";
         }
         else if ("DAY180" == value || "180" == value) {
         $value = "弘康180天理财";
         }
         else if ("000009" == value) {
         $value = "易方达活期理财";
         }
         else if ("MP0001" == value) {
         $value = "弘康活期理财";
         }
         else if ("MP0002" == value) {
         $value = "国华活期理财";
         }
         else if ("110026" == value) {
         $value = "创业板ETF联接";
         }
         else if ("110030" == value) {
         $value = "沪深300";
         }
         else if ("110019" == value) {
         $value = "深证100";
         }
         else if ("000950" == value) {
         $value = "沪深300非银";
         }*/
        if (!prodNameMap) {
            return $value;
        }

        if (prodNameMap[value]) {
            $value = prodNameMap[value];
            return $value;
        }

        if (prodType) {
            if (prodType == 'DQB' && prodNameMap["FI_" + value]) {
                $value = prodNameMap["FI_" + value];
            } else if (prodNameMap[prodType + "_" + value]) {
                $value = prodNameMap[prodType + "_" + value];
            }
        }

        return $value;

    }
};
