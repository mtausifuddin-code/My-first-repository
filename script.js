// Small client-side helpers: show/hide home address, Formspree handling fallback
document.addEventListener('DOMContentLoaded', function(){
  const modeField = document.querySelector('select[name="mode"]');
  const addressField = document.getElementById('address-field');
  const form = document.getElementById('booking-form');
  const msg = document.getElementById('form-message');
  const payBtn = document.getElementById('pay-now');

  function toggleAddress() {
    if (modeField.value === 'home') addressField.style.display = 'block';
    else addressField.style.display = 'none';
  }
  modeField.addEventListener('change', toggleAddress);
  toggleAddress();

  // Form submit: if user hasn't replaced Formspree action, provide fallback instructions
  form.addEventListener('submit', async function(e){
    const action = form.getAttribute('action') || '';
    if (action.includes('yourformid') || action.trim()==='') {
      e.preventDefault();
      // fallback: create a mailto with the form data as a quick alternative
      const data = new FormData(form);
      const name = data.get('name') || '';
      const phone = data.get('phone') || '';
      const email = data.get('_replyto') || '';
      const service = data.get('service') || '';
      const when = data.get('preferred_time') || '';
      const mode = data.get('mode') || '';
      const address = data.get('address') || '';
      const subject = encodeURIComponent('Appointment request from website');
      const bodyText = `Name: ${name}%0APhone: ${phone}%0AEmail: ${email}%0AService: ${service}%0APreferred: ${when}%0AMode: ${mode}%0AAddress: ${address}`;
      const mailto = `mailto:drafraazphysiotherapy@gmail.com?subject=${subject}&body=${bodyText}`;
      msg.innerText = 'No form endpoint configured. Opening your email client to send the booking request. For automated bookings, sign up at https://formspree.io and replace the form action in index.html.';
      window.location.href = mailto;
      return;
    }

    // If the action is set (Formspree or other endpoint), submit via fetch and show message
    e.preventDefault();
    msg.innerText = 'Sending...';
    try {
      const response = await fetch(action, { method: form.method, body: new FormData(form), headers:{'Accept':'application/json'} });
      if (response.ok) {
        msg.innerText = 'Request sent — we will contact you soon.';
        form.reset();
        toggleAddress();
      } else {
        msg.innerText = 'There was an issue sending the request. Please try again or call/WhatsApp +91 8984337808.';
      }
    } catch (err) {
      console.error(err);
      msg.innerText = 'Network error. Please try again later or contact via phone/WhatsApp.';
    }
  });

  // Pay now button: by default opens WhatsApp or an info message. Replace with your payment link or integrate Razorpay.
  payBtn.addEventListener('click', function(){
    // Replace the URL below with your payment link or Razorpay checkout
    const paymentLink = '#'; // e.g. 'https://rzp.io/l/yourcheckoutlink'
    if (paymentLink === '#' || paymentLink.trim()==='') {
      alert('To enable online payments: sign up with Razorpay/Stripe and replace the placeholder link in script.js (paymentLink). You can also create Checkout links and paste the URL here.');
      return;
    }
    window.open(paymentLink, '_blank');
  });
});