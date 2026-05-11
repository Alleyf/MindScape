import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide,
  type SimulationNodeDatum, type SimulationLinkDatum,
} from 'd3-force';
import { select, zoom, event as d3Event } from 'd3-zoom';
import { select as d3Select } from 'd3-selection';
import { Note } from '../utils/noteLoader';

interface GraphNode extends SimulationNodeDatum {
  id: string;
  label: string;
  group: number;
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  strength: number;
}

interface NoteGraphProps {
  notes: Note[];
}

export function NoteGraph({ notes }: NoteGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current || notes.length === 0) return;

    const svg = d3Select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = Math.max(400, window.innerHeight * 0.7);

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Build graph data
    const tagNotes = new Map<string, string[]>();
    notes.forEach((n) => {
      n.tags?.forEach((t) => {
        if (!tagNotes.has(t)) tagNotes.set(t, []);
        tagNotes.get(t)!.push(n.slug);
      });
    });

    const linkMap = new Map<string, { source: string; target: string; strength: number }>();
    for (const [, slugs] of tagNotes) {
      for (let i = 0; i < slugs.length; i++) {
        for (let j = i + 1; j < slugs.length; j++) {
          const key = [slugs[i], slugs[j]].sort().join('::');
          if (linkMap.has(key)) {
            linkMap.get(key)!.strength++;
          } else {
            linkMap.set(key, { source: slugs[i], target: slugs[j], strength: 1 });
          }
        }
      }
    }

    const nodes: GraphNode[] = notes.map((n, i) => ({
      id: n.slug,
      label: n.title,
      group: i,
    }));
    const links: GraphLink[] = Array.from(linkMap.values()).map((l) => ({
      source: l.source,
      target: l.target,
      strength: l.strength,
    }));

    // Create zoom behavior
    const g = svg.append('g');
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoomBehavior);

    // Add arrow marker for links
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'var(--border-soft)');

    // Links
    const link = g.append('g')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', 'var(--border-soft)')
      .attr('stroke-width', (d) => Math.min(d.strength * 1.5, 4))
      .attr('opacity', (d) => Math.min(0.2 + d.strength * 0.15, 0.6));

    // Nodes
    const nodeGroup = g.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .on('click', (_event, d) => navigate(`/note/${d.id}`));

    nodeGroup.append('circle')
      .attr('r', 8)
      .attr('fill', 'var(--nebula-accent)')
      .attr('stroke', 'var(--surface-strong)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.85);

    nodeGroup.append('text')
      .text((d) => d.label)
      .attr('dx', 14)
      .attr('dy', 4)
      .attr('fill', 'var(--text-muted)')
      .attr('font-size', '12px')
      .attr('font-family', 'var(--ui-font)');

    // Simulation
    const sim = forceSimulation(nodes)
      .force('link', forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(100))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide(30))
      .on('tick', () => {
        link
          .attr('x1', (d) => (d.source as GraphNode).x!)
          .attr('y1', (d) => (d.source as GraphNode).y!)
          .attr('x2', (d) => (d.target as GraphNode).x!)
          .attr('y2', (d) => (d.target as GraphNode).y!);
        nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

    return () => { sim.stop(); };
  }, [notes, navigate]);

  return (
    <div className="note-graph-container">
      <svg ref={svgRef} className="note-graph-svg" />
    </div>
  );
}
