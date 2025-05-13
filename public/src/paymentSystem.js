// Sistem Pembayaran untuk Bentala E-commerce
// Mengelola halaman pembayaran, instruksi bank, dan penampilan QR code

class PaymentManager {
  constructor() {
    this.orderData = null;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.loadOrderData();
      this.renderPaymentPage();
      this.setupEventListeners();
    });
  }

  loadOrderData() {
    const savedOrderData = localStorage.getItem('bentalaOrderData');
    if (savedOrderData) {
      this.orderData = JSON.parse(savedOrderData);
    } else {
      // Redirect back to cart if no order data
      window.location.href = 'cart.html';
    }
  }

  // Format number sebagai currency IDR
  formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Render halaman pembayaran
  renderPaymentPage() {
    if (!this.orderData) return;
    
    // Get bank yang dipilih
    const selectedBank = this.orderData.userData.selectedBank || 'bca';
    
    // Update judul halaman
    document.title = `Pembayaran - ${selectedBank.toUpperCase()}`;
    
    // Render informasi bank
    this.renderBankInfo(selectedBank);
    
    // Render ringkasan pesanan
    this.renderOrderSummary();
    
    // Render informasi pelanggan
    this.renderCustomerInfo();
  }

  renderBankInfo(bank) {
    const bankInfoContainer = document.getElementById('bankInfo');
    if (!bankInfoContainer) return;
    
    // Data bank
    const bankData = {
      bca: {
        name: 'Bank Central Asia (BCA)',
        logoUrl: 'img/Logo_bca.png',
        qrUrl: 'img/qr_bca.png', // Placeholder, ganti dengan QR code asli
        accountNumber: '0123456789',
        accountName: 'PT BENTALA FASHION',
        instructions: [
          'Buka aplikasi BCA Mobile di smartphone Anda',
          'Pilih menu "Scan QR"',
          'Arahkan kamera ke kode QR di atas',
          'Periksa detail pembayaran, lalu tap "Lanjutkan"',
          'Masukkan PIN BCA Mobile Anda',
          'Pembayaran selesai, simpan bukti pembayaran'
        ]
      },
      mandiri: {
        name: 'Bank Mandiri',
        logoUrl: 'img/Logo_mandiri.png',
        qrUrl: 'img/qr_mandiri.png', // Placeholder, ganti dengan QR code asli
        accountNumber: '9876543210',
        accountName: 'PT BENTALA FASHION',
        instructions: [
          'Buka aplikasi Livin by Mandiri di smartphone Anda',
          'Pilih menu "QR Pay"',
          'Scan kode QR di atas',
          'Periksa jumlah pembayaran',
          'Tap "Konfirmasi" dan masukkan PIN Anda',
          'Transaksi selesai, simpan bukti pembayaran'
        ]
      },
      jago: {
        name: 'Bank Jago',
        logoUrl: 'img/Logo_jago.png',
        qrUrl: 'img/qr_jago.png', // Placeholder, ganti dengan QR code asli
        accountNumber: '5544332211',
        accountName: 'PT BENTALA FASHION',
        instructions: [
          'Buka aplikasi Jago di smartphone Anda',
          'Pilih menu "Bayar"', 
          'Pilih "Scan QRIS"',
          'Arahkan kamera ke kode QR di atas',
          'Periksa detail transaksi dan jumlah pembayaran',
          'Tap "Bayar" dan konfirmasi dengan PIN Anda',
          'Transaksi berhasil, simpan bukti pembayaran'
        ]
      }
    };
    
    // Bank yang dipilih
    const bankInfo = bankData[bank] || bankData.bca;
    
    // Generate bank info HTML
    bankInfoContainer.innerHTML = `
      <div class="flex items-center mb-6">
        <img src="${bankInfo.logoUrl}" alt="${bankInfo.name}" class="h-12 mr-4">
        <h1 class="text-2xl font-bold">${bankInfo.name}</h1>
      </div>
      
      <div class="flex flex-col md:flex-row gap-8">
        <div class="w-full md:w-1/2">
          <div class="border-2 border-[--hitam] rounded-lg p-6 bg-white mb-6">
            <h2 class="text-xl font-bold mb-4">Informasi Rekening</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="font-medium">Nomor Rekening:</span>
                <span class="font-bold">${bankInfo.accountNumber}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Nama Penerima:</span>
                <span class="font-bold">${bankInfo.accountName}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Total Pembayaran:</span>
                <span class="font-bold text-lg">${this.formatPrice(this.orderData.total)}</span>
              </div>
              <button id="copyAccountBtn" class="w-full mt-2 bg-[--hitam] hover:bg-opacity-80 text-white py-2 rounded-md transition">
                Salin Nomor Rekening
              </button>
            </div>
          </div>
          
          <div class="border-2 border-[--hitam] rounded-lg p-6 bg-white">
            <h2 class="text-xl font-bold mb-4">Petunjuk Pembayaran</h2>
            <ol class="list-decimal pl-5 space-y-2">
              ${bankInfo.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ol>
          </div>
        </div>
        
        <div class="w-full md:w-1/2">
          <div class="border-2 border-[--hitam] rounded-lg p-6 bg-white text-center">
            <h2 class="text-xl font-bold mb-4">Kode QR Pembayaran</h2>
            <div class="flex justify-center my-4">
              <img src="${bankInfo.qrUrl}" alt="QR Code ${bankInfo.name}" class="w-64 h-64 border border-gray-200">
            </div>
            <p class="text-gray-600 text-sm mb-4">Scan kode QR di atas dengan aplikasi ${bankInfo.name}</p>
            <div class="text-left p-4 border border-gray-200 rounded bg-gray-50">
              <h3 class="font-bold text-lg mb-2">Catatan Penting:</h3>
              <ul class="list-disc pl-5 text-sm space-y-1">
                <li>Pesanan Anda akan diproses setelah pembayaran berhasil.</li>
                <li>Pembayaran akan berakhir dalam <span class="font-bold" id="countdown">23:59:59</span></li>
                <li>Harap melakukan pembayaran sesuai dengan jumlah yang tertera.</li>
                <li>Simpan bukti pembayaran Anda sampai pesanan diterima.</li>
              </ul>
            </div>
            <button id="confirmPaymentBtn" class="w-full mt-6 bg-[--ijo] hover:bg-opacity-80 text-white py-3 font-bold rounded-md transition">
              Saya Sudah Bayar
            </button>
            <button id="backToCartBtn" class="w-full mt-3 bg-transparent border border-[--hitam] hover:bg-gray-100 text-[--hitam] py-2 rounded-md transition">
              Kembali ke Keranjang
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Start countdown
    this.startCountdown();
  }

  renderOrderSummary() {
    const orderSummaryContainer = document.getElementById('orderSummary');
    if (!orderSummaryContainer || !this.orderData) return;
    
    const items = this.orderData.items;
    
    let itemsHtml = '';
    items.forEach(item => {
      const totalItemPrice = item.price * item.quantity;
      
      itemsHtml += `
        <div class="flex justify-between items-center py-3 border-b border-gray-200">
          <div class="flex items-center">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
            <div>
              <h3 class="font-bold">${item.name}</h3>
              <p class="text-sm">Size: ${item.size} | Jumlah: ${item.quantity}</p>
            </div>
          </div>
          <span class="font-medium">${this.formatPrice(totalItemPrice)}</span>
        </div>
      `;
    });
    
    orderSummaryContainer.innerHTML = `
      <div class="border-2 border-[--hitam] rounded-lg p-6 bg-white mb-6">
        <h2 class="text-xl font-bold mb-4">Ringkasan Pesanan</h2>
        <div class="max-h-60 overflow-y-auto mb-4">
          ${itemsHtml}
        </div>
        <div class="space-y-2 pt-2">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>${this.formatPrice(this.orderData.subtotal)}</span>
          </div>
          <div class="flex justify-between">
            <span>Pengiriman</span>
            <span>${this.formatPrice(this.orderData.shipping)}</span>
          </div>
          <div class="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>${this.formatPrice(this.orderData.total)}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderCustomerInfo() {
    const customerInfoContainer = document.getElementById('customerInfo');
    if (!customerInfoContainer || !this.orderData) return;
    
    const userData = this.orderData.userData;
    
    customerInfoContainer.innerHTML = `
      <div class="border-2 border-[--hitam] rounded-lg p-6 bg-white">
        <h2 class="text-xl font-bold mb-4">Informasi Pengiriman</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="font-medium">Nama:</span>
            <span>${userData.name}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Telepon:</span>
            <span>${userData.phone}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Alamat:</span>
            <span>${userData.address}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Info Tambahan:</span>
            <span>${userData.additionalInfo || '-'}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Metode Pengiriman:</span>
            <span>${userData.shippingMethod === 'express' ? 'Express' : 'Standard'}</span>
          </div>
        </div>
      </div>
    `;
  }

  startCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    // Set countdown for 24 hours
    let hours = 23;
    let minutes = 59;
    let seconds = 59;
    
    const countdownInterval = setInterval(() => {
      seconds--;
      
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
      
      if (minutes < 0) {
        minutes = 59;
        hours--;
      }
      
      if (hours < 0) {
        clearInterval(countdownInterval);
        alert('Batas waktu pembayaran telah berakhir. Pesanan akan dibatalkan.');
        window.location.href = 'cart.html';
        return;
      }
      
      countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  setupEventListeners() {
    // Copy account number button
    const copyAccountBtn = document.getElementById('copyAccountBtn');
    if (copyAccountBtn) {
      copyAccountBtn.addEventListener('click', () => {
        const accountNumber = copyAccountBtn.previousElementSibling.previousElementSibling.previousElementSibling.querySelector('span:last-child').textContent;
        
        navigator.clipboard.writeText(accountNumber)
          .then(() => {
            const originalText = copyAccountBtn.textContent;
            copyAccountBtn.textContent = 'Berhasil Disalin!';
            copyAccountBtn.classList.add('bg-green-700');
            
            setTimeout(() => {
              copyAccountBtn.textContent = originalText;
              copyAccountBtn.classList.remove('bg-green-700');
            }, 2000);
          })
          .catch(err => {
            console.error('Gagal menyalin: ', err);
            alert('Gagal menyalin nomor rekening. Silakan salin secara manual.');
          });
      });
    }
    
    // Confirm payment button
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    if (confirmPaymentBtn) {
      confirmPaymentBtn.addEventListener('click', () => {
        alert('Terima kasih atas pembayaran Anda! Kami akan segera memproses pesanan Anda dan mengirimkan email konfirmasi.');
        
        // Clear cart and order data
        localStorage.removeItem('bentalaCart');
        localStorage.removeItem('bentalaOrderData');
        
        // Redirect to home
        window.location.href = 'index.html';
      });
    }
    
    // Back to cart button
    const backToCartBtn = document.getElementById('backToCartBtn');
    if (backToCartBtn) {
      backToCartBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
      });
    }
  }
}

// Initialize payment manager
const paymentManager = new PaymentManager();

// Expose to global scope for debugging
window.paymentManager = paymentManager;