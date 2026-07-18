import React, { useState, useEffect } from 'react';
import { getReviews as fetchReviewsAPI, postReview as postReviewAPI } from '../api/reviewsApi';

const MAX_LIMIT = 12;

const initialReviews = [
  { id: 1, name: "Aryan", text: "The special loaded roll is insane! Best shawarma in town 🔥", rating: 5, color: "#fff4b8", rotate: -3 },
  { id: 2, name: "Rohan", text: "Tandoori shawarma hits the spot every single time. Incredible smoky flavor.", rating: 5, color: "#ffd4b8", rotate: 2.5 },
  { id: 3, name: "Priya", text: "Extremely clean place and the garlic Toum sauce is perfect! 10/10", rating: 5, color: "#fec4d2", rotate: -2 },
  { id: 4, name: "Kabir", text: "Veg shawarma paneer was so soft, hummus is authentic.", rating: 4, color: "#cbf1c4", rotate: 4 },
  { id: 5, name: "Sneha", text: "A bit spicy but absolutely delicious! Definitely ordering again.", rating: 5, color: "#d9e2ff", rotate: -3.5 },
  { id: 6, name: "Vikram", text: "Virgin Mojito + Tandoori Roll is the ultimate combo. Fire! 🌯🍹", rating: 5, color: "#ffd6e8", rotate: 3 },
];

const stickyColors = ["#fff4b8", "#ffd4b8", "#fec4d2", "#cbf1c4", "#d9e2ff", "#ffd6e8"];

// SVG Icons (retaining fire emoji as requested)
const PinIcon = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BoardPinIcon = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    style={{ display: 'inline-block', verticalAlign: 'middle', color: '#ff4444' }}
  >
    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
  </svg>
);

const ClipboardIcon = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}
  >
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const BackIcon = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// BSON estimation helper
const estimateBSONSize = (review) => {
  let size = 12 + 16 + 16 + 5; 
  size += 7 + (review.name ? review.name.length : 0);
  size += 7 + (review.text ? review.text.length : 0);
  size += 8 + (review.color ? review.color.length : 0);
  return size;
};

const ATLAS_LIMIT_BYTES = 512 * 1024 * 1024; // 512 MB
const AVAILABLE_LIMIT_BYTES = Math.floor(ATLAS_LIMIT_BYTES * 0.9); // 460.8 MB (leave 10% free)

const chunkReviews = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const ReviewsBoard = ({ isFullScreen = false, onBackToHome, onSeeAll }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [allReviews, setAllReviews] = useState(initialReviews);

  // Load reviews from backend on mount, fall back to localStorage
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchReviewsAPI();
        if (res.success && res.data && res.data.length > 0) {
          const adapted = res.data.map(r => ({
            id: r._id,
            name: r.name,
            text: r.text,
            rating: r.rating,
            color: r.color || stickyColors[Math.floor(Math.random() * stickyColors.length)],
            rotate: r.rotate || (Math.random() * 10 - 5),
          }));
          setAllReviews(adapted);
          setReviews(adapted.slice(0, MAX_LIMIT));
          return;
        }
      } catch (_) {}
      // fallback: localStorage
      const stored = localStorage.getItem('angaar_reviews');
      if (stored) {
        try { setReviews(JSON.parse(stored)); } catch (_) {}
      }
      const allStored = localStorage.getItem('angaar_all_reviews');
      if (allStored) {
        try { setAllReviews(JSON.parse(allStored)); } catch (_) {}
      }
    };
    load();
  }, []);

  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [chosenColor, setChosenColor] = useState(stickyColors[0]);

  // Simulated capacity offset in bytes (for demonstration of Atlas 90% limit)
  const [simulatedOffset] = useState(() => {
    return parseInt(localStorage.getItem('angaar_reviews_sim_offset') || '0', 10);
  });

  // Periodic check if the user leaves the page open for a long time
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const lastReset = localStorage.getItem('angaar_reviews_reset_time');
      const now = Date.now();
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;

      if (lastReset && now - parseInt(lastReset) > ONE_DAY_MS) {
        localStorage.setItem('angaar_reviews_reset_time', now.toString());
        localStorage.setItem('angaar_reviews', JSON.stringify(initialReviews));
        setReviews(initialReviews);
      }
    }, 60000); // Check once every minute

    return () => clearInterval(checkInterval);
  }, []);

  const totalReviewsSize = allReviews.reduce((sum, r) => sum + estimateBSONSize(r), 0) + simulatedOffset;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const randomRotate = parseFloat((Math.random() * 10 - 5).toFixed(1));
    const newReview = {
      name: name.trim(),
      text: text.trim(),
      rating: parseInt(rating),
      color: chosenColor,
      rotate: randomRotate,
    };

    try {
      const res = await postReviewAPI(newReview);
      if (res.success && res.data) {
        const saved = { ...newReview, id: res.data._id };
        setReviews(prev => [saved, ...prev].slice(0, MAX_LIMIT));
        setAllReviews(prev => [saved, ...prev]);
        setName(''); setText(''); setRating(5);
        return;
      }
    } catch (_) {}

    // localStorage fallback
    const saved = { id: Date.now(), ...newReview };
    setReviews(prev => {
      const updated = [saved, ...prev].slice(0, MAX_LIMIT);
      localStorage.setItem('angaar_reviews', JSON.stringify(updated));
      return updated;
    });
    setAllReviews(prev => {
      const updated = [saved, ...prev];
      localStorage.setItem('angaar_all_reviews', JSON.stringify(updated));
      return updated;
    });
    setName(''); setText(''); setRating(5);
  };

  const reviewBoards = chunkReviews(allReviews, 12);

  return (
    <section id="reviews-board" style={isFullScreen ? { padding: '8rem 4vw 4rem', minHeight: '100vh', maxWidth: '100vw', overflowX: 'hidden' } : {}}>
      <div className="reveal visible">
        {isFullScreen && (
          <button 
            onClick={onBackToHome} 
            className="staff-back-site-btn inline" 
            style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}
          >
            <BackIcon /> Back to Home
          </button>
        )}
        <div className="section-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🔥 Wall of Flames
        </div>
        <h2 className="section-title">
          {isFullScreen ? "All Customer Reviews" : "Review Board"}
        </h2>
        <p className="section-sub">
          Read what the squad says, or pin your own sticky note review to the board! 
          {!isFullScreen && (
            <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
              (Max {MAX_LIMIT} notes allowed on board. Resets every 24 hours)
            </span>
          )}
        </p>
      </div>

      <div className="board-layout" style={isFullScreen ? { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '2.5rem', width: '100%', flexWrap: 'nowrap' } : {}}>
        {/* Review Form - styled as a clipboard */}
        <div className="review-form-clipboard" style={isFullScreen ? { flexShrink: 0 } : {}}>
          <div className="clipboard-clip"></div>
          <form onSubmit={handleSubmit} className="review-form">
            <h3 className="form-title">Stick Your Review</h3>
            
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                placeholder="e.g. Shawarma Lover" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                required
              />
            </div>

            <div className="form-group">
              <label>Your Review</label>
              <textarea 
                placeholder="What did you order? How was the flame grilled char?" 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                maxLength={100}
                rows={3}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>Rating</label>
              <div className="rating-select">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`flame-select-btn ${rating >= num ? 'active' : ''}`}
                    onClick={() => setRating(num)}
                    style={{ background: 'none', border: 'none', padding: '0.2rem', fontSize: '1.4rem' }}
                  >
                    {rating >= num ? '🔥' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Sticky Note Color</label>
              <div className="color-picker">
                {stickyColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-dot ${chosenColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setChosenColor(color)}
                  ></button>
                ))}
              </div>
            </div>

            <button type="submit" className="stick-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              Pin to Board <PinIcon size={15} />
            </button>
          </form>
        </div>

        {/* Corkboard with Sticky Notes */}
        {isFullScreen ? (
          <div className="boards-horizontal-container" style={{ flex: 1, maxWidth: 'calc(100vw - 420px)' }}>
            {reviewBoards.map((boardReviews, boardIndex) => (
              <div className="corkboard square-board" key={boardIndex} style={{ position: 'relative' }}>
                <div className="cork-texture"></div>
                <div style={{ position: 'absolute', top: '10px', right: '15px', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Board {boardIndex + 1}
                </div>
                <div className="sticky-notes-grid">
                  {boardReviews.map((rev) => (
                    <div 
                      className="sticky-note" 
                      key={rev.id}
                      style={{ 
                        backgroundColor: rev.color,
                        transform: `rotate(${rev.rotate}deg)`
                      }}
                    >
                      <div className="note-pin">
                        <BoardPinIcon size={12} />
                      </div>
                      <div className="note-rating" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '2px' }}>
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <span key={idx} style={{ fontSize: '0.65rem' }}>🔥</span>
                        ))}
                      </div>
                      <p className="note-text">"{rev.text}"</p>
                      <div className="note-footer">
                        <span className="note-author">— {rev.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {reviewBoards.length === 0 && (
              <div className="corkboard square-board">
                <div className="cork-texture"></div>
                <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: '150px' }}>No reviews yet. Be the first to stick one!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="corkboard">
            <div className="cork-texture"></div>
            <div className="sticky-notes-grid">
              {reviews.map((rev) => (
                <div 
                  className="sticky-note" 
                  key={rev.id}
                  style={{ 
                    backgroundColor: rev.color,
                    transform: `rotate(${rev.rotate}deg)`
                  }}
                >
                  <div className="note-pin">
                    <BoardPinIcon size={14} />
                  </div>
                  <div className="note-rating" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '2px' }}>
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <span key={idx}>🔥</span>
                    ))}
                  </div>
                  <p className="note-text" style={{ color: '#2f271d' }}>"{rev.text}"</p>
                  <div className="note-footer" style={{ color: '#2f271d' }}>
                    <span className="note-author">— {rev.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isFullScreen && (
        <button className="see-all-reviews-btn" onClick={onSeeAll}>
          <ClipboardIcon /> See All Reviews ({allReviews.length})
        </button>
      )}
    </section>
  );
};

export default ReviewsBoard;
