"use client";

import React, { useRef, useEffect } from "react";

export default function VolatilityGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & target state
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      radius: 200,
      strength: 55,
    };

    // Grid nodes configurations
    const gridSpacing = 40; // Spacing matching our CSS grid background size
    interface Node {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
    }
    
    let nodes: Node[] = [];
    let cols = 0;
    let rows = 0;

    // Initialize nodes at grid intersections with safety offsets
    const initNodes = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      cols = Math.ceil(width / gridSpacing) + 3;
      rows = Math.ceil(height / gridSpacing) + 3;
      nodes = [];

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Offset by -1 gridSpacing so the grid bleeds off-screen cleanly
          const x = (c - 1) * gridSpacing;
          const y = (r - 1) * gridSpacing;
          nodes.push({
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    initNodes();

    // Resize handler
    const handleResize = () => {
      initNodes();
    };

    // Mouse motion handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Scroll tracking state
    let scrollY = 0;
    let lastScrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse movement with linear interpolation (Lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Scroll speed tracking
      const scrollDelta = scrollY - lastScrollY;
      lastScrollY += (scrollY - lastScrollY) * 0.12; // Smooth out scrolling velocity

      // 1. Update node physics
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node) continue;

        // Interaction A: Mouse repeller warp
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let forceX = 0;
        let forceY = 0;

        if (dist < mouse.radius && dist > 0) {
          // Warp calculation (spring strength repels nodes based on proximity)
          const dirX = dx / dist;
          const dirY = dy / dist;
          const factor = (mouse.radius - dist) / mouse.radius; // 0 (outer) to 1 (inner)
          const push = factor * mouse.strength;
          
          forceX = dirX * push;
          forceY = dirY * push;
        }

        // Interaction B: Elastic Scroll Momentum (100% Glitch-free continuous vertical deflection)
        // Nodes flex elastically proportional to scroll speed and automatically spring back
        let scrollForceY = 0;
        if (Math.abs(scrollDelta) > 0.05) {
          scrollForceY = -scrollDelta * 0.12;
        }

        // Return forces (Hooke's spring-physics returning nodes to original positions)
        const springForceX = (node.baseX - node.x) * 0.08;
        const springForceY = (node.baseY - node.y) * 0.08;

        // Apply velocities with damping (0.82 friction)
        node.vx = (node.vx + springForceX + forceX) * 0.82;
        node.vy = (node.vy + springForceY + forceY + scrollForceY) * 0.82;

        node.x += node.vx;
        node.y += node.vy;
      }

      // 2. Draw Grid Lines (connecting neighboring nodes)
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(229, 226, 225, 0.09)"; // Stark grid matching theme

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const currIdx = c * rows + r;
          const rightIdx = (c + 1) * rows + r;
          const bottomIdx = c * rows + (r + 1);

          const curr = nodes[currIdx];
          
          // Draw horizontal connection to the right neighbor
          if (c < cols - 1) {
            const right = nodes[rightIdx];
            if (curr && right) {
              ctx.beginPath();
              ctx.moveTo(curr.x, curr.y);
              ctx.lineTo(right.x, right.y);
              ctx.stroke();
            }
          }

          // Draw vertical connection to the bottom neighbor
          if (r < rows - 1) {
            const bottom = nodes[bottomIdx];
            if (curr && bottom) {
              ctx.beginPath();
              ctx.moveTo(curr.x, curr.y);
              ctx.lineTo(bottom.x, bottom.y);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Draw mouse cursor visual glow aura (wow factor pop)
      if (mouse.x > -500 && mouse.y > -500) {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          mouse.radius * 1.1
        );
        gradient.addColorStop(0, "rgba(255, 79, 0, 0.08)"); // Zenith signature orange pop!
        gradient.addColorStop(0.5, "rgba(255, 79, 0, 0.02)");
        gradient.addColorStop(1, "rgba(255, 79, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.arc(mouse.x, mouse.y, mouse.radius * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-transparent"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
