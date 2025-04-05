/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */

function listenForClicks() {
    var ElementsClickedList : Element[] = []
    console.log("listening for clicks:");
    document.addEventListener("click", (clickEvent) => {
        console.log("Finding element link for:", clickEvent)
        var element = clickEvent.target as Element;
        if(element.nodeName.toLowerCase() == "input"){
            console.log("input field detected.")

        }
        if(ElementsClickedList.some(e => element.isEqualNode(e))) {
            console.log("element already in click history.")
            return;
        }
        ElementsClickedList.push(element)
        console.log(ElementsClickedList)
    });

}


function checkInputType(inputElement : Element){

}