  <div className="daniru-side-nav">
    <button className="daniru-hamburger-menu" onClick={toggleSideNav}>
      ☰
    </button>
    {isSideNavOpen && (
      <div className="daniru-side-nav-content">
        <button className="daniru-close-icon" onClick={toggleSideNav}>
          <img
            src="/Resources/gihanRes/donationRes/cancel.png"
            alt="Close"
          />
        </button>

        <div className="daniru-profile-container">
          <div className="daniru-profile-photo-cover">
            <img
              src="/Resources/gihanRes/donationRes/dp.png"
              alt="Profile"
              className="daniru-profile-photo"
            />
          </div>
          <div className="daniru-profile-info">
            <p className="daniru-donor-name">Daniru Dodangoda</p>
            <p className="daniru-donor-email">daniru@gmail.com</p>
          </div>
        </div>

        <div className="daniru-separator"></div>

        <ul className="daniru-side-nav-links">
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li className="daniru-sign-out">
            <Link to="/sign-out">Sign Out</Link>
          </li>
        </ul>
      </div>
    )}
  </div> 