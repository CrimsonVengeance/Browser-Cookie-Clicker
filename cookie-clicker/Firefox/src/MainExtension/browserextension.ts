function Main(){
    if(SearchForLoginField()){
        login(<HTMLInputElement>SearchForInputField("email"), <HTMLInputElement>SearchForInputField("pass"))
    }else{
        listenForClicks()
    }
}
function listenForClicks() {
    let ElementPath : Element[] = []
    console.log("listening for clicks:");
    document.addEventListener("click", (watchClickPath));
    function watchClickPath(clickEvent : MouseEvent){
        console.log("Finding element link for:", clickEvent)
        let element = clickEvent.target as Element;
        if(ElementPath.some(e => element.isEqualNode(e))) {
            console.log("element already in click history.")
            return;
        }
        ElementPath.push(element)
        console.log("element path:", ElementPath)
        console.log("can we find the login path now?")
        if (SearchForLoginField()){
            document.removeEventListener("click", watchClickPath)
            login(<HTMLInputElement>SearchForInputField("email"), <HTMLInputElement>SearchForInputField("pass"))

        }
    }
}
async function fetchNewEmailAddress() {
    console.log("fetching new email:")
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        }
    });

    xhr.open('GET', 'https://privatix-temp-mail-v1.p.rapidapi.com/request/mail/id/null/');
    xhr.setRequestHeader('x-rapidapi-host', 'privatix-temp-mail-v1.p.rapidapi.com');

    xhr.send(data);
}
function SearchForLoginField(){
    console.log(SearchForInputField("email"));
    console.log(SearchForInputField("pass"));
    return !(SearchForInputField("email") == null || SearchForInputField("pass") == null);
}

function SearchForInputField(searchTerm: string) : HTMLInputElement| null {
    let possibleEmailElements = document.querySelectorAll('[placeholder]');
    for(let element in possibleEmailElements){
        if(possibleEmailElements[element] instanceof HTMLInputElement){
            try{
            if(possibleEmailElements[element].placeholder.toLowerCase().match("[/W/S]*"+searchTerm.toLowerCase()+"[/W/S]*")){
                return possibleEmailElements[element];
            }
            if(possibleEmailElements[element].ariaLabel != null && possibleEmailElements[element].ariaLabel.toLowerCase().match("[/W/S]*"+searchTerm.toLowerCase()+"[/W/S]*")){
                return possibleEmailElements[element];
            }}
            catch (e){
                console.log(e)
            }
        }
    }
    return null;
}

function SearchForInnerText (innerText: string): Node | null {
    var xpath = "//div[contains(text(),'" + innerText + "')]";
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function login(emailElement:HTMLInputElement, passElement:HTMLInputElement){
    console.log("logging in:", emailElement, passElement);
    emailElement.value = fetchNewEmailAddress()
}
Main()