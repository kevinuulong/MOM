window.onload = function(){
    chrome.tabs.onRemoved.addListener(function(){
        chrome.storage.sync.set({loggedin: false});
    });
    chrome.storage.sync.get(['pswd'], function(result){
        var pswd = result.pswd;
        if (pswd == undefined){
            chrome.storage.sync.set({allowed: ["edge://","opera://","chrome-extension://","chrome://newtab","google.com/","nbclearn.com/","unsplash.com/"]}); //DO NOT REMOVE chrome-extension:// or chrome://
        }
    });
    chrome.tabs.onUpdated.addListener(function (){
        chrome.storage.sync.get(['wl'], function(result){
            var wl = result.wl;
            console.log("whitelist: " + wl);
            if (wl){
                chrome.storage.sync.get(['allowed'], function(result){
                    var allowed = result.allowed;
                    chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {
                        var url = tabs[0].url, // the string to check against
                            blocked = true,
                            length = allowed.length;
                        while(length--) {
                            if (url.indexOf(allowed[length])!=-1) {
                                console.log("Allowed website")
                                    blocked = false;
                            }
                        }
                        if(blocked){
                            console.log(url + " not allowed");
                            chrome.tabs.update(null,{url: chrome.extension.getURL("blocked/blocked.html")}); //Put the page to redirect to upon blocked website here
                        }
                    });
                });
            };
        });
    });
    chrome.downloads.onCreated.addListener(function(download) {
        chrome.storage.sync.get(['dl'], function(result){
            var dl = result.dl;
            if (dl){
                chrome.downloads.cancel(download.id);
                chrome.tabs.update(null,{url: chrome.extension.getURL("blocked/blocked.html")});
                if(download.state == "complete"){
                    chrome.downloads.removeFile(download.id);
                }
            };
        });
    });    
};

//To call this function from another file use chrome.extension.getBackgroundPage().addsite(site);
function addsite(site){
    chrome.storage.sync.get({allowed: []}, function(result){
        var allowed = result.allowed;
        allowed.push(site);
        console.log (allowed);
        chrome.storage.sync.set({allowed: allowed});
    });
};