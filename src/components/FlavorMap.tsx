import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { cocktails } from '../data/cocktails';
import type { Cocktail } from '../types';
import { dominantFlavor, getClusterAnchors, flavorDistance, FLAVOR_COLORS, FLAVOR_AXES } from '../utils/flavorClustering';
import type { FlavorAxis } from '../utils/flavorClustering';
import RecipeModal from './RecipeModal';

interface SimNode extends d3.SimulationNodeDatum {
  cocktail: Cocktail;
  dominant: FlavorAxis;
  radius: number;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  distance: number;
}

export default function FlavorMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<SimNode | null>(null);
  const [modalCocktail, setModalCocktail] = useState<Cocktail | null>(null);
  const simulationRef = useRef<d3.Simulation<SimNode, SimLink> | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = Math.max(500, Math.min(w * 0.65, 700));
        setDimensions({ width: w, height: h });
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const initSimulation = useCallback(() => {
    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const anchors = getClusterAnchors(width, height);

    const nodes: SimNode[] = cocktails.map((c) => ({
      cocktail: c,
      dominant: dominantFlavor(c.flavorProfile),
      radius: 6 + c.ingredients.length * 1.2,
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200,
    }));

    const links: SimLink[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = flavorDistance(nodes[i].cocktail.flavorProfile, nodes[j].cocktail.flavorProfile);
        if (dist < 3.5) {
          links.push({ source: nodes[i], target: nodes[j], distance: dist });
        }
      }
    }

    const defs = svg.append('defs');
    const glowFilter = defs.append('filter').attr('id', 'glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    const merge = glowFilter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const linkGroup = svg.append('g');
    const nodeGroup = svg.append('g');
    const labelGroup = svg.append('g');

    linkGroup
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.04)')
      .attr('stroke-width', 0.5);

    FLAVOR_AXES.forEach((axis) => {
      const anchor = anchors[axis];
      labelGroup
        .append('text')
        .attr('x', anchor.x)
        .attr('y', anchor.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', FLAVOR_COLORS[axis])
        .attr('opacity', 0.35)
        .attr('font-size', '13px')
        .attr('font-weight', '600')
        .attr('font-family', 'Space Grotesk, sans-serif')
        .text(axis.charAt(0).toUpperCase() + axis.slice(1));
    });

    const nodeElements = nodeGroup
      .selectAll<SVGCircleElement, SimNode>('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => d.cocktail.color)
      .attr('opacity', 0.75)
      .attr('stroke', (d) => d.cocktail.color)
      .attr('stroke-width', 1)
      .attr('stroke-opacity', 0.3)
      .attr('filter', 'url(#glow)')
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => {
        setHoveredNode(d);
        d3.select(_.currentTarget as SVGCircleElement)
          .transition()
          .duration(150)
          .attr('r', d.radius * 1.5)
          .attr('opacity', 1);
      })
      .on('mouseleave', (_, d) => {
        setHoveredNode(null);
        d3.select(_.currentTarget as SVGCircleElement)
          .transition()
          .duration(150)
          .attr('r', d.radius)
          .attr('opacity', 0.75);
      })
      .on('click', (_, d) => {
        setModalCocktail(d.cocktail);
      });

    const drag = d3.drag<SVGCircleElement, SimNode>()
      .on('start', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeElements.call(drag);

    const simulation = d3
      .forceSimulation<SimNode>(nodes)
      .force('charge', d3.forceManyBody().strength(-25))
      .force('collision', d3.forceCollide<SimNode>().radius((d) => d.radius + 2))
      .force(
        'link',
        d3.forceLink<SimNode, SimLink>(links).strength(0.015),
      )
      .force(
        'x',
        d3.forceX<SimNode>((d) => anchors[d.dominant].x).strength(0.08),
      )
      .force(
        'y',
        d3.forceY<SimNode>((d) => anchors[d.dominant].y).strength(0.08),
      )
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.01))
      .on('tick', () => {
        linkGroup
          .selectAll<SVGLineElement, SimLink>('line')
          .attr('x1', (d) => (d.source as SimNode).x!)
          .attr('y1', (d) => (d.source as SimNode).y!)
          .attr('x2', (d) => (d.target as SimNode).x!)
          .attr('y2', (d) => (d.target as SimNode).y!);

        nodeElements.attr('cx', (d) => d.x!).attr('cy', (d) => d.y!);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [dimensions]);

  useEffect(() => {
    initSimulation();
  }, [initSimulation]);

  return (
    <section id="flavor-map" className="section" style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">Flavor Map</h2>
        <p className="section-subtitle">
          Every cocktail is a point in flavor space. Similar drinks cluster together. Drag, hover, and click to explore.
        </p>
      </motion.div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
        }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          style={{ display: 'block' }}
        />

        {hoveredNode && (
          <div
            style={{
              position: 'absolute',
              left: Math.min((hoveredNode.x || 0) + 16, dimensions.width - 200),
              top: Math.max((hoveredNode.y || 0) - 60, 0),
              background: 'rgba(20, 18, 40, 0.95)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              padding: '10px 14px',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '140px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>{hoveredNode.cocktail.imageEmoji}</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f0e6ff' }}>
                {hoveredNode.cocktail.name}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: `${FLAVOR_COLORS[hoveredNode.dominant]}20`,
                  color: FLAVOR_COLORS[hoveredNode.dominant],
                  fontWeight: 600,
                }}
              >
                {hoveredNode.dominant}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(240,230,255,0.5)',
                }}
              >
                {hoveredNode.cocktail.difficulty}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      <p style={{ fontSize: '12px', color: 'rgba(240,230,255,0.25)', marginTop: '12px', textAlign: 'center' }}>
        Drag nodes to explore. Click any cocktail to see the full recipe.
      </p>

      <RecipeModal cocktail={modalCocktail} onClose={() => setModalCocktail(null)} />
    </section>
  );
}
