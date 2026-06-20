const url = 'http://127.0.0.1:5000/api/auth/login';

(async () => {
  try {
    const health = await fetch('http://127.0.0.1:5000/api/health');
    console.log('health status', health.status);
    console.log('health body', await health.text());

    const login = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john@example.com', password: 'password123' }),
    });
    console.log('login status', login.status);
    console.log(await login.text());
  } catch (err) {
    console.error('fetch error', err);
  }
})();
