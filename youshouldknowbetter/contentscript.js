migrateSettings();
chrome.storage.sync.get("youshouldknowbetter",checkforblocks);

function checkforblocks(response) {
    console.log(response);
    // check for blocked urls
    blockedurls = response['youshouldknowbetter']["urls"];
    for (var i=0; i<blockedurls.length; i++){
        // migration for older data format
        if (blockedurls[i].url){
            var pattern = RegExp(blockedurls[i].url,"i");
        }
        else{
            var pattern = RegExp(blockedurls[i],"i");
        }
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

/* 
 * Try to detect the authors name
 * There are a few ways to do this
 *   * <meta name="author">
 *   * finding a html entity with the id "author"
 *   * maybe a few more
 * returns the author names or an empty array if none found
 */
function find_author(){
    // look for schema.org metainfo
    authors = [];
    iterator = document.evaluate( '//*[@itemprop]', document, null, XPathResult.ANY_TYPE, null );
    node = iterator.iterateNext();
    while(node){
        if(node.getAttribute("itemprop")=="author")
        {
            text = node.innerHTML;
            // strip tags from the string (some outfits put hrefs in there) 
            text = text.replace( /<.*?>/g, '' );
            // strip linebreaks (yeah those happen)
            text = text.replace( /\\n/g,'');
            // strip whitespace from the beginning and end
            text = text.trim();
            authors.push(text);
        }
        node=iterator.iterateNext();
    }
    
    // look for meta tag <meta name="author" ...>
    metatags = document.getElementsByTagName("meta");
    for(i=0;i<metatags.length;i++){
        if(metatags[i].getAttribute("name")=="author"){
            authors.push(metatags[i].getAttribute("content"));
        }
    }
    
    return authors;
}

function log_author(){
    console.log("Author: "+find_author())
}

window.onload = log_author();

/* 
 * Remove the overlay 
 * */
function destroy_overlay(){
    overlay = document.getElementById("youshouldknowbetteroverlay");
    overlay.parentNode.removeChild(overlay);
}

/*
 * Show the overlay
 * #TODO Needs serious cleanup
 */
function show_overlay(url) {
    var overlay = document.createElement("div");
    overlay.setAttribute("class","yskboverlay");
    overlay.setAttribute("id","youshouldknowbetteroverlay");
    overlay.innerHTML = '<div class="yskboverlayheader">'+chrome.i18n.getMessage("overlayHeading")+"</div>";
    // old format migration fix
    if (url.url){
        var displayname=url.url;
    }
    else{
        var displayname=url;
    }
    if(url.name){
        displayname=url.name;
    }
    overlay.innerHTML += '<div class="yskboverlayquestion">'+chrome.i18n.getMessage("overlayQuestion",displayname)+"</div>";
    if(url.comment){
        overlay.innerHTML += '<div class="yskboverlaycommentHeader">'+chrome.i18n.getMessage("overlayCommentHeader")+':</div>'+'<div class="yskboverlaycommentText">'+url.comment+'</div><div class="yskboverlaycommentPostQuestion">'+chrome.i18n.getMessage("overlayCommentPostQuestion")+'</div>';
    }
    overlay.innerHTML += "<button onclick=\"javascript:document.getElementById('youshouldknowbetteroverlay').parentNode.removeChild(document.getElementById('youshouldknowbetteroverlay'));\">"+chrome.i18n.getMessage("overlayConfirmationButton")+"</button>";
    document.body.appendChild(overlay);
}

// hotkey handler
function keypress_handler(e) {
    // keyCode 27 is ESC
    if (e.keyCode == 27){
        destroy_overlay(); 
    }
}
// register the handler 
document.addEventListener('keyup', keypress_handler, false);

