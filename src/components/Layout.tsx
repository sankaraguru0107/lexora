import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import './Layout.css';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
