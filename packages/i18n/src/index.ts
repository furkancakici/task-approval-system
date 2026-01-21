import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        dashboard: 'Dashboard',
        login: 'Login',
        logout: 'Logout',
        tasks: 'Tasks',
        myTasks: 'My Tasks',
        createTask: 'Create Task',
        users: 'Users',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        status: 'Status',
        priority: 'Priority',
        category: 'Category',
        createdAt: 'Created At',
        actions: 'Actions',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
      },
      auth: {
        email: 'Email',
        password: 'Password',
        signIn: 'Sign In',
        invalidCredentials: 'Invalid credentials',
      },
      dashboard: {
        welcome: 'Welcome back, {{name}}!',
        totalUsers: 'Total Users',
        pendingTasks: 'Pending Tasks',
        completedTasks: 'Completed Tasks',
        recentActivity: 'Recent Activity',
      },
      tasks: {
        pendingApprovals: 'Pending Approvals',
        allTasks: 'All Tasks',
        noPendingTasks: 'No pending tasks found.',
        approve: 'Approve',
        reject: 'Reject',
        approveConfirmTitle: 'Please confirm your action',
        approveConfirmMessage: 'Are you sure you want to approve this task? This action cannot be undone.',
        approveSuccess: 'Task approved successfully',
        approveError: 'Failed to approve task',
        rejectSuccess: 'Task rejected successfully',
        rejectError: 'Failed to reject task',
        viewersCannotApprove: 'Viewers cannot approve',
        viewersCannotReject: 'Viewers cannot reject',
        title: 'Title',
        category: 'Category',
        priority: 'Priority',
        createdAt: 'Created At',
        actions: 'Actions',
        status_pending: 'Pending',
        status_approved: 'Approved',
        status_rejected: 'Rejected',
        searchPlaceholder: 'Search by title...',
        filterStatus: 'Filter by status',
        filterPriority: 'Filter by priority',
        clearFilters: 'Clear Filters',
        noTasksFound: 'No tasks found matching your filters.',
        creator: 'Creator',
      }
    }
  },
  tr: {
    translation: {
      common: {
        dashboard: 'Panel',
        login: 'Giriş Yap',
        logout: 'Çıkış Yap',
        tasks: 'Talepler',
        myTasks: 'Taleplerim',
        createTask: 'Talep Oluştur',
        users: 'Kullanıcılar',
        save: 'Kaydet',
        cancel: 'İptal',
        delete: 'Sil',
        edit: 'Düzenle',
        create: 'Oluştur',
        status: 'Durum',
        priority: 'Öncelik',
        category: 'Kategori',
        createdAt: 'Oluşturulma Tarihi',
        actions: 'İşlemler',
        loading: 'Yükleniyor...',
        success: 'Başarılı',
        error: 'Hata',
      },
      auth: {
        email: 'E-posta',
        password: 'Şifre',
        signIn: 'Giriş Yap',
        invalidCredentials: 'Geçersiz bilgiler',
      },
      dashboard: {
        welcome: 'Tekrar hoş geldin, {{name}}!',
        totalUsers: 'Toplam Kullanıcı',
        pendingTasks: 'Bekleyen Talepler',
        completedTasks: 'Tamamlanan Talepler',
        recentActivity: 'Son Aktiviteler',
      },
      tasks: {
        pendingApprovals: 'Onay Bekleyenler',
        allTasks: 'Tüm Talepler',
        noPendingTasks: 'Onay bekleyen talep bulunamadı.',
        approve: 'Onayla',
        reject: 'Reddet',
        approveConfirmTitle: 'Lütfen işlemi onaylayın',
        approveConfirmMessage: 'Bu talebi onaylamak istediğinize emin misiniz? Bu işlem geri alınamaz.',
        approveSuccess: 'Talep başarıyla onaylandı',
        approveError: 'Talep onaylanırken hata oluştu',
        rejectSuccess: 'Talep reddedildi',
        rejectError: 'Talep reddedilirken hata oluştu',
        viewersCannotApprove: 'İzleyiciler onaylayamaz',
        viewersCannotReject: 'İzleyiciler reddedemez',
        title: 'Başlık',
        category: 'Kategori',
        priority: 'Öncelik',
        createdAt: 'Oluşturulma Tarihi',
        actions: 'İşlemler',
        status_pending: 'Bekliyor',
        status_approved: 'Onaylandı',
        status_rejected: 'Reddedildi',
        searchPlaceholder: 'Başlığa göre ara...',
        filterStatus: 'Duruma göre filtrele',
        filterPriority: 'Önceliğe göre filtrele',
        clearFilters: 'Filtreleri Temizle',
        noTasksFound: 'Filtrelere uygun talep bulunamadı.',
        creator: 'Oluşturan',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
