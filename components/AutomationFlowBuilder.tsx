import React, { useCallback, useEffect, useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    type Node,
    type Edge,
    type Connection,
    type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Mail, Clock, GitBranch, Tag, List, Flag, Zap } from 'lucide-react';
import type {
    AutomationNode,
    AutomationNodeType,
    SendEmailNode,
    WaitNode,
    ConditionNode,
    UpdateTagNode,
    MoveToListNode,
    AutomationTrigger,
} from '../types';

// ─── Node colours and icons ──────────────────────────────────────────────────
const NODE_CONFIG: Record<string, { color: string; bg: string; border: string; label: string; Icon: React.ElementType }> = {
    trigger: { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', label: 'Trigger', Icon: Zap },
    send_email: { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', label: 'Enviar Email', Icon: Mail },
    wait: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', label: 'Esperar', Icon: Clock },
    condition: { color: '#059669', bg: '#f0fdf4', border: '#a7f3d0', label: 'Condición', Icon: GitBranch },
    update_tag: { color: '#db2777', bg: '#fdf2f8', border: '#fbcfe8', label: 'Tag', Icon: Tag },
    move_to_list: { color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', label: 'Mover a Lista', Icon: List },
    end: { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb', label: 'Fin', Icon: Flag },
};

// ─── Custom node renderers ───────────────────────────────────────────────────
const FlowNode: React.FC<NodeProps> = ({ data, type }) => {
    const cfg = NODE_CONFIG[type || 'end'] || NODE_CONFIG.end;
    const { Icon } = cfg;
    const isCondition = type === 'condition';
    const isTrigger = type === 'trigger';

    return (
        <div style={{
            background: cfg.bg,
            border: `2px solid ${cfg.border}`,
            borderRadius: 16,
            minWidth: 200,
            maxWidth: 240,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            fontFamily: 'Inter, system-ui, sans-serif',
        }}>
            {/* Input handle — all except trigger */}
            {!isTrigger && (
                <Handle type="target" position={Position.Top}
                    style={{ background: cfg.color, width: 10, height: 10, border: '2px solid white' }} />
            )}

            <div style={{ padding: '12px 14px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8, background: cfg.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <Icon size={14} color="white" />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {cfg.label}
                    </span>
                </div>

                {/* Body */}
                <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600, lineHeight: 1.4 }}>
                    {(data as any).label as string}
                </div>
                {(data as any).sublabel && (
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 1.3 }}>
                        {(data as any).sublabel as string}
                    </div>
                )}
            </div>

            {/* Output handles */}
            {isCondition ? (
                <>
                    {/* YES branch — left */}
                    <Handle type="source" position={Position.Bottom} id="yes"
                        style={{ background: '#10b981', width: 10, height: 10, border: '2px solid white', left: '33%' }}>
                    </Handle>
                    {/* NO branch — right */}
                    <Handle type="source" position={Position.Bottom} id="no"
                        style={{ background: '#ef4444', width: 10, height: 10, border: '2px solid white', left: '67%' }}>
                    </Handle>
                    {/* Labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 12px 8px', fontSize: 10, fontWeight: 700 }}>
                        <span style={{ color: '#10b981' }}>✓ SÍ</span>
                        <span style={{ color: '#ef4444' }}>✗ NO</span>
                    </div>
                </>
            ) : type !== 'end' ? (
                <Handle type="source" position={Position.Bottom}
                    style={{ background: cfg.color, width: 10, height: 10, border: '2px solid white' }} />
            ) : null}
        </div>
    );
};

const nodeTypes = {
    trigger: FlowNode,
    send_email: FlowNode,
    wait: FlowNode,
    condition: FlowNode,
    update_tag: FlowNode,
    move_to_list: FlowNode,
    end: FlowNode,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function triggerLabel(trigger: AutomationTrigger): string {
    const map: Record<string, string> = {
        manual: 'Disparo Manual',
        contact_added_to_list: 'Contacto añadido a lista',
        tag_added: 'Tag añadido',
        campaign_sent: 'Campaña enviada',
        campaign_opened: 'Campaña abierta',
        campaign_clicked: 'Clic en campaña',
        no_activity: `Sin actividad`,
        scheduled_date: 'Fecha programada',
    };
    return map[trigger.type] || trigger.type;
}

function nodeToFlowNode(
    node: AutomationNode,
    positions: Record<string, { x: number; y: number }>,
    index: number,
): Node {
    const x = positions[node.id]?.x ?? 260;
    const y = positions[node.id]?.y ?? 120 + index * 140;

    let label = '';
    let sublabel = '';
    if (node.type === 'send_email') {
        label = (node as SendEmailNode).subject || 'Email sin asunto';
        sublabel = (node as SendEmailNode).fromName ? `De: ${(node as SendEmailNode).fromName}` : '';
    } else if (node.type === 'wait') {
        const w = node as WaitNode;
        label = `Esperar ${w.amount} ${w.unit}`;
    } else if (node.type === 'condition') {
        const c = node as ConditionNode;
        label = c.check.replace('_', ' ');
        sublabel = c.value ? `Valor: ${c.value}` : '';
    } else if (node.type === 'update_tag') {
        const t = node as UpdateTagNode;
        label = `${t.action === 'add' ? '+ Agregar' : '− Quitar'} tag`;
        sublabel = `"${t.tag}"`;
    } else if (node.type === 'move_to_list') {
        label = 'Mover a lista';
        sublabel = (node as MoveToListNode).listId;
    } else if (node.type === 'end') {
        label = 'Fin del flujo';
    }

    return { id: node.id, type: node.type, position: { x, y }, data: { label, sublabel, nodeData: node } };
}

function buildEdges(nodes: AutomationNode[]): Edge[] {
    const edges: Edge[] = [];
    nodes.forEach((node, i) => {
        if (node.type === 'condition') {
            const c = node as ConditionNode;
            if (c.branchTrue[0]) {
                edges.push({
                    id: `${node.id}-yes`, source: node.id, target: c.branchTrue[0].id, sourceHandle: 'yes',
                    label: 'Sí', style: { stroke: '#10b981', strokeWidth: 2 },
                    labelStyle: { fill: '#10b981', fontWeight: 700, fontSize: 11 }
                });
            }
            if (c.branchFalse[0]) {
                edges.push({
                    id: `${node.id}-no`, source: node.id, target: c.branchFalse[0].id, sourceHandle: 'no',
                    label: 'No', style: { stroke: '#ef4444', strokeWidth: 2 },
                    labelStyle: { fill: '#ef4444', fontWeight: 700, fontSize: 11 }
                });
            }
        } else if (i < nodes.length - 1) {
            edges.push({
                id: `e${node.id}-${nodes[i + 1].id}`,
                source: node.id, target: nodes[i + 1].id,
                style: { stroke: '#94a3b8', strokeWidth: 2 },
                animated: true,
            });
        }
    });
    return edges;
}

// ─── Main component ───────────────────────────────────────────────────────────
interface AutomationFlowBuilderProps {
    trigger: AutomationTrigger;
    nodes: AutomationNode[];
    nodePositions: Record<string, { x: number; y: number }>;
    onNodesChange?: (nodes: AutomationNode[]) => void;
    onPositionsChange: (positions: Record<string, { x: number; y: number }>) => void;
    readOnly?: boolean;
    height?: number;
}

export const AutomationFlowBuilder: React.FC<AutomationFlowBuilderProps> = ({
    trigger,
    nodes,
    nodePositions,
    onPositionsChange,
    readOnly = false,
    height = 540,
}) => {
    // Build initial React Flow nodes + edges from our AutomationNode[]
    const initialRFNodes = useMemo(() => {
        const triggerNode: Node = {
            id: '__trigger__',
            type: 'trigger',
            position: nodePositions['__trigger__'] ?? { x: 260, y: 20 },
            data: { label: triggerLabel(trigger), sublabel: '' },
            draggable: !readOnly,
        };
        const nodeList = nodes.map((n, i) => ({
            ...nodeToFlowNode(n, nodePositions, i),
            draggable: !readOnly,
        }));
        return [triggerNode, ...nodeList];
    }, [trigger, nodes, nodePositions, readOnly]);

    const initialRFEdges = useMemo(() => {
        const edges: Edge[] = [];
        // Connect trigger → first node
        if (nodes[0]) {
            edges.push({
                id: 'trigger-first',
                source: '__trigger__', target: nodes[0].id,
                style: { stroke: '#7c3aed', strokeWidth: 2 },
                animated: true,
            });
        }
        return [...edges, ...buildEdges(nodes)];
    }, [nodes]);

    const [rfNodes, setRFNodes, onRFNodesChange] = useNodesState(initialRFNodes);
    const [rfEdges, setRFEdges, onRFEdgesChange] = useEdgesState(initialRFEdges);

    // Sync when parent nodes change (e.g. node added)
    useEffect(() => {
        const triggerNode: Node = {
            id: '__trigger__',
            type: 'trigger',
            position: nodePositions['__trigger__'] ?? { x: 260, y: 20 },
            data: { label: triggerLabel(trigger), sublabel: '' },
            draggable: !readOnly,
        };
        const nodeList = nodes.map((n, i) => ({
            ...nodeToFlowNode(n, nodePositions, i),
            draggable: !readOnly,
        }));
        setRFNodes([triggerNode, ...nodeList]);

        const edges: Edge[] = [];
        if (nodes[0]) {
            edges.push({
                id: 'trigger-first', source: '__trigger__', target: nodes[0].id,
                style: { stroke: '#7c3aed', strokeWidth: 2 }, animated: true
            });
        }
        setRFEdges([...edges, ...buildEdges(nodes)]);
    }, [nodes, trigger, nodePositions, readOnly]);

    // On node drag stop → persist positions
    const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
        if (readOnly) return;
        onPositionsChange({ ...nodePositions, [node.id]: node.position });
    }, [nodePositions, onPositionsChange, readOnly]);

    const onConnect = useCallback((params: Connection) => {
        if (readOnly) return;
        setRFEdges(eds => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds));
    }, [readOnly]);

    return (
        <div style={{ width: '100%', height, borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fafafa' }}>
            <ReactFlow
                nodes={rfNodes}
                edges={rfEdges}
                onNodesChange={onRFNodesChange}
                onEdgesChange={onRFEdgesChange}
                onConnect={onConnect}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                minZoom={0.3}
                maxZoom={1.5}
                deleteKeyCode={null}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#e2e8f0" gap={20} size={1} />
                <Controls showInteractive={false} style={{ borderRadius: 12 }} />
                {!readOnly && (
                    <MiniMap
                        nodeColor={(n) => NODE_CONFIG[n.type || 'end']?.color || '#94a3b8'}
                        maskColor="rgba(241,245,249,0.85)"
                        style={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                    />
                )}
            </ReactFlow>
        </div>
    );
};
