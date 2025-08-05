function MessagesApp() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [conversations] = React.useState([
      {
        id: 1,
        user: { name: 'Akhila' },
        lastMessage: 'Thanks for connecting! Looking forward to collaborating.',
        timestamp: '2h ago',
        unread: 2
      },
      {
        id: 2,
        user: { name: 'Bhanu' },
        lastMessage: 'Great insights on your latest post about self-learning!',
        timestamp: '5h ago',
        unread: 0
      },
      {
        id: 3,
        user: { name: 'Keerthi' },
        lastMessage: 'Would love to discuss the new technology trends.',
        timestamp: '1d ago',
        unread: 1
      }
    ]);

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
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <div className="card">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="text-xl font-semibold">Conversations</h2>
            </div>
            
            <div className="divide-y divide-[var(--border-color)]">
              {conversations.map(conversation => (
                <div key={conversation.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-semibold">
                        {conversation.user.name.charAt(0).toUpperCase()}
                      </div>
                      {conversation.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{conversation.user.name}</h3>
                        <span className="text-xs text-[var(--text-muted)]">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-[var(--text-muted)] truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('MessagesApp error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MessagesApp />);
