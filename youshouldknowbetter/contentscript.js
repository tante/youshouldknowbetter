chrome.storage.sync.get("youshouldknowbetter",checkforblocks);

function checkforblocks(response) {
    blockedurls = response['youshouldknowbetter'];
    for (var i=0; i<blockedurls.length; i++){
        var pattern = RegExp(blockedurls[i],"i");
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
   overlay.innerHTML = chrome.i18n.getMessage("overlayHeading");
   overlay.innerHTML += "<br/>";
   overlay.innerHTML += chrome.i18n.getMessage("overlayQuestion");
   overlay.innerHTML += "<br/>"+url+"?<br/>";
   overlay.innerHTML += "<b><a href=\"javascript:document.getElementById('youshouldknowbetteroverlay').parentNode.removeChild(document.getElementById('youshouldknowbetteroverlay'));\">"+chrome.i18n.getMessage("overlayConfirmationButton")+"</a></b>";
   document.body.appendChild(overlay);
}
