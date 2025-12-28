let selectedPaymentMethod = 'card'; // Default to credit card
let selectedPlanData = {
    id: '',
    name: '',
    price: 0
};

// Plan selection
function selectPlan(element, planId, planName, price) {
    // Remove selected class from all plans
    document.querySelectorAll('.plan-option').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked plan
    element.classList.add('selected');
    
    // Store plan data
    selectedPlanData = {
        id: planId,
        name: planName,
        price: price
    };
    
    // Update hidden input
    document.getElementById('selectedPlan').value = planId;
    
    // Update E-Transfer amount and submit button
    updatePaymentDisplay();
}

// Update payment display
function updatePaymentDisplay() {
    const price = selectedPlanData.price;
    const tax = price * 0.13; // 13% HST
    const total = price + tax;
    
    // Update E-Transfer amount
    if (total > 0) {
        document.getElementById('etransferAmount').textContent = `CAD $${total.toFixed(2)}`;
    }
    
    // Update submit button
    const submitBtn = document.getElementById('submitBtn');
    if (selectedPaymentMethod === 'card') {
        submitBtn.textContent = total > 0 ? `Subscribe - CAD $${total.toFixed(2)}` : 'Start Subscription';
    } else {
        submitBtn.textContent = 'Submit Subscription';
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
        secureText.textContent = 'Secure payment - Cancel anytime';
        
        // Make card fields required
        document.getElementById('cardNumber').required = true;
        document.getElementById('cardExpiry').required = true;
        document.getElementById('cardCVV').required = true;
        document.getElementById('cardName').required = true;
    } else if (method === 'etransfer') {
        cardDetails.style.display = 'none';
        etransferDetails.style.display = 'block';
        secureText.textContent = 'Manual renewal via E-Transfer';
        
        // Make card fields not required
        document.getElementById('cardNumber').required = false;
        document.getElementById('cardExpiry').required = false;
        document.getElementById('cardCVV').required = false;
        document.getElementById('cardName').required = false;
    }
    
    updatePaymentDisplay();
}

// Collect form data
function collectFormData() {
    const price = selectedPlanData.price;
    const tax = price * 0.13;
    const total = price + tax;
    
    const formData = {
        // Contact Information
        email: document.getElementById('email').value,
        name: document.getElementById('name').value || 'Not provided',
        phone: document.getElementById('phone').value || 'Not provided',
        
        // Plan Details
        planId: selectedPlanData.id,
        planName: selectedPlanData.name,
        planPrice: price,
        
        // Payment Method
        paymentMethod: selectedPaymentMethod,
        
        // Pricing
        subtotal: `CAD $${price.toFixed(2)}`,
        tax: `CAD $${tax.toFixed(2)}`,
        total: `CAD $${total.toFixed(2)}`
    };

    return formData;
}

// Generate email content
function generateEmailContent(data) {
    const billingCycle = {
        'monthly': 'Monthly (renews every month)',
        '3-month': 'Quarterly (renews every 3 months)',
        'annual': 'Annually (renews every year)'
    };

    let emailBody = `New VPN Subscription - Business VPN Service

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBSCRIBER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email: ${data.email}
Name: ${data.name}
Phone: ${data.phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBSCRIPTION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Plan: ${data.planName}
Billing Cycle: ${billingCycle[data.planId] || data.planName}

Subscription Fee: ${data.subtotal}
Tax (HST 13%): ${data.tax}
━━━━━━━━━━━━━━━━━━
Total: ${data.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Method: ${data.paymentMethod === 'card' ? 'Credit Card (Auto-billing via PayPal)' : 'E-Transfer (Manual Renewal)'}
Amount: ${data.total}

`;

    if (data.paymentMethod === 'etransfer') {
        emailBody += `📧 E-TRANSFER SUBSCRIPTION

Activate service after E-Transfer payment is confirmed.

Customer Instructions:
- Send E-Transfer to: info@plansale.ca
- Amount: ${data.total}
- Message: VPN Subscription - ${data.planName} - ${data.email}

⚠️ Manual renewal: Customer will need to send E-Transfer before each billing period.
Send renewal reminder 7 days before expiry.

`;
    } else {
        emailBody += `💳 AUTO-BILLING SUBSCRIPTION

Set up automatic recurring billing via PayPal.
Customer will be charged ${data.total} per billing cycle.

`;
    }

    emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETUP INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Send VPN credentials to: ${data.email}

Include in welcome email:
1. VPN username and password
2. Server addresses (Canada & US)
3. Download links for all platforms:
   - Mac client
   - Windows client
   - iOS app
   - Android app
4. Quick setup guide
5. 24/7 support contact information

✅ Activate subscription immediately
🔐 Generate secure credentials
📱 Support multi-device (up to 5 devices)

Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })} EST`;

    return emailBody;
}

// Form submission
document.getElementById('subscriptionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate plan selection
    if (!selectedPlanData.name) {
        alert('Please select a subscription plan');
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
    const subject = encodeURIComponent(`New VPN Subscription: ${formData.planName} - ${formData.email}`);
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:info@plansale.ca?subject=${subject}&body=${body}`;

    // Simulate processing
    setTimeout(() => {
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        if (selectedPaymentMethod === 'card') {
            alert(`Subscription activated!\n\nPlan: ${formData.planName}\nBilling: ${formData.total}\n\nYour VPN credentials will be sent to ${formData.email} within minutes.\n\nWhat's next:\n✓ Check your email for login details\n✓ Download VPN client for your device\n✓ Follow the setup guide\n✓ Connect to Canadian or US servers\n\nYour subscription renews automatically. Cancel anytime from your account.`);
            // In production, redirect to PayPal subscription setup
            // window.location.href = 'paypal-subscription-url';
        } else {
            alert(`Subscription request submitted!\n\nPlan: ${formData.planName}\nAmount: ${formData.total}\n\nNext steps:\n1. Send E-Transfer to info@plansale.ca\n2. Include in message: VPN Subscription - ${formData.planName} - ${formData.email}\n3. Your VPN credentials will be sent within 1 hour of payment confirmation\n\nRenewal reminders will be sent 7 days before expiry.\n\nQuestions? Contact support@plansale.ca`);
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
