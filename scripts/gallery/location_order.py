"""Apply owner-authorized geographic grouping without changing IDs or photo eligibility."""
def apply_location_groups(photos, locations):
    assignments={entry['id']:entry for entry in locations['photos']}
    groups={entry['id']:entry for entry in locations['groups']}
    if len(assignments)!=len(locations['photos']) or set(assignments)!={p['id'] for p in photos}:
        raise ValueError('Location assignments must match each eligible photo exactly once')
    for photo in photos:
        entry=assignments[photo['id']]
        if entry['groupId'] not in groups:raise ValueError('Unknown location group')
    ordered=sorted(photos,key=lambda p:(groups[assignments[p['id']]['groupId']]['order'],p['photoId'][:10],p['sourceFilename'].casefold(),p['sourceFilename']))
    return [{**p,'locationGroup':assignments[p['id']]['groupId']} for p in ordered]
