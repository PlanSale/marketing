'use strict';



/**
 * add Event on elements
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header & back top btn show when scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 80) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);

document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      // 移除所有按钮的 active 状态
      filterButtons.forEach(btn => btn.classList.remove('active'));

      // 为点击的按钮添加 active 状态
      this.classList.add('active');
    });
  });
});


 // 新产品页面javascript如下
 
document.addEventListener('DOMContentLoaded', () => {

  console.log("Clean Product Page Script Loaded.");

  // --- New Thumbnail Image Changer ---
  const mainImageElement = document.getElementById('main-product-img');
  const thumbnailItems = document.querySelectorAll('.thumbnail-item');

  if (mainImageElement && thumbnailItems.length > 0) {
      console.log("New main image and thumbnails found.");

      // Function to update the main image src and active thumbnail class
      window.updateMainImage = function(clickedThumbnail) {
          const newImageSrc = clickedThumbnail.src.replace('-100x100', '-600x600'); // Assuming main image name relates to thumbnail name - ADJUST IF NEEDED
          console.log("Changing main image to:", newImageSrc);

          mainImageElement.src = newImageSrc; // Set main image source
          mainImageElement.alt = clickedThumbnail.alt.replace('Thumbnail', 'Primary Image'); // Update alt text

          // Update active class on thumbnails
          thumbnailItems.forEach(thumb => {
              thumb.classList.remove('active');
          });
          clickedThumbnail.classList.add('active');
      }

      // Optional: Set first thumbnail as active on load
      // thumbnailItems[0].classList.add('active'); // Already done in HTML

  } else {
      console.log("New main image or thumbnails NOT found.");
  }


  // --- New Quantity Selector Logic ---
  const quantityInputElement = document.getElementById('quantity-input');
  const minusButton = document.querySelector('.quantity-adjust-btn.minus');
  const plusButton = document.querySelector('.quantity-adjust-btn.plus');

  if (quantityInputElement && minusButton && plusButton) {
      console.log("New quantity elements found.");

      minusButton.addEventListener('click', () => {
          let currentValue = parseInt(quantityInputElement.value, 10);
          if (currentValue > 1) {
              quantityInputElement.value = currentValue - 1;
          }
           console.log("Quantity:", quantityInputElement.value);
      });

      plusButton.addEventListener('click', () => {
          let currentValue = parseInt(quantityInputElement.value, 10);
          quantityInputElement.value = currentValue + 1; // No upper limit defined here
          console.log("Quantity:", quantityInputElement.value);
      });

      quantityInputElement.addEventListener('change', () => {
           let currentValue = parseInt(quantityInputElement.value, 10);
           if (isNaN(currentValue) || currentValue < 1) {
               quantityInputElement.value = 1; // Reset to 1 if invalid
           }
      });
  } else {
      console.log("New quantity elements NOT found.");
  }

}); // End of DOMContentLoaded