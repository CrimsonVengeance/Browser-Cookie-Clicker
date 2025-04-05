import MailSlurp, {Email, InboxDto} from "mailslurp-client";
let emailAddress : string | null = null;
let password : string = "monsterenergy123!"
let email : Email | null;
function Main(){
    browser.runtime.onMessage.addListener(handleResponse)
listenForClicks()

}

async function listenForClicks() {
    let ElementPath : Element[] = []
    let email = SearchForInputField("email");
    if(email != null && SearchForInputField("pass") == null){
        let temp = await getEmail()
        if(temp != null) {
            email.value = temp;
        }
    }
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
        if(SearchForSignUpSheet()){
            document.removeEventListener("click", watchClickPath);
        }
    }
}
async function getEmail() : Promise<string | null>{
    if(emailAddress != null) return emailAddress;
    let temp = await forwardRequest("createnewemail");
    if(temp["emailAddress"] != null){
        emailAddress = temp["emailAddress"] as string;
        return emailAddress;
    }
    return null;
}

async function getNotificationEmail() : Promise<Email | null>{
    let temp = await forwardRequest("recievenextemail");
    if(temp["email"] != null){
        emailAddress = temp["emailAddress"] as string;
        return email;
    }
    return null;
}
function SearchForSignUpSheet() : boolean{
    console.log("Searching for Sign-up sheet:")
    let confirm = SearchForButton("sign")
    console.log(confirm);
    if(confirm != null){
        signUp()
        return true;
    }else{
        return false;
    }
}
function SearchForLoginField(){
    console.log("Searching for login page:")
    let email = SearchForInputField("email");
    let pass = SearchForInputField("pass");
    let confirm = SearchForButton("log");
    console.log(email, pass, confirm);
    if (email != null && pass != null && confirm != null){
        login(email, pass, confirm);
        return true;
    }else{
        return false;
    }
}
function SearchForButton(searchTerm: string) : HTMLButtonElement | null{
    let possibleButtonElements = document.getElementsByTagName("button");
    for (let i in possibleButtonElements){
        if(possibleButtonElements[i] instanceof HTMLButtonElement) {
            if (possibleButtonElements[i].id != null && possibleButtonElements[i].id.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                return possibleButtonElements[i]
            }
            if (possibleButtonElements[i].title != null && possibleButtonElements[i].title.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                return possibleButtonElements[i]
            }
            if (possibleButtonElements[i].ariaLabel != null && possibleButtonElements[i].ariaLabel.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                return possibleButtonElements[i]
            }
            if (possibleButtonElements[i].name != null && possibleButtonElements[i].name.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                return possibleButtonElements[i]
            }
            if (possibleButtonElements[i].innerText != null && possibleButtonElements[i].innerText.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                return possibleButtonElements[i]
            }
        }
    }
    return null;
}
function SearchForSelectorField(searchTerm: string) : HTMLSelectElement | null{
    let possibleSelectorElements = document.getElementsByTagName("select");
    for (let i in possibleSelectorElements){
        if(possibleSelectorElements[i].id != null && possibleSelectorElements[i].id.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")){
            return possibleSelectorElements[i]
        }
        if(possibleSelectorElements[i].title != null && possibleSelectorElements[i].title.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")){
            return possibleSelectorElements[i]
        }
        if(possibleSelectorElements[i].ariaLabel != null && possibleSelectorElements[i].ariaLabel.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")){
            return possibleSelectorElements[i]
        }
        if(possibleSelectorElements[i].name != null && possibleSelectorElements[i].name.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")){
            return possibleSelectorElements[i]
        }

    }
    return null;
}
function SearchForInputField(searchTerm: string) : HTMLInputElement| null {
    let possibleEmailElements = document.getElementsByTagName("input");
    for(let element in possibleEmailElements){
        if(possibleEmailElements[element] instanceof HTMLInputElement){
            try {
                if (possibleEmailElements[element].placeholder.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                    return possibleEmailElements[element];
                }
                if (possibleEmailElements[element].ariaLabel != null && possibleEmailElements[element].ariaLabel.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                    return possibleEmailElements[element];
                }
                if (possibleEmailElements[element].previousSibling != null && possibleEmailElements[element].previousSibling.textContent != null && possibleEmailElements[element].previousSibling.textContent.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                    return possibleEmailElements[element];
                }
                if (possibleEmailElements[element].id != null && possibleEmailElements[element].id.toLowerCase().match("[/W/S]*" + searchTerm.toLowerCase() + "[/W/S]*")) {
                    return possibleEmailElements[element];
                }
            }
            catch (e){
                console.log(e)
            }
        }
    }
    return null;
}
function forwardRequest(message:string) {
    return new Promise<Record<string, any>>((resolve, reject)=> {
        browser.runtime.sendMessage(message, (response: Record<string, any>) => {
            if (!response) return reject(browser.runtime.lastError)
            return resolve(response)
        })
    })
}


function handleResponse(message : Record<string, unknown>){
    if (message["emailAddress"] != null){
        console.log("EMAIL");
        emailAddress = message["emailAddress"] as string;
    }else if(message["email"]){
        console.log("THE BEACONS OF GONDOR ARE LIT");
        email = message["email"] as Email;
    }
    console.log(message)
}
function SearchForInnerText (innerText: string): Node | null {
    var xpath = "//div[contains(text(),'" + innerText + "')]";
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
async function login(emailElement: HTMLInputElement, passElement: HTMLInputElement, confirmElement : HTMLButtonElement) {
    console.log("attempting to log in:", emailElement, passElement, emailAddress);
    let temp = await getEmail()
    if(temp != null) {
        emailElement.value = temp;
    }
    if(emailAddress == null) return;
    console.log("entering:",emailAddress, password);
    emailElement.value = emailAddress;
    passElement.value = password;
    confirmElement.click()

}

async function signUp(){
    console.log("Attempting to sign up:")
    let temp = await forwardRequest("createnewinbox");
    if(temp["emailAddress"] != null){
        emailAddress = temp["emailAddress"];
    }
    if(emailAddress == null){
        console.log("email was null.");
        return;
    }
    console.log("okay, on to the signup")
    let emailElement = SearchForInputField("email");
    if(emailElement != null){
        emailElement.value = emailAddress;
    }
    let usernameElement = SearchForInputField("username");
    if(usernameElement != null && emailElement == null){
        usernameElement.value = "Tchallakojumbo"
    }
    let passElement = SearchForInputField("pass");
    if(passElement != null){
        passElement.value = "";
        passElement.value = "";
        for(const passwordItem of password.toString()) {
            setTimeout(() =>{
                passElement.dispatchEvent(new KeyboardEvent('keydown', {key: '1'}));
                passElement.value += passwordItem}, 1);

        }
        passElement.checkValidity()
        passElement.reportValidity()
        if(passElement.form != null){
            passElement.form.checkValidity()
            passElement.form.reportValidity()
            }
        var keydownEvent = new KeyboardEvent("space")
        passElement.dispatchEvent(keydownEvent)
        var pasteEvent = new ClipboardEvent('paste')
        passElement.dispatchEvent(pasteEvent)
    }
    let firstNameElement = SearchForInputField("first");
    if(firstNameElement != null){
        firstNameElement.value = "Anakin";
    }
    let lastNameElement = SearchForInputField("last");
    if(lastNameElement != null){
        lastNameElement.value = "Starwalker"
    }
    let month = SearchForSelectorField("Month")
    if(month != null){

    }
    let day = SearchForSelectorField("Day")
    if (day != null){

    }
    let birthday_year = SearchForSelectorField("Year")
    if(birthday_year != null){
        birthday_year.value = (parseInt(birthday_year.value) - 21).toString();
    }
    let sex = SearchForInputField("male")

    if(sex != null){
        console.log("sex field seen, selecting sex:", sex.value)
        sex.click()
    }
    let confirm = SearchForButton("sign");
    if(confirm != null && password == null){
        confirm.click()
        signUp()
        return;
    }else if(confirm != null){
        confirm.click();
    }
    console.log("waiting for confirmation email.")
    let email = await getNotificationEmail()
    if(temp["email"] != null){
        console.log("email received!")
        email = temp["email"] as Email;
    }
    console.log(email)
}
Main()