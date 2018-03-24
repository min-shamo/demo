<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true"%>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <form>
        <script src="../js/publicurl.js"></script>
        <script src="js/plugins/charts/echarts.js" type="text/javascript"></script>
        <link rel="stylesheet" type="text/css" href="css/myhonorStyle.css" />
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
       <div style="height:0.88rem;background:#27a2c4;">
        <p id="title">奖惩详情</p>
    </div>
    <div class="main">
            <div style="background:#fff;height:1.26rem;clear:both">
                    <div class="headpic" style="margin-top:0.23rem;height:0.8rem;width:0.8rem;border-radius:50%;float:left;margin-left:0.24rem;">
                        <img style="width: 0.8rem; height: 0.8rem; border-radius: 50%" src="../MemberPic/<%=mUser.Pic %>">
                    </div>
                    <div class="name_id" style="display:inline-block;width:60%;margin-top:0.23rem;font-size:0.28rem;color:#333;margin-left:0.2rem;">
                        <span><%=mUser.UserName%>[<%=mUser.UserCode %>]</span>
                    </div>
                    <div class="duty" style="display:inline-block;width:60%;font-size:0.26rem;margin-top:0.05rem;color:#666;margin-left:0.2rem;">
                        <span><%=mUser.UserDuty%></span>
                    </div>
                </div>
        <div class="name">
            <span></span>
        </div>
        <div id="RandP_detail"></div>
        <span style="display: none" class="more">
            <span>更多</span>
            <img src="images/image_myhonor/icon_zhankai@2x.png">
        </span>
    </div>



    <script>
        //var thisurl = document.URL;
        //var lasturl = thisurl.split("?")[1];
        //var firstname = lasturl.split("=")[1];
        //firstname = firstname.split("OA")[0];
        var name = request("OA");
        var ID = request("id"); //页面人员工号
        var myID = '<%=us.UserCode %>';
        var myName = '<%=us.UserName%>';
        var myDuty = '<%=us.Duty%>';
        var YQid = 'YQ' + PadLeft(ID, 5);
        //var thisurl = document.URL;
        //var lasturl = thisurl.split("?")[1];
        //var firstname = lasturl.split("=")[1];
        //firstname = firstname.split("OA")[0];
        //var name = lasturl.split("=")[2];
        function PadLeft(num, n) {
            var len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        }
        $.ajax({
            url: "../ashx/SysAjaxInterface.ashx?DataType=RewardAndPunish&UserCode=" + YQid,
            //url: "http://ums.intretech.com/ums/ashx/SysAjaxInterface.ashx?DataType=RewardAndPunish&UserCode=" + 'YQ01919',
            type: "GET",
            cache: false,
            //data: { workcode: YQid },
            //返回的类型为XML
            dataType: 'JSON',
            // //由于不是json，这里传递的参数采用对象形式
            // data: {},
            success: function (result) {
                var data = result;
                var len = data.length;
                var obj = [];
                var R_array = [];
                var date = [];
                var P_times = 0;
                var R_times = 0;
                //var obj1=[];
                function RandP(name, img) {
                    var att = new Object();
                    att.name = name;
                    att.img = img;
                    return att;
                }
                obj.push(new RandP("集体大功", "jtdg"));
                obj.push(new RandP("集体小功", "jtxg"));
                obj.push(new RandP("集体嘉奖", "jtjj"));
                obj.push(new RandP("集体表扬", "jtby"));
                obj.push(new RandP("大功", "dg"));
                obj.push(new RandP("小功", "xg"));
                obj.push(new RandP("嘉奖", "jj"));
                obj.push(new RandP("表扬", "by"));
                obj.push(new RandP("集体大过", "jtdaguo"));
                obj.push(new RandP("集体小过", "jtxiaoguo"));
                obj.push(new RandP("集体申诫", "jtsj"));
                obj.push(new RandP("集体警告", "jtjg"));
                obj.push(new RandP("大过", "daguo"));
                obj.push(new RandP("小过", "xiaoguo"));
                obj.push(new RandP("申诫", "sj"));
                obj.push(new RandP("警告", "jg"));
                obj.push(new RandP("开除", "kc"));
                for (var i = 0; i < 17; i++) {
                    if (name == obj[i].img) {
                        name = obj[i].name;
                    }
                }
                data.sort(function (a, b) {
                    return parseInt(b['填写日期'].replace(/-/g, ''), 10) - parseInt(a['填写日期'].replace(/-/g, ''), 10);
                });
                for (var i = 0; i < len; i++) {
                    if (name == data[i]['奖惩类型']) {
                        R_array.push(data[i])
                        
                    }
                }
                for (var i = 0; i < R_array.length; i++) {
                    if (i == 0) {
                            $('#RandP_detail').append('<div><div class="info_show_first open"><div class="info_date"><span class="date"></span><span class="man"></span><span class="law"></span></div><div class="btn_show"><img src="images/image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png"></div></div><div class="detail_body"><div><span class="law_title">内容：</span><span class="law_info"></span></div><div class="reason"><div class="reason_title"><span>事由：</span></div><div class="reason_detail"><span></span></div></div></div></div>');

                        }
                        else {
                            $('#RandP_detail').append('<div><div class="info_show open"><div class="info_date"><span class="date"></span><span class="man"></span><span class="law"></span></div><div class="btn_show"><img src="images/image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png"></div></div><div class="detail_body"><div><span class="law_title">内容：</span><span class="law_info"></span></div><div class="reason"><div class="reason_title"><span>事由：</span></div><div class="reason_detail"><span></span></div></div></div></div>');

                        }
                    $('.date').eq(i).html(R_array[i]['填写日期']);
                    $('.law').eq(i).html('条例' + R_array[i]['依据条例']);
                    $('.law_info').eq(i).html(R_array[i]['条例内容']);
                    $('.reason_detail').eq(i).find('span').html(R_array[i]['奖惩提报事项描述']);
                    $('.man').eq(i).html(R_array[i]['提报人']);
                    // date[i] = R_array[i]['填写日期'].split("-");
                    // if (i == 0) {

                    // } else if (date[i][0] == date[i - 1][0]) {

                    // } else {

                    // }
                }
                $('.name').find('span').html(name + '（' + R_array.length + '）');
                $('#RandP_detail').append('<div class="clear"></div>');
                //var data = obj.DataTable['diffgr:diffgram'].NewDataSet.Table;
                // for (var i = 0; i < data.length; i++) {
                //     if (i == 0) {
                //         $('.main').append('<div><div class="info_show_first open"><div class="info_date"><span class="date"></span><span class="name_R"></span><span class="times"></span><span class="law"></span></div><div class="btn_show"><img src="./image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="./image_myhonor/icon_shouqi@2x.png"></div></div><div class="detail_body"><div><span class="law_title">内容：</span><span class="law_info"></span></div><div class="reason"><div class="reason_title"><span>事由：</span></div><div class="reason_detail"><span></span><span class="man"></span></div></div></div></div>');
                //     }
                //     else {
                //         $('.mian').append('<div><div class="info_show open"><div class="info_date"><span class="date"></span><span class="name_R"></span><span class="times"></span><span class="law"></span></div><div class="btn_show"><img src="./image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="./image_myhonor/icon_shouqi@2x.png"></div></div><div class="detail_body"><div><span class="law_title">内容：</span><span class="law_info"></span></div><div class="reason"><div class="reason_title"><span>事由：</span></div><div class="reason_detail"><span></span><span class="man"></span></div></div></div></div>');
                //     }
                // }
                // data.sort(function (a, b) {
                //     return parseInt(b['填写日期'].replace(/-/g, ''), 10) - parseInt(a['填写日期'].replace(/-/g, ''), 10);
                // });
                // var P_times = 0;
                // var R_times = 0;
                // for (var j = 0; j < data.length; j++) {
                //     $('.date').eq(j).html(data[j]['填写日期']);
                //     if (data[j]['奖惩类型'] == '集体申诫' || data[j]['奖惩类型'] == '集体警告' || data[j]['奖惩类型'] == '开除' || data[j]['奖惩类型'] == '大过' || data[j]['奖惩类型'] == '小过' || data[j]['奖惩类型'] == '集体大过' || data[j]['奖惩类型'] == '集体小过' || data[j]['奖惩类型'] == '警告' || data[j]['奖惩类型'] == '申诫') {
                //         $('.name_R').eq(j).addClass('name_P');
                //         $('.name_R').eq(j).html(data[j]['奖惩类型']);
                //         P_times++;
                //     }
                //     else {
                //         $('.name_R').eq(j).html(data[j]['奖惩类型']);
                //         R_times++;
                //     }
                //     $('.times').eq(j).html(data[j]['次数'] + '次');
                //     $('.law').eq(j).html(data[j]['依据条例']);
                //     $('.law_info').eq(j).html(data[j]['条例内容']);
                //     $('.reason_detail').eq(j).find('span').html(data[j]['奖惩提报事项描述']);
                //     $('.man').eq(j).html("提报人：" + data[j]['提报人']);
                // }

                // $('#RandP_title').children().eq(1).after('<div class="tips"><span class="counts2"></span></div>');
                // $('div#RandP_title .counts2').html('&nbsp;奖' + R_times + '&nbsp;惩' + P_times);
                // if (data.length <= 5) {
                //     $('div#RandP .more').remove();
                //     $('div#RandP').append('<div class="clear"></div>');
                // }
                //点击显示详情
                $('.open').on('click', function () {
                    var show = $(this).next('div.detail_body');
                    var reason = show.find('.reason');
                    if (show.css('display') == "none") {
                        show.show();
                        if (($(window).height() - (show.offset().top - $(document).scrollTop() + 30)) < show.height()) {
                            $(document).scrollTop($(window).scrollTop() + show.height() + reason.height() + 20);
                        }
                        $(this).find('.btn_show img').attr('src', 'images/image_myhonor/icon_shouqi@2x.png')
                    }
                    else {
                        show.hide();
                        $(this).find('.btn_show img').attr('src', 'images/image_myhonor/icon_zhankai@2x.png')
                    }
                })
                //  MoreClick();
                console.log(data);

                //}
                // Hide(2);
            },
            error: function (error, errorstate) {//未完成流程
                $('#RandP').find('span').eq(1).remove();
                $('#RandP').append('<div style="display:none" class="no_record"><span>暂无记录</span></div>');
                console.log(error);
            }

        });

    </script>
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
        </form>
</asp:Content>
