function displayGreeting() {
    // Get the greeting element
    const greetingElement = document.getElementById('hero-greeting-dyncamic');
    
    // Get current hour (0-23)
    const currentHour = new Date().getHours();
    
    // Variable to store our greeting message
    let greeting;
    
    // Determine greeting based on time
    if (currentHour < 12) {
        greeting = "Good Morning, I'm";
    } else if (currentHour < 18) {
        greeting = "Good Afternoon, I'm";
    } else {
        greeting = "Good Evening, I'm";
    }
    
    // Display the greeting
    greetingElement.textContent = greeting;
}

// Call the greeting function when page loads
displayGreeting();



// ─── Smooth scroll helper (accounts for fixed navbar height) ───
const NAV_HEIGHT = 72;

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ─── Click delegation 
document.addEventListener('click', (e) => {

  // Nav logo / star → scroll to top
  if (e.target.closest('.nav-logo')) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  // Nav links → scroll to matching section
  const navLink = e.target.closest('.nav-links a');
  if (navLink) {
    const href = navLink.getAttribute('href');
    if (href?.startsWith('#') && !href.includes('placeholder')) {
      e.preventDefault();
      smoothScrollTo(href.slice(1));
    }
    return;
  }

});

// ─── Navbar shadow on scroll 
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ─── Contact form validation & feedback 
document.addEventListener('submit', (e) => {
  if (!e.target.closest('.contact-form')) return;
  e.preventDefault();

  const form = e.target;
  const nameInput    = form.querySelectorAll('.form-input')[0];
  const emailInput   = form.querySelectorAll('.form-input')[1];
  const messageInput = form.querySelector('.form-textarea');
  const btn          = form.querySelector('.send-btn');
  if (!btn) return;

  // Clear previous errors
  form.querySelectorAll('.form-error').forEach(el => el.remove());
  [nameInput, emailInput, messageInput].forEach(el => el.classList.remove('input-error'));

  let valid = true;

  function showError(input, msg) {
    input.classList.add('input-error');
    const err = document.createElement('span');
    err.className = 'form-error';
    err.textContent = msg;
    input.insertAdjacentElement('afterend', err);
    valid = false;
  }

  if (!nameInput.value.trim())
    showError(nameInput, 'Please enter your name.');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailInput.value.trim())
    showError(emailInput, 'Please enter your email.');
  else if (!emailPattern.test(emailInput.value.trim()))
    showError(emailInput, 'Please enter a valid email address.');

  if (!messageInput.value.trim())
    showError(messageInput, 'Please enter a message.');

  if (!valid) return;

  btn.textContent = '✓ Sent!';
  btn.disabled = true;
  [nameInput, emailInput, messageInput].forEach(i => { i.value = ''; });

  setTimeout(() => {
    btn.textContent = '✉ Send';
    btn.disabled = false;
  }, 3000);
});


// ─── Quote of the Day 
async function getQuote() {
  try {
    const res = await fetch('https://dummyjson.com/quotes/random');
    const data = await res.json();

    document.getElementById('block-quote').textContent = `"${data.quote}"`;
    document.getElementById('author').textContent = `— ${data.author}`;
  } catch (error) {
    document.getElementById('block-quote').textContent = 'Failed to load quote.';
    document.getElementById('author').textContent = '';
    console.error(error);
  }
}