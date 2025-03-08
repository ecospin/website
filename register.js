document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        username,
        email,
        password,
        balance: 100.00, // Balanță inițială
    };

    localStorage.setItem('user', JSON.stringify(user));
    alert('Account created successfully!');
    window.location.href = 'index.html'; // Redirecționează către index
});