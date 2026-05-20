import json
from pathlib import Path

analysis = json.loads(Path('graphify-out/.graphify_analysis.json').read_text())
for cid, members in analysis['communities'].items():
    print(f"\nCommunity {cid} ({len(members)} nodes):")
    for n in members[:15]:
        print(f"  - {n}")
    if len(members) > 15:
        print(f"  ... and {len(members)-15} more")
