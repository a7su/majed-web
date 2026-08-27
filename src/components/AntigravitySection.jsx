import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Pencil, PenTool, Eraser, Undo, Redo, Trash2, Heart, Download, Share2, MousePointer2, X } from 'lucide-react';

// --- MOCK API ARCHITECTURE ---
const MOCK_DELAY = 400;
const delay = () => new Promise(r => setTimeout(r, MOCK_DELAY));

const api = {
  getCurrentUser: () => JSON.parse(localStorage.getItem('majed_user')),
  login: async (username, email) => {
    await delay();
    const users = JSON.parse(localStorage.getItem('majed_users') || '[]');
    let user = users.find(u => u.email === email || u.username === username);
    if (!user) {
      user = { id: Date.now(), username, email, displayName: username, avatar: '' };
      users.push(user);
      localStorage.setItem('majed_users', JSON.stringify(users));
    }
    localStorage.setItem('majed_user', JSON.stringify(user));
    return user;
  },
  logout: () => localStorage.removeItem('majed_user'),
  saveArtwork: async (title, imageUrl) => {
    await delay();
    const user = api.getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    const artworks = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
    const artwork = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      title: title || 'Untitled',
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    artworks.unshift(artwork);
    localStorage.setItem('majed_artworks', JSON.stringify(artworks));
    // Simulate backend email
    console.log(`[BACKEND API STUB] Sending email to alnhdy986@gmail.com. New Sketch: ${artwork.title} by ${artwork.username}`);
    return artwork;
  },
  getArtworks: async (filter) => {
    await delay();
    let artworks = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
    const likes = JSON.parse(localStorage.getItem('majed_likes') || '[]');
    const user = api.getCurrentUser();
    
    let enriched = artworks.map(a => ({
      ...a,
      isLiked: user ? likes.some(l => l.artworkId === a.id && l.userId === user.id) : false,
      likesCount: likes.filter(l => l.artworkId === a.id).length
    }));

    if (filter === 'POPULAR') {
      enriched.sort((a, b) => b.likesCount - a.likesCount);
    } else if (filter === 'MY SKETCHES' && user) {
      enriched = enriched.filter(a => a.userId === user.id);
    }
    return enriched;
  },
  toggleLike: async (artworkId) => {
    await delay();
    const user = api.getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    let likes = JSON.parse(localStorage.getItem('majed_likes') || '[]');
    const exists = likes.findIndex(l => l.artworkId === artworkId && l.userId === user.id);
    if (exists >= 0) likes.splice(exists, 1);
    else likes.push({ artworkId, userId: user.id });
    localStorage.setItem('majed_likes', JSON.stringify(likes));
  },
  deleteArtwork: async (artworkId) => {
    await delay();
    const user = api.getCurrentUser();
    let artworks = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
    artworks = artworks.filter(a => !(a.id === artworkId && a.userId === user?.id));
    localStorage.setItem('majed_artworks', JSON.stringify(artworks));
  }
};

// --- CONSTANTS ---
const COLORS = ['#1C1C1C', '#5A5A5A', '#A9A9A9', '#8B0000', '#4682B4', '#556B2F'];
const SIZES = [2, 4, 8, 16];

export default function AntigravitySection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Drawing State
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState(COLORS[0]);
  const [customColor, setCustomColor] = useState('#DDA0DD');
  const [size, setSize] = useState(SIZES[1]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hasDrawn, setHasDrawn] = useState(false);
  const [sketchTitle, setSketchTitle] = useState('');
  
  // Modals & UI
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPendingAction, setAuthPendingAction] = useState(null); // 'save', 'download'
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authErrors, setAuthErrors] = useState({});
  
  // Gallery State
  const [user, setUser] = useState(api.getCurrentUser());
  const [artworks, setArtworks] = useState([]);
  const [galleryFilter, setGalleryFilter] = useState('LATEST');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const pointers = useRef(new Map());
  const isDrawing = useRef(false);
  const lastPos = useRef(null);
  const canvasLogicalSize = useRef({ width: 0, height: 0 });

  // Initialize Canvas & Resize Observer
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Only resize if logical dimensions actually changed
      if (canvasLogicalSize.current.width !== rect.width || canvasLogicalSize.current.height !== rect.height) {
        
        // Save drawing before resizing
        const dataUrl = canvasLogicalSize.current.width > 0 ? canvas.toDataURL() : null;
        
        canvasLogicalSize.current = { width: rect.width, height: rect.height };
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Restore drawing if existed
        if (dataUrl && dataUrl !== 'data:,') {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, img.width / dpr, img.height / dpr);
          };
          img.src = dataUrl;
        }
      }
    };

    // Initial sizing
    handleResize();
    
    // Listen for resize
    window.addEventListener('resize', handleResize);
    
    const saved = localStorage.getItem('majed_autosave');
    if (saved) setShowResumeModal(true);
    else saveState(); 
    
    // Strictly prevent touch actions from bubbling up on the drawing surface
    const preventDefault = (e) => {
      if (e.target === canvasRef.current || e.target === containerRef.current) {
        if (e.cancelable) e.preventDefault();
      }
    };
    containerRef.current.addEventListener('touchmove', preventDefault, { passive: false });
    
    loadGallery();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) containerRef.current.removeEventListener('touchmove', preventDefault);
    };
  }, []);

  const loadGallery = async () => {
    const data = await api.getArtworks(galleryFilter);
    setArtworks(data);
  };

  useEffect(() => { loadGallery(); }, [galleryFilter, user]);

  const resumeSketch = () => {
    const saved = localStorage.getItem('majed_autosave');
    if (saved) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvasLogicalSize.current.width, canvasLogicalSize.current.height);
        ctx.drawImage(img, 0, 0, img.width / dpr, img.height / dpr);
        setHasDrawn(true);
        saveState();
        setShowResumeModal(false);
      };
      img.src = saved;
    }
  };

  const startNewSketch = () => {
    localStorage.removeItem('majed_autosave');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasLogicalSize.current.width, canvasLogicalSize.current.height);
    undoStack.current = [];
    redoStack.current = [];
    saveState();
    setHasDrawn(false);
    setShowResumeModal(false);
    setSketchTitle('');
  };

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    undoStack.current.push(data);
    if (undoStack.current.length > 20) undoStack.current.shift();
    redoStack.current = [];
    localStorage.setItem('majed_autosave', data);
  }, []);

  const restoreState = (dataUrl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvasLogicalSize.current.width, canvasLogicalSize.current.height);
      ctx.drawImage(img, 0, 0, img.width / dpr, img.height / dpr);
    };
    img.src = dataUrl;
  };

  const undo = () => {
    if (undoStack.current.length > 1) {
      const current = undoStack.current.pop();
      redoStack.current.push(current);
      const previous = undoStack.current[undoStack.current.length - 1];
      restoreState(previous);
      localStorage.setItem('majed_autosave', previous);
    }
  };

  const redo = () => {
    if (redoStack.current.length > 0) {
      const next = redoStack.current.pop();
      undoStack.current.push(next);
      restoreState(next);
      localStorage.setItem('majed_autosave', next);
    }
  };

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear your sketch?")) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvasLogicalSize.current.width, canvasLogicalSize.current.height);
      saveState();
      setHasDrawn(false);
    }
  };

  const getCanvasCoords = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // The canvas logical size is its actual CSS pixel resolution.
    // The rect represents its current painted bounds on screen (including zoom/pan transforms).
    // So mapping the click is as simple as finding the relative percentage and multiplying by logical size.
    return {
      x: ((clientX - rect.left) / rect.width) * canvasLogicalSize.current.width,
      y: ((clientY - rect.top) / rect.height) * canvasLogicalSize.current.height
    };
  };

  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, e);
    
    if (pointers.current.size === 1) {
      if (tool === 'pan' || e.buttons === 4) {
        lastPos.current = { type: 'pan', x: e.clientX, y: e.clientY };
      } else {
        isDrawing.current = true;
        const coords = getCanvasCoords(e.clientX, e.clientY);
        lastPos.current = coords;
        setHasDrawn(true);
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, e);

    // Two finger PAN/ZOOM
    if (pointers.current.size === 2) {
      const pts = Array.from(pointers.current.values());
      const p1 = pts[0], p2 = pts[1];
      const dist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
      const cx = (p1.clientX + p2.clientX) / 2, cy = (p1.clientY + p2.clientY) / 2;

      if (lastPos.current && lastPos.current.type === 'pinch') {
        const scaleDelta = dist / lastPos.current.dist;
        const newZoom = Math.min(Math.max(zoom * scaleDelta, 0.5), 5);
        const rect = containerRef.current.getBoundingClientRect();
        const ptX = cx - rect.left, ptY = cy - rect.top;
        const newPanX = ptX - (ptX - pan.x) * (newZoom / zoom) + (cx - lastPos.current.cx);
        const newPanY = ptY - (ptY - pan.y) * (newZoom / zoom) + (cy - lastPos.current.cy);
        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
      }
      lastPos.current = { type: 'pinch', dist, cx, cy };
      isDrawing.current = false;
      return;
    }

    // One finger DRAW
    if (pointers.current.size === 1) {
      if (tool === 'pan' || e.buttons === 4) {
        if (lastPos.current && lastPos.current.type === 'pan') {
          setPan(p => ({ x: p.x + (e.clientX - lastPos.current.x), y: p.y + (e.clientY - lastPos.current.y) }));
        }
        lastPos.current = { type: 'pan', x: e.clientX, y: e.clientY };
      } else if (isDrawing.current) {
        const coords = getCanvasCoords(e.clientX, e.clientY);
        const ctx = canvasRef.current.getContext('2d');
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Handle pressure sensitivity for Apple Pencil / Stylus
        const pressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;
        
        if (tool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.lineWidth = size * 10;
          ctx.strokeStyle = 'rgba(0,0,0,1)';
          ctx.globalAlpha = 1;
        } else {
          ctx.globalCompositeOperation = tool === 'marker' ? 'multiply' : 'source-over';
          ctx.strokeStyle = color;
          if (tool === 'pencil') { ctx.lineWidth = size * (pressure * 1.5 + 0.5); ctx.globalAlpha = 0.7; } 
          else if (tool === 'pen') { ctx.lineWidth = size * 0.8; ctx.globalAlpha = 1.0; } 
          else if (tool === 'marker') { ctx.lineWidth = size * (pressure * 2.5 + 2.5); ctx.globalAlpha = 0.4; }
        }

        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        lastPos.current = coords;
      }
    }
  };

  const handlePointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      if (isDrawing.current) saveState();
      isDrawing.current = false;
      lastPos.current = null;
    }
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newZoom = Math.min(Math.max(zoom * (e.deltaY > 0 ? 0.9 : 1.1), 0.5), 5);
      const rect = containerRef.current.getBoundingClientRect();
      const ptX = e.clientX - rect.left, ptY = e.clientY - rect.top;
      setZoom(newZoom);
      setPan({ x: ptX - (ptX - pan.x) * (newZoom / zoom), y: ptY - (ptY - pan.y) * (newZoom / zoom) });
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getExportCanvas = () => {
    const canvas = canvasRef.current;
    const exportW = canvasLogicalSize.current.width;
    const exportH = canvasLogicalSize.current.height;
    
    const expCanvas = document.createElement('canvas');
    expCanvas.width = exportW; expCanvas.height = exportH;
    const ctx = expCanvas.getContext('2d');
    
    // Paper + Dots
    ctx.fillStyle = '#F8F7F5'; ctx.fillRect(0, 0, exportW, exportH);
    ctx.fillStyle = '#D3D3D3';
    for(let x=0; x<exportW; x+=20) {
      for(let y=0; y<exportH; y+=20) {
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI*2); ctx.fill();
      }
    }
    
    // Draw artwork
    ctx.drawImage(canvas, 0, 0, exportW, exportH);
    
    // Branding
    ctx.font = '16px sans-serif'; ctx.fillStyle = '#5A5A5A'; ctx.textAlign = 'right';
    ctx.fillText('MAJED — FINE ART', exportW - 20, exportH - 20);
    return expCanvas;
  };

  // --- ACTIONS ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!authUsername.trim()) errors.name = "Please enter your name.";
    else if (authUsername.trim().length < 2) errors.name = "Name is too short.";
    
    // Standard email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!authEmail.trim()) errors.email = "Please enter your email.";
    else if (!emailRegex.test(authEmail)) errors.email = "Please enter a valid email address.";
    
    if (Object.keys(errors).length > 0) {
      setAuthErrors(errors);
      return;
    }
    setAuthErrors({});
    
    const loggedInUser = await api.login(authUsername.trim(), authEmail.trim());
    setUser(loggedInUser);
    setShowAuthModal(false);
    
    // Resume pending action
    if (authPendingAction === 'save') executeSave(loggedInUser);
    if (authPendingAction === 'download') executeDownload();
    setAuthPendingAction(null);
  };

  const requireAuth = (action) => {
    if (user) {
      if (action === 'save') executeSave(user);
      if (action === 'download') executeDownload();
    } else {
      setAuthPendingAction(action);
      setShowAuthModal(true);
    }
  };

  const executeSave = async (u) => {
    const dataUrl = getExportCanvas().toDataURL('image/png');
    await api.saveArtwork(sketchTitle, dataUrl);
    alert("SKETCH SAVED ✦\nPublished to the gallery.");
    loadGallery();
  };

  const executeDownload = () => {
    const link = document.createElement('a');
    link.download = `majed-sketch-${Date.now()}.png`;
    link.href = getExportCanvas().toDataURL('image/png');
    link.click();
  };

  const handleShare = async (imageUrl) => {
    const url = imageUrl || getExportCanvas().toDataURL('image/png');
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], 'sketch.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'My Sketch', files: [file] });
      } else {
        alert("Sharing not supported in this browser. Try downloading instead.");
      }
    } catch (e) {
      console.error('Sharing failed', e);
    }
  };

  const handleLike = async (id) => {
    if (!user) {
      setAuthPendingAction(null);
      setShowAuthModal(true);
      return;
    }
    await api.toggleLike(id);
    loadGallery();
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Delete this sketch permanently?")) {
      await api.deleteArtwork(id);
      loadGallery();
      setSelectedArtwork(null);
    }
  };

  return (
    <section style={{ backgroundColor: '#F8F7F5', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        .sketch-container { height: calc(100dvh - 80px); display: flex; flex-direction: column; position: relative; }
        
        /* Stop accidental browser gestures during drawing */
        .drawing-workspace { 
          flex: 1; position: relative; overflow: hidden; display: flex; flex-direction: row; 
          background-color: #F8F7F5;
          background-image: radial-gradient(#D3D3D3 1.5px, transparent 1.5px);
          background-size: 20px 20px;
        }
        
        .drawing-canvas-area {
          touch-action: none !important;
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          user-select: none !important;
          overscroll-behavior: none !important;
        }
        
        .drawing-toolbar { width: 80px; background: #FFF; border-right: 1px solid #EEE; display: flex; flex-direction: column; align-items: center; padding: 1rem 0; gap: 1rem; z-index: 20; overflow-y: auto; touch-action: auto; }
        .drawing-actionbar { padding: 1rem; background: #FFF; border-top: 1px solid #EEE; display: flex; justify-content: center; align-items: center; gap: 1rem; z-index: 20; flex-wrap: wrap; touch-action: auto; box-shadow: 0 -4px 20px rgba(0,0,0,0.02); }
        
        .action-btn { padding: 0.75rem 1.5rem; border-radius: 8px; border: 1px solid #1C1C1C; background: transparent; color: #1C1C1C; cursor: pointer; font-family: var(--font-sans); font-size: 0.8rem; font-weight: 600; letter-spacing: 0.1em; transition: all 0.2s; display: flex; align-items: center; justify-content: center; min-height: 44px; }
        .action-btn.primary { background: #1C1C1C; color: #FFF; border: none; }
        
        .toolbar-btn { min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 8px; cursor: pointer; flex-shrink: 0; }
        .color-btn { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; padding: 0; flex-shrink: 0; }
        
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; padding: 2rem; }
        .gallery-item { break-inside: avoid; background: #FFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: transform 0.2s; cursor: pointer; }
        .gallery-item:hover { transform: translateY(-4px); }
        .gallery-item img { width: 100%; display: block; aspect-ratio: 1; object-fit: cover; }
        
        @media (max-width: 768px) {
          .sketch-container { height: calc(100dvh - 60px); }
          .drawing-workspace { flex-direction: column-reverse; } /* Toolbar at bottom of workspace on mobile */
          
          /* Updated Mobile Toolbar layout */
          .drawing-toolbar { width: 100%; height: auto; border-right: none; border-top: 1px solid #EEE; flex-direction: row; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; overflow-x: auto; overflow-y: hidden; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); }
          
          /* Ensures the tool groups wrap or scroll horizontally nicely */
          .toolbar-group-colors { flex-direction: row !important; overflow-x: auto; max-width: none !important; }
          .drawing-actionbar { gap: 0.5rem; padding: 0.75rem; }
          .drawing-actionbar input { min-height: 44px; font-size: 16px; /* 16px prevents iOS zoom */ }
          .action-btn { flex: 1; min-width: auto; padding: 0.75rem 0.5rem; font-size: 0.75rem; }
          
          /* Form layout on mobile */
          .auth-modal-content { padding: 2rem !important; width: 100% !important; margin: auto; }
          .auth-modal-content input { font-size: 16px !important; }
          .auth-modal-overlay { align-items: flex-start !important; padding-top: 1rem !important; }
        }
        .auth-modal-overlay { position: fixed; inset: 0; background-color: rgba(0,0,0,0.85); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow-y: auto; }
      `}</style>
      
      {/* --- DRAWING APP --- */}
      <div className="sketch-container">
        {/* Header */}
        <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#F8F7F5', zIndex: 10 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 300, margin: '0 0 0.25rem 0', color: '#1C1C1C' }}>
            DRAW SOMETHING
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A5A5A', margin: 0 }}>
            {hasDrawn ? 'Make it yours.' : 'A blank page is an invitation. Leave your mark.'}
          </p>
        </div>

        {/* Workspace */}
        <div className="drawing-workspace">
          {/* Toolbar */}
          <div className="drawing-toolbar">
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'inherit' }}>
              {[
                { id: 'pencil', icon: <Pencil size={20} /> },
                { id: 'pen', icon: <PenTool size={20} /> },
                { id: 'marker', icon: <div style={{width:'16px', height:'16px', borderRadius:'2px', background:'currentColor'}} /> },
                { id: 'eraser', icon: <Eraser size={20} /> },
                { id: 'pan', icon: <MousePointer2 size={20} /> }
              ].map(t => (
                <button 
                  key={t.id} title={t.id} onClick={() => setTool(t.id)}
                  className="toolbar-btn"
                  style={{ background: tool === t.id ? '#F0F0F0' : 'transparent', color: '#1C1C1C' }}
                >
                  {t.icon}
                </button>
              ))}
            </div>
            
            <div className="toolbar-group-colors" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '80px' }}>
              {COLORS.map(c => (
                <button 
                  key={c} onClick={() => setColor(c)}
                  className="color-btn"
                  style={{ backgroundColor: c, border: color === c ? '2px solid #000' : '2px solid transparent' }}
                />
              ))}
              <input 
                type="color" value={customColor} onChange={e => { setCustomColor(e.target.value); setColor(e.target.value); }}
                className="color-btn"
                style={{ border: 'none', overflow: 'hidden' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'inherit' }}>
              {SIZES.map(s => (
                <button 
                  key={s} onClick={() => setSize(s)}
                  className="toolbar-btn"
                  style={{ background: size === s ? '#E0E0E0' : 'transparent' }}
                >
                  <div style={{ width: `${Math.min(s, 24)}px`, height: `${Math.min(s, 24)}px`, backgroundColor: '#1C1C1C', borderRadius: '50%' }} />
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'inherit' }}>
              <button className="toolbar-btn" onClick={undo} style={{ background: 'none', color: '#5A5A5A' }}><Undo size={20}/></button>
              <button className="toolbar-btn" onClick={redo} style={{ background: 'none', color: '#5A5A5A' }}><Redo size={20}/></button>
              <button className="toolbar-btn" onClick={clearCanvas} style={{ background: 'none', color: '#8B0000' }}><Trash2 size={20}/></button>
            </div>
          </div>

          {/* Viewport - Fully responsive */}
          <div 
            ref={containerRef}
            className="drawing-canvas-area"
            style={{ flex: 1, position: 'relative', overflow: 'hidden', touchAction: 'none', display: 'flex' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
          >
            {zoom !== 1 && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10, backgroundColor: 'rgba(255,255,255,0.9)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#1C1C1C', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', fontWeight: '600' }} onClick={resetZoom}>
                {Math.round(zoom * 100)}% Reset
              </div>
            )}

            <div 
              style={{ 
                flex: 1,
                width: '100%', height: '100%', 
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, 
                transformOrigin: '0 0',
                position: 'relative'
              }}
            >
              {!hasDrawn && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem, 5vw, 3rem)', color: 'rgba(0,0,0,0.06)', letterSpacing: '0.1em' }}>Start sketching...</span>
                </div>
              )}
              <canvas 
                ref={canvasRef} 
                style={{ 
                  display: 'block',
                  position: 'absolute', 
                  top: 0, left: 0, 
                  width: '100%', height: '100%', 
                  cursor: tool === 'pan' ? 'grab' : 'crosshair',
                  touchAction: 'none'
                }} 
              />
            </div>
          </div>
        </div>

        {/* Action Bar Bottom */}
        <div className="drawing-actionbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          <button className="action-btn" style={{ gridColumn: 'span 1' }} onClick={() => requireAuth('download')}><Download size={16} style={{marginRight:'4px'}}/> <span className="hide-on-mobile">DOWNLOAD</span></button>
          <button className="action-btn" style={{ gridColumn: 'span 1' }} onClick={() => handleShare()}><Share2 size={16} style={{marginRight:'4px'}}/> <span className="hide-on-mobile">SHARE</span></button>
          <button className="action-btn primary" style={{ gridColumn: 'span 2' }} onClick={() => requireAuth('save')}>SAVE SKETCH ✦</button>
          <style>{`@media(max-width: 768px) { .hide-on-mobile { display: none; } }`}</style>
        </div>
      </div>

      {/* --- PUBLIC SKETCH GALLERY --- */}
      <div style={{ padding: '4rem 1rem', backgroundColor: '#F2F0EC' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>THE SKETCH GALLERY</h3>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#5A5A5A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Made by the people who stopped by.
          </p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {['LATEST', 'POPULAR', 'MY SKETCHES'].map(f => (
            <button 
              key={f} onClick={() => setGalleryFilter(f)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: galleryFilter === f ? 700 : 400, color: galleryFilter === f ? '#1C1C1C' : '#999', padding: '0.5rem', minHeight: '44px' }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {artworks.map(art => (
            <div key={art.id} className="gallery-item" onClick={() => setSelectedArtwork(art)}>
              <img src={art.imageUrl} alt={art.title} loading="lazy" />
              <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#1C1C1C' }}>{art.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>drawn by {art.username}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: art.isLiked ? '#ff4757' : '#999' }}>
                  <Heart size={16} fill={art.isLiked ? '#ff4757' : 'none'} color={art.isLiked ? '#ff4757' : '#999'} />
                  <span style={{ fontSize: '0.8rem' }}>{art.likesCount}</span>
                </div>
              </div>
            </div>
          ))}
          {artworks.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#999', fontFamily: 'var(--font-sans)' }}>
              No sketches found. Be the first to draw something!
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal-overlay no-custom-cursor">
          <div className="auth-modal-content" style={{ backgroundColor: '#F8F7F5', padding: '3rem', borderRadius: '16px', maxWidth: '420px', width: '100%', position: 'relative' }}>
            
            <button onClick={() => setShowAuthModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={24} color="#1C1C1C" />
            </button>

            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginTop: 0, marginBottom: '0.5rem', color: '#1C1C1C' }}>SAVE YOUR SKETCH</h3>
            <p style={{ fontSize: '1rem', color: '#5A5A5A', marginBottom: '2rem', fontFamily: 'var(--font-sans)' }}>Create your account to save your artwork.</p>
            
            <form onSubmit={handleAuthSubmit} style={{ textAlign: 'left' }}>
              {/* NAME FIELD */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '0.1em', color: '#1C1C1C', fontFamily: 'var(--font-sans)' }}>NAME</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  value={authUsername} 
                  onChange={e => {
                    setAuthUsername(e.target.value);
                    if (authErrors.name) setAuthErrors({ ...authErrors, name: null });
                  }} 
                  style={{ width: '100%', padding: '12px 16px', border: authErrors.name ? '1px solid #ff4757' : '1px solid #D3D3D3', borderRadius: '8px', fontSize: '16px', fontFamily: 'var(--font-sans)', boxSizing: 'border-box', backgroundColor: '#FFF', outline: 'none' }} 
                />
                {authErrors.name ? 
                  <div style={{ color: '#ff4757', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>{authErrors.name}</div> :
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>Your name will appear with your sketch. e.g. Ahmed</div>
                }
              </div>

              {/* EMAIL FIELD */}
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '0.1em', color: '#1C1C1C', fontFamily: 'var(--font-sans)' }}>EMAIL</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={authEmail} 
                  onChange={e => {
                    setAuthEmail(e.target.value);
                    if (authErrors.email) setAuthErrors({ ...authErrors, email: null });
                  }} 
                  style={{ width: '100%', padding: '12px 16px', border: authErrors.email ? '1px solid #ff4757' : '1px solid #D3D3D3', borderRadius: '8px', fontSize: '16px', fontFamily: 'var(--font-sans)', boxSizing: 'border-box', backgroundColor: '#FFF', outline: 'none' }} 
                />
                {authErrors.email ? 
                  <div style={{ color: '#ff4757', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>{authErrors.email}</div> :
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '6px', fontFamily: 'var(--font-sans)' }}>We'll use this for your account. e.g. you@example.com</div>
                }
              </div>

              <button type="submit" className="action-btn primary" style={{ width: '100%', minHeight: '54px', fontSize: '14px' }}>SAVE MY SKETCH</button>
            </form>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(248,247,245,0.95)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', margin: '0 0 1rem 0' }}>Continue sketching?</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button onClick={startNewSketch} className="action-btn">START NEW</button>
              <button onClick={resumeSketch} className="action-btn primary">CONTINUE</button>
            </div>
          </div>
        </div>
      )}

      {/* Artwork Detail Modal */}
      {selectedArtwork && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
          <button onClick={() => setSelectedArtwork(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <X size={32} />
          </button>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: '1rem' }}>
            <img src={selectedArtwork.imageUrl} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt={selectedArtwork.title} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF', marginTop: '1rem', maxWidth: '800px', margin: '1rem auto 0 auto', width: '100%', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontFamily: "'Cormorant Garamond', serif" }}>{selectedArtwork.title}</h3>
              <span style={{ color: '#999', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>drawn by {selectedArtwork.username}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={(e) => { e.stopPropagation(); handleLike(selectedArtwork.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: selectedArtwork.isLiked ? '#ff4757' : '#FFF', display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '44px', minHeight: '44px' }}>
                <Heart fill={selectedArtwork.isLiked ? '#ff4757' : 'none'} color={selectedArtwork.isLiked ? '#ff4757' : '#FFF'} /> {selectedArtwork.likesCount}
              </button>
              <button onClick={() => handleShare(selectedArtwork.imageUrl)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FFF', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Share2 /></button>
              {user && user.id === selectedArtwork.userId && (
                <button onClick={() => handleDelete(selectedArtwork.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4757', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 /></button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
