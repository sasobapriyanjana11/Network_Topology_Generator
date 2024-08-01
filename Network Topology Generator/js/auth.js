// auth.js

//admin =admin,admin123
//user=viewer,viewer123

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication (you should replace this with a real authentication system)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({ username, role: 'admin' }));
        window.location.href = '/pages/j1.html';
    } else if (username === 'viewer' && password === 'viewer123') {
        localStorage.setItem('user', JSON.stringify({ username, role: 'viewer' }));
        window.location.href = '/pages/j1.html';
    } else {
        alert('Invalid username or password');
    }
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
});

function checkAuthentication() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login.html';
    } else {
        // Additional checks based on user role can be added here
        if (user.role === 'viewer') {
            // Disable certain features for viewers
            document.getElementById('topologyForm').style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', checkAuthentication);
