class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [posts, setPosts] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [showAuthModal, setShowAuthModal] = React.useState(false);
    const [selectedProfile, setSelectedProfile] = React.useState(null);
    const [showMessageModal, setShowMessageModal] = React.useState(false);
    const [messageRecipient, setMessageRecipient] = React.useState(null);
    const [showFollowerRequests, setShowFollowerRequests] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      initializeApp();
    }, []);

    const initializeApp = async () => {
      try {
        await initializeDatabase();
        const user = getCurrentUser();
        setCurrentUser(user);
        await loadPosts();
        await loadUsers();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadPosts = async () => {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };

    const loadUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };

    const handleLogin = (user) => {
      setCurrentUser(user);
      setShowAuthModal(false);
      loadPosts();
      loadUsers();
    };

    const handleLogout = () => {
      logout();
      setCurrentUser(null);
      setSelectedProfile(null);
    };

    const handleCreatePost = async (content, media) => {
      if (!currentUser) return;
      
      try {
        await createPost(currentUser.objectId, content, media);
        await loadPosts();
      } catch (error) {
        console.error('Failed to create post:', error);
      }
    };

    const handleLikePost = async (postId) => {
      if (!currentUser) return;
      
      try {
        await toggleLike(postId, currentUser.objectId);
        await loadPosts();
      } catch (error) {
        console.error('Failed to like post:', error);
      }
    };

    const handleViewProfile = (user) => {
      setSelectedProfile(user);
    };

    const handleSendMessage = (recipient) => {
      setMessageRecipient(recipient);
      setShowMessageModal(true);
    };

    const handleGoHome = () => {
      setSelectedProfile(null);
      setShowFollowerRequests(false);
    };

    const handleShowFollowerRequests = () => {
      setShowFollowerRequests(true);
      setSelectedProfile(null);
    };

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center" data-name="loading" data-file="app.js">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--text-secondary)]">Loading ConnectHub...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[var(--bg-gray)]" data-name="app" data-file="app.js">
        <Header 
          currentUser={currentUser}
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onViewProfile={handleViewProfile}
          onGoHome={handleGoHome}
          onShowFollowerRequests={handleShowFollowerRequests}
        />
        
        <main className="max-w-6xl mx-auto px-4 py-6">
          {!currentUser ? (
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold mb-4">Welcome to ConnectHub</h1>
              <p className="text-xl text-[var(--text-secondary)] mb-8">
                Connect with professionals, share insights, and grow your network
              </p>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="btn-primary text-lg px-8 py-3"
              >
                Join ConnectHub
              </button>
            </div>
          ) : showFollowerRequests ? (
            <FollowerRequests 
              currentUser={currentUser}
              onBack={handleGoHome}
            />
          ) : selectedProfile ? (
            <ProfileCard 
              user={selectedProfile}
              posts={posts.filter(post => post.objectData.authorId === selectedProfile.objectId)}
              currentUser={currentUser}
              onBack={handleGoHome}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CreatePost onCreatePost={handleCreatePost} />
                <div className="space-y-4">
                  {posts.map(post => (
                    <PostCard 
                      key={post.objectId}
                      post={post}
                      currentUser={currentUser}
                      onLike={handleLikePost}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="card p-4">
                  <h3 className="font-semibold mb-3">Suggested Connections</h3>
                  {users.slice(0, 5).map(user => (
                    <div key={user.objectId} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center text-white font-semibold text-sm">
                          {user.objectData.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.objectData.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{user.objectData.bio}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewProfile(user)}
                        className="text-[var(--primary-color)] text-sm hover:underline"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
          />
        )}

        {showMessageModal && messageRecipient && (
          <MessageModal
            recipient={messageRecipient}
            currentUser={currentUser}
            onClose={() => {
              setShowMessageModal(false);
              setMessageRecipient(null);
            }}
          />
        )}
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);