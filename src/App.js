// src/App.js
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

// --- Mock Data (to be replaced by Supabase) ---
const mockData = {
  user: {
    id: "u1", name: "Alex Doe", bio: "A high school junior passionate about STEM and peer tutoring.",
    grade_level: "11th Grade", school: "Innovation High", subjects_tutoring: ["Algebra", "Chemistry"],
    subjects_learning: ["Calculus"], country: "Canada", languages: ["English", "French"]
  },
  channels: [
    { id: "1", name: "general", description: "General discussion for all users" },
    { id: "2", name: "math-help", description: "Get help with mathematics" },
  ],
  messages: {
    "1": [
      { id: "m1", content: "Welcome to TutorDeck! 👋", author: { id: "sys", name: "System" } },
      { id: "m2", content: "Feel free to ask questions or help others!", author: { id: "sys", name: "System" } },
      { id: "m3", content: "Hey everyone! Glad to be here.", author: { id: "u2", name: "Bob" } },
    ],
    "2": [{ id: "m4", content: "Welcome to the math channel!", author: { id: "sys", name: "System" } }]
  }
};

// --- Authentication Context ---
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = () => {
    setIsAuthenticated(true);
    setUser(mockData.user);
  };
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Main App Component (Router) ---
export default function App() {
  // A simple router state. In a real app, use React Router.
  const [page, setPage] = useState('Home');

  const renderPage = () => {
    switch (page) {
      case 'Chat': return <ChatPage />;
      case 'Community': return <CommunityPage />;
      case 'Profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <AuthProvider>
      <Layout setPage={setPage}>
        {renderPage()}
      </Layout>
    </AuthProvider>
  );
}

// --- Layout Components ---
const Layout = ({ children, setPage }) => (
  <div className="min-h-screen hero-bg-pattern">
    <Header />
    <main className="pb-28 pt-20 px-4 sm:px-6 lg:px-8">{children}</main>
    <BottomNav setPage={setPage} />
  </div>
);

const Header = () => (
  <header className="fixed top-0 left-0 right-0 flex justify-center p-4 z-50">
    <div className="glassmorphism px-4 py-2 rounded-2xl shadow-lg">
      <h1 className="text-xl font-bold tracking-wider text-white">TutorDeck</h1>
    </div>
  </header>
);

const BottomNav = ({ setPage }) => {
  const { isAuthenticated, login } = useAuth();
  const [activePage, setActivePage] = useState("Home");

  const handleNav = (pageName) => {
    setActivePage(pageName);
    setPage(pageName);
  };

  const navItems = isAuthenticated
    ? [{ name: "Home", icon: '🏠' }, { name: "Chat", icon: '💬' }, { name: "Community", icon: '🌍' }, { name: "Profile", icon: '👤' }]
    : [{ name: "Home", icon: '🏠' }];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-sm z-50">
      <div className="glassmorphism flex justify-around items-center p-2 rounded-3xl shadow-2xl">
        {navItems.map(item => (
          <button key={item.name} onClick={() => handleNav(item.name)} className={`flex flex-col items-center text-xs p-2 rounded-2xl transition-all duration-300 ${activePage === item.name ? 'text-white' : 'text-white/70 hover:text-white'}`}>
            <span className="text-2xl mb-1">{item.icon}</span>
            {item.name}
          </button>
        ))}
        {!isAuthenticated && (
          <>
            <button onClick={login} className="cta-gradient font-bold text-sm px-5 py-2.5 rounded-2xl shadow-lg hover:scale-105 transition-transform">Login</button>
            <button onClick={login} className="bg-white/10 font-bold text-sm px-5 py-2.5 rounded-2xl hover:bg-white/20 transition-colors">Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
};

// --- Page Components ---
const HomePage = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="text-center flex flex-col items-center space-y-20 md:space-y-28">
      <section className="mt-12 md:mt-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold gradient-text">Empowering Student Tutors</h1>
        <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">Connecting high school volunteers with middle schoolers and peers worldwide via Schoolhouse.world.</p>
        <div className="mt-8 flex justify-center items-center gap-4">
          <button className="cta-gradient px-8 py-3 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-transform">
            {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
          </button>
          {!isAuthenticated && <button className="glassmorphism px-8 py-3 rounded-2xl font-bold text-white/90 hover:bg-white/20 transition-colors">Learn More</button>}
        </div>
      </section>
      <section className="w-full max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon="🧑‍🏫" value="500+" label="Active Tutors" />
          <StatCard icon="🎓" value="1000+" label="Students Helped" />
          <StatCard icon="🌍" value="50+" label="Countries" />
          <StatCard icon="⏰" value="10k+" label="Hours Volunteered" />
        </div>
      </section>
      <section className="w-full max-w-5xl">
        <h2 className="text-4xl font-bold mb-8 text-white">Why TutorDeck?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <FeatureCard icon="🌐" title="Global Connection" description="Connect with students and tutors from around the world." />
          <FeatureCard icon="🤝" title="Peer-to-Peer Learning" description="Learn from peers who understand your curriculum." />
          <FeatureCard icon="❤️" title="Volunteer Hours" description="Earn certified volunteer hours for your tutoring." />
          <FeatureCard icon="💬" title="Real-time Chat" description="Instant help through our secure, real-time chat." />
        </div>
      </section>
    </div>
  );
};

const ChatPage = () => {
  const [activeChannelId, setActiveChannelId] = useState("1");
  const messages = mockData.messages[activeChannelId] || [];
  const { user } = useAuth();

  return (
    <div className="h-[calc(100vh-10rem)] flex glassmorphism rounded-2xl overflow-hidden">
      <ChatSidebar activeChannelId={activeChannelId} setActiveChannelId={setActiveChannelId} />
      <div className="flex-1 flex flex-col">
        <MessageArea messages={messages} currentUser={user} />
        <MessageInput />
      </div>
    </div>
  );
};

// Placeholder pages
const CommunityPage = () => <div className="glassmorphism rounded-2xl p-8 text-center"><h1 className="text-4xl font-bold">Community Page</h1><p className="text-white/70 mt-2">Coming soon...</p></div>;
const ProfilePage = () => <div className="glassmorphism rounded-2xl p-8 text-center"><h1 className="text-4xl font-bold">Profile Page</h1><p className="text-white/70 mt-2">Coming soon...</p></div>;


// --- Reusable & Child Components ---
const StatCard = ({ icon, value, label }) => (
  <div className="glassmorphism p-4 rounded-2xl text-center transform hover:-translate-y-1 transition-transform duration-300">
    <span className="text-4xl">{icon}</span>
    <div className="text-3xl font-bold mt-2 text-white">{value}</div>
    <div className="text-sm text-white/70">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="glassmorphism p-6 rounded-2xl text-center transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
    <span className="text-4xl">{icon}</span>
    <h3 className="text-xl font-bold mt-4 text-white">{title}</h3>
    <p className="text-sm text-white/70 mt-2">{description}</p>
  </div>
);

const ChatSidebar = ({ activeChannelId, setActiveChannelId }) => (
  <div className="w-1/3 md:w-1/4 border-r border-white/20 p-4">
    <h2 className="text-lg font-bold mb-4">Channels</h2>
    <ul>
      {mockData.channels.map(channel => (
        <li key={channel.id}>
          <button
            onClick={() => setActiveChannelId(channel.id)}
            className={`w-full text-left p-2 rounded-lg ${activeChannelId === channel.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
          >
            # {channel.name}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const MessageArea = ({ messages, currentUser }) => {
  const endOfMessagesRef = useRef(null);
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map(msg => (
        <div key={msg.id} className={`flex items-end gap-2 mb-4 ${msg.author.id === currentUser?.id ? 'justify-end' : ''}`}>
          {msg.author.id !== currentUser?.id && (
            <div className="w-8 h-8 avatar-gradient rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              {msg.author.name.charAt(0)}
            </div>
          )}
          <div className={`max-w-xs p-3 rounded-2xl ${msg.author.id === currentUser?.id ? 'bg-blue-600 rounded-br-none' : 'glassmorphism rounded-bl-none'}`}>
            <p className="text-sm">{msg.content}</p>
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

const MessageInput = () => (
  <div className="p-4">
    <div className="glassmorphism flex items-center p-1 rounded-2xl">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 bg-transparent outline-none px-3 py-2"
      />
      <button className="cta-gradient p-2 rounded-xl text-white font-bold">Send</button>
    </div>
  </div>
);
