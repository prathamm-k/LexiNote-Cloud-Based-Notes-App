import React from 'react';

const Header = () => {
  return (
    <header className="main-header">
      <div className="main-header-row">
        <h1 className="main-header-logo">LexiNote</h1>
        <span className="main-header-tagline">Write freely. Access instantly. Think clearly.</span>
      </div>
      <p className="main-header-description">
        LexiNote is a cloud-based note-taking app that lets you write, save, and access your notes seamlessly from any device. Whether you're jotting down quick ideas or organizing detailed thoughts, LexiNote ensures your content is always synced, secure, and accessible online — anytime, anywhere.
      </p>
    </header>
  );
};

export default Header;