/* load one localized string and apply it to the page */
function getMessageForID(id){
    var msg=chrome.i18n.getMessage(id);
    document.getElementById(id).innerHTML=msg;
}
/* load all strings for a page according to a list*/
function loadStrings(list){
    for (var i=0; i < list.length; i++) {
        getMessageForID(list[i]);
    }
}
