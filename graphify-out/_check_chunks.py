import json
from pathlib import Path

c1 = json.loads(Path('graphify-out/.graphify_chunk_01.json').read_text())
c2 = json.loads(Path('graphify-out/.graphify_chunk_02.json').read_text())
print(f"Chunk 1: {len(c1['nodes'])} nodes, {len(c1['edges'])} edges, {len(c1.get('hyperedges',[]))} hyperedges")
print(f"Chunk 2: {len(c2['nodes'])} nodes, {len(c2['edges'])} edges, {len(c2.get('hyperedges',[]))} hyperedges")
