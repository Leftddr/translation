
document.addEventListener('DOMContentLoaded', function() {

    const url = "https://kapi.kakao.com/v1/translation/translate";
    const key = "///"; //input your key
    const PAPAGO_BASE_URL = "https://papago.naver.net/website?";


    function getData(){
        var to_page = document.querySelector('#userWord').value;
        var pos = to_page.indexOf("https://");
        if(pos != 0) {
            document.querySelector("#result").innerHTML = "Not a Domain"
            return;
        }
        var target_lang = $("select[name=target_lang]").val();
        var src_lang = "";
        if(target_lang == "en"){
            src_lang = "ko";
        } else {
            src_lang = "en";
        }
        var translated_url = PAPAGO_BASE_URL + "locale=ko" + "&source=" + src_lang + "&target=" + target_lang + "&url=" + to_page;
        window.location.href = translated_url;
        window.open(translated_url);
    }

    function translation(){
        chrome.tabs.executeScript({
            code : 'document.querySelector("#userWord").value'
        }, function(){
            var userWord = document.querySelector("#userWord").value;
            if(userWord == null || userWord == "") return;
            var src_lang = '';
            var target_lang = $("select[name=target_lang]").val();
            if(target_lang == 'en'){
                src_lang = 'kr';
            } else {
                src_lang = 'en';
            }

            var final_url = url + "?src_lang=" + src_lang + "&target_lang=" + target_lang + "&query=" + userWord;
            var options = {
                method: 'GET',
                headers: {
                    'Authorization' : 'KakaoAK ' + key,
                },
                mode:'cors'
            }
            
            fetch(final_url, options).then(res => res.json()).then(data => {
                if(data.translated_text == undefined) return;
                if(data.translated_text.length == 0) return;
                document.querySelector("#result").innerHTML = "";
                var result = "";
                for (let i = 0 ; i < data.translated_text.length ; i++){
                    result += '<div style="1px solid border">';
                    result += '<p style="font-size:15px">' + data.translated_text[i] + '</p>';
                    result += '</div>';
                }
                document.querySelector("#result").innerHTML = result;
                }).catch(error => {document.querySelector("#result").innerHTML = error;});
            });
        }

    document.querySelector("#trans_btn").addEventListener('click', function(){
        translation();
    });
    document.querySelector("#page_btn").addEventListener('click', function(){
        getData();
    });
});