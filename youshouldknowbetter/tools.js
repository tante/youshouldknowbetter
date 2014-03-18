/* load one localized string and apply it to the page */
function getMessageForID(id){
    try{
        var msg=chrome.i18n.getMessage(id);
        document.getElementById(id).innerHTML=msg;
    }
    catch (err){
        console.log("Given language string "+id+" does not exist.");
    }
}
/* load all strings for a page according to a list*/
function loadStrings(list){
    for (var i=0; i < list.length; i++) {
        getMessageForID(list[i]);
    }
}

/* clean settings template */

function get_settingstemplate(){
    var settings = {"version":2}
    return settings;
}


/* the hackish way to store settings wasn't great so let's migrate to a smarter thingy
 */

function migrateSettings(){
    chrome.storage.sync.get("youshouldknowbetter", function (data){
        try{
            data['version'];
        }
        catch(err){
            var settings = get_settingstemplate();
            settings["urls"]=data["youshouldknowbetter"];
            chrome.storage.sync.set({"youshouldknowbetter":settings});
        }
    })
}
