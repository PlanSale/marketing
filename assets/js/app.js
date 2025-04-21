// Make sure the DOM is loaded before trying to render buttons
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPayPalButtons);
} else {
  setupPayPalButtons();
}

function setupPayPalButtons() {
  // Check if the PayPal SDK and Buttons component are loaded
  if (typeof paypal === 'undefined' || typeof paypal.Buttons === 'undefined') {
      console.error('PayPal SDK or Buttons not loaded.');
      const resultMsgElement = document.getElementById('result-message');
      if (resultMsgElement) {
          resultMsgElement.textContent = 'Error loading PayPal buttons. Please refresh.';
          resultMsgElement.style.color = 'red';
      }
      return;
  }

  paypal.Buttons({
      // Sets up the transaction details when the user clicks the button
      createOrder: function (data, actions) {
          console.log('Creating order...');
          const resultMsgElement = document.getElementById('result-message');
          const quantityElement = document.getElementById('quantity-input');
          const cardFinishElement = document.getElementById('card-finish-select');

          let quantity = 1;
          if (quantityElement) {
              quantity = parseInt(quantityElement.value, 10);
              if (isNaN(quantity) || quantity < 1) quantity = 1;
          }

          let selectedFinish = 'Standard White'; // Default
          if (cardFinishElement) {
               selectedFinish = cardFinishElement.options[cardFinishElement.selectedIndex].text;
          }

          // --- Define Price (IMPORTANT!) ---
          // ** Replace with your actual price logic **
          const unitPrice = 25.00; // Your price per card in CAD
          const totalAmount = (unitPrice * quantity).toFixed(2); // Calculate total

          console.log(`Qty: ${quantity}, Finish: ${selectedFinish}, Total: ${totalAmount} CAD`);

          // Clear previous messages
          if (resultMsgElement) resultMsgElement.textContent = '';

          // Create the order details for PayPal
          return actions.order.create({
              purchase_units: [{
                  description: `NFC Business Card - ${selectedFinish} (Qty: ${quantity})`,
                  amount: {
                      currency_code: 'CAD', // Must match SDK currency
                      value: totalAmount
                  }
              }]
          })
          .then((orderID) => {
              console.log('Order ID created:', orderID);
              return orderID;
          })
          .catch((err) => {
              console.error('Error creating order:', err);
              if (resultMsgElement) {
                  resultMsgElement.textContent = 'Error creating order. Please try again.';
                  resultMsgElement.style.color = 'red';
              }
              throw err;
          });
      },

      // Captures the funds from the transaction after user approval
      onApprove: function (data, actions) {
          console.log('Order approved. Capturing transaction...');
          const resultMsgElement = document.getElementById('result-message');

          return actions.order.capture().then(function (details) {
              console.log('Transaction completed:', details);

              // Display success message on the page
              if (resultMsgElement) {
                  resultMsgElement.textContent = 'Thank you ' + details.payer.name.given_name + '! Payment successful.';
                  resultMsgElement.style.color = 'green';
              }

              // === STATIC SITE ACTION ===
              // Since you are on GitHub pages (static), you CANNOT securely verify
              // the payment automatically. You MUST manually check your PayPal account
              // (email or dashboard) to confirm payment before fulfilling the order.
              // You could optionally redirect to a generic thank you page:
              // window.location.href = 'thank-you.html'; // Create this page if you want
              // DO NOT fulfill based only on this client-side message.
              // =========================

          }).catch((err) => {
              console.error('Error capturing transaction:', err);
              if (resultMsgElement) {
                  resultMsgElement.textContent = 'Payment failed. Please try again.';
                  resultMsgElement.style.color = 'red';
              }
          });
      },

      // Handles errors during button interaction
      onError: function (err) {
          console.error('PayPal Buttons Error:', err);
          const resultMsgElement = document.getElementById('result-message');
          if (resultMsgElement) {
              resultMsgElement.textContent = 'An error occurred with PayPal. Please try again.';
              resultMsgElement.style.color = 'red';
          }
      },

      // Handles user cancelling the payment
      onCancel: function (data) {
          console.log('Payment cancelled by user. Order ID:', data.orderID);
          const resultMsgElement = document.getElementById('result-message');
          if (resultMsgElement) {
              resultMsgElement.textContent = 'Payment cancelled.';
              resultMsgElement.style.color = 'orange';
          }
      }

  })
  .render('#paypal-button-container') // Render buttons into the div
  .then(() => console.log('PayPal Buttons rendered.'))
  .catch((err) => {
      console.error('Failed to render PayPal Buttons:', err);
      const resultMsgElement = document.getElementById('result-message');
      if (resultMsgElement) {
          resultMsgElement.textContent = 'Could not load PayPal options.';
          resultMsgElement.style.color = 'red';
      }
  });

} // End of setupPayPalButtons function