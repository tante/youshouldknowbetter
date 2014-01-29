// load strings
var strings =["optionsHeading","optionsPagesHeading","optionsURLexplanation","optionsButtonSave"];
loadStrings(strings);

// Saves options to localStorage.
function save_options() {
  var select = document.getElementById("urls");
  var blockedurls = select.value.trim().split("\n");
  chrome.storage.sync.set({"youshouldknowbetter":blockedurls});

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  chrome.storage.sync.get("youshouldknowbetter",fill_textarea);

}

function fill_textarea(urls){
  var textarea = document.getElementById("urls");
  blockedurls = urls['youshouldknowbetter']
  for (var i=0; i < blockedurls.length; i++){
      textarea.value += blockedurls[i]+"\n";
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#optionsButtonSave').addEventListener('click', save_options);
