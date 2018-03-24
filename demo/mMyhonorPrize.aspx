<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <form>

        <script src="../js/publicurl.js"></script>
        <link rel="stylesheet" type="text/css" href="css/PrizeStyle.css" />
        <style>
            .wrapper {
                margin: 0;
            }
        </style>
        <%
            UMS.Common.UserSession us = UMS.Common.UserSession.CurrentUserSession(Session, Page);
            string usercode = us.UserCode;
            if (Request.QueryString["id"] != null)
            {
                usercode = Request.QueryString["id"].ToString();
            }
            UMS.BLL.T_User bllUser = new UMS.BLL.T_User();
            UMS.Model.T_User mUser = bllUser.GetUseByKey(usercode, 1);
        %>
        <div style="height: 0.88rem; background: #27a2c4;">
            <p id="title">护卫舰奖项详情</p>
        </div>
        <div>
            <div style="background: #fff; height: 1.26rem; clear: both">
                <div class="headpic" style="margin-top: 0.23rem; height: 0.8rem; width: 0.8rem; border-radius: 50%; float: left; margin-left: 0.24rem;">
                    <img style="width: 0.8rem; height: 0.8rem; border-radius: 50%" src="../MemberPic/<%=mUser.Pic %>">
                </div>
                <div class="name_id" style="display: inline-block; width: 60%; margin-top: 0.23rem; font-size: 0.28rem; color: #333; margin-left: 0.2rem;">
                    <span><%=mUser.UserName%>[<%=mUser.UserCode %>]</span>
                </div>
                <div class="duty" style="display: inline-block; width: 60%; font-size: 0.26rem; margin-top: 0.05rem; color: #666; margin-left: 0.2rem;">
                    <span><%=mUser.UserDuty%></span>
                </div>
            </div>

            <div class="content">
                <div class="name">
                    <span></span>
                </div>
                <div class="wrapper">
                    <!-- <hr class="line-left">
            <hr class="line-right"> -->
                    <div class="main">
                    </div>
                </div>
            </div>
        </div>
        <script>//自适应
            (function (doc, win) {
                var docEl = doc.documentElement,
                    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                    recalc = function () {
                        var clientWidth = docEl.clientWidth;
                        if (!clientWidth) return;
                        if (clientWidth >= 750) {
                            docEl.style.fontSize = '100px';
                        } else {
                            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
                        }
                    };

                if (!doc.addEventListener) return;
                win.addEventListener(resizeEvt, recalc, false);
                doc.addEventListener('DOMContentLoaded', recalc, false);
            })(document, window);
        </script>
        <script>
            // $(".main .year .list").each(function (e, target) {
            //     var $target=  $(target),
            //         $ul = $target.find("ul");
            //     $target.height($ul.outerHeight()), $ul.css("position", "absolute");
            // }); 
            //var thisurl = document.URL;
            //var lasturl = thisurl.split("?")[1];
            //var firstname = lasturl.split("=")[1];
            //firstname = firstname.split("prize")[0];
            var name = request("prize");
            var ID = request("id"); //页面人员工号
            //console.log(ID);
            var myID = '<%=us.UserCode %>'
            var YQid = 'YQ' + PadLeft(ID, 5);
            function PadLeft(num, n) {
                var len = num.toString().length;
                while (len < n) {
                    num = "0" + num;
                    len++;
                }
                return num;
            }
            
            //var YQid = 'YQ01919';
            //ID = check(YQid);
            function check(id) {
                for (var i = 1; i < YQid.length; i++) {
                    if (id[i] != '0' && id[i] != 'Q' && id[i] != 'Y') {
                        var ID = id.substring(i, 7);
                        return ID;
                        break;
                    }
                }
            }
          
                $.ajax({
                    type: "POST",
                    url: "http://ums.intretech.com/ums/ums_ashx/RewardPanelAjax.ashx?DataType=myHonor&usercode=" + ID,
                    cache: false,
                    error: function () {
                        if (window.console) {
                            window.console.log("程序出错");
                        }
                    },
                    dataType: "json",
                    success:
                        function (prizedata) {
                            var prize = prizedata;
                            var medal = [];
                            function date(year, month) {
                                var att = new Object();
                                att.month = month;
                                att.year = year;
                                return att;
                            }
                            var obj = [];
                            function reward(name, img) {
                                var att = new Object();
                                att.name = name;
                                att.img = img;
                                return att;
                            }
                            obj.push(new reward("最佳移动办公奖", "bangong"));
                            obj.push(new reward("最佳快速行动奖", "xingdong"));
                            obj.push(new reward("最佳ERP应用奖", "erp"));
                            obj.push(new reward("最佳OA应用奖", "oa"));
                            obj.push(new reward("最佳高效确认奖", "queren"));
                            obj.push(new reward("最佳文档输出奖", "wendang"));
                            obj.push(new reward("最佳会议纪要奖", "huiyi"));
                            obj.push(new reward("最佳信息化建议奖", "xinxihua"));
                            obj.push(new reward("最佳项目管理奖", "xiangmu"));
                            obj.push(new reward("最佳Jira得分奖", "jiradefen"));
                            obj.push(new reward("最佳JIRA评分奖", "jirapingfen"));
                            for (var i = 0; i < 11; i++) {
                                if (name == obj[i].img) {
                                    name = obj[i].name;
                                }
                            }
                            $('.name').find('span').html(name.toUpperCase());
                            for (var i = 0; i < prize.length; i++) {
                                var year = prize[i].Month.substring(0, 4);
                                var month = prize[i].Month.substring(5, 7);
                                for (var j = 0; j < prize[i].Result.length; j++) {
                                    if (name == prize[i].Result[j].RewardName)
                                        medal.push(new date(year, month));
                                }

                            }
                            var len = medal.length;
                            var PrizeHtml = "";
                            var count = 0;
                            for (var i = 0; i < len; i++) {
                                if (i == 0) {
                                    PrizeHtml += '<div class="year"><h2><a href="#">' + medal[i].year + '年<span></span></a></h2>';
                                    PrizeHtml += '<div class="list"><ul><li class="cls"><p class="date">' + medal[i].month + '月</p><p class="intro">获奖1次</p></li>';
                                } else if (medal[i].year == medal[i - 1].year) {
                                    PrizeHtml += '<li class="cls"><p class="date">' + medal[i].month + '月</p><p class="intro">获奖1次</p></li>';
                                } else {
                                    PrizeHtml += '</ul></div></div>'
                                    PrizeHtml += '<div class="year"><h2><a href="#">' + medal[i].year + '年<span></span></a></h2>';
                                    PrizeHtml += '<div class="list"><ul><li class="cls"><p class="date">' + medal[i].month + '月</p><p class="intro">获奖1次</p></li>';
                                }

                            }
                            PrizeHtml += '</ul></div></div>'
                            $('.main').append(PrizeHtml);
                            var how = [];
                            var lenYear = $('.main').find('.year').length;
                            for (var i = 0; i < lenYear; i++) {
                                how[i] = $('.year').eq(i).find('li').length;
                            }
                            //for (var i = 0; i < len; i++) {
                            //    if (len - 1 == 0) {
                            //        how.push(1);
                            //    }
                            //    else {
                            //        if (i == 0) {
                            //            count = 1;
                            //            if (medal[i].year != medal[i + 1].year) {
                            //                how.push(count);
                            //            }
                            //        } else if (i == len - 1 && medal[i].year == medal[i - 1].year) {
                            //            count++;
                            //            how.push(count);
                            //        } else if (medal[i].year != medal[i - 1].year && i == len - 1) {
                            //            count = 1;
                            //            how.push(count);            
                            //        }
                            //        else if (medal[i].year != medal[i - 1].year) {
                            //            count = 1;
                            //        }
                            //        else if (medal[i].year == medal[i - 1].year) {
                            //            count++;
                            //        }
                            //    }
                            //}
                            for (var i = 0; i < how.length; i++) {
                                $(".year").eq(i).find('span').html('（' + how[i] + '）')
                            }
                            console.log(prizedata);
                            $('.name').find('span').html(name + '（' + len + '）');
                            $(".main .year>h2").click(function (e) {
                                e.preventDefault();
                                if ($(this).next('.list').css('display') == 'none') {
                                    $(this).next('.list').show();
                                    $(this).css('background', 'url("images/image_myhonor/icon_sq.png")no-repeat 0rem 0rem');
                                    $(this).css('background-size', '0.35rem 0.35rem');
                                }
                                else {
                                    $(this).next('.list').hide();
                                    $(this).css('background', 'url("images/image_myhonor/icon_zk.png")no-repeat 0rem 0rem');
                                    $(this).css('background-size', '0.35rem 0.35rem');
                                }

                            });
                        }
                })
       
            // else if(firstname=="OA"){
            //     $(function () {
            //     $.ajax({
            //         //url: "../ashx/SysAjaxInterface.ashx?DataType=RewardAndPunish&UserCode=" + YQid,
            //         url: "http://ums.intretech.com/ums/ashx/SysAjaxInterface.ashx?DataType=RewardAndPunish&UserCode=" + YQid,
            //         type: "GET",
            //         cache: false,
            //         //data: { workcode: YQid },
            //         //返回的类型为XML
            //         dataType: 'JSON',
            //         // //由于不是json，这里传递的参数采用对象形式
            //         // data: {},
            //         success: function (result) {
            //             var data = result;
            //             var len = data.length;
            //             var obj = [];
            //             var R_array=[];
            //             var date=[];
            //             var P_times = 0;
            //             var R_times = 0;
            //             //var obj1=[];
            //             function RandP(name, img) {
            //                 var att = new Object();
            //                 att.name = name;
            //                 att.img = img;
            //                 return att;
            //             }
            //             obj.push(new RandP("集体大功", "jtdg"));
            //             obj.push(new RandP("集体小功", "jtxg"));
            //             obj.push(new RandP("集体嘉奖", "jtjj"));
            //             obj.push(new RandP("集体表扬", "jtby"));
            //             obj.push(new RandP("大功", "dg"));
            //             obj.push(new RandP("小功", "xg"));
            //             obj.push(new RandP("嘉奖", "jj"));
            //             obj.push(new RandP("表扬", "by"));
            //             obj.push(new RandP("集体大过", "jtdaguo"));
            //             obj.push(new RandP("集体小过", "jtxiaoguo"));
            //             obj.push(new RandP("集体申诫", "jtsj"));
            //             obj.push(new RandP("集体警告", "jtjg"));
            //             obj.push(new RandP("大过", "daguo"));
            //             obj.push(new RandP("小过", "xiaoguo"));
            //             obj.push(new RandP("申诫", "sj"));
            //             obj.push(new RandP("警告", "jg"));
            //             obj.push(new RandP("开除", "kc"));
            //             for(var i=0;i<17;i++)
            //             {
            //                 if(name==obj[i].img)
            //                 {
            //                     name=obj[i].name;
            //                 }
            //             }
            //             data.sort(function (a, b) {
            //                 return parseInt(b['填写日期'].replace(/-/g, ''), 10) - parseInt(a['填写日期'].replace(/-/g, ''), 10);
            //             });
            //             for(var i=0;i<len;i++)
            //             {
            //                 if(name==data[i]['奖惩类型'])
            //                 {
            //                     R_array.push(data[i])
            //                 }
            //             }
            //             for(var i=0;i<R_array.length;i++){
            //                 date[i]=R_array[i]['填写日期'].split("-");
            //                 if(i==0){

            //                 }else if(date[i][0]==date[i-1][0])
            //                 {

            //                 }else{

            //                 }
            //             }
            //             // for (var i = 0; i < 17; i++) {
            //             //     for (var j = 0; j < len; j++) {
            //             //         if (obj[i].name == data[j]['奖惩类型']) {
            //             //             obj[i].count++;
            //             //         }
            //             //     }
            //             //     if (obj[i].count > 0 && i < 8) {
            //             //         $('.R_list').append('<li><div style="position:relative;"><div class="count">' + obj[i].count + '</div><img src="./image_myhonor/icon_' + obj[i].img + '.png"><span class="R_name">'+obj[i].name+'</span></div></li>');
            //             //         R_times+=obj[i].count;
            //             //     }
            //             //     else if (obj[i].count > 0 && i >= 8) {
            //             //         $('.p_list').append('<li><div style="position:relative;"><div class="count">' + obj[i].count + '</div><img src="./image_myhonor/icon_' + obj[i].img + '.png"><span class="P_name">'+obj[i].name+'</span></div></li>');
            //             //         P_times+=obj[i].count;
            //             //     }
            //             // }
            //             //var obj = $(result).toObject().get(0);//xml转json
            //             //if (obj.DataTable['diffgr:diffgram'] == '') {
            //             // if (!result || data.length == 0) {
            //             //     $('#RandP').find('span').eq(1).remove();
            //             //     $('#RandP').append('<div style="display:none" class="no_record"><span>暂无记录</span></div>');
            //             // }
            //             // else {
            //             //  var data = obj.DataTable['diffgr:diffgram'].NewDataSet.Table;
            //             // for (var i = 0; i < data.length; i++) {
            //             //     if (i == 0) {
            //             //         $('#RandP_title').next().append('<div><div class="info_show_first open"><div class="info_date"><span class="date"></span><span class="name_R"></span><span class="times"></span><span class="law"></span></div><div class="btn_show"><img src="./image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="./image_myhonor/icon_shouqi@2x.png"></div></div><div class="detail_body"><p class="law_info"></p><div class="reason"><div class="reason_title"><span>事由：</span></div><div class="reason_detail"><span></span><span class="man"></span></div></div></div></div>');
            //             //     }
            //             //     else {
            //             //         $('#RandP_title').next().append('<div><div class="info_show open"><div class="info_date"><span class="date"></span><span class="name_R"></span><span class="times"></span><span class="law"></span></div><div class="btn_show"><img src="./image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="./image_myhonor/icon_shouqi@2x.png"></div></div><div class="detail_body"><p class="law_info"></p><div class="reason"><div class="reason_title"><span>事由：</span></div><div class="reason_detail"><span></span><span class="man"></span></div></div></div></div>');
            //             //     }
            //             // }
            //             // data.sort(function (a, b) {
            //             //     return parseInt(b['填写日期'].replace(/-/g, ''), 10) - parseInt(a['填写日期'].replace(/-/g, ''), 10);
            //             // });
            //             // var P_times = 0;
            //             // var R_times = 0;
            //             // for (var j = 0; j < data.length; j++) {
            //             //     $('.date').eq(j).html(data[j]['填写日期']);
            //             //     if (data[j]['奖惩类型'] == '集体申诫' || data[j]['奖惩类型'] == '集体警告' || data[j]['奖惩类型'] == '开除' || data[j]['奖惩类型'] == '大过' || data[j]['奖惩类型'] == '小过' || data[j]['奖惩类型'] == '集体大过' || data[j]['奖惩类型'] == '集体小过' || data[j]['奖惩类型'] == '警告' || data[j]['奖惩类型'] == '申诫') {
            //             //         $('.name_R').eq(j).addClass('name_P');
            //             //         $('.name_R').eq(j).html(data[j]['奖惩类型']);
            //             //         P_times++;
            //             //     }
            //             //     else {
            //             //         $('.name_R').eq(j).html(data[j]['奖惩类型']);
            //             //         R_times++;
            //             //     }
            //             //     $('.times').eq(j).html(data[j]['次数'] + '次');
            //             //     $('.law').eq(j).html(data[j]['依据条例']);
            //             //     $('.law_info').eq(j).html("条例内容：" + data[j]['条例内容']);
            //             //     $('.reason_detail').eq(j).find('span').html(data[j]['奖惩提报事项描述']);
            //             //     $('.man').eq(j).html("提报人：" + data[j]['提报人']);
            //             // }

            //             // $('#RandP_title').children().eq(1).after('<div class="tips"><span class="counts2" onclick=window.open("OAdetail.html")></span></div>');
            //             // $('div#RandP_title .counts2').html('&nbsp;奖' + R_times + '&nbsp;惩' + P_times);
            //             // if (data.length <= 5) {
            //             //     $('div#RandP .more').remove();
            //             //     $('div#RandP').append('<div class="clear"></div>');
            //             // }
            //             //点击显示详情
            //             // $('.open').on('click', function () {
            //             //     var show = $(this).next('div.detail_body');
            //             //     var reason = show.find('.reason');
            //             //     if (show.css('display') == "none") {
            //             //         show.show();
            //             //         if (($(window).height() - (show.offset().top - $(document).scrollTop() + 30)) < show.height()) {
            //             //             $(document).scrollTop($(window).scrollTop() + show.height() + reason.height() + 20);
            //             //         }
            //             //         $(this).find('.btn_show img').attr('src', './image_myhonor/icon_shouqi@2x.png')
            //             //     }
            //             //     else {
            //             //         show.hide();
            //             //         $(this).find('.btn_show img').attr('src', './image_myhonor/icon_zhankai@2x.png')
            //             //     }
            //             // })
            //             //  MoreClick();
            //             console.log(data);
            //             // }
            //             // Hide(2);
            //         },
            //         error: function (error, errorstate) {//未完成流程
            //             $('#RandP').find('span').eq(1).remove();
            //             $('#RandP').append('<div style="display:none" class="no_record"><span>暂无记录</span></div>');
            //             console.log(error);
            //         }

            //     });
            // })
            // }



        </script>
    </form>
</asp:Content>
