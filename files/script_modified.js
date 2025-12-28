// Wait for the HTML document to be fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

  console.log("Main script.js initialized.");

  // === Mobile Navigation Toggle (From Original Template) ===
  const navbar = document.querySelector("[data-navbar]");
  const navTogglers = document.querySelectorAll("[data-nav-toggler]");
  const overlay = document.querySelector("[data-overlay]");

  const toggleNavbar = function () {
      navbar?.classList.toggle("active");
      overlay?.classList.toggle("active");
      document.body.classList.toggle("nav-active"); // Optional: Prevent body scroll when nav is open
  }

  // Add click event to all nav togglers (open/close buttons)
  if (navTogglers.length) {
      navTogglers.forEach(toggler => {
          toggler?.addEventListener("click", toggleNavbar);
      });
  } else {
      console.log("Mobile navigation togglers not found.");
  }
   // Also close navbar when overlay is clicked
   if(overlay) {
       overlay.addEventListener("click", toggleNavbar);
   }


  // === Header Sticky (From Original Template) ===
  const header = document.querySelector("[data-header]");
  const headerActive = function () {
       // Add 'active' class to header when scrolled more than 100px
       if (header) { // Check if header exists
          header.classList.toggle("active", window.scrollY > 100);
       }
  }
  // Add scroll listener only if header exists
  if (header) {
      window.addEventListener("scroll", headerActive);
      headerActive(); // Check on initial load
  } else {
      console.log("Header element [data-header] not found.");
  }


  // === Back to Top Button (From Original Template) ===
  const backTopBtn = document.querySelector("[data-back-top-btn]");
  const backTopBtnActive = function () {
      // Show back-to-top button when scrolled more than 500px
      if (backTopBtn) {
         backTopBtn.classList.toggle("active", window.scrollY > 500);
      }
  }
   // Add scroll listener only if button exists
   if (backTopBtn) {
      window.addEventListener("scroll", backTopBtnActive);
      backTopBtnActive(); // Check on initial load
   } else {
       console.log("Back to top button [data-back-top-btn] not found.");
   }


  // === Quantity Selector Logic ===
  const quantityInput = document.getElementById('quantity-input');
  const minusBtn = document.querySelector('.quantity-adjust-btn.minus');
  const plusBtn = document.querySelector('.quantity-adjust-btn.plus');

  if (quantityInput && minusBtn && plusBtn) {
      console.log("Quantity selector elements found.");
      minusBtn.addEventListener('click', () => {
          let currentValue = parseInt(quantityInput.value, 10);
          if (isNaN(currentValue)) currentValue = 1; // Handle empty input
          if (currentValue > 1) { // Prevent going below 1
              quantityInput.value = currentValue - 1;
          }
      });
      plusBtn.addEventListener('click', () => {
          let currentValue = parseInt(quantityInput.value, 10);
          if (isNaN(currentValue)) currentValue = 0; // Handle empty input
          quantityInput.value = currentValue + 1;
      });
      // Ensure input value is at least 1 if changed manually
      quantityInput.addEventListener('change', () => {
           let currentValue = parseInt(quantityInput.value, 10);
           if (isNaN(currentValue) || currentValue < 1) {
               quantityInput.value = 1;
           }
      });
  } else {
       console.log("Quantity selector elements NOT found.");
  }


  // === Desktop Thumbnail Click Logic ===
  // Function to update main image based on thumbnail click (for desktop view)
  const mainImageElementDesktop = document.getElementById('main-product-img');
  const thumbnailItemsDesktop = document.querySelectorAll('.thumbnail-item');

  // Define the function globally ONLY if using onclick="" in HTML.
  // If not using onclick="", define it locally and add listeners below.
  window.updateMainImage = function(clickedThumbnail) {
      // Check if the desktop main image container is currently visible
      // Use offsetParent check: non-null means element is rendered and not display:none
      const mainImageContainerDesktop = document.querySelector('.main-image-container');
      if (!mainImageContainerDesktop || mainImageContainerDesktop.offsetParent === null) {
          console.log("Desktop thumbnail logic skipped (likely mobile view / elements hidden).");
          return; // Exit if desktop view is hidden
      }

      if (mainImageElementDesktop && clickedThumbnail) {
           console.log("Desktop thumbnail clicked.");

           // --- Get the source for the large image ---
           // Option 1 (Recommended): Use data-attribute on thumbnail
           // In HTML: <img ... class="thumbnail-item" src="thumb.jpg" data-main-src="large.jpg">
           const newImageSrc = clickedThumbnail.dataset.mainSrc || clickedThumbnail.src;
           // Option 2: Naming convention (Adjust replace logic as needed)
           // const newImageSrc = clickedThumbnail.src.replace('-thumb', '-large').replace('100x100', '800x800');

           if (newImageSrc) {
               mainImageElementDesktop.src = newImageSrc;
               mainImageElementDesktop.alt = clickedThumbnail.alt.replace('Thumbnail', 'Primary Image');

               // Update active state on thumbnails
               thumbnailItemsDesktop.forEach(thumb => {
                   thumb.classList.remove('active');
               });
               clickedThumbnail.classList.add('active');
           } else {
                console.warn("Could not determine main image source for thumbnail:", clickedThumbnail);
           }
      }
  }
   // Set initial active thumbnail for desktop view IF desktop view is initially visible
   // We might delay this slightly or check visibility more robustly if needed
   setTimeout(() => {
       const mainImageContainerDesktop = document.querySelector('.main-image-container');
       if (thumbnailItemsDesktop.length > 0 && mainImageContainerDesktop && mainImageContainerDesktop.offsetParent !== null) {
           thumbnailItemsDesktop[0]?.classList.add('active');
       }
   }, 100); // Small delay to help ensure CSS is applied


  // === Mobile Image Slider Logic ===
  // Function to set up and control the mobile image slider
  function initializeMobileSlider() {
      console.log("Attempting to initialize Mobile Slider...");
      const sliderContainer = document.querySelector('.mobile-image-slider');

      // Check if the mobile slider container exists AND is visible (CSS should handle visibility)
      if (!sliderContainer || sliderContainer.offsetParent === null) {
           console.log("Mobile slider container not found or not visible. Slider disabled.");
           return; // Don't initialize if not visible
       }

      const sliderWrapper = sliderContainer.querySelector('.slider-wrapper');
      const sliderImages = sliderWrapper ? sliderWrapper.querySelectorAll('.slider-image') : [];
      const dotsContainer = sliderContainer.querySelector('.slider-dots');

      if (!sliderWrapper || sliderImages.length <= 1) {
          // Don't initialize if wrapper not found or only 1 image
          if(sliderContainer && sliderImages.length <= 1) {
               console.log("Only 1 slider image found, slider disabled.");
               if(dotsContainer) dotsContainer.style.display = 'none'; // Hide dots if only one image
          } else {
              console.log("Mobile slider wrapper not found. Slider disabled.");
          }
          return;
      }

      // --- Slider State Variables ---
      let currentIndex = 0;
      let touchStartX = 0;
      let touchEndX = 0;
      let isDragging = false;
      let slideWidth = sliderContainer.offsetWidth; // Initial width

      console.log(`Mobile Slider Initialized: ${sliderImages.length} images. Width: ${slideWidth}px`);

      // --- Create Dots ---
      if (dotsContainer) {
          dotsContainer.innerHTML = ''; // Clear existing dots
          dotsContainer.style.display = 'flex'; // Ensure dots container is visible
          for (let i = 0; i < sliderImages.length; i++) {
              const dot = document.createElement('button');
              dot.classList.add('slider-dot');
              dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
              dot.addEventListener('click', () => {
                  goToSlide(i);
              });
              dotsContainer.appendChild(dot);
          }
      }

      // --- Go To Slide Function ---
      function goToSlide(index) {
          slideWidth = sliderContainer.offsetWidth; // Recalculate width

          // Boundary checks (stop at ends)
          if (index < 0) index = 0;
          else if (index >= sliderImages.length) index = sliderImages.length - 1;

          currentIndex = index;
          const offset = -currentIndex * slideWidth;
          sliderWrapper.style.transform = `translateX(${offset}px)`;
          console.log(`Slider moving to slide ${currentIndex}, offset: ${offset}px`);
          updateDots();
      }

      // --- Update Active Dot ---
      function updateDots() {
          if (!dotsContainer) return;
          const dots = dotsContainer.querySelectorAll('.slider-dot');
          dots.forEach((dot, index) => {
              dot.classList.toggle('active', index === currentIndex);
          });
      }

      // --- Touch Event Listeners ---
      let touchMoveX = 0; // Track movement distance
      sliderContainer.addEventListener('touchstart', (e) => {
          if (e.touches.length > 1) return;
          touchStartX = e.touches[0].clientX;
          touchMoveX = touchStartX; // Initialize move position
          isDragging = true;
          sliderWrapper.style.transition = 'none'; // Disable animation during drag
      }, { passive: true });

      sliderContainer.addEventListener('touchmove', (e) => {
          if (!isDragging || e.touches.length > 1) return;
          touchMoveX = e.touches[0].clientX;
          const currentTranslate = -currentIndex * slideWidth;
          const diff = touchMoveX - touchStartX;
          // Apply drag visually
          sliderWrapper.style.transform = `translateX(${currentTranslate + diff}px)`;
      }, { passive: true });

      sliderContainer.addEventListener('touchend', (e) => {
           if (!isDragging) return;
           isDragging = false;
           sliderWrapper.style.transition = 'transform 0.3s ease-in-out'; // Re-enable animation

           const diff = touchMoveX - touchStartX; // Use last move position
           const threshold = Math.max(50, slideWidth / 5); // Swipe threshold (at least 50px or 1/5th width)

           console.log(`Slider Touchend. Diff: ${diff.toFixed(0)}, Threshold: ${threshold.toFixed(0)}`);

           // Determine swipe direction based on threshold
           if (Math.abs(diff) > threshold) {
               if (diff > 0) { // Swipe Right (Go to Previous)
                  goToSlide(currentIndex - 1);
               } else { // Swipe Left (Go to Next)
                  goToSlide(currentIndex + 1);
               }
           } else {
               // Not enough swipe, snap back to current slide
               goToSlide(currentIndex);
           }
           // Reset touch tracking variables
           touchStartX = 0;
           touchMoveX = 0;
       });

       // --- Initial Setup ---
       goToSlide(0); // Go to the first slide
       updateDots(); // Update dots

       // --- Recalculate width and position on resize ---
       let resizeTimer;
       window.addEventListener('resize', () => {
           // Check if slider is still visible after resize
           if (sliderContainer.offsetParent !== null) {
               clearTimeout(resizeTimer);
               resizeTimer = setTimeout(() => {
                   console.log("Window resized, recalculating slider width.");
                   slideWidth = sliderContainer.offsetWidth;
                   // Disable transition during resize adjustment
                   sliderWrapper.style.transition = 'none';
                   goToSlide(currentIndex); // Adjust position based on new width
                   // Re-enable transition after a short delay
                   setTimeout(() => {
                       sliderWrapper.style.transition = 'transform 0.3s ease-in-out';
                   }, 50);
               }, 250); // Debounce resize event
           }
       });

  } // End of initializeMobileSlider

  // === Run Initializations ===
  initializeMobileSlider(); // Try to initialize the slider


  // ===================================================
  // === PROJECT FILTER INTERACTION ===
  // Desktop: Hover to preview, Click to navigate
  // Mobile: First tap previews, Second tap navigates
  // ===================================================
  
  const projectSection = document.querySelector('section.project#project');
  if (projectSection) {
    const filterLinks = projectSection.querySelectorAll('[data-project-filters] .filter-btn[data-category]');
    const items = projectSection.querySelectorAll('[data-project-grid] > li[data-category]');
    
    if (filterLinks.length && items.length) {
      console.log("Project filter system initialized.");
      
      // Detect if device is touch-based (coarse pointer = mobile/tablet)
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      
      // Get initially active category
      let activeCat = 'website'; // default
      const activeLink = projectSection.querySelector('[data-project-filters] .filter-btn.active');
      if (activeLink) {
        activeCat = activeLink.dataset.category;
      }
      
      // Function to set active category and show/hide items
      function setActive(cat) {
        activeCat = cat;
        
        // Update active class on filter buttons
        filterLinks.forEach(a => {
          a.classList.toggle('active', a.dataset.category === cat);
        });
        
        // Show/hide project items
        items.forEach(li => {
          li.style.display = (li.dataset.category === cat) ? '' : 'none';
        });
        
        console.log(`Project filter switched to: ${cat}`);
      }
      
      // Initialize: only show active category
      setActive(activeCat);
      
      // Add event listeners to each filter link
      filterLinks.forEach(a => {
        
        // DESKTOP: Hover/Focus to preview (without navigating)
        if (!isCoarsePointer) {
          a.addEventListener('mouseenter', () => {
            setActive(a.dataset.category);
          });
          
          a.addEventListener('focus', () => {
            setActive(a.dataset.category);
          });
        }
        
        // CLICK/TAP handler
        a.addEventListener('click', (e) => {
          const cat = a.dataset.category;
          
          if (isCoarsePointer) {
            // MOBILE: First tap = preview, Second tap = navigate
            if (activeCat !== cat) {
              e.preventDefault(); // Prevent navigation on first tap
              setActive(cat);      // Switch preview
            }
            // If activeCat === cat, allow default navigation
          }
          // DESKTOP: Always allow navigation (don't preventDefault)
        }, { passive: false });
        
      });
      
    } else {
      console.log("Project filter elements not found.");
    }
  }


}); // End of DOMContentLoaded listener

