document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = localStorage.getItem('user');
    if (user) {
        const userData = JSON.parse(user);
        if (userData.username === username && userData.password === password) {
            alert('Login successful!');
            window.location.href = 'index.html'; // Redirecționează către index
        } else {
            alert('Incorrect username or password!');
        }
    } else {
        alert('User does not exist!');
    }
});