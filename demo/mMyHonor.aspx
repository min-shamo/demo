<%@ Page Title="" Language="C#" MasterPageFile="~/M/Mobile.Master" AutoEventWireup="true" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <form id="form1" runat="server">
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
            if (Request.QueryString["UserCode"] != null)
            {
                usercode = Request.QueryString["UserCode"].ToString();
            }
            UMS.BLL.T_User bllUser = new UMS.BLL.T_User();
            UMS.Model.T_User mUser = bllUser.GetUseByKey(usercode, 1);
        %>
       <div class="main">
        <div class="topPart">
            <%--<div>
                <p id="title">点亮荣耀</p>
            </div>--%>
            <div id="account">
                <div>
                    <div id="head_sculpture">
                        <img style="width: 1rem; height: 1rem; border-radius: 50%" src="../MemberPic/<%=mUser.Pic %>">
                    </div>
                    <span class="item">
                        <span>得分等级</span>
                        <img src="images/image_myhonor/icon_xing01@2x.png">
                    </span>
                    <span class="item2">
                        <span>评分等级</span>
                        <img src="images/image_myhonor/icon_xing01@2x.png">
                    </span>
                </div>
                <div class="no">
                    <div class="score score1">
                        <p class="proportion1">得分</p>
                        <p class="proportion2">-/-</p>
                        <p class="proportion3">（30天/所有）</p>
                    </div>
                    <div class="score score1">
                        <p class="proportion1">排名</p>
                        <p class="proportion2">-/-</p>
                        <p class="proportion3">（部门/公司）</p>
                    </div>
                    <div class="score">
                        <p class="proportion1">评分</p>
                        <p class="proportion2">-/-</p>
                        <p class="proportion3">（30天/所有）</p>
                    </div>
                </div>
            </div>
        </div>
        <div id="prize_main" style="clear: both;">
            <div id="prize_title">
                <img class="title_img" src="images/image_myhonor/icon_huweijian_01@2x.png">
                <span class="titles">护卫舰奖项</span>
            </div>
            <div id="prize_body">
                <ul class="prize_list">
                </ul>
            </div>
            <!-- <div style="display: none"></div> -->
            <!-- <span style="display: none" class="more">
                <span>更多</span>
                <img src="images/image_myhonor/icon_zhankai@2x.png">
            </span> -->
        </div>
        <div id="RandP">
            <div id="RandP_title">
                <img class="title_img" src="images/image_myhonor/icon_jiangcheng_01@2x.png">
                <span class="titles">奖惩</span>
            </div>
            <div id="RandP_body">
                <ul class="RandP_list">
                </ul>

            </div>
            <!-- <div style="display: none"></div> -->
            <!-- <span style="display: none" class="more">
                <span>更多</span>
                <img src="images/image_myhonor/icon_zhankai@2x.png">
            </span> -->
        </div>
        <div id="improve" style="margin-top: 0.2rem">
            <div id="improve_title">
                <img class="title_img" src="images/image_myhonor/icon_gsjy_01@2x.png">
                <span class="titles">改善提案</span>
            </div>
            <div></div>
            <span class="more">
                <span>更多</span>
                <img src="images/image_myhonor/icon_zhankai@2x.png">
            </span>
        </div>
        <div id="process" style="margin-top: 0.2rem">
            <div id="process_title">
                <img class="title_img" src="images/image_myhonor/icon_pingfen_01@2x.png">
                <span class="titles">流程评分</span>
            </div>
            <!--<div>
            <div class="process_show_first open">
                <div class="process_date">
                    <span class="pro_date"></span>
                    <span class="process_score"></span>
                    <span class="ssgs"></span>
                </div>
                <div class="process_btn_show">
                    <img src="images/image_myhonor/icon_zhankai@2x.png">
                    <img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png">
                </div>
            </div>
            <div class="process_detail_body">
                <div class="process_detail">
                    <div class="process_detail_title">
                        <span>改善方案：</span>
                    </div>
                    <div class="process_details">
                        <span></span>
                        <span class="process_man"></span>
                    </div>
                </div>
            </div>
        </div>-->
            <div></div>
            <span class="more">
                <span>更多</span>
                <img src="images/image_myhonor/icon_zhankai@2x.png">
            </span>
        </div>
        <div class="table" style="margin-top: 0.2rem">
            <div id="table_title">
                <img class="title_img" src="images/image_myhonor/icon_xiangmu_01@2x.png">
                <span class="titles">项目情况</span>
            </div>
            <div id="table">
            </div>
        </div>
    </div>
    <script>
        //工号判断
        var ID = '<%=usercode%>'; //页面人员工号
        var myID = '<%=us.UserCode %>'
        var YQid = 'YQ' + PadLeft(ID, 5);
        //var YQid = 'YQ01919';
        //ID = check(YQid);
        var AttArray = [];
        var isatt;
        var attid;

        // $.ajax({
        //     type: "GET",
        //     url: "../ashx/MyHonor.ashx?MethodType=GetSelfAttention&UserCode=" + ID,
        //     cache: false,
        //     error: function () {
        //         if (window.console) {
        //             window.console.log("程序出错");
        //         }
        //     },
        //     dataType: "json",
        //     success: function (attentiondata) {
        //         var attentioned = attentiondata;
        //         for (var i = 0; i < attentioned.length; i++) {
        //             AttArray.push(new attention(attentioned[i].ObjectId, 1));
        //         }

        //     }
        // })
        $(function () {
            MoreClick();
            //Open();
            // if (myID == ID) {
            //     Opened();
            // } else {
            //     OpenedNoSubmit();
            // }
        })
        // function attention(objid, actiontype) {
        //     var att = new Object();
        //     att.objid = objid;
        //     att.actiontype = actiontype;
        //     return att;
        // }
        function check(id) {
            for (var i = 1; i < YQid.length; i++) {
                if (id[i] != '0' && id[i] != 'Q' && id[i] != 'Y') {
                    var ID = id.substring(i, 7);
                    return ID;
                    break;
                }
            }
        }
        function PadLeft(num, n) {
            var len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
            return num;
        }
        function MoreClick() {
            //点击查看更多
            $(document).on('click', '.more', function () {
                var moretext = $(this).find("span");
                var moreicon = $(this).find("img");
                if (moretext.text() == "更多") {
                    moretext.text('收起');
                    moreicon.attr('src', 'images/image_myhonor/icon_shouqi@2x.png');
                    if ($(this).parent().is('#prize_main')) {
                        $(this).siblings().eq(1).children().eq(2).nextAll('div').show();
                    }
                    else {
                        $(this).siblings().eq(1).children().eq(4).nextAll('div').show();
                    }
                }
                else {
                    moretext.text('更多');
                    moreicon.attr('src', 'images/image_myhonor/icon_zhankai@2x.png');
                    if ($(this).parent().is('#prize_main')) {
                        $(this).siblings().eq(1).children().eq(2).nextAll('div').hide();
                    }
                    else {
                        $(this).siblings().eq(1).children().eq(4).nextAll('div').hide();
                    }
                }
            })
        }
        // function Open() {

        //     $(document).on('click', '.tips', function () {
        //         var Openmore = $(this).parent()
        //         if (Openmore.nextAll().css('display') == 'none') {
        //             $(this).find('span').css('color', '#f15a4a');
        //             Openmore.nextAll().show();
        //             switch (Openmore.attr('id')) {
        //                 case 'prize_title': Openmore.next().children().eq(2).nextAll('div').hide();
        //                     break;
        //                 case 'table_title': break;
        //                 default: Openmore.next().children().eq(4).nextAll('div').hide();
        //             }
        //         }
        //         else if (Openmore.find('.titles').css('color') != 'rgb(241, 90, 74)') {
        //             Openmore.nextAll().hide();
        //             Openmore.siblings('.more').find('span').html('更多');
        //             Openmore.siblings('.more').find('img').attr('src', 'images/image_myhonor/icon_zhankai@2x.png');
        //             $(this).find('span').css('color', '#999');
        //         }
        //     })
        // }
        // function Opened() {

        //     $(document).on('click', '.titles , .title_img', function () {
        //         var Opened = $(this).parent();
        //         if (Opened.nextAll().css('display') == 'none') {
        //             Opened.find('.titles').css('color', '#f15a4a');
        //             Opened.nextAll().show();
        //             switch (Opened.attr('id')) {
        //                 case 'prize_title': Opened.next().children().eq(2).nextAll('div').hide();
        //                     Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH_HGwkJA_36_36.png');
        //                     attid = 1;
        //                     isatt = 1;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //                 case 'table_title': Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH608IkJA_36_36.png');
        //                     attid = 5;
        //                     isatt = 1;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //                 case 'RandP_title': Opened.next().children().eq(4).nextAll('div').hide();
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_jiangcheng_01@2x.png');
        //                     attid = 2;
        //                     isatt = 1;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //                 case 'improve_title': Opened.next().children().eq(4).nextAll('div').hide();
        //                     Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH5VYIkJA_36_36.png');
        //                     attid = 3;
        //                     isatt = 1;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //                 case 'process_title': Opened.next().children().eq(4).nextAll('div').hide();
        //                     Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH6k1okJA_36_36.png');
        //                     attid = 4;
        //                     isatt = 1;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //             }
        //         }
        //         else {
        //             Opened.nextAll().hide();
        //             Opened.find('.counts2').css('color', '#999');
        //             Opened.find('.titles').css('color', '#000');
        //             Opened.siblings('.more').find('span').html('更多');
        //             Opened.siblings('.more').find('img').attr('src', 'images/image_myhonor/icon_zhankai@2x.png');
        //             switch (Opened.attr('id')) {
        //                 case 'prize_title':
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_huweijian_01@2x.png');
        //                     attid = 1;
        //                     isatt = 2;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //                 case 'table_title': Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH6V6YkJA_36_36.png');
        //                     attid = 5;
        //                     isatt = 2;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //                 case 'RandP_title':
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_jiangcheng_02@2x.png');
        //                     attid = 2;
        //                     isatt = 2;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //                 case 'improve_title':
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_gsjy_01@2x.png');
        //                     attid = 3;
        //                     isatt = 2;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //                 case 'process_title':
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_pingfen_01@2x.png');
        //                     attid = 4;
        //                     isatt = 2;
        //                     $.ajax({
        //                         type: "POST",
        //                         url: "../ashx/MyHonor.ashx?MethodType=SetSelfAttention&UserCode=" + ID + "&ObjectId=" + attid + "&ActionType=" + isatt,
        //                     });
        //                     break;
        //             }
        //             $(this).css('color', '#000');
        //         }
        //     })
        // }
        // function OpenedNoSubmit() {
        //     $(document).on('click', '.titles , .title_img', function () {
        //         var Opened = $(this).parent();
        //         if (Opened.nextAll().css('display') == 'none') {
        //             Opened.find('.titles').css('color', '#f15a4a');
        //             Opened.nextAll().show();
        //             switch (Opened.attr('id')) {
        //                 case 'prize_title': Opened.next().children().eq(2).nextAll('div').hide();
        //                     Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH_HGwkJA_36_36.png');
        //                     break;
        //                 case 'table_title': Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH608IkJA_36_36.png');
        //                     break;
        //                 case 'RandP_title': Opened.next().children().eq(4).nextAll('div').hide();
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_jiangcheng_01@2x.png');
        //                     break;
        //                 case 'improve_title': Opened.next().children().eq(4).nextAll('div').hide();
        //                     Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH5VYIkJA_36_36.png');
        //                     break;
        //                 case 'process_title': Opened.next().children().eq(4).nextAll('div').hide();
        //                     Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH6k1okJA_36_36.png');
        //                     break;
        //             }
        //         }
        //         else {
        //             Opened.nextAll().hide();
        //             Opened.find('.counts2').css('color', '#999');
        //             Opened.find('.titles').css('color', '#000');
        //             Opened.siblings('.more').find('span').html('更多');
        //             Opened.siblings('.more').find('img').attr('src', 'images/image_myhonor/icon_zhankai@2x.png');
        //             switch (Opened.attr('id')) {
        //                 case 'prize_title':
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_huweijian_01@2x.png');
        //                     break;
        //                 case 'table_title': Opened.find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH6V6YkJA_36_36.png');
        //                     break;
        //                 case 'RandP_title':
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_jiangcheng_02@2x.png');
        //                     break;
        //                 case 'improve_title':
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_gsjy_01@2x.png');
        //                     break;
        //                 case 'process_title':
        //                     Opened.find('img').attr('src', 'images/image_myhonor/icon_pingfen_01@2x.png');
        //                     break;
        //             }
        //             $(this).css('color', '#000');
        //         }
        //     })
        // }
        // function Hide(type) {
        //     for (var i = 0; i < AttArray.length; i++) {
        //         if (AttArray[i].actiontype == 1) {
        //             if (AttArray[i].objid == 1 && type == 1) {
        //                 $('#prize_title').nextAll().show();
        //                 $('div#prize_title .titles').css('color', '#f15a4a');
        //                 $('#prize_title').find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH_HGwkJA_36_36.png');
        //                 $('#prize_title').next().children().eq(2).nextAll('div').hide();
        //             } else if (AttArray[i].objid == 2 && type == 2) {
        //                 $('#RandP_title').nextAll().show();
        //                 $('div#RandP_title .titles').css('color', '#f15a4a');
        //                 $('#RandP_title').find('img').attr('src', 'images/image_myhonor/icon_jiangcheng_01@2x.png');
        //                 $('#RandP_title').next().children().eq(4).nextAll('div').hide();
        //             } else if (AttArray[i].objid == 3 && type == 3) {
        //                 $('#improve_title').nextAll().show();
        //                 $('div#improve_title .titles').css('color', '#f15a4a');
        //                 $('#improve_title').find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH5VYIkJA_36_36.png');
        //                 $('#improve_title').next().children().eq(4).nextAll('div').hide();
        //             } else if (AttArray[i].objid == 4 && type == 4) {
        //                 $('#process_title').nextAll().show();
        //                 $('div#process_title .titles').css('color', '#f15a4a');
        //                 $('#process_title').find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH6k1okJA_36_36.png');
        //                 $('#process_title').next().children().eq(4).nextAll('div').hide();
        //             } else if (AttArray[i].objid == 5 && type == 5) {
        //                 $('#table_title').nextAll().show();
        //                 $('div#table_title .titles').css('color', '#f15a4a');
        //                 $('#table_title').find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH608IkJA_36_36.png');
        //             }
        //             //switch (AttArray[i].objid) {
        //             //    case '1': $('#prize_title').nextAll().show();
        //             //        $('div#prize_title .titles').css('color', '#f15a4a');
        //             //        $('#prize_title').find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH_HGwkJA_36_36.png');
        //             //        $('#prize_title').next().children().eq(2).nextAll('div').hide();
        //             //        break;
        //             //    case '2': $('#RandP_title').nextAll().show();
        //             //        $('div#RandP_title .titles').css('color', '#f15a4a');
        //             //        $('#RandP_title').find('img').attr('src', 'images/image_myhonor/icon_jiangcheng_01@2x.png');
        //             //        $('#RandP_title').next().children().eq(4).nextAll('div').hide();
        //             //        break;
        //             //    case '3': $('#improve_title').nextAll().show();
        //             //        $('div#improve_title .titles').css('color', '#f15a4a');
        //             //        $('#improve_title').find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH5VYIkJA_36_36.png');
        //             //        $('#improve_title').next().children().eq(4).nextAll('div').hide();
        //             //        break;
        //             //    case '4': $('#process_title').nextAll().show();
        //             //        $('div#process_title .titles').css('color', '#f15a4a');
        //             //        $('#process_title').find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH6k1okJA_36_36.png');
        //             //        $('#process_title').next().children().eq(4).nextAll('div').hide();
        //             //        break;
        //             //    case '5': $('#table').show();
        //             //        $('div#table_title .titles').css('color', '#f15a4a');
        //             //        $('#table_title').find('img').attr('src', 'images/image_myhonor/lALPBbCc1UH608IkJA_36_36.png');
        //             //        break;
        //             //}
        //         }
        //     }
        // }
        //ajax-图表
        $.ajax({
            type: "POST",
            url: "../ashx/JiraPersonalBoard.ashx?DataType=honourBoard&username=" + ID,
            //url: "http://ums.intretech.com/ums/ashx/JiraPersonalBoard.ashx?DataType=honourBoard&username=" + ID,
            cache: false,
            error: function () {
                if (window.console) {
                    window.console.log("程序出错");
                }
            },
            dataType: "json",
            success: function (data) {
                var myhonordata = data.projectList;
                $("#table").css("height", myhonordata.length * 25 + 100 + "px");
                console.log(myhonordata)
                var pname = [];
                var issueNum = [];
                var score = [];
                var ANum = [];
                var AScore = [];
                var BNum = [];
                var BScore = [];
                var CNum = [];
                var CScore = [];
                var DNum = [];
                var DScore = [];
                var ENum = [];
                var EScore = [];
                if (myhonordata.length == 0) {
                    $('#table').remove();
                    $('.table').append('<div style="display:none" class="no_record"><span>暂无记录</span></div>');
                } else {
                    for (var i = 0; i < myhonordata.length; i++) {
                        pname.push(myhonordata[i].pname);
                        issueNum.push(myhonordata[i].issueNum);
                        score.push(myhonordata[i].score);
                        ANum.push(myhonordata[i].ANum);
                        AScore.push(myhonordata[i].AScore);
                        BNum.push(myhonordata[i].BNum);
                        BScore.push(myhonordata[i].BScore);
                        CNum.push(myhonordata[i].CNum);
                        CScore.push(myhonordata[i].CScore);
                        DNum.push(myhonordata[i].DNum);
                        DScore.push(myhonordata[i].DScore);
                        ENum.push(myhonordata[i].ENum);
                        EScore.push(myhonordata[i].EScore);
                    }
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('table'));
                    // 指定图表的配置项和数据
                    var option = {
                        color: ['#ffedb2', '#ffdd56', '#ffbc48', '#ff8356', '#ff5b45'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            },
                            textStyle: {
                                fontSize: 12
                            },
                            formatter: function (params) {
                                var texts = "";
                                for (var j = 0; j < myhonordata.length; j++) {
                                    for (var i = params.length - 1; i >= 0; i--) {
                                        //texts += params[i].color + params[i].seriesName + ": " + params[i].value + '/' + '40' + "<br>";
                                        if (pname[j] == params[i].name) {
                                            if (i == params.length - 1) {
                                                texts += params[i].name + '(' + score[j] + '/' + issueNum[j] + ')' + "<br>";
                                            }
                                            switch (params[i].seriesName) {
                                                case '非常满意':
                                                    texts += "<span class='chart_point' style='background-color:" + params[i].color + "'></span>" + params[i].seriesName + ": " + params[i].value + '/' + ANum[j] + "<br>"; break;
                                                case '比较满意':
                                                    texts += "<span class='chart_point' style='background-color:" + params[i].color + "'></span>" + params[i].seriesName + ": " + params[i].value + '/' + BNum[j] + "<br>"; break;
                                                case '基本满意':
                                                    texts += "<span class='chart_point' style='background-color:" + params[i].color + "'></span>" + params[i].seriesName + ": " + params[i].value + '/' + CNum[j] + "<br>"; break;
                                                case '不太满意':
                                                    texts += "<span class='chart_point' style='background-color:" + params[i].color + "'></span>" + params[i].seriesName + ": " + params[i].value + '/' + DNum[j] + "<br>"; break;
                                                case '很不满意':
                                                    texts += "<span class='chart_point' style='background-color:" + params[i].color + "'></span>" + params[i].seriesName + ": " + params[i].value + '/' + ENum[j] + "<br>"; break;
                                            }
                                        }
                                        // texts += "<span class='chart_point' style='background-color:" + params[i].color + "'></span>" + params[i].seriesName + ": " + params[i].value + '/' + ANum[i] + "<br>";
                                    }
                                }
                                return texts;
                            }
                        },
                        legend: {
                            data: [
                                {
                                    name: '非常满意',
                                    icon: 'rectangle'
                                },
                                {
                                    name: '比较满意',
                                    icon: 'rectangle'
                                },
                                {
                                    name: '基本满意',
                                    icon: 'rectangle'
                                },
                                {
                                    name: '不太满意',
                                    icon: 'rectangle'
                                },
                                {
                                    name: '很不满意',
                                    icon: 'rectangle'
                                },
                            ],
                            bottom: 20,
                            itemHeight: 10,
                            itemWidth: 10,
                            itemGap: 5,
                            textStyle: {
                                fontSize: 10,
                                color: '#666'
                            },
                        },
                        grid: {
                            containLabel: true,
                            top: 20,
                            left: 20,
                            right: 20,
                            bottom: 40,
                        },
                        xAxis: {
                            show: false,
                        },
                        yAxis: {
                            axisTick: {
                                show: false
                            },
                            type: 'category',
                            axisLabel: {
                                formatter: function (val) {
                                    if (val.length > 7) {
                                        return val.substring(0, 7) + "...";
                                    }
                                    else {
                                        return val;
                                    }
                                },
                                textStyle: {
                                    fontSize: 12,
                                    color: '#000'
                                },
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#cccccc'
                                }
                            },
                            data: pname,
                            nameGap: 8
                        },
                        series: [
                            {
                                name: '很不满意',
                                type: 'bar',
                                stack: '总量',
                                barWidth: '50%',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'insideRight'
                                    }
                                },
                                data: EScore
                            },
                            {
                                name: '不太满意',
                                type: 'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'insideRight'
                                    }
                                },
                                data: DScore
                            },
                            {
                                name: '基本满意',
                                type: 'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'insideRight'
                                    }
                                },
                                data: CScore
                            },
                            {
                                name: '比较满意',
                                type: 'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'insideRight'
                                    }
                                },
                                data: BScore
                            },
                            {
                                name: '非常满意',
                                type: 'bar',
                                stack: '总量',
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'insideRight'
                                    }
                                },
                                data: AScore
                            }
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    window.onresize = myChart.resize;
                    $('#table_title').children().eq(1).after('<div class="tips"><span class="counts2"></span></div>');
                    $('div#table_title .counts2').html(myhonordata.length);
                }
                //Hide(5);
            }

        });
        //xml转json
        $.fn.toObject = function () {
            if (this == null) return null;
            var retObj = new Object;
            buildObjectNode(retObj,/*jQuery*/this.get(0));
            return $(retObj);
            function buildObjectNode(cycleOBJ,/*Element*/elNode) {
                /*NamedNodeMap*/
                var nodeAttr = elNode.attributes;
                if (nodeAttr != null) {
                    if (nodeAttr.length && cycleOBJ == null) cycleOBJ = new Object;
                    for (var i = 0; i < nodeAttr.length; i++) {
                        cycleOBJ[nodeAttr[i].name] = nodeAttr[i].value;
                    }
                }
                var nodeText = "text";
                if (elNode.text == null) nodeText = "textContent";
                /*NodeList*/
                var nodeChilds = elNode.childNodes;
                if (nodeChilds != null) {
                    if (nodeChilds.length && cycleOBJ == null) cycleOBJ = new Object;
                    for (var i = 0; i < nodeChilds.length; i++) {
                        if (nodeChilds[i].tagName != null) {
                            if (nodeChilds[i].childNodes[0] != null && nodeChilds[i].childNodes.length <= 1 && (nodeChilds[i].childNodes[0].nodeType == 3 || nodeChilds[i].childNodes[0].nodeType == 4)) {
                                if (cycleOBJ[nodeChilds[i].tagName] == null) {
                                    cycleOBJ[nodeChilds[i].tagName] = nodeChilds[i][nodeText];
                                } else {
                                    if (typeof (cycleOBJ[nodeChilds[i].tagName]) == "object" && cycleOBJ[nodeChilds[i].tagName].length) {
                                        cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length] = nodeChilds[i][nodeText];
                                    } else {
                                        cycleOBJ[nodeChilds[i].tagName] = [cycleOBJ[nodeChilds[i].tagName]];
                                        cycleOBJ[nodeChilds[i].tagName][1] = nodeChilds[i][nodeText];
                                    }
                                }
                            } else {
                                if (nodeChilds[i].childNodes.length) {
                                    if (cycleOBJ[nodeChilds[i].tagName] == null) {
                                        cycleOBJ[nodeChilds[i].tagName] = new Object;
                                        buildObjectNode(cycleOBJ[nodeChilds[i].tagName], nodeChilds[i]);
                                    } else {
                                        if (cycleOBJ[nodeChilds[i].tagName].length) {
                                            cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length] = new Object;
                                            buildObjectNode(cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length - 1], nodeChilds[i]);
                                        } else {
                                            cycleOBJ[nodeChilds[i].tagName] = [cycleOBJ[nodeChilds[i].tagName]];
                                            cycleOBJ[nodeChilds[i].tagName][1] = new Object;
                                            buildObjectNode(cycleOBJ[nodeChilds[i].tagName][1], nodeChilds[i]);
                                        }
                                    }
                                } else {
                                    cycleOBJ[nodeChilds[i].tagName] = nodeChilds[i][nodeText];
                                }
                            }
                        }
                    }
                }
            }
        }
        //ajax-评分
        $.ajax({
            type: "GET",
            url: "../ashx/SysAjaxInterface.ashx?DataType=GetMyWorkData&UserCode=" + ID,
            //url: "http://ums.intretech.com/ums/ashx/SysAjaxInterface.ashx?DataType=GetMyWorkData&UserCode=" + ID,
            cache: false,
            error: function () {
                if (window.console) {
                    window.console.log("程序出错");
                }
            },
            dataType: "json",
            success: function (scoredata) {
                var score = scoredata;
                if (score == '') {
                    getscoreall = '';
                    sendscorelevel = '';
                    getscoreall = '';
                    getscorepart = '';
                    sendscoreall = '';
                    department = '';
                    company = '';
                }
                else {
                    console.log(score);
                    var getscorelevel;
                    var sendscorelevel;
                    var getscoreall;
                    var getscorepart;
                    var sendscoreall;
                    var sendscorepart;
                    var department;
                    var company;
                    getscorelevel = score.GetScoreLevel;
                    sendscorelevel = score.SendScoreLevel;
                    getscoreall = score.GetScoreAll;
                    getscorepart = score.GetScorePart;
                    sendscorepart = score.SendScorePart;
                    sendscoreall = score.SendScoreAll;
                    department = score.Department;
                    company = score.Company;
                    if (getscorepart == "" && getscoreall == "") {
                        getscorepart = '-';
                        getscoreall = '-';
                        $('.no').children().eq(0).find('.proportion2').html(getscorepart + '/' + getscoreall);
                    }
                    $('.no').children().eq(0).find('.proportion2').html(getscorepart + '/' + getscoreall);
                    if (department == "" && company == "") {
                        department = '-';
                        company = '-';
                        $('.no').children().eq(1).find('.proportion2').html(department + '/' + company);
                    }
                    $('.no').children().eq(1).find('.proportion2').html(department + '/' + company);
                    if (sendscorepart == "" && sendscoreall == "") {
                        sendscorepart = '-';
                        sendscoreall = '-';
                        $('.no').children().eq(2).find('.proportion2').html(sendscorepart + '/' + sendscoreall);
                    }
                    $('.no').children().eq(2).find('.proportion2').html(sendscorepart + '/' + sendscoreall);
                    switch (getscorelevel.length) {
                        case 0: $('.item').find('img').attr('src', 'images/image_myhonor/icon_xing01@2x.png');
                            break;
                        case 1: $('.item').find('img').attr('src', 'images/image_myhonor/icon_xing01@2x.png');
                            break;
                        case 2: $('.item').find('img').attr('src', 'images/image_myhonor/icon_xing02@2x.png');
                            break;
                        case 3: $('.item').find('img').attr('src', 'images/image_myhonor/icon_xing03@2x.png');
                            break;
                        case 4: $('.item').find('img').attr('src', 'images/image_myhonor/icon_xing04@2x.png');
                            break;
                        case 5: $('.item').find('img').attr('src', 'images/image_myhonor/icon_xing05@2x.png');
                            break;
                        case 6: $('.item').find('img').attr('src', 'images/image_myhonor/icon_xing06@2x.png');
                            break;
                    }
                    switch (sendscorelevel.length) {
                        case 0: $('.item2').find('img').attr('src', 'images/image_myhonor/icon_xing01@2x.png');
                            break;
                        case 1: $('.item2').find('img').attr('src', 'images/image_myhonor/icon_xing01@2x.png');
                            break;
                        case 2: $('.item2').find('img').attr('src', 'images/image_myhonor/icon_xing02@2x.png');
                            break;
                        case 3: $('.item2').find('img').attr('src', 'images/image_myhonor/icon_xing03@2x.png');
                            break;
                        case 4: $('.item2').find('img').attr('src', 'images/image_myhonor/icon_xing04@2x.png');
                            break;
                        case 5: $('.item2').find('img').attr('src', 'images/image_myhonor/icon_xing05@2x.png');
                            break;
                        case 6: $('.item2').find('img').attr('src', 'images/image_myhonor/icon_xing06@2x.png');
                            break;
                    }
                }
            }
        });
        //ajax-护卫舰
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
            success: function (prizedata) {
                var prize = prizedata;
                console.log(prize);
                var obj = [];
                function reward(name, img, count) {
                    var att = new Object();
                    att.name = name;
                    att.img = img;
                    att.count = count;
                    return att;
                }
                obj.push(new reward("最佳移动办公奖", "bangong", 0));
                obj.push(new reward("最佳快速行动奖", "xingdong", 0));
                obj.push(new reward("最佳ERP应用奖", "erp", 0));
                obj.push(new reward("最佳OA应用奖", "oa", 0));
                obj.push(new reward("最佳高效确认奖", "queren", 0));
                obj.push(new reward("最佳文档输出奖", "wendang", 0));
                obj.push(new reward("最佳会议纪要奖", "huiyi", 0));
                obj.push(new reward("最佳信息化建议奖", "xinxihua", 0));
                obj.push(new reward("最佳项目管理奖", "xiangmu", 0));
                obj.push(new reward("最佳JIRA得分奖", "jiradefen", 0));
                obj.push(new reward("最佳JIRA评分奖", "jirapingfen", 0));
                var medal = [];
                //if (prize.length == 0) {
                //     // $('#prize_main').children().eq(1).remove();
                //     $('#prize_main').append('<div style="display:none" class="no_record"><span>暂无记录</span></div>');
                // }
                // else {
                // var split = splityear.getFullYear;
                for (var i = 0; i < prize.length; i++) {
                        for (var j = 0; j < prize[i].Result.length; j++) {
                            medal.push(prize[i].Result[j].RewardName);
                        }
                    
                }
                for (var i = 0; i < 11; i++) {
                    for (var j = 0; j < medal.length; j++) {
                        if (obj[i].name == medal[j].toUpperCase()) {
                            obj[i].count++;
                        }
                    }
                    if (obj[i].count > 0) {
                        $('.prize_list').append('<li><div style="position:relative;height:1.3rem"  onclick=window.location.href="mMyhonorPrize.aspx?id=' + ID + '&prize=' + obj[i].img + '"><div class="count">' + obj[i].count + '</div><img src="images/image_myhonor/icon_' + obj[i].img + '.png"><span style="display:block;font-size:0.26rem;color:#333;">' + obj[i].name.substring(2, obj[i].name.length - 1) + '</span></div></li>')
                    }
                }
                for (var i = 0; i < 11; i++) {
                    if (obj[i].count == 0) {
                        $('.prize_list').append('<li><div style="height:1.3rem"><img src="images/image_myhonor/icon_' + obj[i].img + '_02.png" ><span style="display:block;font-size:0.26rem;color:#333;">' + obj[i].name.substring(2,obj[i].name.length-1)+ '</span></div></li>')
                    }
                }
                // if (i != 0) {
                //     $('#prize_title').next().append('<div class="prize_body"><div class="prize_month"><span></span></div><div class="prize_show"></div></div>');
                // }
                // else {
                //     $('#prize_title').next().append('<div class="prize_body_first"><div class="prize_month"><span></span></div><div class="prize_show_first"></div></div>');
                // }
                // var mon = month[i].substring(5, 7);
                // $('.prize_month').children().eq(i).html(year + '-' + mon);
                // for (var j = 0; j < prize[i].Result.length; j++) {
                //     medal.push(prize[i].Result[j]);
                //     if (i == 0) {
                //         $('.prize_show_first').eq(i).append('<div class="medal"><img src=""></div>');
                //     }
                //     else {
                //         $('.prize_show').eq(i - 1).append('<div class="medal"><img src=""></div>');
                //     }
                // }
                // }
                if (medal.length != 0) {
                    $('#prize_title').children().eq(1).after('<div class="tips"><span class="counts2"></span></div>');
                    $('div#prize_title .counts2').html(medal.length);
                }
            
                // for (var j = 0; j < medal.length; j++) {
                //     $('.medal').find('img').eq(j).attr('src', medal[j].Image);
                // }
                // }
                // if (month.length <= 3) {
                //     $('div#prize_main .more').remove();
                // }


                //Hide(1);
            }
        })
        //ajax-OA
        $(function () {
            $.ajax({
                url: "../ashx/SysAjaxInterface.ashx?DataType=RewardAndPunish&UserCode=" +YQid,
                //url: "http://ums.intretech.com/ums/ashx/SysAjaxInterface.ashx?DataType=RewardAndPunish&UserCode=" + YQid,
                type: "GET",
                cache: false,
                //data: { workcode: YQid },
                //返回的类型为XML
                dataType: 'JSON',
                // //由于不是json，这里传递的参数采用对象形式
                // data: {},
                success: function (result) {
                    var data = result;
                    if (!result || data.length == 0) {
                        $('#RandP_body').remove();
                        $('#RandP').append('<div class="no_record"><span>暂无记录</span></div>');
                    }
                    else {
                        var len = data.length;
                        var obj = [];
                        var P_times = 0;
                        var R_times = 0;
                        //var obj1=[];
                        function RandP(name, img, count) {
                            var att = new Object();
                            att.name = name;
                            att.img = img;
                            att.count = count;
                            return att;
                        }
                        obj.push(new RandP("集体大功", "jtdg", 0));
                        obj.push(new RandP("集体小功", "jtxg", 0));
                        obj.push(new RandP("集体嘉奖", "jtjj", 0));
                        obj.push(new RandP("集体表扬", "jtby", 0));
                        obj.push(new RandP("大功", "dg", 0));
                        obj.push(new RandP("小功", "xg", 0));
                        obj.push(new RandP("嘉奖", "jj", 0));
                        obj.push(new RandP("表扬", "by", 0));
                        obj.push(new RandP("集体大过", "jtdaguo", 0));
                        obj.push(new RandP("集体小过", "jjxiaoguo", 0));
                        obj.push(new RandP("集体申诫", "jtsj", 0));
                        obj.push(new RandP("集体警告", "jtjg", 0));
                        obj.push(new RandP("大过", "daguo", 0));
                        obj.push(new RandP("小过", "xiaoguo", 0));
                        obj.push(new RandP("申诫", "sj", 0));
                        obj.push(new RandP("警告", "jg", 0));
                        obj.push(new RandP("开除", "kc", 0));
                        for (var i = 0; i < 17; i++) {
                            for (var j = 0; j < len; j++) {
                                if (obj[i].name == data[j]['奖惩类型']) {
                                    obj[i].count++;
                                }
                            }
                            if (obj[i].count > 0 && i < 8) {
                                $('.RandP_list').append('<li><div style="position:relative;" onclick=window.location.href="mMyhonorOA.aspx?id=' + ID + '&OA=' + obj[i].img + '"><div class="count">' + obj[i].count + '</div><img src="images/image_myhonor/icon_' + obj[i].img + '.png"><span class="R_name">' + obj[i].name + '</span></div></li>');
                                R_times += obj[i].count;
                                $('#RandP_body').children().eq(0).show();
                            }
                            else if (obj[i].count > 0 && i >= 8) {
                                $('.RandP_list').append('<li><div style="position:relative;" onclick=window.location.href="mMyhonorOA.aspx?id=' + ID + '&OA=' + obj[i].img + '"><div class="count">' + obj[i].count + '</div><img src="images/image_myhonor/icon_' + obj[i].img + '.png"><span class="P_name">' + obj[i].name + '</span></div></li>');
                                P_times += obj[i].count;
                                $('#RandP_body').children().eq(1).show();
                            }
                        }
                        $('#RandP_title').children().eq(1).after('<div class="tips"><span class="counts2"></span></div>');
                        $('div#RandP_title .counts2').html('&nbsp;奖' + R_times + '&nbsp;惩' + P_times);
                    }
                    //for (var i = 0; i < 17; i++) {
                    //    for (var j = 0; j < len; j++) {
                    //        if (obj[i].name == data[j]['奖惩类型']) {
                    //            obj[i].count++;
                    //        }
                    //    }
                    //    if (obj[i].count > 0 && i < 8) {
                    //        $('.R_list').append('<li><div style="position:relative;" onclick=window.location.href="mMyhonorOA.aspx?OA=' + obj[i].img + '"><div class="count">' + obj[i].count + '</div><img src="images/image_myhonor/icon_' + obj[i].img + '.png"><span class="R_name">' + obj[i].name + '</span></div></li>');
                    //        R_times+=obj[i].count;
                    //    }
                    //    else if (obj[i].count > 0 && i >= 8) {
                    //        $('.p_list').append('<li><div style="position:relative;" onclick=window.location.href="mMyhonorOA.aspx?OA=' + obj[i].img + '"><div class="count">' + obj[i].count + '</div><img src="images/image_myhonor/icon_' + obj[i].img + '.png"><span class="P_name">' + obj[i].name + '</span></div></li>');
                    //        P_times+=obj[i].count;
                    //    }
                    //}
                    //var obj = $(result).toObject().get(0);//xml转json
                    //if (obj.DataTable['diffgr:diffgram'] == '') {
                     
                    // else {
                    //  var data = obj.DataTable['diffgr:diffgram'].NewDataSet.Table;
                    // for (var i = 0; i < data.length; i++) {
                    //     if (i == 0) {
                    //         $('#RandP_title').next().append('<div><div class="info_show_first open"><div class="info_date"><span class="date"></span><span class="name_R"></span><span class="times"></span><span class="law"></span></div><div class="btn_show"><img src="images/image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png"></div></div><div class="detail_body"><p class="law_info"></p><div class="reason"><div class="reason_title"><span>事由：</span></div><div class="reason_detail"><span></span><span class="man"></span></div></div></div></div>');
                    //     }
                    //     else {
                    //         $('#RandP_title').next().append('<div><div class="info_show open"><div class="info_date"><span class="date"></span><span class="name_R"></span><span class="times"></span><span class="law"></span></div><div class="btn_show"><img src="images/image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png"></div></div><div class="detail_body"><p class="law_info"></p><div class="reason"><div class="reason_title"><span>事由：</span></div><div class="reason_detail"><span></span><span class="man"></span></div></div></div></div>');
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
                    //     $('.law_info').eq(j).html("条例内容：" + data[j]['条例内容']);
                    //     $('.reason_detail').eq(j).find('span').html(data[j]['奖惩提报事项描述']);
                    //     $('.man').eq(j).html("提报人：" + data[j]['提报人']);
                    // }

                    
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
                    // }
                    // Hide(2);
                },
                error: function (error, errorstate) {//未完成流程
                    $('#RandP').find('span').eq(1).remove();
                    $('#RandP').append('<div style="display:none" class="no_record"><span>暂无记录</span></div>');
                    console.log(error);
                }

            });
        })
        //ajax-改善方案
        $.ajax({
            url: "../ashx/SysAjaxInterface.ashx?DataType=ImproveScore&UserCode=" + YQid,
            //url: "http://ums.intretech.com/ums/ashx/SysAjaxInterface.ashx?DataType=ImproveScore&UserCode=" + YQid,
            type: "GET",
            //返回的类型为XML
            dataType: 'JSON',
            // //由于不是json，这里传递的参数采用对象形式
            // data: {},
            success: function (result) {
                //var obj = $(result).toObject().get(0);//xml转json
                var improve_data = result;//obj.DataTable['diffgr:diffgram'].NewDataSet.Table;
                if (!result || improve_data.length == 0) {
                    $('#improve').find('span').eq(1).remove();
                    $('#improve').append('<div class="no_record"><span>暂无记录</span></div>');

                }
                else {
                    for (var i = 0; i < improve_data.length; i++) {
                        if (i == 0) {
                            $('#improve_title').next().append('<div><div class="improve_show_first open"><div class="improve_date"><span class="im_date"></span><span class="improve_score"></span><span class="ssgs"></span></div><div class="improve_btn_show"><img src="images/image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png"></div></div><div class="improve_detail_body"><div class="improve_detail"><div class="improve_detail_title"><span>改善方案：</span></div><div class="improve_details"><span></span><span class="improve_man"></span></div></div></div></div>')
                        }
                        else {
                            $('#improve_title').next().append('<div><div class="improve_show open"><div class="improve_date"><span class="im_date"></span><span class="improve_score"></span><span class="ssgs"></span></div><div class="improve_btn_show"><img src="images/image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png"></div></div><div class="improve_detail_body"><div class="improve_detail"><div class="improve_detail_title"><span>改善方案：</span></div><div class="improve_details"><span></span><span class="improve_man"></span></div></div></div></div>')
                        }
                    }
                    for (var j = 0; j < improve_data.length; j++) {
                        $('.im_date').eq(improve_data.length - 1 - j).html(improve_data[j]['填写日期']);
                        $('.improve_score').eq(improve_data.length - 1 - j).html('平均：' + improve_data[j]['平均总分']);
                        $('.ssgs').eq(improve_data.length - 1 - j).html(improve_data[j]['所属公司']);
                        $('.improve_details').eq(improve_data.length - 1 - j).find('span').html(improve_data[j]['改善方案']);
                        $('.improve_man').eq(improve_data.length - 1 - j).html('提案人：' + improve_data[j]['提案人姓名']);
                    }
                    $('#improve_title').next().children().eq(4).nextAll('div').hide();
                    $('#improve_title').children().eq(1).after('<div class="tips"><span class="counts2"></span></div>');
                    $('div#improve_title .counts2').html(improve_data.length);
                    if (improve_data.length <= 5) {
                        $('div#improve .more').remove();
                        $('div#improve').append('<div class="clear"></div>');
                    }
                    //$('#improve_title').nextAll().hide();
                    //点击显示详情
                    $('.open').on('click', function () {
                        var show = $(this).next('div.improve_detail_body');
                        var reason = show.find('.improve_detail');
                        if (show.css('display') == "none") {
                            show.show();
                            if (($(window).height() - (show.offset().top - $(document).scrollTop() + 30)) < show.height()) {
                                $(document).scrollTop($(window).scrollTop() + show.height() + reason.height() + 20);
                            }
                            $(this).find('.improve_btn_show img').attr('src', 'images/image_myhonor/icon_shouqi@2x.png')
                        }
                        else {
                            show.hide();
                            $(this).find('.improve_btn_show img').attr('src', 'images/image_myhonor/icon_zhankai@2x.png')
                        }
                    })
                    console.log(improve_data);
                }
                //Hide(3);
            },
            error: function (error, errorstate) {//未完成流程
                $('#improve').find('span').eq(1).remove();
                $('#improve').append('<div class="no_record"><span>暂无记录</span></div>');
                console.log(error);
            }
        });
        //ajax-流程评分
        $.ajax({
            url: "../ashx/SysAjaxInterface.ashx?DataType=WorkFlowScore&UserCode=" + YQid,
            //url: "http://ums.intretech.com/ums/ashx/SysAjaxInterface.ashx?DataType=WorkFlowScore&UserCode=" + YQid,
            type: "GET",
            //返回的类型为XML
            dataType: 'JSON',
            // //由于不是json，这里传递的参数采用对象形式
            // data: {},
            success: function (result) {
                //var obj1 = $(result).toObject().get(0);//xml转json
                var process_data = result;//obj1.DataTable['diffgr:diffgram'].NewDataSet.Table;
                console.log(process_data);
                if (!process_data || process_data.length == 0) {
                    $('#process').find('span').eq(1).remove();
                    $('#process').append('<div class="no_record"><span>暂无记录</span></div>');

                }
                else {
                    for (var i = 0; i < process_data.length; i++) {
                        if (i == 0) {
                            $('#process_title').next().append('<div><div class="process_show_first open"><div class="process_date"><span class="pro_date"></span><span class="process_score"></span><span class="process_sqr"></span></div><div class="process_btn_show"><img src="images/image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png"></div></div><div class="process_detail_body"><span class="process_info"></span><div class="process_detail"><div class="process_detail_title"><span>验收评价：</span></div><div class="process_details"><span></span><span class="process_man"></span></div></div></div></div>')
                        }
                        else {
                            $('#process_title').next().append('<div><div class="process_show open"><div class="process_date"><span class="pro_date"></span><span class="process_score"></span><span class="process_sqr"></span></div><div class="process_btn_show"><img src="images/image_myhonor/icon_zhankai@2x.png"><img style="display:none" src="images/image_myhonor/icon_shouqi@2x.png"></div></div><div class="process_detail_body"><span class="process_info"></span><div class="process_detail"><div class="process_detail_title"><span>验收评价：</span></div><div class="process_details"><span></span><span class="process_man"></span></div></div></div></div>')
                        }
                    }
                    process_data.sort(function (a, b) {
                        return parseInt(b['填写日期'].replace(/-/g, ''), 10) - parseInt(a['填写日期'].replace(/-/g, ''), 10);
                    });
                    for (var j = 0; j < process_data.length; j++) {
                        $('.pro_date').eq(j).html(process_data[j]['填写日期']);
                        $('.process_score').eq(j).html('满意度：' + process_data[j]['满意度']);
                        $('.process_info').eq(j).html('流程：' + process_data[j]['流程']);
                        $('.process_details').eq(j).find('span').html(process_data[j]['验收评价 ']);
                        $('.process_man').eq(j).html('申请人：' + process_data[j]['申请人姓名']);
                    }
                    $('#process_title').next().children().eq(4).nextAll('div').hide();
                    $('#process_title').children().eq(1).after('<div class="tips"><span class="counts2"></span></div>');
                    $('div#process_title .counts2').html(process_data.length);
                    if (process_data.length <= 5) {
                        $('div#process .more').remove();
                        $('div#process').append('<div class="clear"></div>');
                    }

                    //点击显示详情
                    $('.open').on('click', function () {
                        var show = $(this).next('div.process_detail_body');
                        var reason = show.find('.process_detail');
                        if (show.css('display') == "none") {
                            show.show();
                            if (($(window).height() - (show.offset().top - $(document).scrollTop() + 30)) < show.height()) {
                                $(document).scrollTop($(window).scrollTop() + show.height() + reason.height() + 20);
                            }
                            $(this).find('.process_btn_show img').attr('src', 'images/image_myhonor/icon_shouqi@2x.png')
                        }
                        else {
                            show.hide();
                            $(this).find('.process_btn_show img').attr('src', 'images/image_myhonor/icon_zhankai@2x.png')
                        }
                    })
                }
                //Hide(4);
            },
            error: function (error, errorstate) {//未完成流程
                $('#process').find('span').eq(1).remove();
                $('#process').append('<div style="display:none" class="no_record"><span>暂无记录</span></div>');
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
