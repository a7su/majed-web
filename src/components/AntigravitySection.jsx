import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Pencil, PenTool, Eraser, Undo, Redo, Trash2, Heart, Download, Share2, MousePointer2, X, Highlighter } from 'lucide-react';

// --- MOCK API ---
const delay = () => new Promise(r => setTimeout(r, 300));
const api = {
  getCurrentUser: () => { try { return JSON.parse(localStorage.getItem('majed_user')); } catch { return null; } },
  login: async (username, email) => {
    await delay();
    const users = JSON.parse(localStorage.getItem('majed_users') || '[]');
    let user = users.find(u => u.email === email);
    if (!user) {
      user = { id: Date.now(), username, email };
      users.push(user);
      localStorage.setItem('majed_users', JSON.stringify(users));
    }
    localStorage.setItem('majed_user', JSON.stringify(user));
    return user;
  },
  logout: () => localStorage.removeItem('majed_user'),
  saveArtwork: async (title, caption, imageUrl) => {
    await delay();
    const user = api.getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    const artworks = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
    const artwork = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      title: title || 'Untitled',
      caption: caption || '',
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    artworks.unshift(artwork);
    localStorage.setItem('majed_artworks', JSON.stringify(artworks));
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
    if (filter === 'POPULAR') enriched.sort((a, b) => b.likesCount - a.likesCount);
    else if (filter === 'MY SKETCHES' && user) enriched = enriched.filter(a => a.userId === user.id);
    return enriched;
  },
  toggleLike: async (artworkId) => {
    await delay();
    const user = api.getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    let likes = JSON.parse(localStorage.getItem('majed_likes') || '[]');
    const idx = likes.findIndex(l => l.artworkId === artworkId && l.userId === user.id);
    if (idx >= 0) likes.splice(idx, 1);
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

const COLORS = ['#1C1C1C', '#5A5A5A', '#8B0000', '#4682B4', '#556B2F', '#B8860B', '#800080', '#FF6B35'];
const SIZES = [2, 4, 8, 16];

// Tools config with proper alpha and line-width mappings
const TOOL_CONFIG = {
  pencil:  { label: 'Pencil',  alpha: 0.72, widthMult: 1.2,  composite: 'source-over' },
  pen:     { label: 'Pen',     alpha: 1.0,  widthMult: 0.8,  composite: 'source-over' },
  marker:  { label: 'Marker',  alpha: 0.35, widthMult: 4.0,  composite: 'source-over' },
  eraser:  { label: 'Eraser',  alpha: 1.0,  widthMult: 8.0,  composite: 'destination-out' },
};

export default function AntigravitySection() {
  const containerRef = useRef(null);
  const canvasRef    = useRef(null);
  // Off-screen buffers – created once, re-sized on demand
  const bgCanvas     = useRef(null);  // snapshot before stroke starts
  const strokeCanvas = useRef(null);  // current stroke accumulated at alpha=1

  // Drawing state
  const [tool, setTool]           = useState('pencil');
  const [color, setColor]         = useState(COLORS[0]);
  const [customColor, setCustomColor] = useState('#DDA0DD');
  const [size, setSize]           = useState(SIZES[1]);
  const [zoom, setZoom]           = useState(1);
  const [pan, setPan]             = useState({ x: 0, y: 0 });
  const [hasDrawn, setHasDrawn]   = useState(false);
  const [sketchTitle, setSketchTitle] = useState('');
  const [sketchCaption, setSketchCaption] = useState(''); // NEW: caption/story

  // Modals
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showSaveModal,   setShowSaveModal]   = useState(false); // combined save+auth modal
  const [authUsername,    setAuthUsername]     = useState('');
  const [authEmail,       setAuthEmail]        = useState('');
  const [artworkTitle,    setArtworkTitle]     = useState('');
  const [artworkCaption,  setArtworkCaption]   = useState('');
  const [authErrors,      setAuthErrors]       = useState({});
  const [isSaving,        setIsSaving]         = useState(false);

  // Gallery
  const [user, setUser]                     = useState(() => api.getCurrentUser());
  const [artworks, setArtworks]             = useState([]);
  const [galleryFilter, setGalleryFilter]   = useState('LATEST');
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // Internal drawing refs
  const undoStack    = useRef([]);
  const redoStack    = useRef([]);
  const pointers     = useRef(new Map());
  const isDrawing    = useRef(false);
  const lastPos      = useRef(null);
  const logicalSize  = useRef({ width: 0, height: 0 }); // CSS px size of canvas

  // ─── CANVAS INIT & RESIZE ─────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas    = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const changed =
        logicalSize.current.width  !== Math.round(rect.width) ||
        logicalSize.current.height !== Math.round(rect.height);

      if (!changed) return;

      // Snapshot before resize
      const snapshot = logicalSize.current.width > 0 ? canvas.toDataURL() : null;

      const dpr = window.devicePixelRatio || 1;
      logicalSize.current = { width: Math.round(rect.width), height: Math.round(rect.height) };

      canvas.width  = logicalSize.current.width  * dpr;
      canvas.height = logicalSize.current.height * dpr;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      if (snapshot && snapshot !== 'data:,') {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, logicalSize.current.width, logicalSize.current.height);
        img.src = snapshot;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Prevent touchmove scrolling on canvas
    const noScroll = (e) => {
      if (e.target === canvasRef.current || containerRef.current?.contains(e.target)) {
        if (e.cancelable) e.preventDefault();
      }
    };
    document.addEventListener('touchmove', noScroll, { passive: false });

    const saved = localStorage.getItem('majed_autosave');
    if (saved) setShowResumeModal(true);
    else saveState();

    loadGallery();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('touchmove', noScroll);
    };
  }, []);

  // ─── GALLERY ──────────────────────────────────────────────────────────────
  const loadGallery = useCallback(async () => {
    const data = await api.getArtworks(galleryFilter);
    setArtworks(data);
  }, [galleryFilter]);

  useEffect(() => { loadGallery(); }, [galleryFilter, loadGallery]);

  // ─── UNDO/REDO/SAVE-STATE ─────────────────────────────────────────────────
  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();
    undoStack.current.push(data);
    if (undoStack.current.length > 30) undoStack.current.shift();
    redoStack.current = [];
    localStorage.setItem('majed_autosave', data);
  }, []);

  const restoreState = (dataUrl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, logicalSize.current.width, logicalSize.current.height);
      ctx.drawImage(img, 0, 0, logicalSize.current.width, logicalSize.current.height);
    };
    img.src = dataUrl;
  };

  const undo = () => {
    if (undoStack.current.length <= 1) return;
    const current = undoStack.current.pop();
    redoStack.current.push(current);
    const previous = undoStack.current[undoStack.current.length - 1];
    restoreState(previous);
    localStorage.setItem('majed_autosave', previous);
  };

  const redo = () => {
    if (!redoStack.current.length) return;
    const next = redoStack.current.pop();
    undoStack.current.push(next);
    restoreState(next);
    localStorage.setItem('majed_autosave', next);
  };

  const clearCanvas = () => {
    if (!window.confirm('Clear your sketch? This cannot be undone.')) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, logicalSize.current.width, logicalSize.current.height);
    saveState();
    setHasDrawn(false);
  };

  // ─── RESUME SKETCH ────────────────────────────────────────────────────────
  const resumeSketch = () => {
    const saved = localStorage.getItem('majed_autosave');
    if (saved) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(img, 0, 0, logicalSize.current.width, logicalSize.current.height);
        setHasDrawn(true);
      };
      img.src = saved;
    }
    setShowResumeModal(false);
  };

  const startNewSketch = () => {
    localStorage.removeItem('majed_autosave');
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, logicalSize.current.width, logicalSize.current.height);
    undoStack.current = [];
    redoStack.current = [];
    saveState();
    setHasDrawn(false);
    setShowResumeModal(false);
  };

  // ─── COORDINATE MAPPING ───────────────────────────────────────────────────
  const getCanvasCoords = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width)  * logicalSize.current.width,
      y: ((clientY - rect.top)  / rect.height) * logicalSize.current.height,
    };
  };

  // ─── OFFSCREEN BUFFER HELPERS ─────────────────────────────────────────────
  const ensureOffscreenBuffers = () => {
    const canvas = canvasRef.current;
    const dpr    = window.devicePixelRatio || 1;
    const W = canvas.width, H = canvas.height;

    if (!bgCanvas.current) bgCanvas.current = document.createElement('canvas');
    if (bgCanvas.current.width !== W || bgCanvas.current.height !== H) {
      bgCanvas.current.width = W; bgCanvas.current.height = H;
    } else {
      // CLEAR the background buffer so transparent/erased holes don't accidentally reveal old pixels!
      bgCanvas.current.getContext('2d').clearRect(0, 0, W, H);
    }
    bgCanvas.current.getContext('2d').drawImage(canvas, 0, 0);

    if (!strokeCanvas.current) strokeCanvas.current = document.createElement('canvas');
    if (strokeCanvas.current.width !== W || strokeCanvas.current.height !== H) {
      strokeCanvas.current.width = W; strokeCanvas.current.height = H;
    } else {
      // Clear the stroke accumulation buffer for a fresh stroke
      strokeCanvas.current.getContext('2d').clearRect(0, 0, W, H);
    }
    // Scale stroke canvas to match DPR (so logical coords match)
    const sCtx = strokeCanvas.current.getContext('2d');
    sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sCtx.lineCap  = 'round';
    sCtx.lineJoin = 'round';
  };

  const compositeStrokeToMain = (toolId) => {
    const canvas  = canvasRef.current;
    const mainCtx = canvas.getContext('2d');
    const cfg     = TOOL_CONFIG[toolId] || TOOL_CONFIG.pencil;

    mainCtx.save();
    mainCtx.setTransform(1, 0, 0, 1, 0, 0); // physical pixel coords
    mainCtx.clearRect(0, 0, canvas.width, canvas.height);
    mainCtx.drawImage(bgCanvas.current, 0, 0);           // original background
    mainCtx.globalCompositeOperation = cfg.composite;
    mainCtx.globalAlpha = cfg.alpha;
    mainCtx.drawImage(strokeCanvas.current, 0, 0);        // full stroke at configured alpha
    mainCtx.restore();
  };

  // ─── POINTER HANDLERS ─────────────────────────────────────────────────────
  const handlePointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, e);

    if (pointers.current.size === 1) {
      if (tool === 'pan' || e.buttons === 4) {
        lastPos.current = { type: 'pan', x: e.clientX, y: e.clientY };
      } else {
        isDrawing.current = true;
        ensureOffscreenBuffers();
        lastPos.current = getCanvasCoords(e.clientX, e.clientY);
        setHasDrawn(true);
      }
    }
  };

  const handlePointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, e);

    // Two-finger pinch-zoom
    if (pointers.current.size === 2) {
      const [p1, p2] = Array.from(pointers.current.values());
      const dist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
      const cx   = (p1.clientX + p2.clientX) / 2;
      const cy   = (p1.clientY + p2.clientY) / 2;

      if (lastPos.current?.type === 'pinch') {
        const scaleDelta = dist / lastPos.current.dist;
        const newZoom    = Math.min(Math.max(zoom * scaleDelta, 0.25), 8);
        const rect       = containerRef.current.getBoundingClientRect();
        const ptX = cx - rect.left, ptY = cy - rect.top;
        setZoom(newZoom);
        setPan(p => ({
          x: ptX - (ptX - p.x) * (newZoom / zoom) + (cx - lastPos.current.cx),
          y: ptY - (ptY - p.y) * (newZoom / zoom) + (cy - lastPos.current.cy),
        }));
      }
      lastPos.current = { type: 'pinch', dist, cx, cy };
      isDrawing.current = false;
      return;
    }

    // Single pointer
    if (pointers.current.size === 1) {
      if (tool === 'pan' || e.buttons === 4) {
        if (lastPos.current?.type === 'pan') {
          setPan(p => ({ x: p.x + e.clientX - lastPos.current.x, y: p.y + e.clientY - lastPos.current.y }));
        }
        lastPos.current = { type: 'pan', x: e.clientX, y: e.clientY };
        return;
      }

      if (!isDrawing.current || !lastPos.current) return;

      const from = lastPos.current;
      const to   = getCanvasCoords(e.clientX, e.clientY);
      const pressure = (e.pressure > 0) ? e.pressure : 0.5;
      const cfg  = TOOL_CONFIG[tool] || TOOL_CONFIG.pencil;

      // Draw into stroke accumulation canvas (always alpha=1 here)
      const sCtx = strokeCanvas.current.getContext('2d');
      sCtx.strokeStyle = tool === 'eraser' ? '#000000' : color;
      sCtx.lineWidth   = size * cfg.widthMult * (tool === 'pen' ? 1 : (0.5 + pressure * 0.8));
      sCtx.globalAlpha = 1.0; // always full alpha on stroke canvas
      sCtx.globalCompositeOperation = 'source-over';
      sCtx.beginPath();
      sCtx.moveTo(from.x, from.y);
      sCtx.lineTo(to.x, to.y);
      sCtx.stroke();

      // Composite the full stroke at the configured alpha back to main canvas
      compositeStrokeToMain(tool);

      lastPos.current = to;
    }
  };

  const handlePointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      if (isDrawing.current) saveState();
      isDrawing.current = false;
      lastPos.current   = null;
    }
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const newZoom = Math.min(Math.max(zoom * (e.deltaY > 0 ? 0.9 : 1.1), 0.25), 8);
      const rect = containerRef.current.getBoundingClientRect();
      const ptX = e.clientX - rect.left, ptY = e.clientY - rect.top;
      setZoom(newZoom);
      setPan(p => ({ x: ptX - (ptX - p.x) * (newZoom / zoom), y: ptY - (ptY - p.y) * (newZoom / zoom) }));
    } else {
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  // ─── EXPORT ───────────────────────────────────────────────────────────────
  const getExportCanvas = () => {
    const src  = canvasRef.current;
    const W    = logicalSize.current.width;
    const H    = logicalSize.current.height;
    const exp  = document.createElement('canvas');
    exp.width  = W; exp.height = H;
    const ctx  = exp.getContext('2d');

    // Dotted paper background
    ctx.fillStyle = '#F8F7F5';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#CCCCCC';
    for (let x = 0; x < W; x += 20) {
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Artwork
    ctx.drawImage(src, 0, 0, W, H);

    // Branding
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'right';
    ctx.fillText('majed-alnahdi.com', W - 16, H - 14);
    return exp;
  };

  // ─── SAVE MODAL SUBMIT ────────────────────────────────────────────────────
  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!authUsername.trim() || authUsername.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).';
    if (!authEmail.trim() || !emailRe.test(authEmail))          errors.email = 'Please enter a valid email address.';
    if (!artworkTitle.trim())                                    errors.title = 'Give your sketch a title.';

    if (Object.keys(errors).length) { setAuthErrors(errors); return; }
    setAuthErrors({});
    setIsSaving(true);

    try {
      const loggedInUser = await api.login(authUsername.trim(), authEmail.trim());
      setUser(loggedInUser);
      const dataUrl = getExportCanvas().toDataURL('image/png');
      await api.saveArtwork(artworkTitle.trim(), artworkCaption.trim(), dataUrl);
      setShowSaveModal(false);
      setArtworkTitle('');
      setArtworkCaption('');
      await loadGallery();
      // Scroll down to gallery
      document.querySelector('.gallery-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `majed-sketch-${Date.now()}.png`;
    link.href     = getExportCanvas().toDataURL('image/png');
    link.click();
  };

  const handleShare = async (imageUrl) => {
    const url = imageUrl || getExportCanvas().toDataURL('image/png');
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], 'sketch.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: 'My Sketch — Majed Alnahdi', files: [file] });
      } else {
        navigator.clipboard?.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) { console.error(err); }
  };

  const handleLike = async (id) => {
    if (!user) { setShowSaveModal(true); return; }
    await api.toggleLike(id);
    loadGallery();
    if (selectedArtwork?.id === id) {
      const updated = (await api.getArtworks(galleryFilter)).find(a => a.id === id);
      if (updated) setSelectedArtwork(updated);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sketch permanently?')) return;
    await api.deleteArtwork(id);
    await loadGallery();
    setSelectedArtwork(null);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <section style={{ backgroundColor: '#F8F7F5', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        /* ── Layout ── */
        .sketch-container { height: calc(100dvh - 80px); display: flex; flex-direction: column; position: relative; }
        .drawing-workspace { flex: 1; overflow: hidden; display: flex; flex-direction: row; background: #EDECEA; }
        .drawing-canvas-area { flex: 1; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;
          touch-action: none !important; user-select: none !important; -webkit-user-select: none !important;
          overscroll-behavior: none !important; background: #EDECEA;
        }

        /* ── Canvas Paper ── */
        .canvas-paper {
          position: relative;
          background: #F8F7F5;
          background-image: radial-gradient(circle, #C8C8C8 1.2px, transparent 1.2px);
          background-size: 20px 20px;
          box-shadow: 0 4px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
          border-radius: 2px;
        }

        /* ── Toolbar ── */
        .drawing-toolbar {
          width: 72px; background: #FFF; border-right: 1px solid #E8E8E8;
          display: flex; flex-direction: column; align-items: center;
          padding: 12px 0; gap: 8px; z-index: 20; overflow-y: auto;
          touch-action: auto; box-shadow: 2px 0 8px rgba(0,0,0,0.04);
        }
        .toolbar-section { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 100%; padding: 8px 0; border-bottom: 1px solid #F0F0F0; }
        .toolbar-section:last-child { border-bottom: none; }
        .toolbar-btn {
          width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
          border: none; border-radius: 10px; cursor: pointer; background: transparent;
          color: #444; transition: all 0.15s; flex-shrink: 0;
        }
        .toolbar-btn:hover { background: #F5F5F5; }
        .toolbar-btn.active { background: #F0F0F0; color: #000; box-shadow: inset 0 0 0 1px #E0E0E0; }
        .color-dot {
          width: 24px; height: 24px; border-radius: 50%; cursor: pointer;
          border: 2px solid transparent; transition: transform 0.1s; flex-shrink: 0;
        }
        .color-dot:hover { transform: scale(1.15); }
        .color-dot.active { border-color: #1C1C1C; box-shadow: 0 0 0 2px #FFF inset; }

        /* ── Action bar ── */
        .drawing-actionbar {
          padding: 10px 16px; background: #FFF; border-top: 1px solid #EBEBEB;
          display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 8px;
          z-index: 20; touch-action: auto;
        }
        .action-btn {
          padding: 0 16px; height: 44px; border-radius: 10px; border: 1.5px solid #1C1C1C;
          background: transparent; color: #1C1C1C; cursor: pointer;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.15s; white-space: nowrap;
        }
        .action-btn:hover { background: #F5F5F5; }
        .action-btn.primary { background: #1C1C1C; color: #FFF; border-color: #1C1C1C; }
        .action-btn.primary:hover { background: #333; }

        /* ── Gallery ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px; padding: 0 24px 24px;
        }
        .gallery-card {
          background: #FFF; border-radius: 12px; overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.07); transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .gallery-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
        .gallery-card img { width: 100%; display: block; aspect-ratio: 4/3; object-fit: cover; }

        /* ── Save/Auth Modal ── */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px); z-index: 200;
          display: flex; align-items: center; justify-content: center; padding: 16px;
          overflow-y: auto;
        }
        .modal-box {
          background: #F8F7F5; border-radius: 20px; padding: 40px;
          width: 100%; max-width: 460px; position: relative;
          box-shadow: 0 24px 80px rgba(0,0,0,0.25);
        }
        .form-field { margin-bottom: 20px; }
        .form-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; color: #1C1C1C; }
        .form-input {
          width: 100%; padding: 12px 14px; border: 1.5px solid #D8D8D8;
          border-radius: 10px; font-size: 16px; font-family: inherit;
          background: #FFF; box-sizing: border-box; outline: none;
          transition: border-color 0.15s;
        }
        .form-input:focus { border-color: #1C1C1C; }
        .form-input.error { border-color: #E53E3E; }
        .form-input.textarea { min-height: 80px; resize: vertical; }
        .form-hint { font-size: 11px; color: #888; margin-top: 5px; }
        .form-error { font-size: 11px; color: #E53E3E; margin-top: 5px; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .sketch-container { height: calc(100dvh - 60px); }
          .drawing-workspace { flex-direction: column-reverse; }
          
          /* Sleek single-row horizontal scrolling toolbar for mobile */
          .drawing-toolbar {
            width: 100%; height: auto; border-right: none; border-top: 1px solid #EBEBEB;
            flex-direction: row; padding: 10px 12px; overflow-x: auto; overflow-y: hidden;
            gap: 8px; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
            -webkit-overflow-scrolling: touch; /* Smooth iOS scrolling */
            scrollbar-width: none; /* Firefox */
          }
          .drawing-toolbar::-webkit-scrollbar { display: none; } /* Chrome/Safari */
          
          /* Keep sections in a single line, don't let them shrink */
          .toolbar-section { 
            flex-direction: row; border-bottom: none; border-right: 1px solid #E5E5E5; 
            padding: 0 12px 0 0 !important; flex-shrink: 0; flex-wrap: nowrap !important; gap: 8px !important;
            width: auto !important; align-items: center;
          }
          .toolbar-section:last-child { border-right: none; padding-right: 0; }
          
          .toolbar-btn { width: 40px; height: 40px; }
          .color-dot { width: 28px; height: 28px; }

          /* Stack the action buttons nicely */
          .drawing-actionbar { 
            grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px 16px 16px; 
          }
          .drawing-actionbar .action-btn:nth-child(1) { grid-column: 1; }
          .drawing-actionbar .action-btn:nth-child(2) { grid-column: 2; }
          .drawing-actionbar .action-btn:nth-child(3) { grid-column: 1 / -1; height: 50px; font-size: 0.85rem; }
          
          .gallery-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; padding: 0 12px 12px; }
          .modal-box { padding: 24px; border-radius: 16px; }
        }

        .no-custom-cursor * { cursor: auto !important; }
        @media(max-width: 768px) { .hide-sm { display: none; } }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          DRAWING SECTION
      ═══════════════════════════════════════════════════════ */}
      <div className="sketch-container">
        {/* Header */}
        <div style={{ padding: '10px 16px', textAlign: 'center', borderBottom: '1px solid #EBEBEB', background: '#F8F7F5', zIndex: 10 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', fontWeight: 300, margin: 0, color: '#1C1C1C', letterSpacing: '0.05em' }}>
            DRAW SOMETHING
          </h2>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', margin: '2px 0 0' }}>
            {hasDrawn ? 'Your sketch, your mark.' : 'A blank page is an invitation. Leave your mark.'}
          </p>
        </div>

        {/* Workspace */}
        <div className="drawing-workspace">

          {/* ── Toolbar ── */}
          <div className="drawing-toolbar">
            {/* Tools */}
            <div className="toolbar-section">
              {[
                { id: 'pencil',  icon: <Pencil size={18} />,       title: 'Pencil' },
                { id: 'pen',     icon: <PenTool size={18} />,      title: 'Pen' },
                { id: 'marker',  icon: <Highlighter size={18} />,  title: 'Marker' },
                { id: 'eraser',  icon: <Eraser size={18} />,       title: 'Eraser' },
                { id: 'pan',     icon: <MousePointer2 size={18} />,title: 'Pan' },
              ].map(t => (
                <button key={t.id} title={t.title} onClick={() => setTool(t.id)}
                  className={`toolbar-btn ${tool === t.id ? 'active' : ''}`}>
                  {t.icon}
                </button>
              ))}
            </div>

            {/* Colors */}
            <div className="toolbar-section" style={{ flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: '8px 6px' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={`color-dot ${color === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }} />
              ))}
              <label 
                className={`color-dot ${color === customColor && !COLORS.includes(customColor) ? 'active' : ''}`}
                style={{ 
                  backgroundColor: customColor,
                  border: '2px dashed #999',
                  position: 'relative', 
                  overflow: 'hidden', 
                  cursor: 'pointer'
                }}
                title="Custom colour"
              >
                <input type="color" value={customColor}
                  onChange={e => { setCustomColor(e.target.value); setColor(e.target.value); }}
                  style={{ opacity: 0, position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%', cursor: 'pointer', margin: 0, padding: 0 }}
                />
              </label>
            </div>

            {/* Sizes */}
            <div className="toolbar-section">
              {SIZES.map(s => (
                <button key={s} onClick={() => setSize(s)} title={`Size ${s}`}
                  style={{ 
                    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    border: 'none', background: 'transparent', cursor: 'pointer', flexShrink: 0 
                  }}>
                  <div style={{ 
                    width: Math.min(s * 1.5, 22), 
                    height: Math.min(s * 1.5, 22), 
                    borderRadius: '50%', 
                    background: '#333',
                    boxShadow: size === s ? '0 0 0 2px #FFF, 0 0 0 4px #333' : 'none',
                    transition: 'all 0.15s'
                  }} />
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="toolbar-section">
              <button className="toolbar-btn" onClick={undo} title="Undo"><Undo size={18} /></button>
              <button className="toolbar-btn" onClick={redo} title="Redo"><Redo size={18} /></button>
              <button className="toolbar-btn" onClick={clearCanvas} title="Clear" style={{ color: '#C0392B' }}><Trash2 size={18} /></button>
            </div>
          </div>

          {/* ── Canvas viewport ── */}
          <div
            ref={containerRef}
            className="drawing-canvas-area"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            style={{ touchAction: 'none' }}
          >
            {/* Zoom badge */}
            {zoom !== 1 && (
              <div onClick={resetZoom} style={{
                position: 'absolute', top: 12, right: 12, zIndex: 10,
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                padding: '6px 12px', borderRadius: '8px',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#1C1C1C',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}>
                {Math.round(zoom * 100)}% · Reset
              </div>
            )}

            {/* The paper sheet with visible border */}
            <div
              className="canvas-paper"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
              }}
            >
              {!hasDrawn && (
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', flexDirection: 'column', gap: 8
                }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', color: 'rgba(0,0,0,0.07)', letterSpacing: '0.1em' }}>
                    Start drawing here...
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(0,0,0,0.12)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Pencil · Pen · Marker
                  </span>
                </div>
              )}
              <canvas ref={canvasRef} style={{
                display: 'block', position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                cursor: tool === 'pan' ? 'grab' : tool === 'eraser' ? 'cell' : 'crosshair',
              }} />
            </div>
          </div>
        </div>

        {/* ── Action bar ── */}
        <div className="drawing-actionbar">
          <button className="action-btn" onClick={handleDownload}>
            <Download size={14} /><span className="hide-sm">DOWNLOAD</span>
          </button>
          <button className="action-btn" onClick={() => handleShare()}>
            <Share2 size={14} /><span className="hide-sm">SHARE</span>
          </button>
          <button className="action-btn primary" onClick={() => setShowSaveModal(true)}>
            PUBLISH TO GALLERY ✦
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          PUBLIC GALLERY
      ═══════════════════════════════════════════════════════ */}
      <div className="gallery-section" style={{ background: '#F2F0EC', paddingBottom: '4rem' }}>
        <div style={{ padding: '3.5rem 24px 2rem', textAlign: 'center' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '0 0 6px', color: '#1C1C1C', fontWeight: 400 }}>
            THE SKETCH GALLERY
          </h3>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', margin: 0 }}>
            Made by people who stopped by · Like your favourites
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid #DDD', paddingBottom: 0 }}>
          {['LATEST', 'POPULAR', 'MY SKETCHES'].map(f => (
            <button key={f} onClick={() => setGalleryFilter(f)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: galleryFilter === f ? 700 : 400,
              color: galleryFilter === f ? '#1C1C1C' : '#999',
              padding: '0 0 12px', borderBottom: galleryFilter === f ? '2px solid #1C1C1C' : '2px solid transparent',
              marginBottom: '-1px', minHeight: 44,
            }}>
              {f}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {artworks.map(art => (
            <div key={art.id} className="gallery-card" onClick={() => setSelectedArtwork(art)}>
              <img src={art.imageUrl} alt={art.title} loading="lazy" />
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: '0 0 2px', fontSize: '0.88rem', color: '#1C1C1C', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {art.title}
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#888' }}>by {art.username}</span>
                    {art.caption && (
                      <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#666', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {art.caption}
                      </p>
                    )}
                  </div>
                  {/* Like button */}
                  <button
                    onClick={e => { e.stopPropagation(); handleLike(art.id); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                      color: art.isLiked ? '#E53E3E' : '#AAA', minWidth: 44, minHeight: 44, justifyContent: 'center',
                      borderRadius: 8, transition: 'all 0.15s',
                      flexShrink: 0,
                    }}
                  >
                    <Heart size={18} fill={art.isLiked ? '#E53E3E' : 'none'} color={art.isLiked ? '#E53E3E' : '#AAA'} />
                    <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>{art.likesCount || ''}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {artworks.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 1rem', color: '#AAA' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✏️</div>
              <p style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>No sketches yet. Draw something and be the first!</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SAVE / PUBLISH MODAL
      ═══════════════════════════════════════════════════════ */}
      {showSaveModal && (
        <div className="modal-overlay no-custom-cursor" onClick={e => { if (e.target === e.currentTarget) setShowSaveModal(false); }}>
          <div className="modal-box">
            <button onClick={() => setShowSaveModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', padding: 8, borderRadius: 8, color: '#666', display: 'flex' }}>
              <X size={22} />
            </button>

            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.9rem', margin: '0 0 4px', color: '#1C1C1C', fontWeight: 400 }}>
              Publish Your Sketch
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#888', margin: '0 0 28px', lineHeight: 1.5 }}>
              Your artwork will appear in the public gallery for everyone to see and like.
            </p>

            <form onSubmit={handleSaveSubmit} noValidate>
              {/* Name */}
              <div className="form-field">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className={`form-input ${authErrors.name ? 'error' : ''}`}
                  placeholder="e.g. Ahmed"
                  value={authUsername}
                  autoComplete="name"
                  onChange={e => { setAuthUsername(e.target.value); setAuthErrors(p => ({ ...p, name: null })); }}
                />
                {authErrors.name
                  ? <div className="form-error">{authErrors.name}</div>
                  : <div className="form-hint">This name will appear with your sketch in the gallery.</div>
                }
              </div>

              {/* Email */}
              <div className="form-field">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className={`form-input ${authErrors.email ? 'error' : ''}`}
                  placeholder="e.g. you@example.com"
                  value={authEmail}
                  autoComplete="email"
                  onChange={e => { setAuthEmail(e.target.value); setAuthErrors(p => ({ ...p, email: null })); }}
                />
                {authErrors.email
                  ? <div className="form-error">{authErrors.email}</div>
                  : <div className="form-hint">Used to identify your account. Not shown publicly.</div>
                }
              </div>

              {/* Artwork Title */}
              <div className="form-field">
                <label className="form-label">Artwork Title</label>
                <input
                  type="text"
                  className={`form-input ${authErrors.title ? 'error' : ''}`}
                  placeholder="Give your sketch a name…"
                  value={artworkTitle}
                  onChange={e => { setArtworkTitle(e.target.value); setAuthErrors(p => ({ ...p, title: null })); }}
                />
                {authErrors.title
                  ? <div className="form-error">{authErrors.title}</div>
                  : <div className="form-hint">e.g. "Quiet Morning" or "Face Study #3"</div>
                }
              </div>

              {/* Caption / Story */}
              <div className="form-field">
                <label className="form-label">Caption / Story <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
                <textarea
                  className="form-input textarea"
                  placeholder="Tell a story, share a thought, or leave it blank…"
                  value={artworkCaption}
                  onChange={e => setArtworkCaption(e.target.value)}
                  rows={3}
                />
                <div className="form-hint">Appears on your gallery card for others to read.</div>
              </div>

              <button type="submit" className="action-btn primary" disabled={isSaving}
                style={{ width: '100%', height: 52, fontSize: '0.88rem', marginTop: 4, borderRadius: 12, opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? 'Publishing…' : 'PUBLISH TO GALLERY ✦'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          ARTWORK LIGHTBOX
      ═══════════════════════════════════════════════════════ */}
      {selectedArtwork && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => setSelectedArtwork(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#FFF', cursor: 'pointer', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <X size={22} />
          </button>

          {/* Image */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '56px 24px 0' }}>
            <img src={selectedArtwork.imageUrl} alt={selectedArtwork.title}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 4, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }} />
          </div>

          {/* Info bar */}
          <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: 16, maxWidth: 860, margin: '0 auto', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: '0 0 2px', color: '#FFF', fontSize: '1.4rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: 400 }}>
                {selectedArtwork.title}
              </h3>
              <span style={{ color: '#AAA', fontSize: '0.8rem' }}>by {selectedArtwork.username}</span>
              {selectedArtwork.caption && (
                <p style={{ margin: '10px 0 0', color: '#CCC', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: 520 }}>
                  {selectedArtwork.caption}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
              {/* Like */}
              <button
                onClick={() => handleLike(selectedArtwork.id)}
                style={{
                  background: selectedArtwork.isLiked ? 'rgba(229,62,62,0.15)' : 'rgba(255,255,255,0.08)',
                  border: '1px solid', borderColor: selectedArtwork.isLiked ? '#E53E3E' : 'rgba(255,255,255,0.2)',
                  color: selectedArtwork.isLiked ? '#E53E3E' : '#FFF',
                  cursor: 'pointer', borderRadius: 10, padding: '0 16px', height: 44,
                  display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600,
                  transition: 'all 0.15s',
                }}
              >
                <Heart size={16} fill={selectedArtwork.isLiked ? '#E53E3E' : 'none'} />
                {selectedArtwork.likesCount > 0 ? selectedArtwork.likesCount : ''} LIKE
              </button>

              {/* Share */}
              <button onClick={() => handleShare(selectedArtwork.imageUrl)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', cursor: 'pointer', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                <Share2 size={16} />
              </button>

              {/* Delete (own art) */}
              {user && user.id === selectedArtwork.userId && (
                <button onClick={() => handleDelete(selectedArtwork.id)} style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)', color: '#E53E3E', cursor: 'pointer', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          RESUME MODAL
      ═══════════════════════════════════════════════════════ */}
      {showResumeModal && (
        <div className="modal-overlay no-custom-cursor">
          <div className="modal-box" style={{ textAlign: 'center', maxWidth: 380 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✏️</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', margin: '0 0 8px', color: '#1C1C1C', fontWeight: 400 }}>
              Continue Your Sketch?
            </h3>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 28px', lineHeight: 1.5 }}>
              You have an unfinished sketch from your last visit.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={startNewSketch} className="action-btn" style={{ flex: 1 }}>Start New</button>
              <button onClick={resumeSketch} className="action-btn primary" style={{ flex: 1 }}>Continue</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
