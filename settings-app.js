function SettingsApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('account');

    React.useEffect(() => {
      const user = getCurrentUser();
      if (!user) {
        window.location.href = 'index.html';
        return;
      }
      setCurrentUser(user);
    }, []);

    const navigateHome = () => {
      window.location.href = 'index.html';
    };

    const settingsTabs = [
      { id: 'account', label: 'Account Preferences', icon: 'user' },
      { id: 'security', label: 'Sign In & Security', icon: 'shield' },
      { id: 'privacy', label: 'Data Privacy', icon: 'lock' },
      { id: 'notifications', label: 'Notifications', icon: 'bell' },
      { id: 'help', label: 'Help', icon: 'help-circle' }
    ];

    const renderTabContent = () => {
      switch (activeTab) {
        case 'account':
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Account Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input type="text" defaultValue={currentUser?.objectData.name} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea defaultValue={currentUser?.objectData.bio} className="input-field" rows="3" />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          );
        case 'security':
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Sign In & Security</h2>
              <div className="space-y-4">
                <div className="p-4 border border-[var(--border-color)] rounded-lg">
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-3">Update your password to keep your account secure</p>
                  <button className="btn-secondary">Change Password</button>
                </div>
                <div className="p-4 border border-[var(--border-color)] rounded-lg">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-3">Add an extra layer of security to your account</p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div className="text-center py-12">
              <div className="icon-settings text-4xl text-[var(--text-muted)] mb-4"></div>
              <p className="text-[var(--text-muted)]">Settings for {activeTab} coming soon</p>
            </div>
          );
      }
    };

    if (!currentUser) return null;

    return (
      <div className="min-h-screen bg-[var(--bg-gray)]">
        <header className="navbar">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button onClick={navigateHome} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[var(--primary-color)] rounded flex items-center justify-center">
                  <div className="icon-users text-white text-lg"></div>
                </div>
                <h1 className="text-xl font-bold text-[var(--primary-color)]">ConnectHub</h1>
              </button>
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="card p-4">
              <nav className="space-y-2">
                {settingsTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-[var(--primary-color)] text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`icon-${tab.icon} text-lg`}></div>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="lg:col-span-3 card p-6">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('SettingsApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SettingsApp />);