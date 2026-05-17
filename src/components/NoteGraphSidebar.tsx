import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide,
  type SimulationNodeDatum, type SimulationLinkDatum,
} from 'd3-force';
import { select as d3Select } from 'd3-selection';
import { Note } from '../utils/noteLoader';

interface SidebarNode extends SimulationNodeDatum {
  id: string;
  label: string;
  isCurrent: boolean;
  connectionCount: number;
}

interface SidebarLink extends SimulationLinkDatum<SidebarNode> {
  strength: number;
}

interface NoteGraphSidebarProps {
  currentNote: Note;
  allNotes: Note[];
  relatedNotes?: Note[];
  className?: string;
  collapsed?: boolean;
  onClose?: () => void;
}

export function NoteGraphSidebar({ currentNote, allNotes, relatedNotes = [], className = '', collapsed = false, onClose }: NoteGraphSidebarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current) return;

    // Find directly connected notes: those sharing at least one tag with currentNote
    const connectedNotes = allNotes.filter((n) =>
      n.slug !== currentNote.slug &&
      n.tags.some((t) => currentNote.tags.includes(t))
    );

    if (connectedNotes.length === 0) return;

    // Build subgraph: current note + connected notes
    const subgraphNotes = [currentNote, ...connectedNotes];

    // Build tag→notes map within the subgraph
    const tagNotes = new Map<string, string[]>();
    subgraphNotes.forEach((n) => {
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

    // Count connections per note for sizing
    const connCount = new Map<string, number>();
    for (const [, slugs] of tagNotes) {
      slugs.forEach((s) => connCount.set(s, (connCount.get(s) ?? 0) + 1));
    }

    const nodes: SidebarNode[] = subgraphNotes.map((n) => ({
      id: n.slug,
      label: n.title,
      isCurrent: n.slug === currentNote.slug,
      connectionCount: connCount.get(n.slug) ?? 0,
    }));
    const links: SidebarLink[] = Array.from(linkMap.values()).map((l) => ({
      source: l.source,
      target: l.target,
      strength: l.strength,
    }));

    const svg = d3Select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 320;

    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g');

    // Links
    const link = g.append('g')
      .selectAll<SVGLineElement, SidebarLink>('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', 'var(--border-soft)')
      .attr('stroke-width', (d) => Math.min(d.strength * 1.5, 3))
      .attr('opacity', 0.35);

    // Nodes
    const nodeGroup = g.append('g')
      .selectAll<SVGGElement, SidebarNode>('g')
      .data(nodes)
      .enter().append('g')
      .attr('cursor', 'pointer')
      .on('click', (_event, d) => {
        if (d.id !== currentNote.slug) navigate(`/note/${d.id}`);
      });

    // Outer glow for current node
    nodeGroup.append('circle')
      .attr('r', (d) => d.isCurrent ? 16 : 0)
      .attr('fill', 'none')
      .attr('stroke', 'var(--nebula-accent)')
      .attr('stroke-width', 1)
      .attr('opacity', 0.3);

    nodeGroup.append('circle')
      .attr('r', (d) => d.isCurrent ? 11 : (5 + Math.min(d.connectionCount, 4)))
      .attr('fill', (d) => d.isCurrent ? 'var(--nebula-accent)' : 'color-mix(in srgb, var(--text-muted) 60%, transparent)')
      .attr('stroke', (d) => d.isCurrent ? 'var(--surface-strong)' : 'none')
      .attr('stroke-width', (d) => d.isCurrent ? 2.5 : 0)
      .attr('opacity', (d) => d.isCurrent ? 1 : 0.55);

    // Label only for current note (tooltip-like); others get short labels
    nodeGroup.append('text')
      .text((d) => d.isCurrent ? '当前笔记' : (d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label))
      .attr('dx', (d) => d.isCurrent ? 16 : 10)
      .attr('dy', 4)
      .attr('fill', 'var(--text-muted)')
      .attr('font-size', (d) => d.isCurrent ? '12px' : '10px')
      .attr('font-weight', (d) => d.isCurrent ? '600' : '400')
      .attr('font-family', 'var(--ui-font)');

    // Simulation
    const sim = forceSimulation(nodes)
      .force('link', forceLink<SidebarNode, SidebarLink>(links).id((d) => d.id).distance(70))
      .force('charge', forceManyBody().strength(-120))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collide', forceCollide(20))
      .alpha(0.6)
      .on('tick', () => {
        link
          .attr('x1', (d) => (d.source as SidebarNode).x!)
          .attr('y1', (d) => (d.source as SidebarNode).y!)
          .attr('x2', (d) => (d.target as SidebarNode).x!)
          .attr('y2', (d) => (d.target as SidebarNode).y!);
        nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

    return () => { sim.stop(); };
  }, [currentNote, allNotes, collapsed]);

  const connectedCount = allNotes.filter((n) =>
    n.slug !== currentNote.slug &&
    n.tags.some((t) => currentNote.tags.includes(t))
  ).length;

  const hasGraph = connectedCount > 0;
  if (!hasGraph && relatedNotes.length === 0) return null;

  if (collapsed) return null;

  return (
    <div className={`note-graph-sidebar ${className}`}>
      <div className="note-graph-sidebar-inner">
        {hasGraph && (
          <>
            <div className="note-graph-sidebar-header">
              <span className="note-graph-sidebar-title">关联图谱</span>
              <span className="note-graph-sidebar-count">{connectedCount}</span>
            </div>
            <p className="note-graph-sidebar-desc">共享标签的知识连接</p>
            <svg ref={svgRef} className="note-graph-sidebar-svg" />
          </>
        )}

        {relatedNotes.length > 0 && (
          <div className="sidebar-related">
            <div className="sidebar-related-header">
              <span className="note-graph-sidebar-title">推荐阅读</span>
            </div>
            <ul className="sidebar-related-list">
              {relatedNotes.map((r) => (
                <li key={r.slug}>
                  <a
                    href={`/note/${r.slug}`}
                    onClick={(e) => { e.preventDefault(); navigate(`/note/${r.slug}`); }}
                    className="sidebar-related-link"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12"><path d="M7 7h6a4 4 0 0 1 0 8H7m0-8 3-3M7 7l3 3"/></svg>
                    <span>{r.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
