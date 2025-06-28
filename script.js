document.addEventListener('DOMContentLoaded', () => {
    // === DOM Element Selections ===
    const openCartBtn = document.getElementById('openCart');
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.getElementById('closeCart');
    const modalCartList = document.getElementById('modal-cart-list');
    const modalCartTotalSpan = document.getElementById('modal-cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const toastNotification = document.getElementById('toastNotification');
    const menuGrid = document.getElementById('menuGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuSearchInput = document.getElementById('menuSearchInput');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navOverlay = document.createElement('div');
    navOverlay.classList.add('nav-overlay');
    document.body.appendChild(navOverlay);

    // Order Form Elements
    const customerNameInput = document.getElementById('customerName');
    const deliveryOptionRadios = document.querySelectorAll('input[name="deliveryOption"]');
    const addressGroup = document.getElementById('addressGroup');
    const deliveryAddressInput = document.getElementById('deliveryAddress');


    let cart = [];

    // === Product Data ===
    const products = [
        {
            name: "Corndog Original Mozza",
            price: 18000,
            category: "corndog",
            image: "images/corndog-original.jpg",
            description: "Keju mozarella melar dengan balutan tepung crispy.",
            options: [
                { name: "Saus Sambal", price: 0 },
                { name: "Mayones", price: 0 },
                { name: "Bubuk Pedas", price: 1000 }
            ]
        },
        {
            name: "Corndog Mix Sosis Keju",
            price: 22000,
            category: "corndog",
            image: "images/corndog-mix.jpg",
            description: "Kombinasi sosis premium dan keju lezat dalam satu gigitan.",
            options: [
                { name: "Saus Sambal", price: 0 },
                { name: "Mayones", price: 0 },
                { name: "Bubuk Pedas", price: 1000 }
            ]
        },
        {
            name: "Cipak Jeletot Ori",
            price: 12000,
            category: "cipak",
            image: "images/cipak-original.jpg",
            description: "Cipak kenyal gurih dengan bumbu pedas nampol khas kami.",
            options: []
        },
        {
            name: "Cipak Kuah Seblak",
            price: 15000,
            category: "cipak",
            image: "images/cipak-seblak.jpg",
            description: "Sensasi cipak dalam kuah seblak pedas yang bikin nagih.",
            options: [
                { name: "Toping Ceker", price: 3000 },
                { name: "Toping Telur", price: 2000 }
            ]
        },
        {
            name: "Corndog Coklat Keju",
            price: 20000,
            category: "corndog",
            image: "images/corndog-coklat.jpg",
            description: "Perpaduan manis coklat dan gurihnya keju mozarella.",
            options: []
        },
        {
            name: "Cipak Bawang Pedas",
            price: 13000,
            category: "cipak",
            image: "images/cipak-bawang.jpg",
            description: "Cipak dengan aroma bawang dan sensasi pedas yang bikin ketagihan.",
            options: []
        },
        {
            name: "Seblak Komplit",
            price: 18000,
            category: "seblak",
            image: "images/seblak-komplit.jpg",
            description: "Seblak pedas gurih dengan kerupuk, makaroni, sosis, dan telur.",
            options: [
                { name: "Level Pedas 1", price: 0 },
                { name: "Level Pedas 2", price: 0 },
                { name: "Level Pedas 3", price: 0 },
                { name: "Tambahan Ceker", price: 3000 }
            ]
        },
        {
            name: "Cimol Bojot",
            price: 10000,
            category: "cimol",
            image: "images/cimol-bojot.jpg",
            description: "Cimol kenyal dengan bumbu pedas gurih dan taburan bawang.",
            options: [
                { name: "Extra Bumbu Pedas", price: 1000 },
                { name: "Extra Bawang Goreng", price: 1000 }
            ]
        },
        {
            name: "Basreng Cobek",
            price: 15000,
            category: "basreng",
            image: "images/basreng-cobek.jpg",
            description: "Basreng renyah disajikan dengan bumbu cobek pedas segar.",
            options: [
                { name: "Level Pedas 1", price: 0 },
                { name: "Level Pedas 2", price: 0 },
                { name: "Level Pedas 3", price: 0 }
            ]
        },
        {
            name: "Basreng Biasa",
            price: 12000,
            category: "basreng",
            image: "images/basreng-biasa.jpg",
            description: "Basreng renyah dengan bumbu tabur original.",
            options: [
                { name: "Bumbu BBQ", price: 0 },
                { name: "Bumbu Keju", price: 0 },
                { name: "Bumbu Balado", price: 0 }
            ]
        },
        {
            name: "Mie Jebew",
            price: 16000,
            category: "mie",
            image: "images/mie-jebew.jpg",
            description: "Mie instan pedas dengan topping bakso, sosis, dan kerupuk.",
            options: [
                { name: "Level Pedas 1", price: 0 },
                { name: "Level Pedas 2", price: 0 },
                { name: "Level Pedas 3", price: 0 },
                { name: "Tambahan Telur", price: 2000 }
            ]
        }
    ];

    // === Core Functions ===

    // Display Toast Notification
    const showToast = (message) => {
        toastNotification.textContent = message;
        toastNotification.classList.add('show');
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 3000);
    };

    // Save/Load Cart from Local Storage
    const saveCart = () => {
        localStorage.setItem('corndogCipakCart', JSON.stringify(cart));
    };

    const loadCart = () => {
        const storedCart = localStorage.getItem('corndogCipakCart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            updateCartDisplay();
        }
    };

    // Update Cart Display (Modal and Count)
    const updateCartDisplay = () => {
        modalCartList.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        if (cart.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = '😥Keranjang Anda kosong.';
            emptyMessage.style.justifyContent = 'center';
            emptyMessage.style.padding = '20px 0';
            emptyMessage.style.color = '#777';
            modalCartList.appendChild(emptyMessage);
        } else {
            cart.forEach(item => {
                const li = document.createElement('li');
                let optionsText = item.options && item.options.length > 0
                    ? ` (${item.options.map(opt => opt.name).join(', ')})`
                    : '';
                li.innerHTML = `
                    <span>${item.name}${optionsText} (${item.quantity}x)</span>
                    <span>Rp ${item.totalItemPrice.toLocaleString('id-ID')}
                        <button class="remove-item-btn" data-item-id="${item.id}">Hapus</button>
                    </span>
                `;
                modalCartList.appendChild(li);
                total += item.totalItemPrice;
                itemCount += item.quantity;
            });
        }
        modalCartTotalSpan.textContent = `Rp ${total.toLocaleString('id-ID')}`;
        cartCountSpan.textContent = itemCount;
        saveCart();
    };

    // Render Menu Items
    const renderMenuItems = (filteredProducts) => {
        menuGrid.innerHTML = '';
        if (filteredProducts.length === 0) {
            menuGrid.innerHTML = '<p style="text-align: center; width: 100%; color: #888; font-size: 1.2rem; padding: 50px 0;">Tidak ada menu yang ditemukan.</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('menu-item', 'fade-up');
            itemDiv.setAttribute('data-category', product.category);

            let optionsHtml = '';
            if (product.options && product.options.length > 0) {
                optionsHtml = '<div class="options">';
                product.options.forEach(option => {
                    optionsHtml += `
                        <label>
                            <input type="checkbox" data-option-name="${option.name}" data-option-price="${option.price}">
                            ${option.name} ${option.price > 0 ? `(+Rp ${option.price.toLocaleString('id-ID')})` : ''}
                        </label>
                    `;
                });
                optionsHtml += '</div>';
            }

            itemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="price">Rp ${product.price.toLocaleString('id-ID')}</span>
                ${optionsHtml}
                <button class="add-to-cart-btn btn" data-item-name="${product.name}" data-base-price="${product.price}"><i class="fas fa-plus-circle"></i> Tambah</button>
            `;
            menuGrid.appendChild(itemDiv);
        });

        observeFadeUpElements();
    };

    // Filter Menu Items
    const filterMenu = (category) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`.filter-btn[data-filter="${category}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        const searchTerm = menuSearchInput.value.toLowerCase();
        const filtered = products.filter(product => {
            const matchesCategory = (category === 'all' || product.category === category);
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        renderMenuItems(filtered);
    };

    // Search Menu Items
    const searchMenu = () => {
        const searchTerm = menuSearchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

        const filtered = products.filter(product => {
            const matchesCategory = (activeFilter === 'all' || product.category === activeFilter);
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        renderMenuItems(filtered);
    };

    // === Event Listeners ===
    menuGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const button = event.target;
            const itemName = button.dataset.itemName;
            const basePrice = parseInt(button.dataset.basePrice);
            const itemContainer = button.closest('.menu-item');
            const selectedOptions = [];
            let optionsTotalPrice = 0;

            if (itemContainer) {
                const optionCheckboxes = itemContainer.querySelectorAll('.options input[type="checkbox"]:checked');
                optionCheckboxes.forEach(checkbox => {
                    const optionName = checkbox.dataset.optionName;
                    const optionPrice = parseInt(checkbox.dataset.optionPrice);
                    selectedOptions.push({ name: optionName, price: optionPrice });
                    optionsTotalPrice += optionPrice;
                });
            }

            const totalItemPricePerUnit = basePrice + optionsTotalPrice; // Calculate price for one unit

            const itemId = `${itemName}-${JSON.stringify(selectedOptions)}`;

            const existingItemIndex = cart.findIndex(item => item.id === itemId);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity++;
                // Recalculate totalItemPrice for this cart entry based on its new quantity and the price per unit
                cart[existingItemIndex].totalItemPrice = cart[existingItemIndex].quantity * cart[existingItemIndex].pricePerUnit;
            } else {
                cart.push({
                    id: itemId,
                    name: itemName,
                    basePrice: basePrice, // Store base price
                    options: selectedOptions,
                    pricePerUnit: totalItemPricePerUnit, // Store the price per unit including options
                    totalItemPrice: totalItemPricePerUnit, // For the first item, total is price per unit
                    quantity: 1
                });
            }
            updateCartDisplay();
            showToast(`${itemName} ditambahkan ke keranjang!`);
            cartCountSpan.classList.add('bounce');
            setTimeout(() => {
                cartCountSpan.classList.remove('bounce');
            }, 500);

            // Open cart modal automatically after adding an item
            cartModal.classList.add('active');
        }
    });

    modalCartList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const itemToRemoveId = event.target.dataset.itemId;
            cart = cart.filter(item => item.id !== itemToRemoveId);
            updateCartDisplay();
            showToast('Item dihapus dari keranjang.');
        }
    });

    openCartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Keranjang Anda kosong. Silakan tambahkan produk terlebih dahulu.');
            return;
        }

        const customerName = customerNameInput.value.trim();
        let deliveryOption = '';
        deliveryOptionRadios.forEach(radio => {
            if (radio.checked) {
                deliveryOption = radio.value;
            }
        });
        const deliveryAddress = deliveryAddressInput.value.trim();

        if (customerName === '') {
            showToast('Mohon isi Nama Kamu terlebih dahulu!');
            customerNameInput.focus();
            return;
        }

        if (deliveryOption === 'antar' && deliveryAddress === '') {
            showToast('Mohon isi Alamat Lengkap jika pilihan pengiriman "Diantar"!');
            deliveryAddressInput.focus();
            return;
        }

        let whatsappMessage = "Permisi, saya ingin memesan Berikut Detail Pesananya:\n\n";
        whatsappMessage += `Nama: ${customerName}\n`;
        whatsappMessage += `Pengambilan: ${deliveryOption === 'antar' ? 'Diantar' : 'Ambil di Warung'}\n`;
        if (deliveryOption === 'antar') {
            whatsappMessage += `Alamat: ${deliveryAddress}\n`;
        }
        whatsappMessage += "\n--- Detail Pesanan ---\n";

        cart.forEach(item => {
            let optionsText = item.options && item.options.length > 0
                ? ` (${item.options.map(opt => opt.name).join(', ')})`
                : '';
            whatsappMessage += `- ${item.name}${optionsText} (${item.quantity}x) - Rp ${item.totalItemPrice.toLocaleString('id-ID')}\n`;
        });
        whatsappMessage += `\nTotal Harga: ${modalCartTotalSpan.textContent}\n\n`;
        whatsappMessage += "Mohon konfirmasi pesanan saya. Terima kasih!";

        const whatsappUrl = `https://wa.me/62895386863049?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        // Reset form dan keranjang setelah checkout berhasil
        cart = [];
        saveCart();
        updateCartDisplay();
        cartModal.classList.remove('active');
        customerNameInput.value = ''; // Clear name input
        deliveryAddressInput.value = ''; // Clear address input
        document.getElementById('deliveryOptionDeliver').checked = true; // Reset radio button to default
        toggleAddressField(); // Memanggil ini untuk memastikan address group disembunyikan/ditampilkan dengan benar
        showToast('Pesanan Anda telah dikirimkan ke WhatsApp kami!');
    });

    // Handle visibility of address field
    const toggleAddressField = () => {
        if (document.getElementById('deliveryOptionDeliver').checked) {
            addressGroup.classList.remove('hidden');
            deliveryAddressInput.setAttribute('required', 'required');
        } else {
            addressGroup.classList.add('hidden');
            deliveryAddressInput.removeAttribute('required');
            deliveryAddressInput.value = '';
        }
    };

    // Listen for changes on delivery option radios
    deliveryOptionRadios.forEach(radio => {
        radio.addEventListener('change', toggleAddressField);
    });


    // Menu Filter Buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const filterCategory = event.target.dataset.filter;
            filterMenu(filterCategory);
        });
    });

    // Menu Search Input
    menuSearchInput.addEventListener('keyup', searchMenu);
    menuSearchInput.addEventListener('change', searchMenu);

    // === Intersection Observer for Animations ===
    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('fade-in-visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);

    const observeFadeUpElements = () => {
        const faders = document.querySelectorAll('.fade-up');
        faders.forEach(fader => {
            if (!fader.classList.contains('observed')) {
                appearOnScroll.observe(fader);
                fader.classList.add('observed');
            }
        });
    };


    // === Mobile Navigation ===
    hamburgerMenu.addEventListener('click', () => {
        navOverlay.innerHTML = `
            <button class="close-overlay-btn">&times;</button>
            <nav>
                <ul>
                    <li><a href="#menu-section">Menu</a></li>
                    <li><a href="#order-form-section">Pesan Sekarang</a></li>
                    <li><a href="#about">Tentang Kami</a></li>
                    <li><a href="#contact">Kontak</a></li>
                </ul>
            </nav>
        `;
        document.body.style.overflowY = 'hidden';
        navOverlay.classList.add('active');

        const closeOverlayBtn = navOverlay.querySelector('.close-overlay-btn');
        closeOverlayBtn.addEventListener('click', () => {
            navOverlay.classList.remove('active');
            document.body.style.overflowY = '';
        });

        navOverlay.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                navOverlay.classList.remove('active');
                document.body.style.overflowY = '';
            });
        });
    });

    // Smooth scroll for internal links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // === Initializations ===
    loadCart();
    filterMenu('all');

    // Inisialisasi status field alamat saat halaman dimuat
    toggleAddressField();

    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
        // Scroll to menu section on initial load if needed (optional)
        // setTimeout(() => {
        //     menuSection.scrollIntoView({
        //         behavior: 'smooth',
        //         block: 'start'
        //     });
        // }, 300);
    }
});
