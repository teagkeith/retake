
interface AppLayoutProps {
  activeTab: 'overview' | 'roster' | 'teams';
  onTabChange: (tab: 'overview' | 'roster' | 'teams') => void;
  children: React.ReactNode;
}

function AppLayout({ children, activeTab, onTabChange }: AppLayoutProps) {
  const tabs: AppLayoutProps['activeTab'][] = ['overview', 'roster', 'teams'];

  return (
    <div className="appLayout">
      <aside className="sidebar">
        <hgroup className="sidebarBrand">
          <h2>rotate.</h2>
          <p>FANTASY ESPORTS</p>
        </hgroup>
        <nav className="mainNav">
          {tabs.map((tab) => {
            const isActiveTab = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`sidebar-button ${isActiveTab ? 'active' : ''}`}
                aria-current={isActiveTab ? 'page' : undefined}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="mainContent">{children}</main>
    </div>
  );
}

export default AppLayout;
