/* 2016.10.17 Wook
 *  livere event lib area, v0.92
 */

LivereLib = function() {

    this.mergedMemberData = false;
    this.reloadSyncCount = 0;
    this.postingSns = ['facebook', 'twitter', 'kakao', 'naver', 'linkedIn'];
    this.snsName = null;
    this.charset = typeof(document.charset) == "undefined" ? document.characterSet : document.charset;
    this.doctype = document.doctype != null || document.compatMode == "CSS1Compat" ? true : false;
    this.quirks = document.compatMode == "BackCompat" ? true : false;
    this.ie6 = navigator.userAgent.indexOf("MSIE 6");
    this.isOpenSharedBtn = false;
    this.isSetPosting = false;
    this.textareaSlidedown = false;
    this.isSmartLoginClose = true;
    this.theme = null;
    this.libType = "B";
    this.replyAdIndex = 0;

    this.dispatchEvent = function(paramData) {
        jQuery(this).trigger(paramData['type'], paramData);
    };

    var initDataRequest = false;
    this.dataInited = function() {
        if (!initDataRequest) {
            initDataRequest = true;
            return false;
        }
        return initDataRequest;
    };

    this.isLogged = function() {

        if (!livereLib.mergedMemberData) {
            livereLib.fire(null, "updateLinkAccData");
        }

        var s_datas = livereLib.getSmartLoginData();
        var returnFlag = false;
        if (s_datas) {
            jQuery(s_datas['linkage_accs']).each(function(ii, vv) {
                if (eval(vv).member_islogin == '1') returnFlag = true;
            });
        }

        return returnFlag;
    };

    this.fire = function(params, commands) {
        params = params == null ? {} : params;
        if (commands == 'customAPI') {
            livereLib.control.customAPI(params);
        } else {
            var fun = eval("livereLib.control." + commands);
            if (typeof(fun) == 'function') {
                params['command'] = commands;
                fun(params);
            }
        }
    };

    this.setRedirectPath = function() {
        if (typeof(livereLib.redirect_path) == 'string') {
            livereSharedData.smartLogin.redirect_path = encodeURIComponent(livereLib.redirect_path);
        } else {
            if (typeof(livereSharedData.smartLogin.redirect_path) == 'string') {
                livereSharedData.smartLogin.redirect_path = livereSharedData.smartLogin.redirect_path;
            } else {
                try{
                    livereSharedData.smartLogin.redirect_path = encodeURIComponent(window.parent.location.href);
                }catch(e) {
                    livereSharedData.smartLogin.redirect_path = encodeURIComponent(window.location.href);
                }
            }
        }
    };

    this.smartLoginInited = false;

    this.isSecure = !! (location.protocol == 'https:');

    this.initloadingBar = function() {
        var loadingBar = jQuery(livereReply.htmlFactory.loadingBar());
        jQuery('#livereContainer').before(loadingBar);
        jQuery('#liverePlugIn').hide();
    }

    this.removeloadingBar = function() {
        var $loadingWrapper = jQuery('.lvloadingWrapper');
        if($loadingWrapper.length < 1) return;
        jQuery('.lvloadingWrapper').remove();
        jQuery('#liverePlugIn').show();
    }

    this.start = function(callbackFunction) {
        try {
            var t = eval("jQuery");
            window.jQueryImport = true;
            livereLib.starting(callbackFunction);
        } catch (e) {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.charset = "UTF-8";
            var loaded = false;
            script.onreadystatechange = function() {
                if (this.readyState == 'loaded' || this.readyState == 'complete') {
                    if (loaded) return;
                    loaded = true;
                    window.jQueryImport = true;
                    livereLib.starting(callbackFunction);
                }
            };
            script.onload = function() {
                if (loaded) return;
                loaded = true;
                window.jQueryImport = true;
                livereLib.starting(callbackFunction);
            };
            script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";

            head.appendChild(script);
        }
    };

    this.starting = function(callbackFunction) {
        if (!window.binded) {
            window.eventBinding();
        }

        if (livereLib.smartLoginInited) {
            if (typeof(callbackFunction) == 'function') {
                callbackFunction();
            }
            return;
        }

        livereLib.initloadingBar();

        livereLib.smartLoginInited = true;
        livereLib.setRedirectPath();

        livereSharedData.smartLogin.smartlogin_seq = smartlogin_seq;
        livereSharedData.common.consumer_seq = consumer_seq;

        var request = livereLib.url("smartlogin", null);

        jQuery.getJSON(request, function(data) {

            var result = livereLib.util.toJson(data);

            livereSharedData.smartLogin.datas = result.resultData;

            livereLib.fire(null, "updateLinkAccData");

            var eventData = {};
            eventData['type'] = 'livereEvent';
            eventData['key'] = 'commitProperties';
            eventData['value'] = 'smartlogin';

            livereLib.dispatchEvent(eventData);

            if (typeof(callbackFunction) == 'function') {
                callbackFunction();
            }
        });
    };

    this.livereInited = false;
    this.initLivereReply = function(params) {
        if (livereLib.livereInited) return;
        livereLib.livereInited = true;

        var params_test = {};
        if (!livereLib.util.isEmpty(livereLib.message_seq)) {
            params_test["message_seq"] = livereLib.message_seq;
        } else if (!livereLib.util.isEmpty(livereSharedData.livereReply.livere_seq)) {
            params_test["livere_seq"] = livereSharedData.livereReply.livere_seq;
        }

        livereLib.fire(params_test, 'getMessage');

        var request = livereLib.url("livereDataLoad", params);
        jQuery.getJSON(request, function(data) {
            var result = livereLib.util.toJson(data);
            livereSharedData.livereReply.consumer_status = result['CONSUMER_STATUS'];
            livereSharedData.livereReply.managers = result['MANAGERS'];
            livereSharedData.livereReply.livere_data = result['LIVERE'];
            livereSharedData.livereReply.plugin_data = result['PLUGINS'];
            livereSharedData.livereReply.rep_data = result['REP'];
            livereSharedData.livereReply.reply_data = result['RE_LIST'];
            livereSharedData.livereReply.message_emotion = result['message_emotion'];
            livereSharedData.livereReply.livere_ad = result['livere_ad'];
            livereSharedData.livereReply.livere_contents = result['livere_contents'];
            livereSharedData.livereReply.livere_tenping = result['tenping_ad'];
            livereSharedData.livereReply.livere_replyad = shuffleArray(result['reply_ad']);

            livereLib.theme = !livereSharedData.livereReply.livere_data.theme ? 'B' : livereSharedData.livereReply.livere_data.theme;

            livereLib.allCssLoad();

            var fun = function() {
                var eventData = {};
                eventData['type'] = 'livereEvent';
                eventData['key'] = 'livereDataInitComplete';
                eventData['value'] = 'livereReply';

                livereLib.dispatchEvent(eventData);
            };

            livereLib.fire(fun, "pluginLoad");

            function shuffleArray(array) {
                if (!array){

                    return null;
                }

                for (var i = 0; i < array.length - 1; i++) {
                    var j = i + Math.floor(Math.random() * (array.length - i));

                    var temp = array[j];
                    array[j] = array[i];
                    array[i] = temp;
                }

                return array;
            }
        });

        jQuery('body').click(function(e) {
            if(jQuery('.livereFunctionBtn').hasClass('active')){
                jQuery('.livereFunctionBtn').removeClass('active');
                jQuery(this).find('.reply-history-layer').hide();
            }

            if(jQuery('#livereGuideBtn').hasClass('lv-layer-active')){
                jQuery('#livereGuideBtn').removeClass('lv-layer-active');
                jQuery('.livereGuideLayer').slideUp('fast');
            }

            if(!jQuery(e.target).attr('clickType')) {
                if(jQuery("#wf-share-btn").hasClass('active')){
                    jQuery('#layer-shared').remove();
                    jQuery("#wf-share-btn").removeClass('active');
                }

                if(jQuery(".share-btn").hasClass('active')){
                    jQuery('#layer-shared').remove();
                    jQuery("#wf-share-btn").removeClass('active');
                }
            }

            if(e.target.id === 'smart_view_container'){
                jQuery(e.target).hide();
            }

            if(e.target.id === 'livereReplyAttachedViewerWrapper'){
                jQuery(e.target).remove();
                jQuery(".livereReplyAttachedThumbsWrapper span").html(livereLib.getMessage("attachViewPhoto_8").split("|")[0]);
                jQuery(".livereReplyAttachedThumbsWrapper").removeClass("livereImageAttachCloseBtn");
                if(livereLib.switchMobileView){
                    jQuery(".livereReplyAttachedThumbs").removeClass('closeBtn');
                    jQuery(".livereReplyAttachedThumbs").find('.livereReplyAttached').removeClass('closeBtn');
                }
            }
        });
    };

    this.renewLivere = function(n_refer, n_title) {
        refer = n_refer;
        title = n_title;

        jQuery("#" + livereSharedData.livereReply.livere_data.targetDiv + " > *").remove();

        if (livereSharedData.livereReply.livere_data.use_emotions > 0) {
            jQuery("#" + livereSharedData.livereReply.livere_data.emotions_target_div + " > *").remove();
        }

        livereLib.livereInited = false;
        livereLib.smartLoginInited = false;
        livereSharedData.livereReply.rep_data = null;
        livereAttachFile.imgAttachFormInitFlag = false; // attach reset kero
        livereReply = new Livere(livere_seq, refer, title);
        livereLib.start();
    };

    this.getMessage2 = function(data, params) {
        if (data.result == "200") {
            var eventData = {
                type: "livereEvent",
                key: "getMessageComplete",
                value: data,
                requestData: params
            };

            livereSharedData.livereReply.initMessage = data.resultData;

            livereLib.dispatchEvent(eventData);
        }
    }

    this.control = {};

    this.control.pluginLoad = function(callbackFunction) {

        if (livereLib.util.isEmpty(livereSharedData.livereReply.plugin_data) && livereLib.util.isEmpty(livereSharedData.livereReply.livere_data.custom_script_path)) {
            callbackFunction();
            return;
        }

        if (livereLib.util.isEmpty(livereSharedData.livereReply.plugin_data))
            livereSharedData.livereReply.plugin_data = [];

        if (!livereLib.util.isEmpty(livereSharedData.livereReply.livere_data.custom_script_path))
            livereSharedData.livereReply.plugin_data.push({
                script_path: livereSharedData.livereReply.livere_data.custom_script_path
            });


        var loaded_plugin_length = 0;
        var plugin_length = livereSharedData.livereReply.plugin_data.length;

        jQuery(livereSharedData.livereReply.plugin_data).each(function(ii, vv) {

            if (!livereLib.util.isEmpty(vv.css_path))
                livereLib.cssLoad(vv.css_path);
            if (!livereLib.util.isEmpty(vv.custom_css_path))
                livereLib.cssLoad(vv.custom_css_path);

            vv.script_path = vv.script_path;
            jQuery.getScript(vv.script_path, function() {
                var var_id = vv.id;
                var plugin = eval("livereReply." + var_id);

                if (plugin) {
                    if (vv.param_data != '') {
                        var params = vv.param_data.split(",");
                        jQuery(params).each(function(xx, vals) {
                            var value = eval("vv.param" + (xx + 1));
                            eval("livereReply." + var_id + "." + vals + " = '" + value + "';");
                        });
                    }

                    if (vv.plugin_type == 'object' || typeof(plugin.init) == 'function') {
                        plugin.init();
                    }

                }

                if (++loaded_plugin_length >= plugin_length) {
                    callbackFunction();
                }
            });
        });
    };

    this.control.getMessage = function(params) {
        params = params == null ? {} : params;

        var request = livereLib.url("API_Livere", params);
        jQuery.getJSON(request, function(data) {
            if(data.resultData.message_seq === 1) {
                params['message_seq'] = 598
                request = livereLib.url("API_Livere", params);
                jQuery.getJSON(request, function(data) {
                    livereLib.getMessage2(data, params);
                });
            }else{
                livereLib.getMessage2(data, params);
            }
        });
    };

    this.control.action = function(params) {
        params = params == null ? {} : params;

        var request = livereLib.url("API_Livere", params);
        jQuery.getJSON(request, function(data) {
            var result = livereLib.util.toJson(data);

            var eventData = {

                type: "livereEvent",
                key: "actionComplete",
                value: result,
                requestData: params
            };

            livereLib.dispatchEvent(eventData);

            livereLib.processComplete();
        });
    };

    this.control.customAPI = function(params) {
        params = params == null ? {} : params;

        var callbackFun = params['callback'];
        var eventKeyStr = params['eventKey'];

        params['callback'] = null;

        var request = livereLib.url("API_Livere", params);

        jQuery.getJSON(request, function(data) {
            var result = livereLib.util.toJson(data);
            if (!livereLib.util.isEmpty(callbackFun)) {
                var fun = eval(callbackFun);
                fun(data);
            }
            if (!livereLib.util.isEmpty(eventKeyStr)) {
                var eventData = {};
                eventData['type'] = 'livereEvent';
                eventData['key'] = eventKeyStr;
                eventData['value'] = result;

                livereLib.dispatchEvent(eventData);
            }
            livereLib.processComplete();
        });
    };

    this.control.deleteReply = function(params) {

        params = params == null ? {} : params;

        params['command'] = 'deleteReply';
        params['reply_seq'] = livereLib.util.isEmpty(params['reply_seq']) ? params['target_seq'] : params['reply_seq'];

        var request = livereLib.url("API_Livere", params);

        jQuery.getJSON(request, function(data) {
            var result = livereLib.util.toJson(data);
            result['reply'] = livereReply.getReplyObject(params.target_seq);

            var eventData = {};
            eventData['type'] = 'livereEvent';
            eventData['key'] = 'replyDeleteEvent';
            eventData['value'] = result;

            livereLib.dispatchEvent(eventData);
            livereLib.processComplete();
        });
    };

    this.control.serviceLogout = function(params) {

        var needSyncOff = false;

        if (!livereLib.util.isEmpty(syncManager.syncMembership) && eval(syncManager.syncMembership).member_islogin == 1 && eval(syncManager.syncMembership).member_seq == params['member_seq']) {
            needSyncOff = true;
        }

        jQuery(livereSharedData.smartLogin.datas.linkage_accs).each(function(ii, vv) {
            if (eval(vv).member_seq = params['member_seq']) {
                needSyncLogout = true;
                return false;
            };
        });

        params = params == null ? {} : params;
        var request = livereLib.url("API_Livere", params);

        jQuery.getJSON(request, function(data) {
            var result = livereLib.util.toJson(data);
            if (result.result == '200') {

                if (result.command == 'clearLoginData') {
                    livereSharedData.smartLogin.datas.accessable_group_data = null;

                    jQuery(livereSharedData.smartLogin.datas.linkage_accs).each(function(ii, vv) {
                        eval(vv).member_islogin = '0';
                    });

                    var eventData = {};
                    eventData['type'] = 'livereEvent';
                    eventData['key'] = 'livereLogout';
                    eventData['value'] = 'fin';

                    livereLib.dispatchEvent(eventData);
                } else {
                    livereSharedData.smartLogin.datas = result.resultData;
                    livereLib.fire(null, "updateLinkAccData");

                    var eventData = {};
                    eventData['type'] = 'livereEvent';
                    eventData['key'] = 'renewMemberData';
                    eventData['value'] = 'fin';

                    livereLib.dispatchEvent(eventData);
                }

                if (needSyncOff)
                    syncManager.syncOff();

            } else {
                livereLib.control.checkError(result);
            }
            livereLib.processComplete();
        });
    };

    this.control.setPosting = function( params ) {
        params = params == null ? {} : params;
        var request = livereLib.url( "API_Livere" , params );

        jQuery.getJSON( request , function(data) {
            var result = livereLib.util.toJson( data );
            if( result.result == '200' ) {
                livereSharedData.smartLogin.datas = result.resultData;
                livereLib.fire( null , "updateLinkAccData" );

                var eventData = {};
                eventData['type']   = 'livereEvent';
                eventData['key']    = 'renewMemberData';
                eventData['value']  = result;
                eventData['requestData'] = params;

                livereLib.dispatchEvent( eventData );
            } else {
                livereLib.control.checkError( result );
            }
            livereLib.processComplete();
        } );
    };
    this.control.setPrimary = function( params ) {
        params = params == null ? {} : params;

        var request = livereLib.url( "API_Livere" , params );

        jQuery.getJSON( request , function(data) {
            var result = livereLib.util.toJson( data );
            if( result.result == '200' ) {
                livereSharedData.smartLogin.datas = result.resultData;
                livereLib.fire( null , "updateLinkAccData" );

                var eventData = {};
                eventData['type']   = 'livereEvent';
                eventData['key']    = 'renewMemberData';
                eventData['value']  = result;
                eventData['requestData'] = params;

                livereLib.dispatchEvent( eventData );
            } else {
                livereLib.control.checkError( result );
            }
            livereLib.processComplete();
        } );
    };
    this.control.livereLogout = function( params ) {

        var needSyncOff = false;
        if( !livereLib.util.isEmpty(syncManager.syncMembership) && eval(syncManager.syncMembership).member_islogin == 1 ) {
            needSyncOff = true;
        }

        params = params == null ? {} : params;
        params = params.type == 'click' ? {} : params;
        params['command'] = 'livereLogout';

        if(params.reloadmode) {
            needSyncOff=false;
            livereLib.reloadSyncCount++;
        }

        var request = livereLib.url( "API_Livere" , params );
        jQuery.getJSON( request , function(data) {
            var result = livereLib.util.toJson( data );
            if( result.result == '200' ) {

                jQuery("#livereGuide").show();
                livereSharedData.smartLogin.datas.accessable_group_data = null;

                jQuery( livereSharedData.smartLogin.datas.linkage_accs ).each( function( ii , vv ) {
                    eval( vv ).member_islogin = '0';
                } );

                var eventData = {};
                eventData['type']   = 'livereEvent';
                eventData['key']    = 'livereLogout';
                eventData['value']  = result;
                eventData['requestData'] = params;

                livereLib.dispatchEvent( eventData );

                if( needSyncOff )
                    syncManager.syncOff();

                if(params.reloadmode && livereLib.reloadSyncCount < 3) {
                    syncManager.tryLogin = false;
                    syncManager.syncStart();
                }

            } else {
                livereLib.control.checkError( result );
            }
            livereLib.processComplete();
        } );
    };

    this.control.renewMemberData = function(params) {
        params = params == null ? {} : params;
        params['command'] = 'sessionLogin';

        var request = livereLib.url("API_Livere", params, true);
        jQuery.getJSON(request, livereLib.control.renewMemberProcess);
    };

    this.control.renewMemberProcess = function(params) {
        var result = livereLib.util.toJson(params);
        livereSharedData.smartLogin.datas = result.resultData;

        livereLib.fire(null, "updateLinkAccData");

        var eventData = {};
        eventData['type'] = 'livereEvent';
        eventData['key'] = 'renewMemberData';
        eventData['value'] = 'fin';

        livereLib.dispatchEvent(eventData);
        livereLib.processComplete();
    };

    this.control.updateLinkAccData = function(params) {

        var smartlogindata = livereLib.getSmartLoginData();

        if (smartlogindata != null) {
            var group_data = smartlogindata['group_data'];
            var linkage_accs = smartlogindata['linkage_accs'];

            if (group_data != null) {

                var member_datas = group_data['member_datas'];

                jQuery(linkage_accs).each(function(ii, linked_acc) {
                    linked_acc = eval(linked_acc);
                    jQuery(member_datas).each(function(ii, login_acc) {
                        if (linked_acc.name == login_acc.member_domain) {
                            jQuery.extend(linked_acc, login_acc);
                            livereLib.mergedMemberData = true;
                        }
                    });
                });
            }
        }

    };

    this.control.writeReply = function(params) {
        var request = livereLib.url("API_Livere", params);

        jQuery.getJSON(request, function(data) {
            var result = livereLib.util.toJson(data);
            if (result.result == '200') {

                var reply = result.resultData;
                livereSharedData.livereReply.rep_data.rep_seq = reply.rep_seq;
                reply.regdate = result.requestDate;

                var eventData = {};
                eventData['type'] = 'livereEvent';
                eventData['key'] = 'writeDone';
                eventData['value'] = reply;

                var sns = reply.sept_sns.split(',');
                for(var key in sns){
                    var $iconSpan = jQuery("#livereAction_" + result.member_domain + " span");
                    var $cntSpan = jQuery("#livereAction_" + result.member_domain + " span.count-text");

                    livereActionWidzet.snsBtnCount($cntSpan, $iconSpan);
                }

                livereLib.dispatchEvent(eventData);
            } else {
                if (result.result == '520') {
                    alert(result.message);
                    return;
                }
                if (result.result >= 1500 && result.result <= 1502) {
                    alert(livereLib.getMessage('plasterBlock' + (result.result - 1499)));
                    return;
                }
            }

            livereLib.processComplete();

        });
    };

    this.control.checkError = function(result) {
        return;
        if (!livereLib.util.isEmpty(result)) {
            switch (result.result) {
                case 1200:
                    window.location.href = livereSharedData.url + "/API_Livere" + "?command=redirect&redirect_path=" + encodeURIComponent(window.location.href);
                    break;
                default:
                    break;
            }
        }
    };

    this.control.getCount = function(params) {
        var request = livereLib.url("API_Livere", params);

        jQuery.getJSON(request, function(data) {
            var result = livereLib.util.toJson(data);
            if (result.result == '200') {

                var replyData = result.resultData;

                var eventData = {};
                eventData['type'] = 'livereEvent';
                eventData['key'] = 'getCountComplete';
                eventData['value'] = replyData;

                livereLib.dispatchEvent(eventData);

                livereLib.processComplete();
            }
        });
    };
    this.control.getArticle = function(params) {
        var request = livereLib.url("API_Livere", params);

        jQuery.getJSON(request, function(data) {
            var result = livereLib.util.toJson(data);
            var replyData = result.resultData;

            var eventData = {};
            eventData['type'] = 'livereEvent';
            eventData['key'] = 'getArticleComplete';
            eventData['value'] = replyData;

            livereLib.dispatchEvent(eventData);

            livereLib.processComplete();
        });
    };

    this.processing = false;
    this.wakeUpEvent = null;
    this.processingCount = 0;
    this.control.processing = function(callBackFunc) {
        if (!livereLib.processing) {
            callBackFunc();
        } else {
            ++livereLib.processingCount;
            if (livereLib.util.isEmpty(livereLib.wakeUpEvent)) {
                livereLib.wakeUpEvent = setTimeout(function() {
                    livereLib.processing = false;
                    livereLib.wakeUpEvent = null;
                }, 4000);
            } else {
                alert(livereLib.getMessage("proccesingMsg_8"));
            }
        }
    };

    this.processComplete = function() {
        livereLib.dispatchEvent({
            type: "livereEvent",
            key: "processComplete"
        });
    };

    this.smartloginInit = function() {
        if (!livereLib.dataInited()) {

            livereLib.setRedirectPath();

            var params = {
                redirect_path: livereSharedData.smartLogin.redirect_path,
                smartlogin_seq: smartlogin_seq,
                consumer_seq: consumer_seq
            };

            livereLib.fire(params, "smartLoginStart");
        }
    };

    this.getReply = function(reply_seq) {
        return livereReply.getReplyObject(reply_seq);
    };

    this.getSmartLoginData = function() {
        var u_data = livereSharedData.smartLogin.datas;
        if (u_data != null) {
            var returnObject = {
                linkage_accs: u_data.linkage_accs,
                group_data: u_data.accessable_group_data,
                member_datas: u_data.accessable_group_data ? u_data.accessable_group_data.member_datas : null,
                sync_type: u_data.sync_type,
                sync_acc: u_data.sync_acc,
                custom_script_path: u_data.custom_script_path,
                button_container: u_data.button_container,
                view_container: u_data.view_container,
                checkurl: u_data.checkurl,
                loginurl: u_data.loginurl,
                logouturl: u_data.logouturl
            };
            return returnObject;
        }
        return null;
    };

    this.debug = function(obj) {
        livereLib.util.debug(obj);
    };

    this.getPrimaryDomain = function() {
        var domain_object = null;
        var s_l = livereLib.getSmartLoginData();

        if (s_l != null && s_l.member_datas != null) {
            var prim_mem_seq = s_l.group_data.primary_member_seq;
            jQuery.each(s_l.member_datas, function(ii, vv) {
                if (vv.member_seq == prim_mem_seq) {
                    domain_object = eval(vv.member_domain);
                    return false;
                }
            });
            return domain_object;
        }
        return null;
    };

    this.url = function(urlAddon, params) {
        urlAddon = this.getUrl(urlAddon);

        var paramsString = "";

        if (params != null) {
            paramsString = livereLib.util.objectToParameters(params);
        }

        paramsString = paramsString == "" ? "?" : paramsString + "&";
        paramsString += "dummy=" + Math.random() + "&livereCallback=?";

        if (paramsString.indexOf("smartlogin_seq=") < 0 && livereSharedData.smartLogin.smartlogin_seq)
            paramsString += "&smartlogin_seq=" + livereSharedData.smartLogin.smartlogin_seq;

        if (paramsString.indexOf("consumer_seq=") < 0)
            paramsString += "&consumer_seq=" + livereSharedData.common.consumer_seq;

        if (paramsString.indexOf("rep_seq=") < 0 && livereSharedData.livereReply.rep_data)
            paramsString += "&rep_seq=" + livereSharedData.livereReply.rep_data.rep_seq;

        if (paramsString.indexOf("livere_seq=") < 0 && livereSharedData.livereReply.livere_seq)
            paramsString += "&livere_seq=" + livereSharedData.livereReply.livere_seq;

        if (paramsString.indexOf("?") == 0) {
            paramsString = paramsString.substring(1);
        }

        return livereSharedData.url + "/" + urlAddon + "?" + paramsString;
    };

    this.getUrl = function(val) {
        var charset = this.charset.toUpperCase();
        var flag = (charset == "UTF-8" || charset == "UTF8" || charset == "UTF");

        switch (val) {
            case "upload":
                return flag ? val : "upload_kr";
            case "livereDataLoad":
                return flag ? val : "livereDataLoad_kr";
            case "smartlogin":
                return flag ? val : "smartlogin_kr";
            case "API_Livere":
                return flag ? val : "API_Livere_kr";
            case "External_Auth_API":
                return flag ? val : "External_Auth_API_kr";

            default:
                return val;
        }
    };

    this.cssLoad = function(cssPath) {
        if (!window.livere_cssArray) window.livere_cssArray = Array();
        jQuery(window.livere_cssArray).each(function(ii, vv) {
            if (vv == cssPath) cssPath = null;
            return true;
        });

        if (!livereLib.util.isEmpty(cssPath)) {
            window.livere_cssArray.push(cssPath);
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = cssPath;

            head.appendChild(link);
        }

    };

    this.allCssLoad = function() {
        if (livereSharedData.livereReply.livere_data.load_default_css == '1') {
            var msieversion = livereLib.util.msieversion();
            if( msieversion != 0 && msieversion <= 8 ){
                livereLib.cssLoad("https://101.livere.co.kr/" + livereLib.theme.toUpperCase() + "/default_livere8.css");
                livereLib.cssLoad("https://101.livere.co.kr/" + livereLib.theme.toUpperCase() + "/default_smartlogin8.css");
            }else{
                livereLib.cssLoad("https://101.livere.co.kr/" + livereLib.theme.toUpperCase() + "/default_livere8_gzip.css");
                livereLib.cssLoad("https://101.livere.co.kr/" + livereLib.theme.toUpperCase() + "/default_smartlogin8_gzip.css");
            }

            if (livereSharedData.livereReply.livere_data.load_default_m_css == '1') {
                // Auto Off
                customCssPath = !livereLib.util.isEmpty(livereSharedData.livereReply.livere_data.css_path) ? livereSharedData.livereReply.livere_data.css_path : "";
                customMCssPath = !livereLib.util.isEmpty(livereSharedData.livereReply.livere_data.mobile_css_path) ? livereSharedData.livereReply.livere_data.mobile_css_path : "";

                if (!livereLib.util.isEmpty(customCssPath)) {
                    // PC
                    livereLib.cssLoad(customCssPath);
                } else if (!livereLib.util.isEmpty(customMCssPath)) {
                    // M
                    livereLib.cssLoad("https://101.livere.co.kr/css/default_livere8_m.css");
                    livereLib.cssLoad(customMCssPath);
                }
            } else {
                // Auto On
                if (!livereLib.util.isMobileVisitor()) {
                    // PC
                    customCssPath = !livereLib.util.isEmpty(livereSharedData.livereReply.livere_data.css_path) ? livereSharedData.livereReply.livere_data.css_path : "";

                    if (!livereLib.util.isEmpty(customCssPath)) {
                        livereLib.cssLoad(customCssPath);
                    }
                } else {
                    // M
                    livereLib.cssLoad("https://101.livere.co.kr/css/default_livere8_m.css");
                    customMCssPath = !livereLib.util.isEmpty(livereSharedData.livereReply.livere_data.mobile_css_path) ? livereSharedData.livereReply.livere_data.mobile_css_path : "";

                    if (!livereLib.util.isEmpty(customMCssPath)) {
                        livereLib.cssLoad(customMCssPath);
                    }
                }
            }
        } else {
            customCssPath = !livereLib.util.isEmpty(livereSharedData.livereReply.livere_data.css_path) ? livereSharedData.livereReply.livere_data.css_path : "";
            customMCssPath = !livereLib.util.isEmpty(livereSharedData.livereReply.livere_data.mobile_css_path) ? livereSharedData.livereReply.livere_data.mobile_css_path : "";

            if (!livereLib.util.isEmpty(customCssPath)) {
                // PC
                livereLib.cssLoad(customCssPath);
            } else if (!livereLib.util.isEmpty(customMCssPath)) {
                // M
                livereLib.cssLoad(customMCssPath);
            }
        }
    }

    this.setRegdate = function(reply) {
        reply.reply_regdate = reply.regdate.year + 1900 + "-" + livereLib.util.addZero(parseInt(reply.regdate.month) + 1) + "-" + livereLib.util.addZero(reply.regdate.date);
        reply.reply_regdate += " " + livereLib.util.addZero(reply.regdate.hours) + ":" + livereLib.util.addZero(reply.regdate.minutes) + ":" + livereLib.util.addZero(reply.regdate.seconds);
    };

    this.getMessage = function(messageKey) {
        var message = null;
        if (!livereLib.util.isEmpty(window.livereCustomMessage)) {
            message = eval("window.livereCustomMessage." + messageKey);
        }

        if(livereLib.util.isEmpty(message) && livereSharedData.livereReply.message_emotion) {
            message = eval("livereSharedData.livereReply.message_emotion." + messageKey);
        }

        if(livereLib.util.isEmpty(message) && livereSharedData.livereReply.initMessage) {
            message = eval("livereSharedData.livereReply.initMessage." + messageKey);
        }

        return message;
    };

    this.userActionHistoryArrays = {};
    this.userActionHistory = function(type, seq) {
        var arrObject = eval("livereLib.userActionHistoryArrays." + type);
        if (!arrObject) {
            arrObject = eval("livereLib.userActionHistoryArrays." + type + " = Array();");
        }

        var result = false;
        jQuery(arrObject).each(function(ii, vv) {
            if (seq == vv) {
                result = true;
                return false;
            }
        });

        if (!result) arrObject.push(seq);

        return result;
    }

    this.util = {};
    this.util.matchingRegExp = function(reply) {
        var regExp = {
            social  : new RegExp("(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-6][0-9]{6}", "gi"),
            passport: new RegExp("[a-zA-Z]{1,2}[0-9]{7,8}", "gi"),
            driver  : new RegExp("[0-9]{2}[-][0-9]{6}[-][0-9]{2}", "gi"),
            phone : new RegExp("01[016789][-~]([0-9]{3,4})[-~]([0-9]{4})" ,"gi"),
            credit : new RegExp("[34569][0-9]{3}-~?[0-9]{4}-~?[0-9]{4}-~?[0-9]{4}","gi"),
            health : new RegExp("[1257][-~][0-9]{10}","gi"),//|'/\s/'
            bank : new RegExp("([0-9]{2}[-~][0-9]{2}-~?[0-9]{6}|[0-9]{3}-~?([0-9]{5,6}[-~][0-9]{3}|[0-9]{6}-~?[0-9]{5}|[0-9]{2,3}-~?[0-9]{6}|[0-9]{2}-~?[0-9]{7}|[0-9]{2}-~?[0-9]{4,6}-~?[0-9]|[0-9]{5}-~?[0-9]{3}-~?[0-9]{2}|[0-9]{2}-~?[0-9]{5}[-~.][0-9]{3}|[0-9]{4}-~?[0-9]{4}-~?[0-9]{3}|[0-9]{6}[-~.][0-9]{2}-~?[0-9]{3}|[0-9]{2}-~?[0-9]{2}-~?[0-9]{7})|[0-9]{4}-~?([0-9]{3}-~?[0-9]{6}|[0-9]{2}-~?[0-9]{6}-~?[0-9])|[0-9]{5}-~?[0-9]{2}-~?[0-9]{6}|[0-9]{6}-~?[0-9]{2}-~?[0-9]{5,6})","gi"),
            foreinger : new RegExp("([01][0-9]{5}[~-]+[1-8][0-9]{6}|[2-9][0-9]{5}[~-]+[1256][0-9]{6})","gi")
        };

        var repl = {
            social  : "******-*******",
            passport: "********",
            driver  : "**-******-**",
            phone : "***-****-****",
            credit : "****-****-****-****",
            health : "*-**********",
            bank : "**-**-******",
            foreinger : "***"
        };

        for(var i in regExp) {
            if(regExp[i].test(reply) === true) {
                reply = reply.replace(regExp[i], repl[i]);
            }
        }
        return reply;
    };

    this.util.recobell = function(str) {
        return str.replace("&rccode=lvRc", "").replace("?rccode=lvRc", "");
    };

    this.util.isEmpty = function(value) {
        return (typeof(value) == 'undefined' || value == null || value == '' || value == 'null') ? true : false;
    };

    this.util.getLoginPageURL = function(serviceName) {
        var url = livereSharedData.common.api_login_url + "?service=" + serviceName + "&redirect_path=";
        url += typeof(livereSharedData.smartLogin.redirect_path) == 'string' ? livereSharedData.smartLogin.redirect_path : encodeURIComponent(window.parent.location.href);

        return url;
    };

    this.util.objectToParameters = function(object) {

        var paramsString = "";

        jQuery.each(object, function(ii, vv) {
            paramsString += (ii + "=" + encodeURIComponent(vv) + "&");
        });

        if (paramsString != "") {
            var value = paramsString.substring(paramsString.length - 1);
            if (value == "&")
                paramsString = paramsString.substring(0, paramsString.length - 1);
        }

        return paramsString;
    };

    this.util.addZero = function(val) {
        return val < 10 ? "0" + val : val;
    };

    this.util.isMobileVisitor = function() {
        var mobileKeyWords = new Array('iphone', 'ipod', 'blackberry', 'android', 'windows ce', 'lg', 'mot', 'samsung', 'sonyericsson', 'iemobile');
        var padKeyWords = new Array('ipad', 'shw-m180s', 'shw-m380k' ,'shw-m480k' , 'sm-p600');
        var returnFlag = false;
        jQuery(mobileKeyWords).each(function(ii, vv) {
            var agent = navigator.userAgent.toLowerCase();
            if (agent.match(vv) != null) {
                returnFlag = true;
                return false;
            }
        });

        if (returnFlag) {
            jQuery(padKeyWords).each(function(ii, vv) {
                var agent = navigator.userAgent.toLowerCase();
                if (agent.match(vv) != null) {
                    returnFlag = false;
                    return false;
                }
            });
        }

        return returnFlag;
    };

    this.util.isTouchDevice = function() {
        return !!("ontouchstart" in window);
    };

    this.util.replaceAll = function(str, orgStr, repStr) {
        return str.split(orgStr).join(repStr);
    };

    this.util.toolTip = function(obj) {
        if (livereLib.notUseTooltip) return false;

        jQuery.each(obj, function(ii, vv) {
            jQuery(vv).bind("mouseenter focus", function() {

                if (jQuery(this).attr("rel") != "tooltip") return false;

                jQuery(".livereToolTip").remove();
                var tooltip = jQuery("<div class='livereToolTip'><p class='livereToolTipInner'></p></div>");

                if (!livereLib.util.isEmpty(jQuery(vv).attr("aria-label"))) {
                    tooltip.find(".livereToolTipInner").html(jQuery(vv).attr("aria-label"));
                } else if (!livereLib.util.isEmpty(jQuery(vv).attr("title"))) {
                    tooltip.find(".livereToolTipInner").html(jQuery(vv).attr("title"));
                } else {
                    tooltip.find(".livereToolTipInner").html(jQuery(vv).find("span").text());
                }

                jQuery("body").append(tooltip);

                var objOffsetTop = jQuery(vv).offset().top;
                var objOffsetLeft = jQuery(vv).offset().left;

                var tooltipOffsetTop = objOffsetTop - tooltip.outerHeight(true);
                var tooltipOffsetLeft = objOffsetLeft - tooltip.outerWidth(true) / 2 + jQuery(vv).outerWidth(true) / 2 - 4;

                var objScrollTop = jQuery(window).scrollTop() + tooltip.outerHeight(true);

                if (objScrollTop >= objOffsetTop) { // arrow top
                    tooltipOffsetTop = objOffsetTop + jQuery(vv).outerHeight(true);
                    tooltip.addClass("livereToolTipArrow_top");
                } else { // arrow bottom
                    tooltip.addClass("livereToolTipArrow_bottom");
                }

                var tooltipOverflowSize = objOffsetLeft + tooltip.outerWidth(true) - jQuery(window).width();

                if (tooltipOffsetLeft > 0 && tooltipOverflowSize > 0) {
                    tooltipOffsetLeft = objOffsetLeft - tooltipOverflowSize - (jQuery(window).width() - (objOffsetLeft + jQuery(vv).outerWidth(true)));

                    if (tooltipOffsetLeft < 0) { // arrow center
                        tooltipOffsetLeft = objOffsetLeft - tooltip.outerWidth(true) / 2 + jQuery(vv).outerWidth(true) / 2;
                        tooltip.addClass("livereToolTipArrow_center");
                    } else { // arrow right
                        tooltip.addClass("livereToolTipArrow_right");
                    }
                } else { // arrow left
                    if (tooltipOffsetLeft < 0) {
                        tooltipOffsetLeft = objOffsetLeft;
                        tooltip.addClass("livereToolTipArrow_left");
                    } else { // arrow center
                        tooltip.addClass("livereToolTipArrow_center");
                    }
                }

                tooltip.css({
                    "top": tooltipOffsetTop,
                    "left": tooltipOffsetLeft
                });

            }).bind("click mouseleave blur", function() {
                jQuery(".livereToolTip").remove();
            });
        });
    };

    this.util.toJson = function(str) {
        return str;
    };

    this.util.viewExtended = false;

    this.util.debug = function(obj, isAppend) {
        txtValue = "";

        if (typeof(obj) == 'string') {
            txtValue = obj;
        } else {
            obj = eval(obj);

            for (var x in obj) {
                txtValue += [x, obj[x]] + "\n\r\n";
            }
        }

        if (jQuery("#debugTextArea").length > 0) {
            txtValue = new Date().toString() + "\r\n" + txtValue;

            txtValue = isAppend ? txtValue + "\r\n\r\n=======================================\r\n\r\n" + jQuery("#debugTextArea").val() : txtValue;

            jQuery("#debugTextArea").val(txtValue);
        }

    };

    this.util.msieversion= function(){
        var ua = window.navigator.userAgent
        var msie = ua.indexOf ( "MSIE " )
        if ( msie > 0 )      // If Internet Explorer, return version number
            return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )))
        else                 // If another browser, return 0
            return 0
    };

    this.util.beforeRegdate = function(regdate) {
        var text = livereLib.getMessage('report').split('|');
        text = jQuery.map(text, function(a) { return jQuery.trim(a) } );

        var r_regdate = livereLib.util.replaceAll(regdate,'-','/'),
            nowDate = new Date().getTime(),
            writeDate = new Date(r_regdate).getTime(),
            interval = nowDate - writeDate,
            second = 1000,
            minute = second*60,
            hour = minute*60,
            day = hour*24,
            month = day*30,
            year = month*12,
            result = text[0] + ' ';

        if(parseInt(interval/second) < 59) {
            return text[1];
        } else if(parseInt(interval/minute) < 59) {
            result += parseInt(interval/minute) + text[2];
        } else if(parseInt(interval/hour) < 23) {
            result += parseInt(interval/hour) + text[3];
        } else if(parseInt(interval/day) < 32) {
            result += parseInt(interval/day) + text[4];
        } else if(parseInt(interval/month) < 12) {
            result += parseInt(interval/month) + text[5];
        } else {
            var remainder = interval%year;

            result += parseInt(interval/year) + text[6];
            if(parseInt(remainder/month) > 0) result += parseInt(remainder/month) + text[5];
        }

        return result;
    }

};

SyncManager = function() {

    this.tryLogin = false;

    this.syncStart = function() {
        if (syncManager.syncMembership) {
            var syncService = eval(syncManager.syncMembership);

            if (!syncManager.tryLogin) {
                syncManager.tryLogin = true;

                var syncProcess = function(additionalResult) {
                    if (syncService.member_islogin != 1 && !livereLib.util.isEmpty(additionalResult.user_id) && !livereLib.util.isEmpty(additionalResult.user_name)) {
                        var params = {};
                        params['member_id'] = additionalResult.user_id;
                        params['member_name'] = additionalResult.user_name;

                        if (!livereLib.util.isEmpty(additionalResult.user_icon)) {
                            params['member_icon'] = additionalResult.user_icon;
                        } else if (!livereLib.util.isEmpty(additionalResult.user_image)) {
                            params['member_icon'] = additionalResult.user_image;
                        }

                        var request = livereLib.url("External_Auth_API", params);

                        jQuery.getJSON(request, livereLib.control.renewMemberProcess);
                    }

                    if (!livereLib.util.isEmpty(additionalResult.user_id) && syncService.member_id != additionalResult.user_id) {
                        livereLib.fire({
                            reloadmode: true
                        }, 'livereLogout');
                    }
                };

                if (syncManager.syncAccessType == 1 || syncManager.syncAccessType == 2) {
                    jQuery.getScript(syncManager.checkurl, function() {
                        if (typeof(additionalResult) == 'object') {
                            syncProcess(additionalResult);
                        } else {
                            if (syncManager.syncAccessType == 2 && syncService.member_islogin == 1) {
                                livereLib.fire({
                                    member_seq: syncService.member_seq
                                }, "serviceLogout");
                            }
                        }
                    });

                } else {
                    if (typeof(additionalResult) == 'object') {
                        syncProcess(additionalResult);
                    } else {
                        if (syncManager.syncAccessType == 4 && syncService.member_islogin == 1) {
                            livereLib.fire({
                                member_seq: syncService.member_seq
                            }, "serviceLogout");
                        }
                    }
                }

            }
        }

    };

    this.syncOff = function() {
        jQuery.getScript(syncManager.checkurl, function() {
            if (typeof(additionalResult) == 'object') {
                if (syncManager.logouturl.indexOf("javascript:") == 0) {
                    eval(syncManager.logouturl);
                } else {
                    window.location.href = syncManager.logouturl;
                }
            }
        });
    };

    this.syncCheck = function() {
        if (syncManager.syncMembership) {
            syncManager.syncStart();
        }
    };

    this.openLoginGate = function(serviceName) {

        if(serviceName === 'guest') return;

        if(livereLib.switchMobileView){
            window.parent.location.href=livereLib.util.getLoginPageURL(serviceName);
        }else{
            var width = serviceName === 'facebook' ? '1030' : '500';
            var windowOption = 'width=' + width + ', height=710, top=100, left=' + document.body.clientWidth / 4 + ', resizable=no, scrollbars=no, status=no;';
            window.open(livereLib.util.getLoginPageURL(serviceName), '', windowOption);
        }
    }

    this.init = function() {
        var smartlogindata = livereLib.getSmartLoginData();
        if (smartlogindata.sync_type != '0') {
            syncManager.syncAccessType = smartlogindata.sync_type;
            syncManager.syncMembership = smartlogindata.sync_acc;

            var re_path = livereSharedData.smartLogin.redirect_path;
            syncManager.checkurl = smartlogindata.checkurl;
            if (syncManager.checkurl.indexOf("?") > 0) {
                syncManager.checkurl += "&dummy=" + Math.random();
            } else {
                syncManager.checkurl += "?dummy=" + Math.random();
            }
            syncManager.loginurl = smartlogindata.loginurl.replace("[[REDIRECT_URL]]", re_path);
            syncManager.logouturl = smartlogindata.logouturl.replace("[[REDIRECT_URL]]", re_path);

            var service = eval(syncManager.syncMembership);

            service.loginGate = function(url) {
                if (!livereLib.util.isEmpty(syncManager.loginurl)) {
                    if (syncManager.loginurl.indexOf("javascript:") == 0) {
                        eval(syncManager.loginurl);
                    } else if (syncManager.loginurl.indexOf("popup:") == 0) {
                        var url = syncManager.loginurl.replace("popup:", "").split(",");
                        window.open(url[0], "login", "width=" + url[1] + ",height=" + url[2]);
                    } else {
                        var params = {
                            command: "redirect",
                            redirect_path: syncManager.loginurl
                        };
                        var request = livereLib.url("API_Livere", params);
                        window.location.href = request;
                    }
                }
            };

            syncManager.syncCheck();
        }
    };

};

/*
 *  livere js area
 */

HTMLFactory = function() {
    this.loadingBar = function() {
        var html = '';

        html += '<div class="lvloadingWrapper" style="text-align: center;">';
        html += '   <img src="//cdn-city.livere.com/images/LR_loading.gif">';
        html += '</div>';

        return html;
    }

    this.defaultHtml = function() {
        var formHTML = "";

        formHTML += "<div id='liverePlugIn' class='" + livereLib.libType + "-type " + (livereLib.isLogged() ? "writeFormLogged" : "writeFormNotLogged") + "' style='display:none;'>";
        formHTML += "   <h3 class='livereNone'>" + livereLib.getMessage("pluginHeadTitle_8") + "</h3>";
        formHTML += "   <div id='livereWriteForm' class='livereWriteForm' from='parentWriteForm'>";
        formHTML += "       <div id='smart_view_container'></div>"
        formHTML += "       <div class='livereWriteFormTop'>";
        formHTML += "           <span class='livereSNSLoginTitle'>" + livereLib.getMessage("socialLogin_8") + "</span>";
        formHTML += "           <div class='livereSNSLoginIconContainer'>";
        formHTML += "               <ul class='livereLogged livereNone'></ul>";
        formHTML += "               <ul class='livereNotLogged'></ul>";
        formHTML += "           </div>";
        formHTML += '           <div id="livereGuide">';
        formHTML += '               <button id="livereGuideBtn" type="button">';
        formHTML += '                   <span>' + livereLib.getMessage('me2dayClose_me2dayAnnouncement') + '</span>';
        formHTML += '               </button>';
        formHTML += '               <div class="livereGuideLayer livereGuideClose">';
        formHTML += '                   <span class="livereGuideCloseWrapper">';
        formHTML += '                       <button class="livereGuideBtnCloseBtn livereGuideClose" type="button">';
        formHTML += '                           <span class="livere_t_indent">닫기</span>';
        formHTML += '                       </button>';
        formHTML += '                   </span>';
        formHTML += '                   <span>';
        formHTML += '                       ' + livereLib.getMessage('me2dayClose_bodyText') + '<br/>';
        formHTML += '                       ' + livereLib.getMessage('me2dayClose_livereAnnouncement') + '<br/>';
        formHTML += '                       ' + livereLib.getMessage('me2dayClose_link') + '';
        formHTML += '                   </span>';
        formHTML += '               </div>';
        formHTML += '           </div>';
        formHTML += "       </div>";
        formHTML += "       <div class='livereWriteFormMiddle'>";
        formHTML += "           <div class='livereWriteFormMiddleRightContainer'>";
        formHTML += "               <label for='livere_contentText' class='livereNone'>" + livereLib.getMessage("contentInputArea") + "</label>";
        formHTML += "               <ul class='livereWriteFormMiddleRight livereWriteFormWrapper'>";
        formHTML += "                   <li class='livereWriteParamsForm livereContentTextForm livereSlideHide'>";
        formHTML += "                       <ul class='livereAccInfoWrapper'>";
        formHTML += "                           <p class='livereAccInfo'></p>";
        formHTML += "                       </ul>";
        if (!livereLib.switchMobileView) {
            formHTML += "                       <div class='livereWriteFromMiddleLeft'>";
            formHTML += "                           <ul class='liverePrimaryStatus'>";
            formHTML += "                               <li>";
            formHTML += "                                   <span class='liverePrimaryThumb'>";
            formHTML += "                                       <img src='https://101.livere.co.kr/images/_.gif'/>";
            formHTML += "                                   </span>";
            formHTML += "                               </li>";
            formHTML += "                           </ul>";
            formHTML += "                       </div>";
        };
        formHTML += "                       <ul class='livereWriteParamsFormData'>";
        formHTML += "                           <li>";
        formHTML += "                               <input id='livere_short_url' name='livere_short_url' type='hidden' />";
        formHTML += "                               <input id='livere_name' name='livere_name' type='hidden' />";
        formHTML += "                               <input id='livere_parent_seq' name='livere_parent_seq' type='hidden' />";
        formHTML += "                               <textarea tabindex='0' id='livere_contentText' class='livere_contentText";
        if (livereLib.isLogged()) {
            formHTML += " livere_outline_" + livereLib.getPrimaryDomain().member_domain;
        };
        formHTML += "' name='livere_content' targetName='livereParentStrCount' placeholder='" + livereLib.getMessage('pltfrm_txt2') + "' title='" + livereLib.getMessage("contentInputArea") + "' aria-label='" + livereLib.getMessage("contentInputArea") + "'>" + livereLib.getMessage("title") + "</textarea>";
        formHTML += "                           </li>";
        formHTML += "                       </ul>";
        formHTML += "                       <ul id='livereFunctionWrapper' class='livereFunctionWrapper'>";
        formHTML += "                           <li class='livereTextCountWrapper'>";
        formHTML += "                               <strong class='livereParentStrCount'>0</strong>/<span id='livereStrMaxCount'>" + livereSharedData.livereReply.livere_data.content_maxlen + "</span>";
        formHTML += "                           </li>";
        formHTML += "                       </ul>";
        formHTML += "                   </li>";
        formHTML += "                   <li id='livereWriteFormMiddleBottom' class='livereWriteFormMiddleBottom'>";
        formHTML += "                       <button type='button' id='livereWriteBtn' class='livereWriteBtn livereBtn2'><span class='livereFont5'>" + livereLib.getMessage("sendBtn") + "</span></button>";
        formHTML += "                       <button id='wf-share-btn' class='livereBtn3'>";
        formHTML += "                           <span class='share-count-wrapper'>" + livereLib.getMessage('me2dayClose_layerClose') + " <span class='share-count'>0</span><span class='text-indent icon-gray-down'>" + livereLib.getMessage("smartLoginHelp_8") + "</span></span>";
        formHTML += "                       </button>";
        formHTML += "                   </li>";
        formHTML += "               </ul>";
        formHTML += "           </div>";
        formHTML += "       </div>";
        formHTML += "   </div>";
        formHTML += "   <div id='livereHome'>";
        formHTML += "       <span id='livereHomeBtn'>";
        formHTML += "           <a href='http://www.livere.com' title='" + livereLib.getMessage("livereHome_8") + " - " + livereLib.getMessage('openWindow') + "' aria-label='" + livereLib.getMessage("livereHome_8") + " - " + livereLib.getMessage('openWindow') + "' target='_blank'>";
        formHTML += "               <span class='text-indent logo'>LiveRe</span>";
        formHTML += "           </a>";
        formHTML += "       </span>";
        formHTML += "   </div>";
        formHTML += "</div>";

        return formHTML;
    };

    this.livereWriteFormHtml = function() {
        var formHTML = "";

        formHTML += "<div class='livereWriteForm' from='childWriteForm'>";
        formHTML += "   <div class='livereWriteFormTop'>";
        formHTML += "       <span class='livereSNSLoginTitle'>" + livereLib.getMessage("socialLogin_8") + "</span>";
        formHTML += "           <div class='livereSNSLoginIconContainer'>";
        formHTML += "               <ul class='livereLogged' class='livereNone'></ul>";
        formHTML += "               <ul class='livereNotLogged'></ul>";
        formHTML += "           </div>";
        formHTML += "       </div>";
        formHTML += "       <div class='livereWriteFormMiddle'>";
        formHTML += "           <div class='livereWriteFormMiddleRightContainer'>";
        formHTML += "               <label for='livere_contentText' class='livereNone'>" + livereLib.getMessage("contentInputArea") + "</label>";
        formHTML += "               <ul class='livereWriteFormMiddleRight livereWriteFormWrapper'>";
        formHTML += "                   <li class='livereWriteParamsForm livereContentTextForm livereSlideHide'>";
        formHTML += "                       <ul class='livereAccInfoWrapper'>";
        formHTML += "                           <p class='livereAccInfo'></p>";
        formHTML += "                       </ul>";
        if (!livereLib.switchMobileView) {
            formHTML += "                   <div class='livereWriteFromMiddleLeft'>";
            formHTML += "                       <ul class='liverePrimaryStatus'>";
            formHTML += "                           <li>";
            formHTML += "                               <span class='liverePrimaryThumb'>";
            formHTML += "                                   <img src='https://101.livere.co.kr/images/_.gif'/>";
            formHTML += "                               </span>";
            formHTML += "                           </li>";
            formHTML += "                       </ul>";
            formHTML += "                   </div>";
        };
        formHTML += "                       <ul class='livereWriteParamsFormData'>";
        formHTML += "                           <li>";
        formHTML += "                               <textarea tabindex='0' id='livere_childContentText' class='livere_contentText";
        if (livereLib.isLogged()) {
            formHTML += " livere_outline_" + livereLib.getPrimaryDomain().member_domain;
        };
        formHTML += "' name='livere_content' targetName='livereChildStrCount' placeholder='" + livereLib.getMessage('pltfrm_txt2') + "' title='" + livereLib.getMessage("contentInputArea") + "' aria-label='" + livereLib.getMessage("contentInputArea") + "'>" + livereLib.getMessage("title") + "</textarea>";
        formHTML += "                           </li>";
        formHTML += "                       </ul>";
        formHTML += "                       <ul class='livereFunctionWrapper'>";
        formHTML += "                           <li class='livereTextCountWrapper'>";
        formHTML += "                               <strong class='livereChildStrCount'>0</strong>/<span class='livereStrMaxCount'>" + livereSharedData.livereReply.livere_data.content_maxlen + "</span>";
        formHTML += "                           </li>";
        formHTML += "                       </ul>";
        formHTML += "                   </li>";
        formHTML += "                   <li class='livereWriteFormMiddleBottom'>";
        formHTML += "                       <button type='button' class='livereWriteBtn livereBtn2'><span class='livereFont5'>" + livereLib.getMessage("sendBtn") + "</span></button>";
        formHTML += "                       <button class='share-btn' class='livereBtn3'>";
        formHTML += "                           <span class='share-count-wrapper'>" + livereLib.getMessage('me2dayClose_layerClose') + " <span class='share-count'>0</span><span class='text-indent icon-gray-down'>" + livereLib.getMessage("smartLoginHelp_8") + "</span></span>";
        formHTML += "                       </button>";
        formHTML += "                   </li>";
        formHTML += "               </ul>";
        formHTML += "           </div>";
        formHTML += "       </div>";
        formHTML += "   </div>";

        return formHTML;
    }

    this.replyPostingLayer = function() {
        var outLayer = '<div id="layer-shared" data-type="revival"></div>';
        var innerLayer = '<ul class=""></ul>';

        var data = livereLib.getSmartLoginData();

        var $ol = jQuery(outLayer);
        var $il = jQuery(innerLayer);
        var $pc = jQuery(livereReply.htmlFactory.replyPostingCheck(data));

        innerLayer = $il.append($pc);
        outLayer = $ol.append(innerLayer);

        jQuery(outLayer).find('.layer-shared-btn').click(function() {
            var $shareBtn = jQuery(this);
            var service = $shareBtn.attr('data-type');

            if($shareBtn.hasClass('btn-on')){
                livereReply.iconClick(service, jQuery(this));
                $shareBtn.removeClass('btn-on').addClass('btn-off');
                $shareBtn.find('span').text('OFF');
            }else if($shareBtn.hasClass('btn-off')){
                livereReply.iconClick(service, jQuery(this));
                $shareBtn.removeClass('btn-off').addClass('btn-on');
                $shareBtn.find('span').text('ON');
            }else if($shareBtn.hasClass('btn-login')){
                livereReply.iconClick(service, jQuery(this));
                jQuery(outLayer).remove();
            }
        });


        return outLayer;
    }

    this.replyPostingCheck = function(data) {
        var postingForm = '',
            login = '',
            logout = '',
            memberDatas = [];

        jQuery.each(data.member_datas, function(ii, vv) {
            memberDatas.push(vv.member_domain);
        });

        jQuery.each(data.linkage_accs, function(ii, vv) {
            var acc = eval(vv);

            if(jQuery.inArray(vv, livereLib.postingSns) > -1){
                if(jQuery.inArray(vv, memberDatas) > -1){
                    login += livereReply.htmlFactory.replyPostingCheckHtml(vv, acc.post, acc.member_ispost);
                }else{
                    logout += livereReply.htmlFactory.replyPostingCheckHtml(vv, acc.post);
                }
            }
        });

        postingForm = login + logout;

        return postingForm;
    }

    this.replyPostingCheckHtml = function(name, title, post) {
        var html = '';

        html += '<li>';
        html += '   <span class="sns-name font-dark-gray bg-' + name + (typeof post === 'undefined' ? '-off' : '') +'">' + title + '</span>';
        html += '   <button type="button" clickType="snsPostingCheck" data-type="' + name + '" class="layer-shared-btn ' + (post === 1 ? "btn-on" : post === 0 ? "btn-off" : "btn-login") + '">';
        html += '       <span>' + (post === 1 ? "ON" : "OFF") + '</span>';
        html += '   </button>';
        html += '</li>';

        return html;
    }

    this.livereCard = function(data) {
        var thumbnail = data.thumbnail;
        thumbnail = thumbnail === "" || thumbnail === "undefined" ? "https://101.livere.co.kr/images/img_blank.png" : thumbnail;

        var html = '';
        html += '<li class="livereWriteCardForm">';
        html += '   <a href="' + data.url + '" class="livereCardLink" target="_blank">';
        html += '       <div class="livereCardDescription">';
        html += '           <button type="button" class="livereCardCancelBtn" data-type="link">';
        html += '               <span class="text-indent">' + livereLib.getMessage("deletebtn") + '</span>';
        html += '           </button>';
        html += '           <div class="livereCardDescriptionImg">';
        html += '               <img src="' + thumbnail + '"alt="Thumbnail_Image" onerror="">';
        html += '           </div>';
        html += '           <div class="livereCardDescriptionContent">';
        html += '               <span class="livereCardTitle">' + data.title + '</span>';
        html += '               <span class="livereCardContent">' + data.description + '</span>';
        html += '               <span class="livereCardUrl">' + data.url + '</span>';
        html += '           </div>';
        html += '       </div>';
        html += '   </a>';
        html += '</li>';

        return html;
    }

    this.isMobileLogin = function() {
        var html = "";

        html += "<div id='livereMobileLoginContainer'>";
        html += "   <button type='button' class='livereIsMobileBtn'><span>" + livereLib.getMessage("smartLoginNotLoggedBtn_8") + "</span></button>";
        // html += "    <dl id='livereShareSNS' class='livereShareSNSWrapper'>";
        // html += "        <dt><span class='livereFont6'>" + livereLib.getMessage("shareSNS_8") + "</span></dt>";
        // html += "    </dl>";
        html += "</div>";

        return html;
    };

    this.isLoggedSNS = function(domain) {
        var html = "";
        html += "<dd class='livereShareSNS livereFavicon_mobile_L livereFavicon_mobile_L_" + domain + " livere_t_indent' rel='tooltip' aria-label='" + eval(domain).title + "' >" + eval(domain).title + "</dd>";
        return html;
    };

    this.all_logout = function() {
        var all_logout = "";

        all_logout += "<button type='button' class='livereLogoutBtn livereBtn3'><span class='livereFont6'>" + livereLib.getMessage("all_logout") + "</span></button>";

        return all_logout;
    };

    this.linkage_accountHtmlObject = function(domain) {
        var accObject = "<li class='livere_" + domain.name + "'></li>",
            accObject_btn = "";

        accObject_btn += "<button type='button' class='livereSNSLoginIcon livereClick livereBtn1' clickType='snsLoginBtn' rel='tooltip'>";
        domain.member_islogin !== 1 ?
            accObject_btn += "<span class='livereSNSImage_B livere_t_indent'>" + livereLib.getMessage("loginPageOpen_8") + "</span>" :
            accObject_btn += "<span class='livereSNSImage_B livere_t_indent'>" + livereLib.getMessage("primarySet_8") + "</span>";
        accObject_btn += "</button>";

        accObject_btn = livereLib.util.replaceAll(accObject_btn, "#DOMAIN#", domain.title);

        accObject = jQuery(accObject);
        accObject_btn = jQuery(accObject_btn);

        accObject.append(accObject_btn);

        return accObject;
    };

    this.setPrimarySNSFavicon = function() {
        var setPrimarySNSFavicon = "<span class='liverePrimarySNSFavicon livere_t_indent'>" + livereLib.getMessage("isPrimary_8") + "</span>";

        return setPrimarySNSFavicon;
    };

    this.defaultListHeader = function() {
        var listHeaderHTML = "",
            m_total_count = livereLib.getMessage("replyTotalCount_8").split('#');

        listHeaderHTML += "<div id='livereReplySort'>";
        if(livereLib.switchMobileView){
            listHeaderHTML += " <strong id='livereReplyCountWrapper' class='livereFont8'>" + m_total_count[2] + " <b id='livereReplyCount' class='livereFont4'>" + livereSharedData.livereReply.rep_data.total_count + "</b>"+ m_total_count[3] +"</strong>";
        }else{
            listHeaderHTML += " <strong id='livereReplyCountWrapper' class='livereFont8'>" + m_total_count[0] + " <b id='livereReplyCount' class='livereFont4'>" + livereSharedData.livereReply.rep_data.total_count + "</b>"+ m_total_count[1] +"</strong>";
        }
        listHeaderHTML += " <ul id='livereSortTabWrapper'>";
        listHeaderHTML += "     <li id='livereSort_new_wrapper'><button type='button' id='livereSort_new' class='livereSortTabBtn livereBtn3 livereSorted'><span class='livereFont4'>" + livereLib.getMessage("time") + "</span></button></li>";
        listHeaderHTML += "     <li id='livereSort_good_wrapper'><button type='button' id='livereSort_good' class='livereSortTabBtn livereBtn3'><span>" + livereLib.getMessage("good") + "</span></button></li>";
        listHeaderHTML += "     <li id='livereSort_mine_wrapper' style='display:none;'><button type='button' id='livereSort_mine' class='livereSortTabBtn livereBtn3'><span>" + livereLib.getMessage("bad") + "</span></button></li>";
        listHeaderHTML += " </ul>";
        listHeaderHTML += "</div>";
        listHeaderHTML += "<div id='livereReplyWrapper'></div>";
        listHeaderHTML += "<div id='livereNavigatorWrapper'></div>";

        return listHeaderHTML;
    };

    this.defaultParentReplyHtml = function(reply) {
        var member_domain_Upper = reply.member_domain.substr(0, 1).toUpperCase() + reply.member_domain.substr(1, reply.member_domain.length);
        var wrapper = "<div class='livereParentReplyWrapper'></div>";

        var replyThumb = "";
        var acc = eval(reply.member_domain);

        reply.member_url != "" ?
            replyThumb += "<button type='button' class='livereReplyThumb livereReplyTumb_" + reply.member_domain + "' rel='tooltip' aria-label='" + livereLib.getMessage("profilePageOpen_8") + "' title='" + livereLib.getMessage("profilePageOpen_8") + "'>" :
            replyThumb += "<button type='button' class='livereReplyThumb livereReplyTumb_" + reply.member_domain + " livereReplyNoProf' title='" + acc.title + livereLib.getMessage('livereReplyThumbTitle') + "'>";

        if (reply.member_icon.indexOf("api.twitter.com/1/users") > -1)
            reply.member_icon = "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png";

        if (livereLib.isSecure) {
            if (reply.member_domain == "twitter" || reply.member_domain == "facebook") {
                replyThumb += " <img class='livereReplyThumb_L' alt='" + livereLib.getMessage("profileImg_8") + "' src='" + reply.member_icon.replace("http://", "https://") + "'/>";
            } else if (reply.member_domain == "cyworld") {
                replyThumb += " <img class='livereReplyThumb_L' alt='" + livereLib.getMessage("profileImg_8") + "' src='https://101.livere.co.kr/images/ver8/unknown_profile.gif'/>";
            } else {
                replyThumb += " <img class='livereReplyThumb_L' alt='" + livereLib.getMessage("profileImg_8") + "' src='" + reply.member_icon.replace("http://", "https://secure.livere.co.kr:8443/") + "'/>";
            }
        } else {
            replyThumb += " <img class='livereReplyThumb_L' alt='" + livereLib.getMessage("profileImg_8") + "' src='" + reply.member_icon + "'/>";
        }

        if (!livereLib.switchMobileView) {
            if (reply.member_domain != "guest") {
                replyThumb += " <span class='livereThumbFavicon livereFavicon_L livereFavicon_L_" + reply.member_domain + "'></span>";
            }
        }
        replyThumb += "</button>";

        livereLib.snsName = eval(reply.member_domain);

        replyThumb = livereLib.util.replaceAll(replyThumb, "#DOMAIN#", livereLib.snsName.post);
        reply.replyThumb = jQuery(replyThumb);

        var replyBody = "";
        replyBody += "<div class='livereReplyBodyContainer' data-seq='" + reply.reply_seq + "'>";
        replyBody += "  <dl class='livereReplyBody'>";
        replyBody += "      <dt class='livereArticleUserInfoWrapper' data-seq='" + reply.member_group_seq + "'>";
        replyBody += "          <ul class='livereArticleUserInfo'>";

        if ( reply.member_url != "" ){
            replyBody += "          <li class=" + (!livereLib.switchMobileView ? 'livereReplyWriteName' : '') + "><button type='button' class='livereReplyWriterName livereBtn3' aria-label='" + livereLib.getMessage("profilePageOpen_8") + "' title='" + livereLib.getMessage("profilePageOpen_8") + "'>";
        } else {
            replyBody += "          <li class=" + (!livereLib.switchMobileView ? 'livereReplyWriteName' : '') + ">";
            replyBody += "              <button type='button' class='livereReplyWriterName livereBtn3 livereReplyNoProf' >"
        }

        if (livereLib.switchMobileView) {
            replyBody += "              <span class='livereFavicon_mobile_L livereFavicon_mobile_L_" + reply.member_domain + " livereFont9'>" + reply.name + "</span>";
        } else {
            replyBody += "              <span class='livereFont11'>" + reply.name + "</span>";
        }

        replyBody += "                  </button>";
        replyBody += "              </li>";
        replyBody += "              <li class='livereReplyWritedRegdate'><span class='livereFont3'>" + livereLib.util.beforeRegdate(reply.reply_regdate) + "</span></li>";
        var septSNS = "";
        if (!livereLib.util.isEmpty(reply.septSNSObj)) {
            septSNS += "<li class='livereSharedSNSWrapper'>";
            jQuery.each(reply.septSNSObj.reverse(), function(ii, vv) {
                var sns = eval(vv);
                septSNS += "<dd class='livereSharedSNS livereFavicon_L livereFavicon_L_" + vv + " livere_t_indent' rel='tooltip' aria-label='" + livereLib.getMessage("sharedSNS_8") + " : " + sns.post + "' >" + sns.post + "</dd>";
            });
            septSNS += "</li>";
        }
        if (!livereLib.switchMobileView) {
            replyBody += septSNS;
        }
        replyBody += "              <li class='livereFunction'>";
        replyBody += "                  <button class='livereFunctionBtn'><span class='text-indent'>메뉴</span></button>";
        replyBody += "                  <ul class='reply-history-layer' data-type='revival'>";
        replyBody += "                      <li><button type='button' class='livereReply_delete livereReplyFuncBtn livereBtn3' targetName='delete'><span class='livereReplyFuncFavicon livereFont3'>" + livereLib.getMessage("deletebtn") + "</span></button></li>";
        replyBody += "                      <li><button type='button' class='livereReply_police livereReplyFuncBtn livereBtn3' targetName='police'><span class='livereReplyFuncFavicon livereFont3 livere_t_indent' aria-label='" + livereLib.getMessage("police") + "'>" + livereLib.getMessage("police") + "</span></button></li>";
        replyBody += "                  </ul>";
        replyBody += "              </li>";
        replyBody += "          </ul>";
        replyBody += "      </dt>";
        replyBody += "      <dd class='livereArticleText'>";
        replyBody += "          <p>" + reply.content + "</p>";
        replyBody += "      </dd>";
        replyBody += "      <dd class='livereReplyFuncWrapper'>";
        replyBody += "          <ul class='livereReplyFunc'>";

        var isChildReply = false;
        var plugin_data = livereSharedData.livereReply.plugin_data;

        jQuery.each(plugin_data, function(ii, vv) {
            switch(vv.plugin_seq){
                case 66 : isChildReply = true; break;
            }
        });

        if (livereReply.status.sort == "new" && isChildReply) {
            replyBody += "          <li><button type='button' class='livereReply_addchild livereReplyFuncBtn livereBtn3' target='childWriteForm' targetName='addchild'><span class='livereReplyFuncFavicon livereFont3'>" + livereLib.getMessage("replyBtn") + "</span></button></li>";
        }
        replyBody += "          </ul>";
        replyBody += "      </dd>";
        // replyBody += "       <dd class='livereChildReplyWrapper'></dd>";
        replyBody += "  </dl>";
        replyBody += "</div>";
        replyBody += "<div class='livereChildReplyWrapper'></div>";

        var evaluationBtn = "";
        evaluationBtn += "<ul class='livereReplyEvaluation'>";
        evaluationBtn += "  <li class='livereReply_good_wrapper'><button type='button' class='livereReply_good livereReplyEvaluationBtn livereBtn1' targetName='good' rel='tooltip' aria-label='" + livereLib.getMessage("goodbtn") + "'><span class='livere_t_indent'>" + livereLib.getMessage("goodbtn") + "</span><strong class='livereReply_good_count'>" + reply.good + "</strong></button></li>";
        evaluationBtn += "</ul>";

        var septSNS = "";
        if (!livereLib.util.isEmpty(reply.septSNSObj)) {
            septSNS += "<li class='livereSharedSNSWrapper'>";
            jQuery.each(reply.septSNSObj.reverse(), function(ii, vv) {
                septSNS += "<dd class='livereSharedSNS livereFavicon_L livereFavicon_L_" + vv + " livere_t_indent' rel='tooltip' aria-label='" + vv.substr(0, 1).toUpperCase() + vv.substr(1, vv.length) + "' >" + vv.substr(0, 1).toUpperCase() + vv.substr(1, vv.length) + "</dd>";
            });
            septSNS += "</li>";
        }

        replyBody = livereLib.util.replaceAll(replyBody, "#DOMAIN#", member_domain_Upper);
        reply.replyBody = jQuery(replyBody);

        if (livereLib.switchMobileView) {
            reply.replyBody.find(".livereReplyFuncWrapper").append(evaluationBtn);
            reply.replyBody.find(".livereArticleUserInfo").append(septSNS);
        } else {
            reply.replyBody.find(".livereReplyFuncWrapper").append(evaluationBtn);
        }

        reply.wrapper = jQuery(wrapper);

        livereReply.livereCardInit(reply.link1, function(data) {
            var targetWrapper = reply.wrapper.find('.livereReplyAttachedWrapper'),
                $card = jQuery(livereReply.htmlFactory.livereCard(data));

            if(targetWrapper.find('.livereWriteCardForm').length > 0){
                targetWrapper.find('.livereWriteCardForm').remove();
            }

            $card.find('.livereCardCancelBtn').remove();
            $card.find('.livereCardDescriptionImg img').error(function(e) {
                jQuery(this).attr('src','https://101.livere.co.kr/images/img_blank.png');
            });
            targetWrapper.append($card);
        });


        reply.wrapper.append(reply.replyThumb);
        reply.wrapper.append(reply.replyBody);
        reply.wrapper.data(reply);

        return reply;
    };

    this.defaultEmptyReplyHtmlObject = function() {
        var reply = {};
        var wrapper = "<div class='livereParentReplyWrapper livereEmptyReplyWrapper'></div>";

        var replyThumb = "";
        replyThumb += "<button type='button' class='livereReplyThumb'>";
        replyThumb += " <img class='livereReplyThumb_L' alt='" + livereLib.getMessage("profileImg_8") + "' src='https://101.livere.co.kr/images/ver8/delete.png'/>";
        replyThumb += "</button>";

        replyThumb = livereLib.util.replaceAll(replyThumb, "#DOMAIN#", livereLib.getMessage("deletedReply_8"));
        reply.replyThumb = jQuery(replyThumb);

        var replyBody = "";
        replyBody += "<div class='livereReplyBodyContainer'>";
        replyBody += "  <dl class='livereReplyBody'>";
        replyBody += "      <dt>";
        replyBody += "          <span class='livereFont9'>" + livereLib.getMessage("deletedReply_8") + "</span>";
        replyBody += "      </dt>";
        replyBody += "      <dd class='livereArticleText'>";
        replyBody += "          <p class='livereDeletedText'><span>" + livereLib.getMessage("deleteReplyMsg_8") + "</span></p>";
        replyBody += "      </dd>";
        // replyBody += "       <dd class='livereChildReplyWrapper'></dd>";
        replyBody += "  </dl>";
        replyBody += "</div>";
        replyBody += "<div class='livereChildReplyWrapper'></div>";

        reply.replyBody = jQuery(replyBody);

        reply.wrapper = jQuery(wrapper);
        reply.wrapper.append(reply.replyThumb);
        reply.wrapper.append(reply.replyBody);

        return reply;
    };

    this.defaultChildReplyHtml = function(reply) {
        var member_domain_Upper = reply.member_domain.substr(0, 1).toUpperCase() + reply.member_domain.substr(1, reply.member_domain.length);

        var wrapper = "<div class='livereChildReply' data-seq='" + reply.reply_seq + "'></div>";

        var replyThumb = "";
        var acc = eval(reply.member_domain);

        reply.member_url != "" ?
            replyThumb += "<button type='button' class='livereReplyThumb livereReplyTumb_" + reply.member_domain + "' rel='tooltip' aria-label='" + livereLib.getMessage("profilePageOpen_8") + "' title='" + livereLib.getMessage("profilePageOpen_8") + "'>" :
            replyThumb += "<button type='button' class='livereReplyThumb livereReplyTumb_" + reply.member_domain + " livereReplyNoProf' title='" + acc.title + livereLib.getMessage('livereReplyThumbTitle') + "'>";

        if (reply.member_icon.indexOf("api.twitter.com/1/users") > -1) reply.member_icon = "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png";

        if (livereLib.isSecure) {
            if (reply.member_domain == "twitter" || reply.member_domain == "facebook") {
                replyThumb += " <img class='livereReplyThumb_S' alt='" + livereLib.getMessage("profileImg_8") + "' src='" + reply.member_icon.replace("http://", "https://") + "'/>";
            } else if (reply.member_domain == "cyworld") {
                replyThumb += " <img class='livereReplyThumb_L' alt='" + livereLib.getMessage("profileImg_8") + "' src='https://101.livere.co.kr/images/ver8/unknown_profile.gif'/>";
            } else {
                replyThumb += " <img class='livereReplyThumb_S' alt='" + livereLib.getMessage("profileImg_8") + "' src='" + reply.member_icon.replace("http://", "https://secure.livere.co.kr:8443/") + "'/>";
            }
        } else {
            replyThumb += " <img class='livereReplyThumb_S' alt='" + livereLib.getMessage("profileImg_8") + "' src='" + reply.member_icon + "'/>";
        }

        if (!livereLib.switchMobileView) {
            if (reply.member_domain != "guest") {
                replyThumb += " <span class='livereThumbFavicon livereFavicon_S livereFavicon_S_" + reply.member_domain + "'></span>";
            }
        }

        replyThumb += "</button>";

        livereLib.snsName = eval(reply.member_domain);

        replyThumb = livereLib.util.replaceAll(replyThumb, "#DOMAIN#", livereLib.snsName.post);
        reply.replyThumb = jQuery(replyThumb);

        var replyBody = "";
        replyBody += "<dl class='livereReplyBody'>";
        replyBody += "  <dt class='livereArticleUserInfoWrapper' data-seq='" + reply.member_group_seq + "'>";
        replyBody += "      <ul class='livereArticleUserInfo'>";

        if(reply.member_url != ""){
            replyBody += "          <li class=" + (!livereLib.switchMobileView ? 'livereReplyWriteName' : '') + "><button type='button' class='livereReplyWriterName livereBtn3' aria-label='" + livereLib.getMessage("profilePageOpen_8") + "'>";
        } else {
            replyBody += "          <li class=" + (!livereLib.switchMobileView ? 'livereReplyWriteName' : '') + "><button type='button' class='livereReplyWriterName livereBtn3 livereReplyNoProf' >";
        }

        if (livereLib.switchMobileView) {
            replyBody += "              <span class='livereFavicon_mobile_S livereFavicon_mobile_S_" + reply.member_domain + " livereFont9'>" + reply.name + "</span>";
        } else {
            replyBody += "              <span class='livereFont9'>" + reply.name + "</span>";
        }

        replyBody += "              </button></li>";
        replyBody += "          <li class='livereReplyWritedRegdate'><span class='livereFont3'>" + livereLib.util.beforeRegdate(reply.reply_regdate) + "</span></li>";
        replyBody += "          <li class='livereFunction'>";
        replyBody += "              <button class='livereFunctionBtn'><span class='text-indent'>메뉴</span></button>";
        replyBody += "              <ul class='reply-history-layer' data-type='revival'>";
        replyBody += "                  <li><button type='button' class='livereReply_delete livereReplyFuncBtn livereBtn3' targetName='delete'><span class='livereReplyFuncFavicon livereFont3'>" + livereLib.getMessage("deletebtn") + "</span></button></li>";
        replyBody += "                  <li><button type='button' class='livereReply_police livereReplyFuncBtn livereBtn3' targetName='police'><span class='livereReplyFuncFavicon livereFont3 livere_t_indent' aria-label='" + livereLib.getMessage("police") + "'>" + livereLib.getMessage("police") + "</span></button></li>";
        replyBody += "              </ul>";
        replyBody += "          </li>";
        replyBody += "      </ul>";
        replyBody += "  </dt>";
        replyBody += "  <dd class='livereArticleText'>";
        replyBody += "      <p>" + reply.content + "</p>";
        replyBody += "  </dd>";
        replyBody += "  <dd class='livereReplyFuncWrapper'></dd>";
        replyBody += "</dl>";

        var septSNS = "";
        if (!livereLib.util.isEmpty(reply.septSNSObj)) {
            septSNS += "<li class='livereSharedSNSWrapper'>";

            jQuery.each(reply.septSNSObj.reverse(), function(ii, vv) {
                var sns = eval(vv);
                septSNS += "<dd class='livereSharedSNS livereFavicon_L livereFavicon_L_" + vv + " livere_t_indent' rel='tooltip' aria-label='" + livereLib.getMessage("sharedSNS_8") + " : " + sns.post + "' >" + sns.post + "</dd>";
            });

            septSNS += "</li>";
        }

        var evaluationBtn = "";
        evaluationBtn += "<ul class='livereReplyEvaluation'>";
        evaluationBtn += "  <li class='livereReply_good_wrapper'><button type='button' class='livereReply_good livereReplyEvaluationBtn livereBtn1' targetName='good' rel='tooltip' aria-label='" + livereLib.getMessage("goodbtn") + "'><span class='livere_t_indent'>" + livereLib.getMessage("goodbtn") + "</span><strong class='livereReply_good_count'>" + reply.good + "</strong></button></li>";
        evaluationBtn += "</ul>";

        replyBody = livereLib.util.replaceAll(replyBody, "#DOMAIN#", member_domain_Upper);

        reply.replyBody = jQuery(replyBody);

        reply.replyBody.find(".livereReplyFuncWrapper").append(evaluationBtn);
        reply.replyBody.find(".livereArticleUserInfo").append(septSNS);

        reply.wrapper = jQuery(wrapper);
        reply.wrapper.append(reply.replyThumb);
        reply.wrapper.append(reply.replyBody);
        reply.wrapper.data(reply);

        return reply;
    };

    this.policeLayer = function() {
        var policeText = livereLib.getMessage('police_bundle').split(',');

        policeText = jQuery.map(policeText, function(a) { return jQuery.trim(a) } );

        var policeLayer = "";

        policeLayer += "<div class='livere_police_layer_bg' style='display:none;'></div>";
        policeLayer += "<dl class='livere_police_layer'>";
        policeLayer += "    <dt class='livere_police_layer_top'>";
        policeLayer += "        <span>" + policeText[0] + "</span>";
        policeLayer += "        <button type='button' id='livere_police_layer_close'>";
        policeLayer += "            <span class='livere_police_layer_close livere_t_indent'>" + policeText[1] + "</span>";
        policeLayer += "        </button>"
        policeLayer += "    </dt>";
        policeLayer += "    <dd class='livere_police_layer_content select'>";
        policeLayer += "        <div class='livere_police_centet_select' name='report' aria-label='" + policeText[2] + "' title='" + policeText[2] + "'>";
        policeLayer += "            <span class='livere_police_select'>select</span>"
        policeLayer += "            <p class='choice'>" + policeText[2] + "</p>";
        policeLayer += "            <p class='first'>" + policeText[3] + "</p>";
        policeLayer += "            <p class='second'>" + policeText[4] + "</p>";
        policeLayer += "            <p class='third'>" + policeText[5] + "</p>";
        policeLayer += "            <p class='self'>" + policeText[6] + "</p>";
        policeLayer += "        </div>";
        policeLayer += "    </dd>";
        policeLayer += "    <dd class='livere_police_layer_content txtBtn'>";
        policeLayer += "        <div class='livere_police_layer_txt' style='display:none;'>";
        policeLayer += "            <label for='livere_report_txt' class='livereNone'>" + policeText[7] + "</label>";
        policeLayer += "            <textarea id='livere_report_txt' title='" + policeText[7] + "' class='livere_report_txt'></textarea>";
        policeLayer += "        </div>";
        policeLayer += "        <button class='livere_report_btn' type='button'><span>" + policeText[8] + "</span></button>";
        policeLayer += "        <button class='livere_report_cancel' type='button'><span>" + policeText[9] + "</span></button>"
        policeLayer += "    </dd>"
        policeLayer += "</dl>";

        return policeLayer;
    }

    this.moreBtn = function() {
        var moreBtn = "";

        moreBtn += "<p id='livereMoreBtnWrapper'>";
        moreBtn += "    <button type='button' id='livereMoreBtn' class='livereBtn1'>";
        moreBtn += "        <span>" + livereLib.getMessage("moreBtn") + "</span>";
        moreBtn += "    </button>";
        moreBtn += "</p>";

        return moreBtn;
    };

    this.noMoreBtn = function() {
        var noMoreBtn = '';

        noMoreBtn += '<div class="more-write-wrapper">';
        noMoreBtn += '  <span class="more-write-title">' + livereLib.getMessage('me2dayClose_serviceEnd') + '</span>';
        noMoreBtn += '  <button type="button" class="more-write-btn">';
        noMoreBtn += '      <span>' + livereLib.getMessage('me2dayClose_information') + '</span>';
        noMoreBtn += '  </button>';
        noMoreBtn += '</div>';

        return noMoreBtn;
    }

    this.replyLoading = function() {
        var replyLoading = "";

        replyLoading += "<div id='livereReplyLoading' class='livereParentReplyWrapper'>";
        replyLoading += "   <p>";
        replyLoading += "       <img src='https://101.livere.co.kr/images/ver8/viewLoading.gif' />";
        replyLoading += "   </p>";
        replyLoading += "</div>";

        return replyLoading;
    };

    this.emptyArticleList = function() {
        var empty = '';

        empty += "  <div id='livereNoneArticle'>";
        empty += "      <p>" + livereLib.getMessage('emptyMyReply_8') + "</p>";
        empty += "  </div>";

        return empty;
    }

    this.replyAdHtml = function(data) {
        var html = '';

        html += '<div class="lv-replyad-wrapper">';
        html += '   <a href="' + data.shortUrl + '" class="lv-replyad-profile"  target="_blank">';
        html += '       <img src="' + data.profile_img + '">';
        html += '   </a>';
        html += '   <div class="lv-replyad-body-wrapper">';
        html += '       <dl class="lv-replyad-body">';
        html += '           <dt class="lv-replyad-info">';
        html += '               <ul>';
        html += '                   <li class="lv-replyad-info-name">' + data.name + '</li>';
        html += '                   <li class="lv-replyad-info-title">' + data.message.nameTitle + '</li>';
        html += '               </ul>';
        html += '           </dt>';
        html += '           <dd class="lv-replyad-content">';
        html += '               <span>' + data.body + '</span>';
        html += '           </dd>';
        html += '           <dd class="lv-replyad-link-wrapper">';
        html += '               <a href="' + data.shortUrl + '" class="lv-replyad-alink" target="_blank">';
        html += '                   <div class="lv-replyad-link">';
        html += '                       <div class="lv-replyad-thumbnail">';
        html += '                           <img src="' + data.thumbnail + '" alt="' + data.message.thumbnailImg + '" onerror="">';
        html += '                       </div>';
        html += '                       <div class="lv-replyad-desc">';
        html += '                           <span class="lv-replyad-desc-title">' + data.title + '</span>';
        html += '                           <span class="lv-replyad-desc-content">' + data.description + '</span>';
        html += '                           <span class="lv-replyad-desc-url">' + data.url + '</span>';
        html += '                       </div>';
        html += '                   </div>';
        html += '               </a>';
        html += '           </dd>';

        if (data.total_count > 0) {
            html += '           <dd class="lv-replyad-link-btn">';
            html += '               <button type="button" data-seq="' + data.id + '">';
            html += '                   <span>' + data.message.participation + '</span>';
            html += '                   <span class="lv-replyad-count">(' + data.total_count + ' ' + data.message.people + ')</span>';
            html += '               </button>';
            html += '           </dd>';
        }

        html += '       </dl>';
        html += '   </div>';
        html += '</div>';

        return jQuery(html);
    };
};

Livere = function(livere_seq, refer, title) {
    this.isWriteForm = false;
    this.htmlFactory = new HTMLFactory();

    // recobell
    if(refer.indexOf("rccode=lvRc") > -1) {
        refer = livereLib.util.recobell(refer);
    }

    livereSharedData.livereReply.livere_seq = livere_seq;
    livereSharedData.livereReply.refer = refer;
    livereSharedData.livereReply.title = title;

    this.fire = function(command) {
        var fireData = {};
        fireData['ownerObject'] = this;

        livereLib.fire(fireData, command);
    };

    this.init = function() {

        livereSharedData.livereReply.livere_seq = livere_seq;
        livereSharedData.livereReply.refer = refer;
        livereSharedData.livereReply.title = title;

        var params = {
            refer: livereSharedData.livereReply.refer,
            title: livereSharedData.livereReply.title,
            version: 8
        };

        livereLib.initLivereReply(params);
    };

    this.secondStep = function() {
        var customCssPath = null;
        var customMCssPath = null;

        if(livereSharedData.livereReply.livere_data.use_stickers) {
            livereReply.callToModule("livereSticker");
        }

        var trident = navigator.userAgent.match(/Trident\/(\d)/i);
        if((livereSharedData.livereReply.livere_data.use_actionbar
            && !livereLib.util.isTouchDevice())
            || (livereSharedData.livereReply.livere_data.use_actionbar
            && trident != null)) {
            livereReply.callToModule("livereActionBar");
        }

        if (!jQuery("#" + livereSharedData.livereReply.livere_data.targetDiv).length > 0) {
            return;
        }

        var wf = jQuery(livereReply.htmlFactory.defaultHtml());

        wf.find('#livereGuideBtn').click(function() {
            var $targetLayer = jQuery(this).parent().find('.livereGuideLayer');

            if(!jQuery(this).hasClass('lv-layer-active')) {
                $targetLayer.slideDown('fast');
                setTimeout(function() {
                    wf.find('#livereGuideBtn').addClass('lv-layer-active');
                }, 200);
            } else {
                jQuery(this).removeClass('lv-layer-active');
                $targetLayer.slideUp('fast');
            }
        });

        wf.find('.livereGuideClose').click(function() {
            wf.find('#livereGuideBtn').removeClass('lv-layer-active');
            jQuery(this).parent().find('.livereGuideLayer').slideUp('fast');
        });

        wf.find(".livereWriteBtn").click(function() {
            livereLib.fire(function() {
                livereLib.processing = true;
                livereReply.write();
            }, "processing");
            jQuery(this).focus();
        });

        wf.find("#wf-share-btn").click(function() {
            var $replyPostingLayer = jQuery(livereReply.htmlFactory.replyPostingLayer());
            var $parent = wf.find('.livereWriteFormMiddleBottom');
            var $layer_shared = $parent.find('#layer-shared');

            if($layer_shared.length > 0){
                $layer_shared.remove();
                jQuery(this).removeClass('active');
            }else{
                if(livereLib.isLogged()){
                    setTimeout(function() {
                        wf.find("#wf-share-btn").addClass('active');
                    });
                    wf.find('#livereWriteFormMiddleBottom').append($replyPostingLayer);
                    $layer_shared.addClass('lv-share-active');
                }
            }
        });

        wf.find("#livere_contentText").bind("change keyup input", function(e) {
            jQuery(this).css('height', 'auto');
            jQuery(this).height( this.scrollHeight );
            if(jQuery(this).val().length > 0){
                wf.find('#livereWriteBtn').addClass('hover');
                wf.find('#livereWriteBtn').find('span').css('color', 'white');
            }else{
                wf.find('#livereWriteBtn').removeClass('hover');
                wf.find('#livereWriteBtn').find('span').attr('style', '');
            }
            livereReply.textValidate(this);
        });

        wf.find('#livere_contentText').bind('click focus', function() {
            jQuery('.livereChildReplyWrapper').find('.livereWriteForm').remove();
        });

        wf.find("#livere_contentText").bind("paste", function(e) {
            var $self = jQuery(this);

            if(jQuery('.livereWriteFormMiddleRight .livereCardLink').length > 0) return;

            nextTick(function() {
                var content = $self.val(),
                    regexp = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/);

                if (!regexp.test(content)) {
                    return;
                }

                livereReply.livereCardInit(content.match(regexp)[0], livereReply.drawWriteFormCard);
            });

            function nextTick(fn) {
                return setTimeout(fn, 0);
            }
        });

        wf.find('#livereSharedBtn').bind('mouseover', function() {
            if(!livereLib.isLogged()) {
                jQuery(this).css('cursor', 'default');
                jQuery(this).find('span').css('color', '#8f8e88')
            }
        });

        wf.find('#livereSharedBtn').click(function() {
            if(!livereLib.isLogged()) {
                jQuery(this).unbind('click');
                return false;
            }

            var inputBox = jQuery('.livereSNSPostCheck');
            jQuery.each(inputBox, function(ii, vv){
                if(!livereLib.isOpenSharedBtn) {
                    jQuery(vv).fadeIn();
                } else {
                    jQuery(vv).fadeOut();
                }
            });
            if(!livereLib.isOpenSharedBtn) {
                livereLib.isOpenSharedBtn = true;
            } else {
                livereLib.isOpenSharedBtn = false;
            }

        });

        /* isTouchDevice */
        if (livereLib.switchMobileView) {

            jQuery("#" + livereSharedData.livereReply.livere_data.targetDiv).addClass("livere_mobile");

            wf.find(".livereWriteFormTop").hide();

            var isMobileLogin = jQuery(livereReply.htmlFactory.isMobileLogin());
            wf.find(".livereWriteForm").prepend(isMobileLogin);

            livereLib.isMobileSmartloginView = false;
            wf.find(".livereIsMobileBtn").attr('target', 'parentWriteForm');
            wf.find(".livereIsMobileBtn").click(function() {
                livereSmartLogin.usedWriteForm = true;
                livereSmartLogin.initOpened(jQuery(this).attr('target'));
            });
        }

        if (!livereLib.util.isTouchDevice()) jQuery("#" + livereSharedData.livereReply.livere_data.targetDiv).addClass("livereReply_useMouseOver");

        jQuery("#" + livereSharedData.livereReply.livere_data.targetDiv).append(wf);

        var data = {};
        data["type"] = "livereEvent";
        data["key"] = "writeFormCreated";
        data["value"] = "true";

        livereLib.dispatchEvent(data);

        //Hyun 한글 DB화
        var acc = livereLib.getSmartLoginData().linkage_accs,
            list = ['livere', 'facebook', 'twitter', 'kakao', 'naver', 'instagram', 'google_plus', 'tistory', 'linkedIn'],
            filter_acc = jQuery.grep(acc, function(n){
                return jQuery.inArray(n,list) > 0;
            });


        jQuery.each(filter_acc, function(ii,vv) {
            var account = window[vv],
                snsList = livereLib.getMessage('snsList_kr') ? livereLib.getMessage('snsList_kr').split(',') : '',
                t_index = jQuery.inArray(account.name, snsList) + 1,
                p_index = jQuery.inArray(account.post, snsList) + 1;

            if (snsList !== '') {
                account['title'] = snsList[t_index];
                account['post'] = snsList[p_index];
            }
        });

        livereReply.setAccounts();

        if (livereSharedData.livereReply.livere_data.listviewable == 1 && livereSharedData.livereReply.reply_data){
            livereReply.setReplyList(livereSharedData.livereReply.reply_data);
        }
    };

    this.livereCardInit = function(target_url, fn) {

        if(jQuery('.livereWriteCardForm') > 0) return;
        if(target_url == '' || target_url == null || target_url == 'undefined') return;
        var api_url = 'https://api.livere.com/page?url=';
        api_url = api_url + target_url;
        api_url = api_url + '&callback=?';
        return getPageData(api_url, fn);

        function getPageData(url, fn) {
            jQuery.getJSON(url, function(data) {
                data.url = target_url;
                return fn(data);
            });
        }
    };

    this.drawWriteFormCard = function(data) {

        if (data.type && data.type == 'image') {
            livereAttachFile.urlCheckStart(data.url);
            return;
        }

        var $targetWrapper = jQuery('.livereWriteParamsFormData'),
            $afterObj = jQuery(livereReply.htmlFactory.livereCard(data)),
            $formDataTarget = jQuery('.livereWriteParamsFormData li'),
            $link_input = jQuery('<input id="livere_link1" name="livere_link1" type="hidden">');

        $targetWrapper.after($afterObj);
        $link_input.val(data.url);
        $formDataTarget.prepend($link_input);
        $afterObj.find('.livereCardDescriptionImg img').error(function(e) {
            jQuery(this).attr('src','https://101.livere.co.kr/images/img_blank.png');
        });
        return createEvent();

        function createEvent() {
            var $cancelBtn = jQuery('.livereCardCancelBtn');

            $cancelBtn.click(function(e) {
                jQuery(this).parents('.livereWriteCardForm').remove();
                jQuery('#livere_link1').remove();

                e.stopPropagation();
                e.preventDefault();
            });
        }
    }
    this.callToModule = function(m_name) {
        var modulePath = "https://101.livere.co.kr/js/" + m_name + ".js";
        jQuery.getScript(modulePath, function() {
            eval(m_name).start();
        });
    };

    this.textValidate = function(obj) {
        var textareaObj = jQuery(obj);
        var max_len = livereSharedData.livereReply.livere_data.content_maxlen;
        var str_len = textareaObj.val().length;

        jQuery("." + textareaObj.attr("targetName")).text(str_len);

        if (str_len > max_len) {
            textareaObj.val(textareaObj.val().substring(0, (max_len))).focus();
            alert(livereLib.getMessage("textCount_8").replace("#TEXTCOUNT#", max_len));
            livereReply.textValidate(obj);
        }
    };

    this.setAccounts = function() {
        var loggedTarget = jQuery(".livereLogged");
        var notLoggedTarget = jQuery(".livereNotLogged");
        var shareCount = jQuery('.share-count');
        var count = 0;

        loggedTarget.empty();
        notLoggedTarget.empty();

        var s_datas = livereLib.getSmartLoginData();

        jQuery.each(s_datas.linkage_accs, function(ii, acc) {
            var account = eval(acc);

            account.icon = jQuery(livereReply.htmlFactory.linkage_accountHtmlObject(account));
            account.icon.find("[clickType]").click(function() {
                livereReply.iconClick(account.name, jQuery(this));
            });

            livereReply.injectLoginData(account);

            if (!livereLib.util.isEmpty(account.member_islogin) && account.member_islogin == "1") {
                account.icon.addClass("livere_loggedSNS");
                loggedTarget.append(account.icon);
                if (!livereLib.util.isEmpty(account.member_ispost) && jQuery.inArray(acc, livereLib.postingSns) > -1) {
                    count++;
                }
            } else {
                account.icon.find(".livereSNSPostCheck").remove();
                notLoggedTarget.append(account.icon);
            }
        });

        shareCount.text(count);

        jQuery(".livereLogoutBtn").remove();

        if (livereLib.isLogged()) {
            var all_logout = jQuery(livereReply.htmlFactory.all_logout());
            all_logout.click(function() {
                livereLib.fire(function() {
                    livereLib.processing = true;
                    livereLib.fire({}, "livereLogout");
                }, "processing");
            });

            jQuery(".livereWriteFormTop").append(all_logout);
        }

        var eventData = {};
        eventData['type'] = 'livereEvent';
        eventData['key'] = 'livereCreationComplete';

        livereLib.dispatchEvent(eventData);

        jQuery('#liverePlugIn .livereSNSLoginIconContainer').find('li').ready(function() {
            livereLib.util.toolTip(jQuery(this).find("[rel=tooltip]"));
        });
    };

    this.iconClick = function(account_name, clickObj) {
        livereLib.fire(function() {
            var account = window[account_name];

            if (account.member_islogin != '1') {
                if(account_name !== livereLib.getSmartLoginData().sync_acc){
                    account.loginGate = function() {
                        syncManager.openLoginGate(account.name);
                    }();
                }else{
                    account.loginGate();
                }
                jQuery('#layer-shared').remove();
            } else {
                livereLib.processing = true;

                var requestParams = {};
                requestParams['member_seq'] = account.member_seq;

                switch (clickObj.attr("clickType")) {
                    case "snsLoginBtn":
                        livereLib.fire(requestParams, "setPrimary");
                        break;
                    case "snsPostingCheck":
                        livereLib.fire(requestParams, "setPosting");
                        break;
                }
            }
        }, "processing");
    };

    this.injectLoginData = function(account) {
        var s_l = livereLib.getSmartLoginData();

        if (s_l.member_datas)
            jQuery.each(s_l.member_datas, function(ii, login_acc) {
                if (account.name == login_acc.member_domain) {
                    jQuery.extend(account, login_acc);
                }
            });
    };

    this.drawPrimaryUserData = function() {
        var logged = livereLib.isLogged();
        jQuery(".livereLogged").removeClass("livereNone")
            .removeClass(function(idx, hasClassNames) {
                var matchedClass = hasClassNames.match(/livere_p_[a-zA-Z0-9_]*/g) || [];
                return matchedClass.join(" ");
            });

        jQuery(".livereAccInfoWrapper").removeClass(function(idx, hasClassNames) {
            var matchedClass = hasClassNames.match(/livere_pWriter_[a-zA-Z0-9_]*/g) || [];
            return matchedClass.join(" ");
        });

        var primaryMember = livereLib.getPrimaryDomain();

        if (logged && !livereLib.util.isEmpty(primaryMember)) {

            jQuery(".livere_" + primaryMember.member_domain).addClass("livere_primary");
            jQuery(".livereLogged").addClass("livere_p_" + primaryMember.member_domain);

            if (primaryMember.member_domain == "kakao" && primaryMember.member_icon ==  null) primaryMember.member_icon = "https://101.livere.co.kr/images/ver8/guest.png";

            if (primaryMember.member_icon.indexOf("api.twitter.com/1/users") > -1) primaryMember.member_icon = "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png";

            if (livereLib.isSecure) {
                if (primaryMember.member_domain == "twitter" || primaryMember.member_domain == "facebook" || primaryMember.member_domain == "kakao") {
                    jQuery(".liverePrimaryThumb > img").attr("src", primaryMember.member_icon.replace("http://", "https://"));
                } else {
                    jQuery(".liverePrimaryThumb > img").attr("src", primaryMember.member_icon.replace("http://", "https://secure.livere.co.kr:8443/"));
                }
            } else if (primaryMember.member_domain == "google_plus" && primaryMember.member_icon.indexOf("guest.png") > -1) {
                jQuery(".liverePrimaryThumb > img").attr("src", "https://101.livere.co.kr/images/ver8/googleplus_unknown.png");
            } else {
                jQuery(".liverePrimaryThumb > img").attr("src", primaryMember.member_icon);
            }

            jQuery(".liverePrimaryThumb > img").attr("alt", livereLib.getMessage("profileImg_8").replace("#DOMAIN#", primaryMember.title));
            jQuery(".liverePrimaryThumb").removeClass("notLoggedThumb");
            jQuery("#livere_name").val(primaryMember.member_name);
            jQuery(".livereAccInfo").html(primaryMember.member_name).addClass("livereFont5");
            jQuery(".livereAccInfoWrapper").addClass("livere_pWriter_" + primaryMember.member_domain);

            livereReply.currentInputText = jQuery("#livere_contentText").val() != jQuery("#livere_contentText")[0].defaultValue ? jQuery("#livere_contentText").val() : "";
            jQuery("#livere_contentText").attr("disabled", false).val(livereReply.currentInputText);

            if(jQuery("#livere_childContentText")[0]){
                livereReply.currentChildInputText = jQuery("#livere_childContentText").val() != jQuery("#livere_childContentText")[0].defaultValue ? jQuery("#livere_childContentText").val() : "";
                jQuery("#livere_childContentText").attr("disabled", false).val(livereReply.currentChildInputText);
            }

            jQuery(".livere_" + primaryMember.member_domain).prepend(livereReply.htmlFactory.setPrimarySNSFavicon()).find(".livereSNSImage_B").text(primaryMember.title + " " + livereLib.getMessage("isPrimary_8"));

            if (livereLib.switchMobileView) {
                var s_data = livereLib.getSmartLoginData();

                // jQuery(".livereShareSNSWrapper").find(".livereShareSNS").remove();

                var isNotShare = true;
                jQuery.each(s_data.linkage_accs, function(ii, vv) {
                    if (eval(vv).member_islogin == 1 && eval(vv).member_ispost == 1 && ( eval(vv).posting_enable === 1 || (eval(vv).posting_enable !== 1 && eval(vv).member_domain === 'naver') )) {
                        // jQuery(".livereShareSNSWrapper").append(livereReply.htmlFactory.isLoggedSNS(vv));
                        isNotShare = false;
                    }
                });

                // isNotShare ? jQuery(".livereShareSNSWrapper").addClass("livereNone") : jQuery(".livereShareSNSWrapper").removeClass("livereNone");

                jQuery(".livereIsMobileBtn").addClass("livereSmartBtnIsLogged");
                jQuery(".livereIsMobileBtn > span").text(livereLib.getMessage("smartLoginLoggedBtn_8"));
            }

            jQuery("#livereGuide").hide();

        } else {
            jQuery(".livereLogged").addClass("livereNone");
            jQuery(".liverePrimaryThumb > img").attr({
                "src": "https://101.livere.co.kr/images/_.gif",
                "alt": livereLib.getMessage("beforeLoggedImg_8")
            });
            jQuery("#liverePlugIn .liverePrimaryThumb").addClass("notLoggedThumb");
            jQuery("#livere_name").val();
            jQuery(".livereAccInfo").html(livereLib.getMessage("snsid")).removeClass("livereFont5");
            jQuery(".livere_contentText").attr("disabled", true).val(livereLib.getMessage("title"));
            jQuery(".liverePrimarySNSFavicon").remove();

            if (livereLib.switchMobileView) {
                // jQuery(".livereShareSNSWrapper").addClass("livereNone");
                jQuery(".livereIsMobileBtn").removeClass("livereSmartBtnIsLogged");
                jQuery(".livereIsMobileBtn > span").text(livereLib.getMessage("smartLoginNotLoggedBtn_8"));
            }
        }

        var eventData = {};
        eventData["type"] = "livereEvent";
        eventData["key"] = "drawPrimaryUserDataComplete";
        eventData["value"] = primaryMember;

        livereLib.dispatchEvent(eventData);
    };

    this.writeHookers = [];
    this.writeDoneHookers = [];
    this.writeHooker = function(fun, isDoneHooker) {
        if (isDoneHooker)
            livereReply.writeDoneHookers.push(fun);
        else
            livereReply.writeHookers.push(fun);
    };

    this.write = function(force) {

        if (!livereLib.isLogged() && !force) {
            alert(livereLib.getMessage("needLogin"));
            livereLib.processComplete();
            return false;
        }

        if (livereLib.util.isEmpty(jQuery("#livere_contentText").val())) {
            alert(livereLib.getMessage("emptyContentLog"));
            livereLib.processComplete();
            jQuery('#livere_contentText').trigger('focus');
            return false;
        }

        var hookerDone;
        jQuery(livereReply.writeHookers).each(function(ii, vv) {
            var fn = eval(vv);
            hookerDone = fn();
        });

        if (typeof(hookerDone) != "undefined") {
            if (!hookerDone) {
                jQuery(livereReply.writeDoneHookers).each(function(ii, vv) {
                    var fn = eval(vv);
                    fn();
                });

                livereLib.processComplete();
                return false;
            }
        }

        var fmInputs = jQuery(".livereWriteParamsFormData li").children().not("#livereHashTag");

        var params = {};
        jQuery.each(fmInputs, function(ii, vv) {
            params[vv.name.replace("livere_", "")] = jQuery(vv).val();
        });

        var primary = livereLib.getPrimaryDomain();

        if (livereLib.isLogged() && !livereLib.util.isEmpty(primary)) {

            if (!livereLib.util.isEmpty(jQuery(".liverePrimaryThumb > img").attr("src"))) {
                params["member_icon"] = jQuery(".liverePrimaryThumb > img").attr("src");
            }

            params["member_domain"] = primary.member_domain;
            params["member_seq"] = primary.member_seq;
            params["name"] = primary.member_name;
        }

        // descipriton check
        var description = "";

        if (!livereLib.util.isEmpty(livereReply.desc)) {
            description = livereReply.desc;
        } else if (!livereLib.util.isEmpty(livereReply.description)) {
            description = livereReply.description;
        } else {
            jQuery("meta").each(function(ii, vv) {
                var obj = jQuery(vv);
                obj.attr("name", (obj.attr("name") + "").toLowerCase());
            });

            var desc_meta = jQuery("meta[name='description']");
            if (desc_meta.length > 0 && !livereLib.util.isEmpty(desc_meta.attr("content"))) {
                description = desc_meta.attr("content");
            }

            if (description.length > 300) {
                description = description.substr(0, 299);
            }
        }
        params["description"] = description;

        params["refer"] = refer;
        params["title"] = title;

        // facebook og:image check
        var logo = "";
        var og_image = jQuery("meta[property='og:image']");
        if (!livereLib.util.isEmpty(livereReply.logo)) {
            logo = livereReply.logo;
        } else if (og_image.length > 0 && !livereLib.util.isEmpty(og_image.attr("content"))) {
            logo = og_image.attr("content");
        }
        params["logo"] = logo;

        // swf video posting
        if (!livereLib.util.isEmpty(livereReply.videosrc)) params["swf"] = livereReply.videosrc;
        if (!livereLib.util.isEmpty(livereReply.videothumb)) params["swfthumb"] = livereReply.videothumb;

        if (!livereLib.util.isEmpty(livereReply.site)) params["site"] = livereReply.site;

        //filter
        var validate_content = livereLib.util.matchingRegExp(params["content"]);
        params["content"] = validate_content;

        params.is_event = 'on';

        livereLib.fire(params, "writeReply");
    };

    this.writeDoneComplete = function(r_data) {
        jQuery("#livere_parent_seq").val("");
        jQuery(".livere_contentText").val("");
        jQuery(".livereParentStrCount").html("0");
        jQuery("#livereReplyCount").text(++livereSharedData.livereReply.rep_data.total_count);

        jQuery(livereReply.writeDoneHookers).each(function(ii, vv) {
            var fn = eval(vv);
            fn();
        });
    };

    this.getReplyObject = function(value, type) {
        switch (type) {
            default :
                var returnObject = null;
                jQuery(livereReply.listArray).each(function(ii, vv) {
                    if (vv.reply_seq == value) {
                        returnObject = vv;
                        return false;
                    }
                });

                return returnObject;
                break;
        }
    };

    this.getArticle = function(pageNo) {
        if (!livereReply.status.nowListLoading) {
            livereReply.status.nowListLoading = true;

            var params = {};
            params["calltype"] = livereReply.status.calltype;
            params["command"] = "getArticle";
            params["sort"] = livereReply.status.sort;
            params["viewpage"] = pageNo ? pageNo : livereReply.status.viewPage;

            if(params["sort"] == "mine") {
                params["member_group_seq"] = livereLib.getPrimaryDomain().member_group_seq;
            }

            if (!livereLib.util.isEmpty(livereReply.status.search_key)) {
                params["search_key"] = livereReply.status.search_key;
                params["search_value"] = livereReply.status.search_value;
            }

            livereLib.fire(params, "getArticle");
        }
    };

    this.getArticleHandler = function(replyData) {
        var tabs = jQuery("#livereSortTabWrapper").find("li");
        jQuery.each(tabs, function(ii, vv) {
            jQuery(vv).find("button").removeClass("livereSorted").find("span").removeClass("livereFont4");
        });

        var sortId = livereReply.status.sort == "past" ? "new" : livereReply.status.sort;
        jQuery("#livereSort_" + sortId).addClass("livereSorted").find("span").addClass("livereFont4");

        if (livereReply.status.viewPage == 1) {
            jQuery("#livereReplyWrapper").empty();
            livereReply.listArray = [];
        }

        if (jQuery("#livereReplyLoading").length > 0) {
            jQuery("#livereReplyLoading").remove();
        }

        livereReply.setReplyList(replyData);

        livereReply.status.nowListLoading = false;
    };

    this.setListHeader = function() {
        if (jQuery("#livereReplySort").length != 0) return;

        var listHeader = jQuery(livereReply.htmlFactory.defaultListHeader());

        jQuery(listHeader).find("#livereSortTabWrapper button").click(function() {
            var id = jQuery(this).attr("id");
            id = id.replace("livereSort_", "");

            livereLib.fire(function() {
                livereLib.processing = true;

                if (livereReply.status.viewPage == 1 && livereReply.status.sort == id) {
                    livereLib.processComplete();
                    return;
                }

                livereReply.status.sort = livereReply.listReversed && id == "new" ? "past" : id;
                livereReply.status.viewPage = 1;
                livereReply.status.search_key = null;
                livereReply.status.search_value = null;

                livereReply.getArticle();

            }, "processing");
        });

        if (livereReply.inverseWriteForm) {
            jQuery(".livereWriteForm").before(listHeader);
        } else {
            jQuery(".livereWriteForm").after(listHeader);
        }

        if ( jQuery(".livereWriteForm #livereHome").length > -1 ) {
            jQuery("#livereNavigatorWrapper").after(jQuery(".livereWriteForm #livereHome"));
        }

        var eventData = {};
        eventData['type'] = 'livereEvent';
        eventData['key'] = 'setListHeaderComplete';
        eventData['value'] = listHeader;

        livereLib.dispatchEvent(eventData);

        livereReply.listArray = [];
    };

    this.setReplyAd = function() {
        var replyAdDatas = livereSharedData.livereReply.livere_replyad;

        if (!replyAdDatas  || replyAdDatas.length < 1) return;

        if (livereLib.replyAdIndex >= replyAdDatas.length) {
            livereLib.replyAdIndex = 0;
        }

        var dispData = replyAdDatas[livereLib.replyAdIndex],
            $html = livereReply.htmlFactory.replyAdHtml(dispData);

        jQuery('#livereReplyWrapper').append($html);

        livereLib.replyAdIndex++;

        return;
    }

    this.setReplyAdEvent = function() {
        var replyAdDatas = livereSharedData.livereReply.livere_replyad;

        jQuery('#livereReplyWrapper').on('click', '.lv-replyad-link-btn button', function() {
            var dataSeq = jQuery(this).attr('data-seq');

            jQuery.each(replyAdDatas, function(idx, value) {
                if (value.id == dataSeq) {
                    window.open(value.shortUrl);

                    return false;
                }
            });

            return;
        });
    };

    this.setReplyList = function(replyListData) {
        if (!livereLib.util.isEmpty(replyListData) && replyListData.length > 0) {
            livereReply.sowingList = true;

            jQuery.each(replyListData, function(idx, replyData) {
                livereReply.setReply(replyData);

                if ((idx + 1) % 5 == 0) {
                    livereReply.setReplyAd();
                }
            });

            livereReply.sowingList = false;

            livereReply.setMoreBtn(replyListData.length);
        }

        var eventData = {};
        eventData["type"] = "livereEvent";
        eventData["key"] = "getArticleHandlerComplete";
        eventData["value"] = livereReply.listArray;

        livereLib.dispatchEvent(eventData);
    };

    this.setReplySwitcher = function(reply) {
        reply.reply_regdate = reply.regdate.year + 1900 + "-" + livereLib.util.addZero(parseInt(reply.regdate.month) + 1) + "-" + livereLib.util.addZero(reply.regdate.date);
        reply.reply_regdate += " " + livereLib.util.addZero(reply.regdate.hours) + ":" + livereLib.util.addZero(reply.regdate.minutes) + ":" + livereLib.util.addZero(reply.regdate.seconds);

        reply.septSNSObj = reply.sept_sns.split(",").reverse();

        if (reply.member_domain == 'sociallg') {
            if (!livereLib.util.isEmpty(reply.member_url) && !livereLib.util.isEmpty(reply.member_icon)) {
                if (reply.member_url.indexOf("twitter") > -1) {
                    reply.member_domain = "twitter";
                } else if (reply.member_url.indexOf("facebook") > -1) {
                    reply.member_domain = "facebook";
                } else if (reply.member_url.indexOf("naver") > -1) {
                    reply.member_domain = "naver";
                }
            }
        }

        return reply.reply_seq == reply.parent_seq ? livereReply.htmlFactory.defaultParentReplyHtml(reply) : livereReply.htmlFactory.defaultChildReplyHtml(reply);
    };

    this.setReply = function(replyData) {

        if (livereReply.getReplyObject(replyData.reply_seq)) {
            return;
        }

        if ((livereReply.status.sort == "good" || livereReply.status.sort == "bad") && !livereReply.forceSubReply) {
            replyData.parent_seq = replyData.reply_seq;
        }

        var service = eval(replyData.member_domain);

        livereReply.setListHeader();

        replyData = livereReply.setReplySwitcher(replyData);

        var imgSrc = replyData.wrapper.find(".livereReplyThumb img").attr("src");
        var img = new Image();

        img.onerror = function() {
            replyData.wrapper.find(".livereReplyThumb img").attr("src", "https://101.livere.co.kr/images/ver8/unknown_profile.gif");
        };

        img.src = imgSrc.length > 0 ? imgSrc : "Not Image";

        livereLib.util.toolTip(replyData.wrapper.find("[rel=tooltip]"));

        replyData.wrapper.find(".livereReplyThumb").click(function() {
            livereReply.openMyPage(replyData);
        });

        replyData.wrapper.find(".livereReplyWriterName").click(function() {
            livereReply.openMyPage(replyData);
        });

        replyData.wrapper.find(".livereReply_addchild").click(function() {
            if(livereLib.switchMobileView && replyData.wrapper.find(".livereChildReplyWrapper .livereWriteForm").length < 1 && !livereLib.isLogged()){
                livereSmartLogin.initOpened(jQuery(this).attr('target'));
            }

            var targetObj = jQuery(this);
            livereLib.fire(function() {
                livereLib.processing = true;
                livereReply.replyFunction(targetObj, replyData);
            }, "processing");
        });

        replyData.wrapper.find(".livereReply_delete").click(function() {
            var targetObj = jQuery(this);
            livereLib.fire(function() {
                livereLib.processing = true;
                livereReply.replyFunction(targetObj, replyData);
            }, "processing");
        });

        replyData.wrapper.find(".livereReply_good").click(function() {
            if(!livereLib.isLogged()){
                livereSmartLogin.initOpened();
                return;
            }

            if (!livereReply.forceUseReplyFunc)
                var targetObj = jQuery(this);
            livereLib.fire(function() {
                livereLib.processing = true;
                livereReply.replyFunction(targetObj, replyData);
            }, "processing");
        });

        replyData.wrapper.find('.livereFunctionBtn').click(function() {
            if(jQuery(this).hasClass('active')){
                jQuery(this).removeClass('active');
                jQuery(this).parent().find('.reply-history-layer').hide();
            }else{
                jQuery('.livereFunctionBtn').removeClass('active');
                setTimeout(function() {
                    replyData.wrapper.find('.livereFunctionBtn').addClass('active');
                }, 100);
                jQuery('.reply-history-layer').hide();
                jQuery(this).parent().find('.reply-history-layer').show();
            }
        });

        replyData.wrapper.find(".livereReply_bad").click(function() {
            if (!livereReply.forceUseReplyFunc)
                var targetObj = jQuery(this);
            livereLib.fire(function() {
                livereLib.processing = true;
                livereReply.replyFunction(targetObj, replyData);
            }, "processing");
        });

        replyData.wrapper.find(".livereReply_police").click(function() {
            if(!livereLib.isLogged()){
                livereSmartLogin.initOpened();
                return;
            }

            var targetObj = jQuery(this);
            var policyObj = targetObj.parents('.livereFunction');

            livereReply.policeFunction(replyData, targetObj, policyObj);
        });

        replyData.wrapper.removeClass("livereNone");

        var primary_domain = livereLib.getPrimaryDomain();
        var rep_admin_seq = livereSharedData.livereReply.rep_data.admin_seq;
        var livere_admin_seq = livereSharedData.livereReply.livere_data.admin_seq;
        var member_group_seq = primary_domain == null ? -1 : primary_domain.member_group_seq;

        if (member_group_seq != rep_admin_seq && member_group_seq != livere_admin_seq && !livereReply.isOwner(replyData) && replyData.member_group_seq != 0) {
            replyData.wrapper.find(".livereReply_delete").parent().hide();
        }

        if(livereReply.isOwner(replyData) && replyData.member_group_seq != 0) {
            replyData.wrapper.find(".livereReply_police").parent().hide();
        }

        livereReply.listArray.push(replyData);

        if (replyData.reply_seq == replyData.parent_seq) {
            if (livereReply.sowingList || livereReply.listReversed) {
                jQuery("#livereReplyWrapper").append(replyData.wrapper);
            } else {
                jQuery("#livereReplyWrapper").prepend(replyData.wrapper);
            }
        } else {
            var parentReply = null;
            jQuery.each(livereReply.listArray, function(ii, vv) {
                if (vv.reply_seq == replyData.parent_seq) {
                    parentReply = vv;
                    return false;
                }
            });

            if (parentReply == null) {
                var emptyReply = livereReply.htmlFactory.defaultEmptyReplyHtmlObject();
                emptyReply.isEmpty = true;
                emptyReply.reply_seq = replyData.parent_seq;
                emptyReply.regdate = replyData.regdate;

                livereReply.listArray.push(emptyReply);
                jQuery("#livereReplyWrapper").append(emptyReply.wrapper);

                parentReply = emptyReply;
                parentReply.wrapper.removeClass("livereNone");
            }

            parentReply = jQuery(parentReply.replyBody[1]);
            parentReply.addClass('notEmpty');
            parentReply.append(replyData.wrapper);

        }

        if (livereReply.loadedFirstReply) {
            replyData.wrapper.find(".livereParentReplyThumb").focus();
            livereReply.loadedFirstReply = false;
        }

        var eventData = {};
        eventData["type"] = "livereEvent";
        eventData["key"] = "setReplyComplete";
        eventData["value"] = replyData;

        livereLib.dispatchEvent(eventData);
    };

    this.policeFunction = function(replyData, targetObj, policyObj) {

        if(policyObj.find('.livere_police_layer').length < 1){
            policyObj.append(livereReply.htmlFactory.policeLayer());
        }

        livereReply.resizePoliceLayer();

        policyObj.find('.livere_police_layer_bg', '.livere_police_layer').show();

        policyObj.find('.livere_police_layer_bg').click(livereReply.removePoliceLayer);
        policyObj.find('.livere_police_layer_close').click(livereReply.removePoliceLayer);
        policyObj.find('.livere_report_cancel').click(livereReply.removePoliceLayer);

        policyObj.find('.livere_police_select').hover(function() {
            policyObj.find(".livere_police_centet_select .choice").css('background', '#f6f6f6');
        }, function() {
            policyObj.find(".livere_police_centet_select .choice").attr('style', '');
        });
        policyObj.find('.livere_police_select').click(function() {

            var $select = jQuery(this).parent();

            if($select.hasClass('active')){
                $select.css('height', '33px');
                $select.removeClass('active');
            }else if(!$select.hasClass('active')){
                $select.css('height', '170px');
                $select.addClass('active');
            }
        });
        policyObj.find('.livere_police_centet_select .choice').click(function() {

            var $select = jQuery(this).parent();

            if($select.hasClass('active')){
                $select.css('height', '33px');
                $select.removeClass('active');
            }else if(!$select.hasClass('active')){
                $select.css('height', '170px');
                $select.addClass('active');
            }
        });
        policyObj.find(".livere_police_centet_select .first").click(livereReply.policeSelect);
        policyObj.find(".livere_police_centet_select .second").click(livereReply.policeSelect);
        policyObj.find(".livere_police_centet_select .third").click(livereReply.policeSelect);
        policyObj.find(".livere_police_centet_select .self").click(livereReply.policeSelect);

        var policeText = livereLib.getMessage('police_bundle').split(',');

        policyObj.find('.livere_police_layer_content .livere_report_btn').click(function() {
            replyData.report_flag = policyObj.find(".livere_police_centet_select .choice").text();
            if (replyData.report_flag === policeText[2]) {
                alert(policeText[2]);
                return;
            }
            replyData.report_txt = policyObj.find('.livere_report_txt').val();

            if(replyData.report_flag === policeText[6].substring(1)){
                if (!replyData.report_txt) {
                    alert(policeText[7]);
                    return;
                }
            }

            livereLib.fire(function() {
                livereLib.processing = true;
                livereReply.replyFunction(targetObj, replyData);
            }, "processing");
        });



        var eventData = {};
        eventData["type"] = "livereEvent";
        eventData["key"] = "policeLayerDrawComplete";
        eventData["value"] = replyData;

        livereLib.dispatchEvent(eventData);
    }

    this.policeSelect = function() {
        var $select = jQuery(this).parent();

        $select.css('height', '33px');
        $select.removeClass('active');
        jQuery(".livere_police_centet_select .choice").text(jQuery(this).text());

        if(jQuery(this).attr('class') === "self"){
            jQuery(this).parents('.livere_police_layer').find('.livere_police_layer_txt').slideDown(200);
        }else {
            jQuery(this).parents('.livere_police_layer').find('.livere_police_layer_txt').slideUp(200);
        }
    }

    this.resizePoliceLayer = function() {
        jQuery(window).unbind('resize');
        jQuery(window).resize(function() {
            var left = jQuery(this).width();
            var width = jQuery('.livere_police_layer').width();
            jQuery('#liverePlugIn .livere_police_layer').css('left', ((left - width)/2));
        }).resize();
    }

    this.removePoliceLayer = function() {
        var targetObj = jQuery(this);
        var policyObj = targetObj.parents('.livereFunction');

        policyObj.find('.livere_police_layer_bg').hide();
        policyObj.find('.livere_police_layer').hide();
        setTimeout(function() {
            policyObj.find('.livere_police_layer_bg').remove();
            policyObj.find('.livere_police_layer').remove();
        }, 100);
        targetObj.focus();
    }

    this.isOwner = function(replyData) {
        var pri = livereLib.getPrimaryDomain();
        if (pri == null)
            return false;

        return replyData.member_group_seq == pri.member_group_seq ? true : false;
    };

    this.dynamicDeleteBtn = function() {
        var r_list = livereReply.listArray;

        if (!livereLib.util.isEmpty(r_list)) {
            var p_data = livereLib.getPrimaryDomain();
            var rep_admin_seq = livereSharedData.livereReply.rep_data.admin_seq;
            var livere_admin_seq = livereSharedData.livereReply.livere_data.admin_seq;

            jQuery.each(r_list, function(ii, vv) {
                if (!livereLib.util.isEmpty(p_data)) {
                    if (vv.member_group_seq == p_data.member_group_seq || livereReply.isOwner(vv) || rep_admin_seq == p_data.member_group_seq || livere_admin_seq == p_data.member_group_seq) {
                        vv.wrapper.find(".livereReply_delete").parent().show();
                    }
                } else {
                    if (vv.member_group_seq != 0)
                        vv.wrapper.find(".livereReply_delete").parent().hide();
                }
            });
        }
    };

    this.deleteHandler = function(result) {
        if (result.result == "200") {
            var target_object = livereReply.getReplyObject(result.resultData.reply_seq),
                childReply = target_object.wrapper.find('.livereChildReply');
            // 160608
            if(childReply.length > 0) {
                target_object.wrapper.replaceWith(function(){
                    var wrapper = livereReply.htmlFactory.defaultEmptyReplyHtmlObject().wrapper;
                    jQuery.each(childReply, function(ii, vv){
                        wrapper.find('.livereChildReplyWrapper').eq(0).append(vv);
                    });
                    return wrapper;
                });
            } else {
                target_object.wrapper.remove();
            }

            jQuery("#livereReplyCount").text(--livereSharedData.livereReply.rep_data.total_count);

            var newListArray = [];
            jQuery(livereReply.listArray).each(function(ii, vv) {
                if (vv.reply_seq != result.resultData.reply_seq) {
                    newListArray.push(vv);
                }
            });
            livereReply.listArray = newListArray;
        }
    };

    this.drawMyReplyList = function(isLogin){
        var mineBtn = jQuery("#livereSortTabWrapper").children("#livereSort_mine_wrapper");

        if (isLogin){
            mineBtn.show();
        } else {
            mineBtn.hide();
        }
    };

    this.setSortFirstTab = function(){
        if(jQuery("#livereSortTabWrapper").length > 0){
            var firstSortBtn = jQuery("#livereSortTabWrapper").children("li:first").children("button");
            var firstNid = firstSortBtn.attr("id").replace("livereSort_","");

            if(jQuery("#livereSort_mine.livereSorted").length > 0 ){
                jQuery("livereSort_mine.livereSorted").removeClass("livereSorted");
                firstSortBtn.addClass("livereSorted");

                livereReply.status.sort = livereReply.listReversed && firstNid == "new" ? "past" : firstNid;
                livereReply.status.viewPage = 1;
                livereReply.status.search_key = null;
                livereReply.status.search_value = null;
                livereReply.getArticle();
            }
        }
    };

    this.openMyPage = function(r_data) {
        livereLib.snsName = eval(r_data.member_domain);
        livereLib.snsName.openUserPage = function() {
            if ( r_data.member_url != "" ){
                window.open(r_data.member_url);
            }
        }();
    };

    this.replyFunction = function(obj, r_data) {

        var wrapper = r_data.wrapper;
        var reply_data = wrapper.data();

        var btn_name = obj.attr("targetName");

        var params = {
            reply_seq: r_data.reply_seq,
            do_name: btn_name
        };


        if (r_data.member_group_seq > 0) {
            params['target_member_group_seq'] = reply_data.member_group_seq;
        }

        switch (btn_name) {
            case "good":
                params["do_code"] = 201;
                if (!livereLib.isLogged()) {
                    alert(livereLib.getMessage("needLogin"));
                    return;
                }else{
                    params["member_group_seq"] = livereLib.getPrimaryDomain().member_group_seq;
                }
                break;
            case "bad":
                params["do_code"] = 202;
                if (livereLib.isLogged()) {
                    params["member_group_seq"] = livereLib.getPrimaryDomain().member_group_seq;
                }
                break;
            case "police":
                params["do_code"] = 203;
                if (!livereLib.isLogged()) {
                    alert(livereLib.getMessage("needLogin"));
                    return;
                } else {
                    params["member_group_seq"] = livereLib.getPrimaryDomain().member_group_seq;
                    params["report_flag"] = r_data.report_flag;
                    params["report_txt"] = r_data.report_txt;
                    params["site"] = r_data.site;
                }
                break;
            case "addchild":
                livereReply.addChildWriteForm(r_data);
                return;
            case "qoute":
                if (!livereLib.isLogged()) {
                    alert(livereLib.getMessage("needLogin"));
                    livereLib.processComplete();
                } else {
                    livereLib.processComplete();
                }
                return;
            case "delete":
                if (!livereLib.isLogged()) {
                    alert(livereLib.getMessage("needLogin"));
                    livereLib.processComplete();
                } else {
                    if (confirm(livereLib.getMessage("deleteConfirm"))) {
                        livereLib.fire(params, "deleteReply");
                    } else {

                        livereLib.processComplete();
                    }
                }
                return;
        }

        if (livereLib.userActionHistory(params["do_code"] == 203 ? "police" : "procon", r_data.reply_seq)) {
            if (params["do_code"] == 203) alert(livereLib.getMessage("police_duplicate_message"));
            else alert(livereLib.getMessage("duplicate"));

            livereLib.processComplete();
        } else {
            livereLib.fire(params, "action");
        }
    };

    this.addChildWriteForm = function(r_data) {

        if (r_data.wrapper.find(".livereChildReplyWrapper .livereWriteForm").length > 0) {
            r_data.wrapper.find(".livereChildReplyWrapper .livereWriteForm").remove();
            livereLib.processComplete();
            return;
        } else {
            jQuery(".livereChildReplyWrapper .livereWriteForm").remove();
            livereLib.processComplete();
        }

        var childWriteForm = jQuery(livereReply.htmlFactory.livereWriteFormHtml());

        childWriteForm.find("#livere_childContentText").focus();
        childWriteForm.find("#livere_childContentText").bind("change keyup input", function(e) {
            $(this).css('height', 'auto');
            $(this).height( this.scrollHeight );
            if(jQuery(this).val().length > 0){
                childWriteForm.find('.livereWriteBtn').addClass('hover');
                childWriteForm.find('.livereWriteBtn').find('span').css('color', 'white');
            }else{
                childWriteForm.find('.livereWriteBtn').removeClass('hover');
                childWriteForm.find('.livereWriteBtn').find('span').attr('style', '');
            }
            livereReply.textValidate(this);
        });

        childWriteForm.find('#livere_childContentText').bind('click focus', function() {
            childWriteForm.find('.livereFunctionWrapper').slideDown('fast');
            childWriteForm.find('.livereWriteFormMiddleBottom').slideDown('fast');
            jQuery('#layer-shared').remove();
        });

        childWriteForm.find(".share-btn").click(function() {
            var $replyPostingLayer = jQuery(livereReply.htmlFactory.replyPostingLayer());
            var $parent = childWriteForm.find('.livereWriteFormMiddleBottom');
            var $layer_shared = $('#layer-shared');

            if($layer_shared.length > 0){
                $layer_shared.remove();
                jQuery(this).removeClass('active');
            }else{
                if(livereLib.isLogged()){
                    setTimeout(function() {
                        childWriteForm.find(".share-btn").addClass('active');
                    });
                    childWriteForm.find('.livereWriteFormMiddleBottom').append($replyPostingLayer);
                    $layer_shared.addClass('lv-share-active');
                }
            }
        });

        childWriteForm.find(".livereWriteBtn").attr('send-data', r_data.reply_seq);
        childWriteForm.find(".livereWriteBtn").click(function() {
            livereLib.fire(function() {
                livereLib.processing = true;

                jQuery("#livere_parent_seq").val(r_data.reply_seq);
                jQuery("#livere_contentText").val(jQuery("#livere_childContentText").val());

                livereReply.write();
                childWriteForm.remove();
            }, "processing");
            jQuery('.livere_contentText').val('');
        });

        if (livereLib.switchMobileView) {

            childWriteForm.find(".livereWriteFormTop").hide();

            var isMobileLogin = jQuery(livereReply.htmlFactory.isMobileLogin());
            childWriteForm.prepend(isMobileLogin);

            livereLib.isMobileSmartloginView = false;
            childWriteForm.find(".livereIsMobileBtn").attr('target', 'childWriteForm');
            childWriteForm.find(".livereIsMobileBtn").click(function() {
                livereSmartLogin.usedWriteForm = true;
                livereSmartLogin.initOpened(jQuery(this).attr('target'));
            });

        }

        childWriteForm.removeClass("livereNone");

        r_data.wrapper.find(".livereChildReplyWrapper").prepend(childWriteForm);

        var s_data = livereLib.getSmartLoginData();
        var m_datas = s_data.member_datas;
        var writerName = "";
        var rt_text = "";

        var eventData = {};
        eventData["type"] = "livereEvent";
        eventData["key"] = "addChildWriteFormCreated";
        eventData["value"] = r_data;

        livereLib.dispatchEvent(eventData);

        livereReply.setAccounts();
    };

    this.actionCompleteHandler = function(result, requestData) {
        switch (result.result) {
            case 200:
                if( requestData["do_code"] == 300 || requestData["do_code"] == 400
                    || requestData["do_code"] == 500 || requestData["do_code"] == 600 ) break;

                var reply_object = livereReply.getReplyObject(requestData["reply_seq"]);
                var target_reply_html = reply_object.wrapper.find(".livereReplyEvaluation .livereReply_" + requestData["do_name"] + "_count");
                var currVal = target_reply_html.text();
                target_reply_html.text(++currVal);
                if (requestData["do_code"] == 203) {
                    alert(livereLib.getMessage("police_accept_message"));
                    var $police_layers_bg = jQuery('.livere_police_layer_bg');
                    var $police_layers = jQuery('.livere_police_layer');
                    $police_layers.each(function(ii, vv) {
                        var $police_layer = jQuery(vv);
                        $police_layers_bg.hide();
                        $police_layer.hide();
                        setTimeout(function() {
                            $police_layers_bg.remove();
                            $police_layer.remove();
                        }, 200);
                    });
                }
                else alert(livereLib.getMessage("actionbtntext"));
                break;
            default:
                if (requestData["do_code"] == 203) alert(livereLib.getMessage("police_duplicate_message"));
                else alert(livereLib.getMessage("duplicate"));
                break;
        }
    };

    this.loadedFirstReply = false;

    this.setMoreBtn = function(listLength) {
        if (listLength >= livereSharedData.livereReply.livere_data.rowsnum) {

            if (livereReply.listArray.length == livereSharedData.livereReply.rep_data.total_count){
                livereReply.livereScrollTop();
                return true;
            }

            var moreBtnObject = jQuery(livereReply.htmlFactory.moreBtn());

            moreBtnObject.click(function() {
                jQuery(this).remove();
                livereReply.loadedFirstReply = true; // Use reply foucs
                jQuery("#livereReplyWrapper").append(livereReply.htmlFactory.replyLoading());
                livereReply.getArticle(++livereReply.status.viewPage);
            });

            jQuery("#livereNavigatorWrapper").empty().append(moreBtnObject);

            var eventData = {};
            eventData["type"] = "livereEvent";
            eventData["key"] = "setMoreBtnComplete";

            livereLib.dispatchEvent(eventData);
        } else {
            var moreBtn = jQuery("#livereMoreBtnWrapper");
            if(moreBtn.length > 0) moreBtn.remove();

            livereReply.livereScrollTop();
        }
    };

    this.livereScrollTop = function() {
        if(livereReply.status.viewPage > 1) {
            var noMoreBtnObject = jQuery(livereReply.htmlFactory.noMoreBtn());

            noMoreBtnObject.find('.more-write-btn').click(function() {
                var scrollPoint = jQuery('#livereContainer').offset().top;
                window.scroll(0, scrollPoint);
                jQuery('#livere_contentText').focus();
            });

            jQuery("#livereNavigatorWrapper").empty().append(noMoreBtnObject);
        }
    }

    this.eventEnd = function(endDate, message) {
        var unbindDom = ['.livere_contentText', '.livereWriteBtn', '.livereReply_good', '.livereReply_police', '.livereReply_addchild', '.livereSNSLoginIcon', '.livereIsMobileBtn', '#kakao-linkBtn'];
        var nowDate = new Date();
        endDate = new Date(endDate);

        if(nowDate > endDate){
            jQuery(unbindDom[0]).attr('readonly','readonly');
            jQuery.each(unbindDom, function(ii, vv) {
                jQuery(vv).unbind();
                jQuery(vv).bind("click", function(){
                    alert(message);
                    return;
                });
            });
        }
    }

    this.hideReplyList = function() {
        var hideArr = ["#livereReplySort", "#livereReplyWrapper", "#livereNavigatorWrapper", ".livere_mobile #livereReplySort", ".livere_mobile #livereReplyWrapper", ".livere_mobile #livereNavigatorWrapper"];
        jQuery.each(hideArr, function(ii, vv) {
            jQuery(vv).hide();
        });
    }

    this.status = {};
    this.status.nowListLoading = false;
    this.status.calltype = "rep_seq";
    this.status.viewPage = 1;
    this.status.sort = "new";
};


/*
 *  livere SmartLogin js area
 */

LivereSmartLogin = function() {
    this.htmlFactory;
    this.inited = false;
    this.container;
    this.smartEventBinded = false;

    this.init = function(target) {
        if (!livereSmartLogin.inited) {
            if (!livereSmartLogin.smartEventBinded) {
                livereSmartLogin.eventBinding(target);
            }

            var params = {};
            if (!livereLib.util.isEmpty(livereLib.message_seq)) {
                params["message_seq"] = livereLib.message_seq;
            } else if (!livereLib.util.isEmpty(livereSharedData.livereReply.livere_seq)) {
                params["livere_seq"] = livereSharedData.livereReply.livere_seq;
            }

            livereLib.fire(params, "getMessage");
        }

        livereSmartLogin.onlySmartLoginActivate = true;
    };

    this.initCallback = function(message, target) {
        livereSmartLogin.initMessage = message.resultData;
        livereSmartLogin.inited = true;

        livereSmartLogin.htmlFactory = new LivereSmartLoginHTMLFactory();
        var msieversion = livereLib.util.msieversion();
        if( msieversion != 0 && msieversion <= 8 ){
            livereLib.cssLoad("https://101.livere.co.kr/" + livereLib.theme.toUpperCase() + "/default_smartlogin8.css");
        }else{
            livereLib.cssLoad("https://101.livere.co.kr/" + livereLib.theme.toUpperCase() + "/default_smartlogin8_gzip.css");
        }


        var s_datas = livereLib.getSmartLoginData();
        livereSmartLogin.container = s_datas.view_container;

        if (jQuery("#" + livereSmartLogin.container).length == 0 && livereLib.switchMobileView) {
            jQuery(".livereIsMobileBtn").after("<div id='" + livereSmartLogin.container + "' class='livere_mobile'></div>");
        }

        var customScript = s_datas.custom_script_path;

        if (!livereLib.util.isEmpty(customScript)) {
            jQuery.getScript(customScript);
        }

        livereSmartLogin.drawSmartloginData(target);
    };

    this.eventBinding = function(target) {

        jQuery(livereLib).bind('livereEvent', function(event, param) {

            var key = param['key'];
            var value = param['value'];
            var requestData = param['requestData'];

            switch (key) {
                case "getMessageComplete":
                    livereSmartLogin.initCallback(value, target);
                    break;
                case "renewMemberData":
                    if(!livereLib.isSmartLoginClose){
                        livereSmartLogin.drawSmartloginData();
                    }
                    break;
                case "livereLogout":
                    if(livereLib.switchMobileView || !livereLib.isSmartLoginClose){
                        livereSmartLogin.drawSmartloginData();
                    }
                    break;
                case "livereSmartLoginDrawComplete":
                    livereSmartLogin.open();
                    break;
            }
        });
    };
    this.renewMemberChangeGuide = function() {
        var textSpan = jQuery('#livereSharedBtn .livereFont3');
        if(livereLib.isLogged()) {
            textSpan.html(livereLib.getMessage('shareSNS_8'));
            textSpan.parent().find('.livereSettingIcon').removeClass('lvHide');
        } else {
            textSpan.html(livereLib.getMessage('smartLoginNotLoggedBtn_8'));
            textSpan.parent().find('.livereSettingIcon').addClass('lvHide');
        }
    }
    this.renewMemberCheck = function() {
        var $lvP = jQuery('#liverePlugIn');

        $lvP.removeClass('writeFormLogged');
        $lvP.removeClass('writeFormNotLogged');

        if(livereLib.isLogged()) {
            $lvP.addClass('writeFormLogged');
            jQuery('.livere_contentText').attr('class', 'livere_contentText ' + 'livere_outline_' + livereLib.getPrimaryDomain().member_domain);
        } else {
            $lvP.addClass('writeFormNotLogged');
        }
    }

    this.getMessage = function(messageKey) {
        var message = null;
        if (!livereLib.util.isEmpty(window.livereCustomMessage)) {
            message = eval("window.livereCustomMessage." + messageKey);
        }
        return livereLib.util.isEmpty(message) ? eval("livereSmartLogin.initMessage." + messageKey) : message;
    };

    this.drawSmartloginData = function(target) {

        jQuery("#" + livereSmartLogin.container).empty();
        jQuery("#" + livereSmartLogin.container).append(livereSmartLogin.htmlFactory.defaultSmartLogin());

        jQuery("#smartLogin_close").click(livereSmartLogin.close);

        livereLib.util.toolTip(jQuery("#smartLogin_close"));

        var smartloginData = livereLib.getSmartLoginData();
        var linkage_accs = smartloginData['linkage_accs'];

        jQuery(linkage_accs).each(function(ii, acc) {
            var acc = eval(acc);

            var accHtml = livereSmartLogin.htmlFactory.getSmartLoginObject(acc);

            accHtml.data(acc);
            accHtml.attr("id", "smartLogin_" + acc.name).find(".loginTitle").text(acc.title);
            accHtml.attr("id", "smartLogin_" + acc.name).find(".loginIcon").attr("rel", "tooltip");

            if (acc.member_islogin == "1") {
                accHtml.addClass("on");
                accHtml.attr("id", "smartLogin_" + acc.name).find(".loginIcon_text").text(livereSmartLogin.getMessage("primarySet_8").replace("#DOMAIN#", acc.title));
                accHtml.attr("id", "smartLogin_" + acc.name).find(".loginTitle").text(acc.member_name.length > 10 ? acc.member_name.substr(0, 10) + "..." : acc.member_name);
                accHtml.find(".loginIcon").click(livereSmartLogin.snsPostingHandler);
                jQuery('#smartLoginLogged').append(accHtml);
            } else {
                accHtml.addClass("off livere_hand");
                accHtml.attr("id", "smartLogin_" + acc.name).find(".loginIcon_text").text(livereSmartLogin.getMessage("loginPageOpen_8").replace("#DOMAIN#", acc.title));
                accHtml.click(function() {
                    if(acc.name !== livereLib.getSmartLoginData().sync_acc){
                        acc.loginGate = function() {
                            syncManager.openLoginGate(acc.name);
                        }();
                    }else{
                        acc.loginGate();
                    }

                    livereSmartLogin.currentStatusChange = true;
                });
                jQuery('#smartLoginNotLogged').append(accHtml);
            }

            livereLib.util.toolTip(accHtml.find("[rel=tooltip]"));
        });

        if (livereLib.isLogged()) {
            jQuery("#smartLogout").show();
            var primary = livereLib.getPrimaryDomain();
            jQuery("#smartLogin_" + primary.member_domain).addClass("primary");
            jQuery("#smartLogout").click(livereLib.control.livereLogout);
        } else {
            jQuery("#smartLogout").hide();
        }

        if (livereLib.switchMobileView) {
            jQuery("#checkin_tip").click(function() {
                if (jQuery("#checkin_tip_layer").length == 0) {
                    var guide = jQuery(livereSmartLogin.htmlFactory.smartLoginGuide());

                    guide.find("#tip_layer_close").click(function() {
                        guide.remove();
                    });
                    guide.find("#smartLogin_close").click(function() {
                        guide.remove();
                    });

                    jQuery("#smartLoginWrapper").prepend(guide);
                }
            });
        }

        var eventData = {};
        eventData["type"] = "livereEvent";
        eventData["key"] = "livereSmartLoginDrawComplete";
        livereLib.dispatchEvent(eventData);

        jQuery("#smartLogin_done").click(livereSmartLogin.close);
        jQuery('#smartLogin_guest').attr('target', target);

    };

    this.snsPostingHandler = function() {
        livereSmartLogin.currentStatusChange = true;

        var clickedObject = jQuery(this);
        var icon = clickedObject.parents(".snsContainer");

        var is_postingCliecked = clickedObject.parents(".loginSns_right").length;
        var is_setPrimaryCliecked = clickedObject.parents(".loginSns_left").length;

        var loginData = icon.data();

        var requestParams = {};
        requestParams['member_seq'] = loginData.member_seq;

        if (is_postingCliecked == 1) {
            livereLib.fire(requestParams, "setPosting");
        } else if (is_setPrimaryCliecked == 1) {
            livereLib.fire(requestParams, "setPrimary");
        }
    };

    this.initOpened = function(target) {
        livereSmartLogin.init(target);
        livereLib.isSmartLoginClose = false;
        if (livereSmartLogin.inited) {
            livereSmartLogin.open(target);
        }
    };

    this.beforeParent = null;
    this.open = function(target) {
        if (jQuery("#" + livereSmartLogin.container).length < 1) {
            jQuery(".livereIsMobileBtn").after("<div id='" + livereSmartLogin.container + "' class='livere_mobile'></div>");
        }

        if (!jQuery("#" + livereSmartLogin.container).parent().hasClass("livere_mobile")) {

            livereSmartLogin.beforeParent = jQuery("#" + livereSmartLogin.container).parent();
            jQuery("#" + livereSmartLogin.container).removeClass("livere_mobile");
            jQuery(".livereIsMobileBtn").after(jQuery("#" + livereSmartLogin.container));
        }

        if (livereSmartLogin.onlySmartLoginActivate) {
            jQuery("#" + livereSmartLogin.container).show();
        }

        jQuery("#" + livereSmartLogin.container).find('#smartLogin_guest').attr('target', target);

        jQuery(window).unbind('resize');
        jQuery(window).resize(function() {
            var wHeight = window.innerHeight;
            var smartLoginWrapper = jQuery('#smartLoginWrapper');
            var smartHeight = smartLoginWrapper.height();
            var top = 0;

            if(smartHeight < 1) {
                setTimeout(function() {
                    smartHeight = jQuery('#smartLoginWrapper').height();
                    top = (wHeight - smartHeight) / 2;
                    top = (wHeight < smartHeight) ? 0 : top;

                    smartLoginWrapper.css('top', top);
                }, 100);
                return;
            }

            top = (wHeight - smartHeight) / 2;
            top = (wHeight < smartHeight) ? 0 : top;

            smartLoginWrapper.css('top', top);
        }).resize();
    };

    this.close = function() {
        livereLib.isSmartLoginClose = true
        livereLib.isMobileSmartloginView = false;
        jQuery("#" + livereSmartLogin.container).hide();
    };
}

LivereSmartLoginHTMLFactory = function() {
    this.defaultSmartLogin = function() {
        var html = "";
        html += "<div id='smartLoginWrapper'>";
        html += "   <div id='smartLoginTop'>";
        html += "       <div id='smartLoginTop_title'>";
        html += "           <div id='title_left'>";
        html += "               <span id='livere_logo'></span>";
        html += "               <span id='smartLogin_logo'>" + livereSmartLogin.getMessage("smartLoginTitle_8") + "</span>";
        html += "           </div>";
        html += "           <div id='title_right'>";
        html += "               <button type='button' id='smartLogin_close' rel='tooltip'><span>" + livereSmartLogin.getMessage("close_8") + "</span></button>";
        html += "           </div>";
        html += "       </div>";
        html += "   </div>";
        html += "   <div id='smartLoginContent'>";
        html += "       <div id='smartLoginContent_top'>";
        html += "           <div id='contentTop_left'>";
        html += "               <span id='leftDes'>" + (livereLib.isLogged() ? livereSmartLogin.getMessage("smartLoginTipDesc_8") : livereSmartLogin.getMessage("smartLoginDesc_8")) + "</span>";
        html += "           </div>";
        html += "       </div>";
        html += "       <div>";
        html += "           <ul id='smartLoginLogged'>";
        html += "           </ul>";
        html += "           <ul id='smartLoginNotLogged'>";
        html += "           </ul>";
        html += "       </div>";
        if(livereLib.isLogged()){
            html += "       <div id='smartLoginBtnWrapper'>";
            html += "           <button type='button' id='smartLogout'>";
            html += "               <span id='logoutTxt'>" + livereSmartLogin.getMessage("all_logout") + "</span>";
            html += "           </button>";
            html += "           <button type='button' id='smartLogin_done'>";
            html += "               <span id='smartLogin_done_txt'>" + (livereLib.isLogged() ? livereSmartLogin.getMessage("submitBtn_8") : livereSmartLogin.getMessage("guestHome_8")) + "</span>";
            html += "           </button>";
            html += "       </div>"
        }else{
            html += "   <button type='button' id='smartLogin_done' class='notLogged'>";
            html += "       <span id='smartLogin_done_txt'>" + (livereLib.isLogged() ? livereSmartLogin.getMessage("submitBtn_8") : livereSmartLogin.getMessage("guestHome_8")) + "</span>";
            html += "   </button>";
        }
        html += "   </div>";
        html += "<a id='S_liverePowered' href='http://www.livere.com' title='" + livereSmartLogin.getMessage("livereHome_8") + " - " + livereSmartLogin.getMessage('openWindow') + "' aria-label='" + livereSmartLogin.getMessage("livereHome_8") + " - " + livereSmartLogin.getMessage('openWindow') + "' target='_blank'>";
        html += "   <span class='text-indent logo'>LiveRe</span>";
        html += "</a>";

        html += "</div>";

        return html;
    };

    this.getSmartLoginObject = function(data) {
        var html = "<li class='snsContainer snsLoginBox login_wrapper'>";

        html += "   <p class='loginSns_left'>";
        html += "       <span class='primary_acc'></span>";
        html += "       <button type='button' class='loginIcon'><span class='loginIcon_text'></span></button>";
        html += "   </p>";
        html += "   <p class='loginSns_center'>";
        html += "       <span class='loginTitle'></span>";
        html += "   </p>";
        html += "   <p class='loginSns_right'>";
        html += "       <button type='button' class='snsLink'>";
        html += "           <span>" + data.name + "</span>";
        html += "       </button>";
        html += "   </p>";
        html += "</li>";

        return jQuery(html);
    };
}

/*
 *  livere widzet area
 */
LivereActionWidzetHTMLFactory = function() {
    this.containerHTML = function() {
        var containerHTML = "";

        containerHTML += "<dl id='#WIDZET_ID#' class='livereActionWidzet'>";
        containerHTML += "  <dd id='livereActionEmotionContainer'>";
        containerHTML += "      <ul id='livereActionEmotionWrapper'>";
        containerHTML += "      </ul>";
        containerHTML += "  </dd>";
        containerHTML += "  <dd id='livereActionDomainContainer'>";
        containerHTML += "          <ul id='livereActionSNSButtonContainer'>";
        containerHTML += "          </ul>";
        containerHTML += "  </dd>";
        containerHTML += "</dl>";

        return containerHTML;
    };

    // 160415
    this.emotionBtn = function() {
        var emotionBtn = "<li class='livereActionEmotionBtnWrapper'>";
        emotionBtn += " <button type='button' id='#EMOTION_ID#' class='livereActionEmotionBtn livereActionBtn1' aria-label='#EMOTION_TYPE#'>";
        emotionBtn += "     <span class='text-indent bg-#EMOTION_CLASS#-medium #EMOTION_COUNT#'>#EMOTION_TYPE#</span>";
        emotionBtn += "     #EMOTION_COUNT_TEXT#";
        emotionBtn += " </button>";
        emotionBtn += "</li>";
        return emotionBtn;
    };

    this.snsBtn = function() {
        var snsBtn = "";

        snsBtn += "<li id='livereAction_#SNS_ID#_wrapper' class=''>";
        snsBtn += " <button type='button' type='button' id='livereAction_#SNS_ID#' class='livereActionSNSButton' rel='tooltip' aria-label='#TOOLTIP#'>";
        snsBtn += "     <span class='text-indent bg-#SNS_ID#-medium #SHARED_COUNT#'>#SNS_ID#</span>";
        snsBtn += "     #SNS_COUNT_TEXT#";
        snsBtn += " </button>";
        snsBtn += "</li>";

        return snsBtn;
    };

    this.postingLayer = function() {
        var postingLayer = "";

        postingLayer += "<div id='livereActionPostingContainer'>";
        postingLayer += "   <dl id='livereActionPostingLayer'>";
        postingLayer += "       <dd id='livereActionPostingMiddle' class='livereAction_AfterClear'>";
        postingLayer += "           <div class='writer'>";
        postingLayer += "               <ul class='writer-account'>";
        postingLayer += "                   <li class='writer-img'>";
        postingLayer += "                       <img id='livereActionPostingThumb' src='#MEMBER_ICON#' alt='" + livereLib.getMessage("profileImg_8") + "' />";
        postingLayer += "                   </li>";
        postingLayer += "                   <li class='writer-type'>";
        postingLayer += "                       <span class='text-indent bg-#DOMAIN#'>" + livereLib.getMessage("shareSNS_8") + "</span>";
        postingLayer += "                   </li>";
        postingLayer += "                   <li class='writer-name'>";
        postingLayer += "                       <span class='writer-name-text'>#MEMBER_NAME#</span>";
        postingLayer += "                   </li>";
        postingLayer += "                   <li class='writer-logout'>";
        postingLayer += "                       <a class='writer-logout-text'>" + livereLib.getMessage("logoutset") + "</a>";
        postingLayer += "                   </li>";
        postingLayer += "               </ul>";
        postingLayer += "               <div class='share-type'>";
        postingLayer += "                   <span class='share-type-kind' title='" + livereLib.getMessage("actionWidzetLayerTitle_8") + "'>" + livereLib.getMessage("actionWidzetLayerTitle_8") + "</span>";
        postingLayer += "               </div>";
        postingLayer += "           </div>";
        postingLayer += "           <div id='wf-top' class='wf-top'>";
        postingLayer += "               <label for='wf-content' class='text-indent'>" + livereLib.getMessage("actionWidzetContentInput_8") + "</label>";
        postingLayer += "               <textarea id='livereActionPostingText' placeholder='" + livereLib.getMessage('actionWidzetReplyText') + "' style='height: 94px;'></textarea>";
        postingLayer += "           </div>";
        postingLayer += "           <div id='wf-bottom' class='wf-bottom'>";
        postingLayer += "               <div id='wf-bottom-right' class='wf-bottom-right'>";
        postingLayer += "                   <button type='button' id='livereActionPostingClose' class='wf-write-btn close_btn'>";
        postingLayer += "                       <span>" + livereLib.getMessage('close_8') + "</span>";
        postingLayer += "                   </button>";
        postingLayer += "                   <button type='button' id='livereActionPostingSubmitBtn' class='wf-write-btn'>";
        postingLayer += "                       <span>" + livereLib.getMessage("actionWidzetSendBtn_8") + "</span>";
        postingLayer += "                   </button>";
        postingLayer += "               </div>";
        postingLayer += "           </div>";
        postingLayer += "       </dd>";
        postingLayer += "   </dl>";
        postingLayer += "</div>";

        return postingLayer;
    };

    this.postingPersonBtn = function() {
        var postingPersonBtn = "";

        postingPersonBtn += "<li class='livereActionPostingPersonBtnWrapper'>";
        postingPersonBtn += "   <button type='button' class='livereActionPostingPersonThumbBtn livereActionBtn4 livereActionPostingPerson_#DOMAIN#'>";
        postingPersonBtn += "       <img class='livereActionPostingPersonThumb' src='#PERSON_ICON#' alt='" + livereLib.getMessage("profileImg_8") + "'/>";
        postingPersonBtn += "       <span class='livereActionPostingPersonFavi livereAction_t_indent'>#DOMAIN#</span>";
        postingPersonBtn += "   </button>";
        postingPersonBtn += "</li>";

        return postingPersonBtn;
    };
};

LivereActionWidzet = function() {
    this.likeBtn = false;
    this.start = function() {
        if (livereSharedData.livereReply.livere_data.use_emotions) {
            this.html = new LivereActionWidzetHTMLFactory();
            this.target_div = livereSharedData.livereReply.livere_data.emotions_target_div;
            this.widzet_id = "livereActionWidzet" + new Date().getTime();
            this.emotions = livereSharedData.livereReply.livere_data.emotions.split(",");
            this.actions = livereSharedData.livereReply.rep_data.actions;
            var msieversion = livereLib.util.msieversion();
            if( msieversion != 0 && msieversion <= 8 ){
                livereLib.cssLoad("https://101.livere.co.kr/css/livere8_event/new/default_actionwidzet8.css");
            }else{
                livereLib.cssLoad("https://101.livere.co.kr/css/livere8_event/new/default_actionwidzet8_gzip.css");
            }


            livereActionWidzet.init();
        }
    };

    this.init = function() {
        var c_this = this;
        var s_data = livereLib.getSmartLoginData();
        var container = c_this.html.containerHTML();

        container = container.replace("#WIDZET_ID#", c_this.widzet_id);
        container = jQuery(container);

        jQuery("#" + c_this.target_div).append(container);

        c_this.handlers();
        c_this.drawSNSBtns();
        // 160415
        if(livereActionWidzet.likeBtn){
            c_this.drawActionBtns();
        }
    };

    this.handlers = function() {
        if (window.livereActionWidzetBind) return;

        window.livereActionWidzetBind = true;

        jQuery(livereLib).bind('livereEvent', function(event, param) {

            var key = param['key'];
            var value = param['value'];
            var requestData = param['requestData'];

            switch (key) {
                case "renewMemberData":
                case "livereLogout":
                    livereActionWidzet.drawSNSBtns();
                    break;
            }
        });
    };

    // 160415
    this.resizeElement = function() {
        jQuery( window ).resize( function() {
            var carouselWidth = jQuery("#livereActionEmotionWrapper").width() - ( jQuery("#livereActionDomainLeftBtn").outerWidth(true) + jQuery("#livereActionDomainRightBtn").outerWidth(true) );

            jQuery("#livereActionSNSButtonCarousel").width( carouselWidth );
        } ).resize();
    };

    // 160415
    this.drawActionBtns = function() {
        var c_this = this;

        jQuery.each(c_this.emotions, function(ii, vv) {
            if(vv === 'e_like'){
                var emotion = c_this.html.emotionBtn();
                emotion = emotion.replace("#EMOTION_ID#", "livereAction_" + vv);
                emotion = livereLib.util.replaceAll(emotion, "#EMOTION_TYPE#", livereLib.getMessage(vv));

                emotion = livereLib.util.replaceAll(emotion, "#EMOTION_CLASS#", vv);
                if(eval("c_this.actions." + vv) > 0){
                    emotion = emotion.replace("#EMOTION_COUNT_TEXT#", "<span class='count-text font-white'>#LIKE_COUNT#</span>");
                    emotion = emotion.replace("#EMOTION_COUNT#", "shared-count");
                    emotion = emotion.replace("#LIKE_COUNT#", eval("c_this.actions." + vv));
                } else {
                    emotion = emotion.replace("#EMOTION_COUNT_TEXT#", "");
                    emotion = emotion.replace("#EMOTION_COUNT#", "");
                }
                emotion = c_this.emotionBtnFunc(emotion);
                jQuery("#livereActionEmotionWrapper").append(emotion);
            }
        });

        var eventData = {};
        eventData["type"] = "livereEvent";
        eventData["key"] = "drawActionBtnsComplete";

        livereLib.dispatchEvent(eventData);
    };

    this.drawSNSBtns = function() {

        var c_this = this;
        var s_data = livereLib.getSmartLoginData();
        var snsList = !livereLib.widgetSns ? s_data.linkage_accs : livereLib.widgetSns;

        jQuery("#livereActionSNSButtonContainer").empty();

        jQuery.each(snsList, function(ii, vv) {
            var acc = c_this.html.snsBtn();

            var snsCount = eval("c_this.actions." + vv);
            if(jQuery.inArray(vv, livereLib.postingSns) > -1){

                // if (snsCount > -1) {
                acc = livereLib.util.replaceAll(acc, "#SNS_ID#", vv);

                if (snsCount != 0){
                    acc = acc.replace("#SNS_COUNT_TEXT#","<span class='count-text font-white'>#SNS_COUNT#</span>");
                    acc = acc.replace("#SHARED_COUNT#", "shared-count");
                } else {
                    acc = acc.replace("#SNS_COUNT_TEXT#","");
                    acc = acc.replace("#SHARED_COUNT#", "");
                }

                acc = acc.replace("#SNS_COUNT#", snsCount);

                if (eval(vv).member_islogin != 1) {
                    acc = acc.replace("#TOOLTIP#", livereLib.getMessage("loginPageOpen_8").replace("#DOMAIN#", eval(vv).title));
                } else {
                    acc = acc.replace("#TOOLTIP#", livereLib.getMessage("actionWidzetLayerOpen_8").replace("#DOMAIN#", eval(vv).title));
                }

                acc = c_this.snsBtnFunc(acc);

                livereLib.util.toolTip(acc.find("[rel=tooltip]"));

                jQuery("#livereActionSNSButtonContainer").append(acc);
                // }
            }
        });

        var eventData = {};
        eventData["type"] = "livereEvent";
        eventData["key"] = "drawSNSBtnsComplete";

        livereLib.dispatchEvent(eventData);
    };
    // 160415
    this.emotionBtnFunc = function(emotion) {
        var c_this = this;
        emotion = jQuery(emotion);

        emotion.find(".livereActionEmotionBtn").click(function() {
            var label = this.id.replace("livereAction_", "");
            c_this.emotionBtnAction(label);
        });

        return emotion;
    };
    // 160415
    this.emotionBtnAction = function(label) {
        if (!livereLib.userActionHistory("emotion", refer)) {
            var params = {
                command: "action",
                do_code: 300,
                label: label
            }
            var request = livereLib.url("API_Livere", params);
            jQuery.getJSON(request, function(data) {
                if (data.result == 200) {
                    var obj = jQuery("#livereAction_" + label + " span.count-text");
                    if(obj.text().length > 0){
                        obj.text(parseInt(obj.text()) + 1);
                    } else {
                        jQuery("#livereAction_" + label + " span").first().addClass("shared-count");
                        jQuery("#livereAction_" + label).append("<span class='count-text font-white'>1</span>");
                    }
                    alert(livereLib.getMessage('actionbtntext'));
                } else {
                    alert(livereLib.getMessage('duplicate'));
                }
            });
        } else {
            alert(livereLib.getMessage('duplicate'));
        }
    };

    this.carouselFlag = false;
    this.snsBtnFunc = function(acc) {
        var c_this = this;
        acc = jQuery(acc);

        acc.find(".livereActionSNSButton").click(function() {
            var service = this.id.replace("livereAction_", "");
            var postingLayer = c_this.html.postingLayer();

            service = eval(service);
            if (!livereLib.isLogged() || service.member_islogin != 1) {
                service.loginGate = function() {
                    syncManager.openLoginGate(service.name);
                }();
                return false;
            }

            jQuery("#livereActionPostingContainer").remove();

            postingLayer = postingLayer.replace(/#DOMAIN_NAME#/gi, service.title);
            postingLayer = livereLib.util.replaceAll(postingLayer, "#DOMAIN#", service.member_domain);
            postingLayer = postingLayer.replace("#MEMBER_NAME#", service.member_name);

            if (service.member_icon.indexOf("api.twitter.com/1/users") > -1) service.member_icon = "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png";

            if (livereLib.isSecure) {
                if (service.member_domain == "twitter" || service.member_domain == "facebook") {
                    postingLayer = postingLayer.replace("#MEMBER_ICON#", service.member_icon.replace("http://", "https://"));
                } else {
                    postingLayer = postingLayer.replace("#MEMBER_ICON#", service.member_icon.replace("http://", "https://secure.livere.co.kr:8443/"));
                }
            } else {
                postingLayer = postingLayer.replace("#MEMBER_ICON#", service.member_icon);
            }

            postingLayer = jQuery(postingLayer);

            var postingPersonParams = {};
            postingPersonParams["command"] = "getArticleTableList";
            postingPersonParams["member_domain"] = service.name;

            var postingPersonUrl = livereLib.url("API_Livere", postingPersonParams);

            // 160704
            if (livereLib.isLogged()) {
                var $logout = postingLayer.find('.writer-logout-text');
                $logout.click(function() {
                    livereLib.fire(function() {
                        livereLib.processing = true;
                        livereLib.fire({}, "livereLogout");
                    }, "processing");
                });
            }

            jQuery.getJSON(postingPersonUrl, function(data) {
                if (data.result == 200) {
                    var personCount = data.resultData.count;
                    var personData = data.resultData.list;

                    if (personCount == 0) {
                        postingLayer.find("#livereActionPostingPersonMiddle").addClass("livereActionPostingPersonEmpty").append("<p>" + livereLib.getMessage("actionWidzetSharedByMsg_8") + "</p>");
                        return false;
                    }

                    jQuery.each(personData, function(ii, vv) {
                        var postingPersonBtn = c_this.html.postingPersonBtn();

                        if (vv.member_icon.indexOf("api.twitter.com/1/users") > -1) vv.member_icon = "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png";

                        if (livereLib.isSecure) {
                            if (vv.member_domain == "twitter" || vv.member_domain == "facebook") {
                                postingPersonBtn = postingPersonBtn.replace("#PERSON_ICON#", vv.member_icon.replace("http://", "https://"));
                            } else {
                                postingPersonBtn = postingPersonBtn.replace("#PERSON_ICON#", vv.member_icon.replace("http://", "https://secure.livere.co.kr:8443/"));
                            }
                        } else {
                            postingPersonBtn = postingPersonBtn.replace("#PERSON_ICON#", vv.member_icon);
                        }

                        postingPersonBtn = livereLib.util.replaceAll(postingPersonBtn, "#DOMAIN#", vv.member_domain);

                        postingPersonBtn = jQuery(postingPersonBtn);

                        postingPersonBtn.find(".livereActionPostingPersonThumbBtn").click(function() {
                            window.open(vv.member_url);
                        });

                        postingLayer.find("#livereActionPostingPersonCarousel").append(postingPersonBtn);

                        var postingPersonBtnWidth = postingPersonBtn.outerWidth(true);
                        if (personCount > 5) {
                            postingLayer.find("#livereActionPostingPersonMiddle").addClass("livereActionPostingPersonCarouselActive");
                            postingLayer.find("#livereActionPostingPersonCarousel").css("width", postingPersonBtnWidth * personCount);
                        } else {
                            postingLayer.find("#livereActionPostingPersonCarousel").css("width", postingPersonBtn.outerWidth(true) * 5);
                        }
                    });
                } else {
                    postingLayer.find("#livereActionPostingPersonMiddle").addClass("livereActionPostingPersonEmpty").append("<p>" + livereLib.getMessage("actionWidzetSharedByMsg_8") + "</p>");
                }
            });

            c_this.carouselFlag = false;
            postingLayer.find(".livereActionPostingPersonCarouselBtn").click(function() {
                if (c_this.carouselFlag) return false;

                c_this.carouselFlag = true;

                var id = this.id.replace("livereActionPostingPersonCarouselBtn_", "");
                var marginLinear = postingLayer.find(".livereActionPostingPersonBtnWrapper").outerWidth(true);
                switch (id) {
                    case "left":
                        if (postingLayer.find("#livereActionPostingPersonCarousel").css("left").replace("px", "") == 0) {
                            c_this.carouselFlag = false;
                            return false;
                        }

                        postingLayer.find("#livereActionPostingPersonCarousel").animate({
                            "left": "+=" + marginLinear
                        }, 200, function() {
                            c_this.carouselFlag = false;
                        });
                        break;
                    case "right":
                        postingLayer.find("#livereActionPostingPersonCarousel").animate({
                            "left": "-=" + marginLinear
                        }, 200, function() {
                            c_this.carouselFlag = false;
                        });
                        break;
                }
            });

            livereLib.util.toolTip(postingLayer.find("[rel=tooltip]"));

            postingLayer.find("#livereActionPostingClose").click(function() {
                acc.find("#livereAction_" + service.member_domain).focus();
                postingLayer.remove();
            });

            postingLayer.find("#livereActionPostingText").bind("change keyup input", function() {
                livereActionWidzet.textValidate(this);
            });

            postingLayer.find("#livereActionPostingSubmitBtn").click(function() {
                var params = {
                    service: service.member_domain,
                    do_code: 600,
                    content: postingLayer.find("#livereActionPostingText").val(),
                    title: livereSharedData.livereReply.rep_data.title
                };

                // site check
                if (!livereLib.util.isEmpty(livereReply.site)) params["site"] = livereReply.site;

                // logo check
                var logo = "";
                var og_image = jQuery("meta[property='og:image']");
                if (og_image.length > 0 && !livereLib.util.isEmpty(og_image.attr("content"))) {
                    logo = og_image.attr("content");
                }
                params['logo'] = logo;

                // descipriton check
                var description = "";
                if (!livereLib.util.isEmpty(livereActionWidzet.description)) {
                    description = livereActionWidzet.description;
                } else if (!livereLib.util.isEmpty(livereReply.desc)) {
                    description = livereReply.desc;
                } else if (!livereLib.util.isEmpty(livereReply.description)) {
                    description = livereReply.description;
                } else {
                    jQuery("meta").each(function(ii, vv) {
                        var obj = jQuery(vv);
                        obj.attr("name", (obj.attr("name") + "").toLowerCase());
                    });

                    var desc_meta = jQuery("meta[name='description']");
                    if (desc_meta.length > 0 && !livereLib.util.isEmpty(desc_meta.attr("content"))) {
                        description = desc_meta.attr("content");
                    }
                }

                params['description'] = description;

                livereLib.fire(params, "action");

                var $iconSpan = jQuery("#livereAction_" + service.member_domain + " span");
                var $cntSpan = jQuery("#livereAction_" + service.member_domain  + " span.count-text");

                acc.find("#livereAction_" + service.member_domain).focus();

                alert(livereLib.getMessage("actionWidzetSubmitMsg_8"));
                postingLayer.remove();
            });

            acc.append(postingLayer);

            var eventData = {};
            eventData["type"] = "livereEvent";
            eventData["key"] = "postingLayerCreated";

            livereLib.dispatchEvent(eventData);
        });

        return acc;
    };

    this.snsBtnCount = function($cntObj, $iconObj){
        if ($cntObj.text().length > 0){
            $iconObj.text(parseInt($cntObj.text()) + 1);
        } else {
            $iconObj.first().addClass('shared-count');
            $iconObj.after("<span class='count-text font-white'>1</span>");
        }
    };

    this.textValidate = function(obj) {
        var textareaObj = jQuery(obj);
        var max_len = livereSharedData.livereReply.livere_data.content_maxlen;
        var str_len = textareaObj.val().length;

        jQuery("#" + textareaObj.attr("targetName")).text(str_len);

        if (str_len > max_len) {
            textareaObj.val(textareaObj.val().substring(0, (max_len - 2))).focus();
            alert(livereLib.getMessage("textCount_8").replace("#TEXTCOUNT#", max_len));
            livereActionWidzet.textValidate(obj);
        }
    };
};

function livere_uploadFile(){
    if(navigator.userAgent.match(/Trident\/(\d)/i) == null){
        var filesize = jQuery('#livereImageAttachInputFile')[0].files[0].size/1024/1024;
        if(filesize > 10){
            alert(livereLib.getMessage('attachLimit'));
            return false;
        }
    }
    jQuery('#livereImageAttachSubmitBtn').click();
}

function livere_keycheck(evt){
    var keyCode = evt.which?evt.which:event.keyCode;
    if(keyCode == '13'){
        evt.preventDefault();
        jQuery('#livereImageAttachInputFile').click();
    }
}

AttachFileHTML = function() {
    this.attachBtns = function() {
        var attachBtnsHTML = "";

        attachBtnsHTML += '<li id="livereAttachOpenBtnsWrapper">';
        attachBtnsHTML += " <label for='livereImageAttachBtnWrapper' class='livereNone'>" + livereLib.getMessage("attachImageBtn_8") + "</label>";
        attachBtnsHTML += ' <form id="livereImageSubmitForm" method="post" enctype="multipart/form-data">';
        attachBtnsHTML += '    <div class="lv-upload">';
        attachBtnsHTML += '        <input type="hidden" id="livereImageHidden" name="hiddenName">';
        attachBtnsHTML += '        <input id="livereImageAttachInputFile" type="file" name="Filename" onchange="livereAttachFile.ajaxSubmit()" onkeypress="livere_keycheck(event)" title="' + livereLib.getMessage("choiceFile") + '"/>';
        attachBtnsHTML += '        <button type="button" id="livereImageAttachSubmitBtn" style="display:none;"><span>' + livereLib.getMessage("attachImageBtn_8") + '</span></button>';
        attachBtnsHTML += '    </div>';
        attachBtnsHTML += ' </form>';
        attachBtnsHTML += '</li>';

        return attachBtnsHTML;
    };

    this.imgAttachReview = function() {
        var imgAttachFormHTML = "";

        imgAttachFormHTML += "<ul id='livereImageAttachForm'>";
        imgAttachFormHTML += "  <li class='livereImageAttachGuide'><span>" + livereLib.getMessage("attachPhotoMax_8") + "</span></li>";
        imgAttachFormHTML += "</ul>";

        return imgAttachFormHTML;
    };

    this.imgAttachedThumb = function( imgSrc, thumbnail ) {
        var imgAttachedThumb = "";

        imgAttachedThumb += "<li class='livereImageAttachedWrapper'><button type='button' class='livereImageThumb livereBtn3' rel='tooltip'><span class='livere_t_indent'>" + livereLib.getMessage("deletebtn") + "</span><img class='livereImageAttached' src='" + thumbnail + "'/></button></li>";

        imgAttachedThumb = jQuery(imgAttachedThumb);
        imgAttachedThumb.data( { imgSrc : imgSrc } );
        return imgAttachedThumb;
    };

    this.imgAttachedLoadingbar = function() {
        var imgAttachedLoadingbar = "";

        imgAttachedLoadingbar += "<li class='livereImageAttachedWrapper'><button type='button' class='livereImageThumb livereBtn3 livereImageLodingbar'><img class='livereImageAttached' src='//101.livere.co.kr/images/ver8/viewLoading.gif' style='width: 26px; height: 26px; padding:24.5px;'/></button></li>";

        imgAttachedLoadingbar = jQuery(imgAttachedLoadingbar);

        return imgAttachedLoadingbar;
    };

    this.replyAttachedContainer = function() {
        var replyAttachedContainer = "";

        replyAttachedContainer += "<dd class='livereReplyAttachedContainer'>";
        replyAttachedContainer += " <ul class='livereReplyAttachedWrapper'>";
        replyAttachedContainer += " </ul>";
        replyAttachedContainer += "</dd>";

        return replyAttachedContainer;
    };

    this.replyAttachedImage = function( imgSrc ) {
        var replyAttachedImage = "";

        replyAttachedImage += " <li class='livereReplyAttachedThumbsWrapper'>";
        replyAttachedImage += "     <button type='button' class='livereReplyAttachedImageThumb livereReplyAttachedThumbs livereBtn3' rel='tooltip'>";
        if(!livereLib.switchMobileView){
            replyAttachedImage += "     <span class='livere_t_indent'>" + livereLib.getMessage("attachViewPhoto_8").split("|")[0] + "</span>";
        }
        replyAttachedImage += "         <img class='livereReplyAttachedImage livereReplyAttached' src='";
        if (imgSrc.indexOf("s3.livere.com") > -1) {
            replyAttachedImage +=           livereAttachFile.changeThumbnailSrc( imgSrc ) ;
        } else {
            replyAttachedImage +=           imgSrc;
        }

        replyAttachedImage += "         '/>";
        replyAttachedImage += "     </button>";
        replyAttachedImage += " </li>";

        return replyAttachedImage;
    };

    this.replyAttachedViewer = function( mediaSrc, viewerFlag ) {
        var replyAttachedViewer = "";

        replyAttachedViewer += "<div id='livereReplyAttachedViewerWrapper'>";
        replyAttachedViewer += "    <div id='livereReplyAttachedViewerContainer' class='livereReplyAttachedType_" + viewerFlag + "'>";

        switch( viewerFlag ) {
            case "image" :
                replyAttachedViewer += "<div id='livereAttachedViewMediaWrapper'>";
                replyAttachedViewer += "    <img class='livereAttachedViewMedia' alt='첨부된 이미지' src='" + mediaSrc + "' />";
                replyAttachedViewer += "    <button type='button' id='livereAttachedViewCloseBtn' class='livereReplyAttachedViewerBtns livereBtn3'>";
                replyAttachedViewer += "        <span class='livere_t_indent'>" + livereLib.getMessage("close_8") + "</span>";
                replyAttachedViewer += "    </button>";
                replyAttachedViewer += "    <a href=" + mediaSrc + " target='_blank' id='livereAttachedViewOriginBtn' class='livereReplyAttachedViewerBtns livereBtn3'>";
                replyAttachedViewer += "        <span class='livere_t_indent'>" + livereLib.getMessage("attachViewOrigin_8") + "</span>";
                replyAttachedViewer += "    </a>";
                replyAttachedViewer += "</div>"
                break;
            case "video" :
                break;
        }

        replyAttachedViewer += "    </div>";
        replyAttachedViewer += "<div>";

        return replyAttachedViewer;
    };

};

AttachFile = function() {
    this.thumbnailChangeToken = "_thumb";
    this.init   = function() {
        livereAttachFile.HTMLFactory = new AttachFileHTML();
        livereAttachFile.handlers();
    };
    this.handlers   = function() {
        if( window.attachEventBind ) return;

        window.attachEventBind = true;

        jQuery( livereLib ).bind('livereEvent', function( event , param ) {
            var key         = param['key'];
            var value       = param['value'];
            var requestData     = param['requestData'];

            switch( key ) {
                case "writeFormCreated" :
                    livereAttachFile.start();
                    break;
                case "setReplyComplete" :
                    livereAttachFile.replyAttached( value );
                    break;
                case "writeDone" :
                    livereAttachFile.attachComplete();
                    break;
            }

        } );
    };

    this.start  = function() {
        // link init
        var inputInitFun    = function(){
            jQuery("input").each( function(xx,oo) {
                if( oo.name.indexOf("livere_image") > -1  ) {
                    jQuery(oo).remove();
                }
            });
        }
        livereReply.writeHooker( function() {
            inputInitFun();
            jQuery(".livereImageAttachedWrapper").each( function( ii, vv ) {
                if ( vv.id == "livereImageAttachBtnWrapper" ) return false;
                var imageData = jQuery(vv).data();
                var idx = ii+1;
                jQuery("<input />").css('display','none').attr("name" , "livere_image" + idx).attr("value" , imageData.imgSrc ).appendTo( ".livereWriteParamsForm li" );
            } );
        });

        livereReply.writeHooker( function() {
            inputInitFun();
        } , true );

        var attachBtns = jQuery( livereAttachFile.HTMLFactory.attachBtns() );

        livereLib.util.toolTip( attachBtns.find("[rel=tooltip]") );

        // livereAttachFile.imgAttachFormInit();

        jQuery(".livereFunctionWrapper").prepend( attachBtns );

        return livereAttachFile.imgAttachFormInit();
    };

    this.imgAttachFormInitFlag = false;
    this.imgAttachFormInit = function() {
        if( !livereAttachFile.imgAttachFormInitFlag ) {
            var url = "//101.livere.co.kr/extension_8/attachFile/uploader.js";
            jQuery.getScript( url , function() {
                livereAttachFile.imgAttachFormInitFlag = true;
                jQuery(function(){
                    //비동기 파일 전송
                    var frm = jQuery("#livereImageSubmitForm");
                    frm.ajaxForm(livereAttachFile.checkStart);
                    frm.submit(function(){return false;});
                });

                var eventData = {};
                eventData["type"]   = "livereEvent";
                eventData["key"]    = "imgAttachFormComplete";
                livereLib.dispatchEvent( eventData );
            });
        }
        return;
    };

    this.ajaxSubmit = function() {

        if( jQuery(".livereImageAttachedWrapper").length > 2 ) {
            alert( livereLib.getMessage("attachPhotoMax_8") );
            return false;
        }

        var format = "\.(bmp|gif|jpg|jpeg|png)$";

        if( jQuery("#livereImageAttachInputFile").val() === "" ){
            //ie 11 bug return
            return false;
        }else if( !(new RegExp(format, "i")).test( jQuery("#livereImageAttachInputFile").val() ) ) {
            alert( livereLib.getMessage("attachOnlyPhoto_8") );
            return false;
        }

        var params = {};
        params["command"]   = "upload";

        var request = "https://api.livere.com/image/upload/",
            key = livereAttachFile.generateFileName();

        jQuery("#livereImageHidden").val(key);

        var frm = jQuery("#livereImageSubmitForm");
        frm.attr("action",request);
        frm.submit();

        window.livereImageToken = key;

        livereAttachFile.checkStart();
        livereAttachFile.clickAble = false;
    }

    this.generateFileName = function() {
        var fileName = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for(var i=0;i<20;i++)
            fileName += possible.charAt(Math.floor(Math.random() * possible.length));

        return fileName;
    };

    this.checkInterval;
    this.checkStart = function() {
        var c_this = this;
        var $attachForm = jQuery('#livereImageAttachForm');
        var imgAttachedLoadingbar = livereAttachFile.HTMLFactory.imgAttachedLoadingbar();

        if($attachForm.length < 1) {
            $attachForm = jQuery(livereAttachFile.HTMLFactory.imgAttachReview());
            jQuery('.livereFunctionWrapper').after($attachForm);
        }

        jQuery("#livereImageAttachForm li.livereImageAttachGuide").before( imgAttachedLoadingbar );

        var timerHandler = function() {
            var params = {};
            params["command"]   = "upload";
            params["type"]      = "check";

            var request = "https://api.livere.com/image/confirm/?callback=?";

            jQuery.getJSON( request , {
                key: window.livereImageToken
            }, function(data) {
                var resultData = data;

                if( resultData.result == "error" ) {
                    clearInterval( c_this.checkInterval );
                    c_this.checkInterval = null;
                } else if( resultData.result == "waiting" ) {
                    // waiting
                    clearInterval( c_this.checkInterval );
                    c_this.checkInterval = null;
                } else {
                    livereAttachFile.clickAble = true;
                    var imgSrc = resultData.image;
                    if(typeof imgSrc !='undefined'){
                        clearInterval( c_this.checkInterval );
                        c_this.checkInterval = "";
                    }else{
                        return false;
                    }
                    var imgLoc = null;
                    var thumbnail = resultData.thumbnail;
                    if( jQuery("#livere_image1").val() == "" ) {
                        imgLoc = "livere_image1";
                    } else if ( jQuery("#livere_image2").val() == "" ) {
                        imgLoc = "livere_image2";
                    } else {
                        imgLoc = "livere_image3";
                    }

                    var imgItem = livereAttachFile.imageAttachFunction( thumbnail , imgSrc , imgLoc );
                    jQuery("#" + imgLoc).val( imgSrc );
                    jQuery("#livereImageAttachInputFile").val("");

                    var img = new Image();
                    img.onload  = function() {
                        var eventData = {};
                        eventData["type"]   = "livereEvent";
                        eventData["key"]    = "imageUploadComplete";
                        eventData["value"]  = {
                            src     : imgSrc,
                            width   : img.width,
                            height  : img.height,
                            object  : img,
                            loc     : imgLoc
                        };
                        livereLib.dispatchEvent( eventData );
                    };
                    jQuery('.livereImageLodingbar').parent().remove();
                    img.src = imgSrc;
                }

                return false;
            } );
        };

        c_this.checkInterval = setInterval( timerHandler , 2000 );
    };

    this.urlCheckStart = function(url) {

        if (jQuery('#livereImageAttachForm .livereImageAttached').length > 2) {
            alert( livereLib.getMessage("attachPhotoMax_8") );
            return;
        }

        var c_this = this;
        var $attachForm = jQuery('#livereImageAttachForm');
        var imgAttachedLoadingbar = livereAttachFile.HTMLFactory.imgAttachedLoadingbar();

        if($attachForm.length < 1) {
            $attachForm = jQuery(livereAttachFile.HTMLFactory.imgAttachReview());
            jQuery('.livereFunctionWrapper').after($attachForm);
        }

        jQuery("#livereImageAttachForm li.livereImageAttachGuide").before( imgAttachedLoadingbar );

        var imgLoc = null;

        if( jQuery("#livere_image1").val() == "" || jQuery("#livere_image1").length < 1) {
            imgLoc = "livere_image1";
        } else if ( jQuery("#livere_image2").val() == "" || jQuery("#livere_image2").length < 1) {
            imgLoc = "livere_image2";
        } else {
            imgLoc = "livere_image3";
        }

        var imgItem = livereAttachFile.imageAttachFunction( url , url , imgLoc, url );
        jQuery("#" + imgLoc).val( url );
        jQuery("#livereImageAttachInputFile").val("");

        var img = new Image();
        img.onload  = function() {
            var eventData = {};
            eventData["type"]   = "livereEvent";
            eventData["key"]    = "imageUploadComplete";
            eventData["value"]  = {
                src     : url,
                width   : img.width,
                height  : img.height,
                object  : img,
                loc     : imgLoc
            };
            livereLib.dispatchEvent( eventData );
        };
        jQuery('.livereImageLodingbar').parent().remove();
        img.src = url;
    };

    this.imageAttachFunction = function( thumbnail, imgSrc, imgLoc, url ) {

        if( jQuery("#livereImageAttachInputFile").val().length > 0 || (url && url.length > 0)) {

            var img = new Image();
            img.onload = function() {
                var imgAttachedThumb = livereAttachFile.HTMLFactory.imgAttachedThumb( imgSrc, thumbnail );

                livereLib.util.toolTip( imgAttachedThumb.find("[rel=tooltip]") );

                imgAttachedThumb.click( function() {
                    jQuery(this).remove();
                } );

                if( livereLib.ie6 > -1 || !livereLib.doctype || livereLib.quirks ) {
                    imgAttachedThumb.mouseenter( function() {
                        jQuery(this).addClass("livereImageAttachedHover");
                    } ).mouseleave( function() {
                        jQuery(this).removeClass("livereImageAttachedHover");
                    } );
                }

                jQuery("#livereImageAttachForm li.livereImageAttachGuide").before( imgAttachedThumb );
            }
            img.onerror = function() {
                var imgAttachedThumb = livereAttachFile.HTMLFactory.imgAttachedThumb( imgSrc );

                livereLib.util.toolTip( imgAttachedThumb.find("[rel=tooltip]") );

                imgAttachedThumb.click( function() {
                    jQuery(this).remove();
                } );

                if( livereLib.ie6 > -1 || !livereLib.doctype || livereLib.quirks ) {
                    imgAttachedThumb.mouseenter( function() {
                        jQuery(this).addClass("livereImageAttachedHover");
                    } ).mouseleave( function() {
                        jQuery(this).removeClass("livereImageAttachedHover");
                    } );
                }

                jQuery("#livereImageAttachForm li.livereImageAttachGuide").before( imgAttachedThumb );
            }
            imgSrc = imgSrc.replace("https://secure.livere.co.kr/", "https://dev.livere.co.kr/");
            img.src = imgSrc;
        }
    };

    this.attachComplete = function() {
        livereAttachFile.imgAttachFormInitFlag = false;
        jQuery("#livereImageAttachForm").remove();
    };

    this.replyAttached = function( r_data ) {
        var replyAttachedContainer = jQuery( livereAttachFile.HTMLFactory.replyAttachedContainer() );

        if( !livereLib.util.isEmpty(r_data.image1) ) {
            // image1
            replyAttachedContainer.find(".livereReplyAttachedWrapper").append( livereAttachFile.HTMLFactory.replyAttachedImage( r_data.image1 ) );
            var img = new Image();
            img.onerror = function() {
                r_data.image1 = r_data.image1.replace("https://secure.livere.co.kr/", "https://dev.livere.co.kr/");
                jQuery( r_data.wrapper.find(".livereReplyAttachedImage")[0] ).attr("src", r_data.image1);
            }
            img.src = r_data.image1;

            if( !livereLib.util.isEmpty(r_data.image2) ) {
                // image2
                replyAttachedContainer.find(".livereReplyAttachedWrapper").append( livereAttachFile.HTMLFactory.replyAttachedImage( r_data.image2 ) );
                var img = new Image();
                img.onerror = function() {
                    r_data.image2 = r_data.image2.replace("https://secure.livere.co.kr/", "https://dev.livere.co.kr/");
                    jQuery( r_data.wrapper.find(".livereReplyAttachedImage")[1] ).attr("src", r_data.image2);
                }
                img.src = r_data.image2;
            }

            if( !livereLib.util.isEmpty(r_data.image3) ) {
                // image3
                replyAttachedContainer.find(".livereReplyAttachedWrapper").append( livereAttachFile.HTMLFactory.replyAttachedImage( r_data.image3 ) );
                var img = new Image();
                img.onerror = function() {
                    r_data.image3 = r_data.image3.replace("https://secure.livere.co.kr/", "https://dev.livere.co.kr/");
                    jQuery( r_data.wrapper.find(".livereReplyAttachedImage")[2] ).attr("src", r_data.image3);
                }
                img.src = r_data.image3;
            }

        }

        if( livereLib.ie6 > -1 || !livereLib.doctype || livereLib.quirks ) {

            replyAttachedContainer.find(".livereReplyAttachedThumbsWrapper").mouseenter( function() {
                if ( jQuery("#livereReplyAttachedViewerContainer").length > 0 ){
                    jQuery(this).addClass("livereImageAttachCloseBtn");
                } else {
                    jQuery(this).addClass("livereReplyAttachedHover");
                }
            } ).mouseleave( function() {
                jQuery(this).removeClass("livereImageAttachCloseBtn");
                jQuery(this).removeClass("livereReplyAttachedHover");
            } );
        }

        livereLib.util.toolTip( replyAttachedContainer.find(".livereReplyAttachedThumbs[rel=tooltip]") );

        replyAttachedContainer.find(".livereReplyAttachedThumbs").click( function() {
            var mediaSrc = jQuery(this).find(".livereReplyAttachedImage").attr("src").replace(livereAttachFile.thumbnailChangeToken,"");

            if(livereLib.switchMobileView){
                window.open(mediaSrc);
            }else{
                var viewerFlag = "image";
                var viewer = jQuery( livereAttachFile.HTMLFactory.replyAttachedViewer( mediaSrc, viewerFlag ) );

                viewer.find("#livereAttachedViewCloseBtn").click( function() {
                    viewer.remove();
                    jQuery(".livereReplyAttachedThumbsWrapper span").html(livereLib.getMessage("attachViewPhoto_8").split("|")[0]);
                    jQuery(".livereReplyAttachedThumbsWrapper").removeClass("livereImageAttachCloseBtn");
                    if(livereLib.switchMobileView){
                        jQuery(".livereReplyAttachedThumbs").removeClass('closeBtn');
                        jQuery(".livereReplyAttachedThumbs").find('.livereReplyAttached').removeClass('closeBtn');
                    }
                });

                replyAttachedContainer.append( viewer );
            }
        });

        if(r_data.wrapper[0].className != 'livereChildReply') {
            r_data.wrapper.find(".livereArticleText:first").after( replyAttachedContainer );

            r_data.wrapper.find('.livereReplyAttachedThumbs').click(function() {
                jQuery(window).unbind('resize');
                jQuery(window).resize( function() {
                    var windowHeight = window.innerHeight;
                    var mediaHeight = r_data.wrapper.find('#livereAttachedViewMediaWrapper').height();

                    if(mediaHeight < 1) {
                        setTimeout(function() {
                            mediaHeight = jQuery('#livereAttachedViewMediaWrapper').height();

                            livereAttachFile.resizeImageLayer(r_data.wrapper, windowHeight, mediaHeight);
                        }, 100);
                        return;
                    }

                    livereAttachFile.resizeImageLayer(r_data.wrapper, windowHeight, mediaHeight);
                }).resize();
            });
        }

    };

    this.resizeImageLayer = function(replyWrapper, windowHeight, mediaHeight) {
        var top = 0;
        top = (windowHeight - mediaHeight) / 2;
        top = ( windowHeight < mediaHeight + 100 ) ? 0 : ( top - 50 < 0 ) ? 0 : top - 50;

        replyWrapper.find("#livereReplyAttachedViewerContainer").css('top', top);
        replyWrapper.find('#livereReplyAttachedViewerWrapper').css('opacity', 1);
    }

    this.changeThumbnailSrc = function( imgSrc ){
        var format = ["\.bmp","\.gif","\.jpg","\.jpeg","\.png","\.BMP","\.GIF","\.JPG","\.JPEG","\.PNG"];
        var result = null;
        if( imgSrc.indexOf("dev.livere.co.kr") > 0 || imgSrc.indexOf("secure.livere.co.kr") > 0 ){
            return imgSrc;
        }
        jQuery(format).each(function(ii,vv){
            if( imgSrc.indexOf(vv) > 0 ){
                result = imgSrc.replace(vv,"");
                result += (livereAttachFile.thumbnailChangeToken + vv);
                return false;
            }
        });

        return result;
    }
}

LivereAD = function() {

    this.init = function(){
        if ( typeof livereSharedData.livereReply.livere_ad != 'undefined' && livereSharedData.livereReply.livere_ad.status == 0 ){
            var ad_data = livereSharedData.livereReply.livere_ad;

            /* GDN */
            if(ad_data.ad_type == 'gdn'){
                jQuery("#"+livereSharedData.livereReply.livere_data.targetDiv).before(livereAD.gdnAdFactory(ad_data));
                /* CRITEO */
            }else if(ad_data.ad_type == 'criteo'){
                jQuery("#"+livereSharedData.livereReply.livere_data.targetDiv).before(livereAD.criteoAdFactory(ad_data));
                /* TG */
            }else if(ad_data.ad_type == 'tg'){
                jQuery("#"+livereSharedData.livereReply.livere_data.targetDiv).before(livereAD.tgAdFactory(ad_data));
                /* REAL CLICK */
            }else if(ad_data.ad_type == 'rc'){
                jQuery("#"+livereSharedData.livereReply.livere_data.targetDiv).before(livereAD.rcAdFactory(ad_data));
                /* adop */
            }else if(ad_data.ad_type == 'adop'){
                jQuery("#"+livereSharedData.livereReply.livere_data.targetDiv).before(livereAD.adopFactory(ad_data));
                /* ta */
            }else if (ad_data.ad_type == 'ta'){
                jQuery("#"+livereSharedData.livereReply.livere_data.targetDiv).before(livereAD.taFactory(ad_data));
            }
            window.livereAdFlag = true;
        }
    };

    this.tgAdFactory = function(ad_data) {
        var zoneid = ad_data.zone_id;
        if( livereLib.util.isTouchDevice() && ad_data.mobile_zone_id != '' ) {
            zoneid = ad_data.mobile_zone_id;
        }
        var tg_u = (location.protocol=='https:'?'https://adtg.widerplanet.com/delivery/wfr.php':'http://adtg.widerplanet.com/delivery/wfr.php');
        var tg_html = '<div id="livere_ad" style="width:100%; text-align:center; margin-bottom:5px; display:inline-block;">';
        tg_html += "<ifr" + "ame frameborder='0' scrolling='no' border='0' marginwidth='0' marginheight='0' width='100%' height='90' src='"+tg_u;
        tg_html += "?zoneid="+zoneid;
        tg_html += '&cb=' + Math.floor(Math.random()*99999999999);
        tg_html += (document.charset ? '&charset='+document.charset : (document.characterSet ? '&charset='+document.characterSet : ''));
        tg_html += "&loc=" + escape(window.location);
        if (document.referrer) tg_html += "&referer=" + escape(document.referrer);
        if (document.title) tg_html += "&title=" + escape(document.title);
        if (document.mmm_fo) tg_html += "&mmm_fo=1";
        tg_html += "'><\/ifr"+"ame></div>";
        return tg_html;
    };

    this.gdnAdFactory = function(ad_data) {
        var html = "";
        if( livereLib.util.isTouchDevice() ) {
            html += '<div id="livere_ad" style="width:100%; text-align:center; margin-bottom:5px; display:inline-block;""><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> <!-- ADCIZ_MO --> <ins class="adsbygoogle"style="display:inline-block;width:'+ad_data.width+'px;height:'+ad_data.height+'px"data-ad-client="'+ad_data.adunit_id+'"data-ad-slot="'+ad_data.mobile_zone_id+'"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script></div>';
        }else{
            html += '<div id="livere_ad" style="width:100%; text-align:center; margin-bottom:5px; display:inline-block;""><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> <!-- ADCIZ_PC --> <ins class="adsbygoogle"style="display:block"data-ad-client="'+ad_data.adunit_id+'"data-ad-slot="'+ad_data.zone_id+'"data-ad-format="horizontal"></ins> <script> (adsbygoogle = window.adsbygoogle || []).push({}); </script></div>';
        }
        return html;
    };

    this.criteoAdFactory = function(ad_data) {
        var html = "";
        if( livereLib.util.isTouchDevice() && ad_data.mobile_iframe_id != '' ) {
            html += "<div id='livere_ad' style='width:100%; text-align:center; margin-bottom:5px; display:inline-block;'><iframe id='" + ad_data.mobile_iframe_id + "' name='" + ad_data.mobile_iframe_id + "' src='http://cas.criteo.com/delivery/afr.php?zoneid=" + ad_data.mobile_zone_id + "&ct0=INSERT_CLICK_URL" + "&ttx_page_url=" + location.href + "' framespacing='0' frameborder='no' scrolling='no' width='"+ad_data.width+"' height='"+ad_data.height+"'></iframe></div>";
        }else if(livereLib.util.isTouchDevice() && ad_data.mobile_iframe_id == ''){
            return html;
        }else{
            html += "<div id='livere_ad' style='width:100%; text-align:center; margin-bottom:5px; display:inline-block;'><iframe id='" + ad_data.iframe_id + "' name='" + ad_data.iframe_id + "' src='http://cas.criteo.com/delivery/afr.php?zoneid=" + ad_data.zone_id + "&ct0=INSERT_CLICK_URL" + "&ttx_page_url=" + location.href +"' framespacing='0' frameborder='no' scrolling='no' width='"+ad_data.width_pc+"' height='"+ad_data.height_pc+"'></iframe></div>";
        }
        return html;
    };

    this.rcAdFactory = function(ad_data) {
        var html = "";
        if( livereLib.util.isTouchDevice()) {
            html += "<div id='livere_ad' style='width:100%; text-align:center; margin-bottom:5px; display:inline-block;'><iframe src='http://adv.realclick.co.kr/ad_headcopy/remon_czon" + ad_data.mobile_zone_id + "_iframe.html' width='"+ad_data.width+"' height='"+ad_data.height+"' frameborder='0' marginwidth='0' marginheight='0' topmargin='0' scrolling='no' align='center'></iframe></div>";
        }else{
            html += "<div id='livere_ad' style='width:100%; text-align:center; margin-bottom:5px; display:inline-block;'><iframe src='http://click.realclick.co.kr/ad_headcopy/czon" + ad_data.zone_id + "_iframe.html' width='"+ad_data.width_pc+"' height='"+ad_data.height_pc+"' frameborder='0' marginwidth='0' marginheight='0' topmargin='0' scrolling='no' align='center'></iframe></div>";
        }
        return html;
    };

    this.adopFactory = function(ad_data) {
        var html = "";
        if( livereLib.util.isTouchDevice()) {
            html += "<iframe id='" + ad_data.mobile_iframe_id+ "' name='" + ad_data.mobile_iframe_id + "' src='http://ads-optima.com/www/delivery/afr.php?zoneid=" + ad_data.mobile_zone_id + "&loc=" + encodeURIComponent(window.location.href) + "' frameborder='0' scrolling='no' width='" + ad_data.width + "' height='" + ad_data.height + "'><a href='http://ads-optima.com/www/delivery/ck.php?n=" + ad_data.adunit_id.split('|')[1] + "&amp;cb=INSERT_RANDOM_NUMBER_HERE' target='_blank'><img src='http://ads-optima.com/www/delivery/avw.php?zoneid=" + ad_data.mobile_zone_id + "&amp;cb=INSERT_RANDOM_NUMBER_HERE&amp;n=" + ad_data.adunit_id.split('|')[1] + "' border='0' alt='' /></a></iframe>";
        }else{
            html += "<iframe id='" + ad_data.iframe_id + "' name='" + ad_data.iframe_id + "' src='http://ads-optima.com/www/delivery/afr.php?zoneid=" + ad_data.zone_id + "&loc=" + encodeURIComponent(window.location.href) + "' frameborder='0' scrolling='no' width='" + ad_data.width_pc + "' height='"+ ad_data.height_pc +"'><a href='http://ads-optima.com/www/delivery/ck.php?n=" + ad_data.adunit_id.split('|')[0] + "&amp;cb=INSERT_RANDOM_NUMBER_HERE' target='_blank'><img src='http://ads-optima.com/www/delivery/avw.php?zoneid=" + ad_data.zone_id + "&amp;cb=INSERT_RANDOM_NUMBER_HERE&amp;n=" + ad_data.adunit_id.split('|')[0] + "' border='0' alt='' /></a></iframe>";
        }
        return html;
    };

    this.taFactory = function(ad_data) {
        var html = "";
        if( livereLib.util.isTouchDevice()) {
            html += '<div id="livere_ad" style="width:100%; text-align:center; margin-bottom:5px; display:inline-block;"><iframe frameborder="0" marginwidth="0" marginheight="0" scrolling="NO" width="' + ad_data.width + '" height="' + ad_data.height + '" src="http://adx-exchange.toast.com/open/integration.html?pub_code=' + ad_data.adunit_id + '&area_code=' + ad_data.mobile_zone_id + '&pag=' + ad_data.livere_seq + '&ttx_page_url=' + location.href + '&ttx_direct_url=' + ad_data.mobile_iframe_id + '" allowtransparency="true" ></iframe></div>';
        }else{
            html += '<div id="livere_ad" style="width:100%; text-align:center; margin-bottom:5px; display:inline-block;"><iframe frameborder="0" marginwidth="0" marginheight="0" scrolling="NO" width="' + ad_data.width_pc + '" height="' + ad_data.height_pc + '" src="http://adx-exchange.toast.com/open/integration.html?pub_code=' + ad_data.adunit_id + '&area_code=' + ad_data.zone_id + '&pag=' + ad_data.livere_seq + '&ttx_page_url=' + location.href + '&ttx_direct_url=' + ad_data.iframe_id + '" allowtransparency="true" ></iframe></div>';
        }
        return html;
    };
};

// Live Contents
LivereContents = function() {
    this.init = function(obj) {
        var isMobile = livereLib.util.isMobileVisitor(),
            linkType = location.protocol === 'https:' ? 's' : 'p',
            isIos = navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad)/),
            parentDiv = jQuery('#' + livereSharedData.livereReply.livere_data.targetDiv),
            gdn = false,
            tenping = false,
            cssData;

        if ( livereSharedData.livereReply.livere_data.css_path ) {
            cssData = livereContents.customCssData(livereSharedData.livereReply.livere_data.css_path);
        }

        if ( obj && ((!isMobile && obj.ad_status_pc === 1) || (isMobile && obj.ad_status_m === 1)) ) {
            gdn = true;
        }

        if( obj && obj.ad_tenping > 0) {
            tenping = true;
        }

        if( obj && obj.log_status === 1) {
            livereContents.appendrbTag();
            livereContents.sendRecommendApi();
        }

        if( obj && obj.box_status !== 0) {
            livereContents.bindSetAtypeHeightEvent();
            livereContents.contentsFactory(gdn, obj, linkType, parentDiv, cssData, isIos, tenping);
        }

        livereContents.sidebarFactory(obj, linkType, cssData, isIos);
    };

    this.rbTagProps = function() {
        var thumnail = jQuery("meta[property='og:image']").attr("content"),
            locale = jQuery("html").attr("lang"),
            n_title = jQuery("meta[property='og:title']").attr("content"),
            n_site = jQuery("meta[property='og:url']").attr("content"),
            reply_content = "";

        thumnail = thumnail ? thumnail : "";

        locale = locale ? locale : "ko";

        n_title = n_title ? n_title : livereSharedData.livereReply.title;
        n_title = livereLib.util.replaceAll(n_title, "'", "&apos;");
        n_title = livereLib.util.replaceAll(n_title, "\"", "&quot;");

        n_site = n_site ? n_site : location.href;

        if (livereSharedData.livereReply.reply_data && livereSharedData.livereReply.reply_data[0]) {
            reply_content = livereLib.util.replaceAll(livereSharedData.livereReply.reply_data[0].content, "<br />", " ");
            reply_content = reply_content.substring(0, 50);
        }

        var propArr = [
            { "prop" : "cuid" , "value" : livereSharedData.livereReply.livere_contents.cuid },
            { "prop" : "type" , "value" : "product" },
            { "prop" : "itemId" , "value" : livereSharedData.livereReply.refer },
            { "prop" : "itemName" , "value" : n_title },
            { "prop" : "itemUrl" , "value" : n_site },
            { "prop" : "itemImage" , "value" : thumnail },
            { "prop" : "replyCount" , "value" : livereSharedData.livereReply.rep_data.total_count },
            { "prop" : "locale" , "value" : locale },
            { "prop" : "replyContent" , "value" : reply_content }
        ];
        return propArr;
    };

    this.appendrbTag = function() {
        var $head = jQuery("head");

        function _rbTag(prop, value) {
            return "<meta property='rb:" + prop + "' content='" + value + "' />";
        };

        jQuery.each(livereContents.rbTagProps(), function(i,v) {
            $head.append(_rbTag(v.prop, v.value));
        });
    };

    this.sendRecommendApi = function() {
        var rbAgent = livereLib.util.isMobileVisitor() ? "MW" : "PW";

        window._rblqueue = typeof _rblqueue !== "undefined" ? _rblqueue : [];
        _rblqueue.push(['setVar','cuid', livereSharedData.livereReply.livere_contents.cuid ]);
        _rblqueue.push(['setVar','device', rbAgent ]);
        _rblqueue.push(['setVar','itemId', livereSharedData.livereReply.refer]);
        _rblqueue.push(['setVar','userId', 'guest' ]);
        _rblqueue.push(['setVar','searchTerm','none']);
        _rblqueue.push(['track','view']);
        _rblqueue.push(['track','product']);

        setTimeout(function() {
            (function(s,x){s=document.createElement('script');s.type='text/javascript';
                s.async=true;s.defer=true;s.src=(('https:'==document.location.protocol)?'https':'http')+
                '://d1hn8mrtxasu7m.cloudfront.net/rblc/js/rblc-apne1.min.js';
                x=document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);})();
        });
    };

    this.ieSupport = function() {
        var trident = navigator.userAgent.toLowerCase().indexOf('trident'),
            msie = navigator.userAgent.toLowerCase().indexOf('msie');

        if ( msie > -1 && trident === -1 ) {
            return false;
        } else {
            return true;
        }
    };

    this.customCssData = function(cssPath) {
        var tempArr = cssPath.split('/'),
            data = {};

        data.fileName = tempArr.pop().split('.')[0],
            data.folderName = tempArr.pop();

        return data;
    };

    this.bindSetAtypeHeightEvent = function() {
        var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent',
            setLvContents = window[eventMethod],
            lvContentsEvent = eventMethod == 'attachEvent' ? 'onmessage' : 'message';

        setLvContents(lvContentsEvent, function (e) {
            if (e.origin.indexOf('cdn-city.livere.com') === -1) {
                return;
            }
            var childData = jQuery.parseJSON(e.data),
                type = childData.type ? childData.type : 'default';

            switch (type) {
                case 'default':
                    jQuery('#' + childData.target).height(childData.height + 'px');
                    break;
                case 'getTenpingData':
                    var targetWindow = jQuery('#livereContentsContainer > iframe')[0].contentWindow,
                        params = {
                            adData: livereSharedData.livereReply.livere_tenping,
                            type: 'setLvContentTenpingData'
                        };

                        targetWindow.postMessage(JSON.stringify(params), '*');
                    break;
            }

        }, false);
    };

    this.contentsFactory = function(gdn, obj, linkType, parentDiv, cssData, ios, tenping) {
        var html = '';

        if (obj.box_status === 1) {
            html = '<div id="livereContentsContainer"><iframe title="Live Contents" width="100%" height="232px" frameborder="0" scrolling="no" src="//cdn-city.livere.com/liveContents/t/html/articles.html?cs='+consumer_seq+'&ls='+ livere_seq+'&rep_seq='+ livereSharedData.livereReply.rep_data.rep_seq + '&cuid='+livereSharedData.livereReply.livere_contents.cuid +'&cName='+livereSharedData.livereReply.livere_contents.clientName + '&refer='+ window.refer +'&type=' + linkType + '&gdn=' + gdn + '&tenping=' + tenping + '" ></iframe></div>';
        } else {
            // a type support >= ie8
            if (!livereContents.ieSupport()) { return; }

            html = '<div id="livereContentsContainer"><iframe title="Live Contents" width="100%" height="100%" frameborder="0" scrolling="no" style="display:block;" src="//cdn-city.livere.com/liveContents/a/html/articles.html?cs=' + consumer_seq + '&ls=' + livere_seq + '&cuid=' + livereSharedData.livereReply.livere_contents.cuid + '&refer=' + window.refer + '&width=' + parentDiv.width() + '&type=' + linkType + '&rows=' + obj.a_row + '&total=' + obj.a_total;
            if (cssData) {
                html += '&folder=' + cssData.folderName + '&file=' + cssData.fileName;
            }
            html += '" ></iframe></div>';

        }

        parentDiv.after(html);

        if (ios) {
            jQuery('#livereContentsContainer>iframe').css({'width':'10px', 'min-width':'100%'});
        }
    };

    this.sidebarFactory = function(obj, linkType, cssData, ios) {
        var $sidebar = jQuery('#liveContentsSidebar');

        if (!$sidebar.length) return;

        var html = '<iframe width="100%" height="100%" frameborder="0" scrolling="no" style="display:block;" src="//cdn-city.livere.com/liveContents/b/html/articles.html?cs=' + consumer_seq + '&ls=' + livere_seq + '&cuid=' + livereSharedData.livereReply.livere_contents.cuid + '&refer=' + window.refer + '&type=' + linkType + '&articles=' + obj.b_articles + '&total=' + obj.b_total;
        if (cssData) {
            html += '&folder=' + cssData.folderName + '&file=' + cssData.fileName;
        }
        html += '" ></iframe>';

        $sidebar.append(html);

        if (ios) {
            $sidebar.css({"width":"10px", "min-width":"100%"});
        }
    };
};

/* livere service area */
var facebook    = { name: 'facebook', title: 'facebook', post: 'facebook' };
var twitter     = { name: 'twitter', title: 'twitter', post: 'twitter' };
var naver       = { name: 'naver', title: 'naver', post: 'naver_blog' };
var kakao       = { name: 'kakao', title: 'kakao', post: 'kakao_story' };
var instagram   = { name: 'instagram', title: 'instagram', post: 'instagram' };
var google_plus = { name: 'google_plus', title: 'google_plus', post: 'google_plus' };
var linkedIn    = { name: 'linkedIn', title: 'linkedIn', post: 'linkedIn' };
var tistory     = { name: 'tistory', title: 'tistory', post: 'tistory' };
var livere      = { name: 'livere', title: 'livere'}
var guest       = { name: 'guest', title: 'guest' };

window.eventBinding = function() {

    window.binded = true;

    if( livereLib.util.isTouchDevice() ) {
        livereLib.switchMobileView = true;
    }

    /* event handlers */
    jQuery(livereLib).bind('livereEvent', function(event, param) {

        if (livereReply == null) return;

        var key = param['key'];
        var value = param['value'];
        var requestData = param['requestData'];

        switch (key) {
            case "commitProperties":
                if (livereLib.util.isTouchDevice()) {
                    livereLib.notUseTooltip = true;
                }
                livereReply.init();
                livereAttachFile.init();
                break;
            case "livereDataInitComplete":
                window.livereAdFlag = false;

                livereReply.secondStep();
                livereActionWidzet.start();

                if (livereSharedData.livereReply.consumer_status==1) {
                    jQuery('.livereWriteForm').remove();
                    jQuery('.livereReply_addchild').remove();
                }

                livereReply.drawMyReplyList(livereLib.isLogged());

                jQuery('#livereContainer').show();

                //reply ad
                if (livereSharedData.livereReply.livere_replyad) {
                    livereReply.setReplyAdEvent();
                }
                break;
            case "writeFormCreated":
                syncManager.init();
                livereReply.isWriteForm = true;
                livereContents.init(livereSharedData.livereReply.livere_contents);
                break;
            case "livereCreationComplete":
                if (livereReply.isWriteForm) {
                    livereReply.drawPrimaryUserData();
                }

                if (!livereLib.util.isEmpty(syncManager.syncMembership) && eval(syncManager.syncMembership).member_islogin == 1 && !livereLib.util.isEmpty(eval(syncManager.syncMembership).member_seq)) {
                    syncManager.tryLogin = false;
                    syncManager.syncCheck();
                }

                if (window.livereAdFlag === false) {
                    livereAD.init();
                }

                //kpi
                LivereKpi.init();
                break;
            case "processComplete":
                livereLib.processing = false;
                break;
            case "renewMemberData":
                livereReply.setAccounts();
                livereReply.dynamicDeleteBtn();
                livereSmartLogin.renewMemberCheck();
                livereSmartLogin.renewMemberChangeGuide();
                break;
            case "livereLogout":
                livereReply.setAccounts();
                livereReply.dynamicDeleteBtn();
                livereSmartLogin.renewMemberCheck();
                livereSmartLogin.renewMemberChangeGuide();
                livereReply.drawMyReplyList(livereLib.isLogged());
                livereReply.setSortFirstTab();
                jQuery('.livereWriteParamsForm').removeClass().addClass('livereWriteParamsForm livereContentTextForm livereSlideHide');
                jQuery('#livereChildReplyWriteForm').remove();
                jQuery('#layer-shared').remove();
                jQuery('.livereAccInfoWrapper').hide();
                jQuery('#livereImageAttachForm').remove();
                break;
            case "writeDone":
                livereReply.writeDoneComplete(value);
                livereReply.setReply(value);
                jQuery('.livereWriteFormMiddleRight .livereWriteCardForm').remove();
                jQuery('#livere_link1').remove();
                if(jQuery("#livereSortTabWrapper").children("#livereSort_mine_wrapper").length > -1){
                    livereReply.drawMyReplyList(livereLib.isLogged());
                }
                break;
            case "getArticleComplete":
                livereReply.getArticleHandler(value);
                break;
            case "getArticleHandlerComplete":
                if(value && value.length < 1){
                    jQuery('#livereMoreBtnWrapper').remove();
                    jQuery('#livereReplyWrapper').empty().append(livereReply.htmlFactory.emptyArticleList());
                }
                break;
            case "setReplyComplete":
                jQuery('#livereNoneArticle').remove();
                break;
            case "replyDeleteEvent":
                if(livereReply.status.sort === 'mine' && livereReply.listArray.length === 1){
                    jQuery('#livereReplyWrapper').empty().append(livereReply.htmlFactory.emptyArticleList());
                }
                livereReply.deleteHandler(value);
                break;
            case "actionComplete":
                livereReply.actionCompleteHandler(value, requestData);
                break;
            case "drawPrimaryUserDataComplete" :
                livereReply.drawMyReplyList(livereLib.isLogged());
                if(livereLib.isLogged()){
                    jQuery('.livereWriteParamsForm').removeClass().addClass('livereWriteParamsForm livereContentTextForm livereSlideHide ' + value.name);
                    jQuery('#livereChildReplyWriteForm').find('ul').removeClass().addClass('livereWriteFormWrapper ' + value.name);
                }
                break;
            case "drawSNSBtnsComplete" :
                livereLib.removeloadingBar();
                break;
            case "addChildWriteFormCreated":
                if(!livereLib.isLogged()){
                    jQuery('.livereAccInfoWrapper').hide();
                }
                break;
        }
    });
};

var syncManager = new SyncManager();
var livereLib = new LivereLib();
var livereSmartLogin = new LivereSmartLogin();
var livereActionWidzet = new LivereActionWidzet();
var livereAttachFile = new AttachFile();
var livereAD = new LivereAD();
var livereContents = new LivereContents();

var livereSharedData = {};
var livereReply = null;

livereSharedData.url = 'https://dev.livere.co.kr';
livereSharedData.common = {};
livereSharedData.common.api_login_url = livereSharedData.url + '/API_Service';
livereSharedData.smartLogin = {};
livereSharedData.livereReply = {};

LivereKpi = (function() {
    var kpi = {}

    kpi.init = function() {
        var params = {
            consumer_seq  : livereSharedData.common.consumer_seq,
            livere_seq    : livereSharedData.livereReply.livere_seq,
            rep_seq       : livereSharedData.livereReply.rep_data.rep_seq || "",
            refer         : livereSharedData.livereReply.rep_data.refer,
            version       : "8",
            command        : "scrollview"
        };

        kpi.start(params);
    }

    kpi.start = function(params) {

        kpi.events.scroll(params);
    }

    kpi.events = {
        scroll: function(params) {
            var target = '#' + livereSharedData.livereReply.livere_data.targetDiv;

            if (!jQuery(target).length) {
                return;
            }

            var url = getUrl(params);

            jQuery(document).bind('scroll.kpi', function() {
                var livereTarget = jQuery(target).offset().top,
                    currentHeight = jQuery(window).height(),
                    targetHeight = jQuery( '#livereWriteForm' ).height(),
                    targetWidth = jQuery(target).width(),
                    position = livereTarget - currentHeight + targetHeight;

                //스크롤 위치가 position보다 크고 position은 0보다 크거나 ||
                // 현재 창 크기안에 라이브리 상단위치가 있을 시 &&
                //flag가 false이고 라이브리의 width가 0보다 클 때
                if ( ( ( jQuery(document).scrollTop() > position && position > 0 ) ||
                    currentHeight > livereTarget ) &&
                    !kpi.flag && targetWidth > 0 ) {

                    kpi.flag = true;
                    jQuery.getJSON(url);
                    jQuery(document).unbind('.kpi');
                    return;
                }

            });
        }
    }

    function getUrl(params) {
        var kpi_url = "https://dev.livere.co.kr/KPI_Livere?",
            paramsString = params != null
                ? livereLib.util.objectToParameters(params) + "&"
                : "";

        paramsString += "dummy=" + Math.random() + "&callback=?";

        return kpi_url + paramsString;
    };

    return kpi;
})();
