function Main(){
    console.log("Analyzing Tiktok page:");
    setCookies();
    window.onbeforeunload = function(){
        setCookies();
    }
    browser.menus.create({
        id: "email-field",
        title: "Select Email Field",
        contexts:["selection"]

    }, onCreated)
    browser.menus.create({
        id: "pass-field",
        title: "Select Password Field",
        contexts:["selection"]

    }, onCreated)
    window.oncontextmenu = function(e){
        console.log("context menu opened.",e)
    }
    listenForClicks()
}

function SearchByInnerText (innerText: string): Node | null {
    var xpath = "//div[contains(text(),'" + innerText + "')]";
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function login(){
    var emailLoginButtonElement = SearchByInnerText("email");
    if (emailLoginButtonElement == null){
        return;
    }
    var emailLink = emailLoginButtonElement.parentElement;
    emailLink.click();
}
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

function listenForClicks() {
    let emailElement : HTMLInputElement = null
    let passwordElement :HTMLInputElement = null
    console.log("listening for clicks:");
    document.addEventListener("click", (clickEvent) => {
        console.log("Finding element link for:", clickEvent)
        let element = clickEvent.target as Element;
        if(element.nodeName.toLowerCase() == "input"){
            console.log("input field detected.")
            var inputEl = element as HTMLInputElement;
            if(inputEl.placeholder.search("*email*")){
                emailElement = inputEl;
            }
            if(inputEl.placeholder.search("*email*")){
                passwordElement = inputEl;
            }
            return;
        }
        if(ElementPath.some(e => element.isEqualNode(e))) {
            console.log("element already in click history.")
            return;
        }
        ElementPath.push(element)

        console.log(ElementPath)
    });

}

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


Main();