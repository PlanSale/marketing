let selectedPaymentMethod = 'card'; // Default to credit card
let selectedProductData = {
    id: '',
    name: '',
    price: 0
};
let currentQuantity = 1;

// Product selection
function selectProduct(element, productId, productName, price) {
    // Remove selected class from all products
    document.querySelectorAll('.product-option').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked product
    element.classList.add('selected');
    
    // Store product data
    selectedProductData = {
        id: productId,
        name: productName,
        price: price
    };
    
    // Update hidden input
    document.getElementById('selectedProduct').value = productId;
    
    // Update summary
    updateSummary();
}

// Change quantity
function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    let newQuantity = currentQuantity + delta;
    
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 100) newQuantity = 100;
    
    currentQuantity = newQuantity;
    quantityInput.value = currentQuantity;
    
    updateSummary();
}

// Update order summary
function updateSummary() {
    const unitPrice = selectedProductData.price;
    const quantity = currentQuantity;
    const subtotal = unitPrice * quantity;
    
    // Shipping: $10 flat rate, FREE for 5+ cards
    const shipping = quantity >= 5 ? 0 : 10;
    
    const taxableAmount = subtotal + shipping;
    const tax = taxableAmount * 0.13; // 13% HST
    const total = taxableAmount + tax;
    
    document.getElementById('summaryProduct').textContent = selectedProductData.name || 'Not selected';
    document.getElementById('summaryQuantity').textContent = quantity;
    document.getElementById('summaryUnitPrice').textContent = unitPrice > 0 ? `CAD $${unitPrice.toFixed(2)}` : '$0.00';
    document.getElementById('summarySubtotal').textContent = subtotal > 0 ? `CAD $${subtotal.toFixed(2)}` : '$0.00';
    document.getElementById('summaryShipping').textContent = quantity >= 5 ? 'FREE' : 'CAD $10.00';
    document.getElementById('summaryTax').textContent = tax > 0 ? `CAD $${tax.toFixed(2)}` : '$0.00';
    document.getElementById('summaryTotal').textContent = total > 0 ? `CAD $${total.toFixed(2)}` : '$0.00';
    
    // Update E-Transfer amount
    if (total > 0) {
        document.getElementById('etransferAmount').textContent = `CAD $${total.toFixed(2)}`;
    }
    
    // Update submit button
    const submitBtn = document.getElementById('submitBtn');
    if (selectedPaymentMethod === 'card') {
        submitBtn.textContent = total > 0 ? `Pay CAD $${total.toFixed(2)}` : 'Complete Order';
    } else {
        submitBtn.textContent = 'Submit Order';
    }
}

// Payment method selection
function selectPayment(element, method) {
    selectedPaymentMethod = method;
    
    document.querySelectorAll('.payment-method').forEach(m => {
        m.classList.remove('selected');
    });
    element.classList.add('selected');

    // Show/hide relevant payment sections
    const cardDetails = document.getElementById('cardDetails');
    const etransferDetails = document.getElementById('etransferDetails');
    const secureText = document.getElementById('secureText');

    if (method === 'card') {
        cardDetails.style.display = 'block';
        etransferDetails.style.display = 'none';
        secureText.textContent = 'Secure payment via PayPal';
        
        // Make card fields required
        document.getElementById('cardNumber').required = true;
        document.getElementById('cardExpiry').required = true;
        document.getElementById('cardCVV').required = true;
        document.getElementById('cardName').required = true;
    } else if (method === 'etransfer') {
        cardDetails.style.display = 'none';
        etransferDetails.style.display = 'block';
        secureText.textContent = 'Payment confirmation required before shipping';
        
        // Make card fields not required
        document.getElementById('cardNumber').required = false;
        document.getElementById('cardExpiry').required = false;
        document.getElementById('cardCVV').required = false;
        document.getElementById('cardName').required = false;
    }
    
    updateSummary();
}

// Collect form data
function collectFormData() {
    const unitPrice = selectedProductData.price;
    const quantity = currentQuantity;
    const subtotal = unitPrice * quantity;
    const shipping = quantity >= 5 ? 0 : 10;
    const taxableAmount = subtotal + shipping;
    const tax = taxableAmount * 0.13;
    const total = taxableAmount + tax;
    
    const formData = {
        // Business Information
        businessName: document.getElementById('businessName').value,
        contactName: document.getElementById('contactName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        googleProfile: document.getElementById('googleProfile').value,
        
        // Product Details
        productId: selectedProductData.id,
        productName: selectedProductData.name,
        unitPrice: unitPrice,
        quantity: quantity,
        
        // Shipping Address
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        province: document.getElementById('province').value,
        postalCode: document.getElementById('postalCode').value,
        
        // Payment Method
        paymentMethod: selectedPaymentMethod,
        
        // Pricing
        subtotal: `CAD $${subtotal.toFixed(2)}`,
        shipping: quantity >= 5 ? 'FREE' : `CAD $${shipping.toFixed(2)}`,
        tax: `CAD $${tax.toFixed(2)}`,
        total: `CAD $${total.toFixed(2)}`
    };

    return formData;
}

// Generate email content
function generateEmailContent(data) {
    const provinceNames = {
        'ON': 'Ontario', 'QC': 'Quebec', 'BC': 'British Columbia', 'AB': 'Alberta',
        'MB': 'Manitoba', 'SK': 'Saskatchewan', 'NS': 'Nova Scotia', 'NB': 'New Brunswick',
        'NL': 'Newfoundland and Labrador', 'PE': 'Prince Edward Island',
        'NT': 'Northwest Territories', 'YT': 'Yukon', 'NU': 'Nunavut'
    };

    let emailBody = `New Order - VFC Smart NFC Cards

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Business Name: ${data.businessName}
Contact Person: ${data.contactName}
Email: ${data.email}
Phone: ${data.phone}
Website: ${data.website || 'Not provided'}
Google Business Profile: ${data.googleProfile || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Product: ${data.productName}
Unit Price: CAD $${data.unitPrice}
Quantity: ${data.quantity} card${data.quantity > 1 ? 's' : ''}

Subtotal: ${data.subtotal}
Shipping: ${data.shipping}
Tax (HST 13%): ${data.tax}
━━━━━━━━━━━━━━━━━
TOTAL: ${data.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SHIPPING ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.address}
${data.city}, ${provinceNames[data.province] || data.province} ${data.postalCode}
Canada

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Method: ${data.paymentMethod === 'card' ? 'Credit Card (PayPal)' : 'E-Transfer'}
Amount: ${data.total}

`;

    if (data.paymentMethod === 'etransfer') {
        emailBody += `📧 E-TRANSFER PAYMENT PENDING

Please ship cards only after E-Transfer payment is confirmed.

Customer Instructions:
- Send E-Transfer to: info@plansale.ca
- Amount: ${data.total}
- Message: ${data.businessName}, ${data.productName}, ${data.quantity} card${data.quantity > 1 ? 's' : ''}

`;
    }

    emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 SETUP REQUIRED:
• Configure NFC cards with business information above
• Link to Google Business Profile (if provided)
• Add website link (if provided)
• Custom branding with business name

📅 Ship within 3-5 business days of payment confirmation
🎯 Include setup guide and support information

Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })} EST`;

    return emailBody;
}

// Form submission
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate product selection
    if (!selectedProductData.name) {
        alert('Please select a product');
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // Collect form data
    const formData = collectFormData();
    const emailContent = generateEmailContent(formData);

    // Prepare mailto link
    const subject = encodeURIComponent(`New NFC Card Order: ${formData.businessName} - ${formData.quantity}x ${formData.productName}`);
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:info@plansale.ca?subject=${subject}&body=${body}`;

    // Simulate processing
    setTimeout(() => {
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        if (selectedPaymentMethod === 'card') {
            alert(`Order confirmed!\n\nYour ${formData.quantity} ${formData.productName}${formData.quantity > 1 ? 's' : ''} will be configured and shipped within 3-5 business days.\n\nTotal: ${formData.total}\n\nYou will receive:\n• Order confirmation email\n• Tracking information once shipped\n• Setup guide and support materials\n\nThank you for your order!`);
            // In production, redirect to PayPal payment
            // window.location.href = 'paypal-payment-url';
        } else {
            alert(`Order submitted!\n\nProduct: ${formData.quantity} ${formData.productName}${formData.quantity > 1 ? 's' : ''}\nTotal: ${formData.total}\n\nNext steps:\n1. Send E-Transfer to info@plansale.ca\n2. Include in message: ${formData.businessName}, ${formData.productName}, ${formData.quantity} card${formData.quantity > 1 ? 's' : ''}\n3. Your cards will ship within 3-5 business days of payment confirmation\n\nYou will receive an order confirmation email shortly.`);
        }
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Optional: Reset form or redirect
        // this.reset();
    }, 1500);
});

// Auto-format credit card number
const cardInput = document.getElementById('cardNumber');
if (cardInput) {
    cardInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

// Auto-format expiry date
const expiryInput = document.getElementById('cardExpiry');
if (expiryInput) {
    expiryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    });
}

// CVV only numbers
const cvvInput = document.getElementById('cardCVV');
if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Auto-format postal code
const postalCodeInput = document.getElementById('postalCode');
if (postalCodeInput) {
    postalCodeInput.addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (value.length > 3) {
            value = value.slice(0, 3) + ' ' + value.slice(3, 6);
        }
        e.target.value = value;
    });
}

// Email protected (reveal and copy)
(function () {
    const realEmail = "info@plansale.ca";
    const el = document.getElementById("revealEmail");
    const hint = document.getElementById("copyHint");

    if (!el) return;

    el.addEventListener("click", async (e) => {
        e.preventDefault();

        // Display real email
        el.textContent = realEmail;

        // Copy to clipboard
        try {
            await navigator.clipboard.writeText(realEmail);
            if (hint) hint.style.display = "block";
        } catch (err) {
            // If browser doesn't support clipboard, just show email
        }
    });
})();
