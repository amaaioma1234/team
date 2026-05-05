// theme
function toggleTheme() {
    let currentTheme = localStorage.getItem("theme");

    if (currentTheme === "dark") {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }
}

// theme save
document.addEventListener("DOMContentLoaded", function() {
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
    
    // order
    if (document.getElementById("Order-menu")) {
        initOrderSystem();
    }
});

// search
function searchFood() {
    let input = document.getElementById("search");
    if (!input) return;
    
    let filter = input.value.toLowerCase();
    let cards = document.getElementsByClassName("food-card");

    for (let i = 0; i < cards.length; i++) {
        let titleElement = cards[i].getElementsByTagName("h3")[0];
        if (titleElement) {
            let title = titleElement.innerText.toLowerCase();
            if (title.includes(filter)) {
                cards[i].style.display = "block";
            } else {
                cards[i].style.display = "none";
            }
        }
    }
}

// grid/list
function setGrid() {
    let container = document.getElementById("menuContainer");
    let gridBtn = document.getElementById("gridBtn");
    let listBtn = document.getElementById("listBtn");

    if (container) container.className = "grid";
    if (gridBtn) gridBtn.classList.add("active");
    if (listBtn) listBtn.classList.remove("active");
}

function setList() {
    let container = document.getElementById("menuContainer");
    let gridBtn = document.getElementById("gridBtn");
    let listBtn = document.getElementById("listBtn");

    if (container) container.className = "list";
    if (listBtn) listBtn.classList.add("active");
    if (gridBtn) gridBtn.classList.remove("active");
}

// contact result
let contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const msg = document.getElementById('contactMessage');
        if (msg) {
            msg.textContent = `Thanks ${name}! We'll get back to you soon.`;
            msg.style.color = '#00ff00';
        }
        this.reset();
        setTimeout(() => {
            if (msg) msg.textContent = '';
        }, 3000);
    });
}

// ordering
function initOrderSystem() {
    let quantities = {};
    
    let orderItems = document.querySelectorAll('.order-item');
    
    orderItems.forEach(item => {
        let name = item.querySelector('h3').innerText;
        quantities[name] = 0;
    });
    
    function updateDisplay() {
        let total = 0;
        let orderList = document.getElementById('order-list');
        if (!orderList) return;
        
        orderList.innerHTML = '';
        
        for (let [item, qty] of Object.entries(quantities)) {
            if (qty > 0) {
                let price = getPrice(item);
                let itemTotal = qty * price;
                total += itemTotal;
                let li = document.createElement('li');
                li.textContent = `${item} x${qty} – $${itemTotal}`;
                orderList.appendChild(li);
            }
            
            let qtySpan = document.getElementById(`qty${item}`);
            if (qtySpan) qtySpan.textContent = qty;
        }
        
        let totalSpan = document.getElementById('total-price');
        if (totalSpan) totalSpan.textContent = total;
    }
    
    function getPrice(item) {
        let card = Array.from(orderItems).find(el => el.querySelector('h3').innerText === item);
        if (card) {
            let priceSpan = card.querySelector('.quantitybutton');
            if (priceSpan) {
                return parseInt(priceSpan.getAttribute('data-price'));
            }
        }
        return 0;
    }
    
    let buttons = document.querySelectorAll('.quantitybutton');
    buttons.forEach(btn => {
        btn.removeEventListener('click', btn.clickHandler);
        
        btn.clickHandler = function() {
            let item = this.getAttribute('data-item');
            let change = parseInt(this.getAttribute('data-change'));
            let current = quantities[item] || 0;
            let newQty = current + change;
            if (newQty >= 0) {
                quantities[item] = newQty;
                updateDisplay();
            }
        };
        
        btn.addEventListener('click', btn.clickHandler);
    });
    
    let confirmBtn = document.getElementById('confirm-order');
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', confirmBtn.clickHandler);
        
        confirmBtn.clickHandler = function() {
            let totalSpan = document.getElementById('total-price');
            let total = totalSpan ? parseInt(totalSpan.textContent) : 0;
            let feedback = document.getElementById('order-feedback');
            
            if (total === 0) {
                if (feedback) {
                    feedback.innerHTML = 'Please add items to your order.';
                    feedback.style.color = '#ff0000';
                }
            } else {
                if (feedback) {
                    feedback.innerHTML = `Order confirmed! Total: $${total}. Enjoy your meal!`;
                    feedback.style.color = '#00ff00';
                }
                for (let item in quantities) {
                    quantities[item] = 0;
                }
                updateDisplay();
            }
            
            setTimeout(() => {
                if (feedback) feedback.innerHTML = '';
            }, 5000);
        };
        
        confirmBtn.addEventListener('click', confirmBtn.clickHandler);
    }
    
    updateDisplay();
}

// login
function validateLogin() {
    let user = document.getElementById("username");
    let pass = document.getElementById("password");

    if (!user || !pass) {
        console.log("Form elements not found");
        return false;
    }

    if (user.value === "" || pass.value === "") {
        alert("Please fill all fields");
        return false;
    }

    if (pass.value.length < 6) {
        alert("Password must be at least 6 characters");
        return false;
    }

    alert("Login successful! Welcome " + user.value);
    console.log("Attempting redirect...");
    window.location.href = "index.html";
    return false;
}

// register
function validateRegister() {
    let name = document.getElementById("reg-name");
    let email = document.getElementById("reg-email");
    let user = document.getElementById("reg-user");
    let pass = document.getElementById("reg-pass");
    let confirm = document.getElementById("reg-confirm");

    if (!name || !email || !user || !pass || !confirm) return false;

    if (name.value === "" || email.value === "" || user.value === "" || pass.value === "" || confirm.value === "") {
        alert("Please fill all fields");
        return false;
    }

    if (pass.value.length < 6) {
        alert("Password must be at least 6 characters");
        return false;
    }

    if (pass.value !== confirm.value) {
        alert("Passwords do not match!");
        return false;
    }

    localStorage.setItem("username", user.value);
    localStorage.setItem("password", pass.value);

    alert("Account created for " + name.value);
    window.location.href = "index.html";
    return false;
}

//reservations
document.getElementById('res-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const people = document.getElementById('people').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const msg = document.getElementById('res-message');
    
    if (msg) {
        msg.textContent = `You're booked ${name}! Table for ${people} on ${date} at ${time} is confirmed. We look forward to serving you at Foodies Hub!`;
        msg.style.color = '#00ff00';
    }
    
    document.getElementById('res-form').reset();
});
