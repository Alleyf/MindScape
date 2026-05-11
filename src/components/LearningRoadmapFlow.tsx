import { useMemo } from 'react';
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface RoadmapResource {
  type: string;
  title: string;
  url: string;
}

export interface LearningRoute {
  id: string;
  title: string;
  summary: string;
  accent: string;
  resources: RoadmapResource[];
  steps: string[];
}

interface RoadmapNodeData extends Record<string, unknown> {
  label: string;
  subtitle: string;
  accent: string;
  level: number;
  type?: string;
  url?: string;
}

interface LearningRoadmapFlowProps {
  route: LearningRoute;
}

function RoadmapCardNode({ data }: NodeProps<Node<RoadmapNodeData>>) {
  const card = (
    <div className="flow-card" style={{ '--node-accent': data.accent } as React.CSSProperties}>
      <Handle type="target" position={Position.Left} />
      <div className="flow-card-top">
        <span>{data.level}</span>
        <strong>{data.label}</strong>
      </div>
      {data.type && <small>{data.type}</small>}
      <p>{data.subtitle}</p>
      <Handle type="source" position={Position.Right} />
    </div>
  );

  if (!data.url) return card;

  return (
    <a href={data.url} target={data.url.startsWith('/') ? undefined : '_blank'} rel={data.url.startsWith('/') ? undefined : 'noreferrer'} className="flow-card-link">
      {card}
    </a>
  );
}

const nodeTypes = {
  roadmapCard: RoadmapCardNode,
};

function buildFlow(route: LearningRoute): { nodes: Node<RoadmapNodeData>[]; edges: Edge[] } {
  const flowItems = route.resources.length > 0
    ? route.resources.map((resource) => ({
        label: resource.title,
        subtitle: resource.url.replace(/^https?:\/\//, ''),
        type: resource.type,
        url: resource.url,
      }))
    : route.steps.map((step) => ({
        label: step,
        subtitle: '完成后进入下一站',
        type: '阶段',
        url: '',
      }));

  const nodes = flowItems.map((item, index) => {
    const rowOffset = index % 2 === 0 ? 0 : 92;
    const y = index === 0 || index === flowItems.length - 1 ? 120 : rowOffset + 70;

    return {
      id: `${route.id}-${index}`,
      type: 'roadmapCard',
      position: { x: index * 235, y },
      data: {
        label: item.label,
        subtitle: index === 0 ? '从这里开始' : item.subtitle,
        type: item.type,
        url: item.url,
        accent: route.accent,
        level: index + 1,
      },
      draggable: true,
    };
  });

  const edges = flowItems.slice(0, -1).map((_, index) => ({
    id: `${route.id}-edge-${index}`,
    source: `${route.id}-${index}`,
    target: `${route.id}-${index + 1}`,
    type: 'smoothstep',
    animated: true,
    style: { stroke: route.accent, strokeWidth: 2 },
  }));

  return { nodes, edges };
}

export function LearningRoadmapFlow({ route }: LearningRoadmapFlowProps) {
  const { nodes, edges } = useMemo(() => buildFlow(route), [route]);

  return (
    <ReactFlowProvider>
      <div className="roadmap-flow-canvas">
        <ReactFlow
          key={route.id}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.45}
          maxZoom={1.5}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          colorMode="light"
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={18} size={1} color="var(--flow-dot)" />
          <MiniMap
            pannable
            zoomable
            position="bottom-right"
            nodeColor={() => route.accent}
            nodeStrokeColor={() => route.accent}
            nodeBorderRadius={6}
            maskColor="rgba(250, 249, 245, 0.62)"
            bgColor="var(--surface-strong)"
            className="roadmap-minimap"
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
