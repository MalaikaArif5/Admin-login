const API_URL = 'https://fakestoreapi.com/products';

// === Login Form ===
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm').value;

      if (!name || !email || !password || !confirm) {
        alert('Please fill all fields!');
        return;
      }

      if (password !== confirm) {
        alert('Passwords do not match!');
        return;
      }

      // Save user to localStorage (simulate account creation)
      localStorage.setItem('user', JSON.stringify({ name, email }));
      alert(`Welcome ${name}! Redirecting to product page...`);
      window.location.href = 'products.html';
    });
  }

  // === Product Page ===
  const productContainer = document.getElementById('product-container');
  if (productContainer) {
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    let allProducts = [];

    // Fetch products
    async function fetchProducts() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        allProducts = data;
        populateCategories(data);
        displayProducts(data);
      } catch (err) {
        productContainer.innerHTML = `<p>⚠️ Failed to load products.</p>`;
      }
    }

    function populateCategories(products) {
      const categories = ['all', ...new Set(products.map(p => p.category))];
      categorySelect.innerHTML = categories
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join('');
    }

    function displayProducts(products) {
      productContainer.innerHTML = '';
      if (products.length === 0) {
        productContainer.innerHTML = `<p>No products found.</p>`;
        return;
      }

      products.forEach(p => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <img src="${p.image}" alt="${p.title}">
          <h2>${p.title}</h2>
          <p>${p.category}</p>
          <p class="price">$${p.price}</p>
        `;
        productContainer.appendChild(card);
      });
    }

    function filterProducts() {
      const term = searchInput.value.toLowerCase();
      const selectedCategory = categorySelect.value;

      const filtered = allProducts.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(term);
        const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchSearch && matchCategory;
      });

      displayProducts(filtered);
    }

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);

    fetchProducts();
  }
});
