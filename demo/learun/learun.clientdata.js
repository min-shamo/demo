//Version:1.0.1701
/*
 *organize----------------------公司
 *department--------------------部分
 *post--------------------------岗位                         
 *role--------------------------角色
 *userGroup---------------------用户组
 *user--------------------------用户
 *authorizeMenu-----------------授权菜单
 *authorizeButton---------------授权按钮
 *authorizeColumn---------------授权列表
 *menu--------------------------菜单
 *button------------------------按钮
 *dataItem----------------------数据字典
 *excelImportTemplate-----------excel导入模板
 *excelExportTemplate-----------excel导出模板
*/
(function ($, learun) {
    "use strict";
    var clientData = {};
    function get(key, data) {
        try {
            var res = "";
            var len = data.length;
            if (len == undefined) {
                res = data[key];
            }
            else {
                for (var i = 0; i < len; i++) {
                    if (key(data[i])) {
                        res = data[i];
                        break;
                    }
                }
            }
            return res;
        }
        catch (e) {
            console.log(e.message);
            return "";
        }
    }
    function elicit(data, itemCondition, conditionValue, filterName, parentId) {
        var result;
        $.each(data, function (index, row) {
            if (!!parentId) {
                if (row[itemCondition] == conditionValue && row["F_ParentId"] == parentId) {
                    result = row[filterName];
                    return;
                }
            }
            else {
                if (row[itemCondition] == conditionValue) {
                    result = row[filterName];
                    return;
                }
            }
        });
        return result;
    }
    function excelImportTemplateFormat() {//excel导入模板数据格式化
        $.each(clientData.excelImportTemplate, function (i, item) {
            clientData.excelImportTemplate[i] = {
                keys: item
            }
        });
    }
    learun.current = {
        operater: function () { return clientData.current; },
        rtOperter: function () {
            var data;
            learun.getDataForm({
                type: "get",
                url: "/Utility/GetCurrentOperater",
                success: function (currentData) {
                    data = currentData;
                }
            });
            return data;
        }
    }
    learun.data = {
        init: function (callback) {
            $.ajax({
                url: contentPath + "/ClientData/GetClientDataJson",
                type: "get",
                dataType: "json",
                cache: false,
                async: true,
                success: function (data) {
                    clientData = data;
                    excelImportTemplateFormat();
                    callback();
                    window.setTimeout(function () {
                        $('#ajax-loader').fadeOut();
                    }, 50);
                }
            });
        },
        get: function (nameArray) {//[key,function (v) { return v.key == value }]
            if (!nameArray) {
                return "";
            }
            var len = nameArray.length;
            var res = "";
            var data = clientData;
            for (var i = 0; i < len; i++) {
                res = get(nameArray[i], data);
                if (res != "" && res != undefined) {
                    data = res;
                }
                else {
                    break;
                }
            }
            if (res == undefined || res == null) {
                res = "";
            }
            return res;
        },
        getDataItem: function (encode, parents, itemCondition, conditionValue, filterName) {
            if (!encode) {
                return "";
            }
            var res = [];
            var dataDetailItem = clientData["dataDetailItem"];
            $.each(dataDetailItem, function (index, row) {
                if (row["F_EnCode"] == encode) {
                    res.push(row);
                }
            });
            if (!parents || parents.length == 0)
                parents = ["0"];
            var data = [];
            var tmpParents = [];
            for (var i = 0; i < parents.length; i++) {
                var pid = parents[i] == "" ? "0" : parents[i];
                var pval = "";
                if (i > 0) {
                    tmpParents.push(parents[i - 1]);
                    pval = learun.data.getDataItem(encode, tmpParents, "F_ItemValue", parents[i], "F_ItemDetailId");
                }
                else {
                    pval = elicit(res, "F_ItemValue", parents[i], "F_ItemDetailId", "0");
                }
                $.each(res, function (index, row) {
                    if (row["F_ParentId"] == pid ||
                        row["F_ParentId"] == pval) {
                        data.push(row);
                    }
                });
                if (data != "" && data != undefined) {
                    res = data;
                }
            }
            return elicit(res, itemCondition, conditionValue, filterName);
        },
        getModuleId: function (encode) {
            if (learun.isGuid(encode))
                return encode;
            var moduleId=learun.createGuid();
            var data = clientData["authorizeMenu"];
            $.each(data, function (index, row) {
                if (row.F_EnCode == encode) {
                    moduleId = row["F_ModuleId"];
                    return;
                }
            });
            return moduleId;
        },
        getModuleText: function (encode) {
            var moduleId = top.learun.data.getModuleId(encode);
            var data = clientData["authorizeMenu"];
            var text = "初始窗口";
            $.each(data, function (index, row) {
                console.info(row);
                if (row.F_ModuleId == moduleId) {
                    text = row["F_FullName"];
                    return;
                }
            });
            return text;
        }
    };
})(window.jQuery, window.learun);