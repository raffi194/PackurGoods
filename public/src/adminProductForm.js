/**
 * Admin Product Form Handler
 * Manages the product addition form in the admin interface
 */

document.addEventListener('DOMContentLoaded', function() {
  // Form elements
  const productForm = document.getElementById('productForm');
  const submitButton = document.getElementById('pilihButton');
  const sizeInputs = {
    S: document.getElementById('sizeS'),
    M: document.getElementById('sizeM'),
    L: document.getElementById('sizeL'),
    XL: document.getElementById('sizeXL'),
    '2XL': document.getElementById('size2XL')
  };
  const totalInput = document.getElementById('total');
  const warnaSelect = document.getElementById('warnaProduk');
  const warnaPreview = document.getElementById('warnaPreview');
  const fileInput = document.getElementById('gambarProduk');
  const genderSelect = document.getElementById('genderProduk');
  const fileNameDisplay = document.getElementById('fileNameDisplay');
  const imagePreview = document.getElementById('imagePreview');
  
  let selectedImageData = null;

  // Calculate total stock from all size inputs
  window.calculateTotal = function() {
    let total = 0;
    for (const size in sizeInputs) {
      const input = sizeInputs[size];
      const value = parseInt(input.value) || 0;
      total += value;
    }
    totalInput.value = total;
  };

  // Preview selected color
  window.previewWarna = function() {
    const selectedColor = warnaSelect.value;
    warnaPreview.style.backgroundColor = selectedColor;
  };

  // Handle image selection and preview
  window.previewImage = function(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = function(e) {
        selectedImageData = e.target.result;
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'max-w-full max-h-full object-contain';
        
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);
        
        fileNameDisplay.textContent = file.name.length > 20 
          ? file.name.substring(0, 17) + '...' 
          : file.name;
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Form validation
  function validateForm() {
    const namaProduk = document.getElementById('namaProduk').value;
    const hargaProduk = document.getElementById('hargaProduk').value;
    const warna = warnaSelect.value;
    const gender = genderSelect.value;
    let totalStock = parseInt(totalInput.value) || 0;

    let isValid = true;
    let errorMessage = '';

    // Reset previous error styles
    document.querySelectorAll('.error-border').forEach(el => {
      el.classList.remove('error-border');
    });

    // Validate name
    if (!namaProduk) {
      document.getElementById('namaProduk').classList.add('error-border');
      isValid = false;
      errorMessage += 'Nama produk harus diisi.\n';
    }

    // Validate price
    if (!hargaProduk) {
      document.getElementById('hargaProduk').classList.add('error-border');
      isValid = false;
      errorMessage += 'Harga produk harus diisi.\n';
    }

    // Validate color
    if (!warna) {
      warnaSelect.classList.add('error-border');
      isValid = false;
      errorMessage += 'Warna harus dipilih.\n';
    }

    // Validate gender
    if (!gender) {
      genderSelect.classList.add('error-border');
      isValid = false;
      errorMessage += 'Gender harus dipilih.\n';
    }

    // Validate stock
    if (totalStock <= 0) {
      totalInput.classList.add('error-border');
      for (const size in sizeInputs) {
        sizeInputs[size].classList.add('error-border');
      }
      isValid = false;
      errorMessage += 'Total stok harus lebih dari 0.\n';
    }

    // Validate image
    if (!selectedImageData) {
      document.getElementById('gambarProduk').parentElement.classList.add('error-border');
      isValid = false;
      errorMessage += 'Gambar produk harus dipilih.\n';
    }

    return { isValid, errorMessage };
  }

  // Handle form submission
  submitButton.addEventListener('click', function() {
    const validation = validateForm();
    
    if (!validation.isValid) {
      Swal.fire({
        title: 'Error!',
        text: validation.errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Get form values
    const namaProduk = document.getElementById('namaProduk').value;
    const hargaProduk = document.getElementById('hargaProduk').value;
    const warna = warnaSelect.value;
    const gender = genderSelect.value;
    
    // Get size quantities
    const ukuran = {
      S: parseInt(sizeInputs.S.value) || 0,
      M: parseInt(sizeInputs.M.value) || 0,
      L: parseInt(sizeInputs.L.value) || 0,
      XL: parseInt(sizeInputs.XL.value) || 0,
      '2XL': parseInt(sizeInputs['2XL'].value) || 0
    };

    // Create product object
    const newProduct = {
      id: Date.now().toString(),
      nama: namaProduk,
      harga: hargaProduk,
      gambar: selectedImageData,
      warna: warna,
      gender: gender,
      ukuran: ukuran,
      total: parseInt(totalInput.value) || 0,
      dateAdded: new Date().toISOString(),
      sold: 0
    };

    // Get existing products or create empty array
    let produkList = JSON.parse(localStorage.getItem('bentalaProducts')) || [];
    
    // Add new product
    produkList.push(newProduct);
    
    // Save back to localStorage
    localStorage.setItem('bentalaProducts', JSON.stringify(produkList));

    // Show success message
    Swal.fire({
      title: 'Sukses!',
      text: 'Produk berhasil ditambahkan.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        // Reset form
        productForm.reset();
        warnaPreview.style.backgroundColor = '';
        selectedImageData = null;
        imagePreview.innerHTML = '<span class="text-gray-500">Preview gambar akan muncul di sini</span>';
        fileNameDisplay.textContent = 'Masukkan';
        
        // Redirect to product listing
        window.location.href = 'admin produk.html';
      }
    });
  });
});