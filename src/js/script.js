// Load Navbar
document.addEventListener("DOMContentLoaded", function() {
    fetch('../../src/Components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        })
        .catch(error => console.error('Error loading the navbar:', error));
});

// Load Offer
document.addEventListener("DOMContentLoaded", function() {
    fetch('../../src/Components/offerBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('offer').innerHTML = data;
        })
        .catch(error => console.log('Error loading the footer:', error));
        
});

// Load Footer
document.addEventListener("DOMContentLoaded", function() {
    fetch('../../src/Components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.log('Error loading the footer:', error));
        
});
