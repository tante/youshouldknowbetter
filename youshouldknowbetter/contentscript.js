chrome.storage.sync.get("youshouldknowbetter",checkforblocks);

function checkforblocks(response) {
    blockedurls = response['youshouldknowbetter'];
    for (var i=0; i<blockedurls.length; i++){
        var pattern = RegExp(blockedurls[i].url,"i");
        if(pattern.test(window.location.href)){
            /* check if the referrer is from this domain. 
             * if not show the overlay */
            var ref = document.referrer;
            if(!pattern.test(ref)){
                show_overlay(blockedurls[i]);
            }
        }
    }
}

function destroy_overlay(){
    overlay = document.getElementById("youshouldknowbetteroverlay");
    overlay.parentNode.removeChild(overlay);
}

function show_overlay(url) {
    var overlay = document.createElement("div");
    overlay.setAttribute("class","overlay");
    overlay.setAttribute("id","youshouldknowbetteroverlay");
    overlay.innerHTML = '<div class="yskboverlayheader">'+chrome.i18n.getMessage("overlayHeading")+"</div>";
    var displayname=url.url;
    if(url.name){
        displayname=url.name;
    }
    overlay.innerHTML += '<div class="yskboverlayquestion">'+chrome.i18n.getMessage("overlayQuestion",displayname)+"</div>";
    if(url.comment){
        overlay.innerHTML += '<div class="yskboverlaycommentHeader">'+chrome.i18n.getMessage("overlayCommentHeader")+':</div>'+'<div class="yskboverlaycommentText">'+url.comment+'</div><div class="yskboverlaycommentPostQuestion">'+chrome.i18n.getMessage("overlayCommentPostQuestion")+'</div>';
    }
    overlay.innerHTML += "<b><a href=\"javascript:document.getElementById('youshouldknowbetteroverlay').parentNode.removeChild(document.getElementById('youshouldknowbetteroverlay'));\">"+chrome.i18n.getMessage("overlayConfirmationButton")+"</a></b>";
    document.body.appendChild(overlay);
}
