import React from 'react';

const branches = [
  {
    id: 1,
    name: "Vasai Gaon Outlet",
    badge: "Main Branch",
    address: "Johny Cross Lane, Small Carpentry, Garwadi, Tamtalao, Vasai West, Vasai-Virar, Maharashtra 401207.",
    phone: "8766684117",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Angaar+Shawarma+Vasai+Gaon+Johny+Cross+Lane+Tamtalao"
  },
  {
    id: 2,
    name: "Vasai West Outlet",
    badge: "Angaar 2.0",
    address: "Shop No. 3, Gulmohar Apartment, Ambadi Road, Opposite Akshaya Bar and Restaurant, Panchavati, Vasai West, Vasai-Virar, Maharashtra 401202.",
    phone: "8766684117",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Angaar+Shawarma+Gulmohar+Apartment+Ambadi+Road+Vasai+West"
  },
  {
    id: 3,
    name: "Nallasopara Outlet",
    badge: "Popular",
    address: "Shop No. 07, Vrindavan Garden, Near D-Mart, Below One Rep Max Gym, Nallasopara East, Vasai-Virar, Maharashtra 401209.",
    phone: "8766684117",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Angaar+Shawarma+Vrindavan+Garden+Nallasopara+East"
  },
  {
    id: 4,
    name: "Virar Outlet",
    badge: "New Outlet",
    address: "Shop No. 8, Ashoka Building CHSL, Jakat Naka, Bolinj Road, Below Kalpataru Hospital & One Rep Max Gym, Virar West, Vasai-Virar, Maharashtra 401303.",
    phone: "8766684117",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Angaar+Shawarma+Ashoka+Building+Bolinj+Road+Virar+West"
  }
];

const PinIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Location = () => {
  return (
    <section id="location">
      <div className="reveal">
        <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <PinIcon size={14} /> Outlets
        </div>
        <h2 className="section-title">Our Branches</h2>
        <p className="section-sub">Drop by or order from the outlet nearest to you. We are open daily from 5:00 PM – 10:00 PM!</p>
      </div>

      <div className="branches-grid">
        {branches.map((branch) => (
          <div className="branch-card" key={branch.id}>
            <div className="branch-header">
              <h3 className="branch-name">{branch.name}</h3>
              <span className="branch-badge">{branch.badge}</span>
            </div>

            <div className="branch-body">
              <div className="branch-info-row">
                <span className="branch-info-icon" style={{ display: 'flex', alignItems: 'center', alignSelf: 'flex-start', marginTop: '0.2rem' }}>
                  <PinIcon size={16} color="var(--primary)" />
                </span>
                <p className="branch-address">{branch.address}</p>
              </div>

              <div className="branch-info-row">
                <span className="branch-info-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  <ClockIcon size={16} />
                </span>
                <p className="branch-hours">5:00 PM – 10:00 PM <span className="daily-tag">Daily</span></p>
              </div>
            </div>

            <div className="branch-actions">
              <button
                className="branch-action-btn maps-btn"
                onClick={() => window.open(branch.mapsUrl, '_blank')}
              >
                Maps
              </button>
              <button
                onClick={() => window.open(`https://wa.me/${branch.phone}`, '_blank')}
                className="branch-action-btn call-btn"
              >
                Call
              </button>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Location;
