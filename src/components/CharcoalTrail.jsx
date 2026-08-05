import React, { useEffect, useRef } from 'react';

export default function CharcoalTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Store points: { x, y, age }
    let points = [];
    let rafId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Track mouse
    const onMouseMove = (e) => {
      points.push({ x: e.clientX, y: e.clientY, age: 0 });
    };
    window.addEventListener('mousemove', onMouseMove);

    // Draw loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Filter out points that are too old
      points = points.filter(p => p.age < 60);
      
      // Age the points
      points.forEach(p => p.age += 1);

      if (points.length > 1) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        for (let i = 1; i < points.length; i++) {
          const p1 = points[i - 1];
          const p2 = points[i];
          
          // Calculate distance to determine if we should draw (ignore huge jumps)
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          if (dist > 200) continue; 
          
          const progress = p2.age / 60; // 0 to 1
          const opacity = Math.max(0, 1 - progress);
          
          // Main thick charcoal stroke
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(40, 40, 40, ${opacity * 0.15})`;
          ctx.lineWidth = 14 + (progress * 4);
          ctx.stroke();

          // Core darker stroke
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(20, 20, 20, ${opacity * 0.4})`;
          ctx.lineWidth = 4 + (progress * 2);
          ctx.stroke();

          // Noise/Texture strokes simulating charcoal dust
          for (let j = 0; j < 3; j++) {
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            ctx.beginPath();
            ctx.moveTo(p1.x + offsetX, p1.y + offsetY);
            ctx.lineTo(p2.x + offsetX, p2.y + offsetY);
            ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      rafId = requestAnimationFrame(draw);
    };
    
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999995, // Just below the cursor
        mixBlendMode: 'multiply',
        background: 'transparent',
      }}
    />
  );
}
