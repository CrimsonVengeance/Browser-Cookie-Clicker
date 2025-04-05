import sendMessage = browser.runtime.sendMessage;
import MailSlurp, {InboxDto} from "mailslurp-client";

const mailslurp = new MailSlurp({ apiKey: "f9d1866f8b4222a328547f40ecebed8981074827c8dda3367b48df55214112b8" });
let inbox : InboxDto | null = null;
let inboxes : InboxDto[] = []
function Background(){
    console.log("Analyzing Tiktok page:");
    setCookies();
    window.onbeforeunload = function(){
        setCookies();
    }
    browser.menus.create({
        id: "separator-1",
        type: "separator",
        contexts: ["editable"]
    }, onCreated);
    browser.menus.create({
        id: "email-field",
        title: "Select Email Field",
        contexts:["editable"]

    }, onCreated)
    browser.menus.create({
        id: "pass-field",
        title: "Select Password Field",
        contexts:["editable"]

    }, onCreated)
    browser.menus.onClicked.addListener((info,tab) =>{
        sendMessage(info)
    })
}
setTimeout(() =>{
    mailslurp.getEmails("245f459b-dcc2-437f-81a4-925159eb7d8a").then((message) => browser.runtime.sendMessage({email: message}));
}, 1)
browser.tabs.getCurrent().then(r => {mailslurp.waitForLatestEmail("245f459b-dcc2-437f-81a4-925159eb7d8a").then((message) => browser.tabs.sendMessage(<number>r?.id, {email: message}))})

browser.tabs.onCreated.addListener((window) =>{
    mailslurp.waitForLatestEmail("245f459b-dcc2-437f-81a4-925159eb7d8a").then((message) => browser.tabs.sendMessage(<number>window.id, {email: message}));
})
browser.tabs.onReplaced.addListener((addedtab, removedTav) =>{
    mailslurp.getEmails("245f459b-dcc2-437f-81a4-925159eb7d8a").then((message) => browser.tabs.sendMessage(addedtab, {email: message}))
})

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            console.log("creating new inbox:")
            sendResponse({emailAddress: "99819d28-f0ea-4ec1-aad3-cd8785b9f831@mailslurp.world"})
            return true;
            mailslurp.inboxController.createInboxWithDefaults().then((response) => {response.emailAddress})
                .then((codeTourContent) => sendResponse(codeTourContent));

            return true;
        /*case "recievenextemail":

    }*/
    // sendResponse can be used to send back a result to the content script

    // As we will reply asynchronously to the request, we need to tell chrome to wait for our response
    return true;
})

function setCookies(){
    let currentcookies = document.cookie.split("; ");
    let date = new Date()
    date.setDate(date.getDate()-1)
    for(let cookie in currentcookies){
        let name = currentcookies[cookie].split("=")[0]
        let cookieComponent = currentcookies[cookie].substring(name.length + 1)
        let expireDate = "expires=" + date.toString()
        document.cookie = name + "=" + cookieComponent + ";" + expireDate
    }
    document.cookie = "cookie-consent={%22optional%22:false%2C%22ga%22:false%2C%22af%22:false%2C%22fbp%22:false%2C%22lip%22:false%2C%22bing%22:false%2C%22ttads%22:false%2C%22reddit%22:false%2C%22hubspot%22:false%2C%22version%22:%22v10%22}";
}

let ElementPath: Element[] = [];



/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Item created successfully");
    }
}

function checkInputType(inputElement : Element){

}


Background()