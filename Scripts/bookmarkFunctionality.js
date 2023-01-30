const bookmarkList = document.querySelector("#bookmark__list");

const bookmarkHeader = document.querySelector("#bookmark__header");

//on window load
window.onload = bookmarkListOnLoad();

/*render no bookmarked documents yet when bookmark list has no children
onload bookmarkList will have no children because documents are only bookmarked per 
session
*/
function bookmarkListOnLoad() {
  const onLoadBookmarkText = document.createElement("p");
  onLoadBookmarkText.setAttribute("id", "onLoadBookmarkText");
  onLoadBookmarkText.innerHTML = "No Bookmarked Documents Yet";

  //add after bookmark header
  bookmarkHeader.insertAdjacentElement("afterend", onLoadBookmarkText);
}

/**Bookmarking document is unlimited you can bookmark a document as much as you want */
function bookmarkDocument(bookmarkButton, bookmarkDocumentTitle) {
  const parentElement = bookmarkButton.parentElement;
  const currDocumentTitle = parentElement.querySelector(".document__title")
    .value;
  const bookmarkListItem = document.createElement("li");
  bookmarkListItem.setAttribute("class", "bookmark__item");
  bookmarkListItem.innerHTML = currDocumentTitle;
  //append buttons
  bookmarkListItem.append(
    appendGoToDocumentButton(
      bookmarkButton,
      parentElement.querySelector(".document__title")
    ),
    appendDeleteButton(parentElement)
  );
  //append bookmark list item
  bookmarkList.insertAdjacentElement("beforeend", bookmarkListItem);

  //remove the text no bookmark document text
  const noBookmarkText = document.querySelector("#onLoadBookmarkText");
  noBookmarkText.innerHTML = "";
}

function goToDocument(currButtonDocumentTitle) {
  /*focus on its document title just in case a user wants to modify that document*/
  currButtonDocumentTitle.focus();
}
function appendGoToDocumentButton(currGoToDocument, currGoToDocumentTitle) {
  const goToDocumentButton = document.createElement("button");
  goToDocumentButton.setAttribute("class", "go__to__document");
  goToDocumentButton.innerHTML = "&#43;";

  //click event for go to document button
  goToDocumentButton.addEventListener("click", (currButton) => {
    goToDocument(currGoToDocumentTitle);
  });
  return goToDocumentButton;
}

function appendDeleteButton() {
  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "bookmark__delete__btn");
  deleteButton.innerHTML = "&#10005;";

  //click event for delete bookmark list item
  deleteButton.addEventListener("click", (currListItem) => {
    deleteBookmarkItem(currListItem.target);
  });
  return deleteButton;
}

function deleteBookmarkItem(currBookmarkItem) {
  const parentElement = currBookmarkItem.parentElement;
  parentElement.remove();
  
  /*if the last bookmarked document is being deleted
   render the no bookmarked document text*/
  if (!bookmarkList.children.length) {
    const noBookmarkText = document.querySelector("#onLoadBookmarkText");
    noBookmarkText.innerHTML = "No Bookmarked Documents Yet";
  }
}
