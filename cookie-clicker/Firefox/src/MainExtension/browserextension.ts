function Main(){
    console.log(SearchForEmailInput())
    console.log(SearchForPasswordInput())
    if(SearchForLoginField()){
        login()
    }else{
        listenForClicks()
    }
}
function listenForClicks() {
    let ElementPath : Element[] = []
    let emailElement : HTMLInputElement | null = null
    let passwordElement :HTMLInputElement | null = null
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
            login()
        }
    }
}
function CreateEmail() {
    let options = {
        method: 'GET',
        headers: {}
    };

    fetch('/get-data', options)
        .then(response => response.json())
        .then(body => {
            // Do something with body
        });
}
function SearchForLoginField(){
    console.log(SearchForEmailInput());
    console.log(SearchForPasswordInput());
    return !(SearchForEmailInput() == null || SearchForPasswordInput == null);
}
function SearchForEmailInput() : HTMLInputElement{
    return document.querySelector('[placeholder^=Email]') as HTMLInputElement;
}
function SearchForPasswordInput() : HTMLInputElement{
    return document.querySelector('[placeholder^=Pass]') as HTMLInputElement;
}
function SearchForInnerText (innerText: string): Node | null {
    var xpath = "//div[contains(text(),'" + innerText + "')]";
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function login(){
    console.log("logging in:")
    let emailElement = SearchForEmailInput();
    let passElement = SearchForPasswordInput();
    emailElement.value = "henlo"
    passElement.value= "there"
}
Main()