import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/SystemSettings.css';

const SystemSettings = () => {
  const navigate = useNavigate();

  // System settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: 'FitX Fitness Platform',
      siteDescription: 'Your ultimate fitness companion for achieving health goals',
      timezone: 'UTC',
      language: 'English',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      maxUsersPerAccount: 1000,
      sessionTimeout: 60
    },
    security: {
      passwordMinLength: 8,
      requireStrongPassword: true,
      twoFactorEnabled: false,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      sessionSecurity: 'standard',
      encryptionLevel: 'AES-256',
      auditLogging: true,
      ipWhitelist: []
    },
    email: {
      smtpServer: 'smtp.fitx.com',
      smtpPort: 587,
      smtpUsername: 'admin@fitx.com',
      smtpPassword: '••••••••',
      fromEmail: 'noreply@fitx.com',
      fromName: 'FitX Fitness',
      emailEnabled: true,
      emailTemplates: true
    },
    storage: {
      maxFileSize: 10, // MB
      allowedFileTypes: ['jpg', 'png', 'gif', 'mp4', 'pdf'],
      videoStorageLimit: 1000, // GB
      imageStorageLimit: 500, // GB
      backupFrequency: 'daily',
      backupRetention: 30, // days
      cdnEnabled: true,
      compressionEnabled: true
    },
    api: {
      rateLimit: 1000, // requests per hour
      apiVersioning: true,
      corsEnabled: true,
      allowedOrigins: ['https://fitx.com', 'https://app.fitx.com'],
      webhooksEnabled: true,
      apiLogging: true
    },
    notifications: {
      pushNotificationsEnabled: true,
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false,
      workoutReminders: true,
      systemAlerts: true,
      marketingEmails: false,
      notificationFrequency: 'immediate'
    },
    analytics: {
      trackingEnabled: true,
      anonymizeData: true,
      dataRetention: 365, // days
      exportEnabled: true,
      reportFrequency: 'weekly',
      googleAnalyticsId: '',
      customEvents: true
    },
    integrations: {
      paymentGateway: 'stripe',
      socialLoginGoogle: true,
      socialLoginFacebook: true,
      socialLoginApple: false,
      fitnessTrackers: ['fitbit', 'garmin', 'apple-health'],
      thirdPartyApis: true
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetCategory, setResetCategory] = useState('');

  // Handle setting changes
  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  // Save settings
  const handleSaveSettings = () => {
    // In real app, this would make an API call
    console.log('Saving settings:', settings);
    setHasChanges(false);
    setShowSaveModal(false);
    alert('Settings saved successfully!');
  };

  // Reset settings to defaults
  const handleResetSettings = (category) => {
    setResetCategory(category);
    setShowResetModal(true);
  };

  const confirmReset = () => {
    // Reset logic would go here with default values
    console.log(`Resetting ${resetCategory} settings`);
    setHasChanges(true);
    setShowResetModal(false);
    alert(`${resetCategory} settings reset to defaults!`);
  };

  // Export settings
  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fitx-settings-backup.json';
    link.click();
  };

  // Import settings
  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          setHasChanges(true);
          alert('Settings imported successfully!');
        } catch (error) {
          alert('Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️', description: 'Basic platform settings' },
    { id: 'security', name: 'Security', icon: '🔒', description: 'Security and authentication' },
    { id: 'email', name: 'Email', icon: '📧', description: 'Email configuration' },
    { id: 'storage', name: 'Storage', icon: '💾', description: 'File and data storage' },
    { id: 'api', name: 'API', icon: '🔌', description: 'API and integration settings' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', description: 'Notification preferences' },
    { id: 'analytics', name: 'Analytics', icon: '📊', description: 'Data tracking and analytics' },
    { id: 'integrations', name: 'Integrations', icon: '🔗', description: 'Third-party integrations' }
  ];

  return (
    <div className="system-settings">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <button onClick={() => navigate('/admin')} className="back-button">
            ← Back to Dashboard
          </button>
          <h1>System Settings</h1>
          <p>Configure and manage platform settings</p>
        </div>
        
        <div className="header-actions">
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            style={{ display: 'none' }}
            id="import-settings"
          />
          <label htmlFor="import-settings" className="import-btn">
            📥 Import Settings
          </label>
          <button className="export-btn" onClick={handleExportSettings}>
            📤 Export Settings
          </button>
          {hasChanges && (
            <button className="save-btn" onClick={() => setShowSaveModal(true)}>
              💾 Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="settings-layout">
        {/* Settings Navigation */}
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="nav-icon">{tab.icon}</div>
                <div className="nav-content">
                  <div className="nav-label">{tab.name}</div>
                  <div className="nav-description">{tab.description}</div>
                </div>
              </button>
            ))}
          </nav>
        </aside>

        {/* Settings Content */}
        <main className="settings-content">
          {activeTab === 'general' && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>⚙️ General Settings</h2>
                  <p>Basic platform configuration and preferences</p>
                </div>
                <button 
                  className="reset-btn"
                  onClick={() => handleResetSettings('general')}
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-card">
                  <h3>Platform Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Site Name</label>
                      <input
                        type="text"
                        value={settings.general.siteName}
                        onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                        placeholder="Enter site name"
                      />
                    </div>

                    <div className="form-group">
                      <label>Default Language</label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Timezone</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.general.sessionTimeout}
                        onChange={(e) => handleSettingChange('general', 'sessionTimeout', parseInt(e.target.value))}
                        min="5"  
                        max="480"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Site Description</label>
                    <textarea
                      value={settings.general.siteDescription}
                      onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                      rows="3"
                      placeholder="Describe your platform"
                    />
                  </div>
                </div>

                <div className="setting-card">
                  <h3>Access Control</h3>
                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Maintenance Mode</label>
                        <span className="toggle-description">
                          Temporarily disable user access for maintenance
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.general.maintenanceMode}
                          onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                          id="maintenanceMode"
                        />
                        <label htmlFor="maintenanceMode" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>User Registration</label>
                        <span className="toggle-description">
                          Allow new users to register for accounts
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.general.registrationEnabled}
                          onChange={(e) => handleSettingChange('general', 'registrationEnabled', e.target.checked)}
                          id="registrationEnabled"
                        />
                        <label htmlFor="registrationEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Email Verification</label>
                        <span className="toggle-description">
                          Require email verification for new accounts
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.general.emailVerificationRequired}
                          onChange={(e) => handleSettingChange('general', 'emailVerificationRequired', e.target.checked)}
                          id="emailVerificationRequired"
                        />
                        <label htmlFor="emailVerificationRequired" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>🔒 Security Settings</h2>
                  <p>Authentication and security configuration</p>
                </div>
                <button 
                  className="reset-btn"
                  onClick={() => handleResetSettings('security')}
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-card">
                  <h3>Password Policy</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Minimum Password Length</label>
                      <input
                        type="number"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
                        min="6"
                        max="20"
                      />
                    </div>

                    <div className="form-group">
                      <label>Encryption Level</label>
                      <select
                        value={settings.security.encryptionLevel}
                        onChange={(e) => handleSettingChange('security', 'encryptionLevel', e.target.value)}
                      >
                        <option value="AES-128">AES-128</option>
                        <option value="AES-256">AES-256</option>
                        <option value="RSA-2048">RSA-2048</option>
                      </select>
                    </div>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Strong Password Required</label>
                        <span className="toggle-description">
                          Require uppercase, lowercase, numbers, and symbols
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.security.requireStrongPassword}
                          onChange={(e) => handleSettingChange('security', 'requireStrongPassword', e.target.checked)}
                          id="requireStrongPassword"
                        />
                        <label htmlFor="requireStrongPassword" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Two-Factor Authentication</label>
                        <span className="toggle-description">
                          Require 2FA for admin accounts
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.security.twoFactorEnabled}
                          onChange={(e) => handleSettingChange('security', 'twoFactorEnabled', e.target.checked)}
                          id="twoFactorEnabled"
                        />
                        <label htmlFor="twoFactorEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Audit Logging</label>
                        <span className="toggle-description">
                          Log all administrative actions
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.security.auditLogging}
                          onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                          id="auditLogging"
                        />
                        <label htmlFor="auditLogging" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setting-card">
                  <h3>Access Control</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Max Login Attempts</label>
                      <input
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                        min="3"
                        max="10"
                      />
                    </div>

                    <div className="form-group">
                      <label>Lockout Duration (minutes)</label>
                      <input
                        type="number"
                        value={settings.security.lockoutDuration}
                        onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
                        min="5"
                        max="1440"
                      />
                    </div>

                    <div className="form-group">
                      <label>Session Security Level</label>
                      <select
                        value={settings.security.sessionSecurity}
                        onChange={(e) => handleSettingChange('security', 'sessionSecurity', e.target.value)}
                      >
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="high">High</option>
                        <option value="maximum">Maximum</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>📧 Email Settings</h2>
                  <p>Email server and notification configuration</p>
                </div>
                <button 
                  className="reset-btn"
                  onClick={() => handleResetSettings('email')}
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-card">
                  <h3>SMTP Configuration</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>SMTP Server</label>
                      <input
                        type="text"
                        value={settings.email.smtpServer}
                        onChange={(e) => handleSettingChange('email', 'smtpServer', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>SMTP Port</label>
                      <input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                        min="25"
                        max="65535"
                      />
                    </div>

                    <div className="form-group">
                      <label>SMTP Username</label>
                      <input
                        type="email"
                        value={settings.email.smtpUsername}
                        onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>From Email</label>
                      <input
                        type="email"
                        value={settings.email.fromEmail}
                        onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                        placeholder="noreply@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label>From Name</label>
                      <input
                        type="text"
                        value={settings.email.fromName}
                        onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                        placeholder="FitX Fitness"
                      />
                    </div>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Email System Enabled</label>
                        <span className="toggle-description">
                          Enable or disable all email functionality
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.email.emailEnabled}
                          onChange={(e) => handleSettingChange('email', 'emailEnabled', e.target.checked)}
                          id="emailEnabled"
                        />
                        <label htmlFor="emailEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Email Templates</label>
                        <span className="toggle-description">
                          Use custom email templates for notifications
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.email.emailTemplates}
                          onChange={(e) => handleSettingChange('email', 'emailTemplates', e.target.checked)}
                          id="emailTemplates"
                        />
                        <label htmlFor="emailTemplates" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>💾 Storage Settings</h2>
                  <p>File upload and storage configuration</p>
                </div>
                <button 
                  className="reset-btn"
                  onClick={() => handleResetSettings('storage')}
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-card">
                  <h3>File Upload Settings</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Max File Size (MB)</label>
                      <input
                        type="number"
                        value={settings.storage.maxFileSize}
                        onChange={(e) => handleSettingChange('storage', 'maxFileSize', parseInt(e.target.value))}
                        min="1"
                        max="100"
                      />
                    </div>

                    <div className="form-group">
                      <label>Video Storage Limit (GB)</label>
                      <input
                        type="number"
                        value={settings.storage.videoStorageLimit}
                        onChange={(e) => handleSettingChange('storage', 'videoStorageLimit', parseInt(e.target.value))}
                        min="100"
                        max="10000"
                      />
                    </div>

                    <div className="form-group">
                      <label>Image Storage Limit (GB)</label>
                      <input
                        type="number"
                        value={settings.storage.imageStorageLimit}
                        onChange={(e) => handleSettingChange('storage', 'imageStorageLimit', parseInt(e.target.value))}
                        min="50"
                        max="5000"
                      />
                    </div>

                    <div className="form-group">
                      <label>Backup Frequency</label>
                      <select
                        value={settings.storage.backupFrequency}
                        onChange={(e) => handleSettingChange('storage', 'backupFrequency', e.target.value)}
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Backup Retention (days)</label>
                      <input
                        type="number"
                        value={settings.storage.backupRetention}
                        onChange={(e) => handleSettingChange('storage', 'backupRetention', parseInt(e.target.value))}
                        min="7"
                        max="365"  
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Allowed File Types</label>
                    <div className="file-types">
                      {['jpg', 'png', 'gif', 'mp4', 'pdf', 'doc', 'txt'].map(type => (
                        <div key={type} className="file-type-item">
                          <input
                            type="checkbox"
                            id={type}
                            checked={settings.storage.allowedFileTypes.includes(type)}
                            onChange={(e) => {
                              const currentTypes = settings.storage.allowedFileTypes;
                              const updatedTypes = e.target.checked
                                ? [...currentTypes, type]
                                : currentTypes.filter(t => t !== type);
                              handleSettingChange('storage', 'allowedFileTypes', updatedTypes);
                            }}
                          />
                          <label htmlFor={type}>.{type}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>CDN Enabled</label>
                        <span className="toggle-description">
                          Use Content Delivery Network for faster loading
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.storage.cdnEnabled}
                          onChange={(e) => handleSettingChange('storage', 'cdnEnabled', e.target.checked)}
                          id="cdnEnabled"
                        />
                        <label htmlFor="cdnEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Image Compression</label>
                        <span className="toggle-description">
                          Automatically compress uploaded images
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.storage.compressionEnabled}
                          onChange={(e) => handleSettingChange('storage', 'compressionEnabled', e.target.checked)}
                          id="compressionEnabled"
                        />
                        <label htmlFor="compressionEnabled" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>🔌 API Settings</h2>
                  <p>API configuration and rate limiting</p>
                </div>
                <button 
                  className="reset-btn"
                  onClick={() => handleResetSettings('api')}
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-card">
                  <h3>API Configuration</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Rate Limit (requests/hour)</label>
                      <input
                        type="number"
                        value={settings.api.rateLimit}
                        onChange={(e) => handleSettingChange('api', 'rateLimit', parseInt(e.target.value))}
                        min="100"
                        max="10000"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Allowed Origins (CORS)</label>
                    <div className="origins-list">
                      {settings.api.allowedOrigins.map((origin, index) => (
                        <div key={index} className="origin-item">
                          <input
                            type="text"
                            value={origin}
                            onChange={(e) => {
                              const newOrigins = [...settings.api.allowedOrigins];
                              newOrigins[index] = e.target.value;
                              handleSettingChange('api', 'allowedOrigins', newOrigins);
                            }}
                            placeholder="https://example.com"
                          />
                          <button 
                            className="remove-origin"
                            onClick={() => {
                              const newOrigins = settings.api.allowedOrigins.filter((_, i) => i !== index);
                              handleSettingChange('api', 'allowedOrigins', newOrigins);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button 
                        className="add-origin"
                        onClick={() => {
                          const newOrigins = [...settings.api.allowedOrigins, ''];
                          handleSettingChange('api', 'allowedOrigins', newOrigins);
                        }}
                      >
                        + Add Origin
                      </button>
                    </div>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>API Versioning</label>
                        <span className="toggle-description">
                          Enable API version management
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.api.apiVersioning}
                          onChange={(e) => handleSettingChange('api', 'apiVersioning', e.target.checked)}
                          id="apiVersioning"
                        />
                        <label htmlFor="apiVersioning" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>CORS Enabled</label>
                        <span className="toggle-description">
                          Allow cross-origin resource sharing
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.api.corsEnabled}
                          onChange={(e) => handleSettingChange('api', 'corsEnabled', e.target.checked)}
                          id="corsEnabled"
                        />
                        <label htmlFor="corsEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Webhooks</label>
                        <span className="toggle-description">
                          Enable webhook functionality
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.api.webhooksEnabled}
                          onChange={(e) => handleSettingChange('api', 'webhooksEnabled', e.target.checked)}
                          id="webhooksEnabled"
                        />
                        <label htmlFor="webhooksEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>API Logging</label>
                        <span className="toggle-description">
                          Log all API requests and responses
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.api.apiLogging}
                          onChange={(e) => handleSettingChange('api', 'apiLogging', e.target.checked)}
                          id="apiLogging"
                        />
                        <label htmlFor="apiLogging" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>🔔 Notification Settings</h2>
                  <p>Configure notification preferences and delivery</p>
                </div>
                <button 
                  className="reset-btn"
                  onClick={() => handleResetSettings('notifications')}
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-card">
                  <h3>Notification Channels</h3>
                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Push Notifications</label>
                        <span className="toggle-description">
                          Send push notifications to mobile devices
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.pushNotificationsEnabled}
                          onChange={(e) => handleSettingChange('notifications', 'pushNotificationsEnabled', e.target.checked)}
                          id="pushNotificationsEnabled"
                        />
                        <label htmlFor="pushNotificationsEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Email Notifications</label>
                        <span className="toggle-description">
                          Send notifications via email
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotificationsEnabled}
                          onChange={(e) => handleSettingChange('notifications', 'emailNotificationsEnabled', e.target.checked)}
                          id="emailNotificationsEnabled"
                        />
                        <label htmlFor="emailNotificationsEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>SMS Notifications</label>
                        <span className="toggle-description">
                          Send notifications via SMS
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.smsNotificationsEnabled}
                          onChange={(e) => handleSettingChange('notifications', 'smsNotificationsEnabled', e.target.checked)}
                          id="smsNotificationsEnabled"
                        />
                        <label htmlFor="smsNotificationsEnabled" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setting-card">
                  <h3>Notification Types</h3>
                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Workout Reminders</label>
                        <span className="toggle-description">
                          Remind users about scheduled workouts
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.workoutReminders}
                          onChange={(e) => handleSettingChange('notifications', 'workoutReminders', e.target.checked)}
                          id="workoutReminders"
                        />
                        <label htmlFor="workoutReminders" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>System Alerts</label>
                        <span className="toggle-description">
                          Important system and security notifications
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.systemAlerts}
                          onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                          id="systemAlerts"
                        />
                        <label htmlFor="systemAlerts" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Marketing Emails</label>
                        <span className="toggle-description">
                          Promotional and marketing communications
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.notifications.marketingEmails}
                          onChange={(e) => handleSettingChange('notifications', 'marketingEmails', e.target.checked)}
                          id="marketingEmails"
                        />
                        <label htmlFor="marketingEmails" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Notification Frequency</label>
                    <select
                      value={settings.notifications.notificationFrequency}
                      onChange={(e) => handleSettingChange('notifications', 'notificationFrequency', e.target.value)}
                    >
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly Digest</option>
                      <option value="daily">Daily Digest</option>
                      <option value="weekly">Weekly Digest</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>📊 Analytics Settings</h2>
                  <p>Data tracking and analytics configuration</p>
                </div>
                <button 
                  className="reset-btn"
                  onClick={() => handleResetSettings('analytics')}
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-card">
                  <h3>Data Collection</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Data Retention (days)</label>
                      <input
                        type="number"
                        value={settings.analytics.dataRetention}
                        onChange={(e) => handleSettingChange('analytics', 'dataRetention', parseInt(e.target.value))}
                        min="30"
                        max="2555"
                      />
                    </div>

                    <div className="form-group">
                      <label>Report Frequency</label>
                      <select
                        value={settings.analytics.reportFrequency}
                        onChange={(e) => handleSettingChange('analytics', 'reportFrequency', e.target.value)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Google Analytics ID</label>
                      <input
                        type="text"
                        value={settings.analytics.googleAnalyticsId}
                        onChange={(e) => handleSettingChange('analytics', 'googleAnalyticsId', e.target.value)}
                        placeholder="GA-XXXXXXXXX-X"
                      />
                    </div>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Analytics Tracking</label>
                        <span className="toggle-description">
                          Enable user behavior tracking
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.analytics.trackingEnabled}
                          onChange={(e) => handleSettingChange('analytics', 'trackingEnabled', e.target.checked)}
                          id="trackingEnabled"
                        />
                        <label htmlFor="trackingEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Anonymize Data</label>
                        <span className="toggle-description">
                          Remove personally identifiable information
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.analytics.anonymizeData}
                          onChange={(e) => handleSettingChange('analytics', 'anonymizeData', e.target.checked)}
                          id="anonymizeData"
                        />
                        <label htmlFor="anonymizeData" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Data Export</label>
                        <span className="toggle-description">
                          Allow users to export their data
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.analytics.exportEnabled}
                          onChange={(e) => handleSettingChange('analytics', 'exportEnabled', e.target.checked)}
                          id="exportEnabled"
                        />
                        <label htmlFor="exportEnabled" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Custom Events</label>
                        <span className="toggle-description">
                          Track custom user interactions
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.analytics.customEvents}
                          onChange={(e) => handleSettingChange('analytics', 'customEvents', e.target.checked)}
                          id="customEvents"
                        />
                        <label htmlFor="customEvents" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="settings-section">
              <div className="section-header">
                <div className="section-title">
                  <h2>🔗 Integration Settings</h2>
                  <p>Third-party service integrations</p>
                </div>
                <button 
                  className="reset-btn"
                  onClick={() => handleResetSettings('integrations')}
                >
                  Reset to Defaults
                </button>
              </div>

              <div className="settings-form">
                <div className="setting-card">
                  <h3>Payment & Authentication</h3>
                  <div className="form-group">
                    <label>Payment Gateway</label>
                    <select
                      value={settings.integrations.paymentGateway}
                      onChange={(e) => handleSettingChange('integrations', 'paymentGateway', e.target.value)}
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="square">Square</option>
                      <option value="braintree">Braintree</option>
                    </select>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Google Login</label>
                        <span className="toggle-description">
                          Allow users to sign in with Google
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.integrations.socialLoginGoogle}
                          onChange={(e) => handleSettingChange('integrations', 'socialLoginGoogle', e.target.checked)}
                          id="socialLoginGoogle"
                        />
                        <label htmlFor="socialLoginGoogle" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Facebook Login</label>
                        <span className="toggle-description">
                          Allow users to sign in with Facebook
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.integrations.socialLoginFacebook}
                          onChange={(e) => handleSettingChange('integrations', 'socialLoginFacebook', e.target.checked)}
                          id="socialLoginFacebook"
                        />
                        <label htmlFor="socialLoginFacebook" className="toggle-slider"></label>
                      </div>
                    </div>

                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Apple Login</label>
                        <span className="toggle-description">
                          Allow users to sign in with Apple ID
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.integrations.socialLoginApple}
                          onChange={(e) => handleSettingChange('integrations', 'socialLoginApple', e.target.checked)}
                          id="socialLoginApple"
                        />
                        <label htmlFor="socialLoginApple" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setting-card">
                  <h3>Fitness Integrations</h3>
                  <div className="form-group full-width">
                    <label>Supported Fitness Trackers</label>
                    <div className="tracker-list">
                      {['fitbit', 'garmin', 'apple-health', 'samsung-health', 'google-fit'].map(tracker => (
                        <div key={tracker} className="tracker-item">
                          <input
                            type="checkbox"
                            id={tracker}
                            checked={settings.integrations.fitnessTrackers.includes(tracker)}
                            onChange={(e) => {
                              const currentTrackers = settings.integrations.fitnessTrackers;
                              const updatedTrackers = e.target.checked
                                ? [...currentTrackers, tracker]
                                : currentTrackers.filter(t => t !== tracker);
                              handleSettingChange('integrations', 'fitnessTrackers', updatedTrackers);
                            }}
                          />
                          <label htmlFor={tracker} className="tracker-label">
                            {tracker.charAt(0).toUpperCase() + tracker.slice(1).replace('-', ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-item">
                      <div className="toggle-info">
                        <label>Third-Party APIs</label>
                        <span className="toggle-description">
                          Enable third-party API integrations
                        </span>
                      </div>
                      <div className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={settings.integrations.thirdPartyApis}
                          onChange={(e) => handleSettingChange('integrations', 'thirdPartyApis', e.target.checked)}
                          id="thirdPartyApis"
                        />
                        <label htmlFor="thirdPartyApis" className="toggle-slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Save Settings</h3>
              <button onClick={() => setShowSaveModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="save-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-content">
                  <h4>Confirm Settings Update</h4>
                  <p>Are you sure you want to save all changes? This will update the system configuration and may affect all users.</p>
                  <div className="warning-note">
                    Make sure to test these changes in a staging environment first.
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowSaveModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleSaveSettings} className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Reset Settings</h3>
              <button onClick={() => setShowResetModal(false)} className="close-btn">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="reset-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-content">
                  <h4>Reset {resetCategory} Settings</h4>
                  <p>Are you sure you want to reset {resetCategory} settings to their default values? This action cannot be undone.</p>
                  <div className="warning-note">
                    All custom configurations in this category will be lost.
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowResetModal(false)} className="btn-cancel">
                Cancel
              </button>
              <button onClick={confirmReset} className="btn-danger">
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;