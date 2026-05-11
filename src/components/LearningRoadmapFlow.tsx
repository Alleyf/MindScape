import { useMemo } from 'react';
import {
  Background,
  Controls,
  Handle,
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

  const groupedItems = flowItems.reduce<Array<{ type: string; items: typeof flowItems }>>((groups, item) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.type === item.type) {
      lastGroup.items.push(item);
    } else {
      groups.push({ type: item.type || '阶段', items: [item] });
    }
    return groups;
  }, []);

  const rowGap = 138;
  const columnGap = 330;
  const centerY = 245;
  const nodes: Node<RoadmapNodeData>[] = groupedItems.flatMap((group, groupIndex) => {
    const columnHeight = (group.items.length - 1) * rowGap;
    const startY = Math.max(30, centerY - columnHeight / 2);

    return group.items.map((item, itemIndex) => ({
      id: `${route.id}-${groupIndex}-${itemIndex}`,
      type: 'roadmapCard',
      position: {
        x: groupIndex * columnGap,
        y: startY + itemIndex * rowGap,
      },
      data: {
        label: item.label,
        subtitle: groupIndex === 0 && itemIndex === 0 ? '从这里开始' : item.subtitle,
        type: item.type,
        url: item.url,
        accent: route.accent,
        level: groupIndex + 1,
      },
      draggable: true,
    }));
  });

  const edges: Edge[] = groupedItems.slice(0, -1).flatMap((group, groupIndex) => {
    const nextGroup = groupedItems[groupIndex + 1];
    return group.items.flatMap((_, sourceIndex) =>
      nextGroup.items.map((__, targetIndex) => ({
        id: `${route.id}-edge-${groupIndex}-${sourceIndex}-${targetIndex}`,
        source: `${route.id}-${groupIndex}-${sourceIndex}`,
        target: `${route.id}-${groupIndex + 1}-${targetIndex}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: route.accent, strokeWidth: 1.8 },
      }))
    );
  });

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
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
