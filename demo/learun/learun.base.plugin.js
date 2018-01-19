/*!
 * 版 本 LearunADMS V6.1.2.0 (http://www.learun.cn)
 * Copyright 2011-2016 Learun, Inc.
 * 力软jquery扩展插件
 * 陈小二
 */
(function ($, learun) {
    "use strict";
    //下拉框
    $.fn.comboBox = function (opt) {//下拉框
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        }
        var opt = $.extend({
            //请选择
            allowShowDefault: true,
            description: "==请选择==",
            desvalue: "please_select",
            //字段
            id: "id",
            text: "text",
            title: "title",
            //展开最大高度
            maxHeight: null,
            //宽度
            width: null,
            textSpace: " ",
            //是否允许搜索
            allowSearch: false,
            //搜索框位置，顶部和底部
            searchPositon: "top",//top & bottom
            //忽略搜索内容的大小写
            isIgnoreSearchCase: true,
            //访问数据接口地址
            url: null,
            //访问数据接口参数
            param: null,
            //下拉选择数据
            data: null,
            //数据名称
            dataName: false,
            //默认选中第一个
            selectOne: false,
            //方法
            method: "GET",
            isLoadRow:false
        }, opt);
        var dom = {
            rendering: function () {
                if ($select.find('.ui-select-text').length == 0) {
                    $select.html("<div class=\"ui-select-text\" style='color:#999;' data-value=\"" + opt.desvalue + "\">" + opt.description + "</div>");
                }
                //渲染下拉选项框
                var optionHtml = "<div class=\"ui-select-option\">";
                if (opt.searchPositon == "bottom") {
                    optionHtml += "<div class=\"ui-select-option-content\"" + (!!opt.maxHeight ? " style=\"max-height: " + opt.maxHeight + "\"" : "") + "></div>";
                    if (opt.allowSearch) {
                        optionHtml += "<div class=\"ui-select-option-search\"><input type=\"text\" class=\"form-control\" placeholder=\"搜索关键字\" /><span class=\"input-query\" title=\"Search\"><i class=\"fa fa-search\"></i></span></div>";
                    }
                }
                else {
                    if (opt.allowSearch) {
                        optionHtml += "<div class=\"ui-select-option-search\"><input type=\"text\" class=\"form-control\" placeholder=\"搜索关键字\" /><span class=\"input-query\" title=\"Search\"><i class=\"fa fa-search\"></i></span></div>";
                    }
                    optionHtml += "<div class=\"ui-select-option-content\"" + (!!opt.maxHeight ? " style=\"max-height: " + opt.maxHeight + "\"" : "") + "></div>";
                }
                optionHtml += "</div>";
                var $optionHtml = $(optionHtml);
                var selectOption = selectId + '-option';
                $optionHtml.attr('id', selectOption);
                //modified by Sandy 2017-08-24
                $('body').prepend($optionHtml);
                //$select.append($optionHtml);
                //modified by Sandy 2017-08-24
                var $selectOption = $("#" + selectOption);
                $selectOption.find(".ui-select-option-search .form-control").css("border", "none");
                if (opt.searchPositon == "bottom") {
                    $selectOption.find(".ui-select-option-search .form-control").css("border-top", "1px solid #ccc");
                }
                else {
                    $selectOption.find(".ui-select-option-search .form-control").css("border-bottom", "1px solid #ccc");
                }
                return $selectOption;
            },
            renderingData: function ($option, setting, searchValue) {
                if (setting.data != undefined && setting.data.length >= 0) {
                    var $_html = $('<ul></ul>');
                    if (setting.description && setting.allowShowDefault) {
                        $_html.append('<li data-value="' + setting.desvalue + '">' + setting.description + '</li>');
                        $select.attr("default-description", setting.description);
                        $select.attr("default-desvalue", setting.desvalue);
                    }
                    $.each(setting.data, function (i, row) {
                        var title = row[setting.title];
                        if (title == undefined) {
                            title = "";
                        }
                        //Added by Cathy 2018-01-05 增加行数据记录功能
                        var rowproperty = '';
                        if (!!setting.isLoadRow) {
                            rowproperty = ' data-row=\'' + JSON.stringify(row) + '\'';
                        }
                        //Added by Cathy 2018-01-05 增加行数据记录功能
                        //Added By Cathy 2017-08-22 下拉框text可绑定多字段
                        var texts = setting.text.split(',');
                        var dataText = '';
                        for (var _t = 0; _t < texts.length; _t++) {
                            dataText += row[texts[_t]] + setting.textSpace;
                        }
                        dataText = dataText.substr(0, dataText.length - setting.textSpace.length);
                        //Added By Cathy 2017-08-22
                        if (searchValue != undefined) {
                            if (setting.isIgnoreSearchCase && dataText.toLowerCase().indexOf(searchValue.toLowerCase()) != -1) {
                                $_html.append('<li ' + rowproperty + ' data-value="' + row[setting.id] + '" title="' + title + '">' + dataText + '</li>');
                            }
                            else if (!setting.isIgnoreSearchCase && dataText.indexOf(searchValue) != -1) {
                                $_html.append('<li ' + rowproperty + ' data-value="' + row[setting.id] + '" title="' + title + '">' + dataText + '</li>');
                            }
                        }
                        else {
                            $_html.append('<li ' + rowproperty + ' data-value="' + row[setting.id] + '" title="' + title + '">' + dataText + '</li>');
                        }
                    });
                    $option.find('.ui-select-option-content').html($_html);
                    $option.find('li').css('padding', "0 5px");
                    $option.find('li').unbind();
                    $option.find('li').click(function (e) {
                        //added by Sandy 2017-09-29 Start 如果是表单必填项,选择选项后清除提示信息 
                        if ($select.attr('isvalid') == 'yes') {
                            removeMessage($select);
                        }
                        //added by Sandy 2017-09-29 End
                        var $this = $(this);
                        //added by Cathy 2017-08-11 选中人员后清除查询条件，减去再次选择人员的条件清空动作
                        var $Search = $option.find('.ui-select-option-search').find('input');
                        $Search.val("");
                        dom.renderingData($option, opt, $Search.val());
                        //added by Cathy 2017-08-11
                        $select.attr("data-value", $this.attr('data-value')).attr("data-text", $this.text());

                        if (!!$this.attr('data-row'))
                        { $select.attr("data-row", $this.attr('data-row')); }

                        var $selectText = $select.find('.ui-select-text')
                        $selectText.attr('data-value', $this.attr('data-value')).html($this.text());
                        if ($select.attr('data-value') == $select.attr("default-desvalue") &&
                            $select.attr("data-text") == $select.attr("default-description"))
                            $selectText.css('color', '#999');
                        else
                            $selectText.css('color', '#000');
                        $option.slideUp(150);
                        $select.trigger("change");
                        e.stopPropagation();
                    }).hover(function (e) {
                        if (!$(this).hasClass('liactive')) {
                            $(this).toggleClass('on');
                        }
                        e.stopPropagation();
                    });
                }
            },
            loadData: function () {
                if (!!opt.url) {
                    opt.data = learun.ajax.asyncGet({
                        url: opt.url,
                        data: opt.param,
                        type: opt.method
                    });
                    if (!!opt.dataName && !!opt.data && opt.data.length > 0) {
                        opt.data = opt.data[opt.dataName];
                    }
                }
                else {
                    var $lilists = $select.find('li');
                    if ($lilists.length > 0) {
                        opt.data = [];
                        $lilists.each(function (e) {
                            var $li = $(this);
                            var point = {};
                            point[opt.id] = $li.attr('data-value');
                            point[opt.title] = $li.attr('title');
                            point[opt.text] = $li.html();
                            opt.data.push(point);
                        });
                    }
                }
            }
        };
        dom.loadData();
        var $option = dom.rendering();
        dom.renderingData($option, opt);

        //操作搜索事件
        if (opt.allowSearch) {
            // modified by Cathy 2017-08-22 下拉框搜索进行实时匹配，减去回车操作 keypress->keyup
            var optionSearch = $option.find('.ui-select-option-search').find('input');
            optionSearch.bind("keyup", function (e) {
                var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                // if (keyCode == "13") {
                var $this = $(this);
                dom.renderingData($option, $this[0].opt, $this.val());
                // dom.renderingData($option, $this.opt, $this.val());
                //}
            });
            optionSearch.focus(function () {
                $(this).select();
            })[0]["opt"] = opt;
            // modified by Cathy 2017-08-22
            //added By Cathy 2017-07-20
            //增加点击搜索图标可进行搜索
            var searchtext = $option.find('.ui-select-option-search').find('input');
            $option.find('.fa-search').bind("click", function (e) {
                var $this = $(this);
                dom.renderingData($option, searchtext[0].opt, searchtext.val());
                // dom.renderingData($option, searchtext.opt, searchtext.val());
                e.stopPropagation();
            });
            //added By Cathy 2017-07-20
        }

        $select.unbind('click');
        $select.bind("click", function (e) {
            if ($select.attr('readonly') == 'readonly' || $select.attr('disabled') == 'disabled') {
                return false;
            }
            $(this).addClass('ui-select-focus');
            if ($option.is(":hidden")) {
                $select.find('.ui-select-option').hide();
                $('.ui-select-option').hide();
                //modified by Sandy 2017-08-24
                var left = $select.offset().left;
                var top = $select.offset().top + 29;
                //var left = 0;
                //var top = $select.height() + 5;
                //modified by Sandy 2017-08-24
                var width = $select.width();
                if (opt.width) {
                    width = opt.width;
                }
                if (($option.height() + top) < $(document).height()) {
                    $option.slideDown(150).css({ top: top, left: left, width: width });
                } else {
                    var _top = (top - $option.height() - 32)
                    $option.show().css({ top: _top, left: left, width: width });
                    $option.attr('data-show', true);
                }
                $option.css('border-top', '1px solid #ccc');
                $option.find('li').removeClass('liactive');
                $option.find('[data-value="' + $select.attr('data-value') + '"]').addClass('liactive');
                $option.find('.ui-select-option-search').find('input').select();
            } else {
                if ($option.attr('data-show')) {
                    $option.hide();
                } else {
                    $option.slideUp(150);
                }
            }
            e.stopPropagation();
        });
        $(document).click(function (e) {
            var e = e ? e : window.event;
            var tar = e.srcElement || e.target;
            if (!$(tar).hasClass('form-control')) {
                if ($option.attr('data-show')) {
                    $option.hide();
                } else {
                    $option.slideUp(150);
                }
                $select.removeClass('ui-select-focus');
                e.stopPropagation();
            }
        });
        if (opt.selectOne) {
            if (!!opt.data && opt.data.length > 0) {
                $select.comboBoxSetValue(opt.data[0][opt.id]);
            }
        }
        return $select;
    };
    $.fn.comboBoxClearItems = function () {
        var $select = $(this);
        var $option = $("#" + $select.attr('id') + "-option");
        if ($option) {
            $option.remove();
        }
        $select.html("");
        $select.attr('data-value', '');
        $select.attr('data-text', '');
    };
    $.fn.comboBoxGetValue = function () {
        var $select = $(this);
        var value = $select.attr("data-value");
        if (!!value && value != "" &&
            value == $select.attr("default-desvalue") &&
            $select.attr("data-text") == $select.attr("default-description"))
            value = "";
        return value;
    };
    $.fn.comboBoxGetText = function () {
        var $select = $(this);
        var text = $select.attr("data-text");
        if (!!text && text != "" &&
            $select.attr("data-value") == $select.attr("default-desvalue") &&
            text == $select.attr("default-description"))
            text = "&nbsp;";
        return text;
    };
    $.fn.comboBoxSetValue = function (value, isIgnoreCase) {
        var $select = $(this);
        if (learun.isNullOrEmpty(value)) {
            if (!$select.attr("default-desvalue")) {
                return;
            }
            else {
                value = $select.attr("default-desvalue");
            }
        }
        var $option = $("#" + $select.attr('id') + "-option");

        var data_text = $option.find('ul').find('[data-value="' + value + '"]').html();
        if (data_text) {
            //added by Cathy 2017-10-19 确认下拉框存在value值后再赋值
            if (isIgnoreCase) {
                $select.attr('data-value', value.toLowerCase());
                $option.find('ul li').each(function () { $(this).attr("data-value", $(this).attr("data-value").toLowerCase()); })
                value = value.toLowerCase();
            }
            else {
                $select.attr('data-value', value);
            }
            //added by Cathy 2017-10-19
            $select.attr('data-text', data_text);
            var $selectText = $select.find('.ui-select-text')
            $selectText.attr('data-value', value).html(data_text);
            if ($select.attr('data-value') == $select.attr("default-desvalue") &&
                $select.attr("data-text") == $select.attr("default-description"))
                $selectText.css('color', '#999');
            else
                $selectText.css('color', '#000');
            $option.find('ul').find('[data-value="' + value + '"]').addClass('liactive')
        }
        $select.trigger("change");
        return $select;
    };
    //下拉框树形/6.1.2.0 搜索功能做了优化不用再去后台获取了
    $.fn.comboBoxTree = function (opt) {
        //opt参数：description,height,allowSearch,appendTo,click,url,param,method,icon
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        }

        var opt = $.extend({
            //请选择
            allowShowDefault: true,
            description: "==请选择==",
            desvalue: "please_select",
            //字段
            id: "id",
            text: "text",
            title: "title",
            //展开最大高度
            maxHeight: null,
            //宽度
            width: null,
            //是否允许搜索
            allowSearch: false,
            //搜索框位置，顶部和底部
            searchPositon: "top",//top & bottom
            //访问数据接口地址
            url: false,
            //访问数据接口参数
            param: null,
            //接口请求的方法
            method: "GET",
            //加载到哪个标签里面
            appendTo: null,
            //选择点击事件
            click: null,
            //是否移除图标
            icon: false,
            data: null,
            dataItemName: false
        }, opt);

        var dom = {
            rendering: function () {
                if ($select.find('.ui-select-text').length == 0) {
                    $select.html("<div class=\"ui-select-text\" style=\"color:#999;\" data-value=\"" + opt.desvalue + "\">" + opt.description + "</div>");
                }
                //渲染下拉选项框backc1
                var optionHtml = "<div class=\"ui-select-option\">";
                if (opt.searchPositon == "bottom") {
                    optionHtml += "<div class=\"ui-select-option-content\"" + (!!opt.maxHeight ? " style=\"max-height: " + opt.maxHeight + "\"" : "") + "></div>";
                    if (opt.allowSearch) {
                        optionHtml += "<div class=\"ui-select-option-search\"><input type=\"text\" class=\"form-control\" placeholder=\"搜索关键字\" /><span class=\"input-query\" title=\"Search\"><i class=\"fa fa-search\"></i></span></div>";
                    }
                }
                else {
                    if (opt.allowSearch) {
                        optionHtml += "<div class=\"ui-select-option-search\"><input type=\"text\" class=\"form-control\" placeholder=\"搜索关键字\" /><span class=\"input-query\" title=\"Search\"><i class=\"fa fa-search\"></i></span></div>";
                    }
                    optionHtml += "<div class=\"ui-select-option-content\"" + (!!opt.maxHeight ? " style=\"max-height: " + opt.maxHeight + "\"" : "") + "></div>";
                }
                optionHtml += "</div>";
                var $optionHtml = $(optionHtml);
                var selectOption = selectId + '-option';
                $optionHtml.attr('id', selectOption);
                if (opt.appendTo) {
                    $(opt.appendTo).prepend($optionHtml);
                } else {
                    //modified by Sandy 2017-08-24
                    $('body').prepend($optionHtml);
                    //$select.append($optionHtml);
                    //modified by Sandy 2017-08-24
                }
                var $selectOption = $("#" + selectOption);
                $selectOption.find(".ui-select-option-search .form-control").css("border", "none");
                if (opt.searchPositon == "bottom") {
                    $selectOption.find(".ui-select-option-search .form-control").css("border-top", "1px solid #ccc");
                }
                else {
                    $selectOption.find(".ui-select-option-search .form-control").css("border-bottom", "1px solid #ccc");
                }
                return $selectOption;
            },
            loadtreeview: function (setting, data) {
                if (setting.description && setting.allowShowDefault) {
                    $select.attr("default-description", setting.description);
                    $select.attr("default-desvalue", setting.desvalue);
                }
                $option_content.treeview({
                    onnodeclick: function (item) {
                        if (setting.click) {
                            var flag = "ok";
                            flag = setting.click(item);
                            if (flag == "false") {
                                return false;
                            }
                        }
                        $select.attr("data-value", item.id).attr("data-text", item.text);
                        var $selectText = $select.find('.ui-select-text');
                        $selectText.attr('data-value', $select.attr('data-value')).html(item.text);
                        if ($select.attr('data-value') == $select.attr("default-desvalue") &&
                            $select.attr("data-text") == $select.attr("default-description"))
                            $selectText.css('color', '#999');
                        else
                            $selectText.css('color', '#000');

                        $select.trigger("change");
                    },
                    height: setting.maxHeight,
                    data: data,
                    allowShowDefault: true,
                    description: setting.description,
                    desvalue: setting.desvalue
                });
            },
            loadData: function (opt) {//统一路口加载数据
                var data = [];
                if (!!opt.data) {
                    data = opt.data;
                }
                else {
                    data = learun.ajax.asyncGet({
                        //data = learun.asyncGet({
                        url: opt.url,
                        data: opt.param,
                        type: opt.method
                    });
                }
                if (opt.dataItemName) {
                    opt.data = [];
                    $.each(data, function (i, item) {
                        var _itemText = top.learun.data.get(["dataItem", opt.dataItemName, item[opt.text]]);
                        if (_itemText != "") {
                            item[opt.text] = _itemText
                        }
                        opt.data.push(item);
                    });
                }
                else {
                    opt.data = data;
                }
            },
            //搜索方法
            searchData: function (data, keyword) {
                var pFlag = false;
                var childData = [];
                $.each(data, function (i, row) {
                    var item = {};
                    for (var ii in row) {
                        if (ii != "ChildNodes") {
                            item[ii] = row[ii];
                        }
                    }
                    var flag = false;
                    if (item.text.indexOf(keyword) != -1) {
                        flag = true;
                    }
                    if (item.hasChildren) {
                        item.ChildNodes = dom.searchData(row.ChildNodes, keyword);
                        if (item.ChildNodes.length > 0) {
                            flag = true;
                        }
                        else {
                            item.hasChildren = false;
                        }
                    }
                    if (flag) {
                        pFlag = true;
                        childData.push(item);
                    }
                });
                return childData;
            }
        };

        var $option = dom.rendering();
        var $option_content = $("#" + selectId + "-option").find('.ui-select-option-content');
        dom.loadData(opt);
        dom.loadtreeview(opt, opt.data);

        if (opt.allowSearch) {
            // modified by Cathy 2017-08-22 下拉框搜索进行实时匹配，减去回车操作 keypress->keyup
            $option.find('.ui-select-option-search').find('input').bind("keyup", function (e) {
                var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                //if (keyCode == "13") {
                var $this = $(this);
                var value = $(this).val();
                var data = dom.searchData($this[0].opt.data, value);
                dom.loadtreeview($this[0].opt, data);
                // }
            }).focus(function () {
                $(this).select();
            })[0]["opt"] = opt;
            // modified by Cathy 2017-08-22
            //added By Cathy 2017-07-20
            //增加点击搜索图标可进行搜索
            var searchtext = $option.find('.ui-select-option-search').find('input');
            $option.find('.fa-search').bind("click", function (e) {
                var $this = searchtext;
                var value = searchtext.val();
                var data = dom.searchData($this[0].opt.data, value);
                dom.loadtreeview($this[0].opt, data);
                e.stopPropagation();
            });
            //added By Cathy 2017-07-20
        }
        if (opt.icon) {
            $option.find('i').remove();
            $option.find('img').remove();
        }
        $select.find('.ui-select-text').unbind('click');
        $select.find('.ui-select-text').bind("click", function (e) {
            if ($select.attr('readonly') == 'readonly' || $select.attr('disabled') == 'disabled') {
                return false;
            }
            //added by Sandy 2017-09-29 Start 如果是表单必填项,选择选项后清除提示信息 
            if ($select.attr('isvalid') == 'yes') {
                removeMessage($select);
            }
            //added by Sandy 2017-09-29 End
            $(this).parent().addClass('ui-select-focus');
            if ($option.is(":hidden")) {
                $select.find('.ui-select-option').hide();
                $('.ui-select-option').hide();
                var left = $select.offset().left;
                var top = $select.offset().top + 29;
                var scrollTop = $(document).scrollTop();    //added by Sandy 2017-12-8
                var winHeight = $(window).height();         //added by Sandy 2017-12-8
                var width = $select.width();
                if (opt.width) {
                    width = opt.width;
                }
                //modified by Sandy 2017-12-8 Start
                /* if (($option.height() + top) < $(window).height()) {
                    $option.slideDown(150).css({ top: top, left: left, width: width });
                } else {
                    var _top = (top - $option.height() - 32);
                    $option.show().css({ top: _top, left: left, width: width });
                    $option.attr('data-show', true);
                }*/
                if ((top - scrollTop) > (winHeight / 2)) {
                    $option.show().css({
                        'width': width,
                        'left': left,
                        'top': top - scrollTop - $option.height()
                    });
                } else {
                    $option.slideDown(150).css({
                        'width': width,
                        'left': left,
                        'top': top
                    });
                }
                $option.find('.ui-select-option-content').css('max-height', (winHeight - (top - scrollTop) - 100) + 'px');
                //modified by Sandy 2017-12-8 End
                $option.css('border-top', '1px solid #ccc');
                if (opt.appendTo) {
                    $option.css("position", "inherit")
                }
                $option.find('.ui-select-option-search').find('input').select();
            } else {
                if ($option.attr('data-show')) {
                    $option.hide();
                } else {
                    $option.slideUp(150);
                }
            }
            e.stopPropagation();
        });
        $select.find('li div').click(function (e) {
            var e = e ? e : window.event;
            var tar = e.srcElement || e.target;
            if (!$(tar).hasClass('bbit-tree-ec-icon')) {
                $option.slideUp(150);
                e.stopPropagation();
            }
        });
        $(document).click(function (e) {
            var e = e ? e : window.event;
            var tar = e.srcElement || e.target;
            if (!$(tar).hasClass('bbit-tree-ec-icon') && !$(tar).hasClass('form-control')) {
                if ($option.attr('data-show')) {
                    $option.hide();
                } else {
                    $option.slideUp(150);
                }
                $select.removeClass('ui-select-focus');
                e.stopPropagation();
            }
        });
        return $select;
    };
    $.fn.comboBoxTreeClearItems = function () {
        var $select = $(this);
        var $option = $("#" + $select.attr('id') + "-option");
        if ($option) {
            $option.remove();
        }
        $select.html("");
        $select.attr('data-value', '');
        $select.attr('data-text', '');
    };
    $.fn.comboBoxTreeGetValue = function () {
        var $select = $(this);
        var value = $select.attr("data-value");
        if (!!value && value != "" &&
            value == $select.attr("default-desvalue") &&
            $select.attr("data-text") == $select.attr("default-description"))
            value = "";
        return value;
    };
    $.fn.comboBoxTreeGetText = function () {
        var $select = $(this);
        var text = $select.attr("data-text");
        if (!!text && text != "" &&
            $select.attr("data-value") == $select.attr("default-desvalue") &&
            text == $select.attr("default-description"))
            text = "&nbsp;";
        return text;
    };
    $.fn.comboBoxTreeSetValue = function (value) {
        var $select = $(this);
        if (learun.isNullOrEmpty(value)) {
            if (!$select.attr("default-desvalue")) {
                return;
            }
            else {
                value = $select.attr("default-desvalue");
            }
        }
        var $option_content = $("#" + $select.attr('id') + "-option").find('.ui-select-option-content');
        var $item = $option_content.find('ul').find('[data-id="' + value + '"]');
        if (!$item) {
            $item = $option_content.find('ul').find('[data-value="' + value + '"]');
        }
        if (!$item) {
            $item = $option_content.find('ul').find('[data-value="' + $select.attr("default-desvalue") + '"]');
        }
        $item.trigger('click');
        return $select;
    };
    //added by sandy 2017-08-31 Start
    //带搜索功能的treeview
    $.fn.treeviewWithSearch = function (opt) {
        var timer = null;
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        }
        var opt = $.extend(opt, { allowSearch: true });
        if (opt.allowSearch) {
            $select.prepend("<div class=\"ui-select-option-search\"><input type=\"text\" class=\"form-control\" placeholder=\"搜索关键字\" /><span class=\"input-query\" title=\"Search\"><i class=\"fa fa-search\"></i></span></div>");
        }
        var $treeContent = $('<div class="tree-content-wrap"></div>').appendTo($select);
        $treeContent.treeview(opt);
        $select.on('keyup', '.ui-select-option-search input', function (e) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                dom.showFilterData(e);
            }, 500);
            dom.showFilterData(e);
        });
        $select.on('click', '.fa-search', function (e) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                dom.showFilterData(e);
            }, 500);
        });

        var dom = {
            //统一路口加载数据
            loadData: function (opt, callback) {
                var data = [];
                if (!!opt.data) {
                    data = opt.data;
                }
                else {
                    data = learun.ajax.asyncGet({
                        url: opt.url,
                        data: opt.param,
                        type: opt.method
                    });
                }
                if (opt.dataItemName) {
                    opt.data = [];
                    $.each(data, function (i, item) {
                        var _itemText = top.learun.data.get(["dataItem", opt.dataItemName, item[opt.text]]);
                        if (_itemText != "") {
                            item[opt.text] = _itemText
                        }
                        opt.data.push(item);
                    });
                }
                else {
                    opt.data = data;
                }
                callback();
            },
            //搜索方法
            searchData: function (data, keyword) {
                var pFlag = false;
                var childData = [];
                $.each(data, function (i, row) {
                    var item = {};
                    for (var ii in row) {
                        if (ii != "ChildNodes") {
                            item[ii] = row[ii];
                        }
                    }
                    var flag = false;
                    if (item.text.indexOf(keyword) != -1) {
                        flag = true;
                    }
                    if (item.hasChildren) {
                        item.ChildNodes = dom.searchData(row.ChildNodes, keyword);
                        if (item.ChildNodes.length > 0) {
                            flag = true;
                        }
                        else {
                            item.hasChildren = false;
                        }
                    }
                    if (flag) {
                        pFlag = true;
                        childData.push(item);
                    }
                });
                return childData;
            },
            //显示搜索后的组织树
            showFilterData: function (e) {
                var $input = $select.find('.ui-select-option-search input');
                var keyword = $input.val();
                dom.loadData(opt, function () {
                    var _data = dom.searchData(opt.data, keyword);
                    if (_data.length) {
                        $treeContent.treeview({
                            data: _data,
                            onnodeclick: function (item) {
                                opt.onnodeclick(item);
                            }
                        });
                    } else {
                        $treeContent.html('没有搜索到相关人员哦！');
                    }
                });
                e.stopPropagation();
            }
        };
    };
    //added by sandy 2017-08-31 End
    //获取、设置表单数据
    $.fn.getWebControls = function (keyValue, className) {
        var reVal = "";
        /*Added by Cathy 2017-11-16 
        增加className筛选，用于选择部分字段，避免冗余的字段delete
        */
        var eachDom = $(this).find('input,select,textarea,.ui-select,.uploadify,.webUploader,.uploadifyPic');
        if (!!className) {
            eachDom = eachDom.filter("." + className);
        }
        eachDom.each(function (r) {
            var id = $(this).attr('id');
            if (!!id) {
                var $id = $("#" + id);
                var type = $(this).attr('type');
                switch (type) {
                    case "checkbox":
                        if ($id.is(":checked")) {
                            reVal += '"' + id + '"' + ':' + '"1",'
                        } else {
                            reVal += '"' + id + '"' + ':' + '"0",'
                        }
                        break;
                    case "select":
                        var value = $id.attr('data-value');
                        if (value == "" || value == $id.attr('default-desvalue')) {
                            value = "&nbsp;";
                        }
                        reVal += '"' + id + '"' + ':' + '"' + learun.jsonFormat($.trim(value)) + '",'
                        break;
                    case "selectTree":
                        var value = $id.attr('data-value');
                        if (value == "" || value == $id.attr('default-desvalue')) {
                            value = "&nbsp;";
                        }
                        reVal += '"' + id + '"' + ':' + '"' + learun.jsonFormat($.trim(value)) + '",'
                        break;
                    case "webUploader":
                    case "uploadify":
                    case "uploadifyPic":
                        var value = $id.attr('data-value');
                        if (value == "" || value == undefined) {
                            value = "&nbsp;";
                        }
                        reVal += '"' + id + '"' + ':' + '"' + learun.jsonFormat($.trim(value)) + '",'
                        break;
                    default:
                        var value = $id.val();
                        if (value == "") {
                            value = "&nbsp;";
                        }
                        reVal += '"' + id + '"' + ':' + '"' + learun.jsonFormat($.trim(value)) + '",'
                        break;
                }
            }
        });
        reVal = reVal.substr(0, reVal.length - 1);
        if (!keyValue) {
            reVal = reVal.replace(/&nbsp;/g, '');
        }
        var postdata = jQuery.parseJSON('{' + reVal + '}');
        return postdata;
    };
    $.fn.setWebControls = function (data) {
        var $id = $(this);
        for (var key in data) {
            var id = $id.find('#' + key);
            if (id.attr('id')) {
                var type = id.attr('type');
                if (id.hasClass("input-datepicker")) {
                    type = "datepicker";
                }
                if (id.hasClass("input-wdatepicker")) {
                    type = "wdatepicker";
                }
                var value = $.trim(data[key]);
                if (type != "checkbox")
                    value = $.trim(data[key]).replace(/&nbsp;/g, '');
                switch (type) {
                    case "checkbox":
                        if (typeof (value) == "boolean") {
                            if (value) {
                                id.attr("checked", 'checked');
                            } else {
                                id.removeAttr("checked");
                            }
                        }
                        else if (typeof value == "string") {
                            if (value.toLowerCase() == "true" || value == "1") {
                                id.attr("checked", 'checked');
                            }
                            else {
                                id.removeAttr("checked");
                            }
                        }
                        else {
                            if (value == 1) {
                                id.attr("checked", 'checked');
                            } else {
                                id.removeAttr("checked");
                            }
                        }
                        break;
                    case "select":
                        if (id.hasClass("fn-select-user-box")) {
                            id.setUserSelectBox(value);
                        }
                        if (id.hasClass("fn-select-user-info")) {
                            id.getUserInfo({ userId: value });
                        }
                        if (id.hasClass("fn-select-user-realname")) {
                            id.getUserRealName(value);
                        }
                        else {
                            id.comboBoxSetValue(value);
                        }
                        break;
                    case "selectTree":
                        id.comboBoxTreeSetValue(value);
                        break;
                    case "datepicker":
                        id.val(formatDate(value, 'yyyy-MM-dd'));
                        break;
                    case "wdatepicker":
                        var fomat = '';
                        if (!!id.attr("datefmt")) {
                            fomat = id.attr("datefmt");
                            id.val(formatDate(value, fomat));
                        } else {
                            id.val(value);
                        }
                        break;

                    case "uploadify":
                    case "webUploader":
                        id.uploadifyExSet(value);
                        break;
                    case "uploadifyPic":
                        id.uploadifyExSet_Pic(value);
                        break;
                    case "lblValue":
                        id.text(value);
                        break;
                    default:
                        id.val(value);
                        break;
                }
            }
        }
    };
    //员工选择框赋值
    $.fn.setUserSelectBox = function (data) {
        if (!data) return "";
        if (learun.isNullOrEmpty(data)) {
            return "";
        }
        var $select = $(this);
        var name = [];
        var idArray = data.split(",");
        for (var i = 0; i < idArray.length; i++) {
            name.push(top.learun.data.get(["user", idArray[i], "RealName"]));
        }
        $select.attr("data-value", String(idArray)).attr("data-text", String(name));
        $select.find(".ui-select-text").html(String(name)).css('color', '#000');
        return name;
    }
    $.fn.getSysFormControls = function () {
        var postdata = [];
        $(this).find('[data-wfname]').each(function (r) {
            var $obj = $(this);
            var name = $obj.attr('data-wfname');
            var id = $obj.attr('id');
            var type = $obj.attr('type');
            if (id == undefined) {
                id = $obj.attr('data-id');
            }
            var girdId = $obj.attr('data-girdid');
            postdata.push({ "field": id, "label": name, 'type': type, 'girdId': girdId });
        });
        return postdata;
    };
    //右键菜单
    $.fn.conTextMenu = function () {
        var element = $(this);
        var oMenu = $('.contextmenu');
        $(document).click(function () {
            oMenu.hide();
        });
        $(document).mousedown(function (e) {
            if (3 == e.which) {
                oMenu.hide();
            }
        })
        var aUl = oMenu.find("ul");
        var aLi = oMenu.find("li");
        var showTimer = null, hideTimer = null;
        var i = 0;
        var maxWidth = null, maxHeight = 0;
        var aDoc = [document.documentElement.offsetWidth, document.documentElement.offsetHeight];
        oMenu.hide();
        for (i = 0; i < aLi.length; i++) {
            //为含有子菜单的li加上箭头
            aLi[i].getElementsByTagName("ul")[0] && (aLi[i].className = "sub");
            //鼠标移入
            aLi[i].onmouseover = function () {
                var oThis = this;
                var oUl = oThis.getElementsByTagName("ul");
                //鼠标移入样式jsoncc1
                oThis.className += " active";
                //显示子菜单
                if (oUl[0]) {
                    clearTimeout(hideTimer);
                    showTimer = setTimeout(function () {
                        for (i = 0; i < oThis.parentNode.children.length; i++) {
                            oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
                            (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                        }
                        oUl[0].style.display = "block";
                        oUl[0].style.top = oThis.offsetTop + "px";
                        oUl[0].style.left = oThis.offsetWidth + "px";

                        //最大显示范围					
                        var maxWidth = aDoc[0] - oUl[0].offsetWidth;
                        var maxHeight = aDoc[1] - oUl[0].offsetHeight;

                        //防止溢出
                        maxWidth < getOffset.left(oUl[0]) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
                        maxHeight < getOffset.top(oUl[0]) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
                    }, 300);
                }
            };
            //鼠标移出	
            aLi[i].onmouseout = function () {
                var oThis = this;
                var oUl = oThis.getElementsByTagName("ul");
                //鼠标移出样式
                oThis.className = oThis.className.replace(/\s?active/, "");

                clearTimeout(showTimer);
                var hideTimer = setTimeout(function () {
                    for (i = 0; i < oThis.parentNode.children.length; i++) {
                        oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
                        (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                    }
                }, 300);
            };
        }
        //自定义右键菜单
        $(element).bind("contextmenu", function () {
            var event = event || window.event;
            oMenu.show();
            oMenu.css('top', event.clientY + "px");
            oMenu.css('left', event.clientX + "px");
            //最大显示范围
            var maxWidth = aDoc[0] - oMenu.width();
            var maxHeight = aDoc[1] - oMenu.height();
            //防止菜单溢出
            if (oMenu.offset().top > maxHeight) {
                oMenu.css('top', maxHeight + "px");
            }
            if (oMenu.offset().left > maxWidth) {
                oMenu.css('left', maxWidth + "px");
            }
            return false;
        }).bind("click", function () {
            oMenu.hide();
        });
    };
    //翻页插件扩展
    $.fn.panginationEx = function (opt) {
        var $pager = $(this);
        if (!$pager.attr('id')) {
            return false;
        }
        var opt = $.extend({
            firstBtnText: '首页',
            lastBtnText: '尾页',
            prevBtnText: '上一页',
            nextBtnText: '下一页',
            showInfo: true,
            showJump: true,
            jumpBtnText: '跳转',
            showPageSizes: true,
            infoFormat: '{start} ~ {end}条，共{total}条',
            sortname: '',
            url: "",
            success: null,
            beforeSend: null,
            complete: null
        }, opt);
        var params = $.extend({ sidx: opt.sortname, sord: "asc" }, opt.params);
        opt.remote = {
            url: opt.url,  //请求地址
            params: params,       //自定义请求参数backc1
            beforeSend: function (XMLHttpRequest) {
                if (opt.beforeSend != null) {
                    opt.beforeSend(XMLHttpRequest);
                }
            },
            success: function (result, pageIndex) {
                //回调函数
                //result 为 请求返回的数据，呈现数据
                if (opt.success != null) {
                    opt.success(result.rows, pageIndex);
                }
            },
            complete: function (XMLHttpRequest, textStatu) {
                if (opt.complete != null) {
                    opt.complete(XMLHttpRequest, textStatu);
                }
                //...
            },
            pageIndexName: 'page',    //请求参数，当前页数，索引从0开始
            pageSizeName: 'rows',     //请求参数，每页数量
            totalName: 'records'      //指定返回数据的总数据量的字段名backc1
        };
        $pager.page(opt);
    };
    //发送邮件左侧列表项
    $.fn.leftListShowOfEmail = function (opt) {
        var $list = $(this);
        if (!$list.attr('id')) {
            return false;
        }
        $list.append('<ul  style="padding-top: 10px;"></ul>');
        var opt = $.extend({
            id: "id",
            name: "text",
            img: "fa fa-file-o",

        }, opt);
        $list.height(opt.height);
        $.ajax({
            url: opt.url,
            data: opt.param,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (data) {
                $.each(data, function (i, item) {
                    var $_li = $('<li class="" data-value="' + item[opt.id] + '"  data-text="' + item[opt.name] + '" ><i class="' + opt.img + '" style="vertical-align: middle; margin-top: -2px; margin-right: 8px; font-size: 14px; color: #666666; opacity: 0.9;"></i>' + item[opt.name] + '</li>');
                    if (i == 0) {
                        $_li.addClass("active");
                    }
                    $list.find('ul').append($_li);
                });
                $list.find('li').click(function () {
                    var key = $(this).attr('data-value');
                    var value = $(this).attr('data-text');
                    $list.find('li').removeClass('active');
                    $(this).addClass('active');
                    opt.onnodeclick({ id: key, name: value });
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                dialogMsg(errorThrown, -1);
            }
        });
    };
    //权限按钮、列表数据列
    $.fn.authorizeButton = function () {
        var $element = $(this);
        $element.find('a.btn').attr('authorize', 'no');
        $element.find('ul.dropdown-menu').find('li').attr('authorize', 'no');
        if (learun.tabiframeId() == undefined || learun.tabiframeId() == null) return;
        var moduleId = learun.currentIframeModuleId();
        if (moduleId == undefined || moduleId == null) return;
        var data = top.learun.data.get(["authorizeButton", moduleId]);
        if (data != undefined) {
            $.each(data, function (i) {
                $element.find("#" + data[i].F_EnCode).attr('authorize', 'yes');
            });
        }
        $element.find('[authorize=no]').remove();
    };
    $.fn.authorizeColModel = function () {
        var $element = $(this);
        var columnModel = $element.jqGrid('getGridParam', 'colModel');
        $.each(columnModel, function (i) {
            if (columnModel[i].name != "rn") {
                $element.hideCol(columnModel[i].name);
            }
        });
        var moduleId = learun.currentIframeModuleId();
        var data = top.learun.data.get(["authorizeColumn", moduleId]);
        if (data != undefined) {
            $.each(data, function (i) {
                $element.showCol(data[i].F_EnCode);
            });
        }
    };
    //jqgird
    $.fn.jqGridEx = function (opt) {
        var $jqGrid = $(this);
        var _selectedRowIndex;
        if (!$jqGrid.attr('id')) {
            return false;
        }
        var opt = $.extend({
            url: "",
            datatype: "json",
            height: $(window).height() - 139.5,
            autowidth: true,
            colModel: [],
            viewrecords: true,
            rowNum: 30,
            rowList: [30, 50, 100],
            pager: "#gridPager",
            sortname: 'F_CreateDate desc',
            rownumbers: true,
            shrinkToFit: false,
            gridview: true,
            onSelectRow: function () {
                _selectedRowIndex = $("#" + this.id).getGridParam('selrow');
            },
            gridComplete: function () {
                $("#" + this.id).setSelection(_selectedRowIndex, false);
            }
        }, opt);
        $jqGrid.jqGrid(opt);
    };
    $.fn.jqGridRowValue = function (code) {
        var $jgrid = $(this);
        var json = [];
        var selectedRowIds = $jgrid.jqGrid("getGridParam", "selarrrow");
        if (selectedRowIds != undefined && selectedRowIds != "") {
            var len = selectedRowIds.length;
            for (var i = 0; i < len ; i++) {
                var rowData = $jgrid.jqGrid('getRowData', selectedRowIds[i]);
                json.push(rowData[code]);
            }
        } else {
            selectedRowIds = $jgrid.jqGrid('getGridParam', 'selrow');
            var rowData = $jgrid.jqGrid('getRowData', selectedRowIds);
            json.push(rowData[code]);
        }
        return String(json);
    };
    $.fn.jqGridRow = function () {
        var $jgrid = $(this);
        var json = [];
        var selectedRowIds = $jgrid.jqGrid("getGridParam", "selarrrow");
        if (selectedRowIds != "") {
            var len = selectedRowIds.length;
            for (var i = 0; i < len ; i++) {
                var rowData = $jgrid.jqGrid('getRowData', selectedRowIds[i]);
                json.push(rowData);
            }
        } else {
            var rowData = $jgrid.jqGrid('getRowData', $jgrid.jqGrid('getGridParam', 'selrow'));
            json.push(rowData);
        }
        return json;
    };
    //附件上传插件初始化
    $.fn.uploadifyEx = function (opt) {
        var $uploadifyEx = $(this);
        var uploadifyExId = $uploadifyEx.attr('id');
        if (!uploadifyExId) {
            return false;
        }
        var opt = $.extend({
            btnName: "上传附件",
            url: "",
            onUploadSuccess: false,
            cancel: false,
            height: 30,
            width: 90,
            type: "webUploader",
            fileTypeExts: "",
            oneFile: false,
            duplicate: true
        }, opt);

        if (opt.type == "uploadify") {
            $uploadifyEx.removeAttr("id");
            $uploadifyEx.html('<input id="' + uploadifyExId + '" type="file" />');
            $uploadifyEx = $('#' + uploadifyExId);

            if (opt.fileTypeExts == "") {
                opt.fileTypeExts = "*.avi;*.mp3;*.mp4;*.bmp;*.ico;*.gif;*.jpeg;*.jpg;*.png;*.psd; *.rar;*.zip;*.swf;*.log;*.pdf;*.doc;*.docx;*.ppt;*.pptx;*.txt; *.xls; *.xlsx;";
            }
            else {
                opt.fileTypeExts = '*.' + opt.fileTypeExts.replace(/,/g, ';*.') + ';';
            }

            $uploadifyEx.uploadify({
                method: 'post',
                uploader: opt.url,
                swf: top.contentPath + '/Content/scripts/plugins/uploadify/uploadify.swf',
                buttonText: opt.btnName,
                height: opt.height,
                width: opt.width,
                fileTypeExts: opt.fileTypeExts,//'*.avi;*.mp3;*.mp4;*.bmp;*.ico;*.gif;*.jpeg;*.jpg;*.png;*.psd; *.rar;*.zip;*.swf;*.log;*.pdf;*.doc;*.docx;*.ppt;*.pptx;*.txt; *.xls; *.xlsx;',jsoncc1
                removeCompleted: false,
                onSelect: function (file) {
                    if (opt.oneFile) {
                        $('#' + uploadifyExId + '-queue').find('.uploadify-queue-item').each(function () {
                            if ($(this).attr('id') != file.id) {
                                $(this).remove();
                            }
                        });
                    }

                    var $fileItem = $("#" + file.id);
                    $fileItem.prepend('<div style="float:left;width:50px;margin-right:2px;"><img src="/Content/images/filetype/' + file.type.replace('.', '') + '.png" onerror="this.src=\'/Content/images/filetype/file.png\'" style="width:40px;height:40px;" /></div>');
                    $fileItem.find('.cancel').find('a').html('<i class="fa fa-trash-o "></i>');
                    $fileItem.find('.cancel').find('a').attr('title', '删除');
                    $fileItem.hover(function () {
                        $(this).find('.cancel').find('a').show();
                    }, function () {
                        $(this).find('.cancel').find('a').hide();
                    });

                    $fileItem.find('.cancel').unbind();
                    $fileItem.find('.cancel').on('click', function () {
                        learun.dialogConfirm({
                            msg: "删除后无法恢复，是否确定删除？",
                            callBack: function (r) {
                                if (r) {
                                    var fileId = $fileItem.attr("data-fileId");
                                    learun.setForm(
                                    {
                                        url: "/Utility/RemoveFile?fileId=" + fileId,
                                        success: function (data) {
                                            if (data.code == 1) {
                                                $fileItem.remove();
                                                if ($('#' + uploadifyExId + '-queue').find('.uploadify-queue-item').length == 0) {
                                                    $('#' + uploadifyExId + '-queue').hide();
                                                }
                                                var _dd = $("#" + uploadifyExId).attr("data-value");
                                                _dd = learun.stringArray(_dd, fileId);
                                                $("#" + uploadifyExId).attr("data-value", _dd);
                                            }
                                        }
                                    });
                                    if ($('#' + uploadifyExId + '-queue').find('.uploadify-queue-item').length == 0) {
                                        $('#' + uploadifyExId + '-queue').hide();
                                    }
                                    learun.dialogMsg({ msg: "移除成功。", type: 1 });
                                }
                            }
                        });
                    });
                },
                onUploadSuccess: function (file, data) {
                    $("#" + file.id).find('.uploadify-progress').remove();
                    $("#" + file.id).find('.data').html(' 恭喜您，上传成功！');
                    $("#" + file.id).prepend('<a class="succeed" title="成功"><i class="fa fa-check-circle"></i></a>');

                    var dataJson = JSON.parse(data);

                    $("#" + file.id).attr("data-fileId", dataJson.fileId);

                    var _dd = $("#" + uploadifyExId).attr("data-value");
                    if (_dd != undefined && _dd != "" && _dd != "undefined") {
                        _dd += ",";
                    }
                    else {
                        _dd = "";
                    }

                    $("#" + uploadifyExId).attr("data-value", _dd + dataJson.fileId);

                    if (opt.onUploadSuccess) {
                        opt.onUploadSuccess(dataJson);
                    }
                },
                onUploadError: function (file) {
                    $("#" + file.id).removeClass('uploadify-error');
                    $("#" + file.id).find('.uploadify-progress').remove();
                    $("#" + file.id).find('.data').html(' 很抱歉，上传失败！');
                    $("#" + file.id).prepend('<span class="error" title="失败"><i class="fa fa-exclamation-circle"></i></span>');
                },
                onUploadStart: function () {
                    $('#' + uploadifyExId + '-queue').show();
                },
                onCancel: function (file) {
                }
            });
            $("#" + uploadifyExId + "-button").prepend('<i style="opacity: 0.6;" class="fa fa-cloud-upload"></i>&nbsp;');
            $('#' + uploadifyExId + '-queue').hide();
            $('#' + uploadifyExId).attr('type', 'uploadify');
        }
        else {//百度上传文件插件
            $uploadifyEx.attr('type', 'webUploader');
            $uploadifyEx.addClass('webUploader');
            $uploadifyEx.html('<div class="btns"><div id="' + uploadifyExId + '-btn" class="btnSelect" style="line-height:' + opt.height + 'px;height:' + (opt.height + 2) + 'px;" ><i style="opacity: 0.6;" class="fa fa-cloud-upload"></i>&nbsp;' + opt.btnName + '</div></div><div id="' + uploadifyExId + '-queue" class="uploadify-queue" style="display:none;"></div></div>');

            var uploader = WebUploader.create({
                auto: true,
                // swf文件路径
                swf: '/Content/scripts/plugins/webuploader/Uploader.swf',
                // 文件接收服务端。
                server: opt.url,
                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#' + uploadifyExId + "-btn",
                accept: {
                    extensions: opt.fileTypeExts
                },
                multiple: true,
                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false,
                duplicate: opt.duplicate,
                fileSingleSizeLimit: opt.fileSingleSizeLimit,
                fileNumLimit: opt.fileNumLimit
            });

            $uploadifyEx.find('.webuploader-pick').height(opt.height);
            $uploadifyEx.find('.webuploader-pick').width(opt.width);
            //添加到队列前判断
            uploader.on('beforeFileQueued', function (file) {
                //added by Sandy 2017-12-25 Start
                /*var existNumber = $('#' + uploadifyExId + '-queue .uploadify-queue-item').length;
                if (existNumber >= opt.fileNumLimit) {
                    top.dialogMsg('最多支持' + opt.fileNumLimit + '个附件！', 'error');
                    return false;
                }*/
                //added by Sandy 2017-12-25 End

                //Added By Cathy 2017-06-22 判断是否重名
                var filename = file.name;
                var isexit = false;
                var exitid = "";
                var $list = $uploadifyEx.find('.uploadify-queue');
                if (opt.duplicate) {
                    $list.find(".uploadify-queue-item").each(function () {
                        if ($(this).find(".fileName").text() == filename) {
                            isexit = true;
                            exitid = $(this).attr("id");
                        }
                    })
                }

                if (isexit) {
                    var r = confirm("已存在同名文件，确认覆盖?");
                    if (r == true) {
                        //Added By Tiny 2017-12-14 
                        //如果新增好的文件进入编辑,存储文件id的字段是id
                        //如果进入编辑后上传文件,存储文件id的字段是data-fileId
                        var $fileItem = $('#' + exitid);//旧的文件id
                        var fileId = $fileItem.attr("data-fileId");//新的文件id 
                        var _fileId = $fileItem.attr("id");//新的文件id 
                        var _dd = $("#" + uploadifyExId).attr("data-value");
                        if (_dd.indexOf(fileId) > -1) {
                            _dd = learun.stringArray(_dd, fileId);
                        }
                        if (_dd.indexOf(_fileId) > -1) {
                            _dd = learun.stringArray(_dd, _fileId);
                        }
                        $("#" + uploadifyExId).attr("data-value", _dd);
                        $list.find("#" + exitid).remove();
                    }
                    return r;
                }
                else {
                    return true;
                }
            });
            uploader.on('startUpload', function (file) {
                var $list = $uploadifyEx.find('.uploadify-queue');
                $list.show();
            });
            // 当有文件被添加进队列的时候
            uploader.on('uploadStart', function (file) {
                //Added by Cathy 2017-12-09 解决图片加载未完成点保存数据缺失问题 Start
                learun.loading({ isShow: true, text: '附件上传中' });
                //Added by Cathy 2017-12-09 解决图片加载未完成点保存数据缺失问题 End
                var $list = $uploadifyEx.find('.uploadify-queue');
                if (opt.oneFile) {
                    $list.html("");
                }
                var $fileItem = $('<div id="' + file.id + '" class="uploadify-queue-item"></div>');
                $fileItem.append('<span class="fileName">' + file.name + '</span><span> (' + learun.countFileSize(file.size) + ')</span><span class="data"></span>');
                $fileItem.append('<div style="float:left;width:50px;margin-right:2px;"><img src="/Content/images/filetype/' + file.ext + '.png" onerror="this.src=\'/Content/images/filetype/file.png\'" style="width:40px;height:40px;" /></div>');

                $list.append($fileItem);
            });
            uploader.on("error", function (type, file) {
                console.log(type);
                //Added  by cathy 2017-06-22 增加格式，大小判断
                var msgopt = {};
                if (type == "Q_TYPE_DENIED") {
                    //Added by Tiny 2017-12-14 如果fileTypeExts的判断个数大于5个,则使用另一种弹框提示
                    var fileTypeExtsNum = opt.fileTypeExts.split(",")
                    if (fileTypeExtsNum.length > 5) {
                        msgopt = {
                            msg: "上传的文件不支持" + file.ext + "格式,请重新选择", type: -1
                        }
                    } else {
                        msgopt = {
                            msg: "请上传" + opt.fileTypeExts + "格式文件", type: -1
                        }
                    }
                } else if (type == "Q_EXCEED_SIZE_LIMIT" || type == "F_EXCEED_SIZE") {
                    msgopt = {
                        msg: "文件大小不能超过" + opt.fileSingleSizeLimit * 1 / (1024 * 1024) + "M", type: -1
                    }
                }
                    //Added by Sandy 2017-12-23
                else if (type == 'Q_EXCEED_NUM_LIMIT') {
                    msgopt = {
                        msg: '最多支持' + opt.fileNumLimit + '个附件', type: -1
                    }
                }
                    //Added by Sandy 2017-12-23
                else {
                    msgopt = {
                        msg: "上传出错！请检查后重新上传！错误代码" + type, type: -1
                    }
                }
                var $list = $uploadifyEx.find('.uploadify-queue');
                if ($list.find('.uploadify-queue-item').length == 0) {
                    $list.hide();
                }
                learun.dialogMsg(msgopt);
            });
            //当某一个文件开始触发
            uploader.on('uploadStart', function (file) {
                var $fileItem = $('#' + file.id);
                $fileItem.find('.data').html(" - 0%");
                $fileItem.append('<div class="uploadify-progress"><div class="uploadify-progress-bar" style="width:0%;"></div></div>');
            });
            //上传过程中触发，携带上传速度
            uploader.on('uploadProgress', function (file, percentage) {
                var $fileItem = $('#' + file.id);
                var percentage = percentage * 100 + '%';
                $fileItem.find('.data').html(" - " + percentage);
                $fileItem.find('.uploadify-progress-bar').css('width', percentage);
            });
            //上传成功后
            uploader.on('uploadSuccess', function (file, dataJson) {
                var $fileItem = $('#' + file.id);
                $fileItem.find('.uploadify-progress').remove();

                $fileItem.find('.data').html(' 恭喜您，上传成功！');
                $fileItem.attr("data-fileId", dataJson.fileId);
                $fileItem.prepend('<div class="cancel"><a title="删除" style="display: none;"><i class="fa fa-trash-o "></i></a></div>');
                $fileItem.prepend('<a class="succeed" title="成功"><i class="fa fa-check-circle"></i></a>');

                var _dd = $("#" + uploadifyExId).attr("data-value");
                if (_dd != undefined && _dd != "" && _dd != "undefined") {
                    _dd += ",";
                }
                else {
                    _dd = "";
                }

                $("#" + uploadifyExId).attr("data-value", _dd + dataJson.fileId);

                if (opt.onUploadSuccess) {
                    opt.onUploadSuccess(dataJson);
                }

            });
            //上传失败后
            uploader.on('uploadError', function (file, code) {
                var $fileItem = $('#' + file.id);
                $fileItem.removeClass('uploadify-error');
                $fileItem.find('.uploadify-progress').remove();
                $fileItem.find('.data').html(' 很抱歉，上传失败！');
                $fileItem.append('<div class="cancel"><a title="删除" style="display: none;"><i class="fa fa-trash-o "></i></a></div>');
                $fileItem.append('<span class="error" title="失败"><i class="fa fa-exclamation-circle"></i></span>');

            });
            //上传完成后触发
            uploader.on("uploadComplete", function (file) {
                var $list = $uploadifyEx.find('.uploadify-queue');
                var $fileItem = $('#' + file.id);
                $fileItem.hover(function () {
                    $(this).find('.cancel').find('a').show();
                }, function () {
                    $(this).find('.cancel').find('a').hide();
                });
                $fileItem.find('.cancel').unbind();
                $fileItem.find('.cancel').on('click', function () {
                    learun.dialogConfirm({
                        msg: "删除后无法恢复，是否确定删除？",
                        callBack: function (r) {
                            if (r) {
                                var fileId = $fileItem.attr("data-fileId");
                                learun.setForm(
                                {
                                    url: "/Utility/RemoveFile?fileId=" + fileId,
                                    success: function (data) {
                                        if (data.code == 1) {
                                            uploader.removeFile(file);
                                            $fileItem.remove();
                                            if ($list.find('.uploadify-queue-item').length == 0) {
                                                $list.hide();
                                            }
                                            var _dd = $("#" + uploadifyExId).attr("data-value");
                                            _dd = learun.stringArray(_dd, fileId);
                                            $("#" + uploadifyExId).attr("data-value", _dd);
                                            //Added by Cathy  增加删除回调方法 2017-09-27
                                            if (opt.onCancel) {
                                                opt.onCancel(file);
                                            }
                                        }
                                    }
                                });
                                if ($list.find('.uploadify-queue-item').length == 0) {
                                    $list.hide();
                                }
                                learun.dialogMsg({ msg: "移除成功。", type: 1 });
                            }
                        }
                    });
                });

            });

            uploader.on("uploadFinished", function (file) {
                learun.loading({ isShow: false });
            });
            return uploader;
        }
    }
    $.fn.uploadifyExSet = function (keyValue, opt) {
        var opt = $.extend({
            isRemove: true,
            isDown: true
        }, opt);
        var $uploadifyExSet = $(this);
        var uploadifyExSetId = $uploadifyExSet.attr('id');
        if (!uploadifyExSetId) {
            return false;
        }
        var $uploadifyExSetQueue = $('#' + uploadifyExSetId + '-queue');

        if ($uploadifyExSetQueue.length < 1) {
            $uploadifyExSetQueue = $('<div id="' + uploadifyExSetId + '-queue" class="uploadify-queue" style="display:none;"></div>');
            $uploadifyExSet.append($uploadifyExSetQueue);
        }
        $uploadifyExSetQueue.empty();
        learun.setForm(
        {
            url: "/Utility/GetFiles?fileIdList=" + keyValue,
            success: function (data) {
                $.each(data, function (id, item) {
                    $uploadifyExSetQueue.show();
                    var _html = '<div id="' + item.F_Id + '"  class="uploadify-queue-item olduploadify-queue-item" ><a class="succeed" title="成功"><i class="fa fa-check-circle"></i></a><div style="float:left;width:50px;margin-right:2px;"><img src="/Content/images/filetype/' + item.F_FileType + '.png" onerror="this.src=\'/Content/images/filetype/file.png\'" style="width:40px;height:40px;"></div>';
                    if (opt.isRemove) {
                        _html += '<div class="cancel remove" data-fileId="' + item.F_Id + '"><a title="删除" style="display: none;"><i class="fa fa-trash-o "></i></a></div>';
                    }
                    if (opt.isDown) {
                        _html += '<div class="cancel down" data-fileId="' + item.F_Id + '"><a title="下载" style="display: none;margin-right:10px;"><i class="fa fa-download"></i></a></div>';
                    }
                    _html += '<span class="fileName">' + item.F_FileName + '</span><span class="data"></span></div>';

                    $uploadifyExSetQueue.append(_html);
                });
            }
        });
        $uploadifyExSet.attr("data-value", keyValue);

        $uploadifyExSetQueue.find(".uploadify-queue-item").hover(function () {
            $(this).find('.cancel').find('a').show();
        }, function () {
            $(this).find('.cancel').find('a').hide();
        });

        $uploadifyExSetQueue.find(".olduploadify-queue-item").find('.remove').on('click', function () {
            var fileId = $(this).attr("data-fileId");
            learun.dialogConfirm({
                msg: "删除后无法恢复，是否确定删除？",
                callBack: function (r) {
                    if (r) {
                        learun.setForm(
                        {
                            url: "/Utility/RemoveFile?fileId=" + fileId,
                            success: function (data) {
                                if (data.code == 1) {
                                    $("#" + fileId).remove();
                                    var _dd = $("#" + uploadifyExSetId).attr("data-value");
                                    _dd = learun.stringArray(_dd, fileId);
                                    $("#" + uploadifyExSetId).attr("data-value", _dd);

                                    if ($('#' + uploadifyExSetId + '-queue').find('.uploadify-queue-item').length == 0) {
                                        $('#' + uploadifyExSetId + '-queue').hide();
                                    }
                                    //Added by Cathy  增加删除回调方法 2017-09-27
                                    if (opt && opt.onCancel) {
                                        opt.onCancel(data);
                                    }
                                }
                            }
                        });
                        if ($('#' + uploadifyExSetId + '-queue').find('.uploadify-queue-item').length == 0) {
                            $('#' + uploadifyExSetId + '-queue').hide();
                        }
                        learun.dialogMsg({ msg: "移除成功。", type: 1 });
                    }
                }
            });
        });
        $uploadifyExSetQueue.find(".olduploadify-queue-item").find('.down').on('click', function () {
            var fileId = $(this).attr("data-fileId");
            learun.downFile({ url: "/Utility/DownFile", data: ("fileId=" + fileId), method: 'post' });
        });
    }

    //图片上传插件初始化（webUploader方法可用，uploadify待验证）
    $.fn.uploadifyEx_Pic = function (opt) {
        var $uploadifyEx_Pic = $(this);
        var uploadifyExId_Pic = $uploadifyEx_Pic.attr('id');
        if (!uploadifyExId_Pic) {
            return false;
        }
        var fileInfo = new Array();
        var opt = $.extend({
            btnName: "上传附件",
            url: "",
            onUploadSuccess: false,
            cancel: false,
            height: 30,
            width: 90,
            type: "webUploader",
            fileTypeExts: "",
            oneFile: false,
            isRemove: true,
            IsAdd: true,
            maxHeight: 0,
            maxWidth: 0,
            constHeight: 0,
            constWidth: 0,
        }, opt);
        //百度上传文件插件
        $uploadifyEx_Pic.attr('type', 'uploadifyPic');
        $uploadifyEx_Pic.addClass('uploadifyPic');
        if (opt.IsAdd) {
            $uploadifyEx_Pic.html('<div class="btns"><div id="' + uploadifyExId_Pic + '-btn" class="btnSelect" style="line-height:' + opt.height + 'px;height:' + (opt.height + 2) + 'px;" ><i style="opacity: 0.6;" class="fa fa-cloud-upload"></i>&nbsp;' + opt.btnName + '</div></div><div id="' + uploadifyExId_Pic + '-queue" class="picture-queue" style="display:none;"></div></div>');
        }
        var uploader = WebUploader.create({
            auto: true,
            // swf文件路径
            swf: '/Content/scripts/plugins/webuploader/Uploader.swf',
            // 文件接收服务端。
            server: opt.url,
            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            //Modified by Sandy 2017-10-26 Start
            //pick: '#' + uploadifyExId_Pic + "-btn",
            pick: {
                id: '#' + uploadifyExId_Pic + "-btn",
                multiple: opt.oneFile ? false : true
            },
            //Modified by Sandy 2017-10-26 Start
            accept: {
                extensions: opt.fileTypeExts
            },
            fileSingleSizeLimit: opt.fileSingleSizeLimit,
            multiple: true,
            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,
        });

        $uploadifyEx_Pic.find('.webuploader-pick').height(opt.height);
        $uploadifyEx_Pic.find('.webuploader-pick').width(opt.width);

        //Added by Cathy 2017-12-09 增加上传图片高度和宽度限制 Start
        uploader.on('beforeFileQueued', function (file) {
            var _URL = window.URL || window.webkitURL;
            var img = new Image();
            img.src = _URL.createObjectURL(file.source.source);
            //fileInfo = [];
            img.onload = function () {
                console.log("width:" + this.width + ",height:" + this.height);
                fileInfo.push({ file: file, width: this.width, height: this.height });
            };
        })
        //Added by Cathy 2017-12-09 增加上传图片高度和宽度限制 End

        uploader.on('startUpload', function (file) {
            var $list = $uploadifyEx_Pic.find('.picture-queue');
            $list.show();
        });
        // 当有文件被添加进队列的时候
        uploader.on('uploadStart', function (file) {
            //Added by Cathy 2017-12-09 解决图片加载未完成点保存数据缺失问题 Start
            learun.loading({ isShow: true, text: '附件上传中' });
            //Added by Cathy 2017-12-09 解决图片加载未完成点保存数据缺失问题 End
            //Added by Cathy 2017-12-09 增加上传图片高度和宽度限制  Start
            for (var _imnum = 0; _imnum < fileInfo.length; _imnum++) {
                if (fileInfo[_imnum].file.id == file.id) {
                    var _file = fileInfo[_imnum];
                    if ((opt.maxWidth != 0 && opt.maxHeight != 0) && (_file.width > opt.maxWidth || _file.height > opt.maxHeight)) {
                        learun.dialogMsg({ msg: "图片限制：高最大为" + opt.maxHeight + "，宽最大为" + opt.maxWidth, type: -1 });
                        uploader.removeFile(file, true);
                        learun.loading({ isShow: false });
                        return false;
                    }
                    if ((opt.constWidth != 0 && opt.constHeight != 0) && (_file.width != opt.constWidth || _file.height != opt.constHeight)) {
                        learun.dialogMsg({ msg: "图片限制：高为" + opt.constHeight + "，宽为" + opt.constWidth, type: -1 });
                        uploader.removeFile(file, true);
                        learun.loading({ isShow: false });
                        return false;
                    }
                }
            }
            //Added by Cathy 2017-12-09 增加上传图片高度和宽度限制  End
            var $list = $uploadifyEx_Pic.find('.picture-queue');
            if (opt.oneFile) {
                var picTarget = $list.find('.picture-queue-item'),
                    picId = picTarget.attr('id');
                if (picTarget.length) {
                    if (!picTarget.is('.oldpicture-queue-item')) {
                        uploader.removeFile(picId);
                    }
                    $list.html("");
                }
            }
            var $fileItem = $('<div id="' + file.id + '" class="picture-queue-item"></div>');
            var src = window.URL.createObjectURL(file.source.source);
            $fileItem.append('<img src="' + src + '" class="itemImg"  style="width:100%;height:100%" />');
            //  $fileItem.append('<span class="fileName">' + file.name + ' (' + learun.countFileSize(file.size) + ')</span><span class="data"></span>');
            //  $fileItem.append('<div style="float:left;width:50px;margin-right:2px;"><img src="/Content/images/filetype/' + file.ext + '.png" style="width:40px;height:40px;" /></div>');

            $list.append($fileItem);

            /*if (window.URL) {
                var src = window.URL.createObjectURL(file.source.source);
                $fileItem.append('<img src="' + src + '" class="itemImg"  style="width:100%;height:100%" />');
                //  $fileItem.append('<span class="fileName">' + file.name + ' (' + learun.countFileSize(file.size) + ')</span><span class="data"></span>');
                //  $fileItem.append('<div style="float:left;width:50px;margin-right:2px;"><img src="/Content/images/filetype/' + file.ext + '.png" style="width:40px;height:40px;" /></div>');
            } else {    //IE使用滤镜
                var sFilter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                $(file[0]).get(0).select();
                var src = document.selection.createRange().text;
                $img = $('<img class="itemImg"  style="width:100%;height:100%" />');
                $img.get(0).filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = src;
                $fileItem.append($img);
            }
            $list.append($fileItem);*/
        });
        //当某一个文件开始触发
        //uploader.on('uploadStart', function (file) {
        //    var $fileItem = $('#' + file.id);
        //    $fileItem.find('.data').html(" - 0%");
        //    $fileItem.append('<div class="uploadify-progress"><div class="uploadify-progress-bar" style="width:0%;"></div></div>');
        //});
        //上传过程中触发，携带上传速度
        //uploader.on('uploadProgress', function (file, percentage) {
        //    var $fileItem = $('#' + file.id);
        //    var percentage = percentage * 100 + '%';
        //    $fileItem.find('.data').html(" - " + percentage);
        //    $fileItem.find('.uploadify-progress-bar').css('width', percentage);
        //});
        //上传成功后
        uploader.on('uploadSuccess', function (file, dataJson) {


            //Added by Cathy 2017-12-09 增加上传图片高度和宽度限制 Start 
            for (var _imnum = 0; _imnum < fileInfo.length; _imnum++) {
                if (fileInfo[_imnum].file.id == file.id) {
                    var _file = fileInfo[_imnum];
                    if ((opt.maxWidth != 0 && opt.maxHeight != 0) && (_file.width > opt.maxWidth || _file.height > opt.maxHeight)) {
                        return false;
                    }
                    if ((opt.constWidth != 0 && opt.constHeight != 0) && (_file.width != opt.constWidth || _file.height != opt.constHeight)) {
                        return false;
                    }
                }

            }
            //Added by Cathy 2017-12-09 增加上传图片高度和宽度限制 End
            var $fileItem = $('#' + file.id);
            // $fileItem.find('.uploadify-progress').remove();
            //  $fileItem.find('.data').html(' 恭喜您，上传成功！');
            $fileItem.attr("data-fileId", dataJson.fileId);
            $fileItem.append('<div class="cancel"><a title="删除" style="display: none;"><i class="fa fa-trash-o "></i></a></div>');
            // $fileItem.prepend('<a class="succeed" title="成功"><i class="fa fa-check-circle"></i></a>');
            if (opt.oneFile) {
                $("#" + uploadifyExId_Pic).attr("data-value", "");
            }
            var _dd = $("#" + uploadifyExId_Pic).attr("data-value");
            if (_dd != undefined && _dd != "" && _dd != "undefined") {
                _dd += ",";
            }
            else {
                _dd = "";
            }

            $("#" + uploadifyExId_Pic).attr("data-value", _dd + dataJson.fileId);

            if (opt.onUploadSuccess) {
                opt.onUploadSuccess(dataJson);
            }
        });
        //上传失败后
        uploader.on('uploadError', function (file, code) {
            var $fileItem = $('#' + file.id);
            $fileItem.removeClass('uploadify-error');
            $fileItem.find('.uploadify-progress').remove();
            $fileItem.find('.data').html(' 很抱歉，上传失败！');
            $fileItem.append('<div class="cancel"><a title="删除" style="display: none;"><i class="fa fa-trash-o "></i></a></div>');
            $fileItem.append('<span class="error" title="失败"><i class="fa fa-exclamation-circle"></i></span>');

        });
        //上传完成后触发
        uploader.on("uploadComplete", function (file) {
            var $list = $uploadifyEx_Pic.find('.picture-queue');
            var $fileItem = $('#' + file.id);
            $fileItem.hover(function () {
                $(this).find('.cancel').find('a').show();
            }, function () {
                $(this).find('.cancel').find('a').hide();
            });
            $fileItem.find('.cancel').unbind();
            $fileItem.find('.cancel').on('click', function () {
                var fileId = $fileItem.attr("data-fileId");
                learun.setForm(
                {
                    url: "/Utility/RemoveFile?fileId=" + fileId,
                    success: function (data) {
                        if (data.code == 1) {
                            uploader.removeFile(file);
                            $fileItem.remove();
                            if ($list.find('.picture-queue-item').length == 0) {
                                $list.hide();
                            }
                            var _dd = $("#" + uploadifyExId_Pic).attr("data-value");
                            _dd = learun.stringArray(_dd, fileId);
                            $("#" + uploadifyExId_Pic).attr("data-value", _dd);
                        }
                    }
                });
                if ($list.find('.picture-queue-item').length == 0) {
                    $list.hide();
                }
            });
        });
        uploader.on("uploadFinished", function (file) {
            learun.loading({ isShow: false });
        });
        //Added by Sandy 2017-08-08 Start
        // 当用户上传的图片格式、大小等验证不通过时
        uploader.on('error', function (errorCode) {
            var errorMsg = '';
            if (errorCode == 'Q_TYPE_DENIED') {
                errorMsg = "请上传" + opt.fileTypeExts + "格式文件";
            } else if (errorCode == 'F_EXCEED_SIZE') {
                errorMsg = "文件大小不能超过" + opt.fileSingleSizeLimit / (1024 * 1024) + "M";
            } else if (errorCode == 'F_DUPLICATE') {
                errorMsg = '文件相同';
            } else {
                errorMsg = "上传出错！请检查后重新上传！错误代码" + errorCode;
            }
            top.dialogMsg(errorMsg, 'error');
        });
        //Added by Sandy 2017-08-08 End
    }
    $.fn.uploadifyExSet_Pic = function (keyValue, opt) {
        var $uploadifyExSet_Pic = $(this);
        var uploadifyExSetId_Pic = $uploadifyExSet_Pic.attr('id');
        if (!uploadifyExSetId_Pic) {
            return false;
        }
        var $uploadifyExSetQueue_Pic = $('#' + uploadifyExSetId_Pic + '-queue');

        if ($uploadifyExSetQueue_Pic.length < 1) {
            $uploadifyExSetQueue_Pic = $('<div id="' + uploadifyExSetId_Pic + '-queue" class="picture-queue" style="display:none;"></div>');
            $uploadifyExSet_Pic.append($uploadifyExSetQueue_Pic);
        }

        learun.setForm(
        {
            url: "/Utility/GetFiles?fileIdList=" + keyValue,
            success: function (data) {
                $.each(data, function (id, item) {
                    $uploadifyExSetQueue_Pic.show();
                    var _html = '<div id="' + item.F_Id + '" class="picture-queue-item oldpicture-queue-item" >';

                    if (opt == undefined || opt.isDown) {
                        _html += '<div class="cancel down" data-fileId="' + item.F_Id + '"><a title="下载" style="display: none;margin-right:10px;"><i class="fa fa-download"></i></a></div>';
                    }
                    _html += '<img src="' + item.F_FilePath.replace("~", "") + '" class="itemImg"  style="width:100%;height:100%" />';
                    if (opt == undefined || opt.isRemove) {
                        _html += '<div class="cancel remove" data-fileId="' + item.F_Id + '"><a title="删除" style="display: none;"><i class="fa fa-trash-o"></i></a></div>';
                    }
                    _html += "</div>";
                    $uploadifyExSetQueue_Pic.append(_html);
                });
            }
        });
        $uploadifyExSet_Pic.attr("data-value", keyValue);

        $uploadifyExSetQueue_Pic.find(".picture-queue-item").hover(function () {
            $(this).find('.cancel').find('a').show();
        }, function () {
            $(this).find('.cancel').find('a').hide();
        });

        $uploadifyExSetQueue_Pic.find(".oldpicture-queue-item").find('.remove').on('click', function () {
            var fileId = $(this).attr("data-fileId");
            learun.setForm(
            {
                url: "/Utility/RemoveFile?fileId=" + fileId,
                success: function (data) {
                    if (data.code == 1) {
                        $("#" + fileId).remove();
                        var _dd = $("#" + uploadifyExSetId_Pic).attr("data-value");
                        _dd = learun.stringArray(_dd, fileId);
                        $("#" + uploadifyExSetId_Pic).attr("data-value", _dd);

                        if ($('#' + uploadifyExSetId_Pic + '-queue').find('.picture-queue-item').length == 0) {
                            $('#' + uploadifyExSetId_Pic + '-queue').hide();
                        }
                    }
                }
            });
            if ($('#' + uploadifyExSetId_Pic + '-queue').find('.picture-queue-item').length == 0) {
                $('#' + uploadifyExSetId_Pic + '-queue').hide();
            }
        });
        $uploadifyExSetQueue_Pic.find(".oldpicture-queue-item").find('.down').on('click', function () {
            var fileId = $(this).attr("data-fileId");
            learun.downFile({ url: "/Utility/DownFile", data: ("fileId=" + fileId), method: 'post' });
        });
    }

    //对Date属性增加一个方法
    Date.prototype.DateAdd = function (strInterval, Number) {
        //y年 q季度 m月 d日 w周 h小时 n分钟 s秒 ms毫秒
        var dtTmp = this;
        switch (strInterval) {
            case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
            case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
            case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
            case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
            case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
            case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        }
    };
    //员工多选框
    $.fn.userSelectBox = function (opt) {
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        };
        var opt = $.extend({
            //请选择
            description: "==请选择==",
            //added by peter
            isRadio: false,
            //是否单选
            isShowLeftTree: true,
            //是否显示左栏目树
            showUserType: 0,
            //0:全部人员,1:按当前用户权限数据获取用户列表，2：按公司获取用户列表，3：按部门获取用户列表，4：按职位获取用户列表，5：按岗位获取用户列表，6：按角色获取用户列表，7：按用户组获取用户列表
            isCurrentUser: false,
            //当前用户的
            id: "",
            selectedId: "",
            selectedText: "",
            //各类型对应ID值
            //added by peter end
            //是否限制人员长度 默认为否
            isLimitLength: false
        }, opt);
        $select.on('click', function () {//绑定点击事件
            var LimitLength;
            if (opt.isLimitLength) {
                //1是允许限制长度
                LimitLength = "&LimitLength=1"
            }
            var title = "用户选择 - " + (opt.isRadio ? "单选模式" : "多选模式");
            var data = $select.attr("data-value");
            var url = '/BaseManage/User/SelectUserIndex?data=' + data +
                "&single=" + (opt.isRadio ? 1 : 0) + "&showTree=" + (opt.isShowLeftTree ? 1 : 0) +
                "&showUserType=" + opt.showUserType + "&isCurrent=" + (opt.isCurrentUser ? 1 : 0) +
                "&id=" + opt.id + LimitLength;
            var width = "800px";
            if (!opt.isShowLeftTree)
                width = "640px";
            //added by Cathy 2017-12-05 Start 如果是人员选择框,点击弹出选框后清除提示信息 
            if ($select.attr('isvalid') == 'yes') {
                removeMessage($select);
            }
            //added by Cathy 2017-12-05 End 
            learun.dialogOpen({
                id: "SelectUserIndex",
                title: title,
                url: url,
                width: width,
                height: "520px",
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick(function (data) {
                        var ids = [], names = [];
                        $.each(data, function (i, item) {
                            ids.push(item.id);
                            names.push(item.name);
                        });
                        $select.attr("data-value", String(ids)).attr("data-text", String(names));
                        $select.find('.ui-select-text').html(String(names)).css('color', '#000');
                    });
                }
            });
        });
        var dom = {
            initLoad: function () {
                if (!$select.hasClass("fn-select-user-box"))
                    $select.addClass("fn-select-user-box");
                $select.attr("type", "select");
            }
        };
        dom.initLoad();
    };
    $.fn.SelectBox = function (opt) {
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        };
        var opt = $.extend({
            name: selectId,//名称
            isRadio: false, //是否单选 
            url: '',
            data: null,
            allowShowDefault: "ALL",
            id: "id",
            text: "text"
        }, opt);
        var dom = {
            rendering: function () {
                if ($select.find('.ui-checkbox-text').length == 0) {
                    $select.html("<div class=\"ui-checkbox-text\" data-value=\"\" data-text=\"" + opt.description + "\"></div>");
                }
                //渲染多选框
                var optionHtml = "<div class=\"ui-checkbox-option\">";
                optionHtml += "</div>";
                var $optionHtml = $(optionHtml);
                var selectOption = selectId + '-option';
                $optionHtml.attr('id', selectOption);
                $select.find(".ui-checkbox-text").append($optionHtml);
                return $select;
            },
            renderingData: function ($option, setting) {
                if (setting.data != undefined && setting.data.length >= 0) {
                    $.each(setting.data, function (i, row) {
                        var $_html = $('<label></label>');
                        if (setting.allowShowDefault == "ALL") {
                            $_html.append('<input name="' + opt.name + '" value="' + row[setting.id] + '" type="checkbox">' + row[setting.text]);
                        }
                        else {
                            $_html.append('<input name="' + opt.name + '" value="' + row[setting.id] + '" checked="checked" type="checkbox">' + row[setting.text]);
                        }
                        $option.find('.ui-checkbox-option').append($_html);
                    });
                    $option.find("input[type=checkbox]").change(function (e) {
                        var $this = $(this);
                        var _value = $this.val();
                        var _datavalue = $select.find(".ui-checkbox-text").attr("data-value");
                        if ($this[0].checked) {
                            if (_datavalue != undefined && _datavalue != "" && _datavalue != "undefined") {
                                _datavalue += ",";
                            }
                            else {
                                _datavalue = "";
                            }
                            _datavalue += _value;
                        } else {
                            _datavalue = learun.stringArray(_datavalue, _value);
                        }
                        $select.find(".ui-checkbox-text").attr("data-value", _datavalue);
                        $select.attr("data-value", _datavalue);
                        $select.trigger("change");
                        e.stopPropagation();
                    });
                }
            },
            loadData: function () {
                if (!!opt.url) {
                    opt.data = learun.ajax.asyncGet({
                        url: opt.url,
                        data: opt.param,
                        type: opt.method
                    });
                    if (!!opt.dataName) {
                        opt.data = opt.data[opt.dataName];
                    }
                }
                else {
                    var $lilists = $select.find('label');
                    if ($lilists.length > 0) {
                        opt.data = [];
                        $lilists.each(function (e) {
                            var $li = $(this);
                            var point = {};
                            point[opt.id] = $li.attr('data-value');
                            point[opt.title] = $li.attr('title');
                            point[opt.text] = $li.html();
                            opt.data.push(point);
                        });
                    }
                }
            }
        };
        dom.loadData();
        var $option = dom.rendering();
        dom.renderingData($option, opt);
        return $select;
    };
    $.fn.getUserInfo = function (opt) {
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        };
        var opt = $.extend({
            userId: "guest",
            displayName: "F_RealName",
        }, opt);
        var result;
        var dom = {
            initLoad: function () {
                result = learun.ajax.asyncGet({
                    url: "/BaseManage/User/GetFormJson?keyValue=" + opt.userId
                });
                var value = $select.val();
                var temp = eval("result." + (opt.displayName));
                if (!!value)
                    $select.val(temp);
                else
                    $select.html(temp);
                $select.attr("data-value", opt.userId).attr("data-text", temp).attr("type", "select");
                if (!$select.hasClass("fn-select-user-info"))
                    $select.addClass("fn-select-user-info");
            }
        };
        dom.initLoad();
        return result;
    };
    $.fn.getUserRealName = function (userId) {
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        };
        var result;
        var dom = {
            initLoad: function () {
                var temp = "";
                result = $select.setUserSelectBox(userId);
                if (!!result && result.length > 0)
                    temp = result[0];
                var value = $select.val();
                if (!!value)
                    $select.val(temp);
                else
                    $select.html("<div class=\"ui-select-text\" data-value=\"" + userId + "\">" + temp + "</div>");
                $select.attr("data-value", userId).attr("data-text", temp).attr("type", "select");
                if (!$select.hasClass("fn-select-user-realname"))
                    $select.addClass("fn-select-user-realname");
            }
        };
        dom.initLoad();
        return result;

    };
    //签名板
    $.fn.signName = function (opt) {
        var $SignNameCanvas = $(this);
        var SignNameCanvasId = $SignNameCanvas.attr('id');
        if (!SignNameCanvasId) {
            return false;
        }
        var opt = $.extend({
            Height: 200,//高度
            Width: 500,//宽度
            SizeSum: 4,//预览大小个数
            ImgBase64: '',//图片初始化显示
            DefaultImgBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJAQMAAADaX5RTAAAAA3NCSVQICAjb4U/gAAAABlBMVEX///+ZmZmOUEqyAAAAAnRSTlMA/1uRIrUAAAAJcEhZcwAACusAAArrAYKLDVoAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDkvMjAvMTIGkKG+AAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAAB1JREFUCJljONjA8LiBoZyBwY6BQQZMAtlAkYMNAF1fBs/zPvcnAAAAAElFTkSuQmCC",
            BeforSignName: function () {
                //禁止手机浏览器拖动
                window.ontouchmove = function (e) {
                    e.preventDefault && e.preventDefault();
                    e.returnValue = false;
                    e.stopPropagation && e.stopPropagation();
                    return false;
                }
                document.body.style.height = '100%';
                document.body.style.overflow = 'hidden';
            },
            AfterSignName: function () {
                //允许手机浏览器拖动
                window.ontouchmove = function (e) {
                    e.preventDefault && e.preventDefault();
                    e.returnValue = true;
                    e.stopPropagation && e.stopPropagation();
                    return true;
                }
                //document.body.style.height = 'auto';
                //document.body.style.overflow = 'auto';
            }
        }, opt);
        $SignNameCanvas.html('<div id="canvasArea" class="signName" style="left:50%;position:absolute;top:10%;"><h2 class="clearfix"><span class="left">绘制签名</span><span class="close right">×</span></h2><canvas id= "canvas" width= "' + opt.Width + '" height= "' + opt.Height + '" style="width:' + opt.Width + 'px;height:' + opt.Height + 'px; border:1px dashed #aaa;" ></canvas><div id="control" class="clearfix"><div class="left"><div id="canvasBrush" class="left canvas-brush"><h5>选择笔刷大小</h5><div class="brush"><span class="small-brush cur"></span><span class="middle-brush"></span><span class="big-brush"></span> </div></div><div id="canvasColor" class="left canvas-color"><h5>画笔颜色</h5><ul><li style="background: #000000"></li><li style="background: #036eb8"></li><li style="background: #ff0000"></li></ul></div></div><div class="right control_r"><div id="canvasControl" class="left canvas-control"><span title="上一步" class="return-control">上一步</span><span title="下一步" class="next-control">下一步</span><span title="清除" class="empty-control">清除</span></div><div id="canvasDrawImage" class="left canvas-drawImage"><button class="drawImage" id="createResult">创建签名</button></div></div></div></div><div id="canvasPreview" class="canvas-preview"></div>');
        $('#canvasArea').hide();
        var doc = document;
        //画布
        var canvas = doc.getElementById('canvas');
        //画笔颜色选择div
        var colorDiv = doc.getElementById('canvasColor');
        //画笔大小选择div
        var brushDiv = doc.getElementById('canvasBrush');
        //清除
        var controlDiv = doc.getElementById('canvasControl');
        //创建图片
        var drawImageDiv = doc.getElementById('canvasDrawImage');
        //生成的图片
        var imgDiv = doc.getElementById('canvasPreview');

        //初始化画布
        function Canvas() {
            opt.BeforSignName();
            this.init.apply(this, arguments);
        }
        //按钮状态判断
        function IsDraw(arrayPre, arrayMid, arrayNext) {
            if (arrayPre.length) {
                controlDiv.getElementsByTagName("span")[0].className = "return-control txt_blue";
            }
            else {
                controlDiv.getElementsByTagName("span")[0].className = "return-control";
            }
            if (arrayNext.length) {
                controlDiv.getElementsByTagName("span")[1].className = "next-control txt_blue";
            }
            else {
                controlDiv.getElementsByTagName("span")[1].className = "next-control";
            }
            if (arrayMid.length) {
                controlDiv.getElementsByTagName("span")[2].className = "empty-control txt_blue";
            }
            else {
                controlDiv.getElementsByTagName("span")[2].className = "empty-control";
            }
        }

        //画布属性
        Canvas.prototype = {
            //存储当前表面状态数组-上一步  
            preDrawAry: [],
            //存储当前表面状态数组-下一步  
            nextDrawAry: [],
            //中间数组  
            middleAry: [],
            //配置参数  
            confing: {
                //画笔粗细
                lineWidth: 1,
                //画笔颜色
                lineColor: "#000",
                //阴影模糊级数
                shadowBlur: 1
            },
            init: function (oCanvas, oColor, oBrush, oControl, oDrawImage, imgDiv) {
                this.canvas = oCanvas;
                this.context = oCanvas.getContext('2d');
                this.colorDiv = oColor;
                this.brushDiv = oBrush;
                this.controlDiv = oControl;
                this.drawImageDiv = oDrawImage;
                this.imgDiv = imgDiv;
                //获取当前画板的实时数据
                this.initDraw();
                //画板事件绑定
                this.drawAction(oCanvas);
                this.setColorAction();
                this.setBrushAction();
                this.preClickStatus();
                this.nextClickStatus();
                this.clearClickAction();
                this.drawImageAction(oCanvas);
                //base64位编码初始化
                if (opt.ImgBase64 != '') {
                    this.InitCanvas(opt.ImgBase64);
                    this.ImageInit(opt.ImgBase64);
                }
                else {
                    this.ImageInit(opt.DefaultImgBase64);
                }
            },
            initDraw: function () {
                //获取画板上的数据
                var preData = this.context.getImageData(0, 0, opt.Width, opt.Height);
                //将数据存储起来  
                this.middleAry.push(preData);
            },
            InitCanvas: function (imageBase64) {
                var tmpImage = new Image();
                tmpImage.src = imageBase64;
                this.context.drawImage(tmpImage, 0, 0);
            },
            //判断是否已涂鸦,修改按钮状态  
            hasDraw: function () {
                IsDraw(preDrawAry, middleAry, nextDrawAry);
            },
            //涂鸦主程序  
            drawAction: function (oCanvas, context, middleAry) {
                var sign = this;
                //鼠标事件
                oCanvas.onmousedown = function (e) {
                    var x = e.pageX,
                        y = e.pageY,
                        left = $(this).offset().left,
                        top = $(this).offset().top,
                        canvasX = x - left,
                        canvasY = y - top;
                    sign.setCanvasStyle();
                    //清除子路径  
                    sign.context.beginPath();
                    //移到指定的点上
                    sign.context.moveTo(canvasX, canvasY);
                    //当前绘图表面状态  
                    var preData = sign.context.getImageData(0, 0, opt.Width, opt.Height);
                    //当前绘图表面进栈  
                    sign.preDrawAry.push(preData);
                    //鼠标拖动事件
                    document.onmousemove = function (e) {
                        var x2 = e.clientX,
                            y2 = e.clientY,
                            t = e.target,
                            canvasX2 = x2 - left,
                            canvasY2 = y2 - top;
                        //如果点在画布内，从前一点画一条线到新的点上
                        if (t == oCanvas) {
                            sign.context.lineTo(canvasX2, canvasY2);
                            sign.context.stroke();
                        } else {
                            sign.context.beginPath();
                        }
                    }
                    document.onmouseup = function (e) {
                        this.onmousemove = false;
                        //当前绘图表面状态  
                        var preData = sign.context.getImageData(0, 0, opt.Width, opt.Height);
                        //当前绘图表面进栈  
                        sign.middleAry[0] = preData;
                        IsDraw(sign.preDrawAry, sign.middleAry, sign.nextDrawAry);
                    }
                };
                //触摸事件
                oCanvas.ontouchstart = function (e) {
                    //var x = e.touches[0].clientX,
                    //    y = e.touches[0].clientY,
                    //    left = this.parentNode.offsetLeft + 20,
                    //    top = this.parentNode.offsetTop + 60,
                    //    canvasX = x - left,
                    //    canvasY = y - top;
                    var x = e.touches[0].pageX,
                        y = e.touches[0].pageY,
                        left = $(this).offset().left,
                        top = $(this).offset().top,
                        canvasX = x - left,
                        canvasY = y - top;
                    sign.setCanvasStyle();
                    //alert(x);
                    //清除子路径  
                    sign.context.beginPath();
                    sign.context.moveTo(canvasX, canvasY);
                    //当前绘图表面状态  
                    var preData = sign.context.getImageData(0, 0, opt.Width, opt.Height);
                    //当前绘图表面进栈  
                    sign.preDrawAry.push(preData);
                    document.ontouchmove = function (e) {
                        var x2 = e.touches[0].clientX,
                            y2 = e.touches[0].clientY,
                            t = e.target,
                            canvasX2 = x2 - left,
                            canvasY2 = y2 - top;
                        if (t == oCanvas) {
                            sign.context.lineTo(canvasX2, canvasY2);
                            sign.context.stroke();
                        } else {
                            sign.context.beginPath();
                        }
                    }
                    document.ontouchend = function (e) {
                        //当前绘图表面状态  
                        var preData = sign.context.getImageData(0, 0, opt.Width, opt.Height);
                        //当前绘图表面进栈  
                        sign.middleAry[0] = preData;
                    }
                };

            },
            //设置画笔  
            setCanvasStyle: function () {
                this.context.lineWidth = this.confing.lineWidth;
                this.context.shadowBlur = this.confing.shadowBlur;
                this.context.shadowColor = this.confing.lineColor;
                this.context.strokeStyle = this.confing.lineColor;
            },
            //设置颜色  
            setColorAction: function () {
                this.colorDiv.onclick = this.bind(this, this.setColor);
            },
            setColor: function (e) {
                var t = e.target;
                if (t.nodeName.toLowerCase() == "li") {
                    this.confing.lineColor = t.style.backgroundColor;
                    $('.js-border-color').removeClass('js-border-color');
                    $(t).addClass('js-border-color');
                }
            },
            //设置画笔大小  
            setBrushAction: function () {
                this.brushDiv.onclick = this.bind(this, this.setBrush);
            },
            setBrush: function (e) {
                var t = e.target;
                if (t.nodeName.toLowerCase() == "span") {
                    if (t.className.indexOf("small-brush") >= 0) {
                        this.confing.lineWidth = 1;
                    } else if (t.className.indexOf("middle-brush") >= 0) {
                        this.confing.lineWidth = 4;

                    } else if (t.className.indexOf("big-brush") >= 0) {
                        this.confing.lineWidth = 8;
                    }
                    $('.js-bg-color').removeClass('js-bg-color');
                    $(t).addClass('js-bg-color');
                }
            },

            //点击上一步-改变涂鸦当前状态  
            preClickStatus: function () {
                var pre = this.controlDiv.getElementsByTagName("span")[0];
                pre.onclick = this.bind(this, this.preClick);
            },
            preClick: function () {
                if (this.preDrawAry.length > 0) {
                    var popData = this.preDrawAry.pop();
                    var midData = this.middleAry[0];
                    this.nextDrawAry.push(midData);
                    this.context.putImageData(popData, 0, 0);
                }
                IsDraw(this.preDrawAry, this.middleAry, this.nextDrawAry)
            },
            //点击下一步-改变涂鸦当前状态  
            nextClickStatus: function () {
                var next = this.controlDiv.getElementsByTagName("span")[1];
                next.onclick = this.bind(this, this.nextClick);
            },
            nextClick: function () {
                if (this.nextDrawAry.length) {
                    var popData = this.nextDrawAry.pop();
                    var midData = this.middleAry[0];
                    this.preDrawAry.push(midData);
                    this.context.putImageData(popData, 0, 0);
                }
                IsDraw(this.preDrawAry, this.middleAry, this.nextDrawAry)
            },
            //清空  
            clearClickAction: function () {
                var clear = this.controlDiv.getElementsByTagName("span")[2];
                clear.onclick = this.bind(this, this.clearClick);
            },
            clearClick: function () {
                var data = this.middleAry[0];
                this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
                this.preDrawAry = [];
                this.nextDrawAry = [];
                this.middleAry = [this.middleAry[0]];
                this.controlDiv.getElementsByTagName("span")[0].className = "return-control";
                this.controlDiv.getElementsByTagName("span")[1].className = "next-control";
                this.controlDiv.getElementsByTagName("span")[2].className = "empty-control";
            },
            //生成图像  
            drawImageAction: function () {
                var btn = this.drawImageDiv.getElementsByTagName("button")[0];
                btn.onclick = this.bind(this, this.drawImage);
            },
            drawImage: function () {
                $(this.imgDiv).empty();
                var sizesum = opt.SizeSum;
                var url = this.canvas.toDataURL('image/png');
                this.ImageInit(url);
            },
            ImageInit: function (imageBase64) {
                var sizesum = opt.SizeSum;
                var $imgDiv = $(this.imgDiv);
                var imgs = "";
                var spans = "";
                for (var _s = 0, rate = 1; _s < sizesum; _s++, rate = rate * 2) {
                    var _h = parseInt(opt.Height / rate);
                    var _w = parseInt(opt.Width / rate);
                    imgs += '<td><img class="preview-img" style="width:' + _w + 'px;height:' + _h + 'px" ' + ((!!imageBase64 && imageBase64 != "") ? (' src="' + imageBase64 + '"') : '') + '/></td>';
                    spans += '<td><span>' + _w + " x " + _h + "(px)" + '</span></td>'
                }
                $imgDiv.html('<table class="form" style="margin-top: 20px;"><tr>' + imgs + '</tr><tr>' + spans + '</tr></table>');
            },

            bind: function (obj, handler) {
                return function () {
                    return handler.apply(obj, arguments);
                }
            }
        }
        new Canvas(canvas, colorDiv, brushDiv, controlDiv, drawImageDiv, imgDiv);
        // 点击按钮
        $('#canvasArea .close').click(function (event) {
            $('#canvasArea').hide();
        });
        //创建签名
        $('#canvasArea #createResult').click(function (event) {
            //允许
            opt.AfterSignName();
            $('#canvasArea').hide();
            //var signedVal = $("#imgDiv img").attr("src");
        });
        $('#btnDraw').click(function (event) {
            $('#canvasArea').show();
        });
        ////预览大小
        //$('.imgSize').click(function (event) {
        //    var height = opt.Height / $(this).attr("data-value");
        //    var width = opt.Width / $(this).attr("data-value");
        //    $("#imgDiv img").css("height", height);
        //    $("#imgDiv img").css("width", width);
        //});
    };
    $.fn.getSignName = function () {
        var $imgSign = $(this).find("img.preview-img");
        if (!!$imgSign && $imgSign.length > 0)
            return $imgSign.first().attr("src");
    };

    //Radio和Checkbox
    //Added by Cathy 2017-09-19 Begin
    $.fn.checkBox = function (opt) {
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        }
        var opt = $.extend({
            //字段
            id: "id",
            text: "text",
            title: "title",
            type: 'radio',//radio or checkbox
            url: null,
            //访问数据接口参数
            param: null,
            //下拉选择数据
            data: null,
            //数据名称
            dataName: false,
            //默认选中第一个
            selectOne: false,
            algin: 'left',
            //方法
            method: "GET"
        }, opt);
        var dom = {
            rendering: function () {
                var type = '';
                if (opt.type == "checkbox") {
                    type = 'multiple = "multiple"';
                }
                var optionHtml = ' <select class="ui-choose"  ' + type + '>';
                optionHtml += ' </select>';
                var $optionHtml = $(optionHtml);
                var selectOption = selectId + '-option';
                $optionHtml.attr('id', selectOption);
                $select.html($optionHtml);
                var $selectOption = $("#" + selectOption);
                return $selectOption;
            },
            renderingData: function ($option, setting, searchValue) {
                if (setting.data != undefined && setting.data.length >= 0) {
                    $.each(setting.data, function (i, row) {
                        var title = row[setting.title];
                        if (title == undefined) {
                            title = "";
                        }
                        $option.append('<option value="' + row[setting.id] + '" title="' + title + '">' + row[setting.text] + '</option>');
                    });
                    var choose = $option.ui_choose();
                    $select.find("ul").css("text-align", opt.algin);
                    if (setting.selectOne == false) {
                        $select.find("ul li").removeClass("selected");
                        $select.attr("data-value", "");
                    } else {
                        $select.find("ul li").eq(0).addClass("selected");
                        $select.attr("data-value", $select.find("ul li").eq(0).attr("data-value"));
                    }
                    choose.change = function (indexORvalue, item) {
                        var _value = '';
                        if (setting.type == "checkbox") {
                            for (var _i = 0; _i < indexORvalue.length; _i++) {
                                _value += indexORvalue[_i] + ",";
                            }
                        } else {
                            _value = indexORvalue;
                        }
                        if (_value != "" && setting.type == "checkbox") {
                            _value = _value.substr(0, _value.length - 1);
                        }
                        $select.attr("data-value", _value);
                    };
                }
            },
            loadData: function () {
                if (!!opt.url) {
                    opt.data = learun.ajax.asyncGet({
                        url: opt.url,
                        data: opt.param,
                        type: opt.method
                    });
                    if (!!opt.dataName && !!opt.data && opt.data.length > 0) {
                        opt.data = opt.data[opt.dataName];
                    }
                }
                else {
                    var $lilists = $select.find('li');
                    if ($lilists.length > 0) {
                        opt.data = [];
                        $lilists.each(function (e) {
                            var $li = $(this);
                            var point = {};
                            point[opt.id] = $li.attr('data-value');
                            point[opt.title] = $li.attr('title');
                            point[opt.text] = $li.html();
                            opt.data.push(point);
                        });
                    }
                }
            }
        };
        dom.loadData();
        var $option = dom.rendering();
        dom.renderingData($option, opt);
        return $select;
    };
    $.fn.checkBoxGetValue = function () {
        var $select = $(this);
        var value = $select.attr("data-value");
        if (!value)
            value = "";
        return value;
    };
    $.fn.checkBoxSetValue = function (value, isIgnoreCase) {
        var $select = $(this);
        var $option = $("#" + $select.attr('id') + "-option");
        var $setValue = $select.find("ul").find('[data-value="' + value + '"]');

        var _datavalue = $select.attr("data-value");
        var _selectvalue = $setValue.attr("data-value");
        if (!_datavalue) {
            _datavalue = "";
        }
        if (isIgnoreCase) {
            $select.attr('data-value', _datavalue.toLowerCase());
            $select.find('ul li').each(function () { $(this).attr("data-value", $(this).attr("data-value").toLowerCase()); })
            value = value.toLowerCase();
        }
        else {
            $select.attr('data-value', _datavalue);
        }

        var _index = learun.stringIndexOf(_datavalue, _selectvalue);
        if (_index == -1) {
            $setValue.addClass('selected');
            if (_datavalue != "") {
                _datavalue += "," + _selectvalue;
            } else {
                _datavalue += $setValue.attr("data-value");
            }
        }
        $select.attr('data-value', _datavalue);
        //var data_text = $option.find('ul').find('[data-value="' + value + '"]').html();
        //if (data_text) {
        //    $select.attr('data-text', data_text);
        //    var $selectText = $select.find('.ui-select-text')
        //    $selectText.attr('data-value', value).html(data_text);
        //    if ($select.attr('data-value') == $select.attr("default-desvalue") &&
        //        $select.attr("data-text") == $select.attr("default-description"))
        //        $selectText.css('color', '#999');
        //    else
        //        $selectText.css('color', '#000');
        //    $option.find('ul').find('[data-value="' + value + '"]').addClass('liactive')
        //}
        //$select.trigger("change");
        return $select;


    };
    //Added by Cathy 2017-09-19 end

    $.fn.select2Ex = function (opt) {//下拉框
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        }
        var opt = $.extend({
            builtInAjax: false,
            change: null,
            url: null,
            paramName: 'KeyWord',
            delay: 250,
            data: null,
            id: "id",
            text: "text",
            minimumInputLength: 0,
            multiple: false,
            separator: ',',
            //请选择
            allowShowDefault: true,
            description: "==请选择==",
            desvalue: "",
            placeholder: "==请选择==",
            param: {},
        }, opt);
        var textName = opt.text;
        var textId = opt.id;
        var paramName = opt.paramName;
        var selectFunction = function (element, callback) {   // 初始化时设置默认值
            var data = [];
            var elementVal = element.val();
            var elementJson = JSON.parse(elementVal);
            $(elementJson).each(function () {
                data.push({ id: this.id, text: this.text });
            });
            callback(data);
        };
        if (!opt.multiple) { //单选
            selectFunction = function (element, callback) {   // 初始化时设置默认值 
                var elementVal = element.val();
                var elementJson = JSON.parse(elementVal);
                callback(elementJson);
            };
        }
        var completeOpt = {
            placeholder: opt.placeholder,
            minimumInputLength: opt.minimumInputLength,
            multiple: opt.multiple,
            data: [],
            initSelection: selectFunction
        };
        if (!!opt.url) {
            if (opt.builtInAjax) {
                completeOpt.ajax = {
                    url: opt.url,
                    dataType: 'json',
                    delay: opt.delay,
                    cache: true,
                    data: function (params) {
                        //var stringParam = "{\"" + paramName + "\":\"" + params + "\"}";
                        //var jsonParam = JSON.parse(stringParam);
                        //opt.param.push(jsonParam);
                        opt.param[paramName] = params;
                        return opt.param;
                    },
                    results: function (data) {
                        //console.log(data);
                        var _result = [];
                        if (!!data) {
                            _result = $.map(data, function (value, key) {
                                return {
                                    id: value[textId], text: value[textName]
                                };
                            });
                        }
                        //if (opt.allowShowDefault) {
                        //    _result.unshift({ id: opt.desvalue, text: opt.description });
                        //}
                        return {
                            results: _result
                        };
                    }
                }
            } else {
                $.SetForm({
                    url: opt.url,
                    param: opt.param,
                    success: function (data) {
                        completeOpt.data = [];
                        if (opt.allowShowDefault) {
                            completeOpt.data.push({ id: opt.desvalue, text: opt.description });
                        }
                        $.each(data, function (key, value) {
                            completeOpt.data.push({
                                id: value[textId], text: value[textName]
                            })
                        })
                    },
                    failed: function (data) {
                        alert(data)
                    }
                })
            }
        }
        if (!!opt.data) {
            completeOpt.data = [];
            if (opt.allowShowDefault) {
                completeOpt.data.push({ id: opt.desvalue, text: opt.description });
            }
            $.each(opt.data, function (key, value) {
                completeOpt.data.push({
                    id: value[textId], text: value[textName]
                })
            })
            //completeOpt.data = opt.data;
        }
        $select.select2(completeOpt);
        $select.on("change", function (e) {
            console.log("change");
            if (!!opt.change) {
                opt.change(e.currentTarget);
            }
        });
    };
    $.fn.select2GetValue = function () {
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        }
        var data = $select.select2("val");
        var id = data;
        if (typeof (data) == Array) {
            id = data.join(",");
        }
        return id;
    };
    $.fn.select2SetValue = function (arrObj, isIgnoreCase) {
        var $select = $(this);
        var selectId = $select.attr('id');
        if (!selectId) {
            return false;
        }
        $select.select2("val", [JSON.stringify(arrObj)]);

    };


})(window.jQuery, window.learun);