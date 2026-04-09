import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import RightSidebar from './RightSidebar';
import './Layout.css';

const Layout = ({ children, showRightSidebar = true, rightSidebarStats = {}, onSearch }) => {
  return (
    <div className="container">
      <Sidebar />
      
      <main className="main-content">
        <Topbar onSearch={onSearch} />
        <div className="page-wrapper">
          {children}
        </div>
      </main>

      {showRightSidebar && <RightSidebar stats={rightSidebarStats} />}
    </div>
  );
};

export default Layout;
