'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// techStack variables
const techStackItem = document.querySelectorAll("[data-techStack-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const techStackModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < techStackItem.length; i++) {

  techStackItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-techStack-avatar]").src;
    modalImg.alt = this.querySelector("[data-techStack-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-techStack-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-techStack-text]").innerHTML;

    techStackModalFunc();

  });

}

// add click event to modal close button
// modalCloseBtn.addEventListener("click", techStackModalFunc);
// overlay.addEventListener("click", techStackModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

// TODO: If Portfolia Enabled
// select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// Function to include HTML content from a file
function includeHTML(element) {
  const file = element.getAttribute('data-include');
  if (file) {
    fetch(file)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load ' + file);
        }
        return response.text();
      })
      .then(content => {
        element.innerHTML = content;
        // Reinitialize filter functionality for portfolio page
        if (element.dataset.page === 'portfolio') {
          setTimeout(() => {
            const newFilterItems = element.querySelectorAll('[data-filter-item]');
            const newFilterBtns = element.querySelectorAll('[data-filter-btn]');
            const newSelect = element.querySelector('[data-select]');
            const newSelectItems = element.querySelectorAll('[data-select-item]');
            const newSelectValue = element.querySelector('[data-selecct-value]');

            // Reinitialize select functionality
            if (newSelect) {
              newSelect.addEventListener('click', function () { elementToggleFunc(this); });
            }

            // Reinitialize select items
            newSelectItems.forEach(item => {
              item.addEventListener('click', function () {
                const selectedValue = this.innerText.toLowerCase();
                if (newSelectValue) newSelectValue.innerText = this.innerText;
                if (newSelect) elementToggleFunc(newSelect);
                filterPortfolio(selectedValue, newFilterItems);
              });
            });

            // Reinitialize filter buttons
            if (newFilterBtns.length > 0) {
              let lastBtn = newFilterBtns[0];
              newFilterBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                  const selectedValue = this.innerText.toLowerCase();
                  if (newSelectValue) newSelectValue.innerText = this.innerText;
                  filterPortfolio(selectedValue, newFilterItems);
                  if (lastBtn) lastBtn.classList.remove('active');
                  this.classList.add('active');
                  lastBtn = this;
                });
              });
            }

            // Show all items initially
            filterPortfolio('all', newFilterItems);
          }, 100);
        }
      })
      .catch(error => {
        console.error('Error loading content:', error);
        element.innerHTML = '<p style="color: var(--light-gray); text-align: center;">Error loading content. Please refresh the page.</p>';
      });
  }
}

// Filter function for portfolio
function filterPortfolio(selectedValue, items) {
  items.forEach(item => {
    if (selectedValue === 'all') {
      item.classList.add('active');
    } else if (selectedValue === item.dataset.category) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[i].classList.add("active");
        includeHTML(pages[j]); // Load content dynamically
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }

  });
}