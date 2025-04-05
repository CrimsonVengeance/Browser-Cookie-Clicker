function Main(){
    console.log("Analyzing Tiktok page:");
    setCookies();
    listenForClicks();
    window.onbeforeunload = function(){
        setCookies();
    }
    login()

}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
    var ElementsClickedList = []
    console.log("listening for clicks:");
    document.addEventListener("click", (clickEvent) => {
        console.log("Finding element link for:", clickEvent)
        var element = clickEvent.target as Node;
        if(element.nodeName.toLowerCase() == "input"){
            console.log("input field detected.")
        }
        ElementsClickedList.push(element)
        console.log(ElementsClickedList)

    });

}

function FindLoginDetails(){

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
function clearBrowserCookies(){
    console.log("browser cookie changed.")
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

Main();