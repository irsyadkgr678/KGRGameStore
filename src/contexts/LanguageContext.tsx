import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'id' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Translations object
const translations = {
  id: {
    // Navigation
    'nav.games': 'Game',
    'nav.information': 'Informasi',
    'nav.admin': 'Admin',
    'nav.login': 'Masuk',
    'nav.register': 'Daftar',
    'nav.signOut': 'Keluar',
    
    // Home page
    'home.title': 'KGR GameStore',
    'home.subtitle': 'Temukan game-game menakjubkan dengan harga yang luar biasa. Dari permata indie hingga blockbuster AAA, temukan petualangan gaming berikutnya di sini.',
    'home.browseGames': 'Jelajahi Game',
    'home.filtersActive': 'Filter Aktif',
    'home.showFilters': 'Tampilkan Filter',
    'home.hideFilters': 'Sembunyikan Filter',
    'home.noGamesFound': 'Tidak ada game ditemukan',
    'home.noGamesAvailable': 'Belum ada game tersedia. Periksa kembali nanti!',
    'home.adjustFilters': 'Coba sesuaikan filter Anda untuk menemukan lebih banyak game.',
    'home.clearAllFilters': 'Hapus Semua Filter',
    'home.complaint': 'Komplain',
    'home.complaintDescription': 'Ada masalah dengan pesanan atau layanan kami? Hubungi kami langsung melalui WhatsApp atau Instagram untuk mendapatkan bantuan cepat dan solusi terbaik.',
    'home.chooseContactMethod': 'Pilih Metode Kontak',
    'home.selectPreferredContact': 'Pilih cara yang Anda inginkan untuk menghubungi kami:',
    'home.whatsappDescription': 'Chat langsung untuk respon cepat',
    'home.instagramDescription': 'Kirim pesan melalui DM Instagram',
    'home.needHelp': 'Butuh Bantuan?',
    
    // Game filters
    'filters.searchGames': 'Cari Game',
    'filters.searchPlaceholder': 'Masukkan nama game...',
    'filters.genre': 'Genre',
    'filters.allGenres': 'Semua Genre',
    'filters.sortByName': 'Urutkan berdasarkan Nama',
    'filters.aToZ': 'A ke Z',
    'filters.zToA': 'Z ke A',
    'filters.priceRange': 'Rentang Harga',
    'filters.search': 'Pencarian',
    'filters.maxPrice': 'Harga Maks',
    
    // Game card
    'game.free': 'GRATIS',
    'game.viewDetails': 'Lihat Detail',
    
    // Game detail
    'gameDetail.backToGames': 'Kembali ke Game',
    'gameDetail.buy': 'Beli',
    'gameDetail.availablePlatforms': 'Platform Tersedia',
    'gameDetail.aboutThisGame': 'Tentang Game Ini',
    'gameDetail.systemRequirements': 'Persyaratan Sistem PC',
    'gameDetail.minimumRequirements': 'Persyaratan Minimum',
    'gameDetail.operatingSystem': 'Sistem Operasi',
    'gameDetail.processor': 'Prosesor',
    'gameDetail.memory': 'Memori',
    'gameDetail.graphics': 'Grafis',
    'gameDetail.storage': 'Penyimpanan',
    'gameDetail.gameDetails': 'Detail Game',
    'gameDetail.developer': 'Pengembang',
    'gameDetail.publisher': 'Penerbit',
    'gameDetail.releaseDate': 'Tanggal Rilis',
    'gameDetail.price': 'Harga',
    'gameDetail.discount': 'Diskon',
    'gameDetail.added': 'Ditambahkan',
    'gameDetail.gameNotFound': 'Game Tidak Ditemukan',
    'gameDetail.gameNotFoundDesc': 'Game yang Anda cari tidak ada.',
    
    // Reviews
    'reviews.title': 'Ulasan & Rating',
    'reviews.noReviewsYet': 'Belum ada ulasan',
    'reviews.beFirstToReview': 'Jadilah yang pertama mengulas',
    'reviews.recommended': 'Direkomendasikan',
    'reviews.notRecommended': 'Tidak Direkomendasikan',
    'reviews.basedOnReviews': 'Berdasarkan',
    'reviews.review': 'ulasan',
    'reviews.reviews': 'ulasan',
    'reviews.users': 'pengguna',
    'reviews.yourReview': 'Ulasan Anda:',
    'reviews.edit': 'Edit',
    'reviews.delete': 'Hapus',
    'reviews.writeReview': 'Tulis Ulasan',
    'reviews.signInToReview': 'Masuk untuk menulis ulasan',
    'reviews.signIn': 'Masuk',
    'reviews.editYourReview': 'Edit Ulasan Anda',
    'reviews.writeAReview': 'Tulis Ulasan',
    'reviews.rating': 'Rating',
    'reviews.doYouRecommend': 'Apakah Anda merekomendasikan game ini?',
    'reviews.yesRecommend': 'Ya, saya rekomendasikan',
    'reviews.noRecommend': 'Tidak, saya tidak rekomendasikan',
    'reviews.reviewOptional': 'Ulasan (Opsional)',
    'reviews.shareThoughts': 'Bagikan pendapat Anda tentang game ini...',
    'reviews.saving': 'Menyimpan...',
    'reviews.updateReview': 'Perbarui Ulasan',
    'reviews.submitReview': 'Kirim Ulasan',
    'reviews.cancel': 'Batal',
    'reviews.userReviews': 'Ulasan Pengguna',
    
    // Auth
    'auth.welcomeBack': 'Selamat Datang Kembali di KGR GameStore',
    'auth.joinKGR': 'Bergabung dengan KGR GameStore',
    'auth.signInToContinue': 'Masuk ke akun Anda untuk melanjutkan',
    'auth.joinCommunity': 'Bergabung dengan komunitas gaming kami hari ini',
    'auth.fullName': 'Nama Lengkap',
    'auth.enterFullName': 'Masukkan nama lengkap Anda',
    'auth.emailAddress': 'Alamat Email',
    'auth.enterEmail': 'Masukkan email Anda',
    'auth.password': 'Kata Sandi',
    'auth.enterPassword': 'Masukkan kata sandi Anda',
    'auth.pleaseWait': 'Mohon tunggu...',
    'auth.signIn': 'Masuk',
    'auth.createAccount': 'Buat Akun',
    'auth.dontHaveAccount': 'Belum punya akun?',
    'auth.alreadyHaveAccount': 'Sudah punya akun?',
    'auth.signUp': 'Daftar',
    'auth.accountCreatedSuccess': 'Akun berhasil dibuat! Anda sekarang bisa masuk.',
    
    // Blog
    'blog.title': 'Informasi KGR',
    'blog.subtitle': 'Tetap update dengan berita gaming terbaru, ulasan, dan wawasan dari komunitas kami.',
    'blog.searchInformation': 'Cari informasi...',
    'blog.readMore': 'Baca Selengkapnya',
    'blog.noInformationYet': 'Belum ada informasi',
    'blog.stayTuned': 'Nantikan konten gaming menarik yang akan datang!',
    'blog.noPostsFound': 'Tidak ada postingan ditemukan',
    'blog.tryDifferentSearch': 'Coba kata kunci pencarian yang berbeda untuk menemukan lebih banyak postingan.',
    'blog.loadingInformation': 'Memuat informasi...',
    
    // Admin
    'admin.title': 'Dashboard Admin KGR GameStore',
    'admin.gamesManagement': 'Manajemen Game',
    'admin.informationManagement': 'Manajemen Informasi',
    'admin.games': 'Game',
    'admin.addGame': 'Tambah Game',
    'admin.editGame': 'Edit Game',
    'admin.addNewGame': 'Tambah Game Baru',
    'admin.basicInformation': 'Informasi Dasar',
    'admin.title': 'Judul',
    'admin.genre': 'Genre',
    'admin.developer': 'Pengembang',
    'admin.publisher': 'Penerbit',
    'admin.releaseDate': 'Tanggal Rilis',
    'admin.platforms': 'Platform',
    'admin.descriptions': 'Deskripsi',
    'admin.shortDescription': 'Deskripsi Singkat',
    'admin.shortDescPlaceholder': 'Deskripsi singkat untuk kartu game...',
    'admin.aboutThisGame': 'Tentang Game Ini',
    'admin.aboutGamePlaceholder': 'Deskripsi detail tentang game, fitur, gameplay, dll...',
    'admin.media': 'Media',
    'admin.mainImageURL': 'URL Gambar Utama',
    'admin.trailerURL': 'URL Trailer (YouTube)',
    'admin.screenshots': 'Screenshot (satu URL per baris)',
    'admin.screenshotsHelp': 'Masukkan setiap URL screenshot pada baris baru',
    'admin.systemRequirements': 'Persyaratan Sistem PC Minimum',
    'admin.pricing': 'Harga',
    'admin.priceIDR': 'Harga (IDR)',
    'admin.discountPercent': 'Diskon %',
    'admin.discountAmount': 'Jumlah Diskon',
    'admin.markAsFree': 'Tandai sebagai Game Gratis',
    'admin.create': 'Buat',
    'admin.update': 'Perbarui',
    'admin.cancel': 'Batal',
    'admin.accessDenied': 'Akses Ditolak',
    'admin.noPermission': 'Anda tidak memiliki izin untuk mengakses halaman ini.',
    'admin.noGamesYet': 'Belum ada game',
    'admin.addFirstGame': 'Tambahkan game pertama Anda untuk memulai.',
    'admin.informationPosts': 'Postingan Informasi',
    'admin.addPost': 'Tambah Postingan',
    'admin.editPost': 'Edit Postingan',
    'admin.addNewPost': 'Tambah Postingan Baru',
    'admin.slug': 'Slug (URL)',
    'admin.slugPlaceholder': 'auto-generated-from-title',
    'admin.excerpt': 'Kutipan',
    'admin.excerptPlaceholder': 'Deskripsi singkat postingan...',
    'admin.content': 'Konten',
    'admin.contentPlaceholder': 'Tulis konten postingan informasi Anda di sini...',
    'admin.publishImmediately': 'Publikasikan segera',
    'admin.published': 'Dipublikasikan',
    'admin.draft': 'Draft',
    'admin.created': 'Dibuat',
    'admin.actions': 'Aksi',
    'admin.noInformationPosts': 'Belum ada postingan informasi',
    'admin.createFirstPost': 'Buat postingan informasi pertama Anda untuk memulai.',
    'admin.status': 'Status',
    'admin.trailer': 'Trailer',
    'admin.free': 'Gratis',
    'admin.sale': 'Sale',
    
    // Footer
    'footer.allRightsReserved': 'Semua hak dilindungi.',
    'footer.contactWhatsApp': 'Hubungi kami via WhatsApp: 08972190700',
    'footer.instagram': 'Instagram: @irsyad.kgr',
    
    // Common
    'common.loading': 'Memuat...',
    'common.error': 'Terjadi kesalahan',
    'common.save': 'Simpan',
    'common.delete': 'Hapus',
    'common.edit': 'Edit',
    'common.close': 'Tutup',
    'common.yes': 'Ya',
    'common.no': 'Tidak',
    'common.search': 'Cari',
    'common.filter': 'Filter',
    'common.sort': 'Urutkan',
    'common.price': 'Harga',
    'common.free': 'Gratis',
    'common.discount': 'Diskon',
    'common.off': 'OFF',
  },
  en: {
    // Navigation
    'nav.games': 'Games',
    'nav.information': 'Information',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.signOut': 'Sign Out',
    
    // Home page
    'home.title': 'KGR GameStore',
    'home.subtitle': 'Discover amazing games at incredible prices. From indie gems to AAA blockbusters, find your next gaming adventure here.',
    'home.browseGames': 'Browse Games',
    'home.filtersActive': 'Filters Active',
    'home.showFilters': 'Show Filters',
    'home.hideFilters': 'Hide Filters',
    'home.noGamesFound': 'No games found',
    'home.noGamesAvailable': 'No games available yet. Check back soon!',
    'home.adjustFilters': 'Try adjusting your filters to find more games.',
    'home.clearAllFilters': 'Clear All Filters',
    'home.complaint': 'Report',
    'home.complaintDescription': 'Having issues with your order or our service? Contact us directly via WhatsApp or Instagram for quick assistance and the best solutions.',
    'home.chooseContactMethod': 'Choose Contact Method',
    'home.selectPreferredContact': 'Select your preferred way to contact us:',
    'home.whatsappDescription': 'Direct chat for quick response',
    'home.instagramDescription': 'Send message via Instagram DM',
    'home.needHelp': 'Need Help?',
    
    // Game filters
    'filters.searchGames': 'Search Games',
    'filters.searchPlaceholder': 'Enter game name...',
    'filters.genre': 'Genre',
    'filters.allGenres': 'All Genres',
    'filters.sortByName': 'Sort by Name',
    'filters.aToZ': 'A to Z',
    'filters.zToA': 'Z to A',
    'filters.priceRange': 'Price Range',
    'filters.search': 'Search',
    'filters.maxPrice': 'Max Price',
    
    // Game card
    'game.free': 'FREE',
    'game.viewDetails': 'View Details',
    
    // Game detail
    'gameDetail.backToGames': 'Back to Games',
    'gameDetail.buy': 'Buy',
    'gameDetail.availablePlatforms': 'Available Platforms',
    'gameDetail.aboutThisGame': 'About This Game',
    'gameDetail.systemRequirements': 'PC System Requirements',
    'gameDetail.minimumRequirements': 'Minimum Requirements',
    'gameDetail.operatingSystem': 'Operating System',
    'gameDetail.processor': 'Processor',
    'gameDetail.memory': 'Memory',
    'gameDetail.graphics': 'Graphics',
    'gameDetail.storage': 'Storage',
    'gameDetail.gameDetails': 'Game Details',
    'gameDetail.developer': 'Developer',
    'gameDetail.publisher': 'Publisher',
    'gameDetail.releaseDate': 'Release Date',
    'gameDetail.price': 'Price',
    'gameDetail.discount': 'Discount',
    'gameDetail.added': 'Added',
    'gameDetail.gameNotFound': 'Game Not Found',
    'gameDetail.gameNotFoundDesc': 'The game you\'re looking for doesn\'t exist.',
    
    // Reviews
    'reviews.title': 'Reviews & Ratings',
    'reviews.noReviewsYet': 'No reviews yet',
    'reviews.beFirstToReview': 'Be the first to review',
    'reviews.recommended': 'Recommended',
    'reviews.notRecommended': 'Not Recommended',
    'reviews.basedOnReviews': 'Based on',
    'reviews.review': 'review',
    'reviews.reviews': 'reviews',
    'reviews.users': 'users',
    'reviews.yourReview': 'Your review:',
    'reviews.edit': 'Edit',
    'reviews.delete': 'Delete',
    'reviews.writeReview': 'Write a Review',
    'reviews.signInToReview': 'Sign in to write a review',
    'reviews.signIn': 'Sign In',
    'reviews.editYourReview': 'Edit Your Review',
    'reviews.writeAReview': 'Write a Review',
    'reviews.rating': 'Rating',
    'reviews.doYouRecommend': 'Do you recommend this game?',
    'reviews.yesRecommend': 'Yes, I recommend',
    'reviews.noRecommend': 'No, I don\'t recommend',
    'reviews.reviewOptional': 'Review (Optional)',
    'reviews.shareThoughts': 'Share your thoughts about this game...',
    'reviews.saving': 'Saving...',
    'reviews.updateReview': 'Update Review',
    'reviews.submitReview': 'Submit Review',
    'reviews.cancel': 'Cancel',
    'reviews.userReviews': 'User Reviews',
    
    // Auth
    'auth.welcomeBack': 'Welcome Back to KGR GameStore',
    'auth.joinKGR': 'Join KGR GameStore',
    'auth.signInToContinue': 'Sign in to your account to continue',
    'auth.joinCommunity': 'Join our gaming community today',
    'auth.fullName': 'Full Name',
    'auth.enterFullName': 'Enter your full name',
    'auth.emailAddress': 'Email Address',
    'auth.enterEmail': 'Enter your email',
    'auth.password': 'Password',
    'auth.enterPassword': 'Enter your password',
    'auth.pleaseWait': 'Please wait...',
    'auth.signIn': 'Sign In',
    'auth.createAccount': 'Create Account',
    'auth.dontHaveAccount': 'Don\'t have an account?',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signUp': 'Sign up',
    'auth.accountCreatedSuccess': 'Account created successfully! You can now login.',
    
    // Blog
    'blog.title': 'KGR Information',
    'blog.subtitle': 'Stay updated with the latest gaming news, reviews, and insights from our community.',
    'blog.searchInformation': 'Search information...',
    'blog.readMore': 'Read More',
    'blog.noInformationYet': 'No information yet',
    'blog.stayTuned': 'Stay tuned for exciting gaming content coming soon!',
    'blog.noPostsFound': 'No posts found',
    'blog.tryDifferentSearch': 'Try a different search term to find more posts.',
    'blog.loadingInformation': 'Loading information...',
    
    // Admin
    'admin.title': 'KGR GameStore Admin Dashboard',
    'admin.gamesManagement': 'Games Management',
    'admin.informationManagement': 'Information Management',
    'admin.games': 'Games',
    'admin.addGame': 'Add Game',
    'admin.editGame': 'Edit Game',
    'admin.addNewGame': 'Add New Game',
    'admin.basicInformation': 'Basic Information',
    'admin.title': 'Title',
    'admin.genre': 'Genre',
    'admin.developer': 'Developer',
    'admin.publisher': 'Publisher',
    'admin.releaseDate': 'Release Date',
    'admin.platforms': 'Platforms',
    'admin.descriptions': 'Descriptions',
    'admin.shortDescription': 'Short Description',
    'admin.shortDescPlaceholder': 'Brief description for game cards...',
    'admin.aboutThisGame': 'About This Game',
    'admin.aboutGamePlaceholder': 'Detailed description about the game, features, gameplay, etc...',
    'admin.media': 'Media',
    'admin.mainImageURL': 'Main Image URL',
    'admin.trailerURL': 'Trailer URL (YouTube)',
    'admin.screenshots': 'Screenshots (one URL per line)',
    'admin.screenshotsHelp': 'Enter each screenshot URL on a new line',
    'admin.systemRequirements': 'PC Minimum System Requirements',
    'admin.pricing': 'Pricing',
    'admin.priceIDR': 'Price (IDR)',
    'admin.discountPercent': 'Discount %',
    'admin.discountAmount': 'Discount Amount',
    'admin.markAsFree': 'Mark as Free Game',
    'admin.create': 'Create',
    'admin.update': 'Update',
    'admin.cancel': 'Cancel',
    'admin.accessDenied': 'Access Denied',
    'admin.noPermission': 'You don\'t have permission to access this page.',
    'admin.noGamesYet': 'No games yet',
    'admin.addFirstGame': 'Add your first game to get started.',
    'admin.informationPosts': 'Information Posts',
    'admin.addPost': 'Add Post',
    'admin.editPost': 'Edit Post',
    'admin.addNewPost': 'Add New Post',
    'admin.slug': 'Slug (URL)',
    'admin.slugPlaceholder': 'auto-generated-from-title',
    'admin.excerpt': 'Excerpt',
    'admin.excerptPlaceholder': 'Brief description of the post...',
    'admin.content': 'Content',
    'admin.contentPlaceholder': 'Write your information post content here...',
    'admin.publishImmediately': 'Publish immediately',
    'admin.published': 'Published',
    'admin.draft': 'Draft',
    'admin.created': 'Created',
    'admin.actions': 'Actions',
    'admin.noInformationPosts': 'No information posts yet',
    'admin.createFirstPost': 'Create your first information post to get started.',
    'admin.status': 'Status',
    'admin.trailer': 'Trailer',
    'admin.free': 'Free',
    'admin.sale': 'Sale',
    
    // Footer
    'footer.allRightsReserved': 'All rights reserved.',
    'footer.contactWhatsApp': 'Contact us via WhatsApp: 08972190700',
    'footer.instagram': 'Instagram: @irsyad.kgr',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.price': 'Price',
    'common.free': 'Free',
    'common.discount': 'Discount',
    'common.off': 'OFF',
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id') // Default to Indonesian

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}