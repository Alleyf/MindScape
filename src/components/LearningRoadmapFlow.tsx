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
}

interface LearningRoadmapFlowProps {
  route: LearningRoute;
}

function RoadmapCardNode({ data }: NodeProps<Node<RoadmapNodeData>>) {
  return (
    <div className="flow-card" style={{ '--node-accent': data.accent } as React.CSSProperties}>
      <Handle type="target" position={Position.Left} />
      <div className="flow-card-top">
        <span>{data.level}</span>
        <strong>{data.label}</strong>
      </div>
      <p>{data.subtitle}</p>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = {
  roadmapCard: RoadmapCardNode,
};

function buildFlow(route: LearningRoute): { nodes: Node<RoadmapNodeData>[]; edges: Edge[] } {
  const nodes = route.steps.map((step, index) => {
    const rowOffset = index % 2 === 0 ? 0 : 92;
    const y = index === 0 || index === route.steps.length - 1 ? 120 : rowOffset + 70;

    return {
      id: `${route.id}-${index}`,
      type: 'roadmapCard',
      position: { x: index * 250, y },
      data: {
        label: step,
        subtitle: index === 0 ? '从这里开始' : index === route.steps.length - 1 ? '形成稳定能力' : '完成后进入下一站',
        accent: route.accent,
        level: index + 1,
      },
      draggable: true,
    };
  });

  const edges = route.steps.slice(0, -1).map((_, index) => ({
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
        >
          <Background gap={18} size={1} color="var(--flow-dot)" />
          <MiniMap
            pannable
            zoomable
            nodeColor={() => route.accent}
            maskColor="rgba(20, 20, 19, 0.08)"
          />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

