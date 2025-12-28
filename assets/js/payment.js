let selectedPaymentMethod = 'card'; // Default to credit card
let selectedPackageData = {
    name: '',
    price: 0
};

// Package selection
function selectPackage(element, packageName, price) {
    // Remove selected class from all packages
    document.querySelectorAll('.package-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked package
    element.classList.add('selected');
    
    // Store package data
    selectedPackageData = {
        name: packageName.charAt(0).toUpperCase() + packageName.slice(1),
        price: price
    };
    
    // Update hidden input
    document.getElementById('selectedPackage').value = packageName;
    
    // Update summary
    updateSummary();
}

// Update order summary
function updateSummary() {
    const monthlyFee = selectedPackageData.price;
    const tax = monthlyFee * 0.13; // 13% HST
    const total = monthlyFee + tax;
    
    document.getElementById('summaryPackage').textContent = selectedPackageData.name || 'Not selected';
    document.getElementById('summaryMonthly').textContent = monthlyFee > 0 ? `CAD $${monthlyFee.toFixed(2)}` : '$0.00';
    document.getElementById('summaryTax').textContent = tax > 0 ? `CAD $${tax.toFixed(2)}` : '$0.00';
    document.getElementById('summaryTotal').textContent = total > 0 ? `CAD $${total.toFixed(2)}` : '$0.00';
    
    // Update E-Transfer amount
    if (total > 0) {
        document.getElementById('etransferAmount').textContent = `CAD $${total.toFixed(2)}`;
    }
    
    // Update submit button
    const submitBtn = document.getElementById('submitBtn');
    if (selectedPaymentMethod === 'card') {
        submitBtn.textContent = total > 0 ? `Subscribe & Pay CAD $${total.toFixed(2)}/month` : 'Subscribe & Start SEO Services';
    } else {
        submitBtn.textContent = 'Submit Subscription Request';
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
        secureText.textContent = 'Secure auto-billing via PayPal - Cancel anytime';
        
        // Make card fields required
        document.getElementById('cardNumber').required = true;
        document.getElementById('cardExpiry').required = true;
        document.getElementById('cardCVV').required = true;
        document.getElementById('cardName').required = true;
    } else if (method === 'etransfer') {
        cardDetails.style.display = 'none';
        etransferDetails.style.display = 'block';
        secureText.textContent = 'Monthly invoice sent via email';
        
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
    const monthlyFee = selectedPackageData.price;
    const tax = monthlyFee * 0.13;
    const total = monthlyFee + tax;
    
    const formData = {
        // Personal Information
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        website: document.getElementById('website').value,
        
        // Business Information
        industry: document.getElementById('industry').value,
        currentTraffic: document.getElementById('currentTraffic').value,
        seoGoals: document.getElementById('seoGoals').value,
        targetArea: document.getElementById('targetArea').value,
        currentSEO: document.getElementById('currentSEO').value,
        targetKeywords: document.getElementById('targetKeywords').value,
        additionalNotes: document.getElementById('additionalNotes').value,
        
        // Package & Start Date
        package: selectedPackageData.name,
        packagePrice: monthlyFee,
        startDate: document.getElementById('startDate').value,
        
        // Payment Method
        paymentMethod: selectedPaymentMethod,
        
        // Service Details
        service: 'SEO/GEO Implementation Services',
        monthlyFee: `CAD $${monthlyFee.toFixed(2)}`,
        monthlyTax: `CAD $${tax.toFixed(2)}`,
        monthlyTotal: `CAD $${total.toFixed(2)}`
    };

    return formData;
}

// Generate email content
function generateEmailContent(data) {
    const industryNames = {
        'retail': 'Retail & E-commerce',
        'restaurant': 'Restaurant & Food Service',
        'healthcare': 'Healthcare & Wellness',
        'professional': 'Professional Services',
        'technology': 'Technology & Software',
        'real-estate': 'Real Estate',
        'construction': 'Construction & Trades',
        'automotive': 'Automotive',
        'beauty': 'Beauty & Salon',
        'education': 'Education & Training',
        'other': 'Other'
    };

    const trafficNames = {
        '0-500': '0 - 500 visitors/month',
        '500-2k': '500 - 2,000 visitors/month',
        '2k-5k': '2,000 - 5,000 visitors/month',
        '5k-10k': '5,000 - 10,000 visitors/month',
        '10k-25k': '10,000 - 25,000 visitors/month',
        '25k+': '25,000+ visitors/month'
    };

    const goalsNames = {
        'local-visibility': 'Increase Local Visibility',
        'organic-traffic': 'Increase Organic Traffic',
        'lead-generation': 'Generate More Leads',
        'brand-authority': 'Build Brand Authority',
        'e-commerce-sales': 'Increase E-commerce Sales',
        'competitive-ranking': 'Outrank Competitors',
        'ai-search': 'Appear in AI Search Results'
    };

    const seoStatusNames = {
        'no-seo': 'No SEO work done yet',
        'diy-seo': 'DIY SEO',
        'previous-agency': 'Worked with agency before',
        'in-house-team': 'Have in-house SEO team'
    };

    let emailBody = `New Subscription - SEO/GEO Implementation Services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTACT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Company: ${data.company}
Website: ${data.website}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUSINESS & SEO INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Industry: ${industryNames[data.industry] || data.industry}
Current Monthly Visitors: ${trafficNames[data.currentTraffic] || data.currentTraffic || 'Not specified'}
Primary SEO Goal: ${goalsNames[data.seoGoals] || data.seoGoals}
Target Geographic Area: ${data.targetArea || 'Not specified'}
Current SEO Status: ${seoStatusNames[data.currentSEO] || data.currentSEO || 'Not specified'}

Target Keywords:
${data.targetKeywords || 'Not provided'}

Additional Notes:
${data.additionalNotes || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBSCRIPTION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service: ${data.service}
Package: ${data.package}
Start Date: ${data.startDate}

Monthly Fee: ${data.monthlyFee}
HST (13%): ${data.monthlyTax}
Monthly Total: ${data.monthlyTotal}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Method: ${data.paymentMethod === 'card' ? 'Credit Card (Auto-billing via PayPal)' : 'E-Transfer (Monthly Invoice)'}
Billing Cycle: Monthly, starting ${data.startDate}

`;

    if (data.paymentMethod === 'etransfer') {
        emailBody += `📧 E-TRANSFER INSTRUCTIONS FOR CLIENT:

Client will receive monthly invoices via email.
- Send E-Transfer to: info@plansale.ca
- First month amount: ${data.monthlyTotal}
- Message should include: ${data.company}, SEO/GEO - ${data.package}, [Month/Year]

`;
    }

    emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 MONTHLY SUBSCRIPTION SERVICE
📊 Setup initial audit and strategy within 5-7 business days
📈 First performance report delivered after 30 days
🔄 Auto-renews monthly until cancelled (30 days notice required)

Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })} EST`;

    return emailBody;
}

// Form submission
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate package selection
    if (!selectedPackageData.name) {
        alert('Please select a package');
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
    const subject = encodeURIComponent(`New SEO/GEO Subscription: ${formData.package} - ${formData.company}`);
    const body = encodeURIComponent(emailContent);
    const mailtoLink = `mailto:info@plansale.ca?subject=${subject}&body=${body}`;

    // Simulate processing
    setTimeout(() => {
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        if (selectedPaymentMethod === 'card') {
            alert(`Subscription confirmed!\n\nYour ${formData.package} package will begin on ${formData.startDate}.\n\nMonthly billing: ${formData.monthlyTotal}\n\nYou will receive:\n• Confirmation email within 24 hours\n• Initial audit within 5-7 business days\n• First performance report after 30 days\n\nYour card will be charged automatically each month.`);
            // In production, redirect to PayPal subscription setup
            // window.location.href = 'paypal-subscription-url';
        } else {
            alert(`Subscription request submitted!\n\nYour ${formData.package} package will begin on ${formData.startDate}.\n\nMonthly billing: ${formData.monthlyTotal}\n\nYou will receive:\n• Confirmation email with invoice within 24 hours\n• Monthly invoices on the 1st of each month\n• Payment instructions via E-Transfer to info@plansale.ca\n\nFirst payment due within 5 business days to activate service.`);
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
