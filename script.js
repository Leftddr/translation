
document.addEventListener('DOMContentLoaded', function() {

    const url = "https://kapi.kakao.com/v1/translation/translate";
    const key = "af35956434233a16d98f0c2170840ca3"; //input your key
    const PAPAGO_BASE_URL = "https://papago.naver.net/website?";
    const PAPAGO_KNOWLEDGER_URL = "https://openapi.naver.com/v1/papago/detectLangs";
    const PAPAGO_TRANSLATION_URL = "https://openapi.naver.com/v1/papago/n2mt";
    var CLIENT_ID = "input your client id";
    var CLIENT_SECRET = "input your client secret";
    let load_to_page;
    let to_page;

    //https://papago.naver.net/website?locale=ko&source=en&target=ko&url=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dchrome%2Btabs%2Bsync%26oq%3Dchrome%2Btabs%2Bsync%26aqs%3Dchrome..69i57.5269j0j8%26sourceid%3Dchrome%26ie%3DUTF-8
    //https://papago.naver.net/website?locale=ko&source=ko&target=en&url=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dchrome%2Btabs%2Bsync%26oq%3Dchrome%2Btabs%2Bsync%26aqs%3Dchrome..69i57.5269j0j8%26sourceid%3Dchrome%26ie%3DUTF-8
    function getData(){
        var pro = new Promise(function (resolve, reject){
            chrome.tabs.query({currentWindow:true, active:true}, (tabs) => {
                chrome.tabs.executeScript(tabs[0].id, {code : `document.getSelection().toString()`}, (result => {
                    to_page = tabs[0].url;
                    resolve();
                }))
            })
        })
            pro.then(function(){
            var target_lang = $("select[name=target_lang]").val();
            var src_lang = "";
            if(target_lang == "en"){
                src_lang = "ko";
            } else {
                src_lang = "en";
                target_lang = "ko";
            }
            var translated_url = PAPAGO_BASE_URL + "locale=ko" + "&source=" + src_lang + "&target=" + target_lang + "&url=" + to_page;
            window.location.href = translated_url;
            window.open(translated_url);
        })
    }

    function load(){
        var pro = new Promise(function(resolve, reject){
            chrome.tabs.query({currentWindow:true, active:true}, (tabs) => {
                chrome.tabs.executeScript(tabs[0].id, {code : `document.getSelection().toString()`}, (result => {
                    load_to_page = tabs[0].url;
                    resolve();
                }))
            })
        })
        pro.then(function(){
            $.ajax({
                method : 'GET',
                url : load_to_page,
                success:function(data){
                    document.querySelector("#result").innerHTML = "processing...";
                    document.querySelector("#result").innerHTML = data;
                },
                error : function(e){
                    document.querySelector("#result").innerHTML = "Error in Load Page";
                }
            });
        })
    }

    function translation(){
        chrome.tabs.executeScript({
            code : `document.querySelector("#userWord").value`
        }, function(){
            var userWord = document.querySelector("#userWord").value;
            detectLanguage(userWord).then(function(data){
                if(userWord == null || userWord == "") return;
                var src_lang = data.langCode;
                if(src_lang == 'ko'){
                    target_lang = 'en';
                }
                else {
                    target_lang = 'ko';
                }

                var final_data = "source=" + src_lang + '&target=' + target_lang + '&text=' + userWord; 

                var options = {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Naver-Client-Id' : CLIENT_ID,
                        'X-Naver-Client-Secret' : CLIENT_SECRET,
                    },
                    body : final_data,
                    mode:'cors'
                }
            
                fetch(PAPAGO_TRANSLATION_URL, options).then(res => res.json()).then(data => {
                    if(data.message.result.translatedText == undefined) return;
                    var result_ = "";
                    result_ += '<div style="1px solid border">';
                    result_ += '<p style="font-size:15px">' + data.message.result.translatedText + '</p>';
                    result_ += '</div>';
                    document.querySelector("#result").innerHTML = result_;
                    }).catch(error => {document.querySelector("#result").innerHTML = error;});
                }).catch(function(error){alert(error.statusCode);});
            });
        }

    var wiggle = function(myelement){
        $(myelement)
            .animate({top: '+=5'}, 50)
            .animate({top: '-=10'}, 100)
            .animate({top: '+=5'}, 50) 
    };

    document.querySelector("#trans_btn").addEventListener('click', function(){
        wiggle(document.querySelector("#trans_btn"));
        translation();
    });
    document.querySelector("#page_btn").addEventListener('click', function(){
        getData();
    });
    document.querySelector("#load_btn").addEventListener('click', function(){
        load();
    });
    document.querySelector("#drag_btn").addEventListener('click', function(){
        document.querySelector("#userWord").value = selectText();
    })

    
    $("#userWord").on("propertychange change keyup paste input", function(){
        var userWord = document.querySelector("#userWord").value;
            detectLanguage(userWord).then(function(data){
                if(userWord == null || userWord == "") return;
                var src_lang = data.langCode;
                if(src_lang == 'ko'){
                    target_lang = 'en';
                }
                else {
                    target_lang = 'ko';
                }

                var final_data = "source=" + src_lang + '&target=' + target_lang + '&text=' + userWord; 

                var options = {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Naver-Client-Id' : CLIENT_ID,
                        'X-Naver-Client-Secret' : CLIENT_SECRET,
                    },
                    body : final_data,
                    mode:'cors'
                }
            
                fetch(PAPAGO_TRANSLATION_URL, options).then(res => res.json()).then(data => {
                    if(data.message.result.translatedText == undefined) return;
                    var result_ = "";
                    result_ += '<div style="1px solid border">';
                    result_ += '<p style="font-size:15px">' + data.message.result.translatedText + '</p>';
                    result_ += '</div>';
                    document.querySelector("#result").innerHTML = result_;
                    }).catch(error => {document.querySelector("#result").innerHTML = error;});
                });
        });

    function detectLanguage(userWord){
        return new Promise(function(resolve, reject){
            $.ajax({
                method:'POST',
                data:{'query': userWord},
                url:PAPAGO_KNOWLEDGER_URL,
                beforeSend: function(xhr){
                    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                    xhr.setRequestHeader("X-Naver-Client-Id", CLIENT_ID);
                    xhr.setRequestHeader("X-Naver-Client-Secret", CLIENT_SECRET);
                },
                success: function(data){
                    resolve(data);
                },
                error: function(error){
                    reject(error);
                }
            })
        })
    }

    
    function selectText(){
        /*
        var selectionText = "";
        if(document.getSelection){
            selectionText = document.getSelection();
        } else if (document.selection){
            selectionText = document.selection.createRange().text;
        }
        return selectionText;
        */
        chrome.tabs.query({currentWindow:true, active:true}, (tabs) => {
            chrome.tabs.executeScript(tabs[0].id, {code : `document.getSelection().toString()`}, (result => {
                document.querySelector("#userWord").value = result;
            }))
        })
        return result;
    }
    
});