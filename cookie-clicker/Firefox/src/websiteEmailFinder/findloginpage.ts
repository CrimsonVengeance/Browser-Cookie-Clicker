/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */

export function listenForClicks() {
    var ElementsClickedList : Element[] = []
    console.log("listening for clicks:");
    document.addEventListener("click", (clickEvent) => {
        console.log("Finding element link for:", clickEvent)
        var element = clickEvent.target as Element;
        if(element.nodeName.toLowerCase() == "input"){
            console.log("input field detected.")
        }
        ElementsClickedList.push(element)
        console.log(ElementsClickedList)

    });

}