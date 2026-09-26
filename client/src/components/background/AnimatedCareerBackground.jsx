import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AnimatedCareerBackground
 * 
 * A high-performance, career-focused animated background canvas system.
 * Subtly communicates: Resume -> Skills -> AI Analysis -> Job Matching -> Career Growth
 * 
 * Strict Palette:
 * - Deep Plum / Burgundy (#4A1525, #6B1D36)
 * - Warm Terracotta (#C85A32, #E07A5F)
 * - Soft Sage / Olive (#5B7065, #8F9E8B)
 * - Warm Amber (#D97706, #F59E0B)
 * - Base Light: Warm Ivory (#FAF8F5) / Base Dark: Deep Charcoal (#0F0A0D)
 * 
 * Features:
 * - Canvas 2D engine with zero DOM bloat
 * - Multi-layered: Ambient light drift, organic career network lines, pulsing nodes, traveling data pulses
 * - Variants: 'home', 'builder', 'matcher', 'tools', 'jobs', 'career', 'profile'
 * - Matcher variant supports dynamic connecting bridge between Resume & Job networks
 * - Responsive node density (Mobile: 12, Tablet: 22, Desktop: 36, Ultra-wide: 44)
 * - Subtly reactive cursor physics for desktop (disabled on mobile)
 * - Prefers-reduced-motion support (renders static frame)
 */

export default function AnimatedCareerBackground({
  variant = 'home',
  isMatching = false,
  className = '',
}) {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse tracking state (desktop only)
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      radius: 140,
    };

    // Color definitions based on theme
    const colors = isDark
      ? {
          plumLine: 'rgba(180, 70, 100, 0.14)',
          terracottaLine: 'rgba(224, 122, 95, 0.12)',
          amberLine: 'rgba(245, 158, 11, 0.14)',
          sageLine: 'rgba(143, 158, 139, 0.10)',
          plumNode: 'rgba(180, 70, 100, 0.50)',
          terracottaNode: 'rgba(224, 122, 95, 0.55)',
          amberNode: 'rgba(245, 158, 11, 0.60)',
          sageNode: 'rgba(143, 158, 139, 0.45)',
          pulse: 'rgba(245, 158, 11, 0.75)',
          bridgeLine: 'rgba(224, 122, 95, 0.35)',
          ambient1: 'rgba(74, 21, 37, 0.15)', // Deep Plum
          ambient2: 'rgba(107, 29, 54, 0.10)', // Burgundy
          ambient3: 'rgba(217, 119, 6, 0.06)', // Amber
        }
      : {
          plumLine: 'rgba(74, 21, 37, 0.08)',
          terracottaLine: 'rgba(200, 90, 50, 0.07)',
          amberLine: 'rgba(217, 119, 6, 0.08)',
          sageLine: 'rgba(91, 112, 101, 0.06)',
          plumNode: 'rgba(74, 21, 37, 0.28)',
          terracottaNode: 'rgba(200, 90, 50, 0.30)',
          amberNode: 'rgba(217, 119, 6, 0.35)',
          sageNode: 'rgba(91, 112, 101, 0.25)',
          pulse: 'rgba(200, 90, 50, 0.55)',
          bridgeLine: 'rgba(200, 90, 50, 0.25)',
          ambient1: 'rgba(245, 158, 11, 0.035)', // Warm Amber
          ambient2: 'rgba(224, 122, 95, 0.025)', // Terracotta
          ambient3: 'rgba(91, 112, 101, 0.025)', // Sage
        };

    // Topology nodes & pulses
    let nodes = [];
    let pulses = [];
    let ambientLights = [];

    // Helper: Determine node count based on screen width
    const getNodeCount = (w) => {
      if (w < 640) return 12; // Mobile
      if (w < 1024) return 22; // Tablet
      if (w < 1600) return 34; // Laptop/Desktop
      return 42; // Large monitor
    };

    // Initialize ambient drift lights
    const initAmbientLights = () => {
      ambientLights = [
        {
          x: width * 0.2,
          y: height * 0.25,
          radius: Math.min(width, height) * 0.55,
          color: colors.ambient1,
          vx: 0.08,
          vy: 0.05,
          angle: 0,
        },
        {
          x: width * 0.8,
          y: height * 0.7,
          radius: Math.min(width, height) * 0.6,
          color: colors.ambient2,
          vx: -0.06,
          vy: 0.07,
          angle: Math.PI / 2,
        },
        {
          x: width * 0.5,
          y: height * 0.85,
          radius: Math.min(width, height) * 0.45,
          color: colors.ambient3,
          vx: 0.04,
          vy: -0.06,
          angle: Math.PI,
        },
      ];
    };

    // Initialize Nodes according to current variant
    const initTopology = () => {
      const count = getNodeCount(width);
      nodes = [];
      pulses = [];

      const types = ['plum', 'terracotta', 'amber', 'sage'];

      if (variant === 'matcher') {
        // DUAL NETWORKS: Left = Resume Network, Right = Job Network
        const halfCount = Math.floor(count / 2);

        // Resume Network (Left half: x in 0.05 to 0.42)
        for (let i = 0; i < halfCount; i++) {
          const normX = 0.06 + Math.random() * 0.36;
          const normY = 0.12 + Math.random() * 0.76;
          nodes.push(createNode(normX, normY, types[i % types.length], 'resume'));
        }

        // Job Network (Right half: x in 0.58 to 0.94)
        for (let i = 0; i < halfCount; i++) {
          const normX = 0.58 + Math.random() * 0.36;
          const normY = 0.12 + Math.random() * 0.76;
          nodes.push(createNode(normX, normY, types[(i + 2) % types.length], 'job'));
        }

        // Add 2 Bridge Nodes in the center if matching is active
        if (isMatching) {
          nodes.push(createNode(0.48, 0.45, 'amber', 'bridge'));
          nodes.push(createNode(0.52, 0.55, 'terracotta', 'bridge'));
        }
      } else if (variant === 'builder') {
        // Structured document and perimeter skill guides
        for (let i = 0; i < count; i++) {
          let normX, normY;
          if (i < count * 0.4) {
            // Document left spine
            normX = 0.08 + (Math.random() * 0.12);
            normY = 0.1 + ((i / (count * 0.4)) * 0.8) + (Math.random() * 0.05);
          } else if (i < count * 0.7) {
            // Right preview perimeter
            normX = 0.78 + (Math.random() * 0.16);
            normY = 0.15 + (Math.random() * 0.7);
          } else {
            // Central flow
            normX = 0.25 + (Math.random() * 0.5);
            normY = 0.1 + (Math.random() * 0.8);
          }
          nodes.push(createNode(normX, normY, types[i % types.length], 'builder'));
        }
      } else if (variant === 'career') {
        // Stepwise diagonal career progression path (Bottom-Left to Top-Right)
        for (let i = 0; i < count; i++) {
          const progress = i / count;
          const normX = 0.1 + (progress * 0.8) + ((Math.random() - 0.5) * 0.18);
          const normY = 0.85 - (progress * 0.7) + ((Math.random() - 0.5) * 0.15);
          nodes.push(createNode(Math.max(0.05, Math.min(0.95, normX)), Math.max(0.08, Math.min(0.92, normY)), types[i % types.length], 'career'));
        }
      } else if (variant === 'jobs') {
        // Branching tree of opportunity vectors from bottom-center
        for (let i = 0; i < count; i++) {
          const angle = -Math.PI * (0.15 + Math.random() * 0.7); // upward fan
          const dist = 0.2 + Math.random() * 0.65;
          const normX = 0.5 + Math.cos(angle) * dist * 0.75;
          const normY = 0.9 + Math.sin(angle) * dist;
          nodes.push(createNode(Math.max(0.05, Math.min(0.95, normX)), Math.max(0.08, Math.min(0.92, normY)), types[i % types.length], 'jobs'));
        }
      } else if (variant === 'tools') {
        // Orbiting skill cluster & intelligence hubs
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.3);
          const r = 0.15 + (Math.random() * 0.3);
          const normX = 0.5 + Math.cos(angle) * r * (height / width);
          const normY = 0.5 + Math.sin(angle) * r;
          nodes.push(createNode(Math.max(0.05, Math.min(0.95, normX)), Math.max(0.08, Math.min(0.92, normY)), types[i % types.length], 'tools'));
        }
      } else {
        // Default / 'home' / 'dashboard': Organic flowing career network
        for (let i = 0; i < count; i++) {
          const normX = 0.05 + Math.random() * 0.9;
          const normY = 0.08 + Math.random() * 0.84;
          nodes.push(createNode(normX, normY, types[i % types.length], 'default'));
        }
      }

      // Initialize a small number of traveling pulses (1 to 3)
      const pulseCount = width < 640 ? 1 : width < 1024 ? 2 : 3;
      for (let p = 0; p < pulseCount; p++) {
        createPulse();
      }
    };

    const createNode = (normX, normY, type, group) => {
      const radius = 1.8 + Math.random() * 1.8;
      return {
        normX,
        normY,
        x: normX * width,
        y: normY * height,
        baseX: normX * width,
        baseY: normY * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius,
        type,
        group,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03, // 4-8s cycle
        dispX: 0,
        dispY: 0,
      };
    };

    const createPulse = () => {
      if (nodes.length < 2) return;
      const startIndex = Math.floor(Math.random() * nodes.length);
      const startNode = nodes[startIndex];

      // Find a suitable neighbor
      let targetIndex = -1;
      let minDist = Infinity;
      const maxConnectDist = Math.min(width, height) * 0.35;

      nodes.forEach((n, idx) => {
        if (idx === startIndex) return;
        if (variant === 'matcher' && !isMatching && startNode.group !== n.group) return; // don't cross unless matching
        const dx = n.x - startNode.x;
        const dy = n.y - startNode.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxConnectDist && dist < minDist) {
          minDist = dist;
          targetIndex = idx;
        }
      });

      if (targetIndex !== -1) {
        pulses.push({
          fromIndex: startIndex,
          toIndex: targetIndex,
          progress: 0,
          speed: 0.004 + Math.random() * 0.005, // slow flow
        });
      }
    };

    // Resize handler with High-DPI support
    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      initAmbientLights();
      initTopology();

      // If reduced motion is requested, render once and stop
      if (reducedMotion) {
        renderStaticFrame();
      }
    };

    // Mouse handlers (only active on devices with hover capability)
    const handleMouseMove = (e) => {
      if (window.matchMedia('(hover: hover)').matches) {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initial setup
    handleResize();

    // Render static frame for accessibility / reduced motion
    const renderStaticFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // Render faint ambient glow
      ambientLights.forEach((light) => {
        const grad = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
        grad.addColorStop(0, light.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Connect nodes with max distance
      const maxDist = Math.min(width, height) * (width < 640 ? 0.32 : 0.24);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          if (variant === 'matcher' && !isMatching && n1.group !== n2.group) continue;
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alphaRatio = 1 - dist / maxDist;
            ctx.strokeStyle = n1.type === 'plum' ? colors.plumLine : colors.terracottaLine;
            ctx.lineWidth = 0.75;
            ctx.globalAlpha = alphaRatio * 0.8;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // Draw static nodes
      nodes.forEach((n) => {
        ctx.fillStyle = colors[`${n.type}Node`] || colors.plumNode;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    if (reducedMotion) {
      renderStaticFrame();
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    // Main 60fps Animation Loop
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      // 1. Layer: Ambient Light Movement
      ambientLights.forEach((light) => {
        light.angle += 0.003;
        light.x += Math.cos(light.angle) * light.vx * 15;
        light.y += Math.sin(light.angle) * light.vy * 15;

        // Keep inside bounds
        if (light.x < -100) light.x = width + 100;
        if (light.x > width + 100) light.x = -100;
        if (light.y < -100) light.y = height + 100;
        if (light.y > height + 100) light.y = -100;

        const grad = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
        grad.addColorStop(0, light.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.1;
        mouse.y += (mouse.targetY - mouse.y) * 0.1;
      }

      // 2. Layer: Update Nodes
      nodes.forEach((node) => {
        // Natural organic drift around base anchor
        node.baseX += node.vx;
        node.baseY += node.vy;

        const margin = 40;
        if (node.baseX < margin || node.baseX > width - margin) node.vx *= -1;
        if (node.baseY < margin || node.baseY > height - margin) node.vy *= -1;

        // Interactive mouse displacement (desktop only)
        if (mouse.active) {
          const dx = node.baseX - mouse.x;
          const dy = node.baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 18; // Max 18px soft push
            node.dispX += ((dx / dist) * force - node.dispX) * 0.15;
            node.dispY += ((dy / dist) * force - node.dispY) * 0.15;
          } else {
            node.dispX += (0 - node.dispX) * 0.08;
            node.dispY += (0 - node.dispY) * 0.08;
          }
        } else {
          node.dispX += (0 - node.dispX) * 0.08;
          node.dispY += (0 - node.dispY) * 0.08;
        }

        node.x = node.baseX + node.dispX;
        node.y = node.baseY + node.dispY;

        // Breathing pulse phase
        node.pulsePhase += node.pulseSpeed;
      });

      // 3. Layer: Network Lines
      const maxDist = Math.min(width, height) * (width < 640 ? 0.32 : 0.22);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];

          // For matcher variant: don't connect across groups unless matching is active
          const isCrossGroup = variant === 'matcher' && n1.group !== n2.group;
          if (isCrossGroup && !isMatching && n1.group !== 'bridge' && n2.group !== 'bridge') {
            continue;
          }

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Effective connection distance (bridge can reach farther during active match)
          const effMaxDist = isCrossGroup || n1.group === 'bridge' || n2.group === 'bridge' ? maxDist * 1.6 : maxDist;

          if (dist < effMaxDist) {
            const alphaRatio = Math.max(0, 1 - dist / effMaxDist);
            
            if (isCrossGroup || isMatching) {
              ctx.strokeStyle = colors.bridgeLine;
              ctx.lineWidth = 1.0;
              ctx.globalAlpha = alphaRatio * 0.9;
            } else {
              ctx.strokeStyle = n1.type === 'plum' ? colors.plumLine : n1.type === 'amber' ? colors.amberLine : colors.terracottaLine;
              ctx.lineWidth = 0.75;
              ctx.globalAlpha = alphaRatio * 0.75;
            }

            // Subtle curved line for organic feel
            const midX = (n1.x + n2.x) / 2 + Math.sin(n1.pulsePhase) * 3;
            const midY = (n1.y + n2.y) / 2 + Math.cos(n2.pulsePhase) * 3;

            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      // 4. Layer: Nodes and Pulse Rings
      nodes.forEach((node) => {
        const pulseFactor = 0.85 + Math.sin(node.pulsePhase) * 0.25;
        const currentRadius = node.radius * pulseFactor;

        // Faint outer pulse halo
        const haloColor = colors[`${node.type}Node`] || colors.plumNode;
        ctx.fillStyle = haloColor;
        ctx.globalAlpha = 0.25 * pulseFactor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Solid core node
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 5. Layer: Data Pulses Traveling along connections
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        const fromNode = nodes[pulse.fromIndex];
        const toNode = nodes[pulse.toIndex];

        if (!fromNode || !toNode) {
          pulses.splice(p, 1);
          createPulse();
          continue;
        }

        const px = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
        const py = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;

        // Draw traveling pulse with trail
        ctx.fillStyle = colors.pulse;
        ctx.globalAlpha = Math.sin(pulse.progress * Math.PI) * 0.9;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          createPulse();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [variant, isMatching, isDark, reducedMotion]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
