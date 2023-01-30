const addDocumentButton = document.querySelector("#add__document__btn");
const documentList = document.querySelector("#document__list");

const searchInput = document.querySelector("#search__input");
const searchButton = document.querySelector("#search__button");

const sortForm = document.querySelector("#sort__form");
const sortOptions = Array.from(sortForm.childNodes);

//on app load, load all documents from localStorage
window.onLoad = loadDocuments();

//cannot save empty text editors/documents -> because of the api--> future implementation to possibly override
//localStorage.clear()
/**documents can be deleted functionality deleted from both local storage and dom ul list***/
/*****CLEAR LOCAL STORAGE IF ALL DOCUMENTS ARE DELETED
 *
 * HAVE A POP UP MODAL FOR DELETION TO CHECK WHETHER THEY WANT THAT
 * DOCUMENT DELETED OR NOT
 */

function loadDocuments() {
  //get local storage using ternary operator its either empty or has previous documents
  const previousDocuments = localStorage.length ? true : false;
  if (previousDocuments) {
    Object.entries(localStorage).forEach((currDocument) => {
      //I want only the ones that start with < because html tags start with <
      //the edited/styled text are different html elements like the <i> tag so it begins with an < as because that is the first character of a html tag
      //create list item to house previous documents
      if (currDocument[1][0] === "<") {
        const previousDocumentId = currDocument[0];
        generateDocument(previousDocumentId);
      }
    });
  }
}

function generateDocument(documentId) {
  const localStorageEntries = Object.entries(localStorage);
  let ids = [];
  Object.entries(localStorage).forEach((currDocument) => {
    //push ids
    ids.push(currDocument[0]);
  });
  /*stops creating new document for a previous document being saved again it checks first*/
  /*if an document is already saved in local storage it does not require a new id, the value of the key-value pair in local storage just needs to be updated
   */
  const currDocumentId = ids.filter((currId) => {
    //filter ids
    return currId === documentId;
  });

  //document template
  const documentTemplate = document.createElement("li");
  documentTemplate.setAttribute("class", "document__list__item");
  documentList.appendChild(documentTemplate);
  const textEditor = document.createElement("article");
  textEditor.setAttribute("contenteditable", "true");
  textEditor.classList.add("single__document");

  //textEditor.id comes from api
  documentTemplate.appendChild(textEditor);
  //Initialize text editor for elements with selector class
  tinymce.init({
    selector: ".single__document",
    menubar: false,
    height: "75%",
    plugins: "lists, link, image, media",
    toolbar:
      "h1 h2 bold italic underline strikethrough blockquote bullist numlist forecolor backcolor | link image media | removeformat help undo redo",
    content_css: "/textEditor.css",
    setup: function (editor) {
      editor.on("init", function (e) {
        editor.setContent(localStorage.getItem(documentId));
      });
    }
  });

  /*grab the current document title which is its id plus the text title and grab its value from the local storage object*/
  let currDocumentTitle = ids.filter((currTitle) => {
    return currTitle.includes(documentId) && currTitle.includes("Title");
  });
  currDocumentTitle = localStorage.getItem(currDocumentTitle);
  //append document title and buttons
  documentTemplate.insertAdjacentElement("afterbegin", appendDocumentTitle());
  documentTemplate.append(
    appendDeleteButton(documentId),
    textEditor,
    appendSaveButton(),
    appendFullScreen(),
    appendBookmarkButton(),
    appendDownloadButton(),
    appendClearDocumentButton()
  );

  /*grab the document title element and assign its value to the currDocumentTitle value */
  const documentTitle = documentTemplate.querySelector(".document__title");

  /**if the document has not been saved yet it has no document id */
  if (!documentId) {
    documentTitle.value = "Untitled";
  } else {
    /*if the document has been saved it has a document id */
    documentTitle.value = currDocumentTitle;
  }

  return documentTemplate;
}

function addDocument() {
  generateDocument("");
}

function appendSaveButton() {
  //save button
  const saveButton = document.createElement("input");
  //use submit because text editors content is going to be sent to localStorage
  saveButton.setAttribute("type", "submit");
  saveButton.setAttribute("value", "Save");
  //add class and update save
  saveButton.classList.add("save__btn");
  saveButton.style.border = "2px solid black";

  //click event for save button
  saveButton.addEventListener("click", (saveButton) => {
    saveButton.preventDefault();
    saveDocumentListItem(saveButton.target);
  });
  return saveButton;
}
function appendDownloadButton() {
  //download button
  const downloadButton = document.createElement("button");
  downloadButton.innerHTML = "Download as PDF";
  downloadButton.setAttribute("class", "download__btn");

  //click event for download button
  downloadButton.addEventListener("click", (downloadButton) => {
    generatePDF(downloadButton.target);
  });
  return downloadButton;
}
function appendClearDocumentButton() {
  //clear document button
  const clearButton = document.createElement("button");
  clearButton.innerHTML = "Clear";
  clearButton.setAttribute("class", "clear__btn");

  //click event for clear button
  clearButton.addEventListener("click", (clearButton) => {
    clearDocument();
  });
  return clearButton;
}

//save document title to localStorage too maybe in object and access it through properties
function clearDocument() {
  tinyMCE.activeEditor.setContent("");
}

function generatePDF(downloadButton) {
  const parentElement = downloadButton.parentElement;
  const currDocument = parentElement.querySelector("article");
  //const currDocumentId = currDocument.id.toString();
  const documentContent = tinymce.get(currDocument.id).getContent();
  //pdf generating
  const pdf = new jsPDF("p", "mm", [300, 300]);
  const makePDF = document.querySelector("#pdf__download__container");
  //make makePDF display:none in css file
  makePDF.innerHTML = documentContent;
  //fromHTML Method
  pdf.fromHTML(makePDF);
  //user generated title/
  const documentTitle = downloadButton.parentElement.querySelector(
    ".document__title"
  ).value;
  pdf.save(documentTitle + ".pdf");
}

function appendDocumentTitle() {
  //document title
  const documentTitle = document.createElement("input");
  documentTitle.setAttribute("class", "document__title");

  //on change event for document title
  documentTitle.addEventListener("keyup", (titleValue) => {
    generateDocumentTitle(titleValue);
  });
  return documentTitle;
}

function generateDocumentTitle(documentTitle) {
  return documentTitle.target.value;
}

/*at first updating the document title and or document 
content just updates the document information in dom and
in local storage but after a while resaving creates a 
new document and I cannot figure out why*/

function saveDocumentListItem(saveButton) {
  const parentElement = saveButton.parentElement;
  const currDocument = parentElement.querySelector("article");
  let documentContent = tinymce.get(currDocument.id).getContent();
  const documentTitle = parentElement.querySelector(".document__title");

  //if document is resaved don't create a new document
  //give document title an id related to its parent document
  documentTitle.setAttribute("id", currDocument.id + "Title");

  //save document title to local storage
  localStorage.setItem(documentTitle.id, documentTitle.value);

  //save document content to local storage
  localStorage.setItem(currDocument.id, documentContent);

  //my attempt at saving newly cleared document(attempt not successful)
  //it clears but on page refresh it returns so the clear is not saved to local storage properly
  // my attempted as the previously saved content returns on browser refresh
  /*
  if(!documentContent.length){
    documentContent = tinyMCE.activeEditor.setContent('');  
    localStorage.setItem(currDocument.id, documentContent);
 } 
 */
}

//make other documents and the rest of the page fade behind it like documentlist display is none except that one
function appendFullScreen() {
  const fullScreenButton = document.createElement("button");
  fullScreenButton.setAttribute("class", "full__screen__modal");
  fullScreenButton.innerHTML = "Full Screen";

  //click event for full screen button
  //maximize current document
  fullScreenButton.addEventListener("click", () => {
    const parentElement = fullScreenButton.parentElement;
    if (parentElement.classList.contains("fullscreen") === false) {
      parentElement.classList.add("fullscreen");
      fullScreenButton.innerHTML = "Minimize";

      const textEditor = parentElement.querySelector("div");
      textEditor.style.height = "85%";
    }
  });

  //double click event for full screen button
  //minimize current document
  fullScreenButton.addEventListener("dblclick", () => {
    const parentElement = fullScreenButton.parentElement;
    if (parentElement.classList.contains("fullscreen")) {
      parentElement.classList.remove("fullscreen");
      parentElement.classList.add("minimize");
      fullScreenButton.innerHTML = "FullScreen";
    }
  });
  return fullScreenButton;
}

function appendDeleteButton(documentId) {
  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "&#10005;";
  deleteButton.setAttribute("class", "delete__btn");

  //click event for delete button
  deleteButton.addEventListener("click", (e) => {
    deleteDocument(e.target);
  });
  return deleteButton;
}

//document deletion both in document list and in localStorage
function deleteDocument(deleteButton) {
  const parentElement = deleteButton.parentElement;

  //get document content id
  const deleteLocalStorageDocumentKey = parentElement.querySelector("article")
    .id;
  //remove document content from local storage
  localStorage.removeItem(deleteLocalStorageDocumentKey);

  //get document title id
  const deleteLocalStorageTitleKey = deleteLocalStorageDocumentKey + "Title";
  //remove document title from local storage
  localStorage.removeItem(deleteLocalStorageTitleKey);

  //remove element from document list in DOM
  parentElement.remove();
}

function sortDocuments(sortOption) {
  const documents = Array.from(documentList.children);
  const localStorageEntries = Object.entries(localStorage);

  //conditional for sorting document based on value of sortOption
  if (sortOption === "name") {
    let documentTitles;
    //loop through local storage to grab only documents
    documentTitles = localStorageEntries.filter((currDocument) => {
      return currDocument[0].includes("Title");
    });
    /*assign documents its self(array) sorted by document titles
   which  has an index of 1
   */
    documentTitles = documentTitles.sort((a, b) => {
      return a[1] > b[1];
    });

    //remove original document list to there are no repeats
    for (let i = 0; i < documents.length; i++) {
      documents[i].remove();
    }

    /*get matching document ids to document title
  and than generate its document 
 */
    /****REMOVE REPEATS IN THE IF STATEMENTS MAYBE REMOVE DOCUMENT IN THE BEGINNING OF THE FUNCTION NOT IN EACH IF STATEMENT ****/
    documentTitles.map((currId) => {
      currId = currId[0];
      //remove the word Title and replace with an empty string
      currId = currId.replace("Title", "");
      generateDocument(currId);
    });
  } else if (sortOption === "storage used") {
    let documentContents;
    //only return entries that value is an html element
    documentContents = localStorageEntries.filter((a) => {
      return a[1].includes("<");
    });
    //index of 1 is the documents content
    documentContents = documentContents.sort((a, b) => {
      return a[1].length > b[1].length;
    });
    //remove original document list to there are no repeats
    for (let i = 0; i < documents.length; i++) {
      documents[i].remove();
    }
    //index 0 is the documents id
    documentContents.map((currContent) => {
      const documentId = currContent[0];
      generateDocument(documentId);
    });
  } else {
    //last modified is the last document in local storage
    let lastModified;
    //only return entries that value is an html element
    lastModified = localStorageEntries.filter((a) => {
      return a[1].includes("<");
    });
    //remove original document list so there are no repeats
    for (let i = 0; i < documents.length; i++) {
      documents[i].remove();
    }
    //index 0 is the documents id
    lastModified = lastModified.map((currDocument) => {
      const documentId = currDocument[0];
      generateDocument(documentId);
    });
  }
}

function appendBookmarkButton() {
  const bookmarkButton = document.createElement("button");
  bookmarkButton.setAttribute("class", "bookmark");
  bookmarkButton.innerHTML = "Bookmark";

  bookmarkButton.addEventListener("click", (bookmarkButton) => {
    const documentTitle = bookmarkButton.target.parentElement.querySelector(
      ".document__title"
    );
    bookmarkDocument(bookmarkButton.target, documentTitle);
  });
  return bookmarkButton;
}

//add click event to add document button
addDocumentButton.addEventListener("click", () => {
  addDocument();
});

/***search functionality for click event */
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  let searchTerm = searchInput.value;

  Object.entries(localStorage).map((currDocument) => {
    const currId = currDocument[0];
    const currContent = currDocument[1];

    if (currContent.includes("<")) {
      if (currContent.includes(searchTerm)) {
        Array.from(documentList.childNodes).map((currDoc) => {
          currDoc.remove();
        });
        generateDocument(currId);
      }
    }
  });
});
/*search functionality for double click event**/
searchButton.addEventListener("dblclick", (e) => {
  e.preventDefault();
  let searchTerm = searchInput.value;
  searchInput.value = "";
  searchTerm = searchInput.value;
  if (!searchTerm) {
    Array.from(documentList.childNodes).map((currDoc) => {
      currDoc.remove();
    });
    loadDocuments();
  }
});

//sort click event
sortOptions.map((currOption) => {
  currOption.addEventListener("click", (e) => {
    e.preventDefault();
    const currSortOption = e.target.value;
    sortDocuments(currSortOption);
  });
});
